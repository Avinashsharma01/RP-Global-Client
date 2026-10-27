"use client";

import { useEffect } from "react";

export interface MagneticButtonOptions {
  selector?: string;
  strandCount?: number;
  maxPullDistance?: number;
  proximityRadius?: number;
  colorMode?: "black" | "auto";
}

interface Strand {
  t: number;
  edge: -1 | 1;
  insetRatio: number;
  maxStretch: number;
  thickness: number;
  bowOffset: number;
  tipJitterX: number;
  tipJitterY: number;

  // Dynamic physics state (stored relative to anchor so scrolling never causes shake)
  attached: boolean;
  retracting: boolean;
  relTipX: number;
  relTipY: number;
  relTipVx: number;
  relTipVy: number;
  relCtrlX: number;
  relCtrlY: number;
  relCtrlVx: number;
  relCtrlVy: number;

  pinHeight: number;
  pinVel: number;
  hasPinBead: boolean;
}

interface RimHorn {
  t: number;
  edge: -1 | 1;
  height: number;
  vel: number;
  maxHeight: number;
  width: number;
  curveBias: number;
  isPinDroplet: boolean;
  phase: number;
}

interface ButtonState {
  el: HTMLElement;
  strands: Strand[];
  horns: RimHorn[];
  hasActiveStrands: boolean;
  theme: {
    bodyColor: string;
    rimColor: string;
    specularColor: string;
  };
}

const DEFAULT_SELECTOR =
  '.btn-water-fluid, .water-fluid-primary, .water-fluid-btn, [data-water-fluid="true"], [data-magnetic="true"], #hero-rfq-btn, #hero-solutions-link, .important-cta';

function isEligibleButton(el: HTMLElement): boolean {
  if (typeof window === "undefined" || !el) return false;

  // Never run on admin pages or inside admin panels
  if (
    window.location.pathname.startsWith("/admin") ||
    el.closest(".admin-page") ||
    el.closest("[data-admin-panel]")
  ) {
    return false;
  }

  // Explicit opt-outs
  if (
    el.hasAttribute("data-no-magnetic") ||
    el.hasAttribute("data-no-water") ||
    el.hasAttribute("data-magnetic-ignore") ||
    el.classList.contains("no-water") ||
    el.classList.contains("no-magnetic")
  ) {
    return false;
  }

  // Never attach to telephone, email, or hash anchor links
  const href = (el.getAttribute("href") || "").toLowerCase();
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href === "#") {
    return false;
  }

  // Exclude non-CTA UI elements: navigation tabs, accordion triggers, small icon buttons, close buttons
  if (
    el.closest('[role="tablist"]') ||
    el.closest('[data-accordion]') ||
    el.closest('.topbar') ||
    el.getAttribute("aria-label")?.toLowerCase().includes("close")
  ) {
    return false;
  }

  // Enforce reasonable minimum dimensions for a prominent CTA button
  const rect = el.getBoundingClientRect();
  if (rect.height < 34 || rect.width < 75) return false;

  // STRICT OPT-IN: Only prominent CTA buttons marked for water/magnetic effects
  const isPrimaryCTA =
    el.classList.contains("btn-water-fluid") ||
    el.classList.contains("water-fluid-primary") ||
    el.classList.contains("water-fluid-btn") ||
    el.classList.contains("important-cta") ||
    el.hasAttribute("data-water-fluid") ||
    el.hasAttribute("data-water-btn") ||
    el.hasAttribute("data-magnetic") ||
    el.id === "hero-rfq-btn" ||
    el.id === "hero-solutions-link" ||
    el.id === "who-we-are-about-link" ||
    el.id === "faq-section-rfq-btn";

  return isPrimaryCTA;
}

