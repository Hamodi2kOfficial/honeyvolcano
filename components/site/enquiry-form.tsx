"use client";

import * as React from "react";
import { Check, Send } from "lucide-react";

import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * The short enquiry form: on the products page, and in any "form" block the
 * owner adds to the home page.
 *
 * Details go to the site's own inbox and appear in the dashboard — no
 * third-party service, nothing shared with anyone. Labels are visible (a
 * placeholder disappears the moment you type into it), and the hidden
 * "company" field catches robots; the function behind it also rate-limits.
 */
export function EnquiryForm({
  source,
  buttonLabel,
  askPhone = true,
  className,
}: {
  /** Which part of the site this was sent from, shown in the inbox. */
  source: string;
  buttonLabel?: string;
  askPhone?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const successMessage =
    useLiveContent().marketing?.forms?.successMessage ?? t.contact.success;
  const id = React.useId();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [company, setCompany] = React.useState(""); // honeypot
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = React.useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "sending") return;

    if (!name.trim()) return setError(t.contact.errName);
    if (!email.trim() && !phone.trim()) return setError(t.contact.errContact);
    if (email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      return setError(t.contact.errEmail);

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
        throw new Error(body?.error ?? t.contact.error);
      }
      setState("sent");
      track("enquiry");
    } catch (e) {
      setState("idle");
      setError(e instanceof Error ? e.message : t.contact.error);
    }
  };

  if (state === "sent") {
    return (
      <p
        role="status"
        className={cn(
          "flex items-start gap-2.5 rounded-xl border border-success/45 bg-success/[0.08] px-5 py-4 text-sm leading-relaxed text-foreground",
          className
        )}
      >
        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {successMessage}
      </p>
    );
  }

  const field =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent";
  const label = "block text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted";

  return (
    <form onSubmit={submit} noValidate className={cn("space-y-3.5", className)}>
      <div className={askPhone ? "grid gap-3 sm:grid-cols-3" : "grid gap-3 sm:grid-cols-2"}>
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            {t.contact.name}
          </label>
          <input
            id={`${id}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={cn(field, "mt-1.5")}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            {t.contact.email}
          </label>
          <input
            id={`${id}-email`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            inputMode="email"
            autoComplete="email"
            className={cn(field, "mt-1.5")}
          />
        </div>
        {askPhone && (
          <div>
            <label htmlFor={`${id}-phone`} className={label}>
              {t.contact.phone}
            </label>
            <input
              id={`${id}-phone`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={cn(field, "mt-1.5")}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={label}>
          {t.contact.message}{" "}
          <span className="font-normal normal-case tracking-normal opacity-70">
            ({t.contact.optional})
          </span>
        </label>
        <textarea
          id={`${id}-message`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={cn(field, "mt-1.5 resize-y")}
        />
      </div>

      {/* Hidden from people, irresistible to robots. */}
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-8 text-[15px] font-semibold text-on-accent ring-1 ring-accent-strong/45 transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60 motion-reduce:hover:scale-100"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--accent-strong) 0%, var(--accent) 48%, var(--copper) 120%)",
        }}
      >
        <Send aria-hidden className="h-4 w-4" />
        {state === "sending" ? t.contact.sending : (buttonLabel ?? t.contact.send)}
      </button>
    </form>
  );
}
