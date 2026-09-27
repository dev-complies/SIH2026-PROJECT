"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { getChallengeById, CHALLENGES_DATA } from "@/data/challengesData";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Upload,
  Cpu,
  Users,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Globe,
  Radio,
  Clock,
  Plus,
  X,
} from "lucide-react";

interface StartupCapabilityProfileProps {
  challengeId?: string;
  isEditable?: boolean;
}

export function StartupCapabilityProfile({
  challengeId,
  isEditable = true,
}: StartupCapabilityProfileProps) {
  const { showToast } = useToast();
  const matchedChallenge = challengeId ? getChallengeById(challengeId) : getChallengeById("chal-air-001");

  // Show / Hide match analysis
  const [showMatchSection, setShowMatchSection] = useState(Boolean(challengeId));

  // Interactive Document Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docCategory, setDocCategory] = useState("Certifications");
  const [docTitle, setDocTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileChecksum, setFileChecksum] = useState<string | null>(null);

  // Documents list
  const [documentsList, setDocumentsList] = useState([
    {
      id: "doc-1",
      name: "DPIIT_AirSense_Recognition_Certificate.pdf",
      category: "Statutory Registration",
      size: "1.2 MB",
      date: "12 Jan 2024",
      status: "VERIFIED",
      sha256: "8f4a18e2...b991",
    },
    {
      id: "doc-2",
      name: "CERT-In_AirSense_VAPT_Security_Audit_Level2.pdf",
      category: "Cybersecurity",
      size: "2.4 MB",
      date: "18 Nov 2025",
      status: "VERIFIED",
      sha256: "3d22b10a...e71c",
    },
    {
      id: "doc-3",
      name: "NABL_IP65_RoHS_Laboratory_Test_Report.pdf",
      category: "Hardware Compliance",
      size: "3.8 MB",
      date: "04 Oct 2025",
      status: "VERIFIED",
      sha256: "c5519ef0...612d",
    },
    {
      id: "doc-4",
      name: "Audited_Financial_Statements_FY2024_2025.pdf",
      category: "Financial Solvency",
      size: "1.6 MB",
      date: "15 Jul 2025",
      status: "VERIFIED",
      sha256: "721a93b4...119f",
    },
    {
      id: "doc-5",
      name: "AirSense_Mesh_Hardware_Spec_Sheet_v3.2.pdf",
      category: "Technical Architecture",
      size: "4.1 MB",
      date: "02 Feb 2026",
      status: "VERIFIED",
      sha256: "a0984ef2...901e",
    },
  ]);

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !uploadedFile) {
      showToast({
        type: "error",
        title: "Incomplete Upload",
        description: "Please specify document title and upload a file.",
      });
      return;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: `${docTitle.replace(/\s+/g, "_")}.pdf`,
      category: docCategory,
      size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "VERIFIED",
      sha256: fileChecksum ? `${fileChecksum.substring(0, 8)}...${fileChecksum.substring(fileChecksum.length - 4)}` : "e901b2...41a0",
    };

    setDocumentsList((prev) => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    setDocTitle("");
    setUploadedFile(null);
    setFileChecksum(null);

    showToast({
      type: "success",
      title: "Document Uploaded Successfully",
      description: "Cryptographic SHA-256 anchored to corporate audit dossier.",
    });
  };

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Profile Header Card */}
      <div className="bg-white border border-gov-border rounded-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-card bg-gov-primary text-white flex items-center justify-center font-extrabold text-2xl font-mono shrink-0 shadow-sm border border-slate-700">
              AS
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight">
                  AirSense Technologies Private Limited
                </h1>
                <Badge variant="outline" className="text-emerald-800 bg-emerald-50 border-emerald-300 font-mono text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  DPIIT VERIFIED
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-gov-muted font-medium">
                Autonomous Optical Particulate Sensing, Urban GIS Mesh & Municipal Air Quality Telemetry
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                <span className="flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-gov-muted mr-1" />
                  CIN: U72900UP2022PTC159821
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-gov-muted mr-1" />
                  Lucknow & Kanpur, Uttar Pradesh
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-gov-accent">
                  DPIIT: DIPP-94812
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status & Profile Completion Callout */}
          <div className="bg-slate-50 border border-slate-200 rounded-card p-4 shrink-0 w-full md:w-72 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gov-muted uppercase font-bold">
                PROFILE COMPLETION
              </span>
              <span className="font-mono font-extrabold text-gov-primary text-xs">
                94% Complete
              </span>
            </div>

            <Progress value={94} className="h-2 bg-slate-200" />

            <div className="pt-1 border-t border-slate-200/80 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>Verification Status:</span>
                <span className="font-semibold text-emerald-700 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Relevant Experience:</span>
                <span className="font-semibold text-slate-900">3.5 Years Operational</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>GeM Empanelment:</span>
                <span className="font-mono text-slate-900 text-xs">GEM/2023/S/849201</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2 text-gov-muted">
            <Lock className="w-3.5 h-3.5 text-gov-primary" />
            <span>Sovereign Tenancy: Indian AWS GovCloud (MeitY Empaneled)</span>
          </div>

          <div className="flex items-center space-x-2.5">
            {matchedChallenge && (
              <Button
                size="sm"
                variant={showMatchSection ? "default" : "outline"}
                onClick={() => setShowMatchSection(!showMatchSection)}
                className={`text-xs h-8 ${
                  showMatchSection
                    ? "bg-purple-700 hover:bg-purple-800 text-white"
                    : "border-purple-300 text-purple-900 bg-purple-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                {showMatchSection ? "Hide Challenge Alignment" : "View Challenge Alignment"}
              </Button>
            )}

            {isEditable && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsUploadModalOpen(true)}
                className="text-xs h-8 border-slate-300"
              >
                <Upload className="w-3.5 h-3.5 mr-1" /> Upload Dossier Document
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* OPTIONAL: "WHY THIS STARTUP MATCHES" SECTION */}
      {showMatchSection && matchedChallenge && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50/40 to-blue-50 border border-purple-200 rounded-card p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200/80 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-md bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono text-purple-800 font-bold uppercase tracking-wider block">
                  STATUTORY COMPATIBILITY AUDIT
                </span>
                <h3 className="text-sm font-extrabold text-gov-primary">
                  Why AirSense Matches: {matchedChallenge.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <Badge variant="outline" className="bg-white border-purple-300 text-purple-900 font-mono text-xs px-2.5 py-1">
                96% Technical & Regulatory Match
              </Badge>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Algorithmic compliance cross-referencing against General Financial Rules (GFR 2017) Rule 149 and specific pilot benchmarks formulated in <span className="font-semibold text-gov-primary">{matchedChallenge.code}</span>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/80 border border-purple-200 rounded-control p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[11.5px]">Technology Alignment</span>
                <span className="text-xs font-mono font-bold text-emerald-700">100% Match</span>
              </div>
              <p className="text-xs text-slate-600 leading-tight">
                Mandates simultaneous PM1, PM2.5, PM10 counting. AirSense Dual-Beam Optical Sensor exceeds required resolution.
              </p>
            </div>

            <div className="bg-white/80 border border-purple-200 rounded-control p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[11.5px]">Calibration Accuracy</span>
                <span className="text-xs font-mono font-bold text-emerald-700">R² = 0.94 (&ge; 0.92 Target)</span>
              </div>
              <p className="text-xs text-slate-600 leading-tight">
                Exceeds statutory CPCB reference correlation benchmark by +2.2% in collocated field trials over 90 days.
              </p>
            </div>

            <div className="bg-white/80 border border-purple-200 rounded-control p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[11.5px]">Geographic & Field Readiness</span>
                <span className="text-xs font-mono font-bold text-emerald-700">15-Day Mobilization</span>
              </div>
              <p className="text-xs text-slate-600 leading-tight">
                Local engineering hub in Lucknow Wards ensures under 2-hour emergency site replacement and ICCC integration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Capability Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Core Capability Dossier */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. COMPANY OVERVIEW */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-gov-primary uppercase tracking-wider font-mono flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-gov-accent" />
                1. Company Overview & Governance
              </h2>
              <Badge variant="outline" className="text-xs font-mono">
                Incorporated 2022
              </Badge>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <p className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-control text-slate-700 leading-relaxed">
                AirSense Technologies is an Indian environmental deep-tech enterprise engineering hyper-local atmospheric telemetry infrastructure. The company develops patent-pending optical particle spectrometers, industrial edge gateways, and automated calibration algorithms engineered specifically for high-particulate tropical environments.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-control">
                  <span className="text-xs text-gov-muted font-mono uppercase block">LEGAL ENTITY</span>
                  <span className="font-semibold text-slate-900">Private Limited (India)</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-control">
                  <span className="text-xs text-gov-muted font-mono uppercase block">DPIIT CERTIFICATE</span>
                  <span className="font-semibold text-emerald-800 font-mono">DIPP-94812 (Verified)</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-control">
                  <span className="text-xs text-gov-muted font-mono uppercase block">OPERATING RUNWAY</span>
                  <span className="font-semibold text-slate-900">14 Months Confirmed</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-control">
                  <span className="text-xs text-gov-muted font-mono uppercase block">DATA LOCALIZATION</span>
                  <span className="font-semibold text-slate-900">100% Indian Cloud (MeitY)</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-control">
                  <span className="text-xs text-gov-muted font-mono uppercase block">ANNUAL REVENUE</span>
                  <span className="font-semibold text-slate-900 font-mono">₹1.85 Cr (FY25)</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-control">
                  <span className="text-xs text-gov-muted font-mono uppercase block">TRL READINESS</span>
                  <span className="font-semibold text-slate-900">TRL 8 (Mission Qualified)</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. TECHNOLOGY STACK & IP */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-gov-primary uppercase tracking-wider font-mono flex items-center">
                <Cpu className="w-4 h-4 mr-2 text-gov-accent" />
                2. Proprietary Technology & IP Portfolio
              </h2>
              <Badge variant="outline" className="text-xs font-mono text-blue-800 bg-blue-50 border-blue-200">
                1 Patent Published
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                  <span className="font-bold text-slate-900 block text-[12px]">
                    Dual-Beam Optical Particulate Counter
                  </span>
                  <p className="text-xs text-slate-600 leading-tight">
                    Patent Application 202311048192: Orthogonal laser scatter geometry resolving PM1, PM2.5, PM10 simultaneously from 0.3 to 40 µm.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                  <span className="font-bold text-slate-900 block text-[12px]">
                    Automated Anti-Fouling Optical Purge
                  </span>
                  <p className="text-xs text-slate-600 leading-tight">
                    Cyclonic positive-pressure filtered air purge preventing optical sensor blindness in extreme dust episodes.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                  <span className="font-bold text-slate-900 block text-[12px]">
                    Edge Machine Learning Drift Compensation
                  </span>
                  <p className="text-xs text-slate-600 leading-tight">
                    On-device non-linear hygroscopic growth correction curves calibrated against statutory CAAQMS analyzers.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                  <span className="font-bold text-slate-900 block text-[12px]">
                    Dual-Carrier LoRaWAN & NB-IoT Backhaul
                  </span>
                  <p className="text-xs text-slate-600 leading-tight">
                    Cryptographic SHA-256 anchored 15-minute telemetry streams pushing directly to municipal command centers (ICCC).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. PREVIOUS PROJECTS */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-gov-primary uppercase tracking-wider font-mono flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-gov-accent" />
                3. Previous Track Record & Deployments
              </h2>
              <span className="text-xs font-mono text-gov-muted">3 Major Projects</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="border border-gov-border rounded-control p-3.5 bg-slate-50/50 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-sm">
                    Kanpur Industrial Cluster Environmental Mesh
                  </span>
                  <Badge variant="outline" className="text-[9.5px] font-mono">
                    25 Nodes • 18 Months Operational
                  </Badge>
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Deployed 25 continuous monitoring stations across Panki and Fazalganj industrial estates. Maintained 96.4% hourly uptime through two severe winter inversion episodes with zero sensor fouling.
                </p>
                <div className="flex items-center space-x-3 text-[10.5px] text-gov-muted pt-1">
                  <span>Client: UP State Industrial Development Authority</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">100% Deliverables Accepted</span>
                </div>
              </div>

              <div className="border border-gov-border rounded-control p-3.5 bg-slate-50/50 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-sm">
                    Delhi NCR Construction Dust Optical Fence
                  </span>
                  <Badge variant="outline" className="text-[9.5px] font-mono">
                    15 Nodes • 6 Months Pilot
                  </Badge>
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Real-time boundary particulate fence installed at a 40-acre transit development site. Automated webhook triggered localized anti-smog mist cannons within 90 seconds of threshold breach.
                </p>
                <div className="flex items-center space-x-3 text-[10.5px] text-gov-muted pt-1">
                  <span>Client: National Capital Region Transport Corp (NCRTC)</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Zero Environmental Penalties</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. CASE STUDIES */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-gov-primary uppercase tracking-wider font-mono flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-gov-accent" />
                4. Audited Case Studies & Empirical Proof
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-slate-200 rounded-control p-4 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-gov-primary text-[13px]">
                    Municipal Tactical Intervention Optimization (Lucknow Ward 14)
                  </span>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Validated Pilot
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[9.5px] font-mono text-gov-muted uppercase block">BASELINE STATE</span>
                    <p className="text-slate-700 font-semibold mt-0.5">Uniform truck dispatch; 4.5h delay</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[9.5px] font-mono text-gov-muted uppercase block">DEPLOYED SOLUTION</span>
                    <p className="text-slate-700 font-semibold mt-0.5">12 Mesh nodes with 15m GIS push</p>
                  </div>
                  <div className="p-2 bg-emerald-50/60 rounded border border-emerald-200">
                    <span className="text-[9.5px] font-mono text-emerald-800 uppercase block">MEASURED OUTCOME</span>
                    <p className="text-emerald-950 font-bold mt-0.5">38% faster dispatch • R² = 0.94</p>
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Independent statistical audit conducted by the Department of Civil Engineering, IIT Kanpur confirmed R² = 0.942 collocated correlation with statutory BAM-1020 instrumentation over 90 days, enabling municipal officers to reduce localized particulate exposure spikes by 22%.
                </p>
              </div>
            </div>
          </section>

          {/* 5. SECURE DOCUMENTS & EVIDENCE REPOSITORY */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-gov-primary uppercase tracking-wider font-mono flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gov-accent" />
                  5. Statutory Dossier & Compliance Documents
                </h2>
                <p className="text-xs text-gov-muted mt-0.5">
                  Cryptographically anchored public compliance files for tender evaluation
                </p>
              </div>

              {isEditable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="text-xs h-8 border-slate-300"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Document
                </Button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="border border-gov-border rounded-control overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
                    <tr>
                      <th className="p-2.5">Document Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">SHA-256 Digest</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {documentsList.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-2.5">
                          <p className="font-semibold text-slate-900 truncate max-w-xs">{doc.name}</p>
                          <span className="text-xs text-gov-muted font-mono">{doc.size} • {doc.date}</span>
                        </td>
                        <td className="p-2.5 text-slate-600 text-xs">{doc.category}</td>
                        <td className="p-2.5 font-mono text-gov-muted text-[10.5px]">{doc.sha256}</td>
                        <td className="p-2.5 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              showToast({
                                type: "success",
                                title: "Document Downloaded",
                                description: `Downloading ${doc.name}`,
                              });
                            }}
                            className="text-xs h-6 px-2 border-slate-300"
                          >
                            <Download className="w-3 h-3 mr-1" /> Get
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Right 1 Column: Leadership, Certifications, Industries */}
        <div className="space-y-6">
          {/* Key Leadership & Technical Team */}
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-gov-primary" />
              <h3 className="font-bold text-gov-primary uppercase tracking-wider font-mono text-xs">
                Key Technical Leadership
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block text-[12px]">
                  Dr. Vikramaditya Sen, PhD
                </span>
                <span className="text-xs text-gov-accent font-semibold block">
                  CEO & Co-founder
                </span>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  Ex-IIT Kanpur Environmental Sciences; 14 peer-reviewed atmospheric sensing publications.
                </p>
              </div>

              <div className="space-y-0.5 border-t border-slate-100 pt-2.5">
                <span className="font-bold text-slate-900 block text-[12px]">
                  Ananya Singhal
                </span>
                <span className="text-xs text-gov-accent font-semibold block">
                  CTO & Hardware Lead
                </span>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  12+ years embedded systems & edge telemetry; ex-ISRO contractor for sensor telemetry payloads.
                </p>
              </div>

              <div className="space-y-0.5 border-t border-slate-100 pt-2.5">
                <span className="font-bold text-slate-900 block text-[12px]">
                  Rajesh Murthy, M.Tech
                </span>
                <span className="text-xs text-gov-accent font-semibold block">
                  Head of Atmospheric Calibration
                </span>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  Specialist in collocated regression with CAAQMS reference analyzers (BAM-1020 & Teledyne).
                </p>
              </div>

              <div className="space-y-0.5 border-t border-slate-100 pt-2.5">
                <span className="font-bold text-slate-900 block text-[12px]">
                  Meenakshi Nair
                </span>
                <span className="text-xs text-gov-accent font-semibold block">
                  Public Procurement & Legal
                </span>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  GFR 2017 Rule 149 and GeM vendor compliance lead.
                </p>
              </div>
            </div>
          </div>

          {/* Statutory Certifications */}
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Award className="w-4 h-4 text-gov-primary" />
              <h3 className="font-bold text-gov-primary uppercase tracking-wider font-mono text-xs">
                Audited Certifications
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-control flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-[11.5px]">DPIIT Startup Recognition</p>
                  <p className="text-[10.5px] text-slate-600">Certificate DIPP-94812 • Active</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-control flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-[11.5px]">CERT-In Level 2 VAPT Audit</p>
                  <p className="text-[10.5px] text-slate-600">Firmware & cloud TLS 1.3 cleared</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-control flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-[11.5px]">NABL IP65 & RoHS Testing</p>
                  <p className="text-[10.5px] text-slate-600">Lead-free & weatherproof verified</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-control flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-[11.5px]">ISO 9001:2015 Quality</p>
                  <p className="text-[10.5px] text-slate-600">Hardware manufacturing standard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Verticals */}
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-gov-primary" />
              <h3 className="font-bold text-gov-primary uppercase tracking-wider font-mono text-xs">
                Target Industry Sectors
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                "CleanTech & Environmental IoT",
                "Smart Cities & Municipal ICCC",
                "Industrial Emission Telemetry",
                "Public Health Exposure Mapping",
                "Highway & Transit Corridors",
                "State Pollution Control Boards",
              ].map((ind) => (
                <span
                  key={ind}
                  className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded text-xs"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Government Experience Summary */}
          <div className="bg-slate-50 border border-gov-border rounded-card p-5 space-y-3 text-xs">
            <span className="text-xs font-mono text-gov-primary uppercase font-bold block">
              PUBLIC PROCUREMENT CREDENTIALS
            </span>
            <div className="space-y-2 text-[11.5px] text-slate-700">
              <div className="flex items-center justify-between">
                <span>GeM Vendor Rating:</span>
                <span className="font-bold text-slate-900">4.9 / 5.0 (98.2%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CVC Audit Status:</span>
                <span className="font-semibold text-emerald-700">0 Adverse Findings</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GFR Rule 149 Compliance:</span>
                <span className="font-semibold text-slate-900">100% Empaneled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCUMENT UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-gov-primary" />
                <h3 className="font-bold text-sm text-gov-primary">Upload Statutory Document</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDocumentSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Document Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
                >
                  <option value="Statutory Registration">Statutory Registration (DPIIT / CIN)</option>
                  <option value="Cybersecurity">Cybersecurity Audit (CERT-In)</option>
                  <option value="Hardware Compliance">Hardware Compliance (RoHS / IP65)</option>
                  <option value="Financial Solvency">Financial Solvency (Audited Balance Sheet)</option>
                  <option value="Technical Architecture">Technical Architecture & Schemas</option>
                  <option value="Case Studies">Case Studies & Validation Letters</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Document Title</label>
                <Input
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. BIS_RoHS_Laboratory_Test_Report_2026"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">File Attachment (PDF)</label>
                <FileUpload
                  accept=".pdf"
                  onFileSelect={(file, hash) => {
                    setUploadedFile(file);
                    setFileChecksum(hash);
                  }}
                  onFileRemove={() => {
                    setUploadedFile(null);
                    setFileChecksum(null);
                  }}
                />
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-end space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gov-primary text-xs font-semibold"
                >
                  Save & Anchor Checksum
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
