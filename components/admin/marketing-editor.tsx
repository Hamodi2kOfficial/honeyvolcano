"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Check,
  Download,
  Mail,
  MailOpen,
  Megaphone,
  RefreshCw,
  Share2,
  Tag,
  Trash2,
} from "lucide-react";

import { uid, type Img } from "@/lib/home-model";
import {
  defaultMarketing,
  liveOffers,
  type Lead,
  type Marketing,
  type StatsDay,
} from "@/lib/marketing";
import { download } from "@/lib/admin-store";
import { deleteLead, fetchLeads, fetchStats, setLeadRead } from "@/lib/live-api";
import {
  Choice,
  ImagePicker,
  ListEditor,
  TextArea,
  TextInput,
} from "@/components/admin/fields";
import { Badge, Card, GhostButton, GoldButton, Stat, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Tab = "inbox" | "announcement" | "offers" | "share" | "stats";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "inbox", label: "Enquiries", icon: Mail },
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "share", label: "Share preview", icon: Share2 },
  { id: "stats", label: "Visitors", icon: BarChart3 },
];

export function MarketingEditor({
  marketing,
  setMarketing,
  media,
  addMedia,
  live,
  password,
  flash,
}: {
  marketing: Marketing;
  setMarketing: (next: Marketing) => void;
  media: Img[];
  addMedia: (img: Img) => void;
  /** Enquiries and statistics only exist once the site is publishing live. */
  live: boolean;
  password: string;
  flash: (msg: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [days, setDays] = useState<StatsDay[] | null>(null);
  const [busy, setBusy] = useState(false);

  const m = { ...defaultMarketing(), ...marketing };
  const unread = leads?.filter((l) => !l.read).length ?? 0;

  const loadLeads = useCallback(async () => {
    if (!live) return;
    setBusy(true);
    try {
      setLeads(await fetchLeads(password));
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not load the enquiries.");
    } finally {
      setBusy(false);
    }
  }, [live, password, flash]);

  const loadStats = useCallback(async () => {
    if (!live) return;
    setBusy(true);
    try {
      setDays(await fetchStats(password));
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not load the numbers.");
    } finally {
      setBusy(false);
    }
  }, [live, password, flash]);

  // Fetch the first time a tab is opened, off the effect body so the loading
  // state is never set synchronously during render.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      if (tab === "inbox" && leads === null) void loadLeads();
      if (tab === "stats" && days === null) void loadStats();
    });
    return () => {
      cancelled = true;
    };
  }, [tab, leads, days, loadLeads, loadStats]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-bg-soft p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              tab === id
                ? "bg-accent/15 text-accent"
                : "text-foreground-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {id === "inbox" && unread > 0 && (
              <span className="rounded-full bg-accent px-1.5 text-[10px] font-semibold text-[#1c1206]">
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "inbox" && (
        <Inbox
          leads={leads}
          live={live}
          busy={busy}
          onReload={loadLeads}
          onToggleRead={async (lead) => {
            await setLeadRead(password, lead.id, !lead.read);
            setLeads((list) =>
              (list ?? []).map((l) => (l.id === lead.id ? { ...l, read: !l.read } : l))
            );
          }}
          onDelete={async (lead) => {
            if (!window.confirm(`Delete the enquiry from ${lead.name}?`)) return;
            await deleteLead(password, lead.id);
            setLeads((list) => (list ?? []).filter((l) => l.id !== lead.id));
          }}
          flash={flash}
        />
      )}

      {tab === "announcement" && (
        <Card
          title="Announcement strip"
          hint="A gold band across the very top of every page. Give it dates and it switches itself on and off."
          action={
            <Badge tone={m.announcement.enabled ? "good" : "neutral"}>
              {m.announcement.enabled ? "On" : "Off"}
            </Badge>
          }
        >
          <label className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={m.announcement.enabled}
              onChange={(e) =>
                setMarketing({
                  ...m,
                  announcement: { ...m.announcement, enabled: e.target.checked },
                })
              }
              className="accent-[#D4AF37]"
            />
            Show the strip on the site
          </label>

          <div className="space-y-4">
            <TextInput
              label="Text"
              value={m.announcement.text}
              onChange={(text) => setMarketing({ ...m, announcement: { ...m.announcement, text } })}
              placeholder="Fresh harvest — taste before you order"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Link text (optional)"
                value={m.announcement.linkLabel}
                onChange={(linkLabel) =>
                  setMarketing({ ...m, announcement: { ...m.announcement, linkLabel } })
                }
              />
              <TextInput
                label="Link goes to"
                value={m.announcement.href}
                onChange={(href) => setMarketing({ ...m, announcement: { ...m.announcement, href } })}
                placeholder="/products"
              />
            </div>
            <DateWindow
              from={m.announcement.from}
              until={m.announcement.until}
              onChange={(from, until) =>
                setMarketing({ ...m, announcement: { ...m.announcement, from, until } })
              }
            />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs text-foreground-muted">How it will look</p>
            <div className="flex items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2 text-center text-[13px] font-medium text-[#1c1206]">
              <span>{m.announcement.text || "Your announcement"}</span>
              {m.announcement.linkLabel && (
                <span className="underline underline-offset-2">{m.announcement.linkLabel}</span>
              )}
            </div>
          </div>
        </Card>
      )}

      {tab === "offers" && (
        <Card
          title="Offers & codes"
          hint="Shown with the catalogue on the products page. Customers mention the code when they call or order."
          action={
            <Badge tone={liveOffers(m.offers).length ? "good" : "neutral"}>
              {liveOffers(m.offers).length} running now
            </Badge>
          }
        >
          <ListEditor
            label="Offers"
            items={m.offers}
            onChange={(offers) => setMarketing({ ...m, offers })}
            onAdd={() => ({
              id: uid("o"),
              code: "HONEY10",
              percent: 10,
              description: "off your order",
              from: "",
              until: "",
              enabled: true,
            })}
            addLabel="Add an offer"
            titleOf={(o) => `${o.code} — ${o.percent}% ${o.enabled ? "" : "(off)"}`}
            renderItem={(o, update) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput
                    label="Code"
                    value={o.code}
                    onChange={(code) => update({ code: code.toUpperCase().trim() })}
                  />
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-foreground-muted">
                      Percentage off
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={o.percent}
                      onChange={(e) => update({ percent: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </label>
                </div>
                <TextInput
                  label="Description"
                  value={o.description}
                  onChange={(description) => update({ description })}
                  hint="Shown after the percentage, e.g. “off orders over 5 000 ISK”."
                />
                <DateWindow
                  from={o.from}
                  until={o.until}
                  onChange={(from, until) => update({ from, until })}
                />
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={o.enabled}
                    onChange={(e) => update({ enabled: e.target.checked })}
                    className="accent-[#D4AF37]"
                  />
                  Show this offer
                </label>
              </>
            )}
          />
        </Card>
      )}

      {tab === "share" && (
        <Card
          title="Share preview"
          hint="What people see when your link is sent on WhatsApp or posted on Facebook — and the title in the browser tab."
        >
          <div className="space-y-4">
            <TextInput
              label="Title"
              value={m.share.title}
              onChange={(title) => setMarketing({ ...m, share: { ...m.share, title } })}
            />
            <TextArea
              label="Description"
              value={m.share.description}
              rows={3}
              onChange={(description) =>
                setMarketing({ ...m, share: { ...m.share, description } })
              }
            />
            <ImagePicker
              label="Picture"
              value={{ src: m.share.image, alt: "" }}
              media={media}
              onAddMedia={addMedia}
              onChange={(img) => setMarketing({ ...m, share: { ...m.share, image: img.src } })}
            />
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-background">
            <p className="border-b border-border px-4 py-2 text-xs text-foreground-muted">
              Preview
            </p>
            <div className="flex gap-3 p-4">
              {m.share.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.share.image}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{m.share.title}</p>
                <p className="line-clamp-2 text-xs text-foreground-muted">
                  {m.share.description}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-foreground-muted">
                  honeyvolcano.com
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {tab === "stats" && (
        <StatsPanel days={days} live={live} busy={busy} onReload={loadStats} />
      )}

      {tab === "inbox" && (
        <Card
          title="Where the forms appear"
          hint="Enquiries can come from the products page and from any “Enquiry form” section you add to the home page."
        >
          <div className="space-y-4">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={m.forms.onProductsPage}
                onChange={(e) =>
                  setMarketing({
                    ...m,
                    forms: { ...m.forms, onProductsPage: e.target.checked },
                  })
                }
                className="accent-[#D4AF37]"
              />
              Show the form in the taste block on the products page
            </label>
            <Choice
              label="Ask for a phone number"
              value={m.forms.askPhone ? "yes" : "no"}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "Email only" },
              ]}
              onChange={(v) =>
                setMarketing({ ...m, forms: { ...m.forms, askPhone: v === "yes" } })
              }
            />
            <TextInput
              label="Thank-you message"
              value={m.forms.successMessage}
              onChange={(successMessage) =>
                setMarketing({ ...m, forms: { ...m.forms, successMessage } })
              }
            />
          </div>
        </Card>
      )}
    </div>
  );
}

