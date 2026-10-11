"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { ADMIN_PASS, ADMIN_USER, checkLogin } from "@/lib/admin-store";
import { GoldButton, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/** One sign-in, one dashboard. No tokens, no accounts to create. */
export function AdminLogin({ onSignIn }: { onSignIn: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (!checkLogin(user, pass)) {
      setError("Wrong username or password.");
      return;
    }
    setError("");
    onSignIn();
  };

  return (
    <main className="grid min-h-[100svh] place-items-center bg-background px-5 py-10 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-soft p-7">
        <p className="font-display text-xl tracking-[0.2em] text-accent">HONEY VOLCANO</p>
        <h1 className="mt-1 font-serif text-2xl font-light">Website manager</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          Sign in to build your home page, add pictures and keep your products up
          to date.
        </p>

        <div className="mt-6 space-y-3">
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Username"
            autoComplete="username"
            spellCheck={false}
            className={inputClass}
          />
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

        <GoldButton onClick={submit} className="mt-4 h-11 w-full">
          <span className="inline-flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" /> Sign in
          </span>
        </GoldButton>

        <p className="mt-4 rounded-lg border border-border bg-background px-3 py-2.5 text-xs leading-relaxed text-foreground-muted">
          Sign in with <span className="text-accent">{ADMIN_USER}</span> /{" "}
          <span className="text-accent">{ADMIN_PASS}</span>. Your work is saved in this
          browser and can be downloaded as a backup at any time.
        </p>
      </div>
    </main>
  );
}
