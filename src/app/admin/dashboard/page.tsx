"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MOCK_AUDIT_LOGS, MOCK_USERS } from "@/database/mockData";
import { formatDate } from "@/utils";
import { ShellModulePlaceholder } from "@/components/layout/ShellModulePlaceholder";
import { ShieldCheck, Database, Users, History, CheckCircle2, Lock } from "lucide-react";
import { AuditLogInterface } from "@/components/audit/AuditLogInterface";

function AdminDashboardContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "overview";

  if (tab === "audit-logs") {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xs text-gov-muted">
          <Link href="/admin/dashboard" className="hover:text-gov-primary flex items-center">
            Admin Overview
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Immutable Audit Trail</span>
        </div>
        <AuditLogInterface />
      </div>
    );
  }

  if (tab !== "overview") {
    const tabConfigs: Record<string, { title: string; desc: string; count?: string; action?: string }> = {
      users: {
        title: "User Provisioning & Role-Based Access Control",
        desc: "Manage official accounts across all 6 roles with multi-factor authentication and clearance levels.",
        count: "6 Active Accounts",
        action: "Provision New User",
      },
      departments: {
        title: "Government Departments & Municipal SPVs",
        desc: "Configure state departments, Smart City SPVs, administrative codes, and procurement officer designations.",
        count: "8 Registered Departments",
        action: "Add Department Entity",
      },
      challenges: {
        title: "Challenge Governance & Regulatory Compliance",
        desc: "Audit published problem statements, AI rubric suggestions, and statutory procurement compliance.",
        count: "4 Active Challenges",
        action: "Review Guidelines",
      },
      "system-configuration": {
        title: "System Parameters & Cryptographic Keys",
        desc: "Configure SHA-256 hash chains, escrow payment simulation parameters, telemetry limits, and backup jobs.",
        count: "All Services Operational",
        action: "Rotate Keys",
      },
    };

    const cfg = tabConfigs[tab] || {
      title: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " "),
      desc: `Admin module for ${tab}.`,
    };

    return (
      <ShellModulePlaceholder
        moduleName={cfg.title}
        role="SUPER ADMIN"
        description={cfg.desc}
        itemCount={cfg.count}
        actionLabel={cfg.action}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="default" className="bg-red-800 font-mono text-[10px]">
              SUPER ADMIN PRIVILEGES
            </Badge>
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 text-[10px]">
              AUDIT HASH CHAIN: TAMPER-FREE
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gov-primary tracking-tight">
            Platform Governance & Security Administration
          </h1>
          <p className="text-xs text-gov-muted">
            User provisioning, role assignments, department taxonomies, rubric templates, and immutable audit logs
          </p>
        </div>

        <Badge variant="outline" className="border-blue-300 text-gov-primary bg-blue-50/50">
          Admin: {currentUser?.firstName} {currentUser?.lastName}
        </Badge>
      </div>

      {/* Immutable Audit Log Inspection (Section 37) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gov-primary flex items-center">
              <History className="w-5 h-5 mr-2 text-gov-accent" />
              Cryptographic Audit Log Trail (SHA-256 Chained)
            </h2>
            <p className="text-xs text-gov-muted">
              Append-only tamper-evident event stream capturing every critical procurement transition
            </p>
          </div>
          <Badge variant="success" className="text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All Signatures Valid
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User & Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Client IP</TableHead>
              <TableHead>Cryptographic Hash Chain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_AUDIT_LOGS.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-gov-muted">
                  {formatDate(log.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-slate-900">{log.userId}</div>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    {log.userRole}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-xs text-gov-primary">
                  {log.action}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {log.entityType} ({log.entityId.slice(0, 10)}...)
                </TableCell>
                <TableCell className="font-mono text-xs text-gov-muted">
                  {log.ipAddress}
                </TableCell>
                <TableCell className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]">
                  {log.tamperHash}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Platform Users Directory */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gov-primary flex items-center">
              <Users className="w-5 h-5 mr-2 text-gov-accent" />
              Platform Role Directory
            </h2>
            <p className="text-xs text-gov-muted">All provisioned roles with assigned privileges</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Designation / Organization</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-semibold text-xs text-slate-900">
                  {u.firstName} {u.lastName}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-700">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-gov-muted">{u.designation || "—"}</TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px]">
                    ACTIVE
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading System Admin...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
