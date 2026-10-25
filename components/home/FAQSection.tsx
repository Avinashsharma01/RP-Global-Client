"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileQuestion,
  Headphones,
  CheckCircle2,
  X,
  Droplets,
} from "lucide-react";
import { api } from "@/lib/api";
import { FAQItem } from "@/lib/types";

// Standard fallback FAQs to ensure immediate rendering without waiting or when offline
const FALLBACK_FAQS: FAQItem[] = [
  {
    _id: "faq-1",
    question: "What types of industrial water and wastewater treatment plants does RP Global design and manufacture?",
    answer: "RP Global Projects engineers, manufactures, and commissions a complete turnkey portfolio: Sewage Treatment Plants (STP) using MBBR, SBR, and MBR technologies; Effluent Treatment Plants (ETP) with chemical, biological, and tertiary polishing; Industrial Reverse Osmosis (RO) plants; Demineralization (DM) two-bed and mixed-bed systems; Industrial Water Softeners; and Zero Liquid Discharge (ZLD) plants with Multi-Effect Evaporators (MEE) and ATFDs.",
    category: "General",
    order: 1,
    isActive: true,
    tags: ["EPC", "Plant Types", "Turnkey"],
  },
  {
    _id: "faq-2",
    question: "How does RP Global ensure compliance with CPCB and State Pollution Control Board (SPCB) discharge norms?",
    answer: "Every plant is custom-engineered around the client's inlet effluent characteristics (BOD, COD, TSS, TDS, Heavy Metals, pH) and designed strictly to meet or exceed CPCB/SPCB discharge standards. We provide treated effluent quality guarantees, process validation reports, and integrate online Continuous Emission/Effluent Monitoring Systems (OCEMS) with cloud telemetry directly linked to SPCB/CPCB server gateways.",
    category: "Compliance & Approvals",
    order: 2,
    isActive: true,
    tags: ["CPCB", "SPCB", "OCEMS", "Compliance"],
  },
  {
    _id: "faq-3",
    question: "What is the difference between MBBR, SBR, and MBR technologies for STP plants?",
    answer: "Moving Bed Biofilm Reactor (MBBR) uses virgin plastic media carriers for compact biological digestion with minimal footprint and low maintenance. Sequencing Batch Reactor (SBR) operates in batch phases (fill, react, settle, decant) offering high biological nutrient removal without separate clarifiers. Membrane Bioreactor (MBR) combines biological treatment with ultrafiltration membranes (<0.04 micron), producing crystal-clear water with BOD < 5 mg/L suitable for direct cooling tower reuse and flushing.",
    category: "STP & ETP Plants",
    order: 3,
    isActive: true,
    tags: ["STP", "MBBR", "SBR", "MBR"],
  },
  {
    _id: "faq-4",
    question: "What is Zero Liquid Discharge (ZLD) and when is it required for industrial facilities?",
    answer: "Zero Liquid Discharge (ZLD) is an advanced wastewater treatment process where all industrial effluent is purified, recycled back into operations, and concentrated into solid dry salts—leaving zero liquid discharge into municipal drains or surrounding environment. ZLD is mandatory for highly polluting 'Red Category' industries (Textiles, Distilleries, Pharmaceuticals, Tannery, Petrochemicals) under CPCB mandates.",
    category: "STP & ETP Plants",
    order: 4,
    isActive: true,
    tags: ["ZLD", "MEE", "Effluent", "Recycling"],
  },
  {
    _id: "faq-5",
    question: "What conductivity and purity levels can RP Global Demineralization (DM) plants achieve?",
    answer: "Our two-bed ion exchange DM systems (SAC + SBA) consistently produce treated water with electrical conductivity < 10 µS/cm. When integrated with a Mixed Bed (MB) Polishing unit or Electrodeionization (EDI), conductivity drops below 0.1 µS/cm with reactive silica < 0.02 ppm, satisfying critical boiler feedwater requirements (IBR standards) and USP-grade pharmaceutical formulations.",
    category: "RO & DM Systems",
    order: 5,
    isActive: true,
    tags: ["DM Plant", "Conductivity", "Ion Exchange", "Boiler Feed"],
  },
  {
    _id: "faq-6",
    question: "What is the typical project execution timeline from order placement to commercial commissioning?",
    answer: "Turnkey project execution typically ranges from 4 to 8 weeks for packaged skid-mounted systems (10 KLD to 250 KLD), and 12 to 24 weeks for large-scale custom civil-reinforced EPC installations (500 KLD to 10,000+ KLD). Timeline includes detailed engineering drawings (P&ID, GA), statutory vetting, fabrication, factory acceptance testing (FAT), on-site installation, and wet commissioning with bacterial seeding.",
    category: "General",
    order: 6,
    isActive: true,
    tags: ["Timeline", "EPC", "Commissioning"],
  },
  {
    _id: "faq-7",
    question: "Do you offer Annual Maintenance Contracts (AMC) and Plant Operation & Maintenance (O&M)?",
    answer: "Yes. RP Global provides full-spectrum Operation & Maintenance (O&M) contracts with dedicated, trained site engineers, chemical dosing management, daily laboratory testing logs, preventative maintenance, and statutory audit compliance. We also offer Comprehensive and Non-Comprehensive AMCs with 24/7 breakdown support across North India.",
    category: "Operations & Maintenance",
    order: 7,
    isActive: true,
    tags: ["AMC", "O&M", "Maintenance", "Service"],
  },
  {
    _id: "faq-8",
    question: "Can RP Global retrofit, upgrade, or expand existing under-performing water treatment plants?",
    answer: "Absolutely. We specialize in plant audits and brownfield upgrades. Typical revamps include upgrading conventional ASP/civil plants to high-rate MBBR/MBR to double throughput within the same physical tanks, replacing aging sand/carbon filters with automated multi-port disc filtration, upgrading RO membranes, and retrofitting PLC/SCADA automation.",
    category: "Operations & Maintenance",
    order: 8,
    isActive: true,
    tags: ["Retrofit", "Upgrade", "Audits", "Capacity Expansion"],
  },
];

