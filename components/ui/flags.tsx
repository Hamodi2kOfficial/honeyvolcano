/**
 * Inline SVG flags. Emoji flags don't render on Windows / many desktop browsers
 * (they fall back to two letters), so we draw them as SVG to guarantee they show
 * identically on phone and desktop.
 */
type FlagProps = { className?: string; title?: string };

const base =
  "inline-block h-[0.9em] w-auto shrink-0 rounded-[2px] align-[-0.1em] ring-1 ring-black/20";

export function IcelandFlag({ className = "", title = "Iceland" }: FlagProps) {
  return (
    <svg viewBox="0 0 25 18" role="img" aria-label={title} className={`${base} ${className}`}>
      <rect width="25" height="18" fill="#02529C" />
      <rect y="7" width="25" height="4" fill="#fff" />
      <rect x="7" width="4" height="18" fill="#fff" />
      <rect y="8" width="25" height="2" fill="#DC1E35" />
      <rect x="8" width="2" height="18" fill="#DC1E35" />
    </svg>
  );
}

export function LithuaniaFlag({ className = "", title = "Lithuania" }: FlagProps) {
  return (
    <svg viewBox="0 0 25 15" role="img" aria-label={title} className={`${base} ${className}`}>
      <rect width="25" height="5" fill="#FDB913" />
      <rect y="5" width="25" height="5" fill="#006A44" />
      <rect y="10" width="25" height="5" fill="#C1272D" />
    </svg>
  );
}
