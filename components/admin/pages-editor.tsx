"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { PAGE_GROUPS } from "@/lib/site-copy";
import { CopyFields, LanguageBar, type CopyState } from "@/components/admin/copy-editor";
import { Card } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * The words that are not part of a home-page section: the menu, the products
 * page, the "under construction" plate. Same per-language editing as the rest.
 */
export function PagesEditor({ state }: { state: CopyState }) {
  const [open, setOpen] = useState<string | null>(PAGE_GROUPS[0]?.id ?? null);
  const allKeys = PAGE_GROUPS.flatMap((g) => g.content.text.map((f) => f.key));

  return (
    <div className="space-y-5">
      <Card
        title="Other pages & menus"
        hint="Everything written outside the home-page sections. Pick a language, then rewrite anything you like."
      >
        <LanguageBar state={state} keys={allKeys} />

        <div className="mt-4 space-y-2">
          {PAGE_GROUPS.map((group) => {
            const isOpen = open === group.id;
            return (
              <div key={group.id} className="rounded-xl border border-border bg-background">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : group.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{group.label}</span>
                    <span className="block text-[11px] text-foreground-muted">
                      {group.hint}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-foreground-muted transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/70 p-4">
                    <CopyFields group={group.content} state={state} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
