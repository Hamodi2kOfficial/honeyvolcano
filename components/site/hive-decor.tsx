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
 * stops entirely under `prefers-reduced-motion`. A phone carries a third of
 * the pieces, because a phone should spend its frames on the photographs.
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

const PIECES: Piece[] = [
  { kind: "hex", left: 6, size: 34, duration: 34, delay: -3, drift: 30, spin: 38, tone: "text-accent/20" },
  { kind: "jar", left: 17, size: 30, duration: 46, delay: -21, drift: -26, spin: -22, tone: "text-copper/22", wide: true },
  { kind: "drip", left: 27, size: 14, duration: 28, delay: -12, drift: 18, spin: 0, tone: "text-amber/28" },
  { kind: "bee", left: 36, size: 24, duration: 39, delay: -30, drift: 44, spin: 16, tone: "text-accent/28", wide: true },
  { kind: "hex", left: 46, size: 42, duration: 52, delay: -8, drift: -34, spin: 44, tone: "text-copper/16", wide: true },
  { kind: "drip", left: 56, size: 11, duration: 31, delay: -24, drift: 22, spin: 0, tone: "text-amber/24", wide: true },
  { kind: "jar", left: 65, size: 36, duration: 43, delay: -16, drift: 28, spin: 26, tone: "text-accent/18" },
  { kind: "bee", left: 74, size: 20, duration: 36, delay: -5, drift: -40, spin: -14, tone: "text-accent/24", wide: true },
  { kind: "hex", left: 83, size: 28, duration: 48, delay: -34, drift: 24, spin: -36, tone: "text-copper/20", wide: true },
  { kind: "jar", left: 92, size: 26, duration: 40, delay: -27, drift: -20, spin: 20, tone: "text-accent/16", wide: true },
  { kind: "drip", left: 11, size: 13, duration: 37, delay: -18, drift: -16, spin: 0, tone: "text-amber/22", wide: true },
  { kind: "hex", left: 61, size: 24, duration: 44, delay: -40, drift: 36, spin: 30, tone: "text-accent/14", wide: true },
];

const SHAPES = { jar: Jar, hex: Hexagon, drip: Drip, bee: Bee };

export function HiveDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none overflow-hidden"
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
