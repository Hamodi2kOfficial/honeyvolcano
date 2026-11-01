import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact information",
  description:
    "Call Honey Volcano on +354 834 0999, or leave a message and we will come back to you. Jordanas Golovinas, Miðholt 1, 270 Mosfellsbær, Iceland.",
  alternates: { canonical: "/contact/" },
};

export default function ContactLayout({ children }: LayoutProps<"/contact">) {
  return children;
}
