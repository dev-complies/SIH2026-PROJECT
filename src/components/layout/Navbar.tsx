"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  LogOut,
  UserCircle2,
  ArrowRightLeft,
  LayoutDashboard,
  Search,
  Menu,
  X,
  Compass,
  Sparkles,
  BarChart3,
  Bell,
  ScrollText,
  Layers,
  ChevronRight,
} from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { cn } from "@/utils";

export function Navbar({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void } = {}) {
  const { currentUser, switchRole, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const publicNavLinks = [
    { label: "Public Home", href: "/" },
    { label: "Challenges", href: "/challenges" },
    { label: "Proven Solutions", href: "/proven-solutions" },
    { label: "Analytics", href: "/analytics" },
    { label: "Audit Ledger", href: "/audit-logs" },
    { label: "Design System", href: "/design-system" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gov-border bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-control text-slate-600 hover:text-gov-primary hover:bg-slate-100 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-gov-primary text-white shadow-sm font-bold text-xs sm:text-sm">
              GI
            </div>
            <div>
              <span className="font-bold text-gov-primary text-sm sm:text-base tracking-tight block">
                GovInnovate
              </span>
              <span className="hidden sm:block text-[9px] uppercase font-semibold text-gov-muted tracking-wider">
                Innovation Procurement OS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4 text-xs font-semibold text-slate-600">
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
              href="/design-system"
              className={`hover:text-gov-primary transition-colors ${
                pathname === "/design-system" ? "text-gov-primary font-bold" : ""
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
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Persona Switcher for Desktop */}
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
            <Badge variant="secondary" className="text-[10px] sm:text-[11px] font-mono font-semibold truncate max-w-[100px] sm:max-w-none">
              {currentUser.role}
            </Badge>
          )}

          {/* Contextual Notification Center */}
          <NotificationCenter />

          {/* User Profile Info */}
          {currentUser ? (
            <div className="flex items-center space-x-2 sm:space-x-3 border-l border-slate-200 pl-2 sm:pl-3">
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gov-text leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-[10px] text-gov-muted truncate max-w-[110px]">
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
              <Button size="sm" variant="default" className="bg-gov-primary text-xs h-8">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-Out Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10 text-left">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-gov-primary text-white font-bold text-xs">
                  GI
                </div>
                <span className="font-extrabold text-gov-primary text-sm">
                  GovInnovate
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-control text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Switcher in Mobile Drawer */}
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <span className="text-[10px] font-mono text-gov-muted block uppercase mb-1">
                DEMO PERSONA SWITCHER
              </span>
              <select
                value={currentUser?.role || "GOVERNMENT_OFFICER"}
                onChange={(e) => {
                  switchRole(e.target.value as UserRole);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-xs font-semibold p-1.5 bg-white border border-slate-300 rounded text-gov-primary"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.role} value={opt.role}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs font-medium">
              {currentUser && (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded bg-blue-50 text-gov-primary font-bold mb-2 border border-blue-200"
                >
                  <span className="flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-gov-accent" />
                    My Workspace Desk
                  </span>
                  <ChevronRight className="w-4 h-4 text-gov-accent" />
                </Link>
              )}

              {publicNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded transition-colors",
                    pathname === item.href
                      ? "bg-slate-100 text-gov-primary font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-gov-primary"
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}

              {onOpenCommandPalette && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCommandPalette();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded text-slate-700 hover:bg-slate-50 text-left"
                >
                  <span className="flex items-center">
                    <Search className="w-4 h-4 mr-2 text-slate-400" />
                    Search Workspace
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono border">⌘K</kbd>
                </button>
              )}
            </div>

            {/* User Logout in Mobile Drawer */}
            {currentUser && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-[10px] text-gov-muted truncate max-w-[150px]">
                    {currentUser.email}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs h-7 text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
