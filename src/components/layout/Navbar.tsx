"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, UserCircle2, ArrowRightLeft, LayoutDashboard, Search } from "lucide-react";

export function Navbar({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void } = {}) {
  const { currentUser, switchRole, logout } = useAuth();
  const pathname = usePathname();

  const roleOptions: Array<{ role: UserRole; label: string }> = [
    { role: "ADMIN", label: "Super Admin (Sanjay Mehta)" },
    { role: "GOVERNMENT_OFFICER", label: "Gov Officer (Rajesh Verma)" },
    { role: "PROCUREMENT_OFFICER", label: "Procurement (Sunita Deshmukh)" },
    { role: "STARTUP", label: "Startup (Aarav Sharma)" },
    { role: "EXPERT", label: "Expert Evaluator (Dr. Gupta)" },
    { role: "VALIDATOR", label: "Validator (Priya Nair)" },
  ];

  // Derive active workspace link based on current role
  const getRoleDashboardLink = (role?: UserRole): string => {
    switch (role) {
      case "ADMIN":
      case "PLATFORM_ADMIN":
        return "/admin/dashboard";
      case "GOVERNMENT_OFFICER":
        return "/gov/dashboard";
      case "PROCUREMENT_OFFICER":
        return "/procurement/dashboard";
      case "STARTUP":
        return "/startup/dashboard";
      case "EXPERT":
      case "EXPERT_EVALUATOR":
        return "/expert/dashboard";
      case "VALIDATOR":
      case "INDEPENDENT_VALIDATOR":
        return "/validator/dashboard";
      default:
        return "/auth/login";
    }
  };

  const dashboardHref = getRoleDashboardLink(currentUser?.role);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gov-border bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gov-primary text-white shadow-sm font-bold text-sm">
              GI
            </div>
            <div>
              <span className="font-bold text-gov-primary text-base tracking-tight">
                GovInnovate
              </span>
              <span className="block text-[10px] uppercase font-semibold text-gov-muted tracking-wider">
                Innovation Procurement OS
              </span>
            </div>
          </Link>

          {/* Role-Aware Navigation Bar */}
          <nav className="hidden md:flex items-center space-x-4 text-xs font-semibold text-slate-600">
            <Link
              href="/"
              className={`hover:text-gov-primary transition-colors ${
                pathname === "/" ? "text-gov-primary font-bold" : ""
              }`}
            >
              Public Home
            </Link>

            {currentUser && (
              <Link
                href={dashboardHref}
                className={`flex items-center hover:text-gov-primary transition-colors ${
                  pathname.includes("/dashboard") ? "text-gov-accent font-bold" : ""
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
                My Workspace
              </Link>
            )}

            <Link
              href="/challenges"
              className={`hover:text-gov-primary transition-colors ${
                pathname.startsWith("/challenges") ? "text-gov-primary font-bold" : ""
              }`}
            >
              Challenges
            </Link>

            <Link
              href="/proven-solutions"
              className={`hover:text-gov-primary transition-colors ${
                pathname.startsWith("/proven-solutions") ? "text-gov-primary font-bold" : ""
              }`}
            >
              Proven Solutions
            </Link>

            <Link
              href="/analytics"
              className={`hover:text-gov-primary transition-colors ${
                pathname.startsWith("/analytics") ? "text-gov-primary font-bold" : ""
              }`}
            >
              Analytics
            </Link>

            <Link
              href="/audit-logs"
              className={`hover:text-gov-primary transition-colors ${
                pathname.startsWith("/audit-logs") ? "text-gov-primary font-bold" : ""
              }`}
            >
              Audit Logs
            </Link>

            <Link
              href="/design-system"
              className={`hover:text-gov-primary transition-colors ${
                pathname === "/design-system" ? "text-gov-accent font-bold" : ""
              }`}
            >
              Design System
            </Link>

            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center space-x-1 px-2 py-1 rounded-control bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-600 transition-colors"
                title="Search Workspace (⌘K)"
              >
                <Search className="w-3 h-3 text-gov-muted" />
                <span className="text-[11px] text-slate-500">Search</span>
                <kbd className="px-1 py-0.2 rounded bg-white text-[9px] font-mono border border-slate-200 text-slate-500">⌘K</kbd>
              </button>
            )}
          </nav>
        </div>

        {/* Demo Persona Switcher & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Quick Persona Switcher for Live Testing */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-control px-2.5 py-1 space-x-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-gov-muted" />
            <span className="text-xs text-gov-muted font-medium">Switch Persona:</span>
            <select
              value={currentUser?.role || "GOVERNMENT_OFFICER"}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-gov-primary focus:outline-none cursor-pointer"
            >
              {roleOptions.map((opt) => (
                <option key={opt.role} value={opt.role}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role Badge */}
          {currentUser && (
            <Badge variant="secondary" className="text-[11px] font-mono font-semibold">
              {currentUser.role}
            </Badge>
          )}

          {/* User Profile Info */}
          {currentUser ? (
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-3">
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gov-text leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-[10px] text-gov-muted truncate max-w-[130px]">
                  {currentUser.designation || currentUser.role}
                </p>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-control text-slate-400 hover:text-gov-danger hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" variant="default" className="bg-gov-primary">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
