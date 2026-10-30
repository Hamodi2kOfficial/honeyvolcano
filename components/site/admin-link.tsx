import { Link } from "@/components/ui/link";
import { Lock } from "lucide-react";

/**
 * A quiet way into the website manager, at the very bottom of the home page —
 * so the owner can reach /admin from any phone without typing the address.
 * Deliberately understated: visitors read past it, the owner knows it is there.
 */
export function AdminLink() {
  return (
    <div className="bg-background pb-8 text-center">
      <Link
        href="/admin"
        rel="nofollow"
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground-muted transition-colors hover:border-accent/50 hover:text-accent"
      >
        <Lock className="h-3 w-3" />
        Manage website
      </Link>
    </div>
  );
}
