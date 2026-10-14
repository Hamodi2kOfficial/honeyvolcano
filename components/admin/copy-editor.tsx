"use client";

import { Globe, RotateCcw } from "lucide-react";

import { LANGS, type Lang } from "@/components/i18n";
import type { AssetField, ContentGroup, TextField } from "@/lib/site-copy";
import type { Img } from "@/lib/home-model";
import { ImagePicker, TextArea, TextInput } from "@/components/admin/fields";
import { Badge, GhostButton, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/** Everything the copy editors need from the workspace. */
export type CopyState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Overrides by language then key. */
  copy: Record<string, Record<string, string>>;
  setCopy: (next: Record<string, Record<string, string>>) => void;
  assets: Record<string, string>;
  setAssets: (next: Record<string, string>) => void;
  /** What the site ships with, to show as the starting text. */
  original: (lang: Lang, key: string) => string;
  media: Img[];
  addMedia: (img: Img) => void;
};

/** The language bar — which language the words below belong to. */
export function LanguageBar({
  state,
  keys,
}: {
  state: CopyState;
  /** Keys in view, so the bar can mark languages that still read differently. */
  keys: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
      <Globe className="h-4 w-4 shrink-0 text-accent" />
      <span className="mr-1 text-xs text-foreground-muted">Writing in</span>
      {LANGS.map((l) => {
        const edited = keys.some((k) => (state.copy[l.code]?.[k] ?? "").trim() !== "");
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => state.setLang(l.code)}
            title={l.name}
            className={cn(
              "min-h-10 min-w-10 rounded-lg border px-2.5 py-1 text-xs transition-colors sm:min-h-0 sm:min-w-0",
              state.lang === l.code
                ? "border-accent/60 bg-accent/15 text-accent"
                : "border-border text-foreground-muted hover:text-foreground"
            )}
          >
            {l.label}
            {edited && <span className="ml-1 text-accent">•</span>}
          </button>
        );
      })}
      <span className="ml-auto text-[11px] text-foreground-muted">
        A dot means you have rewritten something in that language.
      </span>
    </div>
  );
}

/** Text + picture fields for one designed section or page. */
export function CopyFields({
  group,
  state,
}: {
  group: ContentGroup;
  state: CopyState;
}) {
  return (
    <div className="space-y-4">
      {group.text.map((field) => (
        <CopyField key={field.key} field={field} state={state} />
      ))}

      {group.assets.map((field) => (
        <AssetSlot key={field.key} field={field} state={state} />
      ))}
    </div>
  );
}

function CopyField({ field, state }: { field: TextField; state: CopyState }) {
  const original = state.original(state.lang, field.key);
  const override = state.copy[state.lang]?.[field.key];
  const value = override ?? original;
  const changed = override !== undefined && override !== original;

  const set = (next: string) => {
    const forLang = { ...(state.copy[state.lang] ?? {}) };
    if (next === original) delete forLang[field.key];
    else forLang[field.key] = next;
    state.setCopy({ ...state.copy, [state.lang]: forLang });
  };

  const reset = () => {
    const forLang = { ...(state.copy[state.lang] ?? {}) };
    delete forLang[field.key];
    state.setCopy({ ...state.copy, [state.lang]: forLang });
  };

  return (
    <div className="relative">
      {field.lines ? (
        <TextArea label={field.label} value={value} rows={field.lines} onChange={set} />
      ) : (
        <TextInput label={field.label} value={value} onChange={set} hint={field.hint} />
      )}
      {field.lines && field.hint && (
        <p className="mt-1 text-[11px] text-foreground-muted">{field.hint}</p>
      )}
      {changed && (
        <button
          type="button"
          onClick={reset}
          className="absolute right-0 top-0 inline-flex items-center gap-1 text-[11px] text-foreground-muted transition-colors hover:text-accent"
          title="Put the original wording back"
        >
          <RotateCcw className="h-3 w-3" /> original
        </button>
      )}
    </div>
  );
}

function AssetSlot({ field, state }: { field: AssetField; state: CopyState }) {
  const current = state.assets[field.key] ?? field.fallback;
  const changed = Boolean(state.assets[field.key]);

  const setSrc = (src: string) => state.setAssets({ ...state.assets, [field.key]: src });
  const reset = () => {
    const next = { ...state.assets };
    delete next[field.key];
    state.setAssets(next);
  };

  if (field.kind === "video") {
    return (
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-foreground-muted">{field.label}</span>
          <span className="flex items-center gap-2">
            {changed && <Badge tone="gold">changed</Badge>}
            {changed && (
              <button
                type="button"
                onClick={reset}
                className="text-[11px] text-foreground-muted hover:text-accent"
              >
                original
              </button>
            )}
          </span>
        </div>
        <input
          value={current}
          onChange={(e) => setSrc(e.target.value)}
          className={inputClass}
          placeholder="/reliable-source.mp4"
        />
        {field.hint && (
          <p className="mt-1 text-[11px] text-foreground-muted">{field.hint}</p>
        )}
        <video
          key={current}
          src={current}
          className="mt-2 max-h-40 rounded-lg border border-border"
          controls
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div>
      <ImagePicker
        label={field.label}
        value={{ src: current, alt: "" }}
        media={state.media}
        onAddMedia={state.addMedia}
        onChange={(img) => setSrc(img.src)}
      />
      <div className="mt-1 flex items-center gap-2">
        {field.hint && (
          <p className="text-[11px] text-foreground-muted">{field.hint}</p>
        )}
        {changed && (
          <GhostButton className="ml-auto px-2 py-1 text-[11px]" onClick={reset}>
            <RotateCcw className="h-3 w-3" /> Original picture
          </GhostButton>
        )}
      </div>
    </div>
  );
}
