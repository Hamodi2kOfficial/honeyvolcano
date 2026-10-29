import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Honey Volcano",
  description:
    "Jordanas is Lithuanian; for nine years Iceland has been his home. The honey comes from the quiet plains of Lithuania and is carried north by hand. Let happiness erupt.",
  alternates: { canonical: "/about/" },
};

export default function AboutLayout({ children }: LayoutProps<"/about">) {
  return children;
}
