"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
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
  endSession,
  freshWorkspace,
  hasSession,
  loadWorkspace,
  resetWorkspace,
  saveWorkspace,
  startSession,
  type Workspace,
} from "@/lib/admin-store";
import type { Img } from "@/lib/home-model";
import { AdminLogin } from "@/components/admin/login";
import { OverviewSection } from "@/components/admin/section-overview";
import { HomeEditor } from "@/components/admin/home-editor";
import { GalleryEditor } from "@/components/admin/gallery-editor";
import { PublishSection } from "@/components/admin/publish";
import { ContentSection, ProductsSection } from "@/components/admin/sections-content";
import { GhostButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "home", label: "Home page", icon: Home },
  { id: "gallery", label: "Pictures", icon: Images },
  { id: "products", label: "Products", icon: Package },
  { id: "content", label: "Contact", icon: Phone },
  { id: "publish", label: "Backup & publish", icon: UploadCloud },
] as const;
type SectionId = (typeof NAV)[number]["id"];

export default function AdminPage() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [section, setSection] = useState<SectionId>("overview");
  const [ws, setWs] = useState<Workspace | null>(null);
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(true);

  const toastTimer = useRef<number | undefined>(undefined);
  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 4000);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Storage is read after mount (never during render), so the server-rendered
  // markup and the first client render always match.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      if (hasSession()) {
        setWs(loadWorkspace());
        setPhase("ready");
      } else {
        setPhase("login");
      }
    });
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
          "This browser is full — download a backup from Backup & publish, then remove a few uploaded pictures."
        );
      }
    },
    [flash]
  );

  const signIn = () => {
    startSession();
    setWs(loadWorkspace());
    setSection("overview");
    setPhase("ready");
  };

  const signOut = () => {
    endSession();
    setWs(null);
    setPhase("login");
  };

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
    return <AdminLogin onSignIn={signIn} />;
  }

  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-bg-soft/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
          <div>
            <p className="font-display text-sm tracking-[0.2em] text-accent">
              HONEY VOLCANO
            </p>
            <p className="text-xs text-foreground-muted">Website manager</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "hidden items-center gap-1.5 text-xs sm:inline-flex",
                saved ? "text-foreground-muted" : "text-amber-500"
              )}
            >
              <Save className="h-3.5 w-3.5" />
              {saved ? "Saved automatically" : "Could not save — download a backup"}
            </span>
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
  );
}
