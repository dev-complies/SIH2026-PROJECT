/**
 * AI-Assisted Risk Analysis Engine
 *
 * Identifies potential risks grounded strictly in available challenge, startup,
 * pilot, and evidence information across 6 categories:
 * 1. Technical Risks
 * 2. Operational Risks
 * 3. Data Risks
 * 4. Cybersecurity Risks
 * 5. Financial Risks
 * 6. Timeline Risks
 *
 * For every suggested risk, provides:
 * - Risk (statement / title)
 * - Why it was identified (grounded in challenge, startup, pilot, or evidence facts)
 * - Potential impact
 * - Suggested mitigation
 * - Clearly labeled: "AI-generated risk suggestion."
 *
 * Statutory Governance Rule:
 * AI recommendations are strictly advisory and MUST NOT automatically change risk
 * status or make procurement decisions. Government officers retain exclusive responsibility.
 */

import { User } from "@/types";
import { auditDb } from "./auditDatabase";
import { insertRisk } from "./riskIssueDatabase";

export type AIRiskCategory =
  | "Technical Risks"
  | "Operational Risks"
  | "Data Risks"
  | "Cybersecurity Risks"
  | "Financial Risks"
  | "Timeline Risks";

export interface GroundedEvidenceRef {
  sourceType: "CHALLENGE" | "STARTUP" | "PILOT" | "EVIDENCE";
  title: string;
  referenceId: string;
  excerpt: string;
}

export interface AIRiskSuggestion {
  id: string;
  category: AIRiskCategory;
  risk: string; // The risk title and statement
  whyIdentified: string; // Factual justification based on challenge, startup, pilot, evidence
  groundingSources: GroundedEvidenceRef[];
  potentialImpact: string;
  suggestedMitigation: string;
  suggestedProbability: number; // 1-5
  suggestedImpact: number; // 1-5
  suggestedRiskScore: number; // probability * impact
  label: "AI-generated risk suggestion.";
  status: "AI_SUGGESTION_PENDING_HUMAN_REVIEW" | "ADOPTED_INTO_REGISTER" | "DISMISSED";
  adoptedRiskId?: string;
  reviewedBy?: {
    userId: string;
    name: string;
    designation: string;
    role: string;
  };
  reviewedAt?: string;
  humanReviewNote?: string;
}

export const MANDATORY_AI_RISK_CATEGORIES: AIRiskCategory[] = [
  "Technical Risks",
  "Operational Risks",
  "Data Risks",
  "Cybersecurity Risks",
  "Financial Risks",
  "Timeline Risks",
];

export const AI_SUGGESTION_LABEL = "AI-generated risk suggestion.";

