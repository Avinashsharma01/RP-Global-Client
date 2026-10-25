"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
  ShieldCheck,
  Waves,
  Droplets,
} from "lucide-react";
import { ApplyModal } from "@/components/career/ApplyModal";
import { api } from "@/lib/api";
import { JobOpening } from "@/lib/types";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

const FALLBACK_JOBS: Array<Partial<JobOpening> & { id: string }> = [
  {
    id: "job-1",
    slug: "senior-water-treatment-process-engineer",
    title: "Senior Water Treatment Process Engineer",
    department: "Engineering & Design",
    location: "Noida, Uttar Pradesh",
    employmentType: "Full-time",
    experienceRequired: "5-8 Years",
    positionsOpen: 2,
    responsibilities: [
      "Prepare mass balance calculations, P&ID schematics, and hydraulic flow diagrams for ETP and STP projects.",
      "Size biological aeration tanks, clarifiers, blowers, and membrane RO systems according to inlet water chemistry.",
      "Coordinate with fabrication teams on Skid mechanical layouts and bill of materials (BOM).",
      "Lead technical discussions with client MEP consultants during engineering design review meetings.",
    ],
    qualifications: [
      "B.Tech / B.E. in Chemical or Environmental Engineering.",
      "Proficiency in AutoCAD, hydraulic sizing calculations, and water design software.",
      "Prior experience in EPC water treatment projects.",
    ],
    salaryRange: "₹8,00,000 – ₹14,00,000 P.A.",
  },
  {
    id: "job-2",
    slug: "stp-etp-plant-commissioning-specialist",
    title: "STP / ETP Plant Commissioning Specialist",
    department: "Operations & Commissioning",
    location: "Site Locations (Pan-India)",
    employmentType: "Full-time",
    experienceRequired: "3-6 Years",
    positionsOpen: 3,
    responsibilities: [
      "Supervise on-site erection, civil checking, piping alignment, and electrical panel connections.",
      "Execute hydro-testing, motor no-load/load trials, and chemical dosing calibrations.",
      "Develop biological biomass / MLSS culture in MBBR and activated sludge aeration tanks.",
      "Conduct compliance water testing and handover signed performance certificates to client.",
    ],
    qualifications: [
      "Diploma or Degree in Mechanical / Chemical / Environmental Engineering.",
      "Hands-on expertise in commissioning pumps, blowers, clarifiers, and filter presses.",
      "Willingness to travel across client sites in India.",
    ],
    salaryRange: "₹5,00,000 – ₹8,50,000 P.A.",
  },
  {
    id: "job-3",
    slug: "sales-manager-water-epc",
    title: "Industrial Sales & Business Development Manager - Water EPC",
    department: "Sales & Marketing",
    location: "Noida, Uttar Pradesh",
    employmentType: "Full-time",
    experienceRequired: "4-7 Years",
    positionsOpen: 1,
    responsibilities: [
      "Identify and generate industrial sales leads for turnkey STP, ETP, and RO plant projects across NCR, UP, Haryana, and Bihar.",
      "Collaborate with internal design teams to formulate competitive techno-commercial proposals.",
      "Lead contract negotiations and close EPC equipment and AMC operation contracts.",
    ],
    qualifications: [
      "B.Tech in Engineering + MBA (Marketing preferred).",
      "Strong network with manufacturing plants, real estate developers, and MEP consultants.",
      "Demonstrated track record of closing B2B capital equipment sales.",
    ],
    salaryRange: "₹7,50,000 – ₹12,00,000 P.A. + Performance Incentives",
  },
];

export default function CareerPage() {
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [activeJob, setActiveJob] = useState<{ id: string; title: string } | null>(null);
  const [jobListings, setJobListings] = useState<Array<Partial<JobOpening> & { id?: string }>>(FALLBACK_JOBS);

  useEffect(() => {
    let isSubscribed = true;
    api
      .getJobs()
      .then((res) => {
        if (!isSubscribed) return;
        if (res.success && res.data && res.data.length > 0) {
          setJobListings(res.data);
        } else {
          setJobListings(FALLBACK_JOBS);
        }
      })
      .catch(() => {
        if (isSubscribed) setJobListings(FALLBACK_JOBS);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const departments = ["ALL", "Engineering & Design", "Operations & Commissioning", "Sales & Marketing"];

  const filteredJobs =
    selectedDept === "ALL"
      ? jobListings
      : jobListings.filter((j) => j.department === selectedDept);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff]/60 via-[#f8fafc] to-[#e6f4f8]/40">
      {/* Header Banner with Aquatic Streamlines */}
      <section className="relative overflow-hidden border-b border-[#bce1f1]/60">
        <WaterBackgroundEffect variant="azure" className="px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0077b6]/25 bg-white/70 px-3.5 py-1 text-xs font-semibold text-[#0077b6] backdrop-blur-sm">
              <Users className="w-4 h-4 text-[#10B981]" />
              <span>Join Our Engineering Team</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d38] sm:text-4xl lg:text-5xl">
              Careers at R P Global Projects
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#45616b] sm:text-base">
              Build your engineering career with one of India&apos;s fastest growing industrial water EPC contractors.
              Solve critical environmental challenges across manufacturing, energy, and municipal sectors.
            </p>
          </div>
        </WaterBackgroundEffect>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Culture / Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <GraduationCap className="w-6 h-6 text-[#0077B6]" />
            <h3 className="text-base font-bold text-[#0A192F]">Technical Growth</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Work on complex biological MBBR, MBR, and Zero Liquid Discharge (ZLD) plants with direct mentorship from industry veterans.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#10B981]" />
            <h3 className="text-base font-bold text-[#0A192F]">Safety-First Culture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero tolerance for workplace hazards. We enforce strict EHS standards across all manufacturing and field commissioning sites.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <Briefcase className="w-6 h-6 text-[#00E5FF]" />
            <h3 className="text-base font-bold text-[#0A192F]">Competitive Rewards</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Attractive compensation, project milestone bonuses, medical insurance, and clear pathways for career progression.
            </p>
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0A192F]">Active Career Openings</h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredJobs.length} open position{filteredJobs.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDept === dept
                      ? "bg-[#0077B6] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {dept === "ALL" ? "All Departments" : dept}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Accordion / Cards */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id || job.id || job.slug}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#0077B6]/50 transition-all space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0077B6] bg-[#0077B6]/10 px-2.5 py-0.5 rounded">
                      {job.department}
                    </span>
                    <h3 className="text-xl font-bold text-[#0A192F] mt-2">{job.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0077B6]" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.employmentType} • Exp: {job.experienceRequired}</span>
                      </span>
                      {job.salaryRange && (
                        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {job.salaryRange}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setActiveJob({
                        id: job._id || job.slug || job.id || "",
                        title: job.title || "Engineering Position",
                      })
                    }
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#0077B6] hover:bg-[#005f92] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-transform hover:scale-[1.02] shrink-0"
                  >
                    <span>Apply for Position</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>

                {/* Responsibilities & Qualifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
                      Key Responsibilities:
                    </h4>
                    <ul className="space-y-1.5">
                      {(job.responsibilities || []).map((r: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0077B6] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
                      Candidate Qualifications:
                    </h4>
                    <ul className="space-y-1.5">
                      {(job.qualifications || []).map((q: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Application Modal */}
      {activeJob && (
        <ApplyModal
          isOpen={!!activeJob}
          onClose={() => setActiveJob(null)}
          jobId={activeJob.id}
          jobTitle={activeJob.title}
        />
      )}
    </div>
  );
}
