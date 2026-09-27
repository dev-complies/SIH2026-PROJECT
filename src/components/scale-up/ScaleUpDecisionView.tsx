"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/auth/AuthContext";
import { normalizeRole } from "@/auth/permissions";
import { cn } from "@/utils";
import {
  ScaleUpDossier,
  ScaleUpDecisionAction,
  ScaleUpLifecycleStage,
  INITIAL_SCALE_UP_DOSSIER,
  ExpansionCityTarget,
} from "@/database/scaleUpDatabase";
import { ScaleUpLifecycleTracker } from "./ScaleUpLifecycleTracker";
import { ScaleUpSpatialTopology3D } from "./ScaleUpSpatialTopology3D";
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Scale,
  ShoppingBag,
  RotateCcw,
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  MapPin,
  Building2,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer,
  ChevronRight,
  Info,
  ExternalLink,
  Cpu,
  Radio,
  Check,
} from "lucide-react";

export interface ScaleUpDecisionViewProps {
  pilotId?: string;
  onBack?: () => void;
}

export function ScaleUpDecisionView({
  pilotId = "PILOT-UP-UAQ-01",
  onBack,
}: ScaleUpDecisionViewProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [dossier, setDossier] = useState<ScaleUpDossier>(INITIAL_SCALE_UP_DOSSIER);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<ExpansionCityTarget>(
    INITIAL_SCALE_UP_DOSSIER.proposedGeography.cities[0]
  );

  // Modal State for Executing Actions
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: ScaleUpDecisionAction;
    title: string;
    description: string;
    badgeColor: string;
  } | null>(null);

  const [justification, setJustification] = useState("");
  const [sanctionedBudget, setSanctionedBudget] = useState(
    INITIAL_SCALE_UP_DOSSIER.expansionCost.totalEstimatedBudgetInr
  );
  const [secondaryTestbedScope, setSecondaryTestbedScope] = useState(
    "30-day Severe Winter Fog Testbed (Dec-Jan) in Agra TTZ Corridor"
  );
  const [modificationsList, setModificationsList] = useState(
    "1. Mandate PTC heated inlet tubes to prevent optical droplet scattering.\n2. Add directional LoRa repeaters for dense heritage wards.\n3. Integrate 3-minute alert smoothing algorithm."
  );
  const [isHumanConfirmed, setIsHumanConfirmed] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Check Role Authorization
  const canonicalRole = currentUser ? normalizeRole(currentUser.role) : "";
  const isAuthorizedDecisionMaker =
    canonicalRole === "GOVERNMENT_OFFICER" ||
    canonicalRole === "PROCUREMENT_OFFICER" ||
    canonicalRole === "ADMIN";

  // Fetch scale-up dossier from API
  const fetchDossier = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pilots/${pilotId}/scale-up`);
      if (res.ok) {
        const data = await res.json();
        if (data.dossier) {
          setDossier(data.dossier);
        }
      }
    } catch (e) {
      console.warn("Using fallback scale-up data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossier();
  }, [pilotId]);

  const openActionModal = (action: ScaleUpDecisionAction) => {
    if (!isAuthorizedDecisionMaker) {
      showToast({
        type: "error",
        title: "Access Restricted",
        description:
          "Only authorized Government Officers, Procurement Officers, or Platform Admins can execute statutory scale-up actions.",
      });
      return;
    }

    let title = "";
    let description = "";
    let badgeColor = "bg-blue-600";

    switch (action) {
      case "START_SCALE_UP":
        title = "Statutory Sanction: Start Scale-Up";
        description =
          "Transition pilot into the Procurement Review phase for statewide multi-city expansion across 6 smart cities and 380 wards under GFR Rule 149.",
        badgeColor = "bg-emerald-600";
        setJustification(
          "The Lucknow pilot demonstrated exceptional technical attainment (99.4% uptime, R² = 0.95 vs CPCB BAM-1020). Independent validation by TERI confirms unit economics offer 98.3% cost reduction versus legacy CAAQMS stations. Recommended for full statewide scaling under GFR Rule 149(v)."
        );
        break;
      case "REQUEST_ADDITIONAL_PILOT":
        title = "Order Secondary Additional Pilot Testbed";
        description =
          "Commission an additional specialized pilot testbed to stress-test sensors under unverified meteorological conditions (e.g. extreme winter fog / high industrial VOC zones).",
        badgeColor = "bg-amber-600";
        setJustification(
          "While overall baseline attainment is verified, winter fog conditions in North India require an additional 30-day specialized testbed in Agra/Kanpur to confirm PTC heated inlet efficacy before full statewide capital commitment."
        );
        break;
      case "MODIFY_RETEST":
        title = "Require Technical Modifications & Retest";
        description =
          "Mandate startup hardware/software revisions before scale-up can be reconsidered by the procurement committee.",
        badgeColor = "bg-indigo-600";
        setJustification(
          "Require startup to incorporate hardware heated inlet tubes and LoRaWAN repeaters for heritage masonry corridors, followed by a 14-day calibration verification cycle."
        );
        break;
      case "CLOSE":
        title = "Formally Close Pilot (Do Not Scale)";
        description =
          "Conclude the pilot engagement without statewide commercial procurement rollout. Archives all empirical learnings into state knowledge base.",
        badgeColor = "bg-rose-600";
        setJustification(
          "The pilot engagement is formally closed following completion of agreed scope. Municipal requirements will be fulfilled via alternative municipal rate contracts."
        );
        break;
    }

    setIsHumanConfirmed(false);
    setActionModal({
      isOpen: true,
      action,
      title,
      description,
      badgeColor,
    });
  };

  const handleExecuteAction = async () => {
    if (!actionModal) return;

    if (!isHumanConfirmed) {
      showToast({
        type: "error",
        title: "Human Confirmation Required",
        description:
          "Public procurement regulations strictly prohibit automated AI decisions. Please check the human confirmation box under GFR Rule 149.",
      });
      return;
    }

    if (!justification || justification.trim().length < 20) {
      showToast({
        type: "error",
        title: "Justification Required",
        description: "Please provide a detailed statutory justification (minimum 20 characters).",
      });
      return;
    }

    try {
      setSubmittingAction(true);
      const res = await fetch(`/api/pilots/${pilotId}/scale-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionModal.action,
          justification,
          sanctionedBudgetInr: sanctionedBudget,
          targetGeographyScope: "80 Lucknow Wards + 5 UP Smart Cities (Kanpur, Agra, Varanasi, Prayagraj, Ghaziabad)",
          secondaryPilotConditions:
            actionModal.action === "REQUEST_ADDITIONAL_PILOT" ? secondaryTestbedScope : undefined,
          modificationRequirements:
            actionModal.action === "MODIFY_RETEST"
              ? modificationsList.split("\n").filter(Boolean)
              : undefined,
          isHumanConfirmed,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to record scale-up decision.");
      }

      showToast({
        type: "success",
        title: "Statutory Decision Recorded",
        description: data.message || "Scale-up action executed and lifecycle updated.",
      });

      if (data.dossier) {
        setDossier(data.dossier);
      } else {
        fetchDossier();
      }

      setActionModal(null);
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Action Failed",
        description: err.message || "Failed to execute scale-up action.",
      });
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-20">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & INSTITUTIONAL BREADCRUMB                 */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                STATE INNOVATION SCALE-UP DOSSIER
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                Directorate of Urban Development • Government of Uttar Pradesh
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gov-primary tracking-tight">
              Scale-Up Decision: {dossier.pilotTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Startup Partner: <strong className="text-slate-900">{dossier.startupName}</strong>{" "}
              (DPIIT: {dossier.startupDpiit}) • Pilot Code:{" "}
              <span className="font-mono text-slate-800 font-semibold">{dossier.pilotCode}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onBack ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="text-xs h-8 border-slate-300"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Pilot
              </Button>
            ) : (
              <Link href={`/gov/pilots/${pilotId}`}>
                <Button variant="outline" size="sm" className="text-xs h-8 border-slate-300">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Pilot Workspace
                </Button>
              </Link>
            )}
            <Link href="/gov/pilots/report">
              <Button variant="outline" size="sm" className="text-xs h-8 border-slate-300">
                <FileText className="w-3.5 h-3.5 mr-1" /> View Full Report
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
            >
              <Printer className="w-3.5 h-3.5 mr-1" /> Print Decision Packet
            </Button>
          </div>
        </div>

        {/* Operational Scope Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-control p-3.5 text-xs">
          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block font-semibold">
              CURRENT LIFECYCLE STAGE
            </span>
            <span className="font-bold text-gov-primary font-mono text-xs">
              {dossier.currentStage.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-slate-500 block">Under GFR Rule 149</span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block font-semibold">
              EXPANSION SCOPE
            </span>
            <strong className="text-slate-900 text-xs">
              6 Cities • 380 Wards
            </strong>
            <span className="text-xs text-slate-500 block font-mono">910 Sensor Pods</span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block font-semibold">
              ESTIMATED SCALE BUDGET
            </span>
            <strong className="text-amber-800 text-xs font-mono">
              ₹{(dossier.expansionCost.totalEstimatedBudgetInr / 10000000).toFixed(2)} Crore
            </strong>
            <span className="text-xs text-emerald-700 block font-semibold">
              98.3% Cost Savings
            </span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block font-semibold">
              INDEPENDENT VALIDATION
            </span>
            <span className="inline-flex items-center text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> TERI & IITK Certified
            </span>
            <span className="text-xs text-slate-500 block font-mono">R² = 0.95 vs BAM-1020</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VISUAL LIFECYCLE COMPONENT                            */}
      {/* Lifecycle: Pilot Completed -> Validation ->              */}
      {/* Scale-Up Review -> Procurement Review -> Scale           */}
      {/* ======================================================== */}
      <ScaleUpLifecycleTracker currentStage={dossier.currentStage} />

      {/* ======================================================== */}
      {/* 3. FOUR CORE STATUTORY ACTIONS STRIP                     */}
      {/* Actions: Start Scale-Up | Request Additional Pilot |     */}
      {/* Modify & Retest | Close                                  */}
      {/* ======================================================== */}
      <div className="bg-slate-900 text-white rounded-card p-4 sm:p-5 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-xs border border-amber-400/20">
                STATUTORY DECISION BENCH
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300">
                Authorized Executive Actions for State Procurement Committee
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              Select Committee Scale-Up Action
            </h2>
          </div>

          {!isAuthorizedDecisionMaker && (
            <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-300 text-xs font-mono">
              <Lock className="w-3 h-3 mr-1" /> Read-Only: Committee Sign-off Required
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Action 1: Start Scale-Up */}
          <button
            onClick={() => openActionModal("START_SCALE_UP")}
            disabled={!isAuthorizedDecisionMaker}
            className={cn(
              "group p-3.5 rounded-control text-left transition-all border flex flex-col justify-between",
              isAuthorizedDecisionMaker
                ? "bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/60 hover:border-emerald-400 cursor-pointer shadow-xs"
                : "bg-slate-800/40 border-slate-700 opacity-60 cursor-not-allowed"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-7 h-8 rounded-control bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Rocket className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                  RECOMMENDED
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300">
                Start Scale-Up
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Advance directly to Procurement Review under GFR 149 for 6 cities and 380 wards.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-400 mt-3 pt-2 border-t border-emerald-500/20">
              Trigger GeM Clearance <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 2: Request Additional Pilot */}
          <button
            onClick={() => openActionModal("REQUEST_ADDITIONAL_PILOT")}
            disabled={!isAuthorizedDecisionMaker}
            className={cn(
              "group p-3.5 rounded-control text-left transition-all border flex flex-col justify-between",
              isAuthorizedDecisionMaker
                ? "bg-amber-950/40 border-amber-500/40 hover:bg-amber-900/60 hover:border-amber-400 cursor-pointer shadow-xs"
                : "bg-slate-800/40 border-slate-700 opacity-60 cursor-not-allowed"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-7 h-8 rounded-control bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  SECONDARY TEST
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300">
                Request Additional Pilot
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Order secondary stress-test under severe North Indian winter fog or industrial emissions.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-400 mt-3 pt-2 border-t border-amber-500/20">
              Specify Secondary Testbed <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 3: Modify & Retest */}
          <button
            onClick={() => openActionModal("MODIFY_RETEST")}
            disabled={!isAuthorizedDecisionMaker}
            className={cn(
              "group p-3.5 rounded-control text-left transition-all border flex flex-col justify-between",
              isAuthorizedDecisionMaker
                ? "bg-indigo-950/40 border-indigo-500/40 hover:bg-indigo-900/60 hover:border-indigo-400 cursor-pointer shadow-xs"
                : "bg-slate-800/40 border-slate-700 opacity-60 cursor-not-allowed"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-7 h-8 rounded-control bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <RotateCcw className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase">
                  REVISIONS
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300">
                Modify & Retest
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Require startup to implement hardware heated inlets & LoRa repeaters before scaling.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-indigo-400 mt-3 pt-2 border-t border-indigo-500/20">
              List Engineering Changes <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 4: Close */}
          <button
            onClick={() => openActionModal("CLOSE")}
            disabled={!isAuthorizedDecisionMaker}
            className={cn(
              "group p-3.5 rounded-control text-left transition-all border flex flex-col justify-between",
              isAuthorizedDecisionMaker
                ? "bg-rose-950/40 border-rose-500/40 hover:bg-rose-900/60 hover:border-rose-400 cursor-pointer shadow-xs"
                : "bg-slate-800/40 border-slate-700 opacity-60 cursor-not-allowed"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-7 h-8 rounded-control bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <XCircle className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono text-rose-400 font-bold uppercase">
                  ARCHIVE
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 group-hover:text-rose-300">
                Close Pilot
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Conclude pilot without scaling. Archive dataset and empirical lessons into state library.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-rose-400 mt-3 pt-2 border-t border-rose-500/20">
              Conclude & Archive <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. NINE CORE SCALE-UP REVIEW DIMENSIONS                  */}
      {/* ======================================================== */}

      {/* DIMENSION 1 & 2: PILOT RESULTS & VALIDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dimension 1: Pilot Results */}
        <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-control bg-blue-50 text-gov-primary flex items-center justify-center font-bold text-xs">
                1
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pilot Results Attainment</h3>
                <span className="text-xs text-gov-muted font-mono">
                  90-Day Empirical Field Benchmarks
                </span>
              </div>
            </div>
            <Badge variant="success" className="font-mono text-xs">
              {dossier.pilotResults.overallAttainment}% ATTAINED
            </Badge>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {dossier.pilotResults.summary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                NODE UPTIME
              </span>
              <strong className="text-base font-extrabold text-emerald-800 font-mono">
                {dossier.pilotResults.uptimeActual}%
              </strong>
              <span className="text-xs text-slate-500 block">
                Target: {dossier.pilotResults.uptimeTarget}%
              </span>
            </div>

            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                CORRELATION (R²)
              </span>
              <strong className="text-base font-extrabold text-emerald-800 font-mono">
                {dossier.pilotResults.accuracyR2Actual}
              </strong>
              <span className="text-xs text-slate-500 block">
                Target: {dossier.pilotResults.accuracyR2Target}
              </span>
            </div>

            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                COVERAGE DENSITY
              </span>
              <strong className="text-base font-extrabold text-gov-primary font-mono">
                {dossier.pilotResults.coverageActualSqKm} km²
              </strong>
              <span className="text-xs text-slate-500 block">
                Target: {dossier.pilotResults.coverageTargetSqKm} km²
              </span>
            </div>

            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                TELEMETRY LATENCY
              </span>
              <strong className="text-base font-extrabold text-gov-primary font-mono">
                {dossier.pilotResults.latencyActualSec}s
              </strong>
              <span className="text-xs text-slate-500 block">
                Target: &lt; {dossier.pilotResults.latencyTargetSec}s
              </span>
            </div>

            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                CITIZEN ADVISORY
              </span>
              <strong className="text-base font-extrabold text-gov-primary font-mono">
                {dossier.pilotResults.alertSpeedMins}m
              </strong>
              <span className="text-xs text-slate-500 block">
                Target: &lt; 5m
              </span>
            </div>

            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                TOTAL PACKETS
              </span>
              <strong className="text-base font-extrabold text-slate-900 font-mono">
                {(dossier.pilotResults.packetsProcessed / 1000000).toFixed(2)}M
              </strong>
              <span className="text-xs text-slate-500 block">
                0 Packet Loss
              </span>
            </div>
          </div>
        </div>

        {/* Dimension 2: Validation */}
        <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Third-Party Independent Validation</h3>
                <span className="text-xs text-gov-muted font-mono">
                  {dossier.validation.agency}
                </span>
              </div>
            </div>
            <Badge variant="success" className="font-mono text-xs">
              {dossier.validation.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-gov-muted uppercase font-semibold block">
              CERTIFIED AUDIT FINDINGS:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {dossier.validation.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-control bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center text-xs text-amber-950">
              <AlertTriangle className="w-3 h-3 mr-1 text-amber-700" />
              Recognized Physical Limitations for Scale-Up:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-900">
              {dossier.validation.recognizedLimitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-gov-muted font-mono border-t border-slate-100">
            <span>Lead: {dossier.validation.leadValidator}</span>
            <span className="truncate max-w-[200px]">SHA256: {dossier.validation.certificateSha256.slice(0, 16)}...</span>
          </div>
        </div>
      </div>

      {/* DIMENSION 3 & 4: COST & RISKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dimension 3: Cost Economics */}
        <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Unit Economics & Cost Benefit</h3>
                <span className="text-xs text-gov-muted font-mono">
                  Pilot vs Scale Comparison
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs">
              Benefit Ratio {dossier.cost.costBenefitRatio}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                PER WARD PILOT COST
              </span>
              <strong className="text-sm font-bold text-slate-900 font-mono">
                ₹{(dossier.cost.costPerWardPilotInr / 1000).toFixed(0)}k
              </strong>
              <span className="text-xs text-slate-500 block">12 pilot wards</span>
            </div>

            <div className="p-2.5 rounded-control bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-800 uppercase block font-mono font-semibold">
                PER WARD SCALE COST
              </span>
              <strong className="text-sm font-bold text-emerald-900 font-mono">
                ₹{(dossier.cost.costPerWardScaleInr / 1000).toFixed(0)}k
              </strong>
              <span className="text-xs text-emerald-700 block">76.4% unit savings</span>
            </div>

            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono font-semibold">
                LEGACY CAAQMS COST
              </span>
              <strong className="text-sm font-bold text-slate-700 font-mono">
                ₹1.20 Cr
              </strong>
              <span className="text-xs text-slate-500 block">Per single station</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-control text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Pilot Disbursed:</span>
              <strong className="font-mono text-slate-900">
                ₹{(dossier.cost.pilotDisbursedInr / 100000).toFixed(2)} Lakh
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Savings vs Full Stationary Reference:</span>
              <strong className="font-mono text-emerald-700">
                {dossier.cost.savingsVsLegacyPercentage}% Lower Capital Cost
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Capital Amortization Payback:</span>
              <strong className="font-mono text-slate-900">
                {dossier.cost.paybackPeriodMonths} Months
              </strong>
            </div>
          </div>
        </div>

        {/* Dimension 4: Risks & Mitigations */}
        <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-control bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Scale-Up Risks & Mitigation Matrix</h3>
                <span className="text-xs text-gov-muted font-mono">
                  Residual Risk Mitigation
                </span>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-xs text-emerald-700 border-emerald-300">
              ALL RISKS MITIGATED
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            {dossier.risks.map((risk, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-control border border-slate-200 bg-slate-50/70 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[280px]">
                    {risk.title}
                  </span>
                  <Badge
                    variant={risk.severity === "MEDIUM" ? "warning" : "default"}
                    className="text-xs font-mono shrink-0"
                  >
                    {risk.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-700 leading-tight">
                  <strong className="text-slate-900">Mitigation:</strong> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DIMENSION 5 & 6: COMPLIANCE & SCALABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dimension 5: Compliance */}
        <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-control bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                5
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Statutory Compliance & Legal Clearances</h3>
                <span className="text-xs text-gov-muted font-mono">
                  GFR 149 • DPDP Act 2023 • Class-1 Local
                </span>
              </div>
            </div>
            <Badge variant="success" className="font-mono text-xs">
              VERIFIED COMPLIANT
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  GFR Rule 149(v) Public Procurement Eligibility
                </span>
                <span className="font-mono text-xs text-emerald-700 font-bold">
                  {dossier.compliance.gfr149Status}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-tight">
                {dossier.compliance.gfr149Note}
              </p>
            </div>

            <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Digital Personal Data Protection (DPDP) Act 2023
                </span>
                <span className="font-mono text-xs text-emerald-700 font-bold">
                  {dossier.compliance.dpdpAct2023Status}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-tight">
                {dossier.compliance.dpdpNote}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-control border border-slate-200">
                <span className="text-xs text-gov-muted block">Make in India Local Content:</span>
                <strong className="font-mono text-emerald-800 text-xs">
                  {dossier.compliance.makeInIndiaLocalContent}% (Class-1 Supplier)
                </strong>
              </div>
              <div className="p-2 bg-slate-50 rounded-control border border-slate-200">
                <span className="text-xs text-gov-muted block">CERT-In Security Audit:</span>
                <strong className="text-slate-900 text-xs">Zero Vulnerabilities</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension 6: Scalability */}
        <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-control bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs">
                6
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Technical Scalability & Edge Architecture</h3>
                <span className="text-xs text-gov-muted font-mono">
                  State Data Centre Microservices
                </span>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-xs text-blue-700 border-blue-300">
              {dossier.scalability.cloudSLA}
            </Badge>
          </div>

          <div className="p-2.5 rounded-control bg-slate-50 border border-slate-200 text-xs">
            <span className="text-xs text-gov-muted font-mono block">ARCHITECTURE SPECIFICATION:</span>
            <p className="font-semibold text-slate-900 mt-0.5">
              {dossier.scalability.architecture}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-control border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono">PEAK THROUGHPUT</span>
              <strong className="text-sm font-mono text-slate-900">
                {dossier.scalability.peakPacketThroughputPerSec.toLocaleString()} /s
              </strong>
              <span className="text-xs text-slate-500 block">Telemetry Packets</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-control border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono">EDGE BUFFER</span>
              <strong className="text-sm font-mono text-emerald-800">
                {dossier.scalability.edgeFailoverBufferHours} Hours
              </strong>
              <span className="text-xs text-slate-500 block">Local Flash Store</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-control border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block font-mono">GIS RENDERING</span>
              <strong className="text-sm font-mono text-slate-900">
                {dossier.scalability.gisLayerLatencyMs}ms
              </strong>
              <span className="text-xs text-slate-500 block">Sub-Second Raster</span>
            </div>
          </div>

          <div className="flex items-center text-xs text-slate-600 bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-control">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
            <span>Tested up to 500+ distributed LoRaWAN gateways with zero backend ingestion queue bottlenecks.</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DIMENSION 7: PROPOSED GEOGRAPHY WITH 3D TOPOLOGY         */}
      {/* "Use subtle depth/3D only where it improves              */}
      {/* understanding"                                           */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-control bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              7
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Proposed Geography & Multi-City Expansion Topology
              </h3>
              <p className="text-xs text-gov-muted">
                Statewide multi-city rollout: 6 Smart Cities • 380 Wards • 910 Sensor Nodes
              </p>
            </div>
          </div>

          <Badge variant="outline" className="font-mono text-xs text-gov-primary border-gov-primary/30 self-start sm:self-center">
            {dossier.proposedGeography.state} Statewide Corridor
          </Badge>
        </div>

        {/* Subtle 3D Spatial Topology Visualizer */}
        <ScaleUpSpatialTopology3D
          cities={dossier.proposedGeography.cities}
          selectedCityId={selectedCity.id}
          onSelectCity={(city) => setSelectedCity(city)}
        />

        {/* 3-Phase Implementation Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dossier.proposedGeography.implementationPhases.map((phase, idx) => (
            <div
              key={idx}
              className="bg-white border border-gov-border rounded-card p-3.5 shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-mono text-xs font-bold text-gov-primary">
                  {phase.timeline}
                </span>
                <span className="font-mono text-xs text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded-2xs border border-amber-200">
                  ₹{(phase.budgetInr / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{phase.phase}</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <span className="block font-medium">Target Municipalities:</span>
                <div className="flex flex-wrap gap-1">
                  {phase.targetCities.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500 pt-1 border-t border-slate-100">
                Sensor Pods: <strong className="text-slate-900">{phase.nodes} Nodes</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* DIMENSION 8: EXPANSION COST (DETAILED STATUTORY BUDGET)  */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              8
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Expansion Cost & Financial Allocation Plan
              </h3>
              <span className="text-xs text-gov-muted font-mono">
                Total Sanctioned Scale Budget: ₹3,85,00,000 (₹3.85 Crore)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div>
              <span className="text-gov-muted text-xs block">Per Resident / Year:</span>
              <strong className="font-mono text-emerald-800 text-xs">
                ₹{dossier.expansionCost.citizenPerCapitaCostInr.toFixed(2)}
              </strong>
            </div>
            <div>
              <span className="text-gov-muted text-xs block">Annual OPEX:</span>
              <strong className="font-mono text-slate-900 text-xs">
                ₹{(dossier.expansionCost.annualOperatingExpenditureInr / 100000).toFixed(1)}L
              </strong>
            </div>
          </div>
        </div>

        {/* Detailed Financial Ledger */}
        <div className="overflow-x-auto border border-gov-border rounded-control">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-xs">
                <th className="p-2.5">Code</th>
                <th className="p-2.5">Category & Description</th>
                <th className="p-2.5 text-right">Units</th>
                <th className="p-2.5 text-right">Rate (INR)</th>
                <th className="p-2.5 text-right">Total Allocation</th>
                <th className="p-2.5">Procurement Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {dossier.expansionCost.breakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-2.5 text-gov-muted font-semibold">{item.statutoryCode}</td>
                  <td className="p-2.5 font-sans font-medium text-slate-900">
                    <div>{item.category}</div>
                    <span className="text-xs text-slate-500 font-normal">
                      {item.description}
                    </span>
                  </td>
                  <td className="p-2.5 text-right text-slate-700">{item.units.toLocaleString()}</td>
                  <td className="p-2.5 text-right text-slate-700">₹{item.unitRateInr.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-bold text-gov-primary">
                    ₹{item.totalInr.toLocaleString()}
                  </td>
                  <td className="p-2.5 font-sans text-slate-600 text-xs">
                    {item.procurementMethod}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900">
                <td colSpan={4} className="p-2.5 text-right font-sans">
                  TOTAL ESTIMATED SCALE-UP BUDGET:
                </td>
                <td className="p-2.5 text-right text-amber-800 text-sm font-mono">
                  ₹{dossier.expansionCost.totalEstimatedBudgetInr.toLocaleString()}
                </td>
                <td className="p-2.5 text-xs font-sans text-gov-muted">
                  GFR 149 / State Sanction
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DIMENSION 9: LESSONS LEARNED                             */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-control bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
              9
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Empirical Lessons Learned for Scale-Up Deployment
              </h3>
              <span className="text-xs text-gov-muted font-mono">
                Lucknow 90-Day Operational Insights
              </span>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {dossier.lessonsLearned.length} Key Directives
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {dossier.lessonsLearned.map((lesson, idx) => (
            <div
              key={idx}
              className="p-3 rounded-control border border-slate-200 bg-slate-50/70 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gov-primary font-bold">
                  {lesson.domain}
                </span>
                <Badge
                  variant={lesson.priority === "CRITICAL" ? "destructive" : "warning"}
                  className="text-xs font-mono"
                >
                  {lesson.priority}
                </Badge>
              </div>
              <p className="text-xs text-slate-700">
                <strong className="text-slate-900">Observation:</strong> {lesson.observation}
              </p>
              <p className="text-xs text-gov-primary bg-blue-50/60 p-2 rounded-2xs border border-blue-100">
                <strong>Directive for Scale:</strong> {lesson.recommendationForScale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* STATUTORY DECISION AUDIT TRAIL                           */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gov-primary" />
            <h3 className="font-bold text-slate-900 text-sm">
              Statutory Scale-Up Decision Ledger & Audit Trail
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-bold">
            100% SHA-256 Digitally Signed
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {dossier.decisionHistory.map((dec) => (
            <div key={dec.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                    {dec.officerRole}
                  </Badge>
                  <strong className="text-slate-900 font-bold">{dec.decidedBy}</strong>
                  <span className="text-slate-300">•</span>
                  <span className="text-gov-muted text-xs">{dec.designation}</span>
                </div>
                <span className="text-xs font-mono text-gov-muted">{dec.timestamp}</span>
              </div>
              <p className="text-slate-800 text-xs bg-slate-50 p-2 rounded-control border border-slate-200">
                &ldquo;{dec.justification}&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-mono text-slate-500">
                <span>Action: <strong className="text-gov-primary">{dec.label}</strong></span>
                <span>•</span>
                <span>Budget: <strong>₹{(dec.sanctionedBudgetInr || 0).toLocaleString()}</strong></span>
                <span>•</span>
                <span className="truncate max-w-xs">{dec.digitalSignatureDigest}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: STATUTORY SCALE-UP ACTION EXECUTION               */}
      {/* ======================================================== */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-2xl w-full p-5 sm:p-6 space-y-4 text-left text-xs my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className={cn("w-3 h-3 rounded-full", actionModal.badgeColor)} />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {actionModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActionModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              {actionModal.description}
            </p>

            {/* Form Fields Based on Action */}
            <div className="space-y-3 pt-1">
              {actionModal.action === "START_SCALE_UP" && (
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1 font-mono">
                    Sanctioned Scale-Up Budget (INR):
                  </label>
                  <Input
                    type="number"
                    value={sanctionedBudget}
                    onChange={(e) => setSanctionedBudget(Number(e.target.value))}
                    className="font-mono text-xs"
                  />
                  <span className="text-xs text-gov-muted mt-0.5 block">
                    Sanctioned under GFR Rule 149 for 6 UP Smart Cities.
                  </span>
                </div>
              )}

              {actionModal.action === "REQUEST_ADDITIONAL_PILOT" && (
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1 font-mono">
                    Secondary Additional Testbed Scope & Conditions:
                  </label>
                  <Input
                    value={secondaryTestbedScope}
                    onChange={(e) => setSecondaryTestbedScope(e.target.value)}
                    className="text-xs"
                  />
                  <span className="text-xs text-gov-muted mt-0.5 block">
                    Specify environmental, duration, or sensor stress conditions required.
                  </span>
                </div>
              )}

              {actionModal.action === "MODIFY_RETEST" && (
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1 font-mono">
                    Mandatory Technical Modifications (One per line):
                  </label>
                  <Textarea
                    rows={3}
                    value={modificationsList}
                    onChange={(e) => setModificationsList(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              )}

              {/* Justification Field */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1 font-mono">
                  Statutory Committee Justification (Mandatory):
                </label>
                <Textarea
                  rows={4}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Provide detailed statutory rationale for this procurement decision..."
                  className="text-xs leading-relaxed"
                />
                <span className="text-xs text-gov-muted mt-0.5 block font-mono">
                  Minimum 20 characters required. Recorded permanently in state procurement audit trail.
                </span>
              </div>

              {/* Statutory Non-AI Human Confirmation Checkbox */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-control space-y-1.5">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHumanConfirmed}
                    onChange={(e) => setIsHumanConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-gov-primary focus:ring-gov-primary"
                  />
                  <div className="text-xs leading-tight text-amber-950">
                    <strong className="block font-bold">
                      Mandatory Human Decision-Maker Confirmation (GFR Rule 149)
                    </strong>
                    I confirm that I am an authorized government officer exercising statutory
                    discretion. This scale-up decision is made by an authorized human decision-maker
                    and has not been automated by AI algorithms.
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionModal(null)}
                className="text-xs h-8 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={submittingAction || !isHumanConfirmed}
                onClick={handleExecuteAction}
                className={cn(
                  "text-xs h-8 text-white font-semibold shadow-xs",
                  actionModal.badgeColor
                )}
              >
                {submittingAction ? "Recording Decision..." : "Sign & Record Statutory Decision"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
