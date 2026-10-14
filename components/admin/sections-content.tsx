"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import type { Product, SiteFile } from "@/lib/admin-store";
import { Card, Field, GhostButton, IconButton, inputClass } from "@/components/admin/ui";

/** Products editor — the live catalogue (name, ISK price, order, TBA flag). */
export function ProductsSection({
  products,
  setProducts,
}: {
  products: Product[];
  setProducts: (next: Product[]) => void;
}) {
  const patch = (i: number, p: Partial<Product>) =>
    setProducts(products.map((item, idx) => (idx === i ? { ...item, ...p } : item)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= products.length) return;
    const next = [...products];
    [next[i], next[j]] = [next[j], next[i]];
    setProducts(next);
  };

  return (
    <Card
      title="Products"
      hint="Name, price in ISK, display order, and whether the price is still to be announced."
    >
      <div className="space-y-3">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center"
          >
            <input
              value={p.name}
              onChange={(e) => patch(i, { name: e.target.value })}
              placeholder="Product name"
              className="flex-1 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={p.tba || p.priceISK == null ? "" : p.priceISK}
                onChange={(e) =>
                  patch(i, {
                    priceISK: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                disabled={p.tba}
                placeholder="ISK"
                className="w-24 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-40"
              />
              <span className="text-xs text-foreground-muted">ISK</span>
              <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 text-xs text-foreground-muted">
                <input
                  type="checkbox"
                  checked={p.tba}
                  onChange={(e) =>
                    patch(i, {
                      tba: e.target.checked,
                      priceISK: e.target.checked ? null : 0,
                    })
                  }
                  className="accent-[#D4AF37]"
                />
                TBA
              </label>
            </div>
            <div className="flex items-center gap-1">
              <IconButton label="Move up" onClick={() => move(i, -1)}>
                <ArrowUp className="h-4 w-4" />
              </IconButton>
              <IconButton label="Move down" onClick={() => move(i, 1)}>
                <ArrowDown className="h-4 w-4" />
              </IconButton>
              <IconButton
                label="Delete"
                danger
                onClick={() => setProducts(products.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <GhostButton
        className="mt-3"
        onClick={() =>
          setProducts([
            ...products,
            { id: `p-${Date.now()}`, name: "New product", priceISK: 0, tba: false },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add product
      </GhostButton>
    </Card>
  );
}

/** Contact details and the B2B discount note shown on the public site. */
export function ContentSection({
  site,
  setSite,
}: {
  site: SiteFile;
  setSite: (next: SiteFile) => void;
}) {
  return (
    <Card
      title="Contact & business note"
      hint="These appear on the taste button, in the footer and on the products page."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone (shown on the taste button)">
          <input
            value={site.phone}
            onChange={(e) => setSite({ ...site, phone: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Phone with country code (footer)">
          <input
            value={site.phoneIntl}
            onChange={(e) => setSite({ ...site, phoneIntl: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Email (footer)">
          <input
            value={site.email}
            onChange={(e) => setSite({ ...site, email: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Business / B2B discount note (products page)">
          <textarea
            value={site.businessNote}
            onChange={(e) => setSite({ ...site, businessNote: e.target.value })}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </Field>
      </div>
    </Card>
  );
}

