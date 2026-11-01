"use client";

/**
 * Hive things falling slowly behind the page.
 *
 * Jars, comb, drips and bees drift down through the viewport on a long loop.
 * The layer is fixed rather than tall, so the fall carries on at the same
 * pace however far down the page the visitor has scrolled, and it never
 * grows with the content.
 *
 * Every piece is decorative: the whole layer is `aria-hidden`,
 * `pointer-events-none`, and sits on its own negative z-index behind the
 * content. The motion is one CSS keyframe on transform and opacity (see
 * globals.css), which the compositor runs without touching layout, and it
 * stops entirely under `prefers-reduced-motion`. A phone carries two of them,
 * because a phone has the least room to spare and should spend its frames on
 * the photographs.
 */

type Props = { className?: string; style?: React.CSSProperties };

function Hexagon({ className, style }: Props) {
  return (
    <svg viewBox="0 0 40 46" className={className} style={style} fill="none">
      <path
        d="M20 1 38 11.5v23L20 45 2 34.5v-23z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M20 12 29 17v10l-9 5-9-5V17z" stroke="currentColor" strokeWidth="1" opacity="0.55" />
    </svg>
  );
}

function Jar({ className, style }: Props) {
  return (
    <svg viewBox="0 0 34 44" className={className} style={style} fill="none">
      <path
        d="M12 2h10v4l3 3v29a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V9l3-3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 22h16v12a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z" fill="currentColor" opacity="0.28" />
      <path d="M9 2h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Drip({ className, style }: Props) {
  return (
    <svg viewBox="0 0 14 20" className={className} style={style}>
      <path d="M7 0c0 5.2-7 8.6-7 13.4A7 7 0 0 0 14 13.4C14 8.6 7 5.2 7 0z" fill="currentColor" />
    </svg>
  );
}

function Bee({ className, style }: Props) {
  return (
    <svg viewBox="0 0 26 18" className={className} style={style} fill="none">
      <ellipse cx="11" cy="5" rx="5" ry="3.2" fill="currentColor" opacity="0.35" />
      <ellipse cx="16" cy="5" rx="4.2" ry="2.8" fill="currentColor" opacity="0.28" />
      <ellipse cx="14" cy="11" rx="7" ry="4.4" fill="currentColor" />
      <path d="M12 7.2v7.6M15.4 7.6v6.8" stroke="var(--bg)" strokeWidth="1.3" opacity="0.8" />
      <circle cx="21.4" cy="10.4" r="2.1" fill="currentColor" />
    </svg>
  );
}

/**
 * One falling piece. `left` places it across the width, `delay` is negative so
 * the field is already mid-fall on the first frame rather than starting empty,
 * and `drift` and `spin` keep any two pieces from tracing the same path.
 */
type Piece = {
  kind: "jar" | "hex" | "drip" | "bee";
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  tone: string;
  /** Only the first third of the field is carried on a phone. */
  wide?: boolean;
};

/**
 * Seven pieces, faint and slow.
 *
 * They have to sit above the section backgrounds to be visible at all — an
 * opaque background will always hide whatever is behind it — so the only way
 * to keep them in the background is to make them quiet enough that the eye
 * reads them as texture rather than as things crossing the page. Hence the
 * low tones, the small sizes and the long falls. They also keep to the
 * margins and the gaps between columns, away from where the words are.
 */
const PIECES: Piece[] = [
  { kind: "hex", left: 4, size: 26, duration: 58, delay: -3, drift: 22, spin: 30, tone: "text-accent/[0.10]" },
  { kind: "drip", left: 13, size: 9, duration: 52, delay: -24, drift: 14, spin: 0, tone: "text-amber/[0.12]", wide: true },
  { kind: "bee", left: 29, size: 16, duration: 64, delay: -30, drift: 30, spin: 12, tone: "text-accent/[0.13]", wide: true },
  { kind: "hex", left: 50, size: 30, duration: 72, delay: -8, drift: -24, spin: 34, tone: "text-copper/[0.08]", wide: true },
  { kind: "jar", left: 71, size: 22, duration: 61, delay: -16, drift: 20, spin: 18, tone: "text-accent/[0.10]", wide: true },
  { kind: "drip", left: 87, size: 10, duration: 55, delay: -40, drift: -12, spin: 0, tone: "text-amber/[0.11]" },
  { kind: "hex", left: 95, size: 20, duration: 68, delay: -34, drift: 18, spin: -28, tone: "text-copper/[0.09]", wide: true },
];

const SHAPES = { jar: Jar, hex: Hexagon, drip: Drip, bee: Bee };

export function HiveDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden"
    >
      {PIECES.map((p, i) => {
        const Shape = SHAPES[p.kind];
        return (
          <Shape
            key={i}
            className={`hv-fall absolute top-0 ${p.tone} ${p.wide ? "hidden md:block" : ""}`}
            style={
              {
                left: `${p.left}%`,
                width: p.size,
                height: "auto",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                "--fall-drift": `${p.drift}px`,
                "--fall-spin": `${p.spin}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
