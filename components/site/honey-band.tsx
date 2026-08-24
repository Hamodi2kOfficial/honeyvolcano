"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

export function HoneyBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  return (
    <section
      ref={ref}
      className="relative flex h-[80vh] min-h-[460px] items-center overflow-hidden bg-[#151515] text-white"
    >
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[14%] h-[128%]">
        <Image
          src="/honeycomb.png"
          alt="Golden honeycomb dripping with raw amber honey"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* soft symmetric vignette for depth */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(21,21,21,0.55) 100%)",
        }}
      />
    </section>
  );
}
