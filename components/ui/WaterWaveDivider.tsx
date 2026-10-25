"use client";

import React from "react";

interface WaterWaveDividerProps {
  fillColor?: string;
  accentColor?: string;
  position?: "top" | "bottom";
  className?: string;
  height?: number;
}

export const WaterWaveDivider: React.FC<WaterWaveDividerProps> = ({
  fillColor = "#ffffff",
  accentColor = "#0077b6",
  position = "bottom",
  className = "",
  height = 54,
}) => {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden leading-none select-none pointer-events-none ${className} ${
        isTop ? "rotate-180 -mb-[1px]" : "-mt-[1px]"
      }`}
      style={{ height: `${height}px` }}
    >
      <svg
        className="absolute top-0 left-0 w-[200%] h-full animate-[waveDrift_16s_linear_infinite]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Layer 1: Distant subtle ambient water surge */}
        <path
          d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z"
          fill={accentColor}
          fillOpacity="0.12"
        />
        {/* Layer 2: Midground fluid wave */}
        <path
          d="M0,30 C200,110 450,10 650,80 C850,140 1050,40 1200,85 L1200,120 L0,120 Z"
          fill={accentColor}
          fillOpacity="0.22"
        />
        {/* Layer 3: Solid foreground crest conforming to target background */}
        <path
          d="M0,60 C180,125 360,35 600,95 C820,145 1020,55 1200,100 L1200,120 L0,120 Z"
          fill={fillColor}
        />
      </svg>

      <svg
        className="absolute top-0 left-0 w-[200%] h-full animate-[waveDriftReverse_22s_linear_infinite] opacity-80"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Counter-drifting wave for organic interference pattern */}
        <path
          d="M0,45 C250,-10 400,90 700,30 C950,-20 1100,75 1200,40 L1200,120 L0,120 Z"
          fill="#00E5FF"
          fillOpacity="0.08"
        />
      </svg>
    </div>
  );
};
