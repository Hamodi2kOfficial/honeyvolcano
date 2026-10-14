/** Small shared building blocks for the /admin dashboard. */
import { cn } from "@/lib/utils";

export function Card({
  title,
  hint,
  action,
  children,
  className,
}: {
  title?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-2xl border border-border bg-bg-soft p-5 md:p-6", className)}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-serif text-xl font-light">{title}</h2>}
          {action}
        </div>
      )}
      {hint && <p className="mt-1 text-xs text-foreground-muted">{hint}</p>}
      <div className={title || hint ? "mt-4" : undefined}>{children}</div>
    </section>
  );
}

export function GoldButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "h-9 rounded-lg bg-accent px-4 text-sm font-semibold text-[#1c1206] transition-opacity disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-accent/60 hover:text-accent sm:min-h-0",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      {children}
    </label>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "good" | "warn";
}) {
  const tones = {
    neutral: "border-border text-foreground-muted",
    gold: "border-accent/50 text-accent",
    good: "border-emerald-500/40 text-emerald-500",
    warn: "border-amber-500/50 text-amber-500",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-foreground-muted">
        {label}
      </p>
      <p className="mt-1.5 font-serif text-2xl font-light text-accent">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-foreground-muted">{sub}</p>}
    </div>
  );
}

/**
 * The one icon button for the whole dashboard. Comfortably tappable on a
 * phone (44px, the accessibility minimum) and tighter on a mouse-driven
 * screen, so the editors stay dense where there is room.
 */
export function IconButton({
  label,
  onClick,
  danger,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "inline-grid h-11 w-11 shrink-0 place-items-center rounded-lg text-foreground-muted transition-colors disabled:opacity-40 sm:h-9 sm:w-9",
        danger ? "hover:text-red-400" : "hover:text-accent",
        className
      )}
    >
      {children}
    </button>
  );
}
