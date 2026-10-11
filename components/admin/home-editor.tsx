"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Columns2,
  Copy,
  Eye,
  EyeOff,
  Film,
  Flag,
  Hash,
  HardHat,
  Images,
  LayoutGrid,
  Lock,
  MousePointerClick,
  Plus,
  Quote as QuoteIcon,
  Sparkles,
  Star,
  Trash2,
  Type as TypeIcon,
  X,
} from "lucide-react";

import {
  ADDABLE_KINDS,
  BUILTIN_LABEL,
  SECTION_META,
  createSection,
  sectionTitle,
  uid,
  type Btn,
  type HomeContent,
  type Img,
  type Section,
  type SectionKind,
} from "@/lib/home-model";
import { Block } from "@/components/site/blocks";
import {
  Choice,
  ImagePicker,
  ListEditor,
  MediaDialog,
  TextArea,
  TextInput,
  Thumb,
} from "@/components/admin/fields";
import { Badge, Card, GhostButton, GoldButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Type: TypeIcon,
  Columns2,
  Images,
  LayoutGrid,
  Quote: QuoteIcon,
  Star,
  MousePointerClick,
  Hash,
  Flag,
  Film,
};

function KindIcon({ kind, className }: { kind: SectionKind; className?: string }) {
  const Icon = ICONS[SECTION_META[kind].icon] ?? TypeIcon;
  return <Icon className={className} />;
}

