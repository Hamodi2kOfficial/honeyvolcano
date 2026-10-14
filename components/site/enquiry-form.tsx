"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

import { useLiveContent } from "@/components/live-content";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * Where a visitor's interest actually reaches the owner: the details are sent
 * to the site's own inbox and appear in the dashboard. No third-party service,
 * nothing shared with anyone.
 */
export function EnquiryForm({
  source,
  buttonLabel = "Send",
  askPhone = true,
  className,
}: {
  /** Which part of the site this was sent from, shown in the inbox. */
  source: string;
  buttonLabel?: string;
  askPhone?: boolean;
  className?: string;
}) {
  const successMessage =
    useLiveContent().marketing?.forms?.successMessage ??
    "Thank you — we will be in touch shortly.";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "sending") return;
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, company, source }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Could not send that just now.");
      }
      setState("sent");
      track("enquiry");
    } catch (e) {
      setState("idle");
      setError(e instanceof Error ? e.message : "Could not send that just now.");
    }
  };

  if (state === "sent") {
    return (
      <p
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/[0.07] px-5 py-4 text-sm text-foreground",
          className
        )}
      >
        <Check className="h-4 w-4 text-accent" /> {successMessage}
      </p>
    );
  }

  const field =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent";

  return (
    <form onSubmit={submit} className={cn("space-y-3", className)}>
      <div className={askPhone ? "grid gap-3 sm:grid-cols-3" : "grid gap-3 sm:grid-cols-2"}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          required
          className={field}
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="email"
          className={field}
        />
        {askPhone && (
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            type="tel"
            autoComplete="tel"
            className={field}
          />
        )}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Anything you would like to tell us (optional)"
        rows={3}
        className={cn(field, "resize-y")}
      />
      {/* Hidden from people, irresistible to robots. */}
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-8 text-[15px] font-semibold text-[#1c1206] transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #F3CE72 0%, #E5B869 42%, #C79A3B 100%)",
        }}
      >
        <Send className="h-4 w-4" />
        {state === "sending" ? "Sending…" : buttonLabel}
      </button>
    </form>
  );
}
