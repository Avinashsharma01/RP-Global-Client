"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { PlantCalculator } from "@/components/home/PlantCalculator";
import { SolutionsGrid } from "@/components/home/SolutionsGrid";
import { ProjectsTracker } from "@/components/home/ProjectsTracker";
import { ValueProposition } from "@/components/home/ValueProposition";
import { CertificationsSection } from "@/components/home/CertificationsSection";
import { MetricsSection } from "@/components/home/MetricsSection";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { PartnersSection } from "@/components/home/PartnersSection";
import { FAQSection } from "@/components/home/FAQSection";
import { QuickRFQModal } from "@/components/home/QuickRFQModal";
import { WaterPurificationFlow } from "@/components/home/WaterPurificationFlow";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { LandingContentCollection } from "@/lib/types";
import { api } from "@/lib/api";

export default function HomePage() {
  const [content, setContent] = useState<Partial<LandingContentCollection>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | undefined>(undefined);
  const [selectedCapacity, setSelectedCapacity] = useState<number | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    api
      .getLandingContent()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setContent(res.data);
        }
      })
      .catch((err) => {
        console.warn("Using offline landing defaults:", err);
      });

    const handleGlobalRFQ = (e: Event) => {
      const customEvent = e as CustomEvent<{ plant?: string; capacity?: number }>;
      handleOpenRFQ(customEvent.detail?.plant);
    };
    window.addEventListener("open-quick-rfq", handleGlobalRFQ);

    return () => {
      isMounted = false;
      window.removeEventListener("open-quick-rfq", handleGlobalRFQ);
    };
  }, []);

  const handleOpenRFQ = (plantType?: string) => {
    setSelectedPlant(plantType || "Sewage Treatment Plant (STP)");
    setSelectedCapacity(100);
    setIsModalOpen(true);
  };

  const handleSelectEstimate = (plantType: string, capacityKLD: number) => {
    setSelectedPlant(plantType);
    setSelectedCapacity(capacityKLD);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Top Hydraulic Scroll Stream Indicator */}
      <ScrollProgressBar />

      {/* Hero Section with Interactive Water Ripple Canvas */}
      <Hero data={content.hero} onOpenRFQ={handleOpenRFQ} />

      {/* Company credentials and delivery history */}
      <MetricsSection data={content.metrics} />

      {/* Who We Are: Engineering Excellence (Original Site Core Section) */}
      <WhoWeAre data={content.whoWeAre} />

      {/* Interactive Water Clarification & EPC Process Simulator */}
      <WaterPurificationFlow data={content.waterPurificationFlow} />

      {/* 6 Core Industrial Plant Solutions Grid */}
      <SolutionsGrid data={content.solutionsGrid} />

      {/* Deferred heavy sections for ultra-smooth scrolling and fast initial TBT */}
      <div className="content-visibility-auto">
        {/* Interactive Plant Capacity Estimator */}
        <PlantCalculator data={content.plantCalculator} onSelectEstimate={handleSelectEstimate} />
      </div>

      <div className="content-visibility-auto">
        {/* Live EPC Project Tracker (Active Running & Commissioned Plants) */}
        <ProjectsTracker data={content.projectTracker} onOpenRFQ={(plant) => handleOpenRFQ(plant)} />
      </div>

      <div className="content-visibility-auto">
        {/* Why Choose RP Global (Value Proposition) */}
        <ValueProposition data={content.valueProposition} />
      </div>

      <div className="content-visibility-auto">
        {/* Official Government and ISO registrations */}
        <CertificationsSection data={content.certifications} />
      </div>

      <div className="content-visibility-auto">
        {/* Trusted Industrial Partners & Clients Showcase */}
        <PartnersSection data={content.partners} />
      </div>

      <div className="content-visibility-auto">
        {/* Client Industries Marquee */}
        <ClientMarquee data={content.clientMarquee} onOpenRFQ={handleOpenRFQ} />
      </div>

      <div className="content-visibility-auto">
        {/* Industrial Clarifications & Frequently Asked Questions */}
        <FAQSection data={content.faqs} onOpenRFQ={() => handleOpenRFQ()} />
      </div>

      {/* Interactive RFQ Modal */}
      <QuickRFQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultPlant={selectedPlant}
        defaultCapacityKLD={selectedCapacity}
      />
    </>
  );
}
