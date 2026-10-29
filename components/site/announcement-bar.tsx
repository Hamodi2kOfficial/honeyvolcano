"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/ui/link";
import { X } from "lucide-react";

import { useLiveContent } from "@/components/live-content";
import { announcementLive } from "@/lib/marketing";

const DISMISS_KEY = "hv-announcement-dismissed";

/**
 * The campaign strip across the very top of the site. The owner writes it in
 * the dashboard and can give it a start and end date, so a promotion turns
 * itself on and off. A visitor can close it; it stays closed for that text.
 */
export function AnnouncementBar() {
  const announcement = useLiveContent().marketing?.announcement;
  const [dismissed, setDismissed] = useState<string | null>(null);

  // Read after mount (never during render) so the server markup matches, and
  // off the effect body itself so no cascading render is triggered.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        setDismissed(localStorage.getItem(DISMISS_KEY));
      } catch {
        /* private browsing — the strip simply always shows */
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!announcementLive(announcement) || !announcement) return null;
  if (dismissed === announcement.text) return null;

  const close = () => {
    setDismissed(announcement.text);
    try {
      localStorage.setItem(DISMISS_KEY, announcement.text);
    } catch {}
  };

  return (
    <div className="relative z-[60] bg-accent text-on-accent">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-10 py-2 text-center text-[13px] font-medium">
        <span>{announcement.text}</span>
        {announcement.href && announcement.linkLabel && (
          <Link
            href={announcement.href}
            className="whitespace-nowrap underline underline-offset-2 hover:opacity-80"
          >
            {announcement.linkLabel}
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-opacity hover:opacity-70"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
