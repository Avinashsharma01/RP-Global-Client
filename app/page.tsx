"use client";

import { useState } from "react";
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

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | undefined>(undefined);
  const [selectedCapacity, setSelectedCapacity] = useState<number | undefined>(undefined);

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
      <Hero onOpenRFQ={handleOpenRFQ} />

      {/* Company credentials and delivery history */}
      <MetricsSection />

      {/* Who We Are: Engineering Excellence (Original Site Core Section) */}
      <WhoWeAre />

      {/* Interactive Water Clarification & EPC Process Simulator */}
      <WaterPurificationFlow />

      {/* 6 Core Industrial Plant Solutions Grid */}
      <SolutionsGrid />

      {/* Deferred heavy sections for ultra-smooth scrolling and fast initial TBT */}
      <div className="content-visibility-auto">
        {/* Interactive Plant Capacity Estimator */}
        <PlantCalculator onSelectEstimate={handleSelectEstimate} />
      </div>

      <div className="content-visibility-auto">
        {/* Live EPC Project Tracker (Active Running & Commissioned Plants) */}
        <ProjectsTracker onOpenRFQ={(plant) => handleOpenRFQ(plant)} />
      </div>

      <div className="content-visibility-auto">
        {/* Why Choose RP Global (Value Proposition) */}
        <ValueProposition />
      </div>

      <div className="content-visibility-auto">
        {/* Official Government & ISO Accreditations (Certified for Excellence) */}
        <CertificationsSection />
      </div>

      <div className="content-visibility-auto">
        {/* Trusted Industrial Partners & Clients Showcase */}
        <PartnersSection />
      </div>

      <div className="content-visibility-auto">
        {/* Client Industries Marquee */}
        <ClientMarquee onOpenRFQ={handleOpenRFQ} />
      </div>

      <div className="content-visibility-auto">
        {/* Industrial Clarifications & Frequently Asked Questions */}
        <FAQSection onOpenRFQ={() => handleOpenRFQ()} />
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
