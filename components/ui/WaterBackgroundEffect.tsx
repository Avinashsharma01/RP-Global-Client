"use client";

import React, { useId } from "react";

export type WaterBackgroundVariant =
  | "azure"
  | "aquamarine"
  | "hydraulic"
  | "river"
  | "marine"
  | "coastal"
  | "subtle";

interface WaterBackgroundEffectProps {
  variant?: WaterBackgroundVariant;
  showBubbles?: boolean;
  showStreamlines?: boolean;
  showCaustics?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const VARIANT_CONFIGS: Record<
  WaterBackgroundVariant,
  {
    baseGradient: string;
    causticPrimary: string;
    causticSecondary: string;
    causticTertiary: string;
    streamColor: string;
    streamOpacity: number;
    bubbleColor: string;
  }
> = {
  azure: {
    baseGradient:
      "radial-gradient(ellipse 110% 80% at 50% 0%, #f0f9ff 0%, #e0f2fe 45%, #f0fdfa 100%)",
    causticPrimary: "rgba(0, 119, 182, 0.12)",
    causticSecondary: "rgba(0, 229, 255, 0.10)",
    causticTertiary: "rgba(16, 185, 129, 0.07)",
    streamColor: "#0077b6",
    streamOpacity: 0.12,
    bubbleColor: "#0077b6",
  },
  aquamarine: {
    baseGradient:
      "linear-gradient(180deg, #e6f4f8 0%, #edf7f9 45%, #e0f0f5 100%)",
    causticPrimary: "rgba(16, 185, 129, 0.10)",
    causticSecondary: "rgba(0, 180, 216, 0.12)",
    causticTertiary: "rgba(0, 229, 255, 0.08)",
    streamColor: "#0ea5e9",
    streamOpacity: 0.13,
    bubbleColor: "#00b4d8",
  },
  hydraulic: {
    baseGradient:
      "radial-gradient(circle 1200px at 70% 20%, #ebf7fa 0%, #e1eff5 50%, #d8ebf2 100%)",
    causticPrimary: "rgba(0, 119, 182, 0.14)",
    causticSecondary: "rgba(0, 229, 255, 0.12)",
    causticTertiary: "rgba(38, 113, 122, 0.09)",
    streamColor: "#0284c7",
    streamOpacity: 0.14,
    bubbleColor: "#0284c7",
  },
  river: {
    baseGradient:
      "linear-gradient(180deg, #e3f2f7 0%, #ecf7fa 40%, #e2f0f6 100%)",
    causticPrimary: "rgba(0, 150, 199, 0.12)",
    causticSecondary: "rgba(72, 202, 228, 0.11)",
    causticTertiary: "rgba(16, 185, 129, 0.08)",
    streamColor: "#0096c7",
    streamOpacity: 0.13,
    bubbleColor: "#0096c7",
  },
  marine: {
    baseGradient:
      "radial-gradient(ellipse 130% 90% at 30% 10%, #ecf7fb 0%, #dfedf3 55%, #d5e6ed 100%)",
    causticPrimary: "rgba(2, 62, 138, 0.11)",
    causticSecondary: "rgba(0, 180, 216, 0.13)",
    causticTertiary: "rgba(0, 229, 255, 0.08)",
    streamColor: "#0369a1",
    streamOpacity: 0.12,
    bubbleColor: "#0369a1",
  },
  coastal: {
    baseGradient:
      "linear-gradient(180deg, #d8edf5 0%, #cde4ee 50%, #c0dce9 100%)",
    causticPrimary: "rgba(0, 119, 182, 0.15)",
    causticSecondary: "rgba(0, 229, 255, 0.12)",
    causticTertiary: "rgba(72, 202, 228, 0.10)",
    streamColor: "#0284c7",
    streamOpacity: 0.15,
    bubbleColor: "#0284c7",
  },
  subtle: {
    baseGradient:
      "linear-gradient(180deg, #f8fafc 0%, #f0f7fa 50%, #f4f9fb 100%)",
    causticPrimary: "rgba(0, 119, 182, 0.07)",
    causticSecondary: "rgba(0, 229, 255, 0.05)",
    causticTertiary: "rgba(16, 185, 129, 0.04)",
    streamColor: "#38bdf8",
    streamOpacity: 0.08,
    bubbleColor: "#38bdf8",
  },
};

// Fixed positions for bubbles to guarantee hydration stability across SSR
const STATIC_BUBBLES = [
  { left: "8%", size: 14, delay: "0s", duration: "11s", opacity: 0.28 },
  { left: "18%", size: 8, delay: "3.2s", duration: "13s", opacity: 0.22 },
  { left: "27%", size: 18, delay: "1.5s", duration: "14s", opacity: 0.2 },
  { left: "41%", size: 10, delay: "5.5s", duration: "10s", opacity: 0.25 },
  { left: "54%", size: 16, delay: "2.1s", duration: "12s", opacity: 0.18 },
  { left: "68%", size: 9, delay: "4.3s", duration: "15s", opacity: 0.24 },
  { left: "79%", size: 20, delay: "0.8s", duration: "13s", opacity: 0.16 },
  { left: "88%", size: 12, delay: "3.8s", duration: "11s", opacity: 0.22 },
  { left: "94%", size: 7, delay: "6.0s", duration: "14s", opacity: 0.26 },
];

export const WaterBackgroundEffect: React.FC<WaterBackgroundEffectProps> = ({
  variant = "azure",
  showBubbles = false,
  showStreamlines = true,
  showCaustics = true,
  className = "",
  children,
}) => {
  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.azure;
  const uniqueId = useId().replace(/:/g, "_");

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: config.baseGradient }}
    >
      {/* Visual background layers */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ contain: "paint" }}
        aria-hidden="true"
      >
        {/* Layer 1: Diffuse Water Caustics */}
        {showCaustics && (
          <>
            <div
              className="absolute -left-20 -top-20 h-96 w-96 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${config.causticPrimary} 0%, transparent 70%)`,
                animation: "waterCausticPulse 12s ease-in-out infinite alternate",
                transform: "translateZ(0)",
                willChange: "transform, opacity",
              }}
            />
            <div
              className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${config.causticSecondary} 0%, transparent 70%)`,
                animation: "waterCausticPulse 14s ease-in-out infinite 3s alternate-reverse",
                transform: "translateZ(0)",
                willChange: "transform, opacity",
              }}
            />
            <div
              className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-2xl"
              style={{
                background: `radial-gradient(circle, ${config.causticTertiary} 0%, transparent 70%)`,
                animation: "waterCausticPulse 10s ease-in-out infinite 1.5s alternate",
                transform: "translateZ(0)",
                willChange: "transform, opacity",
              }}
            />
          </>
        )}

        {/* Layer 2: Animated SVG Laminar Flow Streamlines */}
        {showStreamlines && (
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1440 600"
          >
            <defs>
              <linearGradient
                id={`streamGrad1_${uniqueId}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={config.streamColor} stopOpacity="0" />
                <stop
                  offset="50%"
                  stopColor={config.streamColor}
                  stopOpacity={config.streamOpacity}
                />
                <stop offset="100%" stopColor={config.streamColor} stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id={`streamGrad2_${uniqueId}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
                <stop
                  offset="60%"
                  stopColor="#00e5ff"
                  stopOpacity={config.streamOpacity * 0.9}
                />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Harmonic Streamline Wave 1 */}
            <path
              d="M-200,120 C180,80 340,160 620,130 C900,100 1150,180 1640,120"
              fill="none"
              stroke={`url(#streamGrad1_${uniqueId})`}
              strokeWidth="2.5"
              strokeDasharray="16 12"
              className="animate-[streamDrift_32s_linear_infinite]"
            />

            {/* Harmonic Streamline Wave 2 */}
            <path
              d="M-200,260 C220,310 480,210 780,270 C1080,330 1340,230 1640,280"
              fill="none"
              stroke={`url(#streamGrad2_${uniqueId})`}
              strokeWidth="2"
              strokeDasharray="20 16"
              className="animate-[streamDriftReverse_28s_linear_infinite]"
            />

            {/* Harmonic Streamline Wave 3 */}
            <path
              d="M-200,430 C150,380 400,470 720,420 C1040,370 1280,480 1640,430"
              fill="none"
              stroke={`url(#streamGrad1_${uniqueId})`}
              strokeWidth="2.2"
              strokeDasharray="12 10"
              className="animate-[streamDrift_36s_linear_infinite]"
            />

            {/* Topography Hydro-Depth Contour */}
            <path
              d="M-100,530 C300,560 600,510 950,545 C1250,575 1450,520 1600,540"
              fill="none"
              stroke={config.streamColor}
              strokeOpacity={config.streamOpacity * 0.5}
              strokeWidth="1.2"
            />
          </svg>
        )}

        {/* Layer 3: Floating Micro-Bubbles with Glass Glow */}
        {showBubbles && (
          <div className="absolute inset-0 overflow-hidden">
            {STATIC_BUBBLES.map((bubble, i) => (
              <span
                key={i}
                className="absolute rounded-full border"
                style={{
                  left: bubble.left,
                  bottom: "-30px",
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  borderColor: `${config.bubbleColor}60`,
                  background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 40%, ${config.bubbleColor}25 100%)`,
                  boxShadow: `0 2px 8px ${config.bubbleColor}20, inset 0 1px 2px rgba(255,255,255,0.8)`,
                  opacity: bubble.opacity,
                  animation: `waterBubbleFloat ${bubble.duration} ease-in-out infinite`,
                  animationDelay: bubble.delay,
                  transform: "translateZ(0)",
                  willChange: "transform, opacity",
                }}
              />
            ))}
          </div>
        )}

        {/* Layer 4: Micro-Mesh Water Refraction Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(${config.streamColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
