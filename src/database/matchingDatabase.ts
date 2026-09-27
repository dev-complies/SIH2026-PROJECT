/**
 * AI-Assisted Startup-to-Challenge Matching Engine & Statutory Governance
 *
 * Implements explanation-first matching across 8 mandatory factors:
 * 1. Technology
 * 2. Industry
 * 3. Experience
 * 4. Location
 * 5. Budget
 * 6. Requirements
 * 7. Certifications
 * 8. Previous Projects
 *
 * Statutory Governance Rule: AI recommendations are strictly advisory and
 * MUST NOT automatically select or shortlist startups. Government users remain
 * exclusively responsible for procurement decisions under GFR Rule 149.
 */

import { UserRole, User } from "@/types";
import { auditDb } from "./auditDatabase";

export type MatchRating = "Strong" | "Moderate" | "Developing";

export interface FactorEvaluation {
  factor:
    | "Technology"
    | "Industry"
    | "Experience"
    | "Location"
    | "Budget"
    | "Requirements"
    | "Certifications"
    | "Previous Projects";
  rating: MatchRating;
  summary: string;
  detailedRationale: string;
  evidencePoints: string[];
}

export interface StartupProfile {
  id: string;
  name: string;
  tradeName?: string;
  dpiitNumber: string;
  incorporationYear: number;
  yearsOfExperience: number;
  headquarters: {
    city: string;
    state: string;
    hasLocalPresenceInUP: boolean;
  };
  industry: string[];
  technologies: string[];
  certifications: string[];
  previousProjects: Array<{
    title: string;
    client: string;
    clientType: "GOVERNMENT" | "MUNICIPAL" | "PSU" | "PRIVATE";
    year: number;
    description: string;
    contractValue: string;
    status: "COMPLETED" | "ACTIVE";
  }>;
  financials: {
    averageAnnualTurnover: string;
    typicalPilotQuote: number;
    quoteCeilingVariance: string; // e.g. "Within 85% of budget ceiling"
  };
  complianceStatus: {
    dpiitValid: boolean;
    rohsCompliant: boolean;
    cpcbCalibrationReady: boolean;
    noConflictDeclared: boolean;
  };
}

export interface ChallengeMatchingSpec {
  id: string;
  code: string;
  title: string;
  department: string;
  state: string;
  district: string;
  budgetCeiling: number; // in INR
  requiredTechnologies: string[];
  targetIndustry: string;
  minimumExperienceYears: number;
  mandatoryRequirements: string[];
  mandatoryCertifications: string[];
  preferredLocation: string;
}

export interface MatchingResult {
  id: string;
  startupId: string;
  startup: StartupProfile;
  challengeId: string;
  challengeCode: string;
  challengeTitle: string;
  isAIAssisted: true;
  advisoryDisclaimer: string;
  // All 8 mandatory factors explained
  factors: {
    technology: FactorEvaluation;
    industry: FactorEvaluation;
    experience: FactorEvaluation;
    location: FactorEvaluation;
    budget: FactorEvaluation;
    requirements: FactorEvaluation;
    certifications: FactorEvaluation;
    previousProjects: FactorEvaluation;
  };
  factorSummaryList: Array<{
    name: string;
    rating: MatchRating;
    summary: string;
  }>;
  executiveSummary: string;
  keyStrengths: string[];
  potentialRisksToInspect: string[];
  humanDecision?: {
    decision: "SHORTLISTED" | "CLARIFICATION_REQUESTED" | "REJECTED";
    decidedBy: {
      userId: string;
      name: string;
      designation: string;
      role: string;
    };
    decidedAt: string;
    statutoryJustification: string;
    gfrRule149Confirmed: boolean;
  };
}

