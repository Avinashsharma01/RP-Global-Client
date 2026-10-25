"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { TimeframeOption } from "./DashboardHeader";

interface PipelineTrendProps {
  timeframe: TimeframeOption;
}

export const PipelineTrendChart: React.FC<PipelineTrendProps> = ({ timeframe }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [metricMode, setMetricMode] = useState<"count" | "capacity">("count");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timeframe dataset variations
  const dataMap: Record<TimeframeOption, Array<{ period: string; inquiries: number; proposals: number; won: number; capacityKLD: number }>> = {
    "7D": [
      { period: "Mon", inquiries: 2, proposals: 1, won: 0, capacityKLD: 350 },
      { period: "Tue", inquiries: 3, proposals: 2, won: 1, capacityKLD: 750 },
      { period: "Wed", inquiries: 1, proposals: 1, won: 0, capacityKLD: 200 },
      { period: "Thu", inquiries: 4, proposals: 2, won: 1, capacityKLD: 1200 },
      { period: "Fri", inquiries: 2, proposals: 1, won: 0, capacityKLD: 500 },
      { period: "Sat", inquiries: 1, proposals: 0, won: 1, capacityKLD: 400 },
      { period: "Sun", inquiries: 1, proposals: 0, won: 0, capacityKLD: 180 },
    ],
    "30D": [
      { period: "W1", inquiries: 3, proposals: 2, won: 1, capacityKLD: 1100 },
      { period: "W2", inquiries: 5, proposals: 3, won: 1, capacityKLD: 1850 },
      { period: "W3", inquiries: 4, proposals: 2, won: 0, capacityKLD: 1350 },
      { period: "W4", inquiries: 6, proposals: 4, won: 2, capacityKLD: 2200 },
    ],
    "90D": [
      { period: "Aug", inquiries: 11, proposals: 7, won: 3, capacityKLD: 3800 },
      { period: "Sep", inquiries: 15, proposals: 9, won: 4, capacityKLD: 4900 },
      { period: "Oct", inquiries: 18, proposals: 12, won: 5, capacityKLD: 5680 },
    ],
    "1Y": [
      { period: "Nov", inquiries: 6, proposals: 3, won: 1, capacityKLD: 1800 },
      { period: "Dec", inquiries: 8, proposals: 4, won: 2, capacityKLD: 2400 },
      { period: "Jan", inquiries: 9, proposals: 5, won: 2, capacityKLD: 2900 },
      { period: "Feb", inquiries: 10, proposals: 6, won: 2, capacityKLD: 3200 },
      { period: "Mar", inquiries: 14, proposals: 8, won: 3, capacityKLD: 4100 },
      { period: "Apr", inquiries: 12, proposals: 7, won: 3, capacityKLD: 3700 },
      { period: "May", inquiries: 13, proposals: 8, won: 3, capacityKLD: 4000 },
      { period: "Jun", inquiries: 15, proposals: 9, won: 4, capacityKLD: 4600 },
      { period: "Jul", inquiries: 14, proposals: 9, won: 3, capacityKLD: 4400 },
      { period: "Aug", inquiries: 16, proposals: 10, won: 4, capacityKLD: 5100 },
      { period: "Sep", inquiries: 17, proposals: 11, won: 4, capacityKLD: 5300 },
      { period: "Oct", inquiries: 19, proposals: 13, won: 5, capacityKLD: 5680 },
    ],
  };

  const chartData = dataMap[timeframe] || dataMap["30D"];

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-700/60 bg-[#0f1d31] p-2.5 sm:p-3 text-xs text-white shadow-xl backdrop-blur-md">
          <div className="mb-1.5 flex items-center justify-between gap-3 border-b border-slate-700 pb-1 font-semibold text-slate-200">
            <span>{label}</span>
            <span className="font-mono text-[10px] text-cyan-300">RP Global Pipeline</span>
          </div>
          <div className="space-y-1">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 text-[11px]">{item.name}:</span>
                </div>
                <span className="font-mono font-bold text-white tabular-nums text-[11px]">
                  {item.value} {metricMode === "capacity" && item.dataKey === "capacityKLD" ? "KLD" : "leads"}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:p-6">
      {/* Header with Title and Mode Toggle */}
      <div className="mb-4 sm:mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base lg:text-lg">
              RFQ Inquiries & Lead Conversion Velocity
            </h2>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#0077B6]">
              {timeframe} Trajectory
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
            Comparing incoming industrial RFQs against generated proposals and commissioned plants.
          </p>
        </div>

        {/* View Switcher: Full width on mobile for easy finger tap */}
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-100/70 p-1 text-xs sm:flex sm:items-center">
          <button
            type="button"
            onClick={() => setMetricMode("count")}
            className={`rounded-md px-2.5 py-1 text-center font-semibold transition-all ${
              metricMode === "count"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Inquiry Volume
          </button>
          <button
            type="button"
            onClick={() => setMetricMode("capacity")}
            className={`rounded-md px-2.5 py-1 text-center font-semibold transition-all ${
              metricMode === "capacity"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Capacity (KLD)
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-60 w-full sm:h-72 lg:h-80">
        {!isMounted ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-xs text-slate-400">
            Loading interactive trajectory...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -26, bottom: 0 }}>
              <defs>
                <linearGradient id="inquiryGradientMob" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0077B6" stopOpacity="0.45" />
                  <stop offset="95%" stopColor="#0077B6" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="capacityGradientMob" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
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
                tickFormatter={(val) => (metricMode === "capacity" ? `${val}k` : val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", fontWeight: 500 }}
              />

              {metricMode === "count" ? (
                <>
                  <Area
                    type="monotone"
                    name="RFQ Inquiries"
                    dataKey="inquiries"
                    stroke="#0077B6"
                    strokeWidth={2.2}
                    fillOpacity={1}
                    fill="url(#inquiryGradientMob)"
                  />
                  <Line
                    type="monotone"
                    name="Proposals Sent"
                    dataKey="proposals"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 1.5, stroke: "#fff" }}
                    activeDot={{ r: 4.5 }}
                  />
                  <Line
                    type="monotone"
                    name="Plants Won"
                    dataKey="won"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10b981", strokeWidth: 1.5, stroke: "#fff" }}
                    activeDot={{ r: 4.5 }}
                  />
                </>
              ) : (
                <Area
                  type="monotone"
                  name="Capacity (KLD)"
                  dataKey="capacityKLD"
                  stroke="#0891b2"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#capacityGradientMob)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Footer Bar */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-3 sm:grid-cols-3 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6]">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-medium text-slate-500">Pipeline Velocity</span>
            <span className="font-mono text-[11px] font-bold text-slate-800 truncate block">+22.4% RFQ Volume</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-medium text-slate-500">Proposal Turnaround</span>
            <span className="font-mono text-[11px] font-bold text-slate-800 truncate block">3.8 Business Days</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-medium text-slate-500">Proposal Acceptance</span>
            <span className="font-mono text-[11px] font-bold text-slate-800 truncate block">54.2% Passed BoQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
