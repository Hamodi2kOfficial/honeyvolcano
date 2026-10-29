"use client";

/**
 * The living margins of the products page.
 *
 * Honey jars, drips, comb fragments and bees drifting down both sides. Every
 * piece is decorative, so the whole layer is `aria-hidden` and
 * `pointer-events-none`, sits behind the content on its own z-index, and is
 * confined to two narrow side rails that the page's max-width never reaches.
 *
 * It only appears from xl up: below that there are no side margins to live in,
 * and a phone should spend its frames on the product photos. All motion is
 * transform/opacity CSS animation (see globals.css), which the compositor can
 * run without touching layout, and it all stops under prefers-reduced-motion.
 */

function Hexagon({ className, style }: { className?: string; style?: React.CSSProperties }) {
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

function Jar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 34 44" className={className} style={style} fill="none">
      <path d="M12 2h10v4l3 3v29a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V9l3-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 22h16v12a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z" fill="currentColor" opacity="0.28" />
      <path d="M9 2h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Drip({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 14 20" className={className} style={style}>
      <path d="M7 0c0 5.2-7 8.6-7 13.4A7 7 0 0 0 14 13.4C14 8.6 7 5.2 7 0z" fill="currentColor" />
    </svg>
  );
}

function Bee({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={style}>
      <svg viewBox="0 0 26 18" className="h-full w-full" fill="none">
        {/* wings */}
        <ellipse cx="11" cy="5" rx="5" ry="3.2" fill="currentColor" opacity="0.35" />
        <ellipse cx="16" cy="5" rx="4.2" ry="2.8" fill="currentColor" opacity="0.28" />
        {/* body */}
        <ellipse cx="14" cy="11" rx="7" ry="4.4" fill="currentColor" />
        <path d="M12 7.2v7.6M15.4 7.6v6.8" stroke="var(--bg)" strokeWidth="1.3" opacity="0.8" />
        <circle cx="21.4" cy="10.4" r="2.1" fill="currentColor" />
      </svg>
    </span>
  );
}

/** One side rail. `side` only decides which edge it hugs. */
function Rail({ side }: { side: "left" | "right" }) {
  const flip = side === "right";
  return (
    <div
      className={`absolute top-0 h-full w-[150px] 2xl:w-[200px] ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <Jar
        className="hv-float absolute left-[22%] top-[6%] h-11 w-9 text-accent/30"
        style={{ animationDelay: "0s" }}
      />
      <Hexagon
        className="hv-drift absolute left-[52%] top-[17%] h-9 w-8 text-copper/30"
        style={{ animationDelay: "-3s" }}
      />
      <Drip
        className="hv-drip absolute left-[30%] top-[27%] h-5 w-3.5 text-amber/40"
        style={{ animationDelay: "-1.5s" }}
      />
      <Bee
        className="hv-bee absolute left-[16%] top-[36%] block h-4 w-6 text-accent/55"
        style={{ animationDelay: "-2s" }}
      />
      <Hexagon
        className="hv-float absolute left-[46%] top-[47%] h-12 w-10 text-accent/22"
        style={{ animationDelay: "-4.5s" }}
      />
      <Jar
        className="hv-drift absolute left-[20%] top-[59%] h-10 w-8 text-copper/28"
        style={{ animationDelay: "-6s" }}
      />
      <Drip
        className="hv-drip absolute left-[58%] top-[68%] h-4 w-3 text-amber/35"
        style={{ animationDelay: "-3.2s" }}
      />
      <Bee
        className="hv-bee-slow absolute left-[44%] top-[79%] block h-3.5 w-5 text-accent/45"
        style={{ animationDelay: "-5s" }}
      />
      <Hexagon
        className="hv-drift absolute left-[24%] top-[88%] h-8 w-7 text-copper/25"
        style={{ animationDelay: "-1s" }}
      />
    </div>
  );
}

export function HiveDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 hidden select-none overflow-hidden xl:block"
    >
      <Rail side="left" />
      <Rail side="right" />
    </div>
  );
}
