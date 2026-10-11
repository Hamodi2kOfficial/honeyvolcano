"use client";

import { useRef, useState } from "react";
import {
  Check,
  CloudUpload,
  Download,
  FileJson,
  FolderDown,
  RotateCcw,
  Upload,
} from "lucide-react";

import {
  contentFiles,
  download,
  uploadedImages,
  workspaceSize,
  type Workspace,
} from "@/lib/admin-store";
import type { ApiStatus } from "@/lib/live-api";
import { Badge, Card, GhostButton, GoldButton } from "@/components/admin/ui";

/**
 * Publishing: the button that puts the owner's work on the live website, plus
 * backups and the raw content files for anyone who wants them.
 */
export function PublishSection({
  workspace,
  status,
  publishedAt,
  unpublished,
  publishing,
  onPublish,
  onReloadFromLive,
  onImport,
  onReset,
  flash,
}: {
  workspace: Workspace;
  status: ApiStatus;
  publishedAt: string | null;
  unpublished: boolean;
  publishing: boolean;
  onPublish: () => void;
  onReloadFromLive: () => void;
  onImport: (ws: Workspace) => void;
  onReset: () => void;
  flash: (msg: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const files = contentFiles(workspace);
  const uploads = uploadedImages(workspace);
  const live = status.kind === "live";

  const importPack = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const parsed = JSON.parse(await file.text()) as Partial<Workspace>;
      if (!parsed.home || !parsed.site) throw new Error("That file is not a content backup.");
      onImport(parsed as Workspace);
      flash("Backup loaded.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  return (
    <div className="space-y-5">
      {live ? (
        <Card
          title="Your live website"
          hint={
            publishedAt
              ? `Last published ${formatWhen(publishedAt)}.`
              : "Nothing has been published from here yet — the site is showing the version it was built with."
          }
          action={
            <Badge tone={unpublished ? "warn" : "good"}>
              {unpublished ? "Changes not live yet" : "Everything is live"}
            </Badge>
          }
        >
          <p className="text-sm leading-relaxed text-foreground-muted">
            Press publish and your home page, pictures, prices and contact details are
            updated on honeyvolcano.com within a few seconds. Visitors always see the last
            thing you published — nothing you do here shows up before that.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <GoldButton onClick={onPublish} disabled={publishing || !unpublished} className="h-10">
              <span className="inline-flex items-center gap-2">
                {unpublished ? (
                  <CloudUpload className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {publishing
                  ? "Publishing…"
                  : unpublished
                    ? "Publish changes"
                    : "Everything is live"}
              </span>
            </GoldButton>
            <GhostButton
              onClick={() => {
                if (
                  !unpublished ||
                  window.confirm(
                    "Throw away the changes you have not published and load the live version?"
                  )
                ) {
                  onReloadFromLive();
                }
              }}
            >
              <RotateCcw className="h-4 w-4" /> Load the live version
            </GhostButton>
          </div>
        </Card>
      ) : (
        <Card title="Live publishing is not switched on yet" hint="A five-minute job, once.">
          <p className="text-sm leading-relaxed text-foreground-muted">
            Right now this dashboard saves everything in this browser only. To publish
            straight to the website, the site needs one password of its own:
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground-muted">
            <li>
              Open Netlify → the honeyvolcano site → <span className="text-foreground">Site configuration</span> →{" "}
              <span className="text-foreground">Environment variables</span>.
            </li>
            <li>
              Add a variable called{" "}
              <code className="rounded bg-background px-1.5 py-0.5 text-accent">ADMIN_PASSWORD</code>{" "}
              and set it to the password you want to use.
            </li>
            <li>Deploy once more, then sign in here with that password.</li>
          </ol>
          <p className="mt-3 text-xs leading-relaxed text-foreground-muted">
            Until then, everything below still works: keep a backup, and send the content
            files over whenever you want them on the site.
          </p>
        </Card>
      )}

      <Card
        title="Backups"
        hint={`Everything you have arranged · ${workspaceSize(workspace)} in this browser.`}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Action
            icon={<FolderDown className="h-4 w-4" />}
            title="Download a backup"
            body="One file with the whole site: pages, pictures, products, contact details. It can be loaded back here at any time."
            button={
              <GoldButton
                onClick={() => {
                  download(
                    `honeyvolcano-content-${new Date().toISOString().slice(0, 10)}.json`,
                    `${JSON.stringify(workspace, null, 2)}\n`
                  );
                  flash("Backup downloaded.");
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Download
                </span>
              </GoldButton>
            }
          />
          <Action
            icon={<Upload className="h-4 w-4" />}
            title="Load a backup"
            body="Bring back a file you downloaded before, or move your work to another computer or phone."
            button={
              <>
                <GhostButton onClick={() => fileRef.current?.click()}>Choose file</GhostButton>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  hidden
                  onChange={(e) => importPack(e.target.files?.[0])}
                />
              </>
            }
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </Card>

      <Card
        title="The content files"
        hint="The same content as plain files, for the developer or for your records."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {files.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => {
                download(f.name, f.json);
                flash(`${f.name} downloaded.`);
              }}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-accent/60"
            >
              <FileJson className="h-4 w-4 shrink-0 text-accent" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm">{f.name}</span>
                <span className="block text-[11px] text-foreground-muted">
                  {Math.max(1, Math.round(f.json.length / 1024))} KB
                </span>
              </span>
              <Download className="h-3.5 w-3.5 text-foreground-muted" />
            </button>
          ))}
        </div>

        {uploads.length > 0 && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] px-4 py-3 text-xs leading-relaxed text-foreground-muted">
            <span className="font-semibold text-amber-500">
              {uploads.length} picture{uploads.length === 1 ? "" : "s"} uploaded from your
              device
            </span>{" "}
            {uploads.length === 1 ? "is" : "are"} stored inside this browser rather than on
            the website. {live ? "Pictures added from now on are uploaded to the site automatically." : "They travel with the backup file."}
          </p>
        )}
      </Card>

      <Card
        title="Start over"
        hint="Throws away everything in this browser and returns to the site as it was built."
      >
        <GhostButton
          onClick={() => {
            if (window.confirm("Discard all your changes and start again?")) onReset();
          }}
        >
          <RotateCcw className="h-4 w-4" /> Reset everything
        </GhostButton>
      </Card>
    </div>
  );
}

/** "today at 14:05" / "12 Oct 2026 at 14:05" — readable, never a raw timestamp. */
function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "recently";
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sameDay = new Date().toDateString() === date.toDateString();
  return sameDay
    ? `today at ${time}`
    : `${date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })} at ${time}`;
}

function Action({
  icon,
  title,
  body,
  button,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  button: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-foreground-muted">{body}</p>
      <div className="mt-3 flex gap-2">{button}</div>
    </div>
  );
}
