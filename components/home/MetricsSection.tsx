"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";
import { Droplets } from "lucide-react";
import { motion } from "framer-motion";
import type { FC } from "react";
import { MetricsSectionData } from "@/lib/types";

const FALLBACK_METRICS = [
  { id: "m1", value: 100, suffix: "+", decimals: 0, label: "Plants commissioned", detail: "Across industrial India" },
  { id: "m2", value: 12, suffix: "+", decimals: 0, label: "Years in water engineering", detail: "Turnkey EPC delivery" },
  { id: "m3", value: 99.4, suffix: "%", decimals: 1, label: "Compliance rate", detail: "CPCB / SPCB discharge norms" },
  { id: "m4", value: 50, suffix: "+", decimals: 0, label: "Enterprise clients", detail: "Industrial & municipal complexes" },
];

interface MetricsSectionProps {
  data?: Partial<MetricsSectionData>;
}

export const MetricsSection: FC<MetricsSectionProps> = ({ data }) => {
  const badge = data?.badge || "Experience & Water Delivery";
  const title = data?.title || "Built on projects, measured in hydraulic performance.";
  const description =
    data?.description ||
    "Project figures reflect 12+ years of verified EPC commissioning and operational compliance.";
  const items = data?.items && data.items.length > 0 ? data.items : FALLBACK_METRICS;

  return (
    <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
      <WaterBackgroundEffect variant="azure" className="py-14 sm:py-16">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3 py-0.5 backdrop-blur-sm shadow-sm">
                <Droplets className="h-3 w-3 text-[#0077b6] animate-pulse" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0077b6]">
                  {badge}
                </p>
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#0f2d38] sm:text-2xl">
                {title}
              </h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-[#536d75]">
              {description}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#bce1f1] bg-white/80 backdrop-blur-md shadow-[0_12px_36px_rgba(0,119,182,0.08)] lg:grid-cols-4">
            {items.map((metric, index) => (
              <motion.div
                key={metric.id || metric.label}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.96)" }}
                className={`group relative px-4 py-6 transition-all duration-300 sm:px-7 sm:py-8 ${
                  index % 2 === 0 ? "border-r border-[#bce1f1]" : ""
                } ${index < 2 ? "border-b border-[#bce1f1] lg:border-b-0" : ""} ${
                  index < 3 ? "lg:border-r border-[#bce1f1]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-3xl font-bold tracking-[-0.06em] text-[#0077b6] transition-colors group-hover:text-[#0284c7] sm:text-4xl">
                    <AnimatedCounter
                      value={metric.value}
                      decimals={metric.decimals}
                      suffix={metric.suffix}
                      duration={1.6}
                    />
                  </p>
                </div>
                <p className="mt-2 text-xs font-semibold text-[#163c46] sm:text-sm">
                  {metric.label}
                </p>
                <p className="mt-1 text-[11px] text-[#5e777e]">{metric.detail}</p>

                {/* Bottom active aquatic shimmer line on hover */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-[#0077B6] to-[#00E5FF] transition-transform duration-300 group-hover:scale-x-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </WaterBackgroundEffect>
    </section>
  );
};