// Seeded AI Risk Suggestions grounded in Lucknow Air Quality Pilot & AirSense Technologies
const INITIAL_AI_RISK_SUGGESTIONS: AIRiskSuggestion[] = [
  // 1. Technical Risks
  {
    id: "AI-RSK-001",
    category: "Technical Risks",
    risk: "Laser Optical Diode Signal Drift Under Extreme Winter Fog & Humidity Inversion (>90% RH)",
    whyIdentified:
      "Grounded in Challenge RFP UAQ-LKO-2026 specifying winter smog evaluation, combined with Evidence Record EVID-2026-001 showing ambient relative humidity exceeding 92% in Ward 18 (Charbagh). High condensation risks micro-droplet refraction in the optical chamber, causing uncalibrated particulate spikes.",
    groundingSources: [
      {
        sourceType: "CHALLENGE",
        title: "RFP UAQ-LKO-2026 Winter Inversion Specification",
        referenceId: "CHAL-UP-DUD-001",
        excerpt: "Pilot must operate through peak winter temperature inversions with continuous CPCB collocation accuracy.",
      },
      {
        sourceType: "EVIDENCE",
        title: "Ward 18 Collocation Humidity Telemetry Log",
        referenceId: "EVID-2026-001",
        excerpt: "December 03: Relative humidity sustained at 92.4% with fog condensation near Talkatora canal.",
      },
    ],
    potentialImpact:
      "False particulate alerts triggering unneeded municipal misting truck deployments, accompanied by temporary divergence from CPCB reference monitors below the statutory R2 >= 0.90 threshold.",
    suggestedMitigation:
      "Activate automated positive-pressure cyclonic thermal purge cycle every 90 minutes. Deploy dynamic humidity-compensation firmware baseline calibrated against the Talkatora reference BAM-1020 analyzer.",
    suggestedProbability: 3,
    suggestedImpact: 4,
    suggestedRiskScore: 12,
    label: "AI-generated risk suggestion.",
    status: "AI_SUGGESTION_PENDING_HUMAN_REVIEW",
  },

  // 2. Operational Risks
  {
    id: "AI-RSK-002",
    category: "Operational Risks",
    risk: "Municipal Street Utility Pole Mounting Permission Delays & Bucket-Truck Access Bottlenecks",
    whyIdentified:
      "Grounded in Pilot Plan specifying mounting of 40 sensor nodes at 4.5 meters on municipal street-light poles across high-traffic wards (Hazratganj & Charbagh). Requires joint coordination between Lucknow Nagar Nigam electrical engineers and traffic police.",
    groundingSources: [
      {
        sourceType: "PILOT",
        title: "Lucknow Pilot Deployment Plan (Phase 1)",
        referenceId: "PILOT-UP-UAQ-2026-01",
        excerpt: "Mount 40 sensor units on Nagar Nigam utility poles at 4.5m elevation to prevent pedestrian interference.",
      },
      {
        sourceType: "STARTUP",
        title: "AirSense Hardware Installation Manual",
        referenceId: "org-airsense-001",
        excerpt: "Node installation requires certified hydraulic bucket lift vehicle and traffic corridor escort.",
      },
    ],
    potentialImpact:
      "Mounting delays in congested municipal wards could prolong Phase 1 rollout by 12–15 days, eroding the seasonal winter testing window and impacting milestone uptime SLAs.",
    suggestedMitigation:
      "Establish an expedited inter-departmental clearance protocol with Lucknow Nagar Nigam Electrical Division; designate 2 dedicated municipal bucket trucks for scheduled night-time installations (11 PM - 4 AM).",
    suggestedProbability: 3,
    suggestedImpact: 3,
    suggestedRiskScore: 9,
    label: "AI-generated risk suggestion.",
    status: "AI_SUGGESTION_PENDING_HUMAN_REVIEW",
  },

  // 3. Data Risks
  {
    id: "AI-RSK-003",
    category: "Data Risks",
    risk: "Telemetry Packet Drop and Historical Telemetry Fragmentation in Cellular Shadow Zones",
    whyIdentified:
      "Grounded in Startup Technical Proposal specifying primary transmission via NB-IoT/4G cellular, cross-referenced with Pilot telemetry records showing 4.8% packet loss in densely packed alleyways of Ward 22 (Aminabad heritage quarter).",
    groundingSources: [
      {
        sourceType: "STARTUP",
        title: "Proposal Technical Architecture (Section 2)",
        referenceId: "APP-2026-UAQ-001",
        excerpt: "Primary data backhaul via cellular NB-IoT SIM with auxiliary 865 MHz LoRaWAN mesh fallback.",
      },
      {
        sourceType: "EVIDENCE",
        title: "Ward 22 Weekly Telemetry Packet Audit",
        referenceId: "EVID-2026-004",
        excerpt: "Ward 22 Node 07 experienced packet drop during evening peak traffic due to cellular carrier tower congestion.",
      },
    ],
    potentialImpact:
      "Gaps in sub-hourly continuous telemetry logs, potentially disqualifying the 14-day continuous validation benchmark required for Milestone 2 escrow disbursement.",
    suggestedMitigation:
      "Activate the secondary LoRaWAN 865 MHz peer-to-peer relay mesh for shielded nodes. Configure onboard non-volatile flash storage to buffer up to 14 days of sensor readings with automatic store-and-forward sync upon cellular signal recovery.",
    suggestedProbability: 3,
    suggestedImpact: 3,
    suggestedRiskScore: 9,
    label: "AI-generated risk suggestion.",
    status: "AI_SUGGESTION_PENDING_HUMAN_REVIEW",
  },

  // 4. Cybersecurity Risks
  {
    id: "AI-RSK-004",
    category: "Cybersecurity Risks",
    risk: "Edge Microcontroller Firmware Tampering and Telemetry Spoofing on Public Utility Infrastructure",
    whyIdentified:
      "Grounded in Challenge RFP requirement for direct REST API integration into the municipal Smart City ICCC dashboard, combined with startup hardware architecture utilizing ARM Cortex-M4 microcontrollers mounted on public thoroughfares without external hardware security modules (HSM).",
    groundingSources: [
      {
        sourceType: "CHALLENGE",
        title: "Smart City ICCC Integration Security Checklist",
        referenceId: "CHAL-UP-DUD-001",
        excerpt: "All external telemetry streams must comply with CERT-In guidelines and municipal SCADA protection rules.",
      },
      {
        sourceType: "STARTUP",
        title: "AirSense Sensor Firmware Architecture Spec",
        referenceId: "org-airsense-001",
        excerpt: "Telemetry packets transmitted via HTTPS POST endpoints; firmware updates executed via over-the-air binary flash.",
      },
    ],
    potentialImpact:
      "Adversarial tampering or unauthorized API spoofing could inject fabricated particulate spikes, triggering unnecessary city-wide anti-pollution emergency measures or damaging public institutional trust.",
    suggestedMitigation:
      "Implement mutual TLS (mTLS) with per-node X.509 client certificates stored in write-protected microcontroller memory. Enforce cryptographically signed firmware binaries verified via SHA-256 bootloader checks prior to flashing.",
    suggestedProbability: 2,
    suggestedImpact: 5,
    suggestedRiskScore: 10,
    label: "AI-generated risk suggestion.",
    status: "AI_SUGGESTION_PENDING_HUMAN_REVIEW",
  },

  // 5. Financial Risks
  {
    id: "AI-RSK-005",
    category: "Financial Risks",
    risk: "Startup Working Capital Strain from Delayed Milestone Tranche Disbursement",
    whyIdentified:
      "Grounded in Startup Financial Profile (annual turnover ₹1.45 Crore, team size 18) and Pilot Escrow Agreement where Tranche 2 (40% / ₹8.8 Lakhs) is subject to multi-stage departmental voucher clearance between Municipal Accounts and Treasury.",
    groundingSources: [
      {
        sourceType: "STARTUP",
        title: "DPIIT Annual Financial Disclosure",
        referenceId: "org-airsense-001",
        excerpt: "Annual operating turnover ₹1.45 Cr with monthly fixed burn rate of ₹6.2 Lakhs.",
      },
      {
        sourceType: "PILOT",
        title: "PFMS Tranche Disbursement Schedule",
        referenceId: "PILOT-UP-UAQ-2026-01",
        excerpt: "Tranche 2 disbursement requires dual sign-off from Joint Director (Urban) and Chief Procurement Officer.",
      },
    ],
    potentialImpact:
      "Cash flow bottleneck impacting procurement of optical replacement components or slowing field maintenance technician dispatch during critical operational phases.",
    suggestedMitigation:
      "Fast-track PFMS milestone verification through digital invoice endorsement; establish a statutory 5-working-day clearance turnaround standard upon independent validator milestone approval.",
    suggestedProbability: 3,
    suggestedImpact: 3,
    suggestedRiskScore: 9,
    label: "AI-generated risk suggestion.",
    status: "AI_SUGGESTION_PENDING_HUMAN_REVIEW",
  },

  // 6. Timeline Risks
  {
    id: "AI-RSK-006",
    category: "Timeline Risks",
    risk: "Compressed Winter Smog Window Threatening Final 90-Day Validation Sign-Off",
    whyIdentified:
      "Grounded in Challenge RFP seasonal condition (evaluating peak winter smog inversion between November and February) and Pilot milestone timeline ending in late February, leaving zero buffer for weather-induced calibration delays.",
    groundingSources: [
      {
        sourceType: "CHALLENGE",
        title: "RFP Seasonal Inversion Requirement",
        referenceId: "CHAL-UP-DUD-001",
        excerpt: "The 90-day pilot evaluation must capture active North Indian winter temperature inversion events.",
      },
      {
        sourceType: "PILOT",
        title: "Master Pilot Milestone Calendar",
        referenceId: "PILOT-UP-UAQ-2026-01",
        excerpt: "Final Milestone 3 comprehensive evaluation scheduled for completion on 28 February.",
      },
    ],
    potentialImpact:
      "If Milestone 1 baseline calibration slips by even 10 days, the pilot will miss the peak particulate inversion window, necessitating a multi-month extension into summer when atmospheric dust dynamics differ fundamentally.",
    suggestedMitigation:
      "Run parallel 24-hour dual-shift collocation calibration during Days 1–10 to lock baseline correlation early. Hold weekly bilateral operational reviews between Municipal Nodal Officer and Startup CTO.",
    suggestedProbability: 3,
    suggestedImpact: 4,
    suggestedRiskScore: 12,
    label: "AI-generated risk suggestion.",
    status: "AI_SUGGESTION_PENDING_HUMAN_REVIEW",
  },
];