interface FAQSectionProps {
  onOpenRFQ?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenRFQ }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>(FALLBACK_FAQS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch live FAQs from backend
  useEffect(() => {
    let isMounted = true;
    async function loadFAQs() {
      try {
        const res = await api.getFAQs();
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFaqs(res.data);
          // Set first active item expanded by default
          if (res.data[0]) {
            setExpandedId(res.data[0]._id || res.data[0].id || "faq-1");
          }
        }
      } catch (err) {
        console.error("Could not fetch FAQs from backend, using fallback dataset", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFAQs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [faqs]);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      if (!faq.isActive && faq.isActive !== undefined) return false;
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#f7f9fa] py-20 lg:py-28 text-slate-800"
      aria-labelledby="faq-heading"
    >
      {/* Decorative technical grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#1a5962 1px, transparent 1px), linear-gradient(90deg, #1a5962 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#1a5962]/20 bg-[#1a5962]/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1a5962]"
          >
            <HelpCircle className="h-4 w-4 text-[#1a5962]" />
            <span>Industrial Clarifications & FAQ</span>
          </motion.div>

          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#17343b] sm:text-4xl lg:text-5xl"
          >
            Clear Answers for Your Water EPC Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base text-slate-600 sm:text-lg"
          >
            Comprehensive technical and statutory insights into plant sizing, CPCB/SPCB discharge
            guidelines, operational guarantees, and turnkey commissioning.
          </motion.p>
        </div>

        {/* Search & Category Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Category Tabs */}
          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="FAQ categories"
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isSelected
                      ? "bg-[#1a5962] text-white shadow-md shadow-[#1a5962]/20 scale-[1.02]"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, CPCB, RO, STP..."
              aria-label="Search FAQs"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1a5962] focus:outline-none focus:ring-2 focus:ring-[#1a5962]/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* FAQs Accordion Container */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <FileQuestion className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-base font-semibold text-slate-700">No matching questions found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try searching for another keyword or selecting a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a5962] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const itemId = faq._id || faq.id || `faq-item-${index}`;
              const isExpanded = expandedId === itemId;

              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
                    isExpanded
                      ? "border-[#1a5962]/35 bg-white shadow-md shadow-slate-200/50"
                      : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Left accent indicator when expanded */}
                  <div
                    className={`absolute inset-y-0 left-0 w-1.5 transition-colors duration-200 ${
                      isExpanded ? "bg-[#1a5962]" : "bg-transparent group-hover:bg-slate-200"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Accordion Header Button */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(itemId)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a5962]"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#1a5962]/75">
                          {String(index + 1).padStart(2, "0")}.
                        </span>
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                          {faq.category}
                        </span>
                        {faq.tags && faq.tags.length > 0 && (
                          <div className="hidden sm:flex items-center gap-1">
                            {faq.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded px-1.5 py-0.5 text-[9px] font-medium bg-[#1a5962]/5 text-[#1a5962]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <h3
                        className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                          isExpanded ? "text-[#1a5962]" : "text-[#17343b] group-hover:text-[#1a5962]"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                        isExpanded
                          ? "border-[#1a5962] bg-[#1a5962] text-white rotate-180"
                          : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-300 group-hover:bg-slate-100"
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Accordion Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`faq-answer-${itemId}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-5 sm:px-6 pt-4 pb-6">
                          <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
                            {faq.answer}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/60 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Verified by RP Global Engineering Team
                            </span>
                            {onOpenRFQ && (
                              <button
                                type="button"
                                onClick={onOpenRFQ}
                                className="inline-flex items-center gap-1 font-semibold text-[#1a5962] hover:text-[#17343b] transition-colors"
                              >
                                <span>Discuss This Plant Type</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom Call to Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 overflow-hidden rounded-2xl bg-[#0f1d31] p-6 sm:p-10 text-white shadow-xl relative"
        >
          {/* Background glowing water gradient */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0077B6]/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#1a5962]/30 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                <Headphones className="h-4 w-4" />
                <span>Technical EPC Consultation</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Have an Effluent Water Report or Custom Requirement?
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Our environmental process engineers will review your raw water lab test (BOD, COD, TDS, pH)
                and deliver a preliminary P&ID flow schematic and CAPEX estimate within 24 hours.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onOpenRFQ && (
                <button
                  type="button"
                  data-magnetic="true"
                  onClick={onOpenRFQ}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0077B6] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#006296] transition-all cursor-pointer hover:shadow-cyan-500/20"
                >
                  <Droplets className="h-4 w-4" />
                  <span>Request Plant Quote</span>
                </button>
              )}
              <a
                href="tel:+919811223344"
                data-magnetic="true"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
              >
                <span>Call Process Desk</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
