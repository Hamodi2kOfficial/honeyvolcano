import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { VideoSection } from "@/components/site/video-section";
import { TrustSection } from "@/components/site/trust-section";
import { ValuesSection } from "@/components/site/values-section";
import { BeekeeperLetter } from "@/components/site/beekeeper-letter";
import { ProductShowcase } from "@/components/site/product-showcase";
import { FooterCta } from "@/components/site/footer-cta";
import { UnderConstruction } from "@/components/site/under-construction";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />

      {/* Hero — honeycomb backdrop with the logo, then the film beneath it */}
      <Hero />
      <VideoSection />

      {/* Trust block — reliable source, trustworthy business */}
      <TrustSection />

      {/* Copy still under review with the client — hidden for now */}
      <UnderConstruction>
        <ValuesSection />
      </UnderConstruction>
      <UnderConstruction>
        <BeekeeperLetter />
      </UnderConstruction>

      {/* Product pictures — kept open */}
      <ProductShowcase />

      <FooterCta />
    </main>
  );
}
