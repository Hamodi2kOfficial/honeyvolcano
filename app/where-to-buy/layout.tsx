import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where to buy",
  description:
    "Find Honey Volcano honey in shops across Iceland — Reykjavík, Kópavogur, Hafnarfjörður, Mosfellsbær, Selfoss, Hveragerði, Ólafsvík and more. Same price as ours.",
  alternates: { canonical: "/where-to-buy/" },
};

export default function StoresLayout({ children }: LayoutProps<"/where-to-buy">) {
  return children;
}
