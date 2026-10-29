import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What happens to your information on honeyvolcano.com: what the contact form collects, why, how long it is kept, and your rights under the GDPR and Act No. 90/2018.",
  alternates: { canonical: "/privacy/" },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: LayoutProps<"/privacy">) {
  return children;
}
