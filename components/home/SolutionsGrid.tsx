"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { ArrowRight, Droplets, MoveUpRight, Waves, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PLANT_SOLUTIONS } from "@/lib/constants";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

const PLANT_IMAGES: Record<string, string> = {
  "demineralization-plants": "/images/hero-plant-2.jpeg",
  "effluent-treatment-plants": "/images/plant-etp.jpg",
  "reverse-osmosis-plants": "/images/plant-ro.jpg",
  "sewage-treatment-plants": "/images/plant-stp.jpg",
  "water-softening-plants": "/images/plant-ro.jpg",
  "water-treatment-plants": "/images/hero-bg.jpg",
};

export const SolutionsGrid: FC = () => {
  const featured =
    PLANT_SOLUTIONS.find((plant) => plant.slug === "effluent-treatment-plants") ??
    PLANT_SOLUTIONS[0];
  const remaining = PLANT_SOLUTIONS.filter((plant) => plant.slug !== featured.slug);

  return (
    <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
      <WaterBackgroundEffect variant="aquamarine" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          {/* Section Header with Motion Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55 }}
            className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-sm shadow-sm">
                <Waves className="h-3 w-3 text-[#0077b6] animate-pulse" />
                <span>Industrial Treatment Systems</span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0f2d38] sm:text-4xl">
                The right engineered process for your water.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#45616b] sm:text-base">
                Six core systems, configured for your inlet chemistry, daily KLD capacity, compliance targets, and zero-liquid-discharge reuse requirements.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/solutions"
                id="solutions-catalog-link"
                data-magnetic="true"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284c7] px-6 text-sm font-semibold text-white shadow-lg shadow-[#0077B6]/25 transition-all hover:shadow-[#0077B6]/35"
              >
                View All Solutions <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Featured System Card with Parallax Zoom */}
            <motion.article
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="group relative min-h-[420px] overflow-hidden rounded-2xl border-2 border-white/80 bg-[#19373e] shadow-[0_16px_40px_rgba(0,119,182,0.14)] lg:col-span-5"
            >
              <Image
                src={PLANT_IMAGES[featured.slug]}
                alt={`${featured.shortName} treatment system`}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/95 via-[#0077B6]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00E5FF]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#00E5FF] backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  Featured Core System
                </span>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {featured.name}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/85">
                  {featured.tagline}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={`/solutions/${featured.slug}`}
                      id={`solution-featured-${featured.slug}`}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-[#0A192F] shadow-sm transition-all hover:bg-[#e0f2fe] hover:text-[#0077B6]"
                    >
                      Explore This System <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                  <span className="font-mono text-xs font-medium text-cyan-200">
                    {featured.capacity}
                  </span>
                </div>
              </div>
            </motion.article>

            {/* Remaining Grid Cards with Crystalline Frosted Backdrop */}
            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#bce1f1] bg-white/85 backdrop-blur-md shadow-[0_12px_36px_rgba(0,119,182,0.07)] sm:grid-cols-2 lg:col-span-7">
              {remaining.map((plant, index) => (
                <motion.div
                  key={plant.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={`group relative flex min-h-[160px] gap-4 p-5 transition-all duration-300 hover:bg-white/95 hover:shadow-inner sm:p-6 ${
                    index < 4 ? "border-b border-[#bce1f1]/70" : ""
                  } ${index % 2 === 0 ? "sm:border-r border-[#bce1f1]/70" : ""}`}
                >
                  <Link
                    href={`/solutions/${plant.slug}`}
                    id={`solution-card-${plant.slug}`}
                    className="flex flex-1 gap-4"
                  >
                    <div className="relative h-[76px] w-[86px] shrink-0 overflow-hidden rounded-lg border border-[#bce1f1]/80 bg-[#e1e8e3] sm:h-[84px] sm:w-[98px]">
                      <Image
                        src={PLANT_IMAGES[plant.slug]}
                        alt=""
                        fill
                        sizes="100px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-5 text-[#0f2d38] transition-colors group-hover:text-[#0077B6]">
                          {plant.name}
                        </h3>
                        <MoveUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#82928e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0077B6]" />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#526a72]">
                        {plant.tagline}
                      </p>
                      <span className="mt-2 block font-mono text-[10px] font-semibold text-[#0077B6]">
                        {plant.capacity}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}

              <Link
                href="/contact-us#rfq"
                className="group flex min-h-[160px] items-center justify-between gap-5 border-t border-[#bce1f1]/70 bg-gradient-to-br from-[#e0f2fe]/60 to-[#dbeafe]/80 p-5 transition-all duration-300 hover:from-[#e0f2fe]/90 hover:to-[#bae6fd]/90 sm:px-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">
                    <Droplets className="h-3 w-3" />
                    <span>Need Help Choosing?</span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold text-[#0f2d38]">
                    Talk through your process requirements.
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#526a72]">
                    We’ll help analyze your inlet water report and size the right system.
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#0077B6]/30 bg-white text-[#0077B6] shadow-sm transition-all group-hover:bg-[#0077B6] group-hover:text-white">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-[#bce1f1]/80 bg-white/70 p-4 text-xs text-[#526a72] backdrop-blur-sm sm:flex-row sm:items-center"
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <Droplets className="h-4 w-4 text-[#0077B6]" /> Process selection begins with your comprehensive water lab analysis.
            </span>
            <Link
              href="/contact-us?plant=Effluent%20Treatment%20Plant%20(ETP)#rfq"
              className="font-semibold text-[#0077B6] hover:underline"
            >
              Discuss a Custom Plant Specification <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </WaterBackgroundEffect>
    </section>
  );
};