function resolveTheme(el: HTMLElement, colorMode: "black" | "auto" = "auto") {
  if (colorMode === "black") {
    return {
      bodyColor: "rgba(15, 15, 18, 0.97)",
      rimColor: "rgba(10, 10, 12, 0.99)",
      specularColor: "rgba(255, 255, 255, 0.55)",
    };
  }

  const style = window.getComputedStyle(el);
  const bg = (style.backgroundColor + " " + style.backgroundImage).toLowerCase();
  const isBlue =
    bg.includes("0, ") ||
    bg.includes("14, ") ||
    bg.includes("2, 132") ||
    bg.includes("3, 105") ||
    bg.includes("0077b6") ||
    bg.includes("0096c7") ||
    bg.includes("00b4d8") ||
    el.className.includes("blue") ||
    el.className.includes("cyan") ||
    el.className.includes("sky") ||
    el.classList.contains("btn-water-fluid");

  if (isBlue) {
    return {
      bodyColor: "rgba(0, 119, 182, 0.95)",
      rimColor: "rgba(0, 77, 122, 0.98)",
      specularColor: "rgba(0, 229, 255, 0.85)",
    };
  }

  return {
    bodyColor: "rgba(15, 15, 18, 0.97)",
    rimColor: "rgba(10, 10, 12, 0.99)",
    specularColor: "rgba(255, 255, 255, 0.55)",
  };
}

function createStrands(count: number, maxPullDistance: number): Strand[] {
  const strands: Strand[] = [];
  for (let i = 0; i < count; i++) {
    const progress = count > 1 ? i / (count - 1) : 0.5;
    const t = 0.15 + progress * 0.7 + (Math.random() - 0.5) * 0.03;
    const edge: -1 | 1 = i % 3 === 0 ? 1 : -1;
    const insetRatio =
      edge === -1 ? 0.05 + Math.random() * 0.16 : 0.04 + Math.random() * 0.08;

    strands.push({
      t: Math.min(0.86, Math.max(0.14, t)),
      edge,
      insetRatio,
      maxStretch: maxPullDistance * (0.75 + Math.random() * 0.45),
      thickness: 1.2 + Math.random() * 1.1,
      bowOffset: (progress - 0.5) * 22 + (Math.random() - 0.5) * 7,
      tipJitterX: (Math.random() - 0.5) * 2.0,
      tipJitterY: (Math.random() - 0.5) * 2.0,
      attached: false,
      retracting: false,
      relTipX: 0,
      relTipY: 0,
      relTipVx: 0,
      relTipVy: 0,
      relCtrlX: 0,
      relCtrlY: 0,
      relCtrlVx: 0,
      relCtrlVy: 0,
      pinHeight: 0,
      pinVel: 0,
      hasPinBead: i % 2 === 0,
    });
  }
  return strands;
}

