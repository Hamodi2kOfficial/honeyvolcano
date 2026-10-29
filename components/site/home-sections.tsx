"use client";

import { Hero } from "@/components/site/hero";
import { RawAndBeeSection } from "@/components/site/raw-and-bee";
import { FeaturedProducts } from "@/components/site/featured-products";
import { StoryOne, StoryTwo, StoryThree } from "@/components/site/story-sections";
import { ConstructionSection } from "@/components/site/construction-section";
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
import { isWithinWindow } from "@/lib/marketing";

/**
 * The home page, assembled from the owner's section list: the designed
 * sections stay bespoke components, everything they added is drawn by <Block/>.
 */
const BUILTINS: Record<BuiltinKind, React.ComponentType> = {
  hero: Hero,
  rawAndBee: RawAndBeeSection,
  featured: FeaturedProducts,
  story1: StoryOne,
  story2: StoryTwo,
  story3: StoryThree,
  construction: ConstructionSection,
  video: VideoSection,
  trust: TrustSection,
  values: ValuesSection,
  letter: BeekeeperLetter,
  showcase: ProductShowcase,
  cta: FooterCta,
};

/** Hides a section on phones or on desktops, when the owner asked for that. */
function DeviceGate({
  devices,
  children,
}: {
  devices?: "all" | "desktop" | "mobile";
  children: React.ReactNode;
}) {
  if (devices === "desktop") return <div className="hidden md:block">{children}</div>;
  if (devices === "mobile") return <div className="md:hidden">{children}</div>;
  return <>{children}</>;
}

export function HomeSections() {
  const { home } = useLiveContent();

  return (
    <>
      {home.sections.map((section) => {
        if (!section.visible) return null;
        // Sections can be given a start and end date in the dashboard.
        if (!isWithinWindow(section.from, section.until)) return null;

        if (section.kind === "builtin") {
          const Component = BUILTINS[section.builtin];
          if (!Component) return null;
          return (
            <DeviceGate key={section.id} devices={section.devices}>
              {section.underConstruction ? (
                <UnderConstruction>
                  <Component />
                </UnderConstruction>
              ) : (
                <Component />
              )}
            </DeviceGate>
          );
        }

        return (
          <DeviceGate key={section.id} devices={section.devices}>
            <Block section={section} />
          </DeviceGate>
        );
      })}
    </>
  );
}
