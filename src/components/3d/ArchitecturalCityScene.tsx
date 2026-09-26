"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FallbackCitySchematic } from "./FallbackCitySchematic";
import { useWebGLSupport } from "@/hooks";

// Dynamically import Three.js Canvas to ensure zero SSR hydration issues
const ThreeCityCanvas = dynamic(
  () => import("./ThreeCityCanvas").then((mod) => mod.ThreeCityCanvas),
  {
    ssr: false,
    loading: () => <FallbackCitySchematic />,
  }
);

export function ArchitecturalCityScene() {
  const [mounted, setMounted] = useState(false);
  const isWebGL = useWebGLSupport();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isWebGL) {
    return <FallbackCitySchematic />;
  }

  return (
    <div className="relative w-full h-[460px] rounded-card overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
      <ThreeCityCanvas />
      
      {/* Floating Spatial HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/60 backdrop-blur-sm">
          SPATIAL ECOSYSTEM VIEW
        </span>
        <h3 className="text-white font-semibold text-sm mt-1 drop-shadow">
          Lucknow Municipal Infrastructure Grid
        </h3>
        <p className="text-[11px] text-slate-400 drop-shadow">
          Interactive 3D model • Drag to inspect • Click glowing nodes
        </p>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-control px-3 py-1.5 backdrop-blur-sm text-right">
          <span className="text-[10px] text-slate-400 block font-mono">ACTIVE PILOT TELEMETRY</span>
          <span className="text-xs font-semibold text-emerald-400 font-mono">
            40 Nodes Online (94.0% Uptime)
          </span>
        </div>
      </div>
    </div>
  );
}
