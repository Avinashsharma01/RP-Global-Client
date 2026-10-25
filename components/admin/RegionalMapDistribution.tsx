"use client";

import React from "react";
import { MapPin, Navigation, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface RegionCluster {
  region: string;
  hub: string;
  leadsCount: number;
  capacityKLD: number;
  percentage: number;
  status: string;
  color: string;
}

export const RegionalMapDistribution: React.FC = () => {
  const clusters: RegionCluster[] = [
    {
      region: "NCR & Haryana Industrial Corridor",
      hub: "Gurugram, Manesar, Panipat, Faridabad",
      leadsCount: 5,
      capacityKLD: 1800,
      percentage: 35,
      status: "3 Active, 2 in Sizing",
      color: "#0077B6",
    },
    {
      region: "Gujarat Petrochem & Textile Belt",
      hub: "Surat, Ahmedabad, Vapi, Ankleshwar",
      leadsCount: 4,
      capacityKLD: 1950,
      percentage: 28,
      status: "2 ZLD Plants Commissioned",
      color: "#0284c7",
    },
    {
      region: "Maharashtra & Pune Industrial Zone",
      hub: "Pune, Chakan, Navi Mumbai, Tarapur",
      leadsCount: 3,
      capacityKLD: 1150,
      percentage: 22,
      status: "1 Auto ETP, 2 Pharma STP",
      color: "#7c3aed",
    },
    {
      region: "Rajasthan & North Zone",
      hub: "Bhiwadi, Neemrana, Jaipur RIICO",
      leadsCount: 2,
      capacityKLD: 780,
      percentage: 15,
      status: "Site Audit Completed",
      color: "#0d9488",
    },
  ];

  return (
    <div className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-sm font-bold text-slate-900 sm:text-base lg:text-lg">
                Geographic Plant Footprint
              </h2>
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#0077B6]">
                Pan-India
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              Active turnkey water plant installations and RFQ technical proposals across industrial hubs.
            </p>
          </div>
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6]">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>

        {/* Region Clusters List */}
        <div className="mt-4 space-y-3 sm:space-y-4">
          {clusters.map((cluster) => (
            <div
              key={cluster.region}
              className="rounded-lg border border-slate-100 p-2.5 sm:p-3 transition-colors hover:border-slate-200 hover:bg-slate-50/60"
            >
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cluster.color }} />
                    <span className="text-xs font-bold text-slate-800">{cluster.region}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium pl-3.5 block sm:inline">
                    {cluster.hub}
                  </span>
                </div>
                <div className="flex items-center gap-3 pl-3.5 sm:pl-0 shrink-0">
                  <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                    {cluster.leadsCount} <span className="font-normal text-[10px] text-slate-400">leads</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0077B6] tabular-nums">
                    {cluster.capacityKLD.toLocaleString()} KLD
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 flex items-center gap-2.5 sm:gap-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cluster.percentage}%`,
                      backgroundColor: cluster.color,
                    }}
                  />
                </div>
                <span className="min-w-7 text-right font-mono text-[10px] sm:text-[11px] font-medium text-slate-500 tabular-nums">
                  {cluster.percentage}%
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 pl-3.5">
                <span className="truncate pr-2">Status: <strong className="font-medium text-slate-600">{cluster.status}</strong></span>
                <span className="text-emerald-600 font-medium flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="h-2.5 w-2.5" /> EPC Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3.5 flex flex-col gap-1 border-t border-slate-100 pt-2.5 text-xs text-slate-600 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-3">
        <div className="flex items-center gap-1.5">
          <Navigation className="h-3.5 w-3.5 text-[#0077B6] shrink-0" />
          <span className="truncate">Regional EPC Support active 24/7</span>
        </div>
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B6] hover:underline"
        >
          <span>View Site Gallery</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
