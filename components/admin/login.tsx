"use client";

import { useState } from "react";
import { Eye, EyeOff, Globe, LogIn, MonitorSmartphone } from "lucide-react";

import { ADMIN_PASS, ADMIN_USER } from "@/lib/admin-store";
import type { ApiStatus } from "@/lib/live-api";
import { GoldButton, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * One sign-in. When the site has live publishing switched on, the password is
 * checked by the website itself; otherwise the dashboard opens in browser-only
 * mode with the simple demo login.
 */
export function AdminLogin({
  status,
  onSignIn,
}: {
  status: ApiStatus;
  /** Throws with a readable message when the sign-in is refused. */
  onSignIn: (user: string, password: string) => Promise<void>;
}) {
  const live = status.kind === "live";
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await onSignIn(user, pass);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-[100svh] place-items-center bg-background px-5 py-10 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-soft p-7">
        <p className="font-display text-xl tracking-[0.2em] text-accent">HONEY VOLCANO</p>
        <h1 className="mt-1 font-serif text-2xl font-light">Website manager</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          {live
            ? "Sign in to change your website. What you publish here goes live straight away."
            : "Sign in to build your home page, add pictures and keep your products up to date."}
        </p>

        <div className="mt-6 space-y-3">
          {!live && (
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Username"
              autoComplete="username"
              spellCheck={false}
              className={inputClass}
            />
          )}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Password"
              autoComplete="current-password"
              className={cn(inputClass, "pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-foreground-muted hover:text-accent"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        <GoldButton onClick={submit} disabled={busy} className="mt-4 h-11 w-full">
          <span className="inline-flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" /> {busy ? "Signing in…" : "Sign in"}
          </span>
        </GoldButton>

        <div className="mt-4 rounded-lg border border-border bg-background px-3 py-2.5 text-xs leading-relaxed text-foreground-muted">
          {live ? (
            <span className="flex items-start gap-2">
              <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span>
                <span className="text-foreground">Live editing is on.</span> Changes you
                publish appear on honeyvolcano.com within seconds.
              </span>
            </span>
          ) : (
            <span className="flex items-start gap-2">
              <MonitorSmartphone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span>
                Sign in with <span className="text-accent">{ADMIN_USER}</span> /{" "}
                <span className="text-accent">{ADMIN_PASS}</span>. This dashboard is in
                browser-only mode: your work is saved here and can be downloaded, but it
                does not change the live site yet.
              </span>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