class AIRiskAnalysisEngine {
  private suggestions: AIRiskSuggestion[] = [...INITIAL_AI_RISK_SUGGESTIONS];

  public getAllSuggestions(categoryFilter?: string): AIRiskSuggestion[] {
    if (!categoryFilter || categoryFilter === "ALL") {
      return [...this.suggestions];
    }
    return this.suggestions.filter((s) => s.category === categoryFilter);
  }

  public getSuggestionById(id: string): AIRiskSuggestion | undefined {
    return this.suggestions.find((s) => s.id === id);
  }

  /**
   * Statutory Human Adoption of AI Risk Suggestion into Official Register
   *
   * Enforces that ONLY a human authorized officer can adopt or alter risk status.
   * AI automated status modification is strictly blocked.
   */
  public adoptSuggestionIntoOfficialRegister(params: {
    suggestionId: string;
    humanOfficerUser: User;
    mitigationAction: string;
    assignedOwner: string;
    customDueDate?: string;
    isAutomatedAISystemAttempt?: boolean;
  }): { success: boolean; suggestion?: AIRiskSuggestion; officialRiskId?: string; error?: string } {
    // 1. Block Automated AI Status Mutation
    if (params.isAutomatedAISystemAttempt) {
      return {
        success: false,
        error:
          "Statutory Prohibition: AI recommendations must not automatically change risk status or make procurement decisions under GFR Rule 149.",
      };
    }

    // 2. Validate Officer Role
    const allowedRoles = ["GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"];
    if (!params.humanOfficerUser || !allowedRoles.includes(params.humanOfficerUser.role)) {
      return {
        success: false,
        error:
          "Unauthorized: Only authorized Government Officers or Procurement Officers can adopt risks into the statutory register.",
      };
    }

    const suggestion = this.getSuggestionById(params.suggestionId);
    if (!suggestion) {
      return { success: false, error: "AI Risk suggestion not found." };
    }

    // Map AI category to riskIssueDatabase category
    const categoryMapping: Record<AIRiskCategory, any> = {
      "Technical Risks": "Technical",
      "Operational Risks": "Operational",
      "Data Risks": "Data",
      "Cybersecurity Risks": "Cybersecurity",
      "Financial Risks": "Financial",
      "Timeline Risks": "Timeline",
    };

    // Insert into official human-managed risk register
    const insertedRisk = insertRisk({
      category: categoryMapping[suggestion.category] || "Technical",
      title: suggestion.risk,
      description: `[Adopted from AI Suggestion ${suggestion.id}] ${suggestion.whyIdentified}\n\nPotential Impact: ${suggestion.potentialImpact}`,
      probability: suggestion.suggestedProbability,
      impact: suggestion.suggestedImpact,
      owner: params.assignedOwner || `${params.humanOfficerUser.firstName} ${params.humanOfficerUser.lastName} (Nodal Officer)`,
      mitigation: params.mitigationAction || suggestion.suggestedMitigation,
      status: "Mitigating",
      dueDate: params.customDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      pilotId: "PILOT-UP-UAQ-01",
    });

    // Update suggestion status with human reviewer stamp
    suggestion.status = "ADOPTED_INTO_REGISTER";
    suggestion.adoptedRiskId = insertedRisk.id;
    suggestion.reviewedBy = {
      userId: params.humanOfficerUser.id,
      name: `${params.humanOfficerUser.firstName} ${params.humanOfficerUser.lastName}`.trim(),
      designation: params.humanOfficerUser.designation || "Government Nodal Authority",
      role: params.humanOfficerUser.role,
    };
    suggestion.reviewedAt = new Date().toISOString();
    suggestion.humanReviewNote = `Officially approved by ${params.humanOfficerUser.firstName} ${params.humanOfficerUser.lastName}. Transcribed to statutory register as ${insertedRisk.id}.`;

    // Record statutory audit entry
    auditDb.recordAction({
      user: {
        id: params.humanOfficerUser.id,
        name: `${params.humanOfficerUser.firstName} ${params.humanOfficerUser.lastName}`.trim(),
        email: params.humanOfficerUser.email,
        department: params.humanOfficerUser.departmentId || "UP Jal Nigam",
      },
      role: params.humanOfficerUser.role,
      action: "Risk Mitigated",
      entity: "Pilot",
      entityId: insertedRisk.id,
      entityName: suggestion.risk,
      previousState: { status: "AI_SUGGESTION_ADVISORY" },
      newState: {
        status: "OFFICIALLY_ADOPTED_INTO_REGISTER",
        assignedOwner: insertedRisk.owner,
        mitigationAction: insertedRisk.mitigation,
        gfrRule149Compliant: true,
      },
      statutoryRuleRef: "GFR Rule 149 & Public Procurement Risk Framework",
    });

    return {
      success: true,
      suggestion,
      officialRiskId: insertedRisk.id,
    };
  }

