"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Plus, Trash2, ExternalLink, LogOut } from "lucide-react";

import {
  verifyToken,
  getToken,
  setToken,
  clearToken,
  loadJson,
  saveJson,
} from "@/lib/github";

type Product = {
  id: string;
  name: string;
  priceISK: number | null;
  tba: boolean;
  image?: string;
};
type ProductsFile = { products: Product[] };
type SiteFile = { phone: string; phoneIntl: string; email: string; businessNote: string };

export default function AdminPage() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready">("checking");
  const [tokenInput, setTokenInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [productsSha, setProductsSha] = useState("");
  const [site, setSite] = useState<SiteFile | null>(null);
  const [siteSha, setSiteSha] = useState("");
  const [savingProducts, setSavingProducts] = useState(false);
  const [savingSite, setSavingSite] = useState(false);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 4000);
  };

  const loadAll = useCallback(async (token: string) => {
    const p = await loadJson<ProductsFile>("content/products.json", token);
    const s = await loadJson<SiteFile>("content/site.json", token);
    setProducts(p.data.products);
    setProductsSha(p.sha);
    setSite(s.data);
    setSiteSha(s.sha);
    setPhase("ready");
  }, []);

  // On mount: if a token is stored, try to use it.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) {
        if (!cancelled) setPhase("login");
        return;
      }
      try {
        await loadAll(token);
      } catch {
        clearToken();
        if (!cancelled) setPhase("login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAll]);

  const connect = async () => {
    setLoginError("");
    setConnecting(true);
    try {
      await verifyToken(tokenInput.trim());
      setToken(tokenInput.trim());
      await loadAll(tokenInput.trim());
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : "Could not connect.");
    } finally {
      setConnecting(false);
    }
  };

  const logout = () => {
    clearToken();
    setProducts([]);
    setSite(null);
    setPhase("login");
    setTokenInput("");
  };

  const saveProducts = async () => {
    const token = getToken();
    if (!token) return;
    setSavingProducts(true);
    try {
      const newSha = await saveJson(
        "content/products.json",
        { products },
        productsSha,
        token,
        "Update products via admin"
      );
      setProductsSha(newSha);
      flash("Saved ✓ — the site updates in ~1–2 minutes.");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingProducts(false);
    }
  };

  const saveSite = async () => {
    const token = getToken();
    if (!token || !site) return;
    setSavingSite(true);
    try {
      const newSha = await saveJson(
        "content/site.json",
        site,
        siteSha,
        token,
        "Update contact & note via admin"
      );
      setSiteSha(newSha);
      flash("Saved ✓ — the site updates in ~1–2 minutes.");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingSite(false);
    }
  };

  // ---- product row helpers ----
  const updateProduct = (i: number, patch: Partial<Product>) =>
    setProducts((list) => list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const move = (i: number, dir: -1 | 1) =>
    setProducts((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const remove = (i: number) =>
    setProducts((list) => list.filter((_, idx) => idx !== i));
  const addProduct = () =>
    setProducts((list) => [
      ...list,
      { id: `p-${Date.now()}`, name: "New product", priceISK: 0, tba: false },
    ]);

  if (phase === "checking") {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-background text-foreground">
        <p className="text-sm text-foreground-muted">Loading…</p>
      </main>
    );
  }

  if (phase === "login") {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-background px-5 text-foreground">
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-soft p-7">
          <p className="font-display text-xl tracking-[0.2em] text-accent">HONEY VOLCANO</p>
          <h1 className="mt-1 font-serif text-2xl font-light">Admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Paste your GitHub access token to sign in. It is stored only in this
            browser and lets you edit the site.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tokenInput && connect()}
            placeholder="GitHub token (github_pat_…)"
            className="mt-5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            autoComplete="off"
            spellCheck={false}
          />
          {loginError && <p className="mt-2 text-sm text-red-400">{loginError}</p>}
          <button
            type="button"
            onClick={connect}
            disabled={!tokenInput || connecting}
            className="mt-4 h-11 w-full rounded-lg bg-accent px-4 font-semibold text-[#1c1206] transition-opacity disabled:opacity-50"
          >
            {connecting ? "Connecting…" : "Sign in"}
          </button>
          <details className="mt-5 text-xs text-foreground-muted">
            <summary className="cursor-pointer text-accent/90">How do I get a token?</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-4 leading-relaxed">
              <li>
                Go to GitHub → Settings → Developer settings → Fine-grained tokens →
                Generate new token.
              </li>
              <li>Repository access → Only select repositories → honeyvolcano.</li>
              <li>Permissions → Repository → Contents → Read and write.</li>
              <li>Generate, copy the token, and paste it above.</li>
            </ol>
          </details>
        </div>
      </main>
    );
  }

  // ready
  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg-soft/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-3.5">
          <div>
            <p className="font-display text-sm tracking-[0.2em] text-accent">HONEY VOLCANO</p>
            <p className="text-xs text-foreground-muted">Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs transition-colors hover:border-accent/60 hover:text-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs transition-colors hover:border-accent/60 hover:text-accent"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-5 py-8">
        {/* Products */}
        <section className="rounded-2xl border border-border bg-bg-soft p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-light">Products</h2>
            <button
              type="button"
              onClick={saveProducts}
              disabled={savingProducts}
              className="h-9 rounded-lg bg-accent px-4 text-sm font-semibold text-[#1c1206] transition-opacity disabled:opacity-50"
            >
              {savingProducts ? "Saving…" : "Save products"}
            </button>
          </div>
          <p className="mt-1 text-xs text-foreground-muted">
            Name, price in ISK, and whether the price is still to be announced.
          </p>

          <div className="mt-4 space-y-3">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center"
              >
                <input
                  value={p.name}
                  onChange={(e) => updateProduct(i, { name: e.target.value })}
                  className="flex-1 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm outline-none focus:border-accent"
                  placeholder="Product name"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={p.tba || p.priceISK == null ? "" : p.priceISK}
                    onChange={(e) =>
                      updateProduct(i, { priceISK: e.target.value === "" ? null : Number(e.target.value) })
                    }
                    disabled={p.tba}
                    className="w-24 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-40"
                    placeholder="ISK"
                  />
                  <span className="text-xs text-foreground-muted">ISK</span>
                  <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 text-xs text-foreground-muted">
                    <input
                      type="checkbox"
                      checked={p.tba}
                      onChange={(e) =>
                        updateProduct(i, { tba: e.target.checked, priceISK: e.target.checked ? null : 0 })
                      }
                      className="accent-[#D4AF37]"
                    />
                    TBA
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded-md p-1.5 text-foreground-muted hover:text-accent">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded-md p-1.5 text-foreground-muted hover:text-accent">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => remove(i)} aria-label="Delete" className="rounded-md p-1.5 text-foreground-muted hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addProduct}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-accent/60 hover:text-accent"
          >
            <Plus className="h-4 w-4" /> Add product
          </button>
        </section>

        {/* Contact & note */}
        {site && (
          <section className="rounded-2xl border border-border bg-bg-soft p-5 md:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-light">Contact &amp; business note</h2>
              <button
                type="button"
                onClick={saveSite}
                disabled={savingSite}
                className="h-9 rounded-lg bg-accent px-4 text-sm font-semibold text-[#1c1206] transition-opacity disabled:opacity-50"
              >
                {savingSite ? "Saving…" : "Save"}
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Phone (shown on the taste button)">
                <input value={site.phone} onChange={(e) => setSite({ ...site, phone: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
              </Field>
              <Field label="Phone with country code (footer)">
                <input value={site.phoneIntl} onChange={(e) => setSite({ ...site, phoneIntl: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
              </Field>
              <Field label="Email (footer)">
                <input value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Business / B2B discount note (on the products page)">
                <textarea
                  value={site.businessNote}
                  onChange={(e) => setSite({ ...site, businessNote: e.target.value })}
                  rows={3}
                  className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </Field>
            </div>
          </section>
        )}
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border border-accent/40 bg-bg-soft px-5 py-2.5 text-sm text-foreground shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      {children}
    </label>
  );
}
