"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWebGLSupport, useMediaQuery } from "@/hooks";
import { cn } from "@/utils";
import { RotateCcw, Pause, Play, Maximize2, Minimize2, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";

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
  const [force2DFallback, setForce2DFallback] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

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
        setPrefersReducedMotion(true);
      }
      const listener = (e: MediaQueryListEvent) => {
        setIsPaused(e.matches);
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
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

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "p" || e.key === "P") {
      setIsPaused((prev) => !prev);
    } else if (e.key === "r" || e.key === "R") {
      setResetKey((prev) => prev + 1);
    } else if (e.key === "f" || e.key === "F") {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Loading skeleton state
  if (!mounted) {
    return (
      <div
        className={cn(
          "w-full rounded-card bg-slate-950 border border-slate-800 flex items-center justify-center p-6 text-slate-400 font-mono text-xs",
          height,
          className
        )}
      >
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          <span>Initializing Spatial Environment...</span>
        </div>
      </div>
    );
  }

  // Graceful fallback for non-WebGL, mobile screens, WebGL crash, or explicit user preference
  if (!isWebGL || isMobile || force2DFallback || webGLError) {
    return (
      <div className={cn("w-full relative", className)}>
        {/* Toggle back to 3D button if user manually forced 2D on desktop */}
        {force2DFallback && isWebGL && !isMobile && (
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => setForce2DFallback(false)}
              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-900/90 text-blue-300 border border-blue-500/60 shadow hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <Eye className="w-3 h-3" />
              <span>Switch to 3D View</span>
            </button>
          </div>
        )}
        {fallback}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={title}
      aria-roledescription="Interactive 3D visualization"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative w-full rounded-card overflow-hidden border border-slate-800 bg-slate-950 shadow-xl transition-all select-none focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        isFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : height,
        className
      )}
    >
      {/* Screen Reader Accessible Announcement */}
      <div className="sr-only">
        <h4>{title}</h4>
        {subtitle && <p>{subtitle}</p>}
        <p>
          This is an interactive 3D spatial visualization. Press P to pause rotation, R to reset camera,
          and F to toggle fullscreen. You can also switch to the accessible 2D vector schematic using the
          control buttons.
        </p>
      </div>

      {/* Top Left Spatial Title Header */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none text-left">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/60 backdrop-blur-xs">
            {badgeText}
          </span>
          {prefersReducedMotion && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-950/70 text-amber-300 border border-amber-700/50">
              Reduced Motion Active
            </span>
          )}
        </div>
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
        {/* Toggle 2D Accessible View */}
        <button
          onClick={() => setForce2DFallback(true)}
          title="Switch to accessible 2D vector schematic"
          aria-label="Switch to accessible 2D vector schematic"
          className="p-1.5 rounded-control bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-xs transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>

        {/* Play / Pause Rotation */}
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          title={isPaused ? "Resume subtle movement (Key: P)" : "Pause movement (Key: P)"}
          aria-label={isPaused ? "Resume subtle movement" : "Pause movement"}
          className="p-1.5 rounded-control bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-xs transition-colors"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Camera View */}
        <button
          onClick={() => setResetKey((prev) => prev + 1)}
          title="Reset camera view (Key: R)"
          aria-label="Reset camera view"
          className="p-1.5 rounded-control bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen View */}
        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          title={isFullscreen ? "Exit full view (Key: F)" : "Full view (Key: F)"}
          aria-label={isFullscreen ? "Exit full view" : "Full view"}
          className="p-1.5 rounded-control bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-xs transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Render 3D Canvas only when in view */}
      {isInView && (
        <div className="w-full h-full">
          {children({ isPaused, resetKey })}
        </div>
      )}
    </div>
  );
}