  /**
   * Dismiss an AI Suggestion with human reasoning
   */
  public dismissSuggestion(params: {
    suggestionId: string;
    humanOfficerUser: User;
    dismissalReason: string;
    isAutomatedAISystemAttempt?: boolean;
  }): { success: boolean; suggestion?: AIRiskSuggestion; error?: string } {
    if (params.isAutomatedAISystemAttempt) {
      return {
        success: false,
        error: "Statutory Prohibition: AI cannot autonomously dismiss suggestions.",
      };
    }

    const suggestion = this.getSuggestionById(params.suggestionId);
    if (!suggestion) {
      return { success: false, error: "Suggestion not found." };
    }

    suggestion.status = "DISMISSED";
    suggestion.reviewedBy = {
      userId: params.humanOfficerUser.id,
      name: `${params.humanOfficerUser.firstName} ${params.humanOfficerUser.lastName}`.trim(),
      designation: params.humanOfficerUser.designation || "Government Officer",
      role: params.humanOfficerUser.role,
    };
    suggestion.reviewedAt = new Date().toISOString();
    suggestion.humanReviewNote = `Dismissed by ${params.humanOfficerUser.firstName} ${params.humanOfficerUser.lastName}: ${params.dismissalReason}`;

    return {
      success: true,
      suggestion,
    };
  }
}

export const aiRiskEngine = new AIRiskAnalysisEngine();
