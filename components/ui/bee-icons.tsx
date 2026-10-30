import * as React from "react";

/**
 * The two icons the hive needs that lucide does not have.
 *
 * Drawn to lucide's own grammar — 24x24 box, no fill, currentColor stroke,
 * round caps and joins — so they sit beside Leaf, Scale, ShieldCheck and
 * HeartHandshake in the seal row without looking like a different set.
 * Stroke width is a prop because the seals carry them larger than body text.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

const base = (strokeWidth: number | string = 1.6) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/** A honeybee, wings out, three stripes. */
export function BeeIcon({ strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg {...base(strokeWidth)} {...props}>
      {/* antennae */}
      <path d="M10.1 5.6 8.6 3.5M13.9 5.6l1.5-2.1" />
      {/* head */}
      <circle cx="12" cy="8.1" r="2.5" />
      {/* wings */}
      <path d="M9.6 9.6C7.7 7.9 5.2 7.5 4.3 8.5c-.9 1-.2 3.1 1.7 4.3 1.2.8 2.5.9 3.2.4" />
      <path d="M14.4 9.6c1.9-1.7 4.4-2.1 5.3-1.1.9 1 .2 3.1-1.7 4.3-1.2.8-2.5.9-3.2.4" />
      {/* abdomen */}
      <path d="M12 10.6c-2.1 0-3.5 1.4-3.5 3.3 0 3 1.6 6.2 3.5 6.2s3.5-3.2 3.5-6.2c0-1.9-1.4-3.3-3.5-3.3Z" />
      {/* stripes */}
      <path d="M8.8 15h6.4M9.6 17.8h4.8" />
    </svg>
  );
}

/** A lidded honey jar with the honey line showing through. */
export function HoneyJarIcon({ strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg {...base(strokeWidth)} {...props}>
      {/* lid */}
      <path d="M7.6 3.4h8.8a1 1 0 0 1 1 1v2.2H6.6V4.4a1 1 0 0 1 1-1Z" />
      {/* shoulders and body */}
      <path d="M7.2 6.6c-.5 1.5-1.5 2.5-1.5 4.3V18a2.6 2.6 0 0 0 2.6 2.6h7.4A2.6 2.6 0 0 0 18.3 18v-7.1c0-1.8-1-2.8-1.5-4.3" />
      {/* the honey inside, settled */}
      <path d="M6 12.9c1.5-1 3-1 4.5 0s3 1 4.5 0 2.3-.6 3.3.1" />
    </svg>
  );
}
