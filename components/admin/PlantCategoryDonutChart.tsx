"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PlantCategoryDonutProps {
  stats: {
    totalLeads: number;
    newLeads: number;
    evaluationLeads: number;
    wonLeads: number;
  };
}

interface CategoryItem {
  name: string;
  shortName: string;
  leads: number;
  capacityKLD: number;
  percentage: number;
  color: string;
  gradient: string;
}

export const PlantCategoryDonutChart: React.FC<PlantCategoryDonutProps> = ({ stats }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories: CategoryItem[] = [
    {
      name: "Effluent Treatment Plant (ETP)",
      shortName: "ETP (Effluent)",
      leads: 5,
      capacityKLD: 2150,
      percentage: 36,
      color: "#0077B6",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      name: "Sewage Treatment Plant (STP)",
      shortName: "STP (Sewage)",
      leads: 4,
      capacityKLD: 1600,
      percentage: 28,
      color: "#0284c7",
      gradient: "from-sky-500 to-blue-400",
    },
    {
      name: "RO & Zero Liquid Discharge (ZLD)",
      shortName: "RO & ZLD",
      leads: 3,
      capacityKLD: 1100,
      percentage: 21,
      color: "#0d9488",
      gradient: "from-teal-600 to-emerald-400",
    },
    {
      name: "Demineralization & Softening",
      shortName: "DM & Softening",
      leads: 1,
      capacityKLD: 550,
      percentage: 10,
      color: "#7c3aed",
      gradient: "from-purple-600 to-indigo-400",
    },
    {
      name: "Ultrafiltration & Pre-treatment",
      shortName: "UF & Filtration",
      leads: 1,
      capacityKLD: 280,
      percentage: 5,
      color: "#d97706",
      gradient: "from-amber-600 to-yellow-400",
    },
  ];

  const currentItem = activeIndex !== null ? categories[activeIndex] : null;

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryItem;
      return (
        <div className="rounded-lg border border-slate-700/60 bg-[#0f1d31] p-2.5 sm:p-3 text-xs text-white shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 font-semibold text-slate-100">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="mt-1.5 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between gap-3 text-slate-300">
              <span>RFQ Leads:</span>
              <span className="font-bold text-white">{data.leads} leads ({data.percentage}%)</span>
            </div>
            <div className="flex justify-between gap-3 text-slate-300">
              <span>Sizing Volume:</span>
              <span className="font-bold text-cyan-300">{data.capacityKLD.toLocaleString()} KLD</span>
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
            <h2 className="text-sm font-bold text-slate-900 sm:text-base lg:text-lg">
              Plant Solutions Demand Share
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              Distribution of incoming RFQ leads across core wastewater and water plant categories.
            </p>
          </div>
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6]">
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        </div>

        {/* Donut Chart Container */}
        <div className="relative mt-3 sm:mt-4 flex items-center justify-center">
          <div className="h-48 w-48 sm:h-60 sm:w-60">
            {!isMounted ? (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-xs text-slate-400">
                Loading share...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="88%"
                    paddingAngle={3}
                    dataKey="percentage"
                    nameKey="name"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {categories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={activeIndex === index ? 3 : 1.5}
                        className="transition-all duration-200 cursor-pointer"
                        style={{
                          transform: activeIndex === index ? "scale(1.04)" : "scale(1)",
                          transformOrigin: "center",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Central Metric Indicator */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[11px]">
              {currentItem ? currentItem.shortName : "Total Demand"}
            </span>
            <span className="font-mono text-xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {currentItem ? `${currentItem.percentage}%` : `${stats.totalLeads}`}
            </span>
            <span className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
              {currentItem ? `${currentItem.capacityKLD} KLD` : "14 RFQ Leads"}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown List with Responsive Labels */}
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 sm:mt-5 sm:space-y-2.5 sm:pt-4">
        {categories.map((item, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`flex items-center justify-between rounded-md p-1 sm:p-1.5 transition-colors cursor-pointer ${
                isSelected ? "bg-slate-50" : "hover:bg-slate-50/70"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                <span className="h-2 w-2 rounded-full shrink-0 sm:h-2.5 sm:w-2.5" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-slate-700 truncate">
                  <span className="sm:hidden">{item.shortName}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                  {item.leads} <span className="font-normal text-[10px] text-slate-400 sm:text-[11px]">leads</span>
                </span>
                <span className="min-w-8 text-right font-mono text-xs font-bold text-slate-600 tabular-nums sm:min-w-10">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="mt-3.5 border-t border-slate-100 pt-2.5 text-right sm:mt-4 sm:pt-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B6] hover:underline"
        >
          <span>Manage Plant CMS</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
