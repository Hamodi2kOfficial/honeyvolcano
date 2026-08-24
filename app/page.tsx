import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { TrustSection } from "@/components/site/trust-section";
import { ValuesSection } from "@/components/site/values-section";
import { HoneyBand } from "@/components/site/honey-band";
import { BeekeeperLetter } from "@/components/site/beekeeper-letter";
import { ProductShowcase } from "@/components/site/product-showcase";
import { FooterCta } from "@/components/site/footer-cta";
import { UnderConstruction } from "@/components/site/under-construction";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Marquee />

      {/* Trust block — reliable source, trustworthy business */}
      <TrustSection />

      {/* Copy still under review with the client — hidden for now */}
      <UnderConstruction>
        <ValuesSection />
      </UnderConstruction>

      {/* Picture showcase — kept open */}
      <HoneyBand />

      <UnderConstruction>
        <BeekeeperLetter />
      </UnderConstruction>

      {/* Product pictures — kept open */}
      <ProductShowcase />

      <FooterCta />
    </main>
  );
}