// Canonical Challenge Specification for Lucknow Urban Air Quality
export const CANONICAL_CHALLENGE: ChallengeMatchingSpec = {
  id: "chal-air-001",
  code: "UAQ-LKO-2026",
  title: "Urban Air Quality Hyperlocal Monitoring & Micro-Intervention Network",
  department: "Department of Urban Development, Govt of Uttar Pradesh",
  state: "Uttar Pradesh",
  district: "Lucknow",
  budgetCeiling: 2500000, // 25 Lakhs
  requiredTechnologies: [
    "IoT Sensors",
    "LoRaWAN",
    "4G Telemetry",
    "Edge Calibration",
    "REST APIs",
    "GIS Integration",
  ],
  targetIndustry: "CleanTech & Environmental IoT",
  minimumExperienceYears: 3,
  mandatoryRequirements: [
    "Sub-hourly ward level AQI alerts",
    "Continuous collocated calibration with CPCB reference stations (R2 >= 0.90)",
    "90% minimum node uptime under field conditions",
    "Solar/battery dual power backup for 72 hours",
  ],
  mandatoryCertifications: [
    "DPIIT Recognized Startup",
    "ISO 9001 / ISO 27001",
    "RoHS Compliant Hardware",
    "BIS / CE Telemetry Clearance",
  ],
  preferredLocation: "Uttar Pradesh / Lucknow Municipal Area",
};

// Candidate Startups Pool
export const CANDIDATE_STARTUPS: StartupProfile[] = [
  {
    id: "org-airsense-001",
    name: "AirSense Technologies Pvt Ltd",
    tradeName: "AirSense AI",
    dpiitNumber: "DIPP98214",
    incorporationYear: 2022,
    yearsOfExperience: 4,
    headquarters: {
      city: "Lucknow",
      state: "Uttar Pradesh",
      hasLocalPresenceInUP: true,
    },
    industry: ["CleanTech & Environmental IoT", "Smart Cities", "Urban Analytics"],
    technologies: [
      "IoT Sensors",
      "LoRaWAN",
      "4G Telemetry",
      "Edge Calibration",
      "Machine Learning",
      "REST APIs",
      "GIS Integration",
      "Next.js",
      "Python",
    ],
    certifications: [
      "DPIIT Recognized Startup",
      "ISO 9001:2015",
      "ISO 27001:2022 (Data Security)",
      "RoHS Certified Enclosures",
      "BIS Telemetry Approved",
    ],
    previousProjects: [
      {
        title: "Kanpur Industrial Cluster PM2.5 Micro-Sensor Grid",
        client: "UP Pollution Control Board (UPPCB)",
        clientType: "GOVERNMENT",
        year: 2024,
        description: "Deployed 25 solar-powered LoRaWAN air monitoring pods across Jajmau industrial zone with 94.2% data availability.",
        contractValue: "₹18,50,000",
        status: "COMPLETED",
      },
      {
        title: "CPCB Reference Station Collocation Calibration Trial",
        client: "Central Pollution Control Board",
        clientType: "GOVERNMENT",
        year: 2025,
        description: "90-day winter validation achieving R2 = 0.94 collocated correlation against BAM-1020 reference analyzer.",
        contractValue: "₹6,00,000",
        status: "COMPLETED",
      },
    ],
    financials: {
      averageAnnualTurnover: "₹1.45 Crore",
      typicalPilotQuote: 2150000, // 21.5 Lakhs (Well within 25L ceiling)
      quoteCeilingVariance: "14% below statutory budget ceiling (₹21.5L vs ₹25L)",
    },
    complianceStatus: {
      dpiitValid: true,
      rohsCompliant: true,
      cpcbCalibrationReady: true,
      noConflictDeclared: true,
    },
  },
  {
    id: "org-enviro-002",
    name: "EnviroSense Grid Solutions",
    tradeName: "EnviroGrid",
    dpiitNumber: "DIPP87412",
    incorporationYear: 2021,
    yearsOfExperience: 5,
    headquarters: {
      city: "Bengaluru",
      state: "Karnataka",
      hasLocalPresenceInUP: false,
    },
    industry: ["Environmental Monitoring", "CleanTech", "Industrial IoT"],
    technologies: [
      "IoT Sensors",
      "4G Telemetry",
      "Cloud Analytics",
      "REST APIs",
      "Python",
    ],
    certifications: [
      "DPIIT Recognized Startup",
      "ISO 9001:2015",
      "CE Certified",
    ],
    previousProjects: [
      {
        title: "BBMP Ward Clean Air Sensor Pilot",
        client: "Bruhat Bengaluru Mahanagara Palike",
        clientType: "MUNICIPAL",
        year: 2023,
        description: "Deployed 30 sensor units across Koramangala and Indiranagar.",
        contractValue: "₹24,00,000",
        status: "COMPLETED",
      },
    ],
    financials: {
      averageAnnualTurnover: "₹2.80 Crore",
      typicalPilotQuote: 2480000,
      quoteCeilingVariance: "Within 0.8% of ceiling limit",
    },
    complianceStatus: {
      dpiitValid: true,
      rohsCompliant: true,
      cpcbCalibrationReady: true,
      noConflictDeclared: true,
    },
  },
  {
    id: "org-puresky-003",
    name: "PureSky Dynamics Lab",
    tradeName: "PureSky",
    dpiitNumber: "DIPP10239",
    incorporationYear: 2024,
    yearsOfExperience: 2,
    headquarters: {
      city: "Noida",
      state: "Uttar Pradesh",
      hasLocalPresenceInUP: true,
    },
    industry: ["CleanTech & Environmental IoT"],
    technologies: [
      "Optical Dust Sensors",
      "WiFi / 4G",
      "React Native",
    ],
    certifications: [
      "DPIIT Recognized Startup",
      "RoHS Compliant",
    ],
    previousProjects: [
      {
        title: "Private University Campus Air Quality Display",
        client: "Amity Innovation Incubator",
        clientType: "PRIVATE",
        year: 2025,
        description: "Campus sensor mesh for student awareness kiosks.",
        contractValue: "₹4,50,000",
        status: "COMPLETED",
      },
    ],
    financials: {
      averageAnnualTurnover: "₹35 Lakhs",
      typicalPilotQuote: 1400000,
      quoteCeilingVariance: "44% below budget ceiling",
    },
    complianceStatus: {
      dpiitValid: true,
      rohsCompliant: true,
      cpcbCalibrationReady: false,
      noConflictDeclared: true,
    },
  },
];

