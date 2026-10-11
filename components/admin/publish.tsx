"use client";

import { useRef, useState } from "react";
import { Download, FileJson, FolderDown, RotateCcw, Upload } from "lucide-react";

import {
  contentFiles,
  download,
  uploadedImages,
  workspaceSize,
  type Workspace,
} from "@/lib/admin-store";
import { Card, GhostButton, GoldButton } from "@/components/admin/ui";

/**
 * Where the owner takes their work out of the browser: a backup they can keep,
 * or the exact content files the website reads.
 */
export function PublishSection({
  workspace,
  onImport,
  onReset,
  flash,
}: {
  workspace: Workspace;
  onImport: (ws: Workspace) => void;
  onReset: () => void;
  flash: (msg: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const files = contentFiles(workspace);
  const uploads = uploadedImages(workspace);

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
      <Card title="Your work" hint={`Everything you have arranged is kept in this browser · ${workspaceSize(workspace)} used.`}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Action
            icon={<FolderDown className="h-4 w-4" />}
            title="Download a backup"
            body="One file with the whole site: pages, pictures, products, contact details. Keep it safe — it can be loaded back here any time."
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
        title="Put it on the live site"
        hint="The public website is built from four small files. Download them here and they go live with the next deploy."
      >
        <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground-muted">
          <li>Download the files below (or just the backup above — it holds the same content).</li>
          <li>Send them over, or drop them into the site&rsquo;s <code className="text-accent">content/</code> folder.</li>
          <li>The site rebuilds and your new home page is live.</li>
        </ol>
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
              {uploads.length} picture{uploads.length === 1 ? "" : "s"} uploaded from your device
            </span>{" "}
            {uploads.length === 1 ? "is" : "are"} carried inside these files. That works,
            but it makes them large — for the fastest site, those photos are better saved
            as real image files. Mention it when you send the files over.
          </p>
        )}
      </Card>

      <Card
        title="Start over"
        hint="Throws away everything you changed here and returns the dashboard to the site as it is published today."
      >
        <GhostButton
          onClick={() => {
            if (window.confirm("Discard all your changes and start from the live site?")) {
              onReset();
            }
          }}
        >
          <RotateCcw className="h-4 w-4" /> Reset everything
        </GhostButton>
      </Card>
    </div>
  );
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
