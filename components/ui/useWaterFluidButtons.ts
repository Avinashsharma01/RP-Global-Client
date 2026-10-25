"use client";

import { useEffect } from "react";

/**
 * Universal Water Fluid Button Hook
 * Makes all buttons across the application look and behave like liquid fluid of water:
 * - Fluid hydro-elastic bounce on press
 * - Authentic water droplet ripple radiating from exact touch/click point
 * - Automatic enhancement of button elements with water fluid optics
 */
export function useWaterFluidButtons() {
  useEffect(() => {
    // 1. Water Ripple Click Handler
    const handlePointerDown = (e: PointerEvent) => {
      // Find closest button or interactive element
      const target = (e.target as HTMLElement | null)?.closest(
        'button, [role="button"], input[type="button"], input[type="submit"], [data-magnetic], a.group, a[class*="bg-gradient-to-r"], a[class*="bg-[#0077B6]"]'
      ) as HTMLElement | null;

      if (!target) return;
      if (target.hasAttribute("disabled") || target.getAttribute("aria-disabled") === "true") return;

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.4;

      // Ensure button can contain the ripple cleanly
      const computed = window.getComputedStyle(target);
      if (computed.position === "static") {
        target.style.position = "relative";
      }
      target.classList.add("water-fluid-interactive");

      // Create water droplet ripple element
      const ripple = document.createElement("span");
      ripple.className = "water-global-ripple";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      target.appendChild(ripple);

      // Organic liquid squish & spring
      target.style.transition = "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)";
      target.style.transform = "scale(0.965) translateY(1px)";

      const resetTransform = () => {
        target.style.transform = "";
        window.removeEventListener("pointerup", resetTransform);
        window.removeEventListener("pointercancel", resetTransform);
      };
      window.addEventListener("pointerup", resetTransform, { once: true });
      window.addEventListener("pointercancel", resetTransform, { once: true });

      setTimeout(() => {
        ripple.remove();
      }, 850);
    };

    // 2. Attach global listener
    document.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);
}
