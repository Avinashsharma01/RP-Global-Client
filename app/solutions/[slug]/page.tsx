import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Droplets,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Building,
  Factory,
} from "lucide-react";
import { api } from "@/lib/api";
import { PLANT_SOLUTIONS, COMPANY_INFO } from "@/lib/constants";
import { ProcessStep, TechnicalSpec, ComparisonRow } from "@/lib/types";
import { ProcessFlowchart } from "@/components/solutions/ProcessFlowchart";
import { SpecTable } from "@/components/solutions/SpecTable";
import { TechnologyComparison } from "@/components/solutions/TechnologyComparison";
import { InlineRFQ } from "@/components/solutions/InlineRFQ";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

export interface PlantSolutionDetail {
  name: string;
  tagline: string;
  capacityRange: string;
  summary: string;
  description: string;
  keyFeatures: string[];
  processSteps: ProcessStep[];
  technicalSpecs: TechnicalSpec[];
  comparisonMatrix: ComparisonRow[];
  applications: string[];
  brochureUrl?: string;
}

// Static parameters for all 6 plants
export function generateStaticParams() {
  return PLANT_SOLUTIONS.map((plant) => ({
    slug: plant.slug,
  }));
}

// Fallback technical data map for build-time static generation
const FALLBACK_SPECS: Record<string, PlantSolutionDetail> = {
  "demineralization-plants": {
    name: "Demineralization (DM) Plant",
    tagline: "High-Purity Deionized Water for High-Pressure Boilers, Power & Pharmaceutical Processing",
    capacityRange: "500 LPH to 100 m³/hr",
    summary:
      "Engineered two-bed and mixed-bed ion exchange demineralization systems producing high-purity water with conductivity < 0.1 µS/cm and silica < 0.02 ppm.",
    description:
      "R P Global Projects designs, fabricates, and commissions Demineralization (DM) Plants that remove dissolved mineral salts, ions, and reactive silica from process feed water. Strong Acid Cation (SAC) and Strong Base Anion (SBA) resins, with optional Mixed Bed (MB) polishers, are selected for boiler feed and pharmaceutical process requirements.",
    keyFeatures: [
      "Conductivity target below 0.1 µS/cm with mixed bed polishing",
      "Automatic acid (HCl) and caustic (NaOH) regeneration skids with zero leak containment",
      "FRP / Rubber-Lined Mild Steel (MSRL) pressure vessels resistant to corrosive reagents",
      "Digital PLC/SCADA control panel with online conductivity & silica monitoring",
      "Low chemical consumption through counter-current regeneration technology",
    ],
    processSteps: [
      { stepNumber: 1, title: "Pre-Filtration & Coagulation", description: "Feed water passes through Dual Media Filter and Carbon Filter.", equipmentUsed: "Dual Media Pressure Vessels" },
      { stepNumber: 2, title: "Strong Acid Cation Exchanger (SAC)", description: "Cations (Ca2+, Mg2+, Na+) exchanged for Hydrogen ions (H+).", equipmentUsed: "SAC Resin Tower" },
      { stepNumber: 3, title: "Degasser Tower (Decarbonation)", description: "Low pH carbonic acid stripped via counter-flow air blower.", equipmentUsed: "FRP Degasser Column" },
      { stepNumber: 4, title: "Strong Base Anion Exchanger (SBA)", description: "Anions (SO4 2-, Cl-, SiO2) exchanged for Hydroxyl ions (OH-).", equipmentUsed: "SBA Resin Tower" },
      { stepNumber: 5, title: "Mixed Bed Polisher (MB)", description: "Intimately mixed resins eliminate remaining traces of ions.", equipmentUsed: "Mixed Bed Cylinder" },
    ],
    technicalSpecs: [
      { label: "Product Water Conductivity", value: "< 0.1 µS/cm (with MB) / < 10 µS/cm (Two-Bed)", unit: "µS/cm", category: "Water Quality" },
      { label: "Reactive Silica as SiO2", value: "< 0.02", unit: "ppm", category: "Water Quality" },
      { label: "Treated Water pH", value: "6.8 – 7.2", unit: "pH", category: "Water Quality" },
      { label: "Vessel Material of Construction", value: "FRP / MSRL (Mild Steel Rubber Lined)", category: "Mechanical" },
      { label: "Automation Level", value: "Manual, Semi-Automatic, or Full PLC/SCADA", category: "Control System" },
    ],
    comparisonMatrix: [
      { parameter: "Product Conductivity", techOptionA: "5 to 15 µS/cm (Two-Bed DM)", techOptionB: "< 0.1 µS/cm (Two-Bed + Mixed Bed)", techOptionC: "< 0.05 µS/cm (RO + EDI)" },
      { parameter: "Chemical Footprint", techOptionA: "Requires regular HCl & NaOH", techOptionB: "Requires acid & alkali", techOptionC: "Chemical-free electric regeneration" },
      { parameter: "Capital Investment", techOptionA: "Cost-Effective / Economical", techOptionB: "Moderate", techOptionC: "Higher initial equipment investment" },
    ],
    applications: [
      "Thermal Power & High-Pressure Boilers",
      "Pharmaceutical APIs & Formulation Rinse",
      "Semiconductor & Electronics Fabrication",
      "Chemical Manufacturing & Synthetic Reactions",
    ],
    brochureUrl: "/downloads/rpglobal-dm-plants-spec.pdf",
  },
  "effluent-treatment-plants": {
    name: "Effluent Treatment Plant (ETP)",
    tagline: "Industrial Wastewater Remediation, Heavy Metal Removal & Zero Liquid Discharge (ZLD)",
    capacityRange: "10 KLD to 2,000+ KLD",
    summary:
      "Turnkey industrial wastewater plants combining physico-chemical precipitation, biological treatment, and tertiary filtration for applicable CPCB requirements.",
    description:
      "R P Global Projects delivers industrial Effluent Treatment Plants (ETP) for hazardous, chemical-laden, and high-COD/BOD discharge. For textile dye houses, chemical refineries, electroplating units, and food processing facilities, the process may include dissolved air flotation (DAF), moving bed biofilm reactors (MBBR), membrane bioreactors (MBR), and Zero Liquid Discharge (ZLD).",
    keyFeatures: [
      "Discharge targets set against state (SPCB) and central (CPCB) pollution control parameters",
      "Over 90% COD and 95% BOD reduction",
      "Compact Skid-Mounted ETP options for space-constrained premises",
      "Automated chemical dosing (Coagulant, Flocculant, Lime, Alum, Poly-electrolyte)",
      "Integrated sludge dewatering filter press reducing hazardous cake volume",
    ],
    processSteps: [
      { stepNumber: 1, title: "Screening & Oil Separation", description: "Mechanical bar screens and grease traps remove debris and floating hydrocarbons.", equipmentUsed: "Mechanical Bar Screen & Oil Skimmer" },
      { stepNumber: 2, title: "Equalization & Neutralization", description: "Surge volume buffering with coarse bubble aeration and pH correction.", equipmentUsed: "Equalization Tank with Air Grid" },
      { stepNumber: 3, title: "Flash Mixing & Primary Clarification", description: "Chemical precipitation using coagulants followed by laminar tube settling.", equipmentUsed: "Flash Mixer & Tube Settler Clarifier" },
      { stepNumber: 4, title: "Biological Aerobic Oxidation", description: "Bacterial degradation of soluble organics in aeration tank via MBBR fluidized carriers.", equipmentUsed: "MBBR Bioreactor with Membrane Diffusers" },
      { stepNumber: 5, title: "Tertiary Filtration & Sludge Dewatering", description: "Treated supernatant is filtered through pressure sand and carbon beds; sludge is pressed into dry cake.", equipmentUsed: "Filter Press & Dual Media Filter" },
    ],
    technicalSpecs: [
      { label: "BOD Reduction Efficiency", value: "> 95%", unit: "%", category: "Efficiency" },
      { label: "COD Reduction Efficiency", value: "> 90%", unit: "%", category: "Efficiency" },
      { label: "Treated Effluent TSS", value: "< 20", unit: "mg/L", category: "Water Quality" },
      { label: "Treated Effluent Oil & Grease", value: "< 5", unit: "mg/L", category: "Water Quality" },
      { label: "Sludge Cake Moisture Content", value: "< 60%", unit: "%", category: "Mechanical" },
    ],
    comparisonMatrix: [
      { parameter: "Treatment Strategy", techOptionA: "Conventional ASP", techOptionB: "Physico-Chemical + MBBR", techOptionC: "ZLD (ETP + RO + MEE Evaporator)" },
      { parameter: "Footprint Required", techOptionA: "Large civil basins required", techOptionB: "40% smaller footprint with carrier media", techOptionC: "Moderate with evaporator shed" },
      { parameter: "Environmental Outcome", techOptionA: "Surface discharge compliance", techOptionB: "Water suitable for flush/gardening", techOptionC: "100% water recovery with Zero Liquid Discharge" },
    ],
    applications: [
      "Textile Dyeing & Processing Units",
      "Electroplating & Surface Treatment",
      "Pharmaceutical API Facilities",
      "Food Processing & Dairies",
      "Chemical & Petrochemical Processing",
    ],
    brochureUrl: "/downloads/rpglobal-etp-plants-spec.pdf",
  },
  "reverse-osmosis-plants": {
    name: "Reverse Osmosis (RO) Plant",
    tagline: "High-Rejection Membrane Separation for Industrial Water Purification & Desalination",
    capacityRange: "250 LPH to 200 m³/hr",
    summary:
      "Commercial and industrial RO skids incorporating high-flux thin-film composite (TFC) membranes for brackish and sea water desalination with >98.5% salt rejection.",
    description:
      "R P Global Projects engineers high-efficiency industrial Reverse Osmosis (RO) plants built with premium grade pressure vessels, multistage vertical booster pumps, and computerized instrumentation. Our RO skids remove dissolved solids, heavy minerals, bacteria, and chemical contaminants from ground borewells, river supplies, and recycled wastewater.",
    keyFeatures: [
      "Salt and dissolved solid rejection rate exceeding 98.5%",
      "Recovery rates between 70% and 85% with concentrate recycling",
      "Stainless Steel (SS304/SS316) high-pressure manifolds with anti-corrosion protection",
      "Programmable microprocessor / PLC with automatic flush and CIP (Clean-In-Place) skid",
      "Online digital conductivity, flow rotameters, and pressure sensors",
    ],
    processSteps: [
      { stepNumber: 1, title: "Multi-Grade Sand & Carbon Filtration", description: "Turbidity and free chlorine are removed to prevent membrane fouling.", equipmentUsed: "Dual Media Pressure Vessels" },
      { stepNumber: 2, title: "Anti-Scalant Chemical Dosing", description: "Scale inhibitors prevent calcium carbonate precipitation.", equipmentUsed: "Electronic Metering Dosing Pumps" },
      { stepNumber: 3, title: "Micron Sediment Cartridge Filtration", description: "5-micron spun polypropylene filters trap fine particulates.", equipmentUsed: "SS316 Multi-Cartridge Housing" },
      { stepNumber: 4, title: "High-Pressure Booster Pumping", description: "Multistage pump raises feedwater pressure above osmotic threshold.", equipmentUsed: "Vertical Multistage SS Pump" },
      { stepNumber: 5, title: "RO Membrane Cross-Flow Separation", description: "Pure water permeates across spiral-wound polyamide membranes.", equipmentUsed: "TFC Spiral-Wound 8040 Membranes" },
    ],
    technicalSpecs: [
      { label: "TDS Salt Rejection Rate", value: "> 98.5%", unit: "%", category: "Performance" },
      { label: "Permeate Water Recovery", value: "70% – 85%", unit: "%", category: "Performance" },
      { label: "Membrane Type", value: "Polyamide Thin Film Composite (TFC) 4040 / 8040", category: "Mechanical" },
      { label: "Operating Pressure", value: "10 – 16", unit: "kg/cm²", category: "Operating Limits" },
    ],
    comparisonMatrix: [
      { parameter: "Configuration", techOptionA: "Standard Brackish RO Skid", techOptionB: "Two-Pass Ultra-Pure RO", techOptionC: "Sea Water RO (SWRO)" },
      { parameter: "Feed TDS Capability", techOptionA: "Up to 3,500 ppm", techOptionB: "Up to 2,000 ppm (Produces < 5 ppm)", techOptionC: "Up to 40,000 ppm High Salinity" },
    ],
    applications: [
      "Packaged Drinking Water & Mineral Bottling",
      "Industrial Cooling Towers & Boiler Feed",
      "Beverage, Brewery & Dairy Processing",
      "Hospitals & Healthcare Dialysis Water",
    ],
    brochureUrl: "/downloads/rpglobal-ro-plants-spec.pdf",
  },
  "sewage-treatment-plants": {
    name: "Sewage Treatment Plant (STP)",
    tagline: "Odourless Biological Domestic Sewage Treatment for Water Recycling in High-Rises & Campuses",
    capacityRange: "25 KLD to 5,000+ KLD",
    summary:
      "Biological sewage treatment plants using MBBR, SBR, and MBR technologies for treated water reuse in flushing and horticulture, with targets set against CPCB standards.",
    description:
      "R P Global Projects is a market leader in designing and constructing odorless, high-efficiency Sewage Treatment Plants (STP). Serving residential gated communities, commercial IT tech parks, educational campuses, and hotels, our systems treat domestic black and grey water with maximum nutrient removal and zero nuisance.",
    keyFeatures: [
      "Treated water fully compliant with Central Pollution Control Board (CPCB) norms",
      "Zero foul odor execution with enclosed tank covers and bio-filter venting",
      "Up to 75% water recycling for toilet flushing, gardening, and HVAC cooling towers",
      "Options for underground, semi-underground, or modular containerized configurations",
      "Low operating cost and minimal maintenance footprint with automated blowers",
    ],
    processSteps: [
      { stepNumber: 1, title: "Bar Screening & Grit Separation", description: "Stainless steel fine screens capture rags, plastics, and debris.", equipmentUsed: "Coarse and Fine Screen Chambers" },
      { stepNumber: 2, title: "Equalization & Homogenization", description: "Surge buffer tank equipped with air grid ensures uniform organic loading.", equipmentUsed: "Equalization Tank with Air Diffusers" },
      { stepNumber: 3, title: "Moving Bed Biofilm Reactor (MBBR)", description: "Virgin polypropylene carrier media provides massive surface area for biofilm culture.", equipmentUsed: "MBBR Tank with Bio-Media & Diffusers" },
      { stepNumber: 4, title: "Tube Settling Clarification", description: "Biomass and biological sludge settle out in laminar inclined tube modules.", equipmentUsed: "Clarifier with PVC Tube Settler Media" },
      { stepNumber: 5, title: "Tertiary Sand, Carbon & Disinfection", description: "Supernatant is polished through pressure filters and disinfected via chlorine / ozone.", equipmentUsed: "Multi-Grade Sand & Carbon Filters with UV" },
    ],
    technicalSpecs: [
      { label: "Treated BOD", value: "< 10", unit: "mg/L", category: "Water Quality" },
      { label: "Treated COD", value: "< 50", unit: "mg/L", category: "Water Quality" },
      { label: "Treated Total Suspended Solids (TSS)", value: "< 10", unit: "mg/L", category: "Water Quality" },
      { label: "Turbidity", value: "< 2", unit: "NTU", category: "Water Quality" },
      { label: "Faecal Coliform", value: "< 100", unit: "MPN/100ml", category: "Microbiological" },
    ],
    comparisonMatrix: [
      { parameter: "Technology Metric", techOptionA: "MBBR (Fluidized Biofilm)", techOptionB: "SBR (Sequencing Batch Reactor)", techOptionC: "MBR (Membrane Bioreactor)" },
      { parameter: "Footprint Required", techOptionA: "Compact (40% less than ASP)", techOptionB: "Moderate footprint (Batch tanks)", techOptionC: "Ultra-compact (Smallest footprint)" },
      { parameter: "Treated Water Quality", techOptionA: "BOD < 10 ppm (Gardening/Flushing)", techOptionB: "BOD < 10 ppm with nutrient removal", techOptionC: "BOD < 5 ppm, Turbidity < 0.2 NTU (Ultra-Pure)" },
    ],
    applications: [
      "Residential High-Rise Societies & Gated Townships",
      "Commercial IT Parks & Corporate Office Campuses",
      "Hospitals, Medical Colleges & Universities",
      "Hotels, Resorts & Luxury Clubhouses",
    ],
    brochureUrl: "/downloads/rpglobal-stp-plants-spec.pdf",
  },
  "water-softening-plants": {
    name: "Water Softening Plant",
    tagline: "Ion-Exchange Hardness Reduction for Boilers, Cooling Towers & Hospitality",
    capacityRange: "500 LPH to 150 m³/hr",
    summary:
      "Automatic and manual ion-exchange water softeners utilizing high-capacity sodium (Na+) cation exchange resins to eliminate calcium and magnesium scaling.",
    description:
      "R P Global Projects manufactures industrial and commercial Water Softening Plants engineered to eliminate hard water problems including scale deposition, pipe clogging, and boiler tube rupture. By replacing scale-forming calcium (Ca2+) and magnesium (Mg2+) ions with soluble sodium ions, our softeners protect expensive heat exchangers, cooling towers, and laundry machinery.",
    keyFeatures: [
      "Treated water hardness consistently reduced to below 5 ppm (as CaCO3)",
      "Automatic multiport valves with timer or flow-meter controlled regeneration cycles",
      "High-capacity cross-linked polystyrene gel cation exchange resin",
      "Corrosion-resistant FRP composite pressure vessels with internal distribution headers",
      "Complete brine saturator tank with salt grid, suction float valve, and brine tubing",
    ],
    processSteps: [
      { stepNumber: 1, title: "Hard Water Service Run", description: "Hard water percolates through sodium-charged cation resin bed, exchanging hardness ions for sodium.", equipmentUsed: "FRP Vessel with top distributor" },
      { stepNumber: 2, title: "Backwash Phase", description: "Water flows upward to expand the resin bed, flushing away trapped particulate impurities.", equipmentUsed: "Multiport Control Valve" },
      { stepNumber: 3, title: "Brine Suction & Regeneration", description: "Concentrated NaCl brine solution is drawn into the vessel via ejector, recharging resin beads with Na+.", equipmentUsed: "Brine Tank with suction assembly" },
      { stepNumber: 4, title: "Slow & Fast Rinse", description: "Fresh water displaces remaining brine solution and compacts the resin bed back into service readiness.", equipmentUsed: "Multiport Valve Rinse Cycle" },
    ],
    technicalSpecs: [
      { label: "Treated Water Hardness", value: "< 5", unit: "ppm (as CaCO3)", category: "Water Quality" },
      { label: "Resin Type", value: "Strong Acid Cation (Gel Type Polystyrene)", category: "Chemical" },
      { label: "Operating Pressure", value: "2.0 – 3.5", unit: "kg/cm²", category: "Operating Limits" },
    ],
    comparisonMatrix: [
      { parameter: "Regeneration Mode", techOptionA: "Manual Multiport Valve", techOptionB: "Automatic Time-Clock Control", techOptionC: "Automatic Metered (Volumetric) Valve" },
      { parameter: "Operator Oversight", techOptionA: "Requires manual valve rotation by operator", techOptionB: "Regenerates automatically on set days/times", techOptionC: "Regenerates strictly upon water volume consumption" },
    ],
    applications: [
      "Low & Medium Pressure Industrial Boilers",
      "Cooling Towers & Heat Exchanger Makeup",
      "Commercial Laundries & Textile Finishing",
      "Hotels, Commercial Kitchens & Restaurants",
    ],
    brochureUrl: "/downloads/rpglobal-softener-plants-spec.pdf",
  },
  "water-treatment-plants": {
    name: "Water Treatment Plant (WTP)",
    tagline: "Surface & River Water Clarification, Rapid Sand Filtration & Municipal Potable Water",
    capacityRange: "1 MLD to 50 MLD / 10 m³/hr to 500 m³/hr",
    summary:
      "Turnkey municipal and industrial surface water treatment plants engineered with coagulation, flocculation, lamella clarification, and rapid gravity filtration delivering WHO/BIS potable standards.",
    description:
      "R P Global Projects specializes in turnkey EPC delivery of large-scale Water Treatment Plants (WTP) sourcing raw water from rivers, lakes, canals, and reservoirs. Our engineering expertise spans raw water intake structures, alum/PAC chemical coagulant flash mixers, flocculators, lamella tube clarifiers, rapid sand filters, and chlorination systems designed to supply drinking and industrial-grade water.",
    keyFeatures: [
      "Treated water compliant with BIS 10500:2012 Drinking Water Standards",
      "High-rate Lamella / Tube Settler technology delivering compact clarifier footprints",
      "Automated backwash rapid gravity and dual media pressure filtration systems",
      "Continuous disinfection dosing ensuring residual chlorine pathogen protection",
      "Heavy-duty civil RCC constructions or modular skid-mounted steel package systems",
    ],
    processSteps: [
      { stepNumber: 1, title: "Intake & Coarse Screening", description: "Raw canal/river water enters via intake well with trash racks and fine mechanical screens.", equipmentUsed: "Mechanical Intake Screen" },
      { stepNumber: 2, title: "Coagulant Flash Mixing", description: "Alum or PAC is dosed into rapid turbulent mixer to destabilize colloidal charges.", equipmentUsed: "High-Speed Flash Mixer" },
      { stepNumber: 3, title: "Flocculation Baffle Chamber", description: "Slow agitation facilitates agglomeration of destabilized micro-particles into settleable flocs.", equipmentUsed: "Paddle Flocculator" },
      { stepNumber: 4, title: "Lamella / Tube Settler Clarification", description: "Flocs settle rapidly across inclined honeycomb tube modules; clean water overflows.", equipmentUsed: "Clarifier Basin with Lamella Media" },
      { stepNumber: 5, title: "Rapid Gravity Sand Filtration & Disinfection", description: "Water passes through multi-layer quartz sand followed by sodium hypochlorite chlorination.", equipmentUsed: "Rapid Sand Filter Bed & Chlorination" },
    ],
    technicalSpecs: [
      { label: "Treated Water Turbidity", value: "< 1", unit: "NTU", category: "Water Quality" },
      { label: "Pathogen / Coliform Removal", value: "> 99.9%", unit: "%", category: "Microbiological" },
      { label: "Treated Water Standards", value: "IS 10500:2012 / WHO Potable Guidelines", category: "Compliance" },
    ],
    comparisonMatrix: [
      { parameter: "Plant Architecture", techOptionA: "Conventional RCC Civil WTP", techOptionB: "Modular Package Skid WTP", techOptionC: "Ultrafiltration (UF) Membrane WTP" },
      { parameter: "Execution Time", techOptionA: "9 to 18 Months (Large civil works)", techOptionB: "2 to 4 Months (Factory fabricated)", techOptionC: "3 to 6 Months" },
    ],
    applications: [
      "Municipal Drinking Water Supply Schemes",
      "Smart City Townships & Urban Projects",
      "Industrial Parks & SEZ Industrial Water Supply",
      "River & Canal Raw Water Clarification for Factories",
    ],
    brochureUrl: "/downloads/rpglobal-wtp-plants-spec.pdf",
  },
};

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plant = FALLBACK_SPECS[slug];

  if (!plant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      {/* Solution introduction */}
      <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
        <WaterBackgroundEffect variant="hydraulic" className="px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
          <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-xs text-[#71807d]">
            <Link href="/" className="hover:text-[#172e34]">Home</Link>
            <span>/</span>
            <Link href="/solutions" className="hover:text-[#172e34]">Solutions</Link>
            <span>/</span>
            <span className="text-[#26717a]">{plant.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 border border-[#cbd9d3] bg-white px-3 py-1 text-xs font-semibold text-[#26717a]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Turnkey EPC • CPCB / SPCB Norms Review</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {plant.name}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-[#53666a]">
                {plant.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#rfq-section"
                  className="bg-[#1a5962] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#12464e]"
                >
                  Request Technical Quotation
                </a>

                {plant.brochureUrl && (
                  <a
                    href={plant.brochureUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-[#b6d8cf] bg-[#e6f2ed] px-5 py-3 text-xs font-semibold text-[#1a5962] transition-colors hover:bg-[#dceae4]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Spec Sheet (PDF)</span>
                  </a>
                )}

                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="border border-[#cbd9d3] bg-white px-5 py-3 text-xs font-semibold text-[#435356] transition-colors hover:bg-[#f3f4ef]"
                >
                  Speak with Process Engineer
                </a>
              </div>
            </div>

            {/* Quick Specs Snapshot */}
            <div className="space-y-3 border border-[#dfe5df] bg-white p-6 font-mono text-xs lg:col-span-4">
              <div className="mb-2 font-sans text-[10px] font-bold uppercase tracking-widest text-[#26717a]">
                Plant Sizing Overview
              </div>
              <div className="flex justify-between gap-3 border-b border-[#e3e9e3] pb-2">
                <span className="font-sans text-[#71807d]">Capacity Range:</span>
                <span className="text-right font-bold text-[#20383d]">{plant.capacityRange}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#e3e9e3] pb-2">
                <span className="font-sans text-[#71807d]">Delivery Model:</span>
                <span className="text-right font-bold text-[#527c61]">Turnkey EPC / Skid</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#e3e9e3] pb-2">
                <span className="font-sans text-[#71807d]">Automation:</span>
                <span className="text-right font-bold text-[#20383d]">PLC / SCADA Automated</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-sans text-[#71807d]">Quality Standard:</span>
                <span className="font-bold text-[#26717a]">ISO 9001:2015</span>
              </div>
            </div>
          </div>
        </div>
      </WaterBackgroundEffect>
    </section>

      {/* Main Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Plant Overview & Key Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077B6] bg-[#0077B6]/10 px-3 py-1 rounded-full">
              Engineering Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F]">
              Precision Process Engineering for {plant.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {plant.description}
            </p>

            {/* Key Advantages Checklist */}
            <div className="pt-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Core Engineering Advantages
              </h4>
              {plant.keyFeatures.map((feat: string, i: number) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Industrial Applications Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0077B6] mb-3">
                <Factory className="w-4 h-4 text-[#0077B6]" />
                <span>Target Industrial Sectors</span>
              </div>
              <h3 className="text-lg font-bold text-[#0A192F] mb-4">
                Where Our {plant.name} Systems Are Installed
              </h3>
              <div className="space-y-2 text-xs">
                {plant.applications.map((app: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100 font-medium text-slate-800 flex items-center space-x-2"
                  >
                    <Building className="w-3.5 h-3.5 text-[#0077B6] shrink-0" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500">
                Custom inlet water testing performed for every installation.
              </span>
            </div>
          </div>
        </div>

        {/* Treatment Process Flowchart */}
        <ProcessFlowchart steps={plant.processSteps} plantName={plant.name} />

        {/* Technical Specification Table */}
        <SpecTable specs={plant.technicalSpecs} plantName={plant.name} />

        {/* Technology Comparison Matrix */}
        <TechnologyComparison rows={plant.comparisonMatrix} plantName={plant.name} />

        {/* Inline RFQ Lead Form */}
        <InlineRFQ plantName={plant.name} />
      </div>
    </div>
  );
}
