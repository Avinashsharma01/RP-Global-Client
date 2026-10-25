"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1"
    >
      {/* Background track (subtle) */}
      <div className="absolute inset-0 bg-[#0A192F]/10 backdrop-blur-xs" />

      {/* Dynamic Animated Liquid Stream */}
      <motion.div
        className="relative h-full w-full bg-gradient-to-r from-[#0077B6] via-[#00E5FF] to-[#38BDF8]"
        style={{
          scaleX,
          transformOrigin: "0%",
          boxShadow: "0 0 10px rgba(0, 229, 255, 0.7), 0 0 3px rgba(0, 119, 182, 0.9)",
        }}
      >
        {/* Leading edge hydraulic sparkle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_#00E5FF] ring-2 ring-[#00E5FF]/60 animate-pulse" />
      </motion.div>
    </div>
  );
};
