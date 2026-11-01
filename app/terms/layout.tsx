import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms that apply when you use honeyvolcano.com or order from us: prices, ordering by phone, payment, food safety, and what happens if something is wrong.",
  alternates: { canonical: "/terms/" },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: LayoutProps<"/terms">) {
  return children;
}