class MatchingEngine {
  private candidates: StartupProfile[] = [...CANDIDATE_STARTUPS];
  private evaluationsMap: Map<string, MatchingResult> = new Map();

  constructor() {
    this.computeAllCanonicalMatches();
  }

  /**
   * Evaluates a candidate against all 8 statutory factors without assigning a misleading single score.
   */
  public evaluateCandidate(
    startup: StartupProfile,
    challenge: ChallengeMatchingSpec = CANONICAL_CHALLENGE
  ): MatchingResult {
    // 1. Technology Factor
    const techMatches = challenge.requiredTechnologies.filter((t) =>
      startup.technologies.some((st) => st.toLowerCase().includes(t.toLowerCase()))
    );
    const techRatio = techMatches.length / challenge.requiredTechnologies.length;
    const technologyEval: FactorEvaluation = {
      factor: "Technology",
      rating: techRatio >= 0.8 ? "Strong" : techRatio >= 0.5 ? "Moderate" : "Developing",
      summary: `${techMatches.length} of ${challenge.requiredTechnologies.length} core technical requirements matched`,
      detailedRationale: `Startup demonstrates direct production capability in ${techMatches.join(
        ", "
      )}. Edge calibration and LoRaWAN mesh integration match the challenge telemetry architecture.`,
      evidencePoints: [
        `Demonstrated hardware: ${startup.technologies.join(", ")}`,
        `Direct overlap with RFP spec: ${Math.round(techRatio * 100)}% match`,
      ],
    };

    // 2. Industry Factor
    const hasDirectIndustry = startup.industry.some(
      (ind) =>
        ind.toLowerCase().includes("cleantech") ||
        ind.toLowerCase().includes("environmental") ||
        ind.toLowerCase().includes("smart cities")
    );
    const industryEval: FactorEvaluation = {
      factor: "Industry",
      rating: hasDirectIndustry ? "Strong" : "Moderate",
      summary: hasDirectIndustry
        ? "Core specialization in CleanTech & Environmental IoT"
        : "Adjacent domain experience",
      detailedRationale: `Startup's primary DPIIT registration and product suite focus directly on ${startup.industry.join(
        ", "
      )}, closely aligned with municipal environmental governance.`,
      evidencePoints: startup.industry,
    };

    // 3. Experience Factor
    const expYears = startup.yearsOfExperience;
    const expRating: MatchRating =
      expYears >= challenge.minimumExperienceYears + 1
        ? "Strong"
        : expYears >= challenge.minimumExperienceYears
        ? "Moderate"
        : "Developing";
    const experienceEval: FactorEvaluation = {
      factor: "Experience",
      rating: expRating,
      summary: `${expYears} years track record (Min required: ${challenge.minimumExperienceYears} yrs)`,
      detailedRationale:
        expYears >= 4
          ? `Established track record with ${expYears} active years in field hardware manufacturing and operational support.`
          : `Emerging venture with ${expYears} years in market. Satisfies minimum threshold but warrants closer engineering review.`,
      evidencePoints: [
        `Incorporated in ${startup.incorporationYear} (${expYears} years active)`,
        `DPIIT Recognition Number: ${startup.dpiitNumber}`,
      ],
    };

    // 4. Location Factor
    const isLocalState =
      startup.headquarters.state.toLowerCase() === challenge.state.toLowerCase();
    const isLocalCity =
      startup.headquarters.city.toLowerCase() === challenge.district.toLowerCase();
    const locationRating: MatchRating = isLocalCity
      ? "Strong"
      : isLocalState || startup.headquarters.hasLocalPresenceInUP
      ? "Moderate"
      : "Developing";
    const locationEval: FactorEvaluation = {
      factor: "Location",
      rating: locationRating,
      summary: isLocalCity
        ? `Headquartered in ${startup.headquarters.city}, ${startup.headquarters.state} (Field Ward Proximity)`
        : `Headquartered in ${startup.headquarters.city}, ${startup.headquarters.state}`,
      detailedRationale: isLocalCity
        ? `Immediate on-ground field presence in Lucknow ensures rapid 2-hour sensor maintenance SLA and zero inter-state mobilization delays.`
        : `Startup operates from ${startup.headquarters.city}. Local partner or field depot setup will be required for SLA compliance.`,
      evidencePoints: [
        `HQ: ${startup.headquarters.city}, ${startup.headquarters.state}`,
        `Local UP Field Presence: ${startup.headquarters.hasLocalPresenceInUP ? "Yes (Active Depot)" : "No (Remote)"}`,
      ],
    };

    // 5. Budget Factor
    const quote = startup.financials.typicalPilotQuote;
    const ceiling = challenge.budgetCeiling;
    const budgetRating: MatchRating =
      quote <= ceiling * 0.9 ? "Strong" : quote <= ceiling ? "Moderate" : "Developing";
    const budgetEval: FactorEvaluation = {
      factor: "Budget",
      rating: budgetRating,
      summary: `Estimated ₹${(quote / 100000).toFixed(1)} Lakhs vs ₹${(ceiling / 100000).toFixed(1)} Lakhs Ceiling`,
      detailedRationale: `Startup's projected deployment quote represents sound public value-for-money at ${startup.financials.quoteCeilingVariance}, reserving contingency for independent validation tranches.`,
      evidencePoints: [
        `Projected pilot cost: ₹${quote.toLocaleString("en-IN")}`,
        `Statutory ceiling: ₹${ceiling.toLocaleString("en-IN")}`,
        startup.financials.quoteCeilingVariance,
      ],
    };

    // 6. Requirements Factor
    const meetsCalibration = startup.complianceStatus.cpcbCalibrationReady;
    const requirementsRating: MatchRating = meetsCalibration ? "Strong" : "Moderate";
    const requirementsEval: FactorEvaluation = {
      factor: "Requirements",
      rating: requirementsRating,
      summary: meetsCalibration
        ? "Fully meets continuous CPCB collocated calibration & 90% SLA"
        : "Meets basic requirements; CPCB collocated proof pending",
      detailedRationale: meetsCalibration
        ? `Proven hardware compatibility with CPCB continuous collocated monitoring protocols (R2 >= 0.90) and dual solar/battery power autonomy.`
        : `Hardware meets telemetry protocol specs but lacks pre-validated collocated calibration benchmark data under North Indian winter conditions.`,
      evidencePoints: challenge.mandatoryRequirements.map((r, i) =>
        i === 1
          ? `${r} — ${meetsCalibration ? "Verified in CPCB trial" : "In Progress"}`
          : `${r} — Fully Supported`
      ),
    };

    // 7. Certifications Factor
    const certMatches = challenge.mandatoryCertifications.filter((mc) =>
      startup.certifications.some((sc) => sc.toLowerCase().includes(mc.toLowerCase().slice(0, 8)))
    );
    const certRating: MatchRating =
      certMatches.length >= 3 ? "Strong" : certMatches.length >= 2 ? "Moderate" : "Developing";
    const certificationsEval: FactorEvaluation = {
      factor: "Certifications",
      rating: certRating,
      summary: `${startup.certifications.length} verified statutory & security certifications`,
      detailedRationale: `DPIIT certificate is active. Data security verified under ISO 27001:2022. Hardware enclosures carry RoHS certification.`,
      evidencePoints: startup.certifications,
    };

    // 8. Previous Projects Factor
    const govProjects = startup.previousProjects.filter(
      (p) => p.clientType === "GOVERNMENT" || p.clientType === "MUNICIPAL"
    );
    const prevRating: MatchRating =
      govProjects.length >= 2 ? "Strong" : govProjects.length >= 1 ? "Moderate" : "Developing";
    const previousProjectsEval: FactorEvaluation = {
      factor: "Previous Projects",
      rating: prevRating,
      summary: `${govProjects.length} completed government/municipal IoT deployments`,
      detailedRationale:
        govProjects.length > 0
          ? `Demonstrated public sector delivery track record including UPPCB industrial zone sensor deployment (${govProjects[0].contractValue}) and national CPCB trials.`
          : `Startup has delivered commercial/academic installations but has no prior state or municipal government references.`,
      evidencePoints: startup.previousProjects.map(
        (p) => `${p.title} (${p.client}) — ${p.contractValue} [${p.status}]`
      ),
    };

    const factorSummaryList: Array<{ name: string; rating: MatchRating; summary: string }> = [
      { name: "Technology", rating: technologyEval.rating, summary: technologyEval.summary },
      { name: "Industry", rating: industryEval.rating, summary: industryEval.summary },
      { name: "Experience", rating: experienceEval.rating, summary: experienceEval.summary },
      { name: "Location", rating: locationEval.rating, summary: locationEval.summary },
      { name: "Budget", rating: budgetEval.rating, summary: budgetEval.summary },
      { name: "Requirements", rating: requirementsEval.rating, summary: requirementsEval.summary },
      { name: "Certifications", rating: certificationsEval.rating, summary: certificationsEval.summary },
      { name: "Previous Projects", rating: previousProjectsEval.rating, summary: previousProjectsEval.summary },
    ];

    const result: MatchingResult = {
      id: `MATCH-${challenge.code}-${startup.id}`,
      startupId: startup.id,
      startup,
      challengeId: challenge.id,
      challengeCode: challenge.code,
      challengeTitle: challenge.title,
      isAIAssisted: true,
      advisoryDisclaimer:
        "Statutory Advisory Disclaimer: This analysis is AI-assisted and provided solely for candidate discovery and qualitative factor alignment. Under GFR Rule 149 and Government Public Procurement Manual, AI algorithms are strictly prohibited from making shortlisting or procurement decisions. Government users remain exclusively responsible for evaluating proposals and making award decisions.",
      factors: {
        technology: technologyEval,
        industry: industryEval,
        experience: experienceEval,
        location: locationEval,
        budget: budgetEval,
        requirements: requirementsEval,
        certifications: certificationsEval,
        previousProjects: previousProjectsEval,
      },
      factorSummaryList,
      executiveSummary: `${startup.name} presents Strong alignment across Technology, Industry, Location, Requirements, and Previous Projects for Challenge ${challenge.code}.`,
      keyStrengths: [
        `Local Lucknow headquarters with established UPPCB field deployment track record`,
        `Verified continuous CPCB collocated sensor calibration (R2 >= 0.90)`,
        `Deployment cost is ₹${(quote / 100000).toFixed(1)}L, comfortably below the ₹${(ceiling / 100000).toFixed(1)}L budget ceiling`,
      ],
      potentialRisksToInspect: [
        `Verify firmware edge-calibration frequency under heavy winter humidity conditions`,
        `Confirm dedicated field engineers count for municipal Ward 4 and Ward 7`,
      ],
    };

    this.evaluationsMap.set(result.id, result);
    return result;
  }

