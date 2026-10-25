"use client";

import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ShieldCheck, BarChart2, Compass } from "lucide-react";

interface QualityMetric {
  parameter: string;
  unit: string;
  rawInletNormalized: number;
  treatedNormalized: number;
  spcbLimitNormalized: number;
  rawActual: number;
  treatedActual: number;
  spcbLimitActual: number;
  reduction: number;
}

export const WaterQualityRadarChart: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [viewType, setViewType] = useState<"radar" | "bars">("radar");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Normalized to 0-100 scale for intuitive radar comparison
  const metrics: QualityMetric[] = [
    {
      parameter: "COD",
      unit: "mg/L",
      rawInletNormalized: 95,
      treatedNormalized: 5,
      spcbLimitNormalized: 30,
      rawActual: 1850,
      treatedActual: 42,
      spcbLimitActual: 250,
      reduction: 97.7,
    },
    {
      parameter: "BOD",
      unit: "mg/L",
      rawInletNormalized: 90,
      treatedNormalized: 4,
      spcbLimitNormalized: 25,
      rawActual: 650,
      treatedActual: 8,
      spcbLimitActual: 30,
      reduction: 98.8,
    },
    {
      parameter: "TDS",
      unit: "ppm",
      rawInletNormalized: 85,
      treatedNormalized: 8,
      spcbLimitNormalized: 45,
      rawActual: 4800,
      treatedActual: 320,
      spcbLimitActual: 2100,
      reduction: 93.3,
    },
    {
      parameter: "TSS",
      unit: "mg/L",
      rawInletNormalized: 88,
      treatedNormalized: 3,
      spcbLimitNormalized: 20,
      rawActual: 420,
      treatedActual: 4,
      spcbLimitActual: 50,
      reduction: 99.0,
    },
    {
      parameter: "Oil&Grease",
      unit: "mg/L",
      rawInletNormalized: 80,
      treatedNormalized: 6,
      spcbLimitNormalized: 22,
      rawActual: 48,
      treatedActual: 1.5,
      spcbLimitActual: 10,
      reduction: 96.9,
    },
  ];

  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as QualityMetric;
      return (
        <div className="rounded-lg border border-slate-700/60 bg-[#0f1d31] p-2.5 sm:p-3 text-xs text-white shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1 font-semibold text-slate-100">
            <span>{data.parameter} ({data.unit})</span>
            <span className="font-mono text-emerald-400">-{data.reduction}% Purified</span>
          </div>
          <div className="mt-1.5 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between gap-3 text-rose-300">
              <span>Raw Inlet:</span>
              <span className="font-bold">{data.rawActual.toLocaleString()} {data.unit}</span>
            </div>
            <div className="flex justify-between gap-3 text-emerald-300">
              <span>RP Global Outlet:</span>
              <span className="font-bold">{data.treatedActual} {data.unit}</span>
            </div>
            <div className="flex justify-between gap-3 text-slate-400">
              <span>SPCB Legal Limit:</span>
              <span>{data.spcbLimitActual} {data.unit}</span>
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
        <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-sm font-bold text-slate-900 sm:text-base lg:text-lg">
                Water Lab Parameters & CPCB Compliance
              </h2>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                <ShieldCheck className="h-3 w-3" />
                98.2% Purity
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              Laboratory analysis benchmarking raw incoming effluent vs RP Global treated discharge standards.
            </p>
          </div>

          {/* Toggle between Radar and Comparative Bars */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 text-xs self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewType("radar")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-all ${
                viewType === "radar"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Compass className="h-3 w-3" />
              <span>Radar</span>
            </button>
            <button
              type="button"
              onClick={() => setViewType("bars")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-all ${
                viewType === "bars"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart2 className="h-3 w-3" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Dynamic Visualization Area */}
        {viewType === "radar" ? (
          <div className="mt-3 h-56 w-full sm:mt-4 sm:h-64 lg:h-72">
            {!isMounted ? (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-xs text-slate-400">
                Loading compliance radar...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={metrics} margin={{ top: 8, right: 30, left: 30, bottom: 8 }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="parameter" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                  <Tooltip content={<CustomRadarTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                  />
                  <Radar
                    name="Raw Inlet"
                    dataKey="rawInletNormalized"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.25}
                    strokeWidth={1.8}
                  />
                  <Radar
                    name="SPCB Norms"
                    dataKey="spcbLimitNormalized"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.12}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <Radar
                    name="RP Global"
                    dataKey="treatedNormalized"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                    strokeWidth={2.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : (
          <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
            {metrics.map((m) => (
              <div key={m.parameter} className="rounded-lg border border-slate-100 bg-slate-50/50 p-2 sm:p-2.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span className="text-[11px] sm:text-xs">{m.parameter}</span>
                  <span className="font-mono text-[11px] text-emerald-600 sm:text-xs">
                    -{m.reduction}% ({m.rawActual} → {m.treatedActual})
                  </span>
                </div>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-[10px] sm:text-[11px] font-mono">
                  <div className="rounded bg-rose-50 px-1.5 py-1 text-rose-700">
                    <span className="text-[9px] text-rose-500 font-sans block">Inlet</span>
                    {m.rawActual} {m.unit}
                  </div>
                  <div className="rounded bg-slate-100 px-1.5 py-1 text-slate-700">
                    <span className="text-[9px] text-slate-500 font-sans block">SPCB</span>
                    {m.spcbLimitActual} {m.unit}
                  </div>
                  <div className="rounded bg-emerald-50 px-1.5 py-1 text-emerald-800 font-bold">
                    <span className="text-[9px] text-emerald-600 font-sans block">Purified</span>
                    {m.treatedActual} {m.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Compliance Guarantee */}
      <div className="mt-3.5 flex flex-col gap-1 border-t border-slate-100 pt-2.5 text-xs text-slate-600 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-3">
        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span className="truncate">Guaranteed CPCB / SPCB Discharge Consent (CTO/CTE)</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 sm:text-[11px]">ZLD Ready</span>
      </div>
    </div>
  );
};
