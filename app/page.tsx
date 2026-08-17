import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { StorySection } from "@/components/site/story-section";
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

      {/* Copy still under review with the client — hidden for now */}
      <UnderConstruction>
        <StorySection />
      </UnderConstruction>
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
