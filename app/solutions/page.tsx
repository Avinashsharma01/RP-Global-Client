import React from "react";
import Link from "next/link";
import { Droplets, ShieldCheck, ArrowRight, CheckCircle2, Waves } from "lucide-react";
import { PLANT_SOLUTIONS } from "@/lib/constants";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

export const metadata = {
  title: "Industrial Water & Wastewater Plant Solutions — R P Global Projects",
  description:
    "Explore our industrial water systems: DM Plants, ETP, RO, STP, Water Softeners, and WTP systems designed around CPCB/SPCB requirements.",
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      {/* Page introduction */}
      <div className="relative overflow-hidden border-b border-[#bce1f1]/60">
        <WaterBackgroundEffect variant="aquamarine" className="px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-4 inline-flex items-center gap-2 border-l-2 border-[#0077b6] bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#0077b6]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Turnkey EPC Engineering • ISO 9001:2015</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d38] sm:text-4xl lg:text-5xl">
              Industrial Water & Wastewater Plant Solutions
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#45616b] sm:text-base">
              Treatment systems selected around source-water quality, process demand, site constraints,
              discharge requirements, and reuse targets.
            </p>
          </div>
        </WaterBackgroundEffect>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLANT_SOLUTIONS.map((plant) => (
            <div
              key={plant.slug}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-[#0077B6]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0077B6]/10 flex items-center justify-center text-[#0077B6]">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0077B6] bg-[#0077B6]/10 px-2.5 py-1 rounded-full">
                    {plant.capacity}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0A192F] mb-2">{plant.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {plant.tagline}
                </p>

                <div className="space-y-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>In-House Fabrication & Assembly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>CPCB Discharge Standard Review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Automated PLC Instrumentation</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/solutions/${plant.slug}`}
                  className="inline-flex items-center text-xs font-bold text-[#0077B6] hover:text-[#005f92]"
                >
                  <span>Detailed Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                <Link
                  href={`/contact-us?plant=${encodeURIComponent(plant.name)}#rfq`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  RFQ Sizing
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
