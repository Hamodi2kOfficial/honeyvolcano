"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { EASE } from "@/lib/motion";

const PHONE = "tel:8340999";

// Business note — shown verbatim, exactly as provided. Do not edit.
const BUSINESS_NOTE =
  "Some combined purchasings or for small business entities can be discounted 15 procent from retail prices.";

type Product = {
  name: string;
  price: string;
  desc: string;
  /** Drop a photo path here later, e.g. "/products/raw-honey-500.png" — the
   *  card already renders it in place of the placeholder, no layout change. */
  image?: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Raw honey 500 g",
    price: "2299 ISK",
    desc: "Pure, unheated raw honey straight from the comb. Our everyday jar.",
  },
  {
    name: "Raw honey 1 kg",
    price: "3499 ISK",
    desc: "The same raw honey in a generous kilo, for homes that never run out.",
  },
  {
    name: "Honey comb 300 g",
    price: "2299 ISK",
    desc: "A cut of natural honeycomb, eaten whole — wax and honey together.",
  },
  {
    name: "Honey delicacies 220 g",
    price: "2199 ISK",
    desc: "Raw honey blended with fine natural add-ins for a richer treat.",
  },
  {
    name: "Honey multicoloured 220 g",
    price: "2499 ISK",
    desc: "An assortment of our honeys in one jar, a spectrum of flavour.",
  },
  {
    name: "Pollen 100 g",
    price: "1499 ISK",
    desc: "Hand-collected bee pollen, a golden, nutrient-dense daily spoonful.",
  },
  {
    name: "Bee bred 100 g",
    price: "Price TBA",
    desc: "Bee bread from the hive: fermented pollen, prized as nature's superfood.",
  },
];

/** Faint jar silhouette shown while a product photo is still to come. */
function JarPlaceholder() {
  return (
    <svg viewBox="0 0 48 60" aria-hidden className="h-16 w-16 text-accent/25">
      <path
        d="M17 4h14M16 8h16v4l3 3v33a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V15l3-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M13 30h22" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-accent/15 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/45 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_-30px_rgba(212,175,55,0.5)]"
    >
      {/* Image placeholder — structured, ready for a real photo */}
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-white/5 bg-gradient-to-b from-white/[0.05] to-black/25">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <JarPlaceholder />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-light leading-snug text-white">
            {product.name}
          </h3>
          <span className="mt-0.5 shrink-0 whitespace-nowrap font-display text-sm tracking-wide text-accent">
            {product.price}
          </span>
        </div>

        <p className="mt-2 text-sm font-light leading-relaxed text-white/60">
          {product.desc}
        </p>

        <a
          href={PHONE}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-[#1c1206] shadow-[0_10px_24px_-12px_rgba(212,175,55,0.7)] ring-1 ring-[#f0d38a]/40 transition-transform duration-300 hover:scale-[1.03]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #F3CE72 0%, #E5B869 42%, #C79A3B 100%)",
          }}
        >
          Call To Taste
        </a>
      </div>
    </motion.article>
  );
}

export function ProductCatalog() {
  return (
    <section id="catalog" className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center font-serif text-4xl font-light text-white md:text-5xl"
      >
        Our Products
      </motion.h2>

      {/* Business orders note — highly visible, exact text only */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="mx-auto mt-6 max-w-2xl rounded-xl border border-accent/25 bg-accent/[0.07] px-5 py-3.5 text-center text-sm font-medium leading-relaxed text-accent"
      >
        {BUSINESS_NOTE}
      </motion.p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.name} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