function Inbox({
  leads,
  live,
  busy,
  onReload,
  onToggleRead,
  onDelete,
  flash,
}: {
  leads: Lead[] | null;
  live: boolean;
  busy: boolean;
  onReload: () => void;
  onToggleRead: (lead: Lead) => Promise<void>;
  onDelete: (lead: Lead) => Promise<void>;
  flash: (msg: string) => void;
}) {
  if (!live) {
    return (
      <Card title="Enquiries" hint="Needs live publishing switched on.">
        <p className="text-sm leading-relaxed text-foreground-muted">
          Enquiries are stored on the website itself, so this inbox fills up once the
          site is publishing live. The forms are already on the site.
        </p>
      </Card>
    );
  }

  const exportCsv = () => {
    const rows = [
      ["Date", "Name", "Email", "Phone", "Message", "From"],
      ...(leads ?? []).map((l) => [l.at, l.name, l.email, l.phone, l.message, l.source]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    download(`honeyvolcano-enquiries-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    flash("Enquiries downloaded.");
  };

  return (
    <Card
      title="Enquiries"
      hint={leads ? `${leads.length} in total` : "Loading…"}
      action={
        <div className="flex gap-2">
          <GhostButton className="px-3 py-1.5 text-xs" onClick={onReload} disabled={busy}>
            <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} /> Refresh
          </GhostButton>
          {(leads?.length ?? 0) > 0 && (
            <GoldButton className="h-8 text-xs" onClick={exportCsv}>
              <span className="inline-flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export
              </span>
            </GoldButton>
          )}
        </div>
      }
    >
      {leads === null ? (
        <p className="py-6 text-center text-sm text-foreground-muted">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="py-8 text-center text-sm text-foreground-muted">
          No enquiries yet. They will appear here the moment someone sends one.
        </p>
      ) : (
        <ul className="space-y-2">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className={cn(
                "rounded-xl border p-4",
                lead.read ? "border-border bg-background" : "border-accent/40 bg-accent/[0.05]"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{lead.name}</span>
                {!lead.read && <Badge tone="gold">new</Badge>}
                <span className="ml-auto text-[11px] text-foreground-muted">
                  {new Date(lead.at).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-foreground-muted">
                {[lead.email, lead.phone].filter(Boolean).join(" · ")} — {lead.source}
              </p>
              {lead.message && (
                <p className="mt-2 whitespace-pre-line text-sm text-foreground">
                  {lead.message}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <Mail className="h-3.5 w-3.5" /> Reply
                  </a>
                )}
                <GhostButton
                  className="px-3 py-1.5 text-xs"
                  onClick={() => void onToggleRead(lead)}
                >
                  {lead.read ? (
                    <>
                      <Mail className="h-3.5 w-3.5" /> Mark unread
                    </>
                  ) : (
                    <>
                      <MailOpen className="h-3.5 w-3.5" /> Mark read
                    </>
                  )}
                </GhostButton>
                <GhostButton
                  className="px-3 py-1.5 text-xs hover:border-red-400/60 hover:text-red-400"
                  onClick={() => void onDelete(lead)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </GhostButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function StatsPanel({
  days,
  live,
  busy,
  onReload,
}: {
  days: StatsDay[] | null;
  live: boolean;
  busy: boolean;
  onReload: () => void;
}) {
  if (!live) {
    return (
      <Card title="Visitors" hint="Needs live publishing switched on.">
        <p className="text-sm leading-relaxed text-foreground-muted">
          The site counts visits by itself — no Google, no cookies, nothing to accept.
          The numbers appear here once the site is publishing live.
        </p>
      </Card>
    );
  }

  const list = days ?? [];
  const total = (pick: (d: StatsDay) => number) => list.reduce((sum, d) => sum + pick(d), 0);
  const views = total((d) => Object.values(d.views ?? {}).reduce((a, b) => a + b, 0));
  const taste = total((d) => d.events?.taste ?? 0);
  const enquiries = total((d) => d.events?.enquiry ?? 0);
  const last7 = list.slice(-7);
  const peak = Math.max(
    1,
    ...last7.map((d) => Object.values(d.views ?? {}).reduce((a, b) => a + b, 0))
  );

  return (
    <div className="space-y-5">
      <Card
        title="Visitors"
        hint={list.length ? `Counted over the last ${list.length} day(s).` : "Nothing counted yet."}
        action={
          <GhostButton className="px-3 py-1.5 text-xs" onClick={onReload} disabled={busy}>
            <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} /> Refresh
          </GhostButton>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Page views" value={String(views)} sub="all pages" />
          <Stat label="Taste button" value={String(taste)} sub="phone revealed" />
          <Stat label="Enquiries sent" value={String(enquiries)} sub="through the forms" />
        </div>

        {last7.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs text-foreground-muted">Last 7 days</p>
            <div className="flex items-end gap-2">
              {last7.map((d) => {
                const n = Object.values(d.views ?? {}).reduce((a, b) => a + b, 0);
                return (
                  <div key={d.date} className="flex-1 text-center">
                    <div
                      className="mx-auto w-full rounded-t bg-accent/70"
                      style={{ height: `${Math.max(4, (n / peak) * 90)}px` }}
                      title={`${n} views`}
                    />
                    <p className="mt-1 text-[10px] text-foreground-muted">
                      {d.date.slice(5)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {list.length > 0 && (
        <Card title="Most visited pages" hint="Across the days counted.">
          <ul className="space-y-1.5">
            {Object.entries(
              list.reduce<Record<string, number>>((acc, day) => {
                for (const [path, n] of Object.entries(day.views ?? {})) {
                  acc[path] = (acc[path] ?? 0) + n;
                }
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([path, n]) => (
                <li key={path} className="flex items-center gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-foreground-muted">{path}</span>
                  <span className="tabular-nums">{n}</span>
                </li>
              ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/** A start and end date, both optional. */
function DateWindow({
  from,
  until,
  onChange,
}: {
  from: string;
  until: string;
  onChange: (from: string, until: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1.5 block text-xs text-foreground-muted">
          Starts (optional)
        </span>
        <input
          type="date"
          value={from}
          onChange={(e) => onChange(e.target.value, until)}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs text-foreground-muted">Ends (optional)</span>
        <input
          type="date"
          value={until}
          onChange={(e) => onChange(from, e.target.value)}
          className={inputClass}
        />
      </label>
      {(from || until) && (
        <button
          type="button"
          onClick={() => onChange("", "")}
          className="justify-self-start text-[11px] text-foreground-muted hover:text-accent sm:col-span-2"
        >
          <Check className="mr-1 inline h-3 w-3" /> clear the dates
        </button>
      )}
    </div>
  );
}
