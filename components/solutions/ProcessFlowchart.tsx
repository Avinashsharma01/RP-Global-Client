import React from "react";
import { ArrowRight, CheckCircle2, Cog } from "lucide-react";
import { ProcessStep } from "@/lib/types";

interface ProcessFlowchartProps {
  steps: ProcessStep[];
  plantName: string;
}

export const ProcessFlowchart: React.FC<ProcessFlowchartProps> = ({ steps, plantName }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-[#0A192F] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex items-center space-x-2 text-xs font-semibold text-[#00E5FF] uppercase tracking-wider mb-2">
        <Cog className="w-4 h-4 text-[#00E5FF] animate-spin-slow" />
        <span>Process Flow Architecture</span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Step-by-Step {plantName} Treatment Lifecycle
      </h3>
      <p className="text-xs text-slate-300 mb-8 max-w-2xl">
        Our optimized engineering sequence maximizes biological degradation and physical separation
        while minimizing chemical and energy consumption.
      </p>

      {/* Process Sequence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => (
          <div
            key={step.stepNumber}
            className="relative bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#00E5FF]/40 hover:bg-white/10 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Step Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-[#00E5FF] bg-[#0077B6]/30 px-2.5 py-1 rounded-md border border-[#0077B6]/50">
                  STAGE 0{step.stepNumber}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-500 hidden lg:block" />
                )}
              </div>

              {/* Step Title */}
              <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>

              {/* Step Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {step.description}
              </p>
            </div>

            {/* Equipment Used Tag */}
            {step.equipmentUsed && (
              <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span className="line-clamp-1">Equipment: {step.equipmentUsed}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
