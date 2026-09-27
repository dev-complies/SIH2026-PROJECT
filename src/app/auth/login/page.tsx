"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { DEMO_USERS, DemoUserAccount } from "@/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Building2,
  Rocket,
  Award,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface RoleCardConfig {
  role: "GOVERNMENT_OFFICER" | "STARTUP" | "EXPERT" | "VALIDATOR";
  label: string;
  badgeLabel: string;
  icon: any;
  colorBorder: string;
  colorBg: string;
  badgeClass: string;
  targetPath: string;
  demoUser: DemoUserAccount;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { login, loginAsDemoUser } = useAuth();
  const [email, setEmail] = useState("officer@urban.gov.in");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"demo" | "credentials">("demo");

  // The 4 Core Demonstration Personas
  const primaryPersonas: RoleCardConfig[] = [
    {
      role: "GOVERNMENT_OFFICER",
      label: "Government Officer",
      badgeLabel: "Policy & Procurement",
      icon: Building2,
      colorBorder: "border-blue-200 hover:border-blue-500",
      colorBg: "bg-blue-50/40 hover:bg-blue-50/80",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      targetPath: "/gov/dashboard",
      demoUser: DEMO_USERS[1], // Rajesh Verma
    },
    {
      role: "STARTUP",
      label: "Startup Founder",
      badgeLabel: "DPIIT Recognized",
      icon: Rocket,
      colorBorder: "border-emerald-200 hover:border-emerald-500",
      colorBg: "bg-emerald-50/40 hover:bg-emerald-50/80",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      targetPath: "/challenges",
      demoUser: DEMO_USERS[3], // Aarav Sharma
    },
    {
      role: "EXPERT",
      label: "Independent Expert",
      badgeLabel: "Technical Scorer",
      icon: Award,
      colorBorder: "border-amber-200 hover:border-amber-500",
      colorBg: "bg-amber-50/40 hover:bg-amber-50/80",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      targetPath: "/expert/evaluations",
      demoUser: DEMO_USERS[4], // Dr. Alok Gupta
    },
    {
      role: "VALIDATOR",
      label: "3rd-Party Validator",
      badgeLabel: "Auditor (TERI)",
      icon: ShieldCheck,
      colorBorder: "border-purple-200 hover:border-purple-500",
      colorBg: "bg-purple-50/40 hover:bg-purple-50/80",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
      targetPath: "/validator/dashboard",
      demoUser: DEMO_USERS[5], // Priya Nair
    },
  ];

  const handleSelectDemoUser = async (demoUser: DemoUserAccount, defaultPath: string) => {
    setError(null);
    setLoading(true);

    const res = await login(demoUser.email, demoUser.password);
    setLoading(false);

    if (res.success) {
      const destination = redirectPath !== "/" ? redirectPath : defaultPath;
      router.push(destination);
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirectPath);
    } else {
      setError(res.error || "Login failed. Ensure valid demo credentials.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6 space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-gov-primary mb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>SIH 2026 Live Hackathon Demonstration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          GovInnovate Authentication Portal
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted max-w-xl mx-auto">
          Role-governed statutory procurement and pilot operations. Select a verified persona below to enter instant demonstration mode.
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-gov-border shadow-sm overflow-hidden">
        {/* Toggle Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("demo")}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 flex items-center justify-center space-x-2 ${
              activeTab === "demo"
                ? "border-gov-primary bg-white text-gov-primary shadow-2xs"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1-Click Live Demo Personas (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 flex items-center justify-center space-x-2 ${
              activeTab === "credentials"
                ? "border-gov-primary bg-white text-gov-primary shadow-2xs"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Standard Credentials Login</span>
          </button>
        </div>

        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-control flex items-center space-x-2 text-xs text-gov-danger">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "demo" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Demo Account to Enter System:
                </span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  All accounts pre-authorized
                </span>
              </div>

              {/* 4 Demo Roles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {primaryPersonas.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.role}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${p.colorBorder} ${p.colorBg}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-white shadow-2xs border border-slate-200">
                              <Icon className="w-4 h-4 text-gov-primary" />
                            </div>
                            <span className="text-xs font-bold text-slate-900">
                              {p.label}
                            </span>
                          </div>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-medium ${p.badgeClass}`}>
                            {p.badgeLabel}
                          </Badge>
                        </div>

                        <div>
                          <div className="text-sm font-bold text-gov-primary">
                            {p.demoUser.firstName} {p.demoUser.lastName}
                          </div>
                          <div className="text-xs text-slate-600 leading-snug line-clamp-1">
                            {p.demoUser.designation}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-1">
                            {p.demoUser.email}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => handleSelectDemoUser(p.demoUser, p.targetPath)}
                        disabled={loading}
                        size="sm"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-2xs"
                      >
                        <span>Enter as {p.label.split(" ")[0]}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Quick Launch Complete Demo Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Presenting live to judges?</span> Use the floating demonstration dock on any screen to advance through the 12 steps.
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full sm:w-auto shrink-0 border-blue-300 text-gov-primary hover:bg-blue-50 text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  <span>Start 12-Step Tour at Step 1</span>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gov-muted" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@urban.gov.in"
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gov-muted" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9 text-xs font-mono"
                    required
                  />
                </div>
                <div className="text-[11px] text-slate-500 pt-0.5">
                  Default demo password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">Password123!</code>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gov-primary hover:bg-gov-primary-hover font-semibold text-xs"
              >
                {loading ? "Authenticating..." : "Sign In to Portal"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center justify-center">
          <p className="text-xs text-gov-muted flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authorized access only. All actions are cryptographically sealed into the tamper-evident audit ledger.</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gov-muted">Loading authentication portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
