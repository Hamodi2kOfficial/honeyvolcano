/**
 * The marketing side of the dashboard: the announcement strip, offer codes,
 * what the site looks like when it is shared, and the enquiries visitors send.
 *
 * Everything here is content the owner publishes, except leads and statistics,
 * which are collected by the site itself and only read by the dashboard.
 */

export type Announcement = {
  enabled: boolean;
  text: string;
  linkLabel: string;
  href: string;
  /** ISO dates (yyyy-mm-dd). Empty means "no limit". */
  from: string;
  until: string;
};

export type Offer = {
  id: string;
  code: string;
  /** Percentage off, e.g. 15. */
  percent: number;
  description: string;
  from: string;
  until: string;
  enabled: boolean;
};

export type SharePreview = {
  /** Shown as the browser tab title and the headline of a shared link. */
  title: string;
  description: string;
  /** Picture used when the link is sent on WhatsApp, Facebook, etc. */
  image: string;
};

export type FormSettings = {
  /** Show the enquiry form in the taste block of the products page. */
  onProductsPage: boolean;
  /** Ask for a phone number as well as an email. */
  askPhone: boolean;
  successMessage: string;
};

export type Marketing = {
  announcement: Announcement;
  offers: Offer[];
  share: SharePreview;
  forms: FormSettings;
};

export type Lead = {
  id: string;
  at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Where on the site it was sent from. */
  source: string;
  read: boolean;
};

export type StatsDay = {
  date: string;
  views: Record<string, number>;
  events: Record<string, number>;
};

export function defaultMarketing(): Marketing {
  return {
    announcement: {
      enabled: false,
      text: "Fresh harvest — taste before you order",
      linkLabel: "See the products",
      href: "/products",
      from: "",
      until: "",
    },
    offers: [],
    share: {
      title: "Honey Volcano — Raw Honey & Bee Products",
      description:
        "Raw Lithuanian honey and every other bee product — pollen, bee bread, honeycomb and honey treats — sold in Iceland. Call to taste before you buy.",
      image: "/sections/all-bee-products.webp",
    },
    forms: {
      onProductsPage: true,
      askPhone: true,
      successMessage: "Thank you — we will be in touch shortly.",
    },
  };
}

/** True when today sits inside the (optional) from/until window. */
export function isWithinWindow(
  from: string | undefined,
  until: string | undefined,
  now = new Date()
): boolean {
  const today = now.toISOString().slice(0, 10);
  if (from && today < from) return false;
  if (until && today > until) return false;
  return true;
}

/** Offers that should be visible to customers right now. */
export function liveOffers(offers: Offer[] | undefined, now = new Date()): Offer[] {
  return (offers ?? []).filter(
    (o) => o.enabled && o.code.trim() !== "" && isWithinWindow(o.from, o.until, now)
  );
}

/** Whether the announcement strip should be on the site right now. */
export function announcementLive(
  announcement: Announcement | undefined,
  now = new Date()
): boolean {
  if (!announcement?.enabled) return false;
  if (announcement.text.trim() === "") return false;
  return isWithinWindow(announcement.from, announcement.until, now);
}
