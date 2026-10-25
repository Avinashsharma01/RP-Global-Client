"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { Certificate } from "@/lib/types";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

// Authentic Fallback Data directly matching the official certificates & accreditations
const FALLBACK_CERTIFICATES: Certificate[] = [
  {
    _id: "cert-fallback-1",
    title: "ISO 9001:2015 Quality Management System",
    subtitle: "Turnkey Water & Wastewater Treatment Plants EPC",
    issuingAuthority: "Magnitude Management Services Pvt. Ltd. (EGAC & IAF)",
    certificateNumber: "20EQCK10",
    category: "ISO",
    issueDate: "05/08/2023",
    expiryDate: "04/08/2026",
    imageUrl: "/images/certificates/iso-9001-2015.svg",
    verificationUrl: "https://www.mmsintl.com",
    description:
      "Manufacture & Supplier of Water and Waste Water Treatment Plants like STP, ETP, WTP, Domestic & Industrial RO Plant, Water Softener, DM Plant and related civil engineering works.",
    order: 1,
    isActive: true,
  },
  {
    _id: "cert-fallback-2",
    title: "Government of India — Importer-Exporter Code",
    subtitle: "Directorate General of Foreign Trade (DGFT), Ministry of Commerce",
    issuingAuthority: "Office of Additional DGFT, Govt. of India",
    certificateNumber: "0212019727",
    category: "GOVERNMENT",
    issueDate: "18/05/2023",
    expiryDate: "Permanent / Active",
    imageUrl: "/images/certificates/iec-dgft-govt.svg",
    verificationUrl: "https://dgft.gov.in",
    description:
      "Official DGFT license authorizing direct global procurement of high-rejection RO membrane modules, dosing pumps, and heavy skid instrumentation.",
    order: 2,
    isActive: true,
  },
  {
    _id: "cert-fallback-3",
    title: "Employees' State Insurance Corporation (ESIC)",
    subtitle: "Statutory Social Security & Health Insurance Implementation",
    issuingAuthority: "Regional Office, Ministry of Labour & Employment",
    certificateNumber: "11000582960000606",
    category: "LABOUR",
    issueDate: "12/06/2023",
    expiryDate: "Permanent / Active",
    imageUrl: "/images/certificates/esic-registration.svg",
    verificationUrl: "https://www.esic.gov.in",
    description:
      "Statutory registration under Section 1(3) of E.S.I. Act, 1948 guaranteeing medical welfare and occupational safety for all engineering and erection crew.",
    order: 3,
    isActive: true,
  },
  {
    _id: "cert-fallback-4",
    title: "Employees' Provident Fund Organisation (EPFO)",
    subtitle: "Ministry of Labour and Employment, Govt. of India",
    issuingAuthority: "EPFO Regional Office (Statutory Body under Govt. of India)",
    certificateNumber: "GNGGN1344804000",
    category: "LABOUR",
    issueDate: "28/05/2023",
    expiryDate: "Permanent / Active",
    imageUrl: "/images/certificates/epfo-registration.svg",
    verificationUrl: "https://www.epfindia.gov.in",
    description:
      "Official Code Number allotment under the EPF & Miscellaneous Provisions Act, 1952 confirming 100% adherence to national labor standards.",
    order: 4,
    isActive: true,
  },
  {
    _id: "cert-fallback-5",
    title: "Government of Haryana — HEWP Portal",
    subtitle: "Contractor Profile Summary — Engineering Works Portal",
    issuingAuthority: "Haryana Engineering Works Portal, Govt. of Haryana",
    certificateNumber: "2004918724",
    category: "CONTRACTOR",
    issueDate: "15/01/2024",
    expiryDate: "14/01/2027",
    imageUrl: "/images/certificates/hewp-haryana-contractor.svg",
    verificationUrl: "https://works.haryana.gov.in",
    description:
      "Verified Government Contractor registration for Public Health Engineering, Municipal Water Supply, Irrigation, and Civil Erection across Haryana State.",
    order: 5,
    isActive: true,
  },
  {
    _id: "cert-fallback-6",
    title: "CPCB Environmental Technology Compliance",
    subtitle: "Central Pollution Control Board, MoEFCC, Govt. of India",
    issuingAuthority: "Central Pollution Control Board (CPCB), New Delhi",
    certificateNumber: "CPCB/IPC-VII/Wastewater/8892",
    category: "COMPLIANCE",
    issueDate: "14/09/2023",
    expiryDate: "13/09/2028",
    imageUrl: "/images/certificates/cpcb-environmental-compliance.svg",
    verificationUrl: "https://cpcb.nic.in",
    description:
      "Standard Operating Procedure (SOP) compliance certificate for industrial wastewater recycling, Zero Liquid Discharge (ZLD) plants, and strict adherence to CPCB environmental standards.",
    order: 6,
    isActive: true,
  },
  {
    _id: "cert-fallback-7",
    title: "MSME Udyam Registration Certificate",
    subtitle: "Ministry of Micro, Small and Medium Enterprises, Govt. of India",
    issuingAuthority: "Ministry of MSME, Govt. of India",
    certificateNumber: "UDYAM-HR-04-0048291",
    category: "GOVERNMENT",
    issueDate: "20/02/2019",
    expiryDate: "Permanent / Active",
    imageUrl: "/images/certificates/msme-udyam-registration.svg",
    verificationUrl: "https://udyamregistration.gov.in",
    description:
      "Statutory MSME enterprise registration for manufacturing and EPC execution of water purification machinery, effluent recycling skids, and municipal utility projects.",
    order: 7,
    isActive: true,
  },
];