function createRimHorns(count: number): RimHorn[] {
  const horns: RimHorn[] = [];
  for (let i = 0; i < count; i++) {
    const edge: -1 | 1 = i % 3 === 0 ? 1 : -1;
    const progress = i / (count - 1);
    const t = 0.16 + progress * 0.68 + (Math.random() - 0.5) * 0.04;
    horns.push({
      t: Math.min(0.86, Math.max(0.14, t)),
      edge,
      height: 0,
      vel: 0,
      maxHeight: edge === -1 ? 16 + Math.random() * 18 : 10 + Math.random() * 10,
      width: edge === -1 ? 4.5 + Math.random() * 3.5 : 2.8 + Math.random() * 2.0,
      curveBias: (Math.random() - 0.5) * 14,
      isPinDroplet: edge === 1 || i % 4 === 0,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return horns;
}

export function useWaterFluidButtons(options: MagneticButtonOptions = {}) {
  const {
    selector = DEFAULT_SELECTOR,
    strandCount = 9,
    maxPullDistance = 120,
    proximityRadius = 105,
    colorMode = "auto",
  } = options;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent duplicate canvas instances if both hooks are imported
    if (document.querySelector('canvas[data-ferrofluid-canvas="true"]')) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.setAttribute("data-ferrofluid-canvas", "true");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      prevX: -9999,
      prevY: -9999,
      active: false,
      isScrolling: false,
    };

    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      mouse.isScrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        mouse.isScrolling = false;
      }, 120);
    };

    const states = new Map<HTMLElement, ButtonState>();

    const syncButtons = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
      nodes.forEach((el) => {
        if (!states.has(el) && isEligibleButton(el)) {
          el.style.transform = "";
          states.set(el, {
            el,
            strands: createStrands(strandCount, maxPullDistance),
            horns: createRimHorns(14),
            hasActiveStrands: false,
            theme: resolveTheme(el, colorMode),
          });
        }
      });

      for (const [el] of states) {
        if (!document.body.contains(el)) {
          states.delete(el);
        }
      }
    };

    syncButtons();
    const observer = new MutationObserver(syncButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    const onMouseMove = (e: MouseEvent) => {
      if (mouse.prevX !== -9999) {
        mouse.vx = e.clientX - mouse.prevX;
        mouse.vy = e.clientY - mouse.prevY;
      }
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.isScrolling = false;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    const drawStrand = (
      ax: number,
      ay: number,
      cx: number,
      cy: number,
      tx: number,
      ty: number,
      baseR: number,
      tipR: number,
      theme: ButtonState["theme"]
    ) => {
      const dx = tx - ax;
      const dy = ty - ay;
      const len = Math.hypot(dx, dy);
      if (len < 2) return;

      const nx = -dy / len;
      const ny = dx / len;

      ctx.fillStyle = theme.rimColor;
      ctx.beginPath();
      ctx.arc(ax, ay, baseR * 1.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = theme.bodyColor;
      ctx.beginPath();
      ctx.moveTo(ax + nx * baseR, ay + ny * baseR);
      ctx.quadraticCurveTo(
        cx + nx * (baseR * 0.45),
        cy + ny * (baseR * 0.45),
        tx + nx * tipR,
        ty + ny * tipR
      );
      ctx.arc(tx, ty, tipR, Math.atan2(ny, nx), Math.atan2(-ny, -nx));
      ctx.quadraticCurveTo(
        cx - nx * (baseR * 0.45),
        cy - ny * (baseR * 0.45),
        ax - nx * baseR,
        ay - ny * baseR
      );
      ctx.closePath();
      ctx.fill();

      const grad = ctx.createLinearGradient(ax, ay, tx, ty);
      grad.addColorStop(0, theme.specularColor);
      grad.addColorStop(0.55, "rgba(255, 255, 255, 0.12)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.5, baseR * 0.35);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(ax + nx * (baseR * 0.25), ay + ny * (baseR * 0.25));
      ctx.quadraticCurveTo(cx, cy, tx, ty);
      ctx.stroke();
    };

    const drawHornOrPin = (
      bx: number,
      by: number,
      edge: -1 | 1,
      height: number,
      width: number,
      bendX: number,
      isPinDroplet: boolean,
      theme: ButtonState["theme"]
    ) => {
      if (height < 0.8) return;

      ctx.fillStyle = theme.rimColor;

      if (isPinDroplet) {
        const stemW = Math.min(1.6, width * 0.45);
        const tipX = bx + bendX * 0.25;
        const tipY = by + edge * height;

        ctx.beginPath();
        ctx.moveTo(bx - stemW * 1.4, by);
        ctx.lineTo(tipX - stemW * 0.45, tipY);
        ctx.lineTo(tipX + stemW * 0.45, tipY);
        ctx.lineTo(bx + stemW * 1.4, by);
        ctx.closePath();
        ctx.fill();

        const beadR = Math.min(2.1, Math.max(1.1, height * 0.22));
        ctx.beginPath();
        ctx.arc(tipX, tipY, beadR, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const tipX = bx + bendX;
        const tipY = by + edge * height;
        const ctrlX = bx + bendX * 0.35;
        const ctrlY = by + edge * (height * 0.68);

        ctx.beginPath();
        ctx.moveTo(bx - width, by);
        ctx.quadraticCurveTo(ctrlX - width * 0.22, ctrlY, tipX, tipY);
        ctx.quadraticCurveTo(ctrlX + width * 0.22, ctrlY, bx + width, by);
        ctx.closePath();
        ctx.fill();
      }
    };

    let rafId = 0;
    let time = 0;

    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      mouse.vx *= 0.84;
      mouse.vy *= 0.84;

      states.forEach((state) => {
        const rect = state.el.getBoundingClientRect();
        if (
          rect.bottom < -150 ||
          rect.top > window.innerHeight + 150 ||
          rect.width === 0
        ) {
          return;
        }

        const clampedX = Math.max(rect.left, Math.min(mouse.x, rect.right));
        const clampedY = Math.max(rect.top, Math.min(mouse.y, rect.bottom));
        const distToButton = Math.hypot(mouse.x - clampedX, mouse.y - clampedY);

        const isInside =
          mouse.active &&
          !mouse.isScrolling &&
          mouse.x >= rect.left - 4 &&
          mouse.x <= rect.right + 4 &&
          mouse.y >= rect.top - 4 &&
          mouse.y <= rect.bottom + 4;

        // Attach strands when cursor is near enough — either inside or within lunge radius
        const isNearButton =
          mouse.active &&
          !mouse.isScrolling &&
          distToButton < proximityRadius * 0.68;

        if (isInside || isNearButton) {
          state.strands.forEach((s) => {
            const anchorX = rect.left + rect.width * s.t;
            const anchorY =
              s.edge === -1
                ? rect.top + rect.height * s.insetRatio
                : rect.bottom - rect.height * s.insetRatio;

            // From inside: attach if roughly aligned horizontally
            // From outside: attach probabilistically based on how close cursor is
            const strandDist = Math.hypot(mouse.x - anchorX, mouse.y - anchorY);
            const attachThreshold = isInside
              ? rect.width * 0.55
              : s.maxStretch * 0.72;

            if (!s.attached && !s.retracting && strandDist < attachThreshold) {
              s.attached = true;
              s.retracting = false;
              s.relTipX = mouse.x + s.tipJitterX - anchorX;
              s.relTipY = mouse.y + s.tipJitterY - anchorY;
              s.relCtrlX = s.relTipX * 0.5;
              s.relCtrlY = s.relTipY * 0.5;
            }
          });
        }

        let activeCount = 0;

        state.strands.forEach((s) => {
          const anchorX = rect.left + rect.width * s.t;
          const rimY = s.edge === -1 ? rect.top : rect.bottom;
          const anchorY =
            s.edge === -1
              ? rect.top + rect.height * s.insetRatio
              : rect.bottom - rect.height * s.insetRatio;

          if (s.attached) {
            const targetRelX = mouse.x + s.tipJitterX - anchorX;
            const targetRelY = mouse.y + s.tipJitterY - anchorY;

            // Use faster tracking so strands visibly chase the cursor
            s.relTipX += (targetRelX - s.relTipX) * 0.62;
            s.relTipY += (targetRelY - s.relTipY) * 0.62;

            const stretchDist = Math.hypot(s.relTipX, s.relTipY);

            // Allow strands to keep stretching even outside the button up to maxStretch
            const snapDist = isNearButton ? s.maxStretch * 1.15 : s.maxStretch;

            // Snap strand if stretched past its limit or if user scrolls away
            if (
              !mouse.active ||
              mouse.isScrolling ||
              stretchDist > snapDist
            ) {
              s.attached = false;
              s.retracting = true;
              s.relTipVx = -s.relTipX * 0.25;
              s.relTipVy = -s.relTipY * 0.25;
              s.pinVel = 4.2 + Math.random() * 2.5;
            } else {
              activeCount++;

              const midX = s.relTipX * 0.5;
              const midY = s.relTipY * 0.5;

              const sag = Math.min(26, stretchDist * 0.16);
              const bowScale = Math.min(1.15, stretchDist / 65);
              const targetCtrlX =
                midX + s.bowOffset * bowScale - mouse.vx * 0.3;
              const targetCtrlY = midY + sag - mouse.vy * 0.3;

              s.relCtrlVx =
                (s.relCtrlVx + (targetCtrlX - s.relCtrlX) * 0.3) * 0.65;
              s.relCtrlVy =
                (s.relCtrlVy + (targetCtrlY - s.relCtrlY) * 0.3) * 0.65;
              s.relCtrlX += s.relCtrlVx;
              s.relCtrlY += s.relCtrlVy;

              const tension = Math.min(0.9, stretchDist / s.maxStretch);
              const baseR = s.thickness * (1 - tension * 0.45);
              const tipR = Math.max(
                0.4,
                s.thickness * (1 - tension * 0.65) * 0.5
              );

              drawStrand(
                anchorX,
                anchorY,
                anchorX + s.relCtrlX,
                anchorY + s.relCtrlY,
                anchorX + s.relTipX,
                anchorY + s.relTipY,
                baseR,
                tipR,
                state.theme
              );
            }
          } else if (s.retracting) {
            // Button-relative retraction so scrolling never stretches or shakes strands
            const distBack = Math.hypot(s.relTipX, s.relTipY);
            if (distBack > 2.0) {
              activeCount++;
              s.relTipVx = (s.relTipVx - s.relTipX * 0.28) * 0.64;
              s.relTipVy = (s.relTipVy - s.relTipY * 0.28) * 0.64;
              s.relTipX += s.relTipVx;
              s.relTipY += s.relTipVy;

              s.relCtrlX *= 0.65;
              s.relCtrlY *= 0.65;

              const r = Math.min(
                s.thickness,
                0.6 + (distBack / 55) * s.thickness
              );
              drawStrand(
                anchorX,
                anchorY,
                anchorX + s.relCtrlX,
                anchorY + s.relCtrlY,
                anchorX + s.relTipX,
                anchorY + s.relTipY,
                r,
                r * 0.5,
                state.theme
              );
            } else {
              s.retracting = false;
              s.relTipX = 0;
              s.relTipY = 0;
            }
          }

          if (s.pinHeight > 0.05 || Math.abs(s.pinVel) > 0.05) {
            s.pinVel += -0.19 * s.pinHeight;
            s.pinVel *= 0.83;
            s.pinHeight = Math.max(0, s.pinHeight + s.pinVel);

            drawHornOrPin(
              anchorX,
              rimY,
              s.edge,
              s.pinHeight,
              s.thickness * 1.9,
              0,
              s.hasPinBead,
              state.theme
            );
          }
        });

        state.hasActiveStrands = activeCount > 0;

        state.horns.forEach((horn) => {
          const hx = rect.left + rect.width * horn.t;
          const hy = horn.edge === -1 ? rect.top : rect.bottom;
          const distToMouse = Math.hypot(mouse.x - hx, mouse.y - hy);

          let targetH = 0;

          if (
            mouse.active &&
            !mouse.isScrolling &&
            distToButton < proximityRadius
          ) {
            // Horns react even from inside: scale proximity so full height triggers at button edge
            const prox = Math.max(
              0,
              1 - distToMouse / (proximityRadius * 1.05)
            );
            // Lean/bend toward cursor direction — contributes to the "reaching" feel
            const leanBoost = isInside ? 0.45 : 1.0;
            const pulse =
              0.72 + 0.28 * Math.sin(time * 2.8 + horn.phase + horn.t * 5);
            targetH = horn.maxHeight * Math.pow(prox, 0.85) * pulse * leanBoost;
          } else if (state.hasActiveStrands) {
            const pulse = 0.65 + 0.35 * Math.sin(time * 2.2 + horn.phase);
            targetH = horn.maxHeight * 0.62 * pulse;
          }

          // Faster spring response for snappier grab feel
          horn.vel = (horn.vel + (targetH - horn.height) * 0.3) * 0.72;
          horn.height = Math.max(0, horn.height + horn.vel);

          if (horn.height > 0.7) {
            // Horns lean further toward cursor for a "reaching" look
            const dx = mouse.active ? (mouse.x - hx) * 0.14 : 0;
            const bendX = Math.max(
              -horn.height * 0.85,
              Math.min(
                horn.height * 0.85,
                dx + horn.curveBias * (horn.height / horn.maxHeight)
              )
            );
            drawHornOrPin(
              hx,
              hy,
              horn.edge,
              horn.height,
              horn.width,
              bendX,
              horn.isPinDroplet,
              state.theme
            );
          }
        });
      });

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, [
    selector,
    strandCount,
    maxPullDistance,
    proximityRadius,
    colorMode,
  ]);
}

export const useMagneticButtons = useWaterFluidButtons;
export default useWaterFluidButtons;

