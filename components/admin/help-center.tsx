"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search, X } from "lucide-react";

import { HELP_ARTICLES, HELP_FAQ, searchHelp, type HelpArticle } from "@/lib/help-content";
import { Card, GhostButton, GoldButton, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const TOUR_KEY = "hv-admin-tour-done";

/** Renders **bold** and "- " bullets — the only formatting the articles use. */
function Prose({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-2.5">
      {lines.map((line, i) =>
        line.startsWith("- ") ? (
          <p key={i} className="flex gap-2 text-sm leading-relaxed text-foreground-muted">
            <span className="text-accent">•</span>
            <span dangerouslySetInnerHTML={{ __html: bold(line.slice(2)) }} />
          </p>
        ) : (
          <p
            key={i}
            className="text-sm leading-relaxed text-foreground-muted"
            dangerouslySetInnerHTML={{ __html: bold(line) }}
          />
        )
      )}
    </div>
  );
}

/** Only ever applied to our own help text, never to anything a visitor sends. */
function bold(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>');
}

function Article({ article, open }: { article: HelpArticle; open?: boolean }) {
  const [isOpen, setIsOpen] = useState(Boolean(open));
  return (
    <div className="rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="min-w-0 flex-1 text-sm">{article.title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-foreground-muted transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="border-t border-border/70 p-4">
          <Prose lines={article.body} />
        </div>
      )}
    </div>
  );
}

/** The Help tab: search, every article, and the questions people ask. */
export function HelpCenter({ onStartTour }: { onStartTour: () => void }) {
  const [query, setQuery] = useState("");
  const results = searchHelp(query);

  return (
    <div className="space-y-5">
      <Card
        title="Help"
        hint="Everything this dashboard can do, explained in plain language."
        action={<GhostButton onClick={onStartTour}>Replay the tour</GhostButton>}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help — try “price”, “picture”, “publish”"
            className={cn(inputClass, "pl-9")}
            type="search"
          />
        </div>

        <div className="mt-4 space-y-2">
          {results.map((article) => (
            <Article key={article.id} article={article} open={results.length === 1} />
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-foreground-muted">
              Nothing matched “{query}”. Try a simpler word, like “picture”.
            </p>
          )}
        </div>
      </Card>

      <Card title="Questions people ask" hint="The short answers.">
        <div className="space-y-2">
          {HELP_FAQ.map((item) => (
            <details key={item.q} className="rounded-xl border border-border bg-background">
              <summary className="min-h-11 cursor-pointer list-none px-4 py-3 text-sm marker:hidden">
                {item.q}
              </summary>
              <p className="border-t border-border/70 px-4 py-3 text-sm leading-relaxed text-foreground-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}

/**
 * The floating "?" — opens the article for the screen the owner is on, so
 * help always arrives already on the right page.
 */
export function HelpButton({ screen }: { screen: string }) {
  const [open, setOpen] = useState(false);
  const forScreen = HELP_ARTICLES.filter((a) => a.screen === screen);
  const articles = forScreen.length > 0 ? forScreen : HELP_ARTICLES.slice(0, 1);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Help for this screen"
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-bg-soft text-accent shadow-lg transition-transform hover:scale-105"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-border bg-bg-soft sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <h3 className="font-serif text-lg font-light">Help with this screen</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-11 w-11 place-items-center rounded-md text-foreground-muted hover:text-accent sm:h-9 sm:w-9"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto p-5">
              {articles.map((article) => (
                <div key={article.id}>
                  <h4 className="mb-2 text-sm font-medium text-accent">{article.title}</h4>
                  <Prose lines={article.body} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TOUR: { title: string; body: string }[] = [
  {
    title: "Welcome to your website manager",
    body: "Thirty seconds and you will know your way around. Nothing you do here reaches visitors until you press Publish.",
  },
  {
    title: "Home page",
    body: "Your front page is a stack of sections. Reorder them, hide them, edit their words and pictures, or add new ones from the library.",
  },
  {
    title: "Pictures and products",
    body: "Upload photos once and use them anywhere. Products holds your names, prices and the order customers see.",
  },
  {
    title: "Marketing",
    body: "Enquiries from your website land here, along with announcements, offer codes and your visitor numbers.",
  },
  {
    title: "Publish when you are ready",
    body: "The gold button at the top right puts everything live, in a few seconds. The “?” button, bottom right, explains whatever screen you are on.",
  },
];

/** A short walkthrough the first time someone signs in. */
export function OnboardingTour({
  run,
  onClose,
}: {
  run: boolean;
  onClose: () => void;
}) {
  // Remounting on each run resets the step; see TourPanel below.
  return run ? <TourPanel key={String(run)} onClose={onClose} /> : null;
}

function TourPanel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = TOUR[step];
  const last = step === TOUR.length - 1;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-soft p-6">
        <p className="font-display text-xs tracking-[0.2em] text-accent">
          STEP {step + 1} OF {TOUR.length}
        </p>
        <h3 className="mt-2 font-serif text-2xl font-light">{current.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{current.body}</p>

        <div className="mt-5 flex items-center gap-2">
          <div className="flex flex-1 gap-1.5">
            {TOUR.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 w-6 rounded-full",
                  i <= step ? "bg-accent" : "bg-border"
                )}
              />
            ))}
          </div>
          <GhostButton className="text-xs" onClick={onClose}>
            {last ? "Close" : "Skip"}
          </GhostButton>
          {!last && (
            <GoldButton onClick={() => setStep((s) => s + 1)}>Next</GoldButton>
          )}
          {last && <GoldButton onClick={onClose}>Start using it</GoldButton>}
        </div>
      </div>
    </div>
  );
}

export function tourSeen(): boolean {
  try {
    return localStorage.getItem(TOUR_KEY) === "1";
  } catch {
    return true;
  }
}
export function markTourSeen() {
  try {
    localStorage.setItem(TOUR_KEY, "1");
  } catch {}
}