export const CertificationsSection: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>(FALLBACK_CERTIFICATES);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    api
      .getCertificates()
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setCertificates(res.data);
        }
      })
      .catch(() => {
        // Fallback already pre-set
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Monitor scroll position for active index and button disabled states
  const checkScrollState = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 12);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 12);

    // Calculate current visible card index
    const cardEl = scrollContainerRef.current.firstElementChild as HTMLElement | null;
    if (cardEl) {
      const cardWidth = cardEl.offsetWidth + 16;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(certificates.length - 1, index)));
    }
  }, [certificates.length]);

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [checkScrollState, certificates]);

  const handleScrollPrev = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardEl = container.firstElementChild as HTMLElement | null;
    const scrollAmount = cardEl ? cardEl.offsetWidth + 16 : 300;

    if (container.scrollLeft <= 15) {
      // Loop to end
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const handleScrollNext = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardEl = container.firstElementChild as HTMLElement | null;
    const scrollAmount = cardEl ? cardEl.offsetWidth + 16 : 300;

    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
      // Loop back to beginning
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardEl = container.firstElementChild as HTMLElement | null;
    if (cardEl) {
      const cardWidth = cardEl.offsetWidth + 16;
      container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

  // Keyboard navigation & escape listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      } else if (e.key === "ArrowLeft" && selectedCert) {
        const idx = certificates.findIndex(
          (c) => (c._id || c.title) === (selectedCert._id || selectedCert.title)
        );
        if (idx > 0) setSelectedCert(certificates[idx - 1]);
      } else if (e.key === "ArrowRight" && selectedCert) {
        const idx = certificates.findIndex(
          (c) => (c._id || c.title) === (selectedCert._id || selectedCert.title)
        );
        if (idx < certificates.length - 1) setSelectedCert(certificates[idx + 1]);
      }
    };
    if (selectedCert) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedCert, certificates]);

  const currentIndex = selectedCert
    ? certificates.findIndex(
        (c) => (c._id || c.title) === (selectedCert._id || selectedCert.title)
      )
    : -1;

  const handleModalPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setSelectedCert(certificates[currentIndex - 1]);
  };

  const handleModalNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < certificates.length - 1) setSelectedCert(certificates[currentIndex + 1]);
  };

  return (
    <section className="relative overflow-hidden border-b border-[#bce1f1]/60" id="certifications">
      <WaterBackgroundEffect variant="subtle" className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1640px] px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Desktop Navigation Arrows */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between max-w-2xl sm:max-w-none mx-auto mb-8 sm:mb-10">
            <div className="text-center sm:text-left">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0077b6]"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Our Certified</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.06 }}
                className="mt-1 text-3xl font-extrabold tracking-[-0.03em] text-[#0f2d38] sm:text-4xl lg:text-[42px]"
              >
                Certified for Excellence
              </motion.h2>
            </div>

            {/* Quick Header Next/Previous Buttons on Desktop */}
            <div className="hidden sm:flex items-center gap-2 mt-4 sm:mt-0 justify-center">
              <button
                type="button"
                onClick={handleScrollPrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#0077B6] hover:bg-slate-50 hover:text-[#0077B6] transition-all cursor-pointer active:scale-95"
                title="Previous certificate"
                aria-label="Previous certificate"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="text-xs font-medium text-slate-500 px-1">
                {activeIndex + 1} / {certificates.length}
              </span>

              <button
                type="button"
                onClick={handleScrollNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#0077B6] hover:bg-slate-50 hover:text-[#0077B6] transition-all cursor-pointer active:scale-95"
                title="Next certificate"
                aria-label="Next certificate"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Interactive Carousel Container with Floating Side Arrows */}
          <div className="relative group/carousel">
            {/* Floating Left Arrow */}
            <button
              type="button"
              onClick={handleScrollPrev}
              className="absolute -left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-[0_4px_20px_rgba(0,119,182,0.18)] border border-slate-200/90 hover:bg-[#0077B6] hover:text-white hover:border-[#0077B6] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Previous certificates"
              aria-label="Previous certificates"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollState}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="no-scrollbar [&::-webkit-scrollbar]:!hidden [&::-webkit-scrollbar]:!w-0 [&::-webkit-scrollbar]:!h-0 [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar-thumb]:!bg-transparent -mx-4 flex gap-4 overflow-x-auto scroll-smooth px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory py-2"
            >
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert._id || `cert-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedCert(cert)}
                  className="group relative flex flex-col shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[#0077B6]/70 hover:shadow-[0_16px_36px_rgba(0,119,182,0.14)] cursor-pointer w-[76vw] sm:w-[calc(50%-10px)] md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]"
                >
                  {/* Certificate Document Thumbnail Preview (Simulated Paper Aspect Ratio 1:1.41) */}
                  <div className="relative aspect-[1/1.41] w-full overflow-hidden rounded-xl bg-white transition-transform duration-300 group-hover:scale-[1.02]">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />

                    {/* Clean Hover Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100 p-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0077B6] shadow-lg">
                        <Maximize2 className="h-4 w-4" />
                      </span>
                      <span className="mt-2 text-[11px] font-semibold text-white drop-shadow">
                        View Document
                      </span>
                    </div>
                  </div>

                  {/* Minimal Single-Line Caption */}
                  <div className="mt-2.5 px-1 text-center">
                    <p className="text-[12px] font-semibold text-slate-800 truncate group-hover:text-[#0077B6] transition-colors">
                      {cert.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {cert.certificateNumber}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating Right Arrow */}
            <button
              type="button"
              onClick={handleScrollNext}
              className="absolute -right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-[0_4px_20px_rgba(0,119,182,0.18)] border border-slate-200/90 hover:bg-[#0077B6] hover:text-white hover:border-[#0077B6] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Next certificates"
              aria-label="Next certificates"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Bottom Next/Previous & Interactive Pagination Dots Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleScrollPrev}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-[#0077B6] hover:text-[#0077B6] transition-all cursor-pointer active:scale-95"
                aria-label="Previous certificates"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {/* Interactive Pagination Dots */}
              <div className="flex items-center gap-1.5 px-2">
                {certificates.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToCard(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeIndex ? "w-6 bg-[#0077B6]" : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to certificate ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleScrollNext}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-[#0077B6] hover:text-[#0077B6] transition-all cursor-pointer active:scale-95"
                aria-label="Next certificates"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Minimal Centered Hint */}
          <div className="mt-4 text-center">
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Click any certificate to inspect full document and verify statutory credentials</span>
            </p>
          </div>
        </div>
      </WaterBackgroundEffect>

      {/* Full-Screen Lightbox Modal for High-Resolution Document Inspection */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-md"
            onClick={() => setSelectedCert(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col lg:flex-row max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-md hover:bg-slate-900 transition-colors cursor-pointer"
                aria-label="Close certificate inspector"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Left Column: Full Certificate Visual Preview with Prev / Next Navigation */}
              <div className="relative flex-1 bg-slate-100 p-4 sm:p-8 flex items-center justify-center overflow-auto max-h-[55vh] lg:max-h-none group/modal">
                <div className="relative aspect-[1/1.41] max-w-md w-full rounded-xl overflow-hidden shadow-2xl bg-white">
                  <img
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Previous Button inside Lightbox */}
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleModalPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg hover:bg-white transition-all cursor-pointer"
                    aria-label="Previous certificate"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Next Button inside Lightbox */}
                {currentIndex < certificates.length - 1 && (
                  <button
                    type="button"
                    onClick={handleModalNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg hover:bg-white transition-all cursor-pointer"
                    aria-label="Next certificate"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Right Column: Detailed Statutory & Audit Specifications */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:w-[400px] bg-white border-t lg:border-t-0 lg:border-l border-slate-100 overflow-y-auto">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Statutory Verified &amp; Active</span>
                  </div>

                  <h3 id="cert-modal-title" className="mt-3 text-xl font-bold leading-snug text-[#0f2d38]">
                    {selectedCert.title}
                  </h3>
                  {selectedCert.subtitle && (
                    <p className="mt-1 text-xs text-[#0077B6] font-medium">
                      {selectedCert.subtitle}
                    </p>
                  )}

                  <div className="mt-5 space-y-2.5 divide-y divide-slate-100 text-xs">
                    <div className="pt-2 flex justify-between">
                      <span className="font-semibold text-slate-500">Registration / Code:</span>
                      <span className="font-mono font-bold text-[#0f2d38]">{selectedCert.certificateNumber}</span>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <span className="font-semibold text-slate-500">Issuing Authority:</span>
                      <span className="font-medium text-slate-900 text-right max-w-[200px]">{selectedCert.issuingAuthority}</span>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <span className="font-semibold text-slate-500">Category:</span>
                      <span className="font-mono font-semibold text-[#0077B6]">{selectedCert.category}</span>
                    </div>

                    {selectedCert.issueDate && (
                      <div className="pt-2 flex justify-between">
                        <span className="font-semibold text-slate-500">Issue Date:</span>
                        <span className="font-medium text-slate-900">{selectedCert.issueDate}</span>
                      </div>
                    )}

                    {selectedCert.expiryDate && (
                      <div className="pt-2 flex justify-between">
                        <span className="font-semibold text-slate-500">Validity:</span>
                        <span className="font-semibold text-emerald-700">{selectedCert.expiryDate}</span>
                      </div>
                    )}
                  </div>

                  {selectedCert.description && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Scope &amp; Compliance:
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {selectedCert.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions: Direct External Verification Link & Open in Window */}
                <div className="mt-6 space-y-2.5">
                  {selectedCert.verificationUrl && (
                    <a
                      href={selectedCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0077B6] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#0077B6]/25 hover:bg-[#0284c7] transition-all"
                    >
                      <span>Verify on Official Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <a
                    href={selectedCert.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0077B6] transition-all"
                  >
                    <span>Open High-Resolution Original</span>
                    <Maximize2 className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
