"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { ArrowRight, Check, Droplets, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";
import { WaterFluidButton } from "@/components/ui/WaterFluidButton";
import { WhoWeAreSectionData } from "@/lib/types";

const FALLBACK_DELIVERY_POINTS = [
  "Water characterization & chemical process design",
  "In-house heavy vessel fabrication & skid assembly",
  "Electro-mechanical installation & wet commissioning",
  "CPCB/SPCB compliance handover & AMC lifecycle support",
];

const FALLBACK_PARAGRAPHS = [
  "R P Global Projects designs and delivers industrial water and wastewater treatment systems for manufacturing, commercial, and municipal applications. Each plant is planned around the source water, process demand, site conditions, and reuse goals.",
  "Our turnkey EPC approach brings process chemistry, equipment fabrication, instrumentation, and operational support together under one project team.",
];

interface WhoWeAreProps {
  data?: Partial<WhoWeAreSectionData>;
}

export const WhoWeAre: FC<WhoWeAreProps> = ({ data }) => {
  const badge = data?.badge || "About R P Global Projects";
  const title = data?.title || "A single engineering team, from first sample to final handover.";
  const paragraphs =
    data?.paragraphs && data.paragraphs.length > 0 ? data.paragraphs : FALLBACK_PARAGRAPHS;
  const deliveryPoints =
    data?.deliveryPoints && data.deliveryPoints.length > 0
      ? data.deliveryPoints
      : FALLBACK_DELIVERY_POINTS;
  const primaryBtnText = data?.primaryBtnText || "Meet the Team";
  const primaryBtnLink = data?.primaryBtnLink || "/about-us";
  const secondaryBtnText = data?.secondaryBtnText || "Arrange a Site Discussion";
  const secondaryBtnLink = data?.secondaryBtnLink || "/contact-us";
  const mediaType = data?.mediaType || "image";
  const mediaUrl = data?.mediaUrl || "/images/plant-etp.jpg";
  const imageBadgeTitle = data?.imageBadgeTitle || "Turnkey Water Engineering";
  const imageBadgeSubtitle =
    data?.imageBadgeSubtitle ||
    "Custom-Engineered for Source Water Chemistry & Discharge Limits.";
  const isoBadgeTitle = data?.isoBadgeTitle || "Quality Management";
  const isoBadgeSubtitle = data?.isoBadgeSubtitle || "ISO 9001:2015";

  return (
    <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
      <WaterBackgroundEffect variant="azure" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
          {/* Left Column: Industrial Plant Visual or Video with Motion Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group relative min-h-[380px] overflow-hidden rounded-2xl border-2 border-white/80 bg-[#dce5e1] shadow-[0_16px_40px_rgba(0,119,182,0.12)] sm:min-h-[520px]"
          >
            {mediaType === "video" ? (
              <video
                src={mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                poster={data?.mediaPosterUrl}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <Image
                src={mediaUrl}
                alt="Industrial effluent treatment equipment and process tanks"
                fill
                quality={85}
                unoptimized={/^https?:\/\//i.test(mediaUrl)}
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0077B6]/20 to-transparent pointer-events-none" />

            <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 text-white sm:px-8 sm:pb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/40 bg-[#0A192F]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#00E5FF] backdrop-blur-md">
                <Waves className="h-3 w-3 animate-pulse" />
                <span>{imageBadgeTitle}</span>
              </div>
              <p className="mt-2 text-lg font-medium text-white sm:text-xl">
                {imageBadgeSubtitle}
              </p>
            </div>

            {/* Floating ISO Badge with subtle hover elevation */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-5 top-5 rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:left-7 sm:top-7"
            >
              <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">
                {isoBadgeTitle}
              </span>
              <span className="mt-1 block font-mono text-sm font-bold text-[#0A192F]">
                {isoBadgeSubtitle}
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Narrative & Technical Points with Staggered Motion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="py-2 lg:py-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077b6] backdrop-blur-sm shadow-sm">
              <Droplets className="h-3 w-3 text-[#0077b6]" />
              <span>{badge}</span>
            </div>

            <h2 className="mt-4 max-w-[640px] text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#0f2d38] sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>

            <div className="mt-5 max-w-[650px] space-y-4 text-sm leading-7 text-[#45616b] sm:text-base">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Staggered Delivery Points */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {deliveryPoints.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="flex items-start gap-2.5 rounded-xl border border-[#bce1f1] bg-white/80 p-3.5 text-xs font-medium text-[#1e4652] shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-[#0077b6]/40 sm:text-sm"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0077B6]" />
                  <span>{point}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <WaterFluidButton
                href={primaryBtnLink}
                id="who-we-are-about-link"
                size="md"
                className="px-7 py-3.5 text-sm font-semibold"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </WaterFluidButton>

              <motion.div whileHover={{ x: 2 }}>
                <Link
                  href={secondaryBtnLink}
                  id="who-we-are-audit-link"
                  className="text-sm font-semibold text-[#0f2d38] underline decoration-[#0077B6]/50 underline-offset-4 transition-colors hover:text-[#0077B6]"
                >
                  {secondaryBtnText}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </WaterBackgroundEffect>
    </section>
  );
};
