"use client";

import React from "react";
import { Activity, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";

/**
 * High-performance, accessible 2D architectural SVG schematic.
 * Serves as the immediate fallback when WebGL is disabled or on mobile devices.
 */
export function FallbackCitySchematic() {
  return (
    <div className="relative w-full h-[420px] rounded-card bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38BDF8 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50 mb-2">
            <Activity className="w-3 h-3 mr-1" /> Public Innovation Network
          </span>
          <h4 className="text-white font-semibold text-base">
            Municipal Infrastructure & Pilot Telemetry Grid
          </h4>
          <p className="text-xs text-slate-400">
            Real-time geospatial connectivity across municipal innovation nodes
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
            LKO-PILOT-01 ACTIVE
          </span>
        </div>
      </div>

      {/* Stylized Vector Pipeline Flow */}
      <div className="relative z-10 my-auto grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
        <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-control text-left">
          <span className="text-xs font-mono text-slate-400">STAGE 01</span>
          <p className="text-xs font-semibold text-white mt-1">Gov Problem</p>
          <p className="text-xs text-slate-300">Urban Air Monitoring</p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-control text-left">
          <span className="text-xs font-mono text-slate-400">STAGE 02</span>
          <p className="text-xs font-semibold text-white mt-1">Startup Solution</p>
          <p className="text-xs text-slate-300">AirSense Tech Mesh</p>
        </div>
        <div className="bg-blue-950/60 border border-blue-600/80 p-3 rounded-control text-left shadow-sm shadow-blue-500/10">
          <span className="text-xs font-mono text-blue-400 font-semibold">STAGE 03 • ACTIVE</span>
          <p className="text-xs font-semibold text-white mt-1">90-Day Pilot</p>
          <p className="text-xs text-blue-200">Lucknow 4 Wards (40 Nodes)</p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-control text-left">
          <span className="text-xs font-mono text-slate-400">STAGE 04</span>
          <p className="text-xs font-semibold text-white mt-1">Validation</p>
          <p className="text-xs text-slate-300">TERI Audit Verified</p>
        </div>
        <div className="bg-emerald-950/60 border border-emerald-600/80 p-3 rounded-control text-left">
          <span className="text-xs font-mono text-emerald-400 font-semibold">STAGE 05</span>
          <p className="text-xs font-semibold text-white mt-1">Scale-Up</p>
          <p className="text-xs text-emerald-200">City-Wide Procurement</p>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <span className="flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-blue-400" /> Lucknow Wards 14, 18, 22, 29
        </span>
        <span className="font-mono text-slate-300 text-xs">
          Sensor Fleet Uptime: <strong className="text-emerald-400">94.0%</strong> | Accuracy: <strong className="text-emerald-400">95.0%</strong>
        </span>
      </div>
    </div>
  );
}
