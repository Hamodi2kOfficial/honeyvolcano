"use client";

import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { useAsset } from "@/components/live-content";
import { useI18n } from "@/components/i18n";
import { cn } from "@/lib/utils";

/**
 * The three picture sections that close the home page.
 *
 * One layout, mirrored: picture on one side, words on the other. The pictures
 * are never cropped to a band and the words never sit on top of them — one of
 * them (the "3 faces" poster) already has its own lettering printed in, so
 * anything laid over it would collide.
 */
function StorySection({
  image,
  alt,
  eyebrow,
  heading,
  body,
  side,
  tone = "base",
}: {
  image: string;
  alt: string;
  eyebrow: string;
  heading: string;
  body: string;
  side: "left" | "right";
  tone?: "base" | "soft";
}) {
  return (
    <section className={cn("py-20 md:py-28", tone === "soft" ? "bg-bg-soft" : "bg-background")}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn(side === "right" && "lg:order-2")}>
          <div className="relative overflow-hidden rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
            <Image
              src={image}
              alt={alt}
              width={1920}
              height={1280}
              sizes="(max-width: 1023px) 92vw, 48vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className={cn(side === "right" && "lg:order-1")}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            {eyebrow}
          </p>
          <h2 className="mt-4 whitespace-pre-line font-serif text-[30px] font-light leading-[1.15] text-foreground md:text-[42px]">
            {heading}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-foreground-muted md:text-base">
            {body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function StoryOne() {
  const { t } = useI18n();
  return (
    <StorySection
      image={useAsset("story1.image", "/gallery/3faces.jpg")}
      alt="Three friends sharing a jar of Honey Volcano honey in a mountain meadow"
      eyebrow={t.home.s1Eyebrow}
      heading={t.home.s1Heading}
      body={t.home.s1Body}
      side="left"
    />
  );
}

export function StoryTwo() {
  const { t } = useI18n();
  return (
    <StorySection
      image={useAsset("story2.image", "/sections/hand-to-hand.webp")}
      alt="A beekeeper's weathered hands passing a jar of honey into a younger pair of hands"
      eyebrow={t.home.s2Eyebrow}
      heading={t.home.s2Heading}
      body={t.home.s2Body}
      side="right"
      tone="soft"
    />
  );
}

export function StoryThree() {
  const { t } = useI18n();
  return (
    <StorySection
      image={useAsset("story3.image", "/sections/breakfast.webp")}
      alt="Honey being drizzled from a wooden dipper onto buttered rye bread beside a cup of tea"
      eyebrow={t.home.s3Eyebrow}
      heading={t.home.s3Heading}
      body={t.home.s3Body}
      side="left"
    />
  );
}
