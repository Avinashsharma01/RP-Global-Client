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
      "bg-gradient-to-r from-[#0077b6] to-[#0284c7] text-white border border-white/35 shadow-lg shadow-[#0077b6]/30 hover:shadow-xl hover:shadow-[#0077b6]/40",
    cyan:
      "bg-gradient-to-r from-[#0096c7] via-[#00b4d8] to-[#48cae4] text-[#03045e] border border-white/50 shadow-md shadow-[#00b4d8]/30",
    secondary:
      "bg-white/85 text-[#0077b6] border border-[#0077b6]/30 shadow-md shadow-[#0077b6]/10 hover:bg-[#f0f9ff] hover:border-[#0077b6]/50",
    ghost:
      "bg-transparent text-[#0077b6] border border-transparent hover:bg-[#0077b6]/10",
  }[variant];

  const commonClasses = `
    group relative inline-flex items-center justify-center font-semibold rounded-full
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
      {/* 1. Subtle top meniscus gloss reflection */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0.5 h-[38%] rounded-full bg-gradient-to-b from-white/35 via-white/10 to-transparent"
      />

      {/* 2. Shimmer sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />

      {/* 3. Water droplet click ripples */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
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
      <span className="relative z-10 flex items-center justify-center gap-2">
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
