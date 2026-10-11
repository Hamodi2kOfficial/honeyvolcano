"use client";

import { ArrowRight, Check, Clock } from "lucide-react";

import type { Workspace } from "@/lib/admin-store";
import { SECTION_META, sectionTitle } from "@/lib/home-model";
import { Badge, Card, Stat } from "@/components/admin/ui";

/** What the owner can do here today, and what still needs building. */
const ROADMAP: { label: string; live: boolean }[] = [
  { label: "Build the home page from sections", live: true },
  { label: "Pictures, cards, quotes, reviews, buttons", live: true },
  { label: "Gallery slideshow & picture library", live: true },
  { label: "Products, prices & contact details", live: true },
  { label: "Backup and export the whole site", live: true },
  { label: "One-click publishing to the live site", live: false },
  { label: "Translating new sections into all six languages", live: false },
  { label: "Online orders, stock & customers", live: false },
];

export function OverviewSection({
  workspace,
  go,
}: {
  workspace: Workspace;
  go: (section: "home" | "gallery" | "products" | "content" | "publish") => void;
}) {
  const sections = workspace.home.sections;
  const visible = sections.filter((s) => s.visible);
  const custom = sections.filter((s) => s.kind !== "builtin");

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Home page"
          value={`${visible.length} section${visible.length === 1 ? "" : "s"}`}
          sub={`${sections.length - visible.length} hidden · ${custom.length} you built`}
        />
        <Stat
          label="Gallery"
          value={String(workspace.gallery.slides.length)}
          sub="pictures in the slideshow"
        />
        <Stat
          label="Picture library"
          value={String(workspace.media.length)}
          sub="photos ready to use"
        />
        <Stat
          label="Products"
          value={String(workspace.products.length)}
          sub={`${workspace.products.filter((p) => p.tba).length} priced TBA`}
        />
      </div>

      <Card
        title="Your home page, top to bottom"
        hint="A quick read of the order visitors see. Open the Home page tab to change it."
        action={
          <button
            type="button"
            onClick={() => go("home")}
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            Edit page <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        <ol className="space-y-1.5">
          {sections.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3 text-sm">
              <span className="w-5 shrink-0 text-right text-xs text-foreground-muted">
                {i + 1}
              </span>
              <span
                className={
                  s.visible ? "min-w-0 flex-1 truncate" : "min-w-0 flex-1 truncate text-foreground-muted line-through"
                }
              >
                {sectionTitle(s)}
              </span>
              <Badge tone={s.kind === "builtin" ? "gold" : "neutral"}>
                {SECTION_META[s.kind].label}
              </Badge>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Quick jobs" hint="The things owners do most often.">
          <div className="grid gap-2">
            <Quick onClick={() => go("home")} title="Add a section to the home page" body="Pictures, cards, a quote, reviews, a button band…" />
            <Quick onClick={() => go("gallery")} title="Add new pictures" body="Upload photos and put them in the slideshow." />
            <Quick onClick={() => go("products")} title="Change a price" body="Rename products, set ISK prices, mark one as TBA." />
            <Quick onClick={() => go("publish")} title="Download a backup" body="Keep a copy of everything, or send it to go live." />
          </div>
        </Card>

        <Card title="What works today" hint="Green is ready now. The rest is the next step.">
          <ul className="space-y-2">
            {ROADMAP.map((r) => (
              <li key={r.label} className="flex items-center gap-2.5 text-sm">
                {r.live ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Clock className="h-4 w-4 shrink-0 text-foreground-muted" />
                )}
                <span className={r.live ? "" : "text-foreground-muted"}>{r.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Quick({
  onClick,
  title,
  body,
}: {
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-accent/60"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm">{title}</span>
        <span className="block text-xs text-foreground-muted">{body}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted" />
    </button>
  );
}
