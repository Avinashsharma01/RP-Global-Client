"use client";

import { useEffect } from "react";

const TARGET_SELECTOR = [
  'button:not(:disabled):not([aria-disabled="true"]):not([data-magnetic-ignore])',
  '[role="button"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  '[data-magnetic]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[data-magnetic]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a.group:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[class*="rounded"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[class*="btn"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[class*="from-[#0077"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[class*="bg-[#0077"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[href*="/contact-us"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[href*="/solutions"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  'a[href*="/about-us"]:not([aria-disabled="true"]):not([data-magnetic-ignore])',
  '.btn-water-fluid:not([data-magnetic-ignore])',
  '.water-fluid-primary:not([data-magnetic-ignore])',
  '.water-fluid-secondary:not([data-magnetic-ignore])',
  'input[type="button"]:not(:disabled):not([data-magnetic-ignore])',
  'input[type="submit"]:not(:disabled):not([data-magnetic-ignore])',
].join(", ");

const REACH = 115;
const SVG_NS = "http://www.w3.org/2000/svg";
type MagneticController = { references: number; dispose: () => void };
type MagneticWindow = Window & { __rpGlobalMagneticButtons?: MagneticController };

interface CachedTarget {
  element: HTMLElement;
  rect: DOMRect;
}

/** 
 * High-Performance Liquid Water Button Tether Effect
 * - Zero forced-layout during pointer move (cached bounding boxes)
 * - Auto-pauses RAF loop when idle outside interaction zones
 * - Passive, throttled scroll & resize listeners
 */
export function useMagneticButtons() {
  useEffect(() => {
    const hostWindow = window as MagneticWindow;
    const release = (controller: MagneticController) => {
      controller.references -= 1;
      if (controller.references > 0) return;
      controller.dispose();
      if (hostWindow.__rpGlobalMagneticButtons === controller) {
        delete hostWindow.__rpGlobalMagneticButtons;
      }
    };
    const existingController = hostWindow.__rpGlobalMagneticButtons;
    if (existingController) {
      existingController.references += 1;
      return () => release(existingController);
    }

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canHover.matches || reducedMotion.matches) return;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.classList.add("magnetic-button-tether");
    svg.style.filter = "drop-shadow(0 0 3px rgba(0, 229, 255, 0.85)) drop-shadow(0 0 1px rgba(0, 119, 182, 0.95))";

    const strands = [
      { offset: -14, width: 1.6, progress: 0.66, bend: -17, phase: 0.4 },
      { offset: -6, width: 2.1, progress: 0.84, bend: 12, phase: 1.7 },
      { offset: 1, width: 2.8, progress: 1, bend: -3, phase: 3.1 },
      { offset: 9, width: 1.9, progress: 0.76, bend: 19, phase: 4.3 },
      { offset: 19, width: 1.4, progress: 0.58, bend: -23, phase: 5.2 },
    ];
    const paths = strands.map(() => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#0096C7");
      path.setAttribute("stroke-linecap", "round");
      path.style.opacity = "1";
      svg.appendChild(path);
      return path;
    });
    paths.forEach((path, index) => path.setAttribute("stroke-width", `${strands[index].width}`));

    // Cursor liquid bead with glowing aqua water center
    const cursorBead = document.createElementNS(SVG_NS, "circle");
    cursorBead.setAttribute("r", "2.8");
    cursorBead.setAttribute("fill", "#00b4d8");
    cursorBead.setAttribute("stroke", "#ffffff");
    cursorBead.setAttribute("stroke-width", "1");
    cursorBead.style.opacity = "0";
    svg.appendChild(cursorBead);

    const dropletConfigs = [
      { fraction: 0.2, radius: 1.8, phase: 0.8 },
      { fraction: 0.54, radius: 2.3, phase: 2.2 },
      { fraction: 0.84, radius: 1.6, phase: 3.9 },
    ];
    const droplets = dropletConfigs.map((droplet) => {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("r", `${droplet.radius}`);
      circle.setAttribute("fill", "#0096C7");
      circle.setAttribute("stroke", "rgba(255, 255, 255, 0.7)");
      circle.setAttribute("stroke-width", "0.6");
      circle.style.opacity = "0";
      svg.appendChild(circle);
      return circle;
    });

    const spikes = [0.28, 0.61, 0.86].map(() => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#00B4D8");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-width", "1.9");
      path.style.opacity = "0";
      svg.appendChild(path);
      return path;
    });

    const drips = [0.36, 0.74].map(() => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#0077B6");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-width", "2.1");
      path.style.opacity = "0";
      svg.appendChild(path);
      return path;
    });
    document.body.appendChild(svg);

    let rawTargets: HTMLElement[] = [];
    let cachedTargets: CachedTarget[] = [];
    let activeTarget: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    let pointerIsInside = false;

    const clearTether = () => {
      svg.style.opacity = "0";
      cursorBead.style.opacity = "0";
      droplets.forEach((droplet) => (droplet.style.opacity = "0"));
      paths.forEach((path) => path.setAttribute("d", ""));
      spikes.forEach((path) => path.setAttribute("d", ""));
      drips.forEach((path) => path.setAttribute("d", ""));
    };

    const releaseTarget = (target: HTMLElement) => {
      target.removeAttribute("data-magnetic-active");
    };

    // Fast viewport box update — only executed on throttled scroll or resize
    const updateTargetPositions = () => {
      const nextCached: CachedTarget[] = [];
      const vHeight = window.innerHeight;
      const vWidth = window.innerWidth;

      for (let i = 0; i < rawTargets.length; i++) {
        const el = rawTargets[i];
        if (!el.isConnected || el.offsetParent === null) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) continue;
        if (
          rect.bottom < -REACH ||
          rect.top > vHeight + REACH ||
          rect.right < -REACH ||
          rect.left > vWidth + REACH
        ) {
          continue;
        }
        nextCached.push({ element: el, rect });
      }
      cachedTargets = nextCached;
    };

    const updateTargets = () => {
      rawTargets = Array.from(
        document.querySelectorAll<HTMLElement>(TARGET_SELECTOR),
      ).filter((target) => !target.hasAttribute("data-magnetic-ignore"));

      updateTargetPositions();

      if (activeTarget && !rawTargets.includes(activeTarget)) {
        releaseTarget(activeTarget);
        activeTarget = null;
        clearTether();
      }
    };

    const drawTether = (rect: DOMRect, strength: number, time: number) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = pointerX - centerX;
      const dy = pointerY - centerY;
      const centerDistance = Math.hypot(dx, dy);
      if (centerDistance < 1) {
        clearTether();
        return;
      }

      const ux = dx / centerDistance;
      const uy = dy / centerDistance;
      const edgeScale =
        1 /
        Math.max(
          Math.abs(ux) / Math.max(rect.width / 2, 1),
          Math.abs(uy) / Math.max(rect.height / 2, 1),
        );
      const anchorX = centerX + ux * edgeScale;
      const anchorY = centerY + uy * edgeScale;
      const lineX = pointerX - anchorX;
      const lineY = pointerY - anchorY;
      const lineDistance = Math.max(Math.hypot(lineX, lineY), 1);
      const normalX = -lineY / lineDistance;
      const normalY = lineX / lineDistance;

      paths.forEach((path, index) => {
        const strand = strands[index];
        const offset = strand.offset * strength;
        const startX = anchorX + normalX * offset;
        const startY = anchorY + normalY * offset;
        const endOffset = (index - 2) * 3.2 * strength;
        const endX = anchorX + lineX * strand.progress + normalX * endOffset;
        const endY = anchorY + lineY * strand.progress + normalY * endOffset;
        const wave = Math.sin(time * 5.1 + strand.phase) * 10 * strength;
        const drift = Math.cos(time * 3.7 + strand.phase) * 6.5 * strength;
        const firstBend = strand.bend * strength + wave;
        const secondBend = strand.bend * strength * 0.18 - drift;
        const control1X = startX + lineX * 0.32 + normalX * firstBend;
        const control1Y = startY + lineY * 0.32 + normalY * firstBend;
        const control2X = endX - lineX * 0.24 + normalX * secondBend;
        const control2Y = endY - lineY * 0.24 + normalY * secondBend;
        path.setAttribute(
          "d",
          `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`,
        );
      });

      cursorBead.setAttribute("cx", `${pointerX}`);
      cursorBead.setAttribute("cy", `${pointerY}`);
      cursorBead.style.opacity = `${Math.min(1, strength * 1.3)}`;

      droplets.forEach((droplet, index) => {
        const config = dropletConfigs[index];
        const wobbleX = Math.sin(time * 3.6 + config.phase) * 1.8 * strength;
        const wobbleY = Math.cos(time * 3.2 + config.phase) * 1.2 * strength;
        droplet.setAttribute(
          "cx",
          `${rect.left + rect.width * config.fraction + wobbleX}`,
        );
        droplet.setAttribute(
          "cy",
          `${rect.bottom + config.radius * 0.5 + wobbleY}`,
        );
        droplet.style.opacity = `${Math.min(1, strength * 1.2)}`;
      });

      spikes.forEach((path, index) => {
        const fraction = [0.28, 0.61, 0.86][index];
        const x = rect.left + rect.width * fraction;
        const y = rect.top + 1;
        const sway = Math.sin(time * 4 + index * 1.8) * 2.5 * strength;
        const height = (5 + index * 1.2 + Math.sin(time * 3.5 + index) * 2) * strength;
        path.setAttribute(
          "d",
          `M ${x} ${y} C ${x + sway} ${y - height * 0.25}, ${x + 2 + sway} ${y - height}, ${x + 5 + sway} ${y - height * 0.8} C ${x + 8 + sway} ${y - height * 0.45}, ${x + 3 + sway} ${y - 1}, ${x + 2 + sway} ${y + 1}`,
        );
        path.style.opacity = `${Math.min(1, strength * 1.1)}`;
      });

      drips.forEach((path, index) => {
        const fraction = [0.36, 0.74][index];
        const x = rect.left + rect.width * fraction;
        const y = rect.bottom - 1;
        const sway = Math.sin(time * 3.8 + index * 2.1) * 2 * strength;
        const length = (5 + index * 2 + Math.cos(time * 3 + index) * 2) * strength;
        path.setAttribute(
          "d",
          `M ${x} ${y} C ${x + sway} ${y + length * 0.3}, ${x - sway} ${y + length * 0.75}, ${x + sway * 0.7} ${y + length}`,
        );
        path.style.opacity = `${Math.min(1, strength * 1.1)}`;
      });
      svg.style.opacity = "1";
    };

    const updateMagnet = () => {
      frame = 0;
      if (!pointerIsInside) {
        clearTether();
        return;
      }

      let closestItem: CachedTarget | null = null;
      let closestGap = REACH;

      // Ultra-fast cached rejection loop — zero DOM reflows here!
      for (let i = 0; i < cachedTargets.length; i++) {
        const item = cachedTargets[i];
        const rect = item.rect;

        // Bounding box pre-check before expensive hypot
        if (
          pointerX < rect.left - REACH ||
          pointerX > rect.right + REACH ||
          pointerY < rect.top - REACH ||
          pointerY > rect.bottom + REACH
        ) {
          continue;
        }

        const nearestX = Math.max(rect.left, Math.min(pointerX, rect.right));
        const nearestY = Math.max(rect.top, Math.min(pointerY, rect.bottom));
        const gap = Math.hypot(pointerX - nearestX, pointerY - nearestY);

        if (gap < closestGap) {
          closestItem = item;
          closestGap = gap;
        }
      }

      if (!closestItem) {
        if (activeTarget) releaseTarget(activeTarget);
        activeTarget = null;
        clearTether();
        return; // Stops RAF loop when pointer is idle away from buttons
      }

      const closest = closestItem.element;
      if (activeTarget && activeTarget !== closest) releaseTarget(activeTarget);
      activeTarget = closest;
      const rect = closestItem.rect;
      const strength = Math.sqrt(Math.max(0, 1 - closestGap / REACH));
      closest.setAttribute("data-magnetic-active", "true");

      drawTether(rect, strength, performance.now() / 1000);
      // Keep animation fluid only while tethered to a button
      frame = window.requestAnimationFrame(updateMagnet);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerIsInside = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(updateMagnet);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      pointerIsInside = false;
      if (activeTarget) releaseTarget(activeTarget);
      activeTarget = null;
      clearTether();
    };

    const handleWindowBlur = () => {
      pointerIsInside = false;
      if (activeTarget) releaseTarget(activeTarget);
      activeTarget = null;
      clearTether();
    };

    // Initial query
    updateTargets();

    // Throttled scroll updater using requestAnimationFrame
    let scrollRaf = 0;
    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0;
        updateTargetPositions();
        if (pointerIsInside && !frame) {
          frame = window.requestAnimationFrame(updateMagnet);
        }
      });
    };

    // Debounced mutation observer to avoid running on every class change
    let mutationTimer: NodeJS.Timeout | null = null;
    const handleMutation = () => {
      if (mutationTimer) clearTimeout(mutationTimer);
      mutationTimer = setTimeout(() => {
        updateTargets();
      }, 150);
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled"],
    });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("resize", updateTargets, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const dispose = () => {
      observer.disconnect();
      if (mutationTimer) clearTimeout(mutationTimer);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("resize", updateTargets);
      window.removeEventListener("scroll", handleScroll);
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
      if (frame) window.cancelAnimationFrame(frame);
      rawTargets.forEach((target) => {
        releaseTarget(target);
      });
      svg.remove();
    };

    const controller = { references: 1, dispose };
    hostWindow.__rpGlobalMagneticButtons = controller;
    return () => release(controller);
  }, []);
}
