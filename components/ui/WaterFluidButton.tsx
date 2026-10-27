


"use client";

import React, { useRef, useState, useCallback, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface WaterRipple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface WaterFluidButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "cyan";
  size?: "sm" | "md" | "lg";
  id?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  showWaves?: boolean;
}

export const WaterFluidButton: React.FC<WaterFluidButtonProps> = ({
  children,
  href,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  id,
  type = "button",
  disabled = false,
  target,
  rel,
  "aria-label": ariaLabel,
}) => {
  const [ripples, setRipples] = useState<WaterRipple[]>([]);
  const buttonRef = useRef<HTMLElement | null>(null);

  const handlePointerDown = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;
    const newRipple: WaterRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };
    setRipples((prev) => [...prev.slice(-2), newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 700);

    if (onClick) {
      onClick(e);
    }
  }, [onClick]);

  const sizeClasses = {
    sm: "px-5 py-2.5 text-xs min-h-10 gap-1.5",
    md: "px-7 py-3.5 text-sm min-h-12 gap-2.5",
    lg: "px-8 py-4 text-base min-h-14 gap-3",
  }[size];

  const variantClasses = {
    primary:
      "text-white border border-cyan-400/80 bg-gradient-to-r from-[#0077b6] via-[#0096c7] to-[#0284c7] shadow-[0_0_20px_rgba(0,229,255,0.45),0_8px_24px_-4px_rgba(0,119,182,0.55)] hover:shadow-[0_0_28px_rgba(0,229,255,0.65),0_12px_32px_-4px_rgba(0,119,182,0.7)]",
    cyan:
      "text-white border border-white/70 bg-gradient-to-r from-[#0096c7] to-[#00b4d8] shadow-[0_0_18px_rgba(0,180,216,0.35)]",
    secondary:
      "text-white border border-cyan-300/70 bg-gradient-to-r from-[#0077b6]/90 via-[#0096c7]/90 to-[#0284c7]/90 shadow-[0_0_18px_rgba(0,229,255,0.35)] hover:shadow-[0_0_24px_rgba(0,229,255,0.5)]",
    ghost:
      "bg-transparent text-white border border-white/40 hover:bg-white/10",
  }[variant];

  const commonClasses = `
    btn-water-fluid group relative inline-flex items-center justify-center font-semibold rounded-full
    overflow-hidden select-none cursor-pointer isolate backdrop-blur-sm
    transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-[#0077b6]
    ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "active:scale-[0.97]"}
    ${sizeClasses}
    ${variantClasses}
    ${className}
  `;

  const innerContent = (
    <>
      {/* 1. Living Animated Water Inside Chamber */}
      <div
        className="water-inside-chamber"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Deep liquid volume filling bottom of button */}
        <div
          className="water-liquid-volume"
          style={{
            position: "absolute",
            left: "-25%",
            right: "-25%",
            width: "150%",
            bottom: 0,
            height: "56%",
            background: "linear-gradient(180deg, #00b4d8 0%, #0077b6 45%, #023e8a 85%, #03045e 100%)",
            boxShadow: "0 -4px 18px rgba(0, 229, 255, 0.75)",
          }}
        >
          {/* Back wave layer */}
          <div
            className="water-wave-layer water-wave-back"
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              width: "250%",
              height: "22px",
              marginBottom: "-1px",
            }}
          >
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="water-wave-svg" style={{ width: "100%", height: "100%", display: "block" }}>
              <path
                d="M 0,25 Q 62.5,5 125,25 T 250,25 Q 312.5,5 375,25 T 500,25 Q 562.5,5 625,25 T 750,25 Q 812.5,5 875,25 T 1000,25 L 1000,60 L 0,60 Z"
                fill="#0077b6"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Front wave layer with glowing cyan crest & white foam stroke */}
          <div
            className="water-wave-layer water-wave-front"
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              width: "250%",
              height: "22px",
              marginBottom: "-1px",
            }}
          >
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="water-wave-svg" style={{ width: "100%", height: "100%", display: "block" }}>
              <path
                d="M 0,25 Q 62.5,45 125,25 T 250,25 Q 312.5,45 375,25 T 500,25 Q 562.5,45 625,25 T 750,25 Q 812.5,45 875,25 T 1000,25 L 1000,60 L 0,60 Z"
                fill="#00e5ff"
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth="2.5"
                opacity="0.95"
                style={{ filter: "drop-shadow(0 0 6px #00e5ff)" }}
              />
            </svg>
          </div>

          {/* Floating micro-bubbles */}
          <span className="water-bubble b1" style={{ left: "15%", width: "5px", height: "5px", animationDelay: "0.1s" }} />
          <span className="water-bubble b2" style={{ left: "35%", width: "4px", height: "4px", animationDelay: "0.8s" }} />
          <span className="water-bubble b3" style={{ left: "55%", width: "6px", height: "6px", animationDelay: "1.4s" }} />
          <span className="water-bubble b4" style={{ left: "75%", width: "4.5px", height: "4.5px", animationDelay: "0.4s" }} />
          <span className="water-bubble b5" style={{ left: "90%", width: "3.5px", height: "3.5px", animationDelay: "1.9s" }} />
        </div>

        {/* Ambient liquid light caustic shimmer */}
        <div className="water-caustic-mesh" />

        {/* Curved glass meniscus reflection at top */}
        <div
          className="water-top-meniscus"
          style={{
            position: "absolute",
            top: "1px",
            left: "6%",
            right: "6%",
            height: "36%",
            borderRadius: "9999px",
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      </div>

      {/* 2. Shimmer sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full z-[4]"
      />

      {/* 3. Water droplet click ripples */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full z-[5]">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0%,rgba(0,229,255,0.3)_40%,transparent_75%)] animate-[waterRippleExpand_0.7s_cubic-bezier(0.1,0.8,0.3,1)_forwards]"
          />
        ))}
      </span>

      {/* 4. Perfectly Centered Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 text-white font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        id={id}
        target={target}
        rel={rel}
        data-magnetic="true"
        data-water-fluid="true"
        data-water-btn="true"
        aria-label={ariaLabel}
        className={commonClasses}
        onClick={handlePointerDown}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <motion.button
      ref={buttonRef as any}
      id={id}
      type={type}
      disabled={disabled}
      data-magnetic="true"
      data-water-fluid="true"
      data-water-btn="true"
      aria-label={ariaLabel}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.965 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className={commonClasses}
      onClick={handlePointerDown}
    >
      {innerContent}
    </motion.button>
  );
};
