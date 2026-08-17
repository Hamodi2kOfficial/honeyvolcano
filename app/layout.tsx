import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/i18n";
import { SmoothScroll } from "@/components/smooth-scroll";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Honey Volcano — Raw Forest Honey",
  description:
    "Premium raw forest honey, harvested from untamed mountains and wild lupine fields. Pure, unfiltered, and artisanal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${cinzel.variable} ${cormorant.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <I18nProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
