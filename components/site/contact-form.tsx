"use client";

import * as React from "react";
import { Check, Send } from "lucide-react";

import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * The contact form.
 *
 * Posts to the site's own /api/lead function, which stores the message where
 * the owner reads it in the dashboard. Labels are visible (not placeholders),
 * errors sit against the field they belong to, and a hidden "company" field
 * catches robots. The function also rate-limits by sender.
 *
 * NOTE: messages currently land in the dashboard inbox only. Forwarding them
 * to golovinasjordanas@gmail.com is a one-line change in
 * netlify/functions/lead.mjs once an email service is chosen — see the README.
 */
export function ContactForm({ className }: { className?: string }) {
  const { t } = useI18n();
  const successMessage = useLiveContent().marketing?.forms?.successMessage ?? t.contact.success;

  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "", // honeypot
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const [failed, setFailed] = React.useState("");

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key as keyof Errors] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t.contact.errName;
    if (!values.email.trim() && !values.phone.trim()) next.email = t.contact.errContact;
    else if (values.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()))
      next.email = t.contact.errEmail;
    return next;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "sending") return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`hv-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setFailed("");
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, source: "Contact page" }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? t.contact.error);
      }
      setState("sent");
      track("enquiry");
    } catch (e) {
      setState("idle");
      setFailed(e instanceof Error ? e.message : t.contact.error);
    }
  };

  if (state === "sent") {
    return (
      <p
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-2xl border border-success/45 bg-success/[0.08] px-5 py-4 text-sm leading-relaxed text-foreground",
          className
        )}
      >
        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        {successMessage}
      </p>
    );
  }

  const field =
    "w-full rounded-xl border bg-background px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-foreground-muted/50";
  const label = "block text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted";

  return (
    <form onSubmit={submit} noValidate className={cn("flex flex-col gap-5", className)}>
      <div>
        <label htmlFor="hv-name" className={label}>
          {t.contact.name}
        </label>
        <input
          id="hv-name"
          name="name"
          value={values.name}
          onChange={set("name")}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "hv-name-err" : undefined}
          className={cn(field, "mt-2", errors.name ? "border-error" : "border-border focus:border-accent")}
        />
        {errors.name && (
          <p id="hv-name-err" className="mt-1.5 text-[13px] text-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="hv-email" className={label}>
            {t.contact.email}
          </label>
          <input
            id="hv-email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={set("email")}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "hv-email-err" : undefined}
            className={cn(field, "mt-2", errors.email ? "border-error" : "border-border focus:border-accent")}
          />
          {errors.email && (
            <p id="hv-email-err" className="mt-1.5 text-[13px] text-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="hv-phone" className={label}>
            {t.contact.phone}{" "}
            <span className="font-normal normal-case tracking-normal opacity-70">
              ({t.contact.optional})
            </span>
          </label>
          <input
            id="hv-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={set("phone")}
            autoComplete="tel"
            className={cn(field, "mt-2 border-border focus:border-accent")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="hv-message" className={label}>
          {t.contact.message}
        </label>
        <textarea
          id="hv-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={set("message")}
          className={cn(field, "mt-2 resize-y border-border focus:border-accent")}
        />
      </div>

      {/* Hidden from people, irresistible to robots. */}
      <input
        value={values.company}
        onChange={set("company")}
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {failed && (
        <p role="alert" className="rounded-xl border border-error/45 bg-error/[0.08] px-4 py-3 text-sm text-foreground">
          {failed}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-13 w-fit items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-[15px] font-semibold text-on-accent ring-1 ring-accent-strong/45 transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60 motion-reduce:hover:scale-100"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--accent-strong) 0%, var(--accent) 48%, var(--copper) 120%)",
        }}
      >
        <Send aria-hidden className="h-4 w-4" />
        {state === "sending" ? t.contact.sending : t.contact.send}
      </button>
    </form>
  );
}
