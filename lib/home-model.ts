/**
 * The home page as data.
 *
 * The page is an ordered list of sections. Two families:
 *  • "builtin" — the bespoke, animated, fully translated sections that already
 *    exist as components (hero, trust, letter…). The owner controls their
 *    order, whether they show, and whether they wear the "under construction"
 *    plate — their copy stays in the translation files so all six languages
 *    stay in sync.
 *  • everything else — blocks the owner creates and writes themselves
 *    (pictures, cards, quotes, reviews, buttons…). These are rendered by
 *    components/site/blocks.tsx, on the public page and in the admin preview.
 *
 * The same shape is stored in content/home.json, so a page built in the
 * dashboard is exactly what the site renders.
 */

export type Img = { src: string; alt: string };
export type Btn = { label: string; href: string; style: "gold" | "outline" };

export type BuiltinKind =
  | "hero"
  | "video"
  | "trust"
  | "values"
  | "letter"
  | "showcase"
  | "cta";

type Base = { id: string; visible: boolean };

export type Section = Base &
  (
    | { kind: "builtin"; builtin: BuiltinKind; underConstruction?: boolean }
    | {
        kind: "text";
        eyebrow: string;
        heading: string;
        body: string;
        align: "left" | "center";
      }
    | {
        kind: "imageText";
        side: "left" | "right";
        image: Img;
        eyebrow: string;
        heading: string;
        body: string;
        button: Btn | null;
      }
    | {
        kind: "gallery";
        heading: string;
        layout: "grid" | "strip";
        images: Img[];
      }
    | {
        kind: "cards";
        heading: string;
        intro: string;
        columns: 2 | 3 | 4;
        cards: { id: string; image: Img | null; title: string; body: string }[];
      }
    | { kind: "quote"; text: string; author: string }
    | {
        kind: "reviews";
        heading: string;
        items: {
          id: string;
          name: string;
          place: string;
          stars: number;
          text: string;
        }[];
      }
    | { kind: "cta"; heading: string; body: string; buttons: Btn[] }
    | { kind: "stats"; items: { id: string; value: string; label: string }[] }
    | { kind: "banner"; text: string }
    | { kind: "video"; src: string; heading: string; caption: string }
  );

export type SectionKind = Section["kind"];
export type HomeContent = { sections: Section[] };

/** Labels + one-line descriptions shown in the "Add section" picker. */
export const SECTION_META: Record<
  SectionKind,
  { label: string; icon: string; description: string }
> = {
  builtin: {
    label: "Built-in section",
    icon: "Sparkles",
    description: "An existing designed section of the site.",
  },
  text: {
    label: "Text",
    icon: "Type",
    description: "A heading with a paragraph — for a story or an announcement.",
  },
  imageText: {
    label: "Picture + text",
    icon: "Columns2",
    description: "A photo on one side, words on the other, with a button.",
  },
  gallery: {
    label: "Pictures",
    icon: "Images",
    description: "A grid or a row of photos from your media library.",
  },
  cards: {
    label: "Cards",
    icon: "LayoutGrid",
    description: "2–4 cards with a picture, a title and a short text.",
  },
  quote: {
    label: "Quote",
    icon: "Quote",
    description: "One large sentence with who said it.",
  },
  reviews: {
    label: "Reviews",
    icon: "Star",
    description: "What customers say, with stars.",
  },
  cta: {
    label: "Call to action",
    icon: "MousePointerClick",
    description: "A bold band with a heading and one or two buttons.",
  },
  stats: {
    label: "Numbers",
    icon: "Hash",
    description: "Three or four figures you are proud of.",
  },
  banner: {
    label: "Gold ribbon",
    icon: "Flag",
    description: "A thin scrolling strip of words across the page.",
  },
  video: {
    label: "Video",
    icon: "Film",
    description: "A film with an optional heading and caption.",
  },
};

/** What the owner can add from the picker (built-ins are placed by us). */
export const ADDABLE_KINDS: SectionKind[] = [
  "text",
  "imageText",
  "gallery",
  "cards",
  "quote",
  "reviews",
  "cta",
  "stats",
  "banner",
  "video",
];

export const BUILTIN_LABEL: Record<BuiltinKind, string> = {
  hero: "Hero — logo, honeycomb and tagline",
  video: "Film — raw honey from a reliable source",
  trust: "Reliable source — jar photo and authorisations",
  values: "Real honey — the four promises",
  letter: "A note from the hive — beekeeper letter",
  showcase: "Product pictures — the three jars",
  cta: "Taste the wild — waitlist and footer",
};

