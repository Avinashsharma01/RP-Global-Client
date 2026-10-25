"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { Droplets, Sparkles } from "lucide-react";

interface WaterHeroCanvasProps {
  className?: string;
  intensity?: number;
  showBadge?: boolean;
}

interface RipplePoint {
  x: number;
  y: number;
  age: number; // in seconds
  strength: number;
}

export const WaterHeroCanvas: React.FC<WaterHeroCanvasProps> = ({
  className = "",
  intensity = 1.0,
  showBadge = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Simulation state refs
  const ripplesRef = useRef<RipplePoint[]>([]);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const idleTimerRef = useRef<number>(0);
  const addRippleRef = useRef<(x: number, y: number, strength?: number) => void>(() => {});

  // Trigger a ripple pulse at normalized coordinates (0 to 1)
  const addRipple = useCallback((normX: number, normY: number, strength = 1.0) => {
    // Keep maximum 8 active ripples for optimal GPU performance
    if (ripplesRef.current.length >= 8) {
      ripplesRef.current.shift();
    }
    ripplesRef.current.push({
      x: normX,
      y: 1.0 - normY, // Invert Y for GLSL coordinate system
      age: 0,
      strength: strength * intensity,
    });
    idleTimerRef.current = 0;
  }, [intensity]);

  // Keep ref up to date for button/timer callbacks
  useEffect(() => {
    addRippleRef.current = addRipple;
  }, [addRipple]);

  // Pointer interactions
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const now = performance.now();
    const last = lastMousePosRef.current;

    // Throttle pointer disturbances to smooth out 60fps trail
    if (!last || Math.hypot(x - last.x, y - last.y) > 0.035 || now - last.time > 80) {
      addRipple(x, y, 0.75);
      lastMousePosRef.current = { x, y, time: now };
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    addRipple(x, y, 1.8);
  };

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    // 1. Scene & Orthographic Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    // 2. High-Performance WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Graceful fallback if WebGL fails on older machine
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";

    // 3. Water Fluid Simulation GLSL Shaders
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2() },
      u_ripples: {
        value: Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 999, 0)),
      },
      u_intensity: { value: intensity },
    };

    const waterVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const waterFragmentShader = `
      precision highp float;
      varying vec2 vUv;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec4 u_ripples[8]; // x, y, age (seconds), strength
      uniform float u_intensity;

      // Fast multi-frequency wave height calculation
      float calculateHeight(vec2 uv) {
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        vec2 aspectUv = vec2(uv.x * aspect, uv.y);

        float h = 0.0;

        // Ambient fluid motion (Gerstner-like harmonics)
        h += sin(uv.x * 10.0 + u_time * 1.35) * cos(uv.y * 8.0 + u_time * 1.1) * 0.025;
        h += sin(uv.x * 22.0 - u_time * 2.1 + uv.y * 16.0) * 0.015;
        h += cos(length(uv - vec2(0.5)) * 14.0 - u_time * 1.8) * 0.02;

        // Interactive dynamic ripples
        for (int i = 0; i < 8; i++) {
          vec4 rip = u_ripples[i];
          if (rip.z < 3.2 && rip.w > 0.001) {
            vec2 ripCenterAspect = vec2(rip.x * aspect, rip.y);
            float d = length(aspectUv - ripCenterAspect);
            float radius = rip.z * 0.38; // Expansion speed
            float distToWave = abs(d - radius);

            if (d < radius + 0.16) {
              float decay = exp(-rip.z * 1.65); // Decay over time
              float ringDecay = exp(-distToWave * 24.0); // Ring sharpness
              float wave = sin((d - radius) * 48.0) * ringDecay * decay;
              h += wave * rip.w * 0.12 * u_intensity;
            }
          }
        }
        return h;
      }

      void main() {
        vec2 eps = vec2(2.5 / u_resolution.x, 2.5 / u_resolution.y);

        // Sample neighboring wave heights to calculate surface normal
        float hL = calculateHeight(vUv - vec2(eps.x, 0.0));
        float hR = calculateHeight(vUv + vec2(eps.x, 0.0));
        float hD = calculateHeight(vUv - vec2(0.0, eps.y));
        float hU = calculateHeight(vUv + vec2(0.0, eps.y));

        float dx = hR - hL;
        float dy = hU - hD;
        float slope = length(vec2(dx, dy));

        // Surface normal
        vec3 normal = normalize(vec3(-dx * 28.0, -dy * 28.0, 1.0));

        // Directional Light & Specular Glint
        vec3 lightDir = normalize(vec3(0.4, 0.6, 0.85));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfVec = normalize(lightDir + viewDir);

        float NdotL = max(dot(normal, lightDir), 0.0);
        float spec = pow(max(dot(normal, halfVec), 0.0), 38.0) * 1.35;
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);

        // Procedural Caustic interference pattern
        float caustic = sin(vUv.x * 28.0 + dx * 40.0 + u_time * 1.6) * 
                        cos(vUv.y * 24.0 + dy * 40.0 + u_time * 1.4);
        caustic = pow(max(caustic, 0.0), 3.0) * 0.28;

        // Aquatic tint palette: Clean Cyan (#00E5FF) and Deep Teal (#0077B6)
        vec3 deepColor = vec3(0.0, 0.467, 0.714);   // #0077B6
        vec3 brightCyan = vec3(0.0, 0.898, 1.0);    // #00E5FF
        vec3 emerald = vec3(0.063, 0.725, 0.506);   // #10B981

        vec3 waterColor = mix(deepColor, brightCyan, slope * 4.0 + caustic);
        waterColor += emerald * (fresnel * 0.4);
        waterColor += vec3(1.0) * spec; // Specular sun reflection

        // Transparent fluid overlay: only visible where waves and highlights dance
        float alpha = clamp(slope * 3.8 + fresnel * 0.45 + spec * 0.85 + caustic * 0.6, 0.0, 0.58);

        gl_FragColor = vec4(waterColor, alpha);
      }
    `;

    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const waterPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), waterMaterial);
    scene.add(waterPlane);

    // 4. Volumetric 3D Floating Bubbles (Aeration Tank particles)
    const BUBBLE_COUNT = 36;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePositions = new Float32Array(BUBBLE_COUNT * 3);
    const bubbleScales = new Float32Array(BUBBLE_COUNT);
    const bubbleSpeeds = new Float32Array(BUBBLE_COUNT);
    const bubblePhases = new Float32Array(BUBBLE_COUNT);

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      bubblePositions[i * 3 + 0] = (Math.random() - 0.5) * 2.2; // x in [-1.1, 1.1]
      bubblePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.2; // y in [-1.1, 1.1]
      bubblePositions[i * 3 + 2] = 0.5; // z
      bubbleScales[i] = 12.0 + Math.random() * 26.0; // pixel size
      bubbleSpeeds[i] = 0.12 + Math.random() * 0.32; // rise speed
      bubblePhases[i] = Math.random() * Math.PI * 2;
    }

    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
    bubbleGeo.setAttribute("scale", new THREE.BufferAttribute(bubbleScales, 1));

    const bubbleVertexShader = `
      attribute float scale;
      varying vec2 vUv;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = scale;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const bubbleFragmentShader = `
      precision highp float;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        // Spherical rim lighting
        float rim = smoothstep(0.35, 0.49, dist);
        // Specular glint in upper-left corner
        float spec = smoothstep(0.18, 0.05, length(coord - vec2(-0.16, -0.16)));

        vec3 bubbleColor = mix(vec3(0.0, 0.898, 1.0), vec3(1.0), spec * 0.9);
        float alpha = (rim * 0.55 + spec * 0.85 + 0.12) * 0.75;

        gl_FragColor = vec4(bubbleColor, alpha);
      }
    `;

    const bubbleMaterial = new THREE.ShaderMaterial({
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const bubblesMesh = new THREE.Points(bubbleGeo, bubbleMaterial);
    scene.add(bubblesMesh);

    // 5. Responsive Resize Logic
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      renderer.setSize(width, height, false);
      uniforms.u_resolution.value.set(width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Initial ambient water splash
    setTimeout(() => {
      addRippleRef.current(0.5, 0.45, 1.4);
    }, 450);

    // 6. Animation Frame Loop (60–120 FPS GPU Render with Off-Screen Pausing)
    let animationFrameId = 0;
    let isVisible = true;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((time - lastTime) * 0.001, 0.05); // seconds
      lastTime = time;

      // Update time uniform
      uniforms.u_time.value = time * 0.001;

      // Age ripples and update uniforms array
      const currentRipples = ripplesRef.current;
      for (let i = currentRipples.length - 1; i >= 0; i--) {
        currentRipples[i].age += delta;
        if (currentRipples[i].age > 3.4) {
          currentRipples.splice(i, 1);
        }
      }

      // Populate GPU ripple array
      for (let i = 0; i < 8; i++) {
        if (i < currentRipples.length) {
          const r = currentRipples[i];
          uniforms.u_ripples.value[i].set(r.x, r.y, r.age, r.strength);
        } else {
          uniforms.u_ripples.value[i].set(0, 0, 999.0, 0.0);
        }
      }

      // Natural idle water drop every ~3.6s
      idleTimerRef.current += delta * 1000;
      if (idleTimerRef.current > 3600) {
        addRippleRef.current(
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6,
          0.85
        );
        idleTimerRef.current = 0;
      }

      // Animate floating aeration bubbles upwards
      const posAttr = bubbleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < BUBBLE_COUNT; i++) {
        const idxY = i * 3 + 1;
        const idxX = i * 3 + 0;

        posArray[idxY] += bubbleSpeeds[i] * delta;
        bubblePhases[i] += delta * 1.5;
        posArray[idxX] += Math.sin(bubblePhases[i]) * delta * 0.04;

        // Reset bubble to bottom once it passes top
        if (posArray[idxY] > 1.15) {
          posArray[idxY] = -1.15;
          posArray[idxX] = (Math.random() - 0.5) * 2.2;
        }
      }
      posAttr.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Pause WebGL rendering loop completely when off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (inView && !isVisible) {
          isVisible = true;
          lastTime = performance.now();
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(animate);
          }
        } else if (!inView && isVisible) {
          isVisible = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = 0;
          }
        }
      },
      { rootMargin: "120px" }
    );
    visibilityObserver.observe(container);

    // 7. Cleanup on Unmount
    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      scene.remove(waterPlane);
      scene.remove(bubblesMesh);
      waterPlane.geometry.dispose();
      waterMaterial.dispose();
      bubbleGeo.dispose();
      bubbleMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      className={`relative select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Three.js WebGL Mount Target */}
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* Interactive Water Status Telemetry Badge */}
      {showBadge && (
        <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-[#0A192F]/80 px-3.5 py-1.5 text-[10px] font-mono tracking-wide text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105">
          <div className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
          </div>
          <span className="hidden sm:inline text-slate-300">WebGL Fluid:</span>
          <span className="font-semibold text-[#00E5FF] flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#00E5FF]" />
            GPU Caustics & Shaders
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Trigger a high-strength central splash
              addRippleRef.current(0.5, 0.5, 2.2);
            }}
            title="Make a water splash"
            className="ml-1.5 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#0077B6]/70 hover:bg-[#0077B6] text-white transition-colors cursor-pointer"
          >
            Splash
          </button>
        </div>
      )}
    </div>
  );
};
