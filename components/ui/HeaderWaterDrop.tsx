"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Droplet {
  id: number;
  xPercent: number; // horizontal position percentage across header
  size: number; // scale multiplier
  duration: number; // total animation duration in seconds (grow + fall)
  fallDistance: string; // fall distance (e.g. 100vh)
}

export const HeaderWaterDrop: React.FC = () => {
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches);

    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);
    return () => mediaQuery.removeEventListener("change", updateDesktopState);
  }, []);

  // Spawns a single transparent glass water droplet
  const spawnDroplet = useCallback((customX?: number) => {
    let x = customX;

    if (x === undefined && typeof window !== "undefined") {
      const dropUnderLogo = Math.random() < 0.35;
      const logoEl = document.getElementById("navbar-logo-img");

      if (dropUnderLogo && logoEl) {
        // Position directly under the water swirl icon of RP Global logo
        const rect = logoEl.getBoundingClientRect();
        const logoWaterX = ((rect.left + rect.width * 0.32) / window.innerWidth) * 100;
        x = Math.max(3, Math.min(97, logoWaterX + (Math.random() * 1.6 - 0.8)));
      } else {
        // Natural distribution across the full width of the header
        const positions = [12, 22, 33, 44, 55, 66, 76, 86, 94];
        const base = positions[Math.floor(Math.random() * positions.length)];
        x = base + (Math.random() * 5 - 2.5);
      }
    }

    const finalX = x ?? 15;
    const id = ++nextId.current;
    
    // Total cycle: ~2.8s slow growth + ~1.8s gravitational plunge top-to-bottom
    const duration = 4.6 + Math.random() * 0.8; // 4.6s to 5.4s
    const size = 0.88 + Math.random() * 0.28; // varied natural drop sizes

    const newDroplet: Droplet = {
      id,
      xPercent: finalX,
      size,
      duration,
      fallDistance: "100vh",
    };

    // Keep up to 10 concurrent active drops
    setDroplets((prev) => [...prev.slice(-9), newDroplet]);

    // Clean up droplet once full cycle completes
    const cleanupTimer = setTimeout(() => {
      setDroplets((prev) => prev.filter((d) => d.id !== id));
    }, duration * 1000 + 200);

    return () => {
      clearTimeout(cleanupTimer);
    };
  }, []);

  // Interval timer for frequent, continuous water dripping
  useEffect(() => {
    if (!isDesktop) return;

    // Initial staggered drops right after page load so user sees them immediately
    const t1 = setTimeout(() => spawnDroplet(), 250);
    const t2 = setTimeout(() => spawnDroplet(), 800);
    const t3 = setTimeout(() => spawnDroplet(), 1600);

    // Recurring high-frequency interval (new drop starts every 1.1s to 2.1s)
    let intervalTimer: NodeJS.Timeout;
    const scheduleNext = () => {
      const delay = 1100 + Math.random() * 1000;
      intervalTimer = setTimeout(() => {
        spawnDroplet();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    // Listen for custom trigger event (e.g. clicking the logo)
    const handleCustomTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ xPercent?: number }>;
      spawnDroplet(customEvent.detail?.xPercent);
    };
    window.addEventListener("trigger-water-drop", handleCustomTrigger);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(intervalTimer);
      window.removeEventListener("trigger-water-drop", handleCustomTrigger);
    };
  }, [isDesktop, spawnDroplet]);

  if (!isDesktop) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-full h-0 z-40 overflow-visible select-none"
    >
      {/* Active Growing and Falling Transparent Water Droplets */}
      {droplets.map((d) => (
        <div
          key={d.id}
          className="absolute top-0 -translate-x-1/2 will-change-transform"
          style={{
            left: `${d.xPercent}%`,
            animation: `waterDropSwellAndFall ${d.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
            // @ts-expect-error custom css variable for dynamic fall distance
            "--fall-distance": d.fallDistance,
          }}
        >
          {/* Glass Water Drop Shape */}
          <div
            className="relative -mt-0.5"
            style={{
              transform: `scale(${d.size})`,
              transformOrigin: "top center",
            }}
          >
            {/* Transparent Glass Droplet with Caustic Lighting */}
            <svg
              width="24"
              height="36"
              viewBox="0 0 24 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible filter drop-shadow-[0_6px_14px_rgba(0,119,182,0.45)]"
            >
              <defs>
                {/* Refractive Liquid Body Gradient with Glass Transparency */}
                <linearGradient id={`dropGlassGrad-${d.id}`} x1="12" y1="1" x2="12" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="25%" stopColor="#dcf8fc" stopOpacity="0.38" />
                  <stop offset="60%" stopColor="#0077b6" stopOpacity="0.45" />
                  <stop offset="88%" stopColor="#0096c7" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#023e8a" stopOpacity="0.88" />
                </linearGradient>

                {/* Inner Specular Highlight */}
                <radialGradient id={`dropHighlight-${d.id}`} cx="8.5" cy="18" r="7" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                {/* Bottom Caustic Glow Rim */}
                <linearGradient id={`causticRim-${d.id}`} x1="6" y1="27" x2="18" y2="31" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#48cae4" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#90e0ef" stopOpacity="0.25" />
                </linearGradient>

                {/* Glass Blur Filter */}
                <filter id={`glassFilter-${d.id}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Top Contact Meniscus (Border Attachment Bead) */}
              <path
                d="M 7 1 C 9.5 0.2 14.5 0.2 17 1 C 15.5 2.2 8.5 2.2 7 1 Z"
                fill="rgba(255, 255, 255, 0.85)"
              />

              {/* Water Tear-Drop Contour */}
              <path
                d="M 12 1.5 C 12 1.5 3.5 15 3.5 23 C 3.5 28.5 7.3 33 12 33 C 16.7 33 20.5 28.5 20.5 23 C 20.5 15 12 1.5 12 1.5 Z"
                fill={`url(#dropGlassGrad-${d.id})`}
                stroke="rgba(255, 255, 255, 0.88)"
                strokeWidth="0.85"
                filter={`url(#glassFilter-${d.id})`}
              />

              {/* Glass Specular Reflection Highlight (Left Curved Light Streak) */}
              <path
                d="M 8 14 C 6.5 17 6.2 21.5 7.6 25 C 8 25.8 8.9 25.2 8.6 24.2 C 7.6 21.6 7.8 18 9 15 C 9.4 14.1 8.3 13.3 8 14 Z"
                fill="#ffffff"
                opacity="0.95"
              />

              {/* Bright Micro Specular Glint Dot */}
              <ellipse cx="8.5" cy="18" rx="2" ry="3.6" transform="rotate(-15 8.5 18)" fill={`url(#dropHighlight-${d.id})`} />

              {/* Bottom Internal Caustic Rim Glow */}
              <ellipse cx="12" cy="28" rx="5.5" ry="2" fill={`url(#causticRim-${d.id})`} />

              {/* Secondary Reflection Glint (Right Side) */}
              <circle cx="16" cy="24" r="1.2" fill="#ffffff" opacity="0.75" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
