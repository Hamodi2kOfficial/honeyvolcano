"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ImagePlus,
  Link2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import type { Img } from "@/lib/home-model";
import { GhostButton, GoldButton, inputClass } from "@/components/admin/ui";
import { useAdminSession } from "@/components/admin/session";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ inputs */

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint && <span className="mt-1 block text-[11px] text-foreground-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "resize-y leading-relaxed")}
      />
    </label>
  );
}

export function Choice<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs transition-colors",
              o.value === value
                ? "border-accent/60 bg-accent/15 text-accent"
                : "border-border text-foreground-muted hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- repeat list */

export function ListEditor<T>({
  label,
  items,
  onChange,
  onAdd,
  addLabel,
  renderItem,
  titleOf,
  max,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  onAdd: () => T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  titleOf: (item: T, index: number) => string;
  max?: number;
}) {
  const [open, setOpen] = useState<number | null>(0);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-foreground-muted">{label}</span>
        <span className="text-[11px] text-foreground-muted">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={(item as { id?: string }).id ?? i}
            className="rounded-xl border border-border bg-background"
          >
            <div className="flex items-center gap-1 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="min-w-0 flex-1 truncate text-left text-sm hover:text-accent"
              >
                {titleOf(item, i) || `Item ${i + 1}`}
              </button>
              <MiniButton label="Move up" onClick={() => move(i, -1)}>
                <ArrowUp className="h-3.5 w-3.5" />
              </MiniButton>
              <MiniButton label="Move down" onClick={() => move(i, 1)}>
                <ArrowDown className="h-3.5 w-3.5" />
              </MiniButton>
              <MiniButton
                label="Duplicate"
                onClick={() => onChange([...items.slice(0, i + 1), { ...item }, ...items.slice(i + 1)])}
              >
                <Copy className="h-3.5 w-3.5" />
              </MiniButton>
              <MiniButton
                label="Remove"
                danger
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </MiniButton>
            </div>
            {open === i && (
              <div className="space-y-3 border-t border-border/70 p-3">
                {renderItem(item, (patch) =>
                  onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {(max === undefined || items.length < max) && (
        <GhostButton
          className="mt-2 text-xs"
          onClick={() => {
            onChange([...items, onAdd()]);
            setOpen(items.length);
          }}
        >
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </GhostButton>
      )}
    </div>
  );
}

function MiniButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-md p-1.5 text-foreground-muted transition-colors",
        danger ? "hover:text-red-400" : "hover:text-accent"
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ images */

/** Shrinks a chosen photo so the browser can hold plenty of them. */
export async function fileToImage(file: File): Promise<Img> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });

  const alt = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return { src: dataUrl, alt };
  }

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new window.Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("That file is not an image."));
    el.src = dataUrl;
  });

  const MAX = 1600;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { src: dataUrl, alt };
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { src: canvas.toDataURL("image/jpeg", 0.82), alt };
}

export function Thumb({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    // Media can be a data: URL from an upload, so a plain img is correct here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
    />
  );
}

/** Picks a picture from the library, a link, or the owner's device. */
export function ImagePicker({
  label,
  value,
  onChange,
  media,
  onAddMedia,
  onRemove,
}: {
  label: string;
  value: Img | null;
  onChange: (img: Img) => void;
  media: Img[];
  onAddMedia: (img: Img) => void;
  onRemove?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
          {value ? (
            <Thumb src={value.src} />
          ) : (
            <span className="grid h-full w-full place-items-center text-foreground-muted">
              <ImagePlus className="h-5 w-5" />
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <GhostButton className="px-3 py-1.5 text-xs" onClick={() => setOpen(true)}>
              {value ? "Change picture" : "Choose picture"}
            </GhostButton>
            {onRemove && value && (
              <GhostButton className="px-3 py-1.5 text-xs" onClick={onRemove}>
                Remove
              </GhostButton>
            )}
          </div>
          {value && (
            <input
              value={value.alt}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              placeholder="Describe the picture (for search engines)"
              className={cn(inputClass, "py-1.5 text-xs")}
            />
          )}
        </div>
      </div>

      {open && (
        <MediaDialog
          media={media}
          onAddMedia={onAddMedia}
          onPick={(img) => {
            onChange(img);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/** The picture browser: library grid + paste a link + upload from device. */
export function MediaDialog({
  media,
  onPick,
  onAddMedia,
  onClose,
  multiple,
}: {
  media: Img[];
  onPick: (img: Img) => void;
  onAddMedia: (img: Img) => void;
  onClose: () => void;
  /** Keep the dialog open after a pick, for adding several photos at once. */
  multiple?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { mode, storePicture } = useAdminSession();

  const take = (img: Img) => {
    onPick(img);
    if (!multiple) onClose();
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    try {
      for (const [i, file] of list.entries()) {
        setBusy(
          list.length > 1
            ? `Adding picture ${i + 1} of ${list.length}…`
            : mode === "live"
              ? "Uploading…"
              : "Adding…"
        );
        const shrunk = await fileToImage(file);
        const src = await storePicture(shrunk.src);
        const img = { ...shrunk, src };
        onAddMedia(img);
        onPick(img);
      }
      if (!multiple) onClose();
    } catch (e) {
      setBusy(e instanceof Error ? e.message : "Could not add that file.");
      return;
    }
    setBusy("");
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-bg-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="font-serif text-lg font-light">Pictures</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-foreground-muted hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
          <GoldButton className="h-9 text-xs" onClick={() => fileRef.current?.click()}>
            <span className="inline-flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload from device
            </span>
          </GoldButton>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
          <div className="flex min-w-[16rem] flex-1 items-center gap-2">
            <Link2 className="h-4 w-4 shrink-0 text-foreground-muted" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="…or paste a picture link (https://…)"
              className={cn(inputClass, "py-1.5 text-xs")}
            />
            <GhostButton
              className="px-3 py-1.5 text-xs"
              onClick={() => {
                const src = url.trim();
                if (!src) return;
                const img = { src, alt: "" };
                onAddMedia(img);
                take(img);
                setUrl("");
              }}
            >
              Add
            </GhostButton>
          </div>
        </div>

        {busy && <p className="px-5 pt-3 text-xs text-accent">{busy}</p>}

        <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-5 sm:grid-cols-4 md:grid-cols-5">
          {media.map((img, i) => (
            <button
              key={`${img.src.slice(0, 40)}-${i}`}
              type="button"
              onClick={() => take(img)}
              title={img.alt}
              className="aspect-square overflow-hidden rounded-lg border border-border transition-colors hover:border-accent"
            >
              <Thumb src={img.src} />
            </button>
          ))}
        </div>

        {multiple && (
          <div className="border-t border-border px-5 py-3 text-right">
            <GoldButton className="h-9 text-xs" onClick={onClose}>
              Done
            </GoldButton>
          </div>
        )}
      </div>
    </div>
  );
}
