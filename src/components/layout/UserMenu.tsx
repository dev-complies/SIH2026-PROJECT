"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle2,
  ChevronDown,
  LogOut,
  Shield,
  Layers,
  ArrowRightLeft,
  Building2,
  User,
  Check,
} from "lucide-react";

export function UserMenu() {
  const router = useRouter();
  const { currentUser, switchRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const roleOptions: Array<{ role: UserRole; name: string; title: string; route: string }> = [
    { role: "GOVERNMENT_OFFICER", name: "Rajesh Verma", title: "Joint Director, Urban Dev", route: "/gov/dashboard" },
    { role: "STARTUP", name: "Aarav Sharma", title: "CEO, AirSense AI", route: "/startup/dashboard" },
    { role: "PROCUREMENT_OFFICER", name: "Sunita Deshmukh", title: "Chief Procurement Officer", route: "/procurement/dashboard" },
    { role: "EXPERT", name: "Dr. Alok Gupta", title: "IIT Kanpur Evaluator", route: "/expert/dashboard" },
    { role: "VALIDATOR", name: "Priya Nair", title: "TERI Senior Auditor", route: "/validator/dashboard" },
    { role: "ADMIN", name: "Sanjay Mehta", title: "Platform Administrator", route: "/admin/dashboard" },
  ];

  const handleRoleSelect = (role: UserRole, targetRoute: string) => {
    switchRole(role);
    setIsOpen(false);
    router.push(targetRoute);
  };

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : "GI";

  const getRoleBadgeVariant = (role?: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "GOVERNMENT_OFFICER":
        return "default";
      case "STARTUP":
        return "outline";
      case "EXPERT":
        return "warning";
      case "VALIDATOR":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 p-1.5 rounded-control hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gov-accent text-left"
        aria-label="User Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="h-8 w-8 rounded-full bg-gov-primary text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-300 shadow-2xs font-mono" aria-hidden="true">
          {initials}
        </div>

        <div className="hidden lg:block leading-tight">
          <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
            {currentUser?.firstName} {currentUser?.lastName}
          </div>
          <div className="text-[10px] text-gov-muted truncate max-w-[130px]">
            {currentUser?.role?.replace("_", " ")}
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-card border border-gov-border bg-white shadow-xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
          {/* User Profile Header */}
          <div className="p-3.5 bg-slate-50/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-slate-900">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <Badge variant={getRoleBadgeVariant(currentUser?.role) as any} className="text-[9px] font-mono">
                {currentUser?.role}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">{currentUser?.designation}</p>
            <p className="text-[10px] text-gov-muted font-mono mt-0.5">{currentUser?.email}</p>
          </div>

          {/* Quick Role Switcher */}
          <div className="p-2 space-y-1">
            <div className="flex items-center space-x-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-gov-muted font-bold">
              <ArrowRightLeft className="w-3 h-3 text-gov-accent" />
              <span>Simulate Role (RBAC Testing)</span>
            </div>

            <div className="space-y-0.5 max-h-48 overflow-y-auto">
              {roleOptions.map((opt) => {
                const isSelected = currentUser?.role === opt.role;
                return (
                  <button
                    key={opt.role}
                    onClick={() => handleRoleSelect(opt.role, opt.route)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-control text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-gov-primary font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <span className="block leading-tight">{opt.name}</span>
                      <span className="text-[10px] text-gov-muted block leading-tight">
                        {opt.title}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-gov-accent shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Links */}
          <div className="p-2 text-xs space-y-0.5">
            <Link
              href="/design-system"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-2.5 py-1.5 rounded-control text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>Design System Spec</span>
            </Link>

            <Link
              href="/challenges"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-2.5 py-1.5 rounded-control text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>Public Challenges</span>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center px-2.5 py-1.5 rounded-control text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
