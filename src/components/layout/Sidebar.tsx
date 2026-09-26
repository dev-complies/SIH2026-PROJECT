"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Compass,
  FileText,
  CheckSquare,
  Activity,
  CreditCard,
  ShieldCheck,
  Sparkles,
  BarChart3,
  FolderLock,
  ScrollText,
  Send,
  CheckCircle2,
  Building2,
  User,
  Inbox,
  Award,
  History,
  UserCheck,
  FileSearch,
  FileCheck2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

function SidebarInternal({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab") || "overview";

  // Role Navigation Menus exactly matching prompt requirements
  const getNavItems = (role?: UserRole): NavItem[] => {
    switch (role) {
      case "GOVERNMENT_OFFICER":
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/gov/dashboard?tab=overview" },
          { id: "challenges", label: "Challenges", icon: Compass, href: "/gov/dashboard?tab=challenges", badge: "4 Active" },
          { id: "applications", label: "Applications", icon: FileText, href: "/gov/dashboard?tab=applications", badge: "12 New" },
          { id: "shortlisting", label: "Shortlisting", icon: Award, href: "/gov/dashboard?tab=shortlisting", badge: "5 Candidates" },
          { id: "pilots", label: "Pilots", icon: Activity, href: "/gov/dashboard?tab=pilots", badge: "1 Live" },
          { id: "payments", label: "Payments", icon: CreditCard, href: "/gov/dashboard?tab=payments" },
          { id: "validation", label: "Validation", icon: ShieldCheck, href: "/gov/dashboard?tab=validation" },
          { id: "solutions", label: "Solutions", icon: Sparkles, href: "/gov/dashboard?tab=solutions" },
          { id: "analytics", label: "Analytics", icon: BarChart3, href: "/gov/dashboard?tab=analytics" },
          { id: "documents", label: "Documents", icon: FolderLock, href: "/gov/dashboard?tab=documents" },
          { id: "audit-log", label: "Audit Log", icon: ScrollText, href: "/gov/dashboard?tab=audit-log" },
        ];

      case "STARTUP":
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/startup/dashboard?tab=overview" },
          { id: "discover-challenges", label: "Discover Challenges", icon: Compass, href: "/startup/dashboard?tab=discover-challenges" },
          { id: "applications", label: "Applications", icon: Send, href: "/startup/dashboard?tab=applications" },
          { id: "pilots", label: "Pilots", icon: Activity, href: "/startup/dashboard?tab=pilots" },
          { id: "milestones", label: "Milestones", icon: CheckCircle2, href: "/startup/dashboard?tab=milestones", badge: "1 Due" },
          { id: "payments", label: "Payments", icon: CreditCard, href: "/startup/dashboard?tab=payments" },
          { id: "documents", label: "Documents", icon: FolderLock, href: "/startup/dashboard?tab=documents" },
          { id: "profile", label: "Profile", icon: Building2, href: "/startup/dashboard?tab=profile" },
        ];

      case "EXPERT":
      case "EXPERT_EVALUATOR":
        return [
          { id: "assignments", label: "Assignments", icon: Inbox, href: "/expert/dashboard?tab=assignments", badge: "2 New" },
          { id: "evaluations", label: "Evaluations", icon: Award, href: "/expert/dashboard?tab=evaluations" },
          { id: "history", label: "History", icon: History, href: "/expert/dashboard?tab=history" },
          { id: "profile", label: "Profile", icon: UserCheck, href: "/expert/dashboard?tab=profile" },
        ];

      case "VALIDATOR":
      case "INDEPENDENT_VALIDATOR":
        return [
          { id: "assigned-pilots", label: "Assigned Pilots", icon: Activity, href: "/validator/dashboard?tab=assigned-pilots", badge: "1 Active" },
          { id: "evidence", label: "Evidence", icon: FileSearch, href: "/validator/dashboard?tab=evidence" },
          { id: "validation", label: "Validation", icon: ShieldCheck, href: "/validator/dashboard?tab=validation" },
          { id: "reports", label: "Reports", icon: FileText, href: "/validator/dashboard?tab=reports" },
        ];

      case "ADMIN":
      case "PLATFORM_ADMIN":
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard?tab=overview" },
          { id: "users", label: "Users", icon: Users, href: "/admin/dashboard?tab=users" },
          { id: "departments", label: "Departments", icon: Building2, href: "/admin/dashboard?tab=departments" },
          { id: "challenges", label: "Challenges", icon: Compass, href: "/admin/dashboard?tab=challenges" },
          { id: "system-configuration", label: "System Configuration", icon: Settings, href: "/admin/dashboard?tab=system-configuration" },
          { id: "audit-logs", label: "Audit Logs", icon: ScrollText, href: "/admin/dashboard?tab=audit-logs" },
        ];

      case "PROCUREMENT_OFFICER":
      default:
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/procurement/dashboard?tab=overview" },
          { id: "pilots", label: "Pilots", icon: Activity, href: "/procurement/dashboard?tab=pilots" },
          { id: "milestones", label: "Milestones", icon: CheckCircle2, href: "/procurement/dashboard?tab=milestones" },
          { id: "payments", label: "Payments", icon: CreditCard, href: "/procurement/dashboard?tab=payments", badge: "Action" },
          { id: "contracts", label: "Contracts", icon: FileCheck2, href: "/procurement/dashboard?tab=contracts" },
          { id: "audit-log", label: "Audit Log", icon: ScrollText, href: "/procurement/dashboard?tab=audit-log" },
        ];
    }
  };

  const navItems = getNavItems(currentUser?.role);

  const getWorkspaceTitle = (role?: UserRole) => {
    switch (role) {
      case "GOVERNMENT_OFFICER":
        return "Government Desk";
      case "STARTUP":
        return "Startup Console";
      case "EXPERT":
        return "Expert Review";
      case "VALIDATOR":
        return "Validator Studio";
      case "ADMIN":
        return "System Admin";
      case "PROCUREMENT_OFFICER":
        return "Procurement & Treasury";
      default:
        return "Workspace";
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand & Department Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <Link href="/" className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-extrabold text-white text-xs shrink-0 shadow-sm">
              GI
            </div>
            {!isCollapsed && (
              <div className="truncate text-left">
                <span className="font-extrabold text-white text-sm tracking-tight block">
                  GovInnovate
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                  {getWorkspaceTitle(currentUser?.role)}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge Indicator */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400 uppercase text-[10px]">
              ROLE CONTEXT
            </span>
            <Badge
              variant="outline"
              className="text-[9px] font-mono border-blue-500/40 text-blue-300 bg-blue-950/40 px-1.5 py-0"
            >
              {currentUser?.role?.replace("_", " ")}
            </Badge>
          </div>
        )}

        {/* Navigation Item List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center justify-between px-3 py-2 rounded-control text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      isActive
                        ? "bg-blue-800 text-blue-100"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Information & Collapse Toggle */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!isCollapsed && (
          <div className="px-2 py-1.5 rounded bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Node UP-01 Online
            </span>
            <span className="font-mono text-slate-500">v1.0.4</span>
          </div>
        )}

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex w-full items-center justify-center p-2 rounded-control text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center space-x-2 text-[11px]">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 z-30 sticky top-0 h-screen ${
          isCollapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<aside className="hidden md:block w-64 bg-slate-900 shrink-0" />}>
      <SidebarInternal {...props} />
    </Suspense>
  );
}
