"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  CloudUpload,
  ExternalLink,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Package,
  Phone,
  Save,
  UploadCloud,
} from "lucide-react";

import {
  checkLogin,
  clearPassword,
  endSession,
  fingerprint,
  freshWorkspace,
  getPassword,
  getPublishedMark,
  hasSession,
  loadWorkspace,
  publishableBundle,
  resetWorkspace,
  saveWorkspace,
  setPassword,
  setPublishedMark,
  startSession,
  workspaceFromPublished,
  type Workspace,
} from "@/lib/admin-store";
import {
  collectInlinePictures,
  fetchPublished,
  getApiStatus,
  publishContent,
  replaceInlinePictures,
  uploadPicture,
  verifyPassword,
  type ApiStatus,
} from "@/lib/live-api";
import type { Img } from "@/lib/home-model";
import { AdminLogin } from "@/components/admin/login";
import { AdminSessionProvider } from "@/components/admin/session";
import { OverviewSection } from "@/components/admin/section-overview";
import { HomeEditor } from "@/components/admin/home-editor";
import { GalleryEditor } from "@/components/admin/gallery-editor";
import { PublishSection } from "@/components/admin/publish";
import { ContentSection, ProductsSection } from "@/components/admin/sections-content";
import { Badge, GhostButton, GoldButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "home", label: "Home page", icon: Home },
  { id: "gallery", label: "Pictures", icon: Images },
  { id: "products", label: "Products", icon: Package },
  { id: "content", label: "Contact", icon: Phone },
  { id: "publish", label: "Publishing", icon: UploadCloud },
] as const;
type SectionId = (typeof NAV)[number]["id"];

