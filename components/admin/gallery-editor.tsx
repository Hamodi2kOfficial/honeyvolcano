"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";

import type { Img } from "@/lib/home-model";
import { uid } from "@/lib/home-model";
import type { GallerySlide } from "@/lib/admin-store";
import { MediaDialog, TextInput, Thumb } from "@/components/admin/fields";
import { Card, GhostButton, GoldButton, IconButton } from "@/components/admin/ui";

/**
 * The gallery page (the full-screen slideshow) and the picture library that
 * feeds every section of the site.
 */
export function GalleryEditor({
  slides,
  setSlides,
  media,
  addMedia,
  removeMedia,
}: {
  slides: GallerySlide[];
  setSlides: (next: GallerySlide[]) => void;
  media: Img[];
  addMedia: (img: Img) => void;
  removeMedia: (src: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[i], next[j]] = [next[j], next[i]];
    setSlides(next);
  };
  const patch = (id: string, p: Partial<GallerySlide>) =>
    setSlides(slides.map((s) => (s.id === id ? { ...s, ...p } : s)));

  return (
    <div className="space-y-5">
      <Card
        title="Gallery slideshow"
        hint="The pictures at honeyvolcano.com/gallery, in order. A phrase is shown in gold above the photo — leave it empty for a plain picture."
        action={
          <GoldButton onClick={() => setAdding(true)}>
            <span className="inline-flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Add pictures
            </span>
          </GoldButton>
        }
      >
        <ol className="space-y-2">
          {slides.map((s, i) => (
            <li key={s.id} className="rounded-xl border border-border bg-background">
              <div className="flex items-center gap-3 p-2.5">
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                  <Thumb src={s.src} />
                </span>
                <button
                  type="button"
                  onClick={() => setOpenId(openId === s.id ? null : s.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm">
                    {s.text || <span className="text-foreground-muted">No phrase</span>}
                  </span>
                  <span className="block truncate text-[11px] text-foreground-muted">
                    {s.alt || "No description"}
                  </span>
                </button>
                <IconButton label="Move up" onClick={() => move(i, -1)}>
                  <ArrowUp className="h-4 w-4" />
                </IconButton>
                <IconButton label="Move down" onClick={() => move(i, 1)}>
                  <ArrowDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Remove from the slideshow"
                  danger
                  onClick={() => setSlides(slides.filter((x) => x.id !== s.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
              {openId === s.id && (
                <div className="space-y-3 border-t border-border/70 p-3">
                  <TextInput
                    label="Gold phrase above the picture (optional)"
                    value={s.text}
                    onChange={(v) => patch(s.id, { text: v })}
                    placeholder="Let happiness erupt"
                  />
                  <TextInput
                    label="Picture description (for search engines)"
                    value={s.alt}
                    onChange={(v) => patch(s.id, { alt: v })}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
        {slides.length === 0 && (
          <p className="py-8 text-center text-sm text-foreground-muted">
            No pictures yet — add the first one.
          </p>
        )}
      </Card>

      <Card
        title="Picture library"
        hint="Every photo you can use across the site. Upload new ones here once and pick them anywhere."
        action={
          <GhostButton onClick={() => setLibraryOpen(true)}>
            <Upload className="h-4 w-4" /> Upload
          </GhostButton>
        }
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {media.map((img, i) => (
            <div
              key={`${img.src.slice(0, 30)}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
              title={img.alt}
            >
              <Thumb src={img.src} />
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/60 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                <IconButton
                  label="Add to the slideshow"
                  onClick={() =>
                    setSlides([
                      ...slides,
                      { id: uid("g"), src: img.src, alt: img.alt, text: "" },
                    ])
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton label="Remove from the library" danger onClick={() => removeMedia(img.src)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {(adding || libraryOpen) && (
        <MediaDialog
          media={media}
          multiple
          onAddMedia={addMedia}
          onPick={(img) => {
            if (adding) {
              setSlides([
                ...slides,
                { id: uid("g"), src: img.src, alt: img.alt, text: "" },
              ]);
            }
          }}
          onClose={() => {
            setAdding(false);
            setLibraryOpen(false);
          }}
        />
      )}
    </div>
  );
}

