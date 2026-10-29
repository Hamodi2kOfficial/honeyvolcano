import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/i18n";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LiveContentProvider } from "@/components/live-content";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { SiteFooter } from "@/components/site/footer";
import { StickyCall } from "@/components/site/sticky-call";
import { ThemeProvider, themeScript } from "@/components/theme";

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

const DESCRIPTION =
  "Raw Lithuanian honey and every other bee product — pollen, bee bread, honeycomb and honey treats — sold in Iceland. Call to taste before you buy: +354 834 0999.";

export const metadata: Metadata = {
  metadataBase: new URL("https://honeyvolcano.com"),
  title: {
    default: "Honey Volcano — Raw Honey & Bee Products",
    template: "%s — Honey Volcano",
  },
  description: DESCRIPTION,
  applicationName: "Honey Volcano",
  keywords: [
    "raw honey Iceland",
    "Lithuanian honey",
    "bee pollen",
    "bee bread",
    "honeycomb",
    "Honey Volcano",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Honey Volcano",
    title: "Honey Volcano — Raw Honey & Bee Products",
    description: DESCRIPTION,
    url: "https://honeyvolcano.com",
    images: [{ url: "/sections/all-bee-products.webp", width: 1920, height: 1072 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Honey Volcano — Raw Honey & Bee Products",
    description: DESCRIPTION,
    images: ["/sections/all-bee-products.webp"],
  },
};

/**
 * Who we are, for search engines. Kept to what the site can actually back up:
 * the business details, the phone number and the languages we answer in.
 */
const ORGANISATION = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Honey Volcano",
  description: DESCRIPTION,
  url: "https://honeyvolcano.com",
  telephone: "+354 834 0999",
  email: "golovinasjordanas@gmail.com",
  vatID: "161171",
  founder: { "@type": "Person", name: "Jordanas Golovinas" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Miðholt 1",
    postalCode: "270",
    addressLocality: "Mosfellsbær",
    addressCountry: "IS",
  },
  areaServed: "IS",
  availableLanguage: ["is", "en", "lt", "pl", "ru", "es"],
  slogan: "Let happiness erupt",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cinzel.variable} ${cormorant.variable} ${lato.variable} h-full antialiased`}
    >
      <head>
        {/* Decides light or dark before the first paint, so nothing flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION) }}
        />
      </head>
      <body className="min-h-full">
        <LiveContentProvider>
          <ThemeProvider>
            <I18nProvider>
              <AnnouncementBar />
              <SmoothScroll>
                {children}
                <SiteFooter />
              </SmoothScroll>
              <StickyCall />
            </I18nProvider>
          </ThemeProvider>
        </LiveContentProvider>
      </body>
    </html>
  );
}
