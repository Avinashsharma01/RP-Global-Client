"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Factory, Droplets } from "lucide-react";

interface SectorData {
  sector: string;
  shortName: string;
  capacityKLD: number;
  inquiries: number;
  primaryTech: string;
  color: string;
}

export const SectorCapacityBarChart: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSector, setActiveSector] = useState<SectorData | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sectors: SectorData[] = [
    {
      sector: "Textiles & Dyeing",
      shortName: "Textiles",
      capacityKLD: 1650,
      inquiries: 4,
      primaryTech: "ETP + Color Removal + ZLD",
      color: "#0077B6",
    },
    {
      sector: "Pharma & Chemical",
      shortName: "Pharma",
      capacityKLD: 1220,
      inquiries: 3,
      primaryTech: "High COD ETP + RO + MEE",
      color: "#0284c7",
    },
    {
      sector: "Real Estate & Townships",
      shortName: "Infra",
      capacityKLD: 1100,
      inquiries: 3,
      primaryTech: "MBBR / SBR STP Systems",
      color: "#0d9488",
    },
    {
      sector: "Food & Beverage",
      shortName: "F&B",
      capacityKLD: 780,
      inquiries: 2,
      primaryTech: "DAF + Anaerobic Treatment",
      color: "#7c3aed",
    },
    {
      sector: "Automotive & Eng.",
      shortName: "Auto",
      capacityKLD: 550,
      inquiries: 1,
      primaryTech: "Oil-Water Separation + ETP",
      color: "#ea580c",
    },
    {
      sector: "Healthcare & Labs",
      shortName: "Health",
      capacityKLD: 380,
      inquiries: 1,
      primaryTech: "DM Plant + Medical STP",
      color: "#059669",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as SectorData;
      return (
        <div className="rounded-lg border border-slate-700/60 bg-[#0f1d31] p-2.5 sm:p-3 text-xs text-white shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-1 font-semibold text-slate-100">
            <Factory className="h-3.5 w-3.5 text-cyan-300" />
            <span>{data.sector}</span>
          </div>
          <div className="mt-1.5 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between gap-3 text-slate-300">
              <span>Required Capacity:</span>
              <span className="font-bold text-cyan-300">{data.capacityKLD.toLocaleString()} KLD</span>
            </div>
            <div className="flex justify-between gap-3 text-slate-300">
              <span>Active Leads:</span>
              <span className="font-bold text-white">{data.inquiries} inquiries</span>
            </div>
            <div className="pt-1 text-[10px] text-slate-400 font-sans">
              <span className="text-slate-500 font-mono">Tech:</span> {data.primaryTech}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-sm font-bold text-slate-900 sm:text-base lg:text-lg">
                Treatment Capacity by Industrial Sector
              </h2>
              <span className="rounded bg-cyan-50 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-700">
                5,680 KLD
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              Hydraulic treatment demand requested across manufacturing verticals.
            </p>
          </div>
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
            <Factory className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>

        {/* Bar Chart Area */}
        <div className="mt-4 h-56 w-full sm:h-64 lg:h-72">
          {!isMounted ? (
            <div className="flex h-full w-full items-center justify-center bg-slate-50 text-xs text-slate-400">
              Loading sector demand...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectors}
                margin={{ top: 10, right: 6, left: -26, bottom: 0 }}
                onMouseMove={(state: any) => {
                  if (state.isTooltipActive && state.activePayload) {
                    setActiveSector(state.activePayload[0].payload);
                  }
                }}
                onMouseLeave={() => setActiveSector(null)}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="capacityKLD" radius={[4, 4, 0, 0]} maxBarSize={38}>
                  {sectors.map((entry, index) => (
                    <Cell
                      key={`bar-cell-${index}`}
                      fill={entry.color}
                      fillOpacity={activeSector?.sector === entry.sector ? 1 : 0.88}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-3.5 flex flex-col justify-between gap-1.5 border-t border-slate-100 pt-2.5 sm:mt-4 sm:flex-row sm:items-center sm:pt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Droplets className="h-3.5 w-3.5 shrink-0 text-[#0077B6]" />
          <span className="truncate">
            Top: <strong className="font-semibold text-slate-900">Textiles (1,650 KLD)</strong> for ZLD.
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 sm:text-[11px]">
          Avg Sizing: 405 KLD
        </span>
      </div>
    </div>
  );
};
