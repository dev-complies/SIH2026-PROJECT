"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  LayoutDashboard,
  Compass,
  FileText,
  Activity,
  Award,
  ShieldCheck,
  Building2,
  Users,
  Settings,
  ArrowRight,
  Sparkles,
  Layers,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/auth/AuthContext";
import { UserRole } from "@/types";

interface CommandItem {
  id: string;
  category: "Navigation" | "Challenges" | "Pilots" | "Startups" | "Actions";
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  badge?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { switchRole } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-gov",
      category: "Navigation",
      title: "Government Oversight Desk",
      subtitle: "/gov/dashboard • Problem formulation & pilot oversight",
      icon: LayoutDashboard,
      href: "/gov/dashboard",
      badge: "GOV",
    },
    {
      id: "nav-startup",
      category: "Navigation",
      title: "Startup Innovation Console",
      subtitle: "/startup/dashboard • Milestone deliverables & invoices",
      icon: Building2,
      href: "/startup/dashboard",
      badge: "STARTUP",
    },
    {
      id: "nav-expert",
      category: "Navigation",
      title: "Blind Expert Evaluation Suite",
      subtitle: "/expert/dashboard • Scoring rubrics & COI declarations",
      icon: Award,
      href: "/expert/dashboard",
      badge: "EXPERT",
    },
    {
      id: "nav-validator",
      category: "Navigation",
      title: "Independent Validator Studio",
      subtitle: "/validator/dashboard • Collocated sensor verification",
      icon: ShieldCheck,
      href: "/validator/dashboard",
      badge: "VALIDATOR",
    },
    {
      id: "nav-procurement",
      category: "Navigation",
      title: "Procurement & Treasury Desk",
      subtitle: "/procurement/dashboard • GFR 149 & escrow releases",
      icon: Layers,
      href: "/procurement/dashboard",
      badge: "PROCUREMENT",
    },
    {
      id: "nav-admin",
      category: "Navigation",
      title: "Platform Administration",
      subtitle: "/admin/dashboard • Users, roles & system config",
      icon: Settings,
      href: "/admin/dashboard",
      badge: "ADMIN",
    },
    {
      id: "nav-challenges",
      category: "Navigation",
      title: "Public Challenge Catalog",
      subtitle: "/challenges • Browse 42 state & municipal problem statements",
      icon: Compass,
      href: "/challenges",
    },
    {
      id: "nav-proven",
      category: "Navigation",
      title: "Proven Solutions Library",
      subtitle: "/proven-solutions • Vetted technologies ready for public procurement",
      icon: Sparkles,
      href: "/proven-solutions",
    },
    {
      id: "nav-design",
      category: "Navigation",
      title: "GovInnovate Design System",
      subtitle: "/design-system • UI foundations, tokens, and 3D suite",
      icon: Layers,
      href: "/design-system",
    },

    // Challenges
    {
      id: "chal-1",
      category: "Challenges",
      title: "Urban Air Quality Hyperlocal Mesh",
      subtitle: "CHAL-UP-DUD-001 • Dept of Urban Development • ₹25.0L",
      icon: Compass,
      href: "/challenges",
      badge: "PILOT ACTIVE",
    },
    {
      id: "chal-2",
      category: "Challenges",
      title: "Adaptive AI Traffic Signal Optimization",
      subtitle: "CHAL-UP-DUT-002 • Kanpur Directorate of Transport • ₹35.0L",
      icon: Compass,
      href: "/challenges",
      badge: "OPEN",
    },
    {
      id: "chal-3",
      category: "Challenges",
      title: "Deep-Learning Optical Dry Waste Sorter",
      subtitle: "CHAL-UP-SWM-003 • Noida Authority • ₹20.0L",
      icon: Compass,
      href: "/challenges",
      badge: "EVALUATION",
    },

    // Pilots
    {
      id: "pilot-1",
      category: "Pilots",
      title: "PILOT-UP-UAQ-01: Lucknow Air Quality",
      subtitle: "AirSense Technologies • 75% Completed • 95.0% Accuracy",
      icon: Activity,
      href: "/gov/dashboard?tab=pilots",
      badge: "ACTIVE",
    },
    {
      id: "pilot-2",
      category: "Pilots",
      title: "PILOT-UP-TRAFFIC-02: Kanpur Corridor",
      subtitle: "OptiFlow AI • 90% Completed • -28% Congestion",
      icon: Activity,
      href: "/proven-solutions",
      badge: "VALIDATED",
    },

    // Actions
    {
      id: "act-switch-gov",
      category: "Actions",
      title: "Switch Role: Government Officer",
      subtitle: "Simulate Rajesh Verma (Joint Director, Urban Dev)",
      icon: Users,
      action: () => switchRole("GOVERNMENT_OFFICER"),
    },
    {
      id: "act-switch-startup",
      category: "Actions",
      title: "Switch Role: Startup Innovator",
      subtitle: "Simulate Aarav Sharma (AirSense Technologies)",
      icon: Users,
      action: () => switchRole("STARTUP"),
    },
    {
      id: "act-switch-expert",
      category: "Actions",
      title: "Switch Role: Expert Evaluator",
      subtitle: "Simulate Dr. Alok Gupta (IIT Kanpur)",
      icon: Users,
      action: () => switchRole("EXPERT"),
    },
  ];

  const filtered = items.filter((item) => {
    const text = (item.title + " " + item.subtitle + " " + item.category).toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-2xl rounded-card border border-gov-border bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-left"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-gov-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, challenge name, pilot, or role..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-gov-muted focus:outline-none"
          />
          <div className="flex items-center space-x-2 shrink-0">
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono text-slate-600">
              ESC to close
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-gov-muted">
              No matching commands or resources found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-control cursor-pointer transition-colors text-xs ${
                    isSelected ? "bg-blue-50/90 text-gov-primary" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div
                      className={`p-1.5 rounded-md shrink-0 ${
                        isSelected ? "bg-gov-primary text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-gov-muted truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2 text-[10px] text-gov-muted font-mono">
                    <span className="hidden sm:inline">{item.category}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-[11px] text-gov-muted">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-200 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-slate-200 font-mono text-[10px] ml-0.5">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-[10px]">↵</kbd> Select
            </span>
          </div>

          <span className="font-mono text-[10px] text-slate-500">
            GovInnovate Command OS v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