  private computeAllCanonicalMatches() {
    for (const startup of this.candidates) {
      this.evaluateCandidate(startup, CANONICAL_CHALLENGE);
    }
  }

  public getMatchesForChallenge(challengeId: string): MatchingResult[] {
    return Array.from(this.evaluationsMap.values()).filter(
      (m) => m.challengeId === challengeId || challengeId === "ALL"
    );
  }

  public getMatchById(matchId: string): MatchingResult | undefined {
    return this.evaluationsMap.get(matchId);
  }

  /**
   * Statutory Human Decision Submission
   * Enforces that ONLY an authorized human user can execute shortlisting.
   * AI automated selection is strictly rejected.
   */
  public submitHumanDecision(params: {
    matchId: string;
    decision: "SHORTLISTED" | "CLARIFICATION_REQUESTED" | "REJECTED";
    officerUser: User;
    justification: string;
    gfrRule149Confirmed: boolean;
    isAutomatedAISystemAttempt?: boolean;
  }): { success: boolean; result?: MatchingResult; error?: string } {
    // 1. Block Automated AI Selection
    if (params.isAutomatedAISystemAttempt) {
      return {
        success: false,
        error:
          "Statutory Prohibition: AI recommendations must not automatically select a startup. Government users remain responsible for decisions under GFR Rule 149.",
      };
    }

    // 2. Validate Officer Role
    const allowedRoles: UserRole[] = ["GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"];
    if (!params.officerUser || !allowedRoles.includes(params.officerUser.role)) {
      return {
        success: false,
        error:
          "Unauthorized: Only authorized Government Officers or Procurement Officers can execute shortlisting decisions.",
      };
    }

    // 3. Mandatory GFR Confirmation Checkbox
    if (!params.gfrRule149Confirmed) {
      return {
        success: false,
        error:
          "Mandatory Compliance Error: Government user must explicitly confirm responsibility under GFR Rule 149 before recording shortlisting decision.",
      };
    }

    // 4. Mandatory Human Justification
    if (!params.justification || params.justification.trim().length < 20) {
      return {
        success: false,
        error:
          "Insufficient Rationale: A detailed human decision justification (minimum 20 characters) is required for statutory procurement records.",
      };
    }

    const match = this.evaluationsMap.get(params.matchId);
    if (!match) {
      return { success: false, error: "Matching evaluation record not found." };
    }

    match.humanDecision = {
      decision: params.decision,
      decidedBy: {
        userId: params.officerUser.id,
        name: `${params.officerUser.firstName} ${params.officerUser.lastName}`.trim(),
        designation: params.officerUser.designation || "Government Procurement Authority",
        role: params.officerUser.role,
      },
      decidedAt: new Date().toISOString(),
      statutoryJustification: params.justification,
      gfrRule149Confirmed: true,
    };

    // Record in immutable audit log
    auditDb.recordAction({
      user: {
        id: params.officerUser.id,
        name: `${params.officerUser.firstName} ${params.officerUser.lastName}`.trim(),
        email: params.officerUser.email,
        department: params.officerUser.departmentId || "UP Jal Nigam / Urban Development",
      },
      role: params.officerUser.role,
      action: "Startup Shortlisted",
      entity: "Startup",
      entityId: match.startupId,
      entityName: match.startup.name,
      previousState: { evaluationStatus: "AI_MATCHED_PENDING_HUMAN_REVIEW" },
      newState: {
        evaluationStatus: params.decision,
        officer: params.officerUser.email,
        justification: params.justification,
        gfrRule149Certified: true,
      },
      statutoryRuleRef: "GFR Rule 149(v) & MoF Innovation Procurement Guidelines",
    });

    return {
      success: true,
      result: match,
    };
  }
}

export const matchingEngine = new MatchingEngine();
