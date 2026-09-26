"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Activity,
  ExternalLink,
  Lock,
  Compass,
  Layers,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-gov-border bg-slate-900 text-slate-300">
      {/* Upper Institutional Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
              GOV
            </div>
            <span className="font-semibold text-slate-200">
              National Innovation Operating System (GovInnovate)
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-slate-400">
              Department of Urban Development • Smart Cities Mission Guidelines
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="inline-flex items-center text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              All Systems Operational (99.98% Telemetry Uptime)
            </span>
            <span className="text-slate-600">•</span>
            <span>GFR 2017 Rule 149 Aligned</span>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Organization & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm shadow-sm">
                GI
              </div>
              <div>
                <span className="font-bold text-white text-base tracking-tight">
                  GovInnovate
                </span>
                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Public Innovation Procurement OS
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An enterprise GovTech infrastructure governing the complete lifecycle from government problem definition, competitive startup onboarding, and blind evaluation to real-world pilot execution, sensor evidence validation, and direct public procurement scaling.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                ISO 27001 CERTIFIED
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                STQC AUDITED
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                GFR 2017 COMPLIANT
              </span>
            </div>
          </div>

          {/* Column 2: Role Workspaces */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Role Workspaces
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/gov/dashboard" className="hover:text-white transition-colors">
                  Government Oversight Desk
                </Link>
              </li>
              <li>
                <Link href="/procurement/dashboard" className="hover:text-white transition-colors">
                  Procurement & Treasury
                </Link>
              </li>
              <li>
                <Link href="/startup/dashboard" className="hover:text-white transition-colors">
                  Startup Innovation Console
                </Link>
              </li>
              <li>
                <Link href="/expert/dashboard" className="hover:text-white transition-colors">
                  Blind Expert Evaluation
                </Link>
              </li>
              <li>
                <Link href="/validator/dashboard" className="hover:text-white transition-colors">
                  Independent Validator Studio
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Platform Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Public Repositories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/challenges" className="hover:text-white transition-colors">
                  Active Challenge Catalog
                </Link>
              </li>
              <li>
                <Link href="/proven-solutions" className="hover:text-white transition-colors">
                  Proven Solutions Library
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-white transition-colors flex items-center">
                  GovInnovate Design System
                  <span className="ml-1.5 px-1 py-0.2 bg-blue-900/80 text-blue-300 rounded text-[9px]">v1.0</span>
                </Link>
              </li>
              <li>
                <Link href="/challenges#guidelines" className="hover:text-white transition-colors">
                  Pilot Execution Guidelines
                </Link>
              </li>
              <li>
                <Link href="/proven-solutions#standards" className="hover:text-white transition-colors">
                  CPCB / NABL Audit Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Governance & Integrity
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  General Financial Rules (GFR 2017)
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  CVC Anti-Corruption Directive
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Conflict of Interest Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Right to Information (RTI) Cell
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Cryptographic Evidence Protocol
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Whistleblower Redressal Portal
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Copyright & Legal Disclaimer */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p>
              © 2026 GovInnovate Platform. Designed and engineered for public sector transparency, empirical pilot validation, and accountable innovation procurement.
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Hosted on National Cloud Infrastructure. End-to-end TLS 1.3 encrypted with cryptographic SHA-256 evidence anchoring.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <Link href="/auth/login" className="hover:text-slate-300">
              Security Login
            </Link>
            <Link href="/design-system" className="hover:text-slate-300">
              Component Spec
            </Link>
            <span className="text-slate-600">v1.0.4-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
