"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { Btn, Section } from "@/lib/home-model";
import { HoneyCta } from "@/components/ui/honey-cta";
import { cn } from "@/lib/utils";

/**
 * Renders an owner-built section. The very same component draws the public
 * home page and the live preview inside /admin, so what the owner arranges in
 * the dashboard is literally what visitors see.
 *
 * `compact` shrinks the vertical rhythm for the small preview frame.
 */
export function Block({ section, compact }: { section: Section; compact?: boolean }) {
  if (!section.visible) return null;
  const pad = compact ? "py-10" : "py-20 md:py-28";

  switch (section.kind) {
    case "text":
      return (
        <section className={cn("bg-background px-6", pad)}>
          <div
            className={cn(
              "mx-auto max-w-3xl",
              section.align === "center" ? "text-center" : "text-left"
            )}
          >
            {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
            {section.heading && <Heading compact={compact}>{section.heading}</Heading>}
            {section.body && <Body>{section.body}</Body>}
          </div>
        </section>
      );

    case "imageText":
      return (
        <section className={cn("bg-background px-6", pad)}>
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className={section.side === "right" ? "md:order-2" : undefined}>
              <Photo image={section.image} ratio="aspect-[4/5]" />
            </div>
            <div className={section.side === "right" ? "md:order-1" : undefined}>
              {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
              {section.heading && <Heading compact={compact}>{section.heading}</Heading>}
              {section.body && <Body>{section.body}</Body>}
              {section.button && (
                <div className="mt-7">
                  <Button btn={section.button} compact={compact} />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className={cn("bg-background px-6", pad)}>
          <div className="mx-auto max-w-6xl">
            {section.heading && (
              <Heading compact={compact} className="text-center">
                {section.heading}
              </Heading>
            )}
            {section.layout === "strip" ? (
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
                {section.images.map((img, i) => (
                  <div key={`${img.src}-${i}`} className="w-64 shrink-0">
                    <Photo image={img} ratio="aspect-[3/4]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                {section.images.map((img, i) => (
                  <Photo key={`${img.src}-${i}`} image={img} ratio="aspect-square" />
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "cards":
      return (
        <section className={cn("bg-background px-6", pad)}>
          <div className="mx-auto max-w-6xl">
            {section.heading && (
              <Heading compact={compact} className="text-center">
                {section.heading}
              </Heading>
            )}
            {section.intro && (
              <Body className="mx-auto max-w-2xl text-center">{section.intro}</Body>
            )}
            <div
              className={cn(
                "mt-8 grid gap-5",
                section.columns === 2
                  ? "sm:grid-cols-2"
                  : section.columns === 4
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {section.cards.map((c) => (
                <article
                  key={c.id}
                  className="overflow-hidden rounded-2xl border border-border bg-bg-soft"
                >
                  {c.image && <Photo image={c.image} ratio="aspect-[4/3]" rounded={false} />}
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-light text-foreground">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {c.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "quote":
      return (
        <section className={cn("bg-bg-soft px-6", pad)}>
          <figure className="mx-auto max-w-3xl text-center">
            <span aria-hidden className="font-serif text-5xl leading-none text-accent/40">
              &ldquo;
            </span>
            <blockquote
              className={cn(
                "mt-2 font-serif font-light leading-[1.25] text-foreground",
                compact ? "text-2xl" : "text-3xl md:text-4xl"
              )}
            >
              {section.text}
            </blockquote>
            {section.author && (
              <figcaption className="mt-5 text-sm uppercase tracking-[0.2em] text-accent">
                {section.author}
              </figcaption>
            )}
          </figure>
        </section>
      );

    case "reviews":
      return (
        <section className={cn("bg-background px-6", pad)}>
          <div className="mx-auto max-w-6xl">
            {section.heading && (
              <Heading compact={compact} className="text-center">
                {section.heading}
              </Heading>
            )}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-border bg-bg-soft p-5"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < r.stars ? "fill-accent text-accent" : "text-border"
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-foreground-muted">
                    {r.name}
                    {r.place && ` · ${r.place}`}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className={cn("bg-bg-soft px-6", pad)}>
          <div className="mx-auto max-w-3xl text-center">
            <Heading compact={compact}>{section.heading}</Heading>
            {section.body && <Body className="mx-auto max-w-xl">{section.body}</Body>}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {section.buttons.map((b, i) => (
                <Button key={i} btn={b} compact={compact} />
              ))}
            </div>
          </div>
        </section>
      );

    case "stats":
      return (
        <section className={cn("bg-background px-6", compact ? "py-8" : "py-16 md:py-20")}>
          <div className="mx-auto grid max-w-4xl gap-6 text-center sm:grid-cols-3">
            {section.items.map((s) => (
              <div key={s.id}>
                <p
                  className={cn(
                    "font-serif font-light text-accent",
                    compact ? "text-3xl" : "text-4xl md:text-5xl"
                  )}
                >
                  {s.value}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-foreground-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      );

    case "banner":
      return (
        <section className="border-y border-border bg-bg-soft py-3.5">
          <p className="truncate px-6 text-center font-display text-sm uppercase tracking-[0.3em] text-accent/85">
            {section.text}
          </p>
        </section>
      );

    case "video":
      return (
        <section className={cn("bg-background px-6", pad)}>
          <div className="mx-auto max-w-4xl text-center">
            {section.heading && <Heading compact={compact}>{section.heading}</Heading>}
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-accent/20">
              <video
                src={section.src}
                className="h-full w-full"
                controls
                playsInline
                preload="metadata"
              />
            </div>
            {section.caption && (
              <p className="mt-3 text-xs text-foreground-muted">{section.caption}</p>
            )}
          </div>
        </section>
      );

    default:
      return null;
  }
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.28em] text-accent">{children}</p>
  );
}

function Heading({
  children,
  compact,
  className,
}: {
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mt-3 whitespace-pre-line font-serif font-light leading-[1.1] text-foreground",
        compact ? "text-2xl" : "text-3xl md:text-4xl lg:text-5xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mt-5 whitespace-pre-line text-[15px] leading-relaxed text-foreground-muted",
        className
      )}
    >
      {children}
    </p>
  );
}

function Photo({
  image,
  ratio,
  rounded = true,
}: {
  image: { src: string; alt: string };
  ratio: string;
  rounded?: boolean;
}) {
  const isData = image.src.startsWith("data:") || image.src.startsWith("blob:");
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden ring-1 ring-accent/15",
        ratio,
        rounded && "rounded-2xl"
      )}
    >
      {isData ? (
        // Images pasted or uploaded in the dashboard are data URLs; next/image
        // cannot optimise those, so render them directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

function Button({ btn, compact }: { btn: Btn; compact?: boolean }) {
  if (btn.style === "gold") {
    return (
      <HoneyCta href={btn.href} size={compact ? "sm" : "md"}>
        {btn.label}
      </HoneyCta>
    );
  }
  return (
    <Link
      href={btn.href}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-accent/50 font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10",
        compact ? "h-10 px-6 text-[13px]" : "h-12 px-9 text-[15px]"
      )}
    >
      {btn.label}
    </Link>
  );
}
