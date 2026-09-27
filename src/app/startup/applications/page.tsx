"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Rocket,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
} from "lucide-react";
import { formatCurrency } from "@/utils";

function StartupApplicationsListContent() {
  const router = useRouter();

  const applications = [
    {
      id: "APP-AIR-2026-01",
      legacyId: "APP-2026-UP-UAQ-041",
      challengeId: "chal-air-001",
      challengeCode: "CHAL-UP-UAQ-2026",
      challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
      department: "Dept of Urban Development, Govt of Uttar Pradesh",
      pilotBudget: "₹25,00,000",
      submittedAt: "24 Feb 2026",
      status: "AWARDED",
      statusLabel: "PILOT SANCTIONED",
      statusVariant: "success" as const,
      evaluationScore: "91.7 / 100",
      rank: "Rank 1 of 14",
      pilotId: "PILOT-UP-UAQ-01",
      milestoneStatus: "Milestone 2 (Deployment) Approved",
    },
    {
      id: "APP-TRAFFIC-2026-02",
      legacyId: "APP-2026-UP-TRF-019",
      challengeId: "chal-traffic-002",
      challengeCode: "CHAL-UP-DUT-2026-002",
      challengeTitle: "Adaptive AI Traffic Signal Optimization for Congestion Corridors",
      department: "Directorate of Urban Transport, Kanpur",
      pilotBudget: "₹35,00,000",
      submittedAt: "12 Mar 2026",
      status: "UNDER_REVIEW",
      statusLabel: "EXPERT REVIEW IN PROGRESS",
      statusVariant: "warning" as const,
      evaluationScore: "In Review",
      rank: "Evaluation Stage",
      pilotId: null,
      milestoneStatus: "Pending Scoring",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-gov-border shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-gov-accent uppercase">
              AirSense Technologies Pvt Ltd
            </span>
            <span className="text-slate-300">•</span>
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              DPIIT-94812 Verified
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gov-primary">
            Startup Proposals & Application Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-gov-muted mt-1">
            Track competitive municipal challenge applications, expert scorecards, and sanctioned pilot testbeds.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link href="/startup/applications/apply?challengeId=chal-air-001">
            <Button size="sm" className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs font-semibold shadow-2xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Formulate New Proposal
            </Button>
          </Link>
          <Link href="/challenges">
            <Button size="sm" variant="outline" className="border-slate-300 text-xs">
              Explore Open Challenges
            </Button>
          </Link>
        </div>
      </div>

      {/* Applications Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gov-border shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <div className="text-xs text-gov-muted font-medium">Submitted Proposals</div>
            <div className="text-2xl font-bold text-slate-900">2</div>
            <div className="text-xs text-emerald-700 font-medium">1 Sanctioned Pilot • 1 Under Review</div>
          </CardContent>
        </Card>

        <Card className="border-gov-border shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <div className="text-xs text-gov-muted font-medium">Top Evaluation Consensus</div>
            <div className="text-2xl font-bold text-gov-primary">91.7 <span className="text-xs font-normal text-slate-500">/ 100</span></div>
            <div className="text-xs text-blue-700 font-medium">Rank 1 Contender (Air Quality Mesh)</div>
          </CardContent>
        </Card>

        <Card className="border-gov-border shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <div className="text-xs text-gov-muted font-medium">Escrow Value Under Pilot</div>
            <div className="text-2xl font-bold text-slate-900">₹25,00,000</div>
            <div className="text-xs text-slate-600">₹8,00,000 Disbursed (M2 Complete)</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card className="border-gov-border shadow-2xs overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6">
          <CardTitle className="text-sm font-bold text-gov-primary flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gov-accent" />
              <span>Application Submissions Ledger</span>
            </span>
            <span className="text-xs font-mono text-slate-500 font-normal">
              Showing 2 Applications
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold text-xs text-slate-700 py-3">Application ID & Challenge</TableHead>
                <TableHead className="font-semibold text-xs text-slate-700 py-3">Department</TableHead>
                <TableHead className="font-semibold text-xs text-slate-700 py-3">Pilot Escrow</TableHead>
                <TableHead className="font-semibold text-xs text-slate-700 py-3">Evaluation Status</TableHead>
                <TableHead className="font-semibold text-xs text-slate-700 py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell className="py-4 font-mono text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gov-primary">{app.id}</span>
                        <Badge
                          variant="outline"
                          className={
                            app.status === "AWARDED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px]"
                              : "bg-amber-50 text-amber-700 border-amber-300 text-[10px]"
                          }
                        >
                          {app.statusLabel}
                        </Badge>
                      </div>
                      <div className="font-sans font-semibold text-slate-900 text-sm max-w-md">
                        {app.challengeTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans">
                        Submitted: {app.submittedAt} • Code: {app.challengeCode}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-xs text-slate-600">
                    <div className="space-y-0.5">
                      <div className="font-medium text-slate-800">{app.department}</div>
                      <div className="text-[11px] text-slate-500">Government of Uttar Pradesh</div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-xs">
                    <div className="font-semibold text-slate-900">{app.pilotBudget}</div>
                    <div className="text-[11px] text-slate-500">90-Day Municipal Scope</div>
                  </TableCell>

                  <TableCell className="py-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-semibold text-slate-900">{app.evaluationScore}</span>
                      </div>
                      <div className="text-[11px] text-gov-muted">{app.rank}</div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-xs text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/startup/applications/${app.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-8 border-slate-300 hover:bg-slate-100">
                          <span>View Dossier</span>
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                      {app.pilotId && (
                        <Link href={`/gov/pilots/${app.pilotId}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8">
                            <span>Pilot</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StartupApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gov-muted animate-pulse">
          Loading Startup Applications Dossier...
        </div>
      }
    >
      <StartupApplicationsListContent />
    </Suspense>
  );
}
