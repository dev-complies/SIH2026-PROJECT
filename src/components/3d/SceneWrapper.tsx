"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWebGLSupport, useMediaQuery } from "@/hooks";
import { cn } from "@/utils";
import { RotateCcw, Pause, Play, Maximize2, Minimize2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SceneWrapperProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  fallback: React.ReactNode;
  height?: string;
  children: (props: { isPaused: boolean; resetKey: number }) => React.ReactNode;
  className?: string;
}

export function SceneWrapper({
  title,
  subtitle,
  badgeText = "SPATIAL 3D VIEW",
  fallback,
  height = "h-[460px]",
  children,
  className,
}: SceneWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInView, setIsInView] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const isWebGL = useWebGLSupport();
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Check prefers-reduced-motion
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsPaused(true);
      }
    }
  }, []);

  // Performance optimization: Pause rendering when out of viewport
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return <div className={cn("w-full rounded-card bg-slate-950", height, className)}>{fallback}</div>;
  }

  if (!isWebGL || isMobile) {
    return (
      <div className={cn("w-full", className)}>
        {fallback}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full rounded-card overflow-hidden border border-slate-800 bg-slate-950 shadow-xl transition-all select-none",
        isFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : height,
        className
      )}
    >
      {/* Top Left Spatial Title Header */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/60 backdrop-blur-xs">
          {badgeText}
        </span>
        <h3 className="text-white font-bold text-sm mt-1 drop-shadow-md">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-slate-400 drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>

      {/* Top Right Controls HUD */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5">
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          title={isPaused ? "Resume subtle movement" : "Pause movement"}
          className="p-1.5 rounded-control bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-xs transition-colors"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setResetKey((prev) => prev + 1)}
          title="Reset camera view"
          className="p-1.5 rounded-control bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          title={isFullscreen ? "Exit full view" : "Full view"}
          className="p-1.5 rounded-control bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-xs transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Render 3D Canvas only when in view */}
      {isInView && children({ isPaused, resetKey })}
    </div>
  );
}
