"use client";

import { Hero } from "@/components/site/hero";
import { VideoSection } from "@/components/site/video-section";
import { TrustSection } from "@/components/site/trust-section";
import { ValuesSection } from "@/components/site/values-section";
import { BeekeeperLetter } from "@/components/site/beekeeper-letter";
import { ProductShowcase } from "@/components/site/product-showcase";
import { FooterCta } from "@/components/site/footer-cta";
import { UnderConstruction } from "@/components/site/under-construction";
import { Block } from "@/components/site/blocks";
import { useLiveContent } from "@/components/live-content";
import type { BuiltinKind } from "@/lib/home-model";

/**
 * The home page, assembled from the owner's section list: the designed
 * sections stay bespoke components, everything they added is drawn by <Block/>.
 */
const BUILTINS: Record<BuiltinKind, React.ComponentType> = {
  hero: Hero,
  video: VideoSection,
  trust: TrustSection,
  values: ValuesSection,
  letter: BeekeeperLetter,
  showcase: ProductShowcase,
  cta: FooterCta,
};

export function HomeSections() {
  const { home } = useLiveContent();

  return (
    <>
      {home.sections.map((section) => {
        if (!section.visible) return null;

        if (section.kind === "builtin") {
          const Component = BUILTINS[section.builtin];
          if (!Component) return null;
          return section.underConstruction ? (
            <UnderConstruction key={section.id}>
              <Component />
            </UnderConstruction>
          ) : (
            <Component key={section.id} />
          );
        }

        return <Block key={section.id} section={section} />;
      })}
    </>
  );
}
