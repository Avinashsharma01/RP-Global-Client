"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, PhoneCall, Droplets, Activity } from "lucide-react";
import dynamic from "next/dynamic";
import { COMPANY_INFO } from "@/lib/constants";
import { WaterWaveDivider } from "@/components/ui/WaterWaveDivider";
import { WaterFluidButton } from "@/components/ui/WaterFluidButton";
import { HeroSectionData } from "@/lib/types";

const WaterHeroCanvas = dynamic(
  () => import("@/components/ui/WaterHeroCanvas").then((mod) => mod.WaterHeroCanvas),
  { ssr: false }
);

interface HeroProps {
  data?: Partial<HeroSectionData>;
  onOpenRFQ?: (plantType?: string) => void;
}

export const Hero: FC<HeroProps> = ({ data, onOpenRFQ }) => {
  const badge = data?.badge || "Industrial Water & Wastewater EPC • India";
  const titleLine1 = data?.titleLine1 ?? "Water systems,";
  const titleLine2 = data?.titleLine2 ?? "engineered for";
  const titleHighlight = data?.titleHighlight ?? "the long run.";
  const description =
    data?.description ||
    "Turnkey water and wastewater treatment plants designed around your inlet water chemistry, fabricated in-house to guarantee CPCB/SPCB discharge limits, and supported through long-term operation.";
  const primaryCtaText = data?.primaryCtaText || "Talk to an Engineer";
  const primaryCtaLink = data?.primaryCtaLink || "";
  const secondaryCtaText = data?.secondaryCtaText || "Explore Our Solutions";
  const secondaryCtaLink = data?.secondaryCtaLink || "/solutions";
  const checkpoints =
    data?.checkpoints && data.checkpoints.length > 0
      ? data.checkpoints
      : ["ISO 9001:2015 Certified", "CPCB / SPCB Focused Design"];
  const phoneNumber = data?.phoneNumber || COMPANY_INFO.phone;
  const rawPhone = phoneNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const mediaType = data?.mediaType || "image";
  const mediaUrl = data?.mediaUrl || "/images/hero-bg.jpg";
  const telemetryText = data?.telemetryText || "Real-Time Plant Telemetry • Active";
  const overlayCaption = data?.overlayCaption || "Industrial wastewater treatment";

  const handlePrimaryClick = () => {
    if (primaryCtaLink) {
      window.location.href = primaryCtaLink;
    } else if (onOpenRFQ) {
      onOpenRFQ();
    } else {
      window.location.href = "/contact-us#rfq";
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f0f9ff]/60 to-[#e0f2fe]/40">
      {/* Subtle aquatic background ambient caustics with breathing glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#00E5FF]/20 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute top-1/2 left-1/4 h-80 w-80 rounded-full bg-[#0077B6]/20 blur-3xl"
      />

      <div className="mx-auto grid min-h-0 max-w-[1640px] grid-cols-1 px-4 sm:px-6 lg:px-8 lg:min-h-[580px] lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left Column: Headline & Technical Value Props */}
        <div className="relative z-10 flex flex-col justify-center py-10 sm:py-14 sm:pr-8 lg:py-14 lg:pr-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0077b6] backdrop-blur-sm shadow-sm sm:mb-6 sm:gap-2.5 sm:px-3.5 sm:text-[11px] sm:tracking-[0.16em]"
          >
            <Droplets className="h-3.5 w-3.5 text-[#00E5FF] animate-pulse" />
            <span className="min-w-0 break-words">{badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
            className="max-w-[650px] text-[2.15rem] font-semibold leading-[1.06] tracking-[-0.045em] text-[#0A192F] sm:text-[2.8rem] xl:text-[3.8rem]"
          >
            {titleLine1 && (
              <>
                {titleLine1}
                <br />
              </>
            )}
            {titleLine2 && (
              <>
                {titleLine2}
                <br />
              </>
            )}
            <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent font-bold">
              {titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: "easeOut" }}
            className="mt-5 max-w-[510px] text-[0.95rem] leading-6 text-[#475569] sm:mt-6 sm:text-lg sm:leading-7"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: "easeOut" }}
            className="mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
          >
            <WaterFluidButton
              id="hero-rfq-btn"
              onClick={handlePrimaryClick}
              size="md"
              className="w-full px-7 py-3.5 text-sm font-semibold tracking-wide sm:w-auto"
            >
              {primaryCtaText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </WaterFluidButton>

            <WaterFluidButton
              href={secondaryCtaLink}
              id="hero-solutions-link"
              variant="secondary"
              size="md"
              className="w-full px-6 py-3.5 text-sm font-semibold sm:w-auto !text-white"
            >
              {secondaryCtaText} <ArrowDown className="h-4 w-4 text-cyan-300" />
            </WaterFluidButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-slate-200/80 pt-5 text-xs text-[#53666a] sm:mt-10 sm:gap-x-6"
          >
            {checkpoints.map((cp, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 font-medium">
                <Check className="h-4 w-4 text-[#10B981]" /> {cp}
              </span>
            ))}
            {phoneNumber && (
              <a
                href={`tel:${rawPhone}`}
                className="group inline-flex items-center gap-2 font-semibold text-[#0A192F] transition-colors hover:text-[#0077B6]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0077B6]/10 text-[#0077B6] group-hover:bg-[#0077B6] group-hover:text-white transition-colors">
                  <PhoneCall className="h-3 w-3" />
                </span>
                <span>{phoneNumber}</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* Right Column: Hero Facility Image or Video with Interactive Water Ripple Canvas */}
        <div className="group relative min-h-[300px] overflow-hidden bg-[#0A192F] sm:min-h-[380px] lg:min-h-full">
          {mediaType === "video" ? (
            <video
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              poster={data?.mediaPosterUrl}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <Image
              src={mediaUrl}
              alt="Industrial water and wastewater treatment facility"
              fill
              priority
              quality={85}
              unoptimized={/^https?:\/\//i.test(mediaUrl)}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Ambient fluid tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/85 via-[#0077B6]/20 to-transparent pointer-events-none" />

          {/* Interactive Water Ripple & Caustic Canvas */}
          <WaterHeroCanvas
            intensity={1.1}
            showBadge={true}
            className="absolute inset-0 z-10 cursor-crosshair"
          />

          {/* Floating Live Telemetry Badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 rounded-xl border border-white/20 bg-[#0A192F]/85 px-4 py-2 text-xs font-mono text-cyan-200 backdrop-blur-md shadow-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
            </span>
            <Activity className="h-3.5 w-3.5 text-[#00E5FF]" />
            <span>{telemetryText}</span>
          </motion.div>

          <div className="absolute bottom-4 left-4 right-4 z-20 w-fit max-w-[calc(100%-2rem)] rounded-md bg-white/95 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#0A192F] shadow-md sm:bottom-7 sm:left-7 sm:right-auto sm:text-[10px] sm:tracking-[0.12em]">
            {overlayCaption}
          </div>
        </div>
      </div>

      {/* Organic animated water wave divider into MetricsSection */}
      <WaterWaveDivider
        fillColor="#f0f9ff"
        accentColor="#00e5ff"
        height={46}
        position="bottom"
      />
    </section>
  );
};