export default function AdminPage() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [status, setStatus] = useState<ApiStatus>({ kind: "offline" });
  const [section, setSection] = useState<SectionId>("overview");
  const [ws, setWs] = useState<Workspace | null>(null);
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(true);
  const [publishedMark, setMark] = useState("");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const live = status.kind === "live";

  const toastTimer = useRef<number | undefined>(undefined);
  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 5000);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Find out what this site can do, then resume any sign-in. Both happen after
  // mount so the server-rendered markup and the first client render match.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const apiStatus = await getApiStatus();
      if (cancelled) return;
      setStatus(apiStatus);
      setMark(getPublishedMark());

      if (!hasSession()) {
        setPhase("login");
        return;
      }
      const local = loadWorkspace();
      setWs(local);
      setPhase("ready");

      if (apiStatus.kind === "live") {
        // Compare against what the site is really serving, so the dashboard is
        // right even when the last publish happened on another device.
        const published = await fetchPublished();
        if (cancelled) return;
        setPublishedAt(published.updatedAt);
        if (published.content) {
          const mark = fingerprint(
            workspaceFromPublished(published.content as Partial<Workspace>)
          );
          setPublishedMark(mark);
          setMark(mark);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Every edit goes through here: state first, then straight to storage. */
  const update = useCallback(
    (next: Workspace) => {
      setWs(next);
      const ok = saveWorkspace(next);
      setSaved(ok);
      if (!ok) {
        flash(
          "This browser is full — publish your changes, or download a backup from the Publishing tab."
        );
      }
    },
    [flash]
  );

  const signIn = async (user: string, password: string) => {
    if (live) {
      await verifyPassword(password);
      setPassword(password);
      startSession();
      // Start from what the website is actually serving, so the dashboard and
      // the live site always agree.
      const published = await fetchPublished();
      const next = published.content
        ? workspaceFromPublished(published.content as Partial<Workspace>)
        : loadWorkspace();
      setWs(next);
      setPublishedAt(published.updatedAt);
      if (published.content) {
        const mark = fingerprint(next);
        setPublishedMark(mark);
        setMark(mark);
      }
      saveWorkspace(next);
    } else {
      if (!checkLogin(user, password)) throw new Error("Wrong username or password.");
      startSession();
      setWs(loadWorkspace());
    }
    setSection("overview");
    setPhase("ready");
  };

  const signOut = () => {
    endSession();
    clearPassword();
    setWs(null);
    setPhase("login");
  };

  const publish = async () => {
    if (!ws || publishing) return;
    setPublishing(true);
    try {
      const password = getPassword();
      let current = ws;

      // Pictures added while the dashboard was offline are still held inside
      // the content; upload them once so the published file stays small.
      const inline = collectInlinePictures(publishableBundle(current));
      if (inline.length) {
        flash(`Uploading ${inline.length} picture${inline.length === 1 ? "" : "s"}…`);
        const replacements = new Map<string, string>();
        for (const dataUrl of inline) {
          replacements.set(dataUrl, await uploadPicture(password, dataUrl));
        }
        current = replaceInlinePictures(current, replacements);
        update(current);
      }

      const updatedAt = await publishContent(password, publishableBundle(current));
      const mark = fingerprint(current);
      setPublishedMark(mark);
      setMark(mark);
      setPublishedAt(updatedAt);
      flash("Published — your website is updated.");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not publish.");
    } finally {
      setPublishing(false);
    }
  };

  /** Throws away local edits and loads exactly what the site is serving. */
  const reloadFromLive = async () => {
    const published = await fetchPublished();
    const next = published.content
      ? workspaceFromPublished(published.content as Partial<Workspace>)
      : freshWorkspace();
    update(next);
    const mark = fingerprint(next);
    setPublishedMark(mark);
    setMark(mark);
    setPublishedAt(published.updatedAt);
    flash("Loaded the version that is live now.");
  };

  const storePicture = useCallback(
    async (dataUrl: string) => {
      if (!live) return dataUrl;
      return uploadPicture(getPassword(), dataUrl);
    },
    [live]
  );

  // Comparing the whole workspace is cheap enough, but not on every keystroke.
  const unpublished = useMemo(
    () => (live && ws ? fingerprint(ws) !== publishedMark : false),
    [live, ws, publishedMark]
  );

  const addMedia = (img: Img) => {
    if (!ws || ws.media.some((m) => m.src === img.src)) return;
    update({ ...ws, media: [img, ...ws.media] });
  };
  const removeMedia = (src: string) => {
    if (!ws) return;
    update({ ...ws, media: ws.media.filter((m) => m.src !== src) });
  };

  if (phase === "checking") {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-background text-foreground">
        <p className="text-sm text-foreground-muted">Loading…</p>
      </main>
    );
  }

  if (phase === "login" || !ws) {
    return <AdminLogin status={status} onSignIn={signIn} />;
  }

  return (
    <AdminSessionProvider value={{ mode: live ? "live" : "local", storePicture }}>
      <main className="min-h-[100svh] bg-background text-foreground">
        <header className="sticky top-0 z-20 border-b border-border bg-bg-soft/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-display text-sm tracking-[0.2em] text-accent">
                  HONEY VOLCANO
                </p>
                <p className="text-xs text-foreground-muted">Website manager</p>
              </div>
              {!live && <Badge tone="warn">Browser only</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "hidden items-center gap-1.5 text-xs sm:inline-flex",
                  saved ? "text-foreground-muted" : "text-amber-500"
                )}
              >
                <Save className="h-3.5 w-3.5" />
                {saved ? "Saved automatically" : "Could not save — publish or back up"}
              </span>

              {live && (
                <GoldButton onClick={publish} disabled={publishing || !unpublished}>
                  <span className="inline-flex items-center gap-1.5">
                    {unpublished ? (
                      <CloudUpload className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {publishing
                      ? "Publishing…"
                      : unpublished
                        ? "Publish changes"
                        : "Everything is live"}
                  </span>
                </GoldButton>
              )}

              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs transition-colors hover:border-accent/60 hover:text-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View site
              </Link>
              <GhostButton onClick={signOut} className="px-3 py-2 text-xs">
                <LogOut className="h-3.5 w-3.5" /> Log out
              </GhostButton>
            </div>
          </div>

          <nav className="mx-auto max-w-6xl overflow-x-auto px-5 pb-2">
            <ul className="flex gap-1">
              {NAV.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setSection(id)}
                    className={cn(
                      "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                      section === id
                        ? "bg-accent/15 text-accent"
                        : "text-foreground-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 px-5 py-8">
          {live && unpublished && (
            <p className="flex flex-wrap items-center gap-2 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 text-xs leading-relaxed text-foreground-muted">
              <CloudUpload className="h-4 w-4 shrink-0 text-accent" />
              You have changes that visitors cannot see yet. Press{" "}
              <span className="text-accent">Publish changes</span> when you are happy with
              them.
            </p>
          )}

          {section === "overview" && (
            <OverviewSection workspace={ws} go={(id) => setSection(id)} />
          )}

          {section === "home" && (
            <HomeEditor
              home={ws.home}
              setHome={(home) => update({ ...ws, home })}
              media={ws.media}
              addMedia={addMedia}
            />
          )}

          {section === "gallery" && (
            <GalleryEditor
              slides={ws.gallery.slides}
              setSlides={(slides) => update({ ...ws, gallery: { slides } })}
              media={ws.media}
              addMedia={addMedia}
              removeMedia={removeMedia}
            />
          )}

          {section === "products" && (
            <ProductsSection
              products={ws.products}
              setProducts={(products) => update({ ...ws, products })}
            />
          )}

          {section === "content" && (
            <ContentSection site={ws.site} setSite={(site) => update({ ...ws, site })} />
          )}

          {section === "publish" && (
            <PublishSection
              workspace={ws}
              status={status}
              publishedAt={publishedAt}
              unpublished={unpublished}
              publishing={publishing}
              onPublish={publish}
              onReloadFromLive={reloadFromLive}
              onImport={(next) => update({ ...freshWorkspace(), ...next })}
              onReset={() => {
                resetWorkspace();
                update(freshWorkspace());
                flash("Everything reset to the published site.");
              }}
              flash={flash}
            />
          )}
        </div>

        {toast && (
          <div className="fixed bottom-5 left-1/2 z-[60] w-[min(92vw,32rem)] -translate-x-1/2 rounded-xl border border-accent/40 bg-bg-soft px-5 py-3 text-center text-sm text-foreground shadow-lg">
            {toast}
          </div>
        )}
      </main>
    </AdminSessionProvider>
  );
}