export function uid(prefix = "s"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now()
    .toString(36)
    .slice(-3)}`;
}

const PLACEHOLDER: Img = {
  src: "/gallery/g-comb.jpg",
  alt: "Golden honeycomb dripping raw honey",
};

/** A ready-to-edit section of the given kind, filled with sensible starting copy. */
export function createSection(kind: SectionKind): Section {
  const id = uid();
  switch (kind) {
    case "text":
      return {
        id,
        visible: true,
        kind: "text",
        eyebrow: "A few words",
        heading: "Tell your story here",
        body: "Write what you want visitors to know. Keep it short and warm — two or three sentences read best.",
        align: "center",
      };
    case "imageText":
      return {
        id,
        visible: true,
        kind: "imageText",
        side: "left",
        image: PLACEHOLDER,
        eyebrow: "From the hive",
        heading: "A picture and a paragraph",
        body: "Put a photo next to a short text. Good for explaining one thing at a time — a product, a place, a promise.",
        button: { label: "Call to taste", href: "/products", style: "gold" },
      };
    case "gallery":
      return {
        id,
        visible: true,
        kind: "gallery",
        heading: "From our hives",
        layout: "grid",
        images: [
          PLACEHOLDER,
          { src: "/gallery/g-mountain.jpg", alt: "Honey Volcano jar in a mountain meadow" },
          { src: "/gallery/g-pour.jpg", alt: "Raw honey drizzling into a jar" },
        ],
      };
    case "cards":
      return {
        id,
        visible: true,
        kind: "cards",
        heading: "What makes it different",
        intro: "",
        columns: 3,
        cards: [
          { id: uid("c"), image: null, title: "100% raw", body: "Never pasteurised — enzymes and pollen stay alive." },
          { id: uid("c"), image: null, title: "Single origin", body: "From our own hives in the wild highlands." },
          { id: uid("c"), image: null, title: "Nothing added", body: "Just honey, exactly as the bees made it." },
        ],
      };
    case "quote":
      return {
        id,
        visible: true,
        kind: "quote",
        text: "We don't make honey. The forest does.",
        author: "The Honey Volcano beekeepers",
      };
    case "reviews":
      return {
        id,
        visible: true,
        kind: "reviews",
        heading: "What people say",
        items: [
          { id: uid("r"), name: "Anna", place: "Reykjavík", stars: 5, text: "The most honest honey I have tasted. You can smell the meadow." },
          { id: uid("r"), name: "Gísli", place: "Selfoss", stars: 5, text: "Thick, wild and completely different from shop honey." },
        ],
      };
    case "cta":
      return {
        id,
        visible: true,
        kind: "cta",
        heading: "Taste before you order",
        body: "Ask for a taste and judge the honey for yourself.",
        buttons: [{ label: "Call to taste", href: "/products", style: "gold" }],
      };
    case "stats":
      return {
        id,
        visible: true,
        kind: "stats",
        items: [
          { id: uid("n"), value: "100%", label: "Raw & unheated" },
          { id: uid("n"), value: "1", label: "Single origin" },
          { id: uid("n"), value: "0", label: "Additives" },
        ],
      };
    case "banner":
      return {
        id,
        visible: true,
        kind: "banner",
        text: "Raw · Unfiltered · Wild-foraged · Small batch",
      };
    case "video":
      return {
        id,
        visible: true,
        kind: "video",
        src: "/reliable-source.mp4",
        heading: "",
        caption: "",
      };
    case "builtin":
      return { id, visible: true, kind: "builtin", builtin: "trust" };
  }
}

/** Short line describing a section in the editor list. */
export function sectionTitle(s: Section): string {
  switch (s.kind) {
    case "builtin":
      return BUILTIN_LABEL[s.builtin];
    case "text":
      return s.heading || "Text";
    case "imageText":
      return s.heading || "Picture + text";
    case "gallery":
      return `${s.heading || "Pictures"} · ${s.images.length} photo${s.images.length === 1 ? "" : "s"}`;
    case "cards":
      return `${s.heading || "Cards"} · ${s.cards.length} cards`;
    case "quote":
      return s.text.length > 48 ? `${s.text.slice(0, 48)}…` : s.text;
    case "reviews":
      return `${s.heading || "Reviews"} · ${s.items.length}`;
    case "cta":
      return s.heading || "Call to action";
    case "stats":
      return `Numbers · ${s.items.length}`;
    case "banner":
      return s.text || "Gold ribbon";
    case "video":
      return s.heading || "Video";
  }
}
