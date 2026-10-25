import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Factory,
  Layers,
  Wrench,
  Activity,
  Award,
  ArrowRight,
  Waves,
  Droplets,
} from "lucide-react";
import { COMPANY_INFO, OFFICES } from "@/lib/constants";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

export const metadata = {
  title: "About Us — R P Global Projects | Turnkey Water EPC Specialists",
  description:
    "Over 12 years of engineering excellence in water and wastewater treatment. ISO 9001:2015 certified turnkey EPC contractor operating out of Noida and Gopalganj.",
};

const EPC_STAGES = [
  {
    stage: "01",
    title: "Water Testing & Feasibility Sizing",
    description:
      "We begin every project by analyzing inlet water chemistry (pH, TDS, COD, BOD, TSS, heavy metals) to formulate a tailored, mathematically validated process design.",
  },
  {
    stage: "02",
    title: "Process Design & P&ID Engineering",
    description:
      "Our senior chemical engineers draft detailed process flow diagrams (PFD), piping & instrumentation diagrams (P&ID), hydraulic profiles, and electrical SLD drawings.",
  },
  {
    stage: "03",
    title: "In-House Heavy Equipment Fabrication",
    description:
      "Pressure vessels, clarifier bridges, biological tanks, and chemical dosing skids are fabricated in our workshops under strict ASME and ISO 9001 quality supervision.",
  },
  {
    stage: "04",
    title: "Civil Coordination & On-Site Erection",
    description:
      "Experienced project managers oversee structural foundations, mechanical equipment mounting, high-pressure piping manifolds, and electrical panel cabling.",
  },
  {
    stage: "05",
    title: "Wet Commissioning & Compliance Handover",
    description:
      "Biological seeding (MLSS cultivation), hydro-testing, PLC tuning, and third-party laboratory verification before formally handing over CPCB compliance documentation.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff]/60 via-[#f8fafc] to-[#e6f4f8]/40">
      {/* Header Banner with Aquatic Fluid Simulation */}
      <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
        <WaterBackgroundEffect variant="azure" className="px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3.5 py-1 text-xs font-semibold text-[#0077b6] backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>ISO 9001:2015 Certified Engineering Firm</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d38] sm:text-4xl lg:text-5xl">
              About R P Global Projects
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#45616b] sm:text-base">
              Pure Solutions for a Better Tomorrow — Dedicated to delivering state-of-the-art
              industrial water and wastewater infrastructure across industrial and municipal sectors.
            </p>
          </div>
        </WaterBackgroundEffect>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Company Background Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077B6] bg-[#0077B6]/10 px-3 py-1 rounded-full">
              Our Engineering Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F]">
              Over 12 Years of Industrial Water Treatment Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founded on the principles of engineering precision and environmental integrity,
              <strong> R P Global Projects</strong> has grown into a trusted turnkey EPC (Engineering,
              Procurement & Construction) contractor. With dual operating offices in Noida (Corporate NCR)
              and Gopalganj (Registered Bihar), we cater to industrial manufacturing complexes, commercial
              townships, and governmental water schemes across India.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our interdisciplinary team of chemical process engineers, mechanical fabricators, and
              automation programmers work hand-in-hand to design high-performance plants that not only
              guarantee 100% CPCB/SPCB regulatory compliance but also maximize treated water reuse.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold font-mono text-[#0077B6]">100+</div>
                <div className="text-xs font-semibold text-slate-800 mt-1">Projects Delivered</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Across India</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold font-mono text-[#10B981]">99.4%</div>
                <div className="text-xs font-semibold text-slate-800 mt-1">Compliance Success</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Zero pollution penalties</div>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#0077B6]/10 flex items-center justify-center text-[#0077B6]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A192F]">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To engineer robust, energy-efficient water and wastewater treatment plants that safeguard
                groundwater resources, restore industrial effluents to reusable quality, and ensure
                continuous environmental regulatory compliance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A192F] text-white border border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Vision</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                To be India&apos;s foremost benchmark in industrial environmental engineering, championing
                Zero Liquid Discharge (ZLD) technologies and sustainable water circularity for industry.
              </p>
            </div>
          </div>
        </div>

        {/* Turnkey EPC Project Lifecycle Sequence */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077B6] bg-[#0077B6]/10 px-3 py-1 rounded-full">
              Full-Stack Delivery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] mt-3">
              Our Turnkey EPC Execution Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              From raw water sampling to commercial handover, our single-point accountability model
              guarantees on-time project completion and zero scope gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {EPC_STAGES.map((item) => (
              <div
                key={item.stage}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-[#0077B6] transition-all"
              >
                <div>
                  <span className="font-mono text-2xl font-black text-[#0077B6]/30 block mb-2">
                    {item.stage}
                  </span>
                  <h4 className="text-sm font-bold text-[#0A192F] mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0A192F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold">Have an Upcoming Water Treatment Project?</h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Send us your water test report or schedule an on-site technical inspection with our engineering team.
            </p>
          </div>
          <Link
            href="/contact-us#rfq"
            className="px-6 py-3 rounded-lg bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-lg shrink-0"
          >
            Connect With Engineers
          </Link>
        </div>
      </div>
    </div>
  );
}
