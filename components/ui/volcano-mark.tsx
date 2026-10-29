import { cn } from "@/lib/utils";

/**
 * The logo reduced to line art: the hexagon, the volcano and the drop.
 *
 * Drawn in `currentColor` so it reads in both themes and can be used small
 * (navigation bar, stamps, list bullets) where the full raster logo would be
 * mud. The bee's Lithuanian stripes are left out at this size on purpose.
 */
export function VolcanoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("h-7 w-7", className)}
    >
      {/* hexagon frame */}
      <path
        d="M24 2.5 43 13.2v21.6L24 45.5 5 34.8V13.2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.75"
      />
      {/* volcano */}
      <path
        d="M11 33.5c4.2-1.1 6.6-4.3 8.6-8.1 1.4-2.6 2.6-5 4.4-5s3 2.4 4.4 5c2 3.8 4.4 7 8.6 8.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.6 21.2h4.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* the drop above the crater */}
      <path
        d="M24 9.5c0 2.6-2.6 3.9-2.6 5.8a2.6 2.6 0 1 0 5.2 0c0-1.9-2.6-3.2-2.6-5.8z"
        fill="currentColor"
      />
    </svg>
  );
}
