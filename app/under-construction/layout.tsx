import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under construction",
  description:
    "New bee products, recipes and an online shop are on the way. Until then, call +354 834 0999 and we will bring a taste to you.",
  alternates: { canonical: "/under-construction/" },
  robots: { index: false, follow: true },
};

export default function UnderConstructionLayout({
  children,
}: LayoutProps<"/under-construction">) {
  return children;
}
