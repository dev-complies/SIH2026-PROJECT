"use client";

import React from "react";
import {
  Menu,
  Search,
  Command,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationCenter } from "./NotificationCenter";
import { UserMenu } from "./UserMenu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/auth/AuthContext";

export function TopNav({
  onOpenMobile,
  onOpenCommandPalette,
}: {
  onOpenMobile: () => void;
  onOpenCommandPalette: () => void;
}) {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gov-border bg-white shadow-2xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Mobile Menu Button & Breadcrumbs */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <button
            onClick={onOpenMobile}
            className="md:hidden p-2 rounded-control text-slate-600 hover:text-gov-primary hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="overflow-hidden">
            <Breadcrumbs />
          </div>
        </div>

        {/* Right Side: Global Search, Notifications, User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Global Search / Command Bar Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-control border border-gov-border bg-slate-50/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors text-xs shadow-2xs"
            title="Search Workspace (⌘K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-gov-muted" />
            <span className="hidden sm:inline text-xs text-gov-muted">
              Search workspace...
            </span>
            <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-2xs">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Operational Notifications Bell & Drawer */}
          <NotificationCenter />

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* User Profile & Role Switcher Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
