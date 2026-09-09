/**
 * Brand catch-phrase watermark — "Let happiness erupt" set very faintly in the
 * background of a section. Purely decorative; kept low-contrast so it reads as a
 * subtle texture, never as clutter. Position + colour come from `className`.
 */
export function EruptMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none whitespace-nowrap font-display uppercase leading-none tracking-[0.18em] ${className}`}
    >
      Let happiness erupt
    </span>
  );
}
