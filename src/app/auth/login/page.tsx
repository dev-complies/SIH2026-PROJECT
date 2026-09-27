"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { DEMO_USERS, DemoUserAccount } from "@/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { login } = useAuth();
  const [email, setEmail] = useState("officer@urban.gov.in");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirectPath);
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleSelectDemoUser = async (demoUser: DemoUserAccount) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError(null);
    setLoading(true);

    const res = await login(demoUser.email, demoUser.password);
    setLoading(false);

    if (res.success) {
      // Map role to default home dashboard
      let targetPath = redirectPath;
      if (redirectPath === "/") {
        switch (demoUser.role) {
          case "ADMIN":
            targetPath = "/admin/dashboard";
            break;
          case "GOVERNMENT_OFFICER":
            targetPath = "/gov/dashboard";
            break;
          case "PROCUREMENT_OFFICER":
            targetPath = "/procurement/dashboard";
            break;
          case "STARTUP":
            targetPath = "/startup/dashboard";
            break;
          case "EXPERT":
            targetPath = "/expert/dashboard";
            break;
          case "VALIDATOR":
            targetPath = "/validator/dashboard";
            break;
        }
      }
      router.push(targetPath);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 space-y-6">
      <Card className="border-gov-border shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-200 mb-3">
            <Lock className="h-6 w-6 text-gov-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-gov-primary">
            GovInnovate Portal Login
          </CardTitle>
          <CardDescription>
            Secure Role-Based Access for Innovation Procurement Operations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-control flex items-center space-x-2 text-xs text-gov-danger">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gov-muted" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@department.gov.in"
                  className="pl-9"
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
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-primary hover:bg-gov-primary-hover font-semibold"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </Button>
          </form>

          {/* Quick Demo User One-Click Login */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 flex items-center">
                <UserCheck className="w-4 h-4 mr-1 text-gov-accent" />
                One-Click Demo Personas:
              </span>
              <span className="text-xs text-gov-muted">Password: Password123!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(user)}
                  className="text-left p-2.5 rounded-control border border-slate-200 hover:border-gov-accent hover:bg-blue-50/40 transition-colors text-xs flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gov-primary truncate max-w-[140px]">
                      {user.firstName} {user.lastName}
                    </span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono">
                      {user.role}
                    </Badge>
                  </div>
                  <span className="text-xs text-gov-muted truncate block">
                    {user.designation}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center justify-center">
          <p className="text-xs text-gov-muted">
            Authorized government personnel and registered startups only. All actions are logged.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gov-muted">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