export function HomeEditor({
  home,
  setHome,
  media,
  addMedia,
}: {
  home: HomeContent;
  setHome: (next: HomeContent) => void;
  media: Img[];
  addMedia: (img: Img) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [mode, setMode] = useState<"build" | "preview">("build");

  const sections = home.sections;
  const setSections = (next: Section[]) => setHome({ ...home, sections: next });
  const patch = (id: string, p: Partial<Section>) =>
    setSections(
      sections.map((s) => (s.id === id ? ({ ...s, ...p } as Section) : s))
    );
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next);
  };

  const add = (kind: SectionKind) => {
    const section = createSection(kind);
    setSections([...sections, section]);
    setOpenId(section.id);
    setPicking(false);
    setMode("build");
  };

  return (
    <div className="space-y-5">
      <Card
        title="Home page"
        hint="Your page, top to bottom. Add sections, drag them into order with the arrows, hide anything you are not ready to show."
        action={
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {(["build", "preview"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs transition-colors",
                  mode === m
                    ? "bg-accent/15 text-accent"
                    : "text-foreground-muted hover:text-foreground"
                )}
              >
                {m === "build" ? "Build" : "Preview"}
              </button>
            ))}
          </div>
        }
      >
        {mode === "preview" ? (
          <PagePreview sections={sections} />
        ) : (
          <>
            <ol className="space-y-2">
              {sections.map((s, i) => (
                <li key={s.id} className="rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border text-foreground-muted">
                      <KindIcon kind={s.kind} className="h-3.5 w-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === s.id ? null : s.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span
                        className={cn(
                          "block truncate text-sm",
                          !s.visible && "text-foreground-muted line-through"
                        )}
                      >
                        {sectionTitle(s)}
                      </span>
                      <span className="block text-[11px] text-foreground-muted">
                        {SECTION_META[s.kind].label}
                        {s.kind === "builtin" && s.underConstruction && " · under construction"}
                      </span>
                    </button>

                    {s.kind === "builtin" && (
                      <span className="hidden sm:block">
                        <Badge tone="gold">Designed</Badge>
                      </span>
                    )}

                    <RowButton
                      label={s.visible ? "Hide from the page" : "Show on the page"}
                      onClick={() => patch(s.id, { visible: !s.visible })}
                    >
                      {s.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </RowButton>
                    <RowButton label="Move up" onClick={() => move(i, -1)}>
                      <ArrowUp className="h-4 w-4" />
                    </RowButton>
                    <RowButton label="Move down" onClick={() => move(i, 1)}>
                      <ArrowDown className="h-4 w-4" />
                    </RowButton>
                    {s.kind === "builtin" ? (
                      <span
                        title="Built-in sections can be hidden or moved, but not deleted"
                        className="hidden p-1.5 text-foreground-muted/50 sm:block"
                      >
                        <Lock className="h-4 w-4" />
                      </span>
                    ) : (
                      <>
                        <RowButton
                          label="Duplicate"
                          onClick={() => {
                            const copy = { ...s, id: uid() } as Section;
                            setSections([
                              ...sections.slice(0, i + 1),
                              copy,
                              ...sections.slice(i + 1),
                            ]);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </RowButton>
                        <RowButton
                          label="Delete section"
                          danger
                          onClick={() => {
                            setSections(sections.filter((x) => x.id !== s.id));
                            if (openId === s.id) setOpenId(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </RowButton>
                      </>
                    )}
                  </div>

                  {openId === s.id && (
                    <div className="space-y-4 border-t border-border/70 p-4">
                      <SectionFields
                        section={s}
                        patch={(p) => patch(s.id, p)}
                        media={media}
                        addMedia={addMedia}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>

            <GoldButton className="mt-4 h-10" onClick={() => setPicking(true)}>
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add a section
              </span>
            </GoldButton>
          </>
        )}
      </Card>

      {picking && <SectionPicker onPick={add} onClose={() => setPicking(false)} />}
    </div>
  );
}

function RowButton({
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

/* ------------------------------------------------------------ add section */

function SectionPicker({
  onPick,
  onClose,
}: {
  onPick: (kind: SectionKind) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-bg-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div>
            <h3 className="font-serif text-lg font-light">Add a section</h3>
            <p className="text-xs text-foreground-muted">
              It lands at the bottom of the page — move it anywhere with the arrows.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-foreground-muted hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-2.5 overflow-y-auto p-5 sm:grid-cols-2">
          {ADDABLE_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onPick(kind)}
              className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5 text-left transition-colors hover:border-accent/60"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-accent">
                <KindIcon kind={kind} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{SECTION_META[kind].label}</span>
                <span className="block text-xs leading-relaxed text-foreground-muted">
                  {SECTION_META[kind].description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- preview */

function PagePreview({ sections }: { sections: Section[] }) {
  const visible = sections.filter((s) => s.visible);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {visible.length === 0 && (
        <p className="p-10 text-center text-sm text-foreground-muted">
          Every section is hidden — the page would be empty.
        </p>
      )}
      {visible.map((s) =>
        s.kind === "builtin" ? (
          <div
            key={s.id}
            className="flex items-center gap-3 border-b border-border bg-bg-soft px-5 py-6"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="truncate text-sm">{BUILTIN_LABEL[s.builtin]}</p>
              <p className="text-[11px] text-foreground-muted">
                Designed section — animated on the live site
                {s.underConstruction && " · wearing the “under construction” plate"}
              </p>
            </div>
          </div>
        ) : (
          <div key={s.id} className="border-b border-border last:border-b-0">
            <Block section={s} compact />
          </div>
        )
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- fields */

function SectionFields({
  section,
  patch,
  media,
  addMedia,
}: {
  section: Section;
  patch: (p: Partial<Section>) => void;
  media: Img[];
  addMedia: (img: Img) => void;
}) {
  const set = (p: Record<string, unknown>) => patch(p as Partial<Section>);

  switch (section.kind) {
    case "builtin":
      return (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-foreground-muted">
            This is one of the designed sections of your site. Its words live in the
            translation files so all six languages stay in step — here you decide{" "}
            <span className="text-foreground">where it sits</span>, whether it shows,
            and whether it is marked as still being worked on.
          </p>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(section.underConstruction)}
              onChange={(e) => set({ underConstruction: e.target.checked })}
              className="accent-[#D4AF37]"
            />
            <HardHat className="h-4 w-4 text-amber-500" />
            Show the &ldquo;under construction&rdquo; plate over it
          </label>
        </div>
      );

    case "text":
      return (
        <>
          <TextInput label="Small line above (optional)" value={section.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <TextArea label="Heading" value={section.heading} rows={2} onChange={(v) => set({ heading: v })} />
          <TextArea label="Text" value={section.body} onChange={(v) => set({ body: v })} />
          <Choice
            label="Alignment"
            value={section.align}
            options={[
              { value: "center" as const, label: "Centred" },
              { value: "left" as const, label: "Left" },
            ]}
            onChange={(v) => set({ align: v })}
          />
        </>
      );

    case "imageText":
      return (
        <>
          <ImagePicker
            label="Picture"
            value={section.image}
            media={media}
            onAddMedia={addMedia}
            onChange={(img) => set({ image: img })}
          />
          <Choice
            label="Picture side"
            value={section.side}
            options={[
              { value: "left" as const, label: "Picture left" },
              { value: "right" as const, label: "Picture right" },
            ]}
            onChange={(v) => set({ side: v })}
          />
          <TextInput label="Small line above (optional)" value={section.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <TextArea label="Heading" value={section.heading} rows={2} onChange={(v) => set({ heading: v })} />
          <TextArea label="Text" value={section.body} onChange={(v) => set({ body: v })} />
          <ButtonField
            button={section.button}
            onChange={(b) => set({ button: b })}
          />
        </>
      );

    case "gallery":
      return (
        <>
          <TextInput label="Heading (optional)" value={section.heading} onChange={(v) => set({ heading: v })} />
          <Choice
            label="Layout"
            value={section.layout}
            options={[
              { value: "grid" as const, label: "Grid" },
              { value: "strip" as const, label: "Sliding row" },
            ]}
            onChange={(v) => set({ layout: v })}
          />
          <GalleryImages
            images={section.images}
            media={media}
            addMedia={addMedia}
            onChange={(images) => set({ images })}
          />
        </>
      );

    case "cards":
      return (
        <>
          <TextInput label="Heading (optional)" value={section.heading} onChange={(v) => set({ heading: v })} />
          <TextArea label="Intro text (optional)" value={section.intro} rows={2} onChange={(v) => set({ intro: v })} />
          <Choice
            label="Cards per row"
            value={section.columns}
            options={[
              { value: 2 as const, label: "2" },
              { value: 3 as const, label: "3" },
              { value: 4 as const, label: "4" },
            ]}
            onChange={(v) => set({ columns: v })}
          />
          <ListEditor
            label="Cards"
            items={section.cards}
            onChange={(cards) => set({ cards })}
            onAdd={() => ({ id: uid("c"), image: null, title: "New card", body: "" })}
            addLabel="Add a card"
            titleOf={(c) => c.title}
            renderItem={(c, update) => (
              <>
                <ImagePicker
                  label="Picture (optional)"
                  value={c.image}
                  media={media}
                  onAddMedia={addMedia}
                  onChange={(img) => update({ image: img })}
                  onRemove={() => update({ image: null })}
                />
                <TextInput label="Title" value={c.title} onChange={(v) => update({ title: v })} />
                <TextArea label="Text" value={c.body} rows={3} onChange={(v) => update({ body: v })} />
              </>
            )}
          />
        </>
      );

    case "quote":
      return (
        <>
          <TextArea label="The quote" value={section.text} rows={3} onChange={(v) => set({ text: v })} />
          <TextInput label="Who said it" value={section.author} onChange={(v) => set({ author: v })} />
        </>
      );

    case "reviews":
      return (
        <>
          <TextInput label="Heading (optional)" value={section.heading} onChange={(v) => set({ heading: v })} />
          <ListEditor
            label="Reviews"
            items={section.items}
            onChange={(items) => set({ items })}
            onAdd={() => ({ id: uid("r"), name: "Customer", place: "", stars: 5, text: "" })}
            addLabel="Add a review"
            titleOf={(r) => `${r.name}${r.place ? ` · ${r.place}` : ""}`}
            renderItem={(r, update) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput label="Name" value={r.name} onChange={(v) => update({ name: v })} />
                  <TextInput label="Town (optional)" value={r.place} onChange={(v) => update({ place: v })} />
                </div>
                <Choice
                  label="Stars"
                  value={r.stars}
                  options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: "★".repeat(n) }))}
                  onChange={(v) => update({ stars: v })}
                />
                <TextArea label="What they said" value={r.text} rows={3} onChange={(v) => update({ text: v })} />
              </>
            )}
          />
        </>
      );

    case "cta":
      return (
        <>
          <TextArea label="Heading" value={section.heading} rows={2} onChange={(v) => set({ heading: v })} />
          <TextArea label="Text (optional)" value={section.body} rows={2} onChange={(v) => set({ body: v })} />
          <ListEditor
            label="Buttons"
            items={section.buttons}
            onChange={(buttons) => set({ buttons })}
            onAdd={() => ({ label: "Button", href: "/products", style: "outline" as const })}
            addLabel="Add a button"
            max={2}
            titleOf={(b) => b.label}
            renderItem={(b, update) => (
              <>
                <TextInput label="Button text" value={b.label} onChange={(v) => update({ label: v })} />
                <LinkField value={b.href} onChange={(v) => update({ href: v })} />
                <Choice
                  label="Style"
                  value={b.style}
                  options={[
                    { value: "gold" as const, label: "Gold" },
                    { value: "outline" as const, label: "Outline" },
                  ]}
                  onChange={(v) => update({ style: v })}
                />
              </>
            )}
          />
        </>
      );

    case "stats":
      return (
        <ListEditor
          label="Numbers"
          items={section.items}
          onChange={(items) => set({ items })}
          onAdd={() => ({ id: uid("n"), value: "100%", label: "Something good" })}
          addLabel="Add a number"
          max={4}
          titleOf={(s) => `${s.value} — ${s.label}`}
          renderItem={(s, update) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Number" value={s.value} onChange={(v) => update({ value: v })} />
              <TextInput label="Label" value={s.label} onChange={(v) => update({ label: v })} />
            </div>
          )}
        />
      );

    case "banner":
      return (
        <TextInput
          label="Ribbon text"
          value={section.text}
          onChange={(v) => set({ text: v })}
          hint="Separate words with ·  for the classic ribbon look."
        />
      );

    case "video":
      return (
        <>
          <TextInput
            label="Video file or link"
            value={section.src}
            onChange={(v) => set({ src: v })}
            hint="The site ships with /reliable-source.mp4 — or paste a link to an .mp4 file."
          />
          <TextInput label="Heading (optional)" value={section.heading} onChange={(v) => set({ heading: v })} />
          <TextInput label="Caption (optional)" value={section.caption} onChange={(v) => set({ caption: v })} />
        </>
      );
  }
}

/** Picture list for a gallery section, with a "add several" picker. */
function GalleryImages({
  images,
  media,
  addMedia,
  onChange,
}: {
  images: Img[];
  media: Img[];
  addMedia: (img: Img) => void;
  onChange: (next: Img[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-foreground-muted">Pictures</span>
        <span className="text-[11px] text-foreground-muted">{images.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={`${img.src.slice(0, 30)}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
          >
            <Thumb src={img.src} />
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-0.5 bg-black/60 py-1 opacity-0 transition-opacity group-hover:opacity-100">
              <RowButton label="Move left" onClick={() => move(i, -1)}>
                <ArrowUp className="h-3 w-3 -rotate-90" />
              </RowButton>
              <RowButton label="Move right" onClick={() => move(i, 1)}>
                <ArrowDown className="h-3 w-3 -rotate-90" />
              </RowButton>
              <RowButton
                label="Remove"
                danger
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-3 w-3" />
              </RowButton>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="grid aspect-square place-items-center rounded-lg border border-dashed border-border text-foreground-muted transition-colors hover:border-accent/60 hover:text-accent"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {adding && (
        <MediaDialog
          media={media}
          multiple
          onAddMedia={addMedia}
          onPick={(img) => onChange([...images, img])}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function ButtonField({
  button,
  onChange,
}: {
  button: Btn | null;
  onChange: (b: Btn | null) => void;
}) {
  if (!button) {
    return (
      <GhostButton
        className="text-xs"
        onClick={() => onChange({ label: "Call to taste", href: "/products", style: "gold" })}
      >
        <Plus className="h-3.5 w-3.5" /> Add a button
      </GhostButton>
    );
  }
  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground-muted">Button</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-foreground-muted hover:text-red-400"
        >
          Remove
        </button>
      </div>
      <TextInput label="Button text" value={button.label} onChange={(v) => onChange({ ...button, label: v })} />
      <LinkField value={button.href} onChange={(v) => onChange({ ...button, href: v })} />
      <Choice
        label="Style"
        value={button.style}
        options={[
          { value: "gold" as const, label: "Gold" },
          { value: "outline" as const, label: "Outline" },
        ]}
        onChange={(v) => onChange({ ...button, style: v })}
      />
    </div>
  );
}

/** Link field with one-tap shortcuts to the pages the site already has. */
function LinkField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const presets = [
    { href: "/products", label: "Products" },
    { href: "/gallery", label: "Gallery" },
    { href: "/", label: "Home" },
  ];
  return (
    <div>
      <TextInput label="Where it goes" value={value} onChange={onChange} />
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.href}
            type="button"
            onClick={() => onChange(p.href)}
            className={cn(
              "rounded-md border px-2 py-1 text-[11px] transition-colors",
              value === p.href
                ? "border-accent/60 text-accent"
                : "border-border text-foreground-muted hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
