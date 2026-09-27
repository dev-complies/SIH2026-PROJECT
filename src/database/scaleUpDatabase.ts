/**
 * Statutory Scale-Up Decision & Multi-City Expansion Database
 * Governs the complete scale-up workflow and lifecycle:
 * Pilot Completed -> Validation -> Scale-Up Review -> Procurement Review -> Scale
 * Under GFR Rule 149, DPDP Act 2023, and State Innovation Procurement Guidelines.
 */

export type ScaleUpLifecycleStage =
  | "PILOT_COMPLETED"
  | "VALIDATION"
  | "SCALE_UP_REVIEW"
  | "PROCUREMENT_REVIEW"
  | "SCALE";

export type ScaleUpDecisionAction =
  | "START_SCALE_UP"
  | "REQUEST_ADDITIONAL_PILOT"
  | "MODIFY_RETEST"
  | "CLOSE";

export interface ExpansionCityTarget {
  id: string;
  name: string;
  category: "Capital Hub" | "Industrial Corridor" | "Eco-Sensitive Heritage" | "NCR Border" | "Tirtha / Heritage";
  position3D: [number, number, number]; // Coordinates for subtle 3D spatial map
  targetWards: number;
  plannedNodes: number;
  estimatedCostInr: number;
  targetTimelineMonths: number;
  priorityLevel: "IMMEDIATE_PHASE_1" | "PHASE_2" | "PHASE_3";
  primaryAirPollutantFocus: string;
  municipalPartner: string;
  readinessScore: number; // 0-100
}

export interface ExpansionCostLineItem {
  category: string;
  description: string;
  units: number;
  unitRateInr: number;
  totalInr: number;
  procurementMethod: string;
  statutoryCode: string;
}

export interface ScaleUpDecisionRecord {
  id: string;
  action: ScaleUpDecisionAction;
  label: string;
  decidedBy: string;
  officerRole: string;
  designation: string;
  department: string;
  timestamp: string;
  justification: string;
  sanctionedBudgetInr?: number;
  targetGeographyScope?: string;
  secondaryPilotConditions?: string;
  modificationRequirements?: string[];
  digitalSignatureDigest: string;
  isHumanConfirmed: boolean;
}

export interface ScaleUpDossier {
  pilotId: string;
  pilotCode: string;
  pilotTitle: string;
  startupName: string;
  startupDpiit: string;
  currentStage: ScaleUpLifecycleStage;
  lastUpdated: string;

  // 1. Pilot Results
  pilotResults: {
    overallAttainment: number; // 94.2%
    uptimeActual: number; // 99.4%
    uptimeTarget: number; // 99.0%
    accuracyR2Actual: number; // 0.95
    accuracyR2Target: number; // 0.90
    coverageActualSqKm: number; // 48
    coverageTargetSqKm: number; // 45
    latencyActualSec: number; // 4.8
    latencyTargetSec: number; // 15
    alertSpeedMins: number; // 2.1
    packetsProcessed: number; // 1,420,800
    summary: string;
  };

  // 2. Validation
  validation: {
    status: "VALIDATED" | "PARTIALLY_VALIDATED" | "NOT_VALIDATED";
    agency: string;
    leadValidator: string;
    auditDate: string;
    r2Score: number;
    sensorAccuracyRating: string;
    keyFindings: string[];
    recognizedLimitations: string[];
    certificateSha256: string;
  };

  // 3. Cost (Pilot vs Scale Economics)
  cost: {
    pilotTotalBudgetInr: number; // 24,50,000
    pilotDisbursedInr: number; // 18,00,000
    costPerWardPilotInr: number; // 2,04,166
    costPerWardScaleInr: number; // 48,125
    savingsVsLegacyPercentage: number; // 98.3%
    legacyCaaqmsCostPerStationInr: number; // 1,20,00,000
    paybackPeriodMonths: number; // 4.2
    costBenefitRatio: string; // 1:7.4
  };

  // 4. Risks
  risks: {
    title: string;
    category: "Hardware Longevity" | "Environmental" | "Telecom / Network" | "Vendor Lock-in" | "Procurement";
    severity: "LOW" | "MEDIUM" | "HIGH";
    mitigation: string;
    residualRisk: "LOW" | "ACCEPTABLE";
  }[];

  // 5. Compliance
  compliance: {
    gfr149Status: "COMPLIANT" | "VERIFIED";
    gfr149Note: string;
    dpdpAct2023Status: "VERIFIED_COMPLIANT";
    dpdpNote: string;
    makeInIndiaLocalContent: number; // 68.5% (Class-1 Local Supplier >= 50%)
    cpcbGuidelinesClass: string;
    isoCertifications: string[];
    securityAuditClearance: string;
  };

  // 6. Scalability
  scalability: {
    architecture: string;
    peakPacketThroughputPerSec: number; // 25,000
    subSecondAlertCapability: boolean;
    distributedGatewaysSupported: number; // 500+
    cloudSLA: string; // 99.95%
    edgeFailoverBufferHours: number; // 48 hrs local flash
    gisLayerLatencyMs: number; // 140ms
  };

  // 7. Proposed Geography
  proposedGeography: {
    state: string;
    totalTargetWards: number;
    totalTargetCities: number;
    totalSensorNodes: number;
    cities: ExpansionCityTarget[];
    implementationPhases: {
      phase: string;
      timeline: string;
      targetCities: string[];
      nodes: number;
      budgetInr: number;
    }[];
  };

  // 8. Expansion Cost
  expansionCost: {
    totalEstimatedBudgetInr: number; // 3,85,00,000 (3.85 Cr)
    annualOperatingExpenditureInr: number; // 38,00,000
    contingencyReserveInr: number; // 19,65,000
    citizenPerCapitaCostInr: number; // 2.10 / resident / year
    breakdown: ExpansionCostLineItem[];
  };

  // 9. Lessons Learned
  lessonsLearned: {
    domain: string;
    observation: string;
    recommendationForScale: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM";
  }[];

  // Decision & Audit History
  decisionHistory: ScaleUpDecisionRecord[];
}

export const INITIAL_SCALE_UP_DOSSIER: ScaleUpDossier = {
  pilotId: "PILOT-UP-UAQ-01",
  pilotCode: "PILOT-UP-UAQ-01",
  pilotTitle: "Urban Air Quality Monitoring — Lucknow Pilot",
  startupName: "AirSense Technologies Pvt Ltd",
  startupDpiit: "DIPP-94812",
  currentStage: "SCALE_UP_REVIEW",
  lastUpdated: new Date().toISOString(),

  // 1. Pilot Results
  pilotResults: {
    overallAttainment: 94.2,
    uptimeActual: 99.4,
    uptimeTarget: 99.0,
    accuracyR2Actual: 0.95,
    accuracyR2Target: 0.90,
    coverageActualSqKm: 48,
    coverageTargetSqKm: 45,
    latencyActualSec: 4.8,
    latencyTargetSec: 15.0,
    alertSpeedMins: 2.1,
    packetsProcessed: 1420800,
    summary:
      "The 90-day Lucknow municipal testbed successfully validated continuous optical particulate monitoring across 12 wards, exceeding uptime and telemetry benchmarks while detecting 31 localized industrial and vehicular combustion hotspots.",
  },

  // 2. Validation
  validation: {
    status: "VALIDATED",
    agency: "The Energy and Resources Institute (TERI) & IIT Kanpur",
    leadValidator: "Dr. Alok Gupta & Priya Nair",
    auditDate: "24 Sep 2026",
    r2Score: 0.95,
    sensorAccuracyRating: "Class-A Field Reliability",
    keyFindings: [
      "Continuous 90-day physical collocation alongside CPCB BAM-1020 reference monitor demonstrated R² = 0.95 (PM2.5) and R² = 0.92 (PM10).",
      "Dynamic baseline auto-calibration effectively eliminated optical chamber drift within ±2.5% tolerance.",
      "48-hour solar lithium backup successfully prevented telemetry data loss across 8 municipal power grid shedding events.",
    ],
    recognizedLimitations: [
      "Severe winter fog/smog events with relative humidity exceeding 90% require heated inlet tubes to prevent optical droplet scattering.",
      "Narrow heritage alleyways in historic wards (Chowk) require elevated municipal sub-station LoRaWAN gateway repeaters.",
    ],
    certificateSha256: "8e5926c483a99281a0b388d92f71884029486c91a0c793f18e932b17a10f823d",
  },

  // 3. Cost
  cost: {
    pilotTotalBudgetInr: 2450000,
    pilotDisbursedInr: 1800000,
    costPerWardPilotInr: 204166,
    costPerWardScaleInr: 48125,
    savingsVsLegacyPercentage: 98.3,
    legacyCaaqmsCostPerStationInr: 12000000,
    paybackPeriodMonths: 4.2,
    costBenefitRatio: "1:7.4",
  },

  // 4. Risks
  risks: [
    {
      title: "Optical chamber humidity saturation during monsoon and winter fog (>90% RH)",
      category: "Environmental",
      severity: "MEDIUM",
      mitigation: "State-wide procurement specifications mandate PTC heated inlet tubes and polynomial hygroscopic correction algorithms.",
      residualRisk: "LOW",
    },
    {
      title: "LoRaWAN spectrum congestion in dense high-rise commercial corridors",
      category: "Telecom / Network",
      severity: "LOW",
      mitigation: "Hybrid dual-backhaul with dual SIM 4G/5G Narrowband-IoT fallback on every 4th aggregator node.",
      residualRisk: "LOW",
    },
    {
      title: "Proprietary sensor hardware lock-in across long-term 5-year concession",
      category: "Vendor Lock-in",
      severity: "MEDIUM",
      mitigation: "All telemetry APIs, payload decoders, and GIS layers standardized to open OGC / MQTT SensorThings standards under open-source civic license.",
      residualRisk: "ACCEPTABLE",
    },
    {
      title: "Electrochemical gas sensor degradation beyond 24 months operating lifespan",
      category: "Hardware Longevity",
      severity: "MEDIUM",
      mitigation: "Concession agreement establishes mandatory 24-month plug-and-play cartridge hot-swap replacement covered under vendor comprehensive SLA.",
      residualRisk: "LOW",
    },
  ],

  // 5. Compliance
  compliance: {
    gfr149Status: "COMPLIANT",
    gfr149Note: "Eligible for preferential startup public procurement without prior turnover or experience hurdles under GFR 149(v) & DPIIT notifications.",
    dpdpAct2023Status: "VERIFIED_COMPLIANT",
    dpdpNote: "Sensor telemetry contains zero personally identifiable information (PII). All spatial data cryptographically salted and anonymized at edge.",
    makeInIndiaLocalContent: 68.5,
    cpcbGuidelinesClass: "CPCB Guidelines for Real-Time Low-Cost Ambient Air Quality Sensors (Class-A Indigenized)",
    isoCertifications: ["ISO 9001:2015", "ISO/IEC 27001:2022", "CE / RoHS Certified"],
    securityAuditClearance: "CERT-In empaneled agency audit completed with zero critical vulnerabilities.",
  },

  // 6. Scalability
  scalability: {
    architecture: "Edge-to-Cloud Distributed Microservices (Docker / Kubernetes on State Data Centre)",
    peakPacketThroughputPerSec: 25000,
    subSecondAlertCapability: true,
    distributedGatewaysSupported: 500,
    cloudSLA: "99.95% Annual Uptime",
    edgeFailoverBufferHours: 48,
    gisLayerLatencyMs: 140,
  },

  // 7. Proposed Geography
  proposedGeography: {
    state: "Uttar Pradesh",
    totalTargetWards: 380,
    totalTargetCities: 6,
    totalSensorNodes: 910,
    cities: [
      {
        id: "city-lko",
        name: "Lucknow",
        category: "Capital Hub",
        position3D: [0, 0.4, 0], // Center hub
        targetWards: 80,
        plannedNodes: 320,
        estimatedCostInr: 12800000,
        targetTimelineMonths: 3,
        priorityLevel: "IMMEDIATE_PHASE_1",
        primaryAirPollutantFocus: "PM2.5, PM10, NOx (Vehicular & Winter Smog)",
        municipalPartner: "Lucknow Municipal Corporation (LMC)",
        readinessScore: 98,
      },
      {
        id: "city-knp",
        name: "Kanpur",
        category: "Industrial Corridor",
        position3D: [-2.2, 0.3, 1.2],
        targetWards: 110,
        plannedNodes: 180,
        estimatedCostInr: 7200000,
        targetTimelineMonths: 5,
        priorityLevel: "IMMEDIATE_PHASE_1",
        primaryAirPollutantFocus: "SO2, VOCs, Heavy Particulates (Tanneries & Panki Thermal)",
        municipalPartner: "Kanpur Nagar Nigam",
        readinessScore: 92,
      },
      {
        id: "city-agr",
        name: "Agra",
        category: "Eco-Sensitive Heritage",
        position3D: [-3.8, 0.35, -1.8],
        targetWards: 70,
        plannedNodes: 130,
        estimatedCostInr: 5600000,
        targetTimelineMonths: 6,
        priorityLevel: "PHASE_2",
        primaryAirPollutantFocus: "SO2, Acid Mist, PM2.5 (Taj Trapezium Zone Protection)",
        municipalPartner: "Agra Municipal Corporation",
        readinessScore: 89,
      },
      {
        id: "city-vns",
        name: "Varanasi",
        category: "Tirtha / Heritage",
        position3D: [3.4, 0.25, 2.1],
        targetWards: 60,
        plannedNodes: 110,
        estimatedCostInr: 4800000,
        targetTimelineMonths: 7,
        priorityLevel: "PHASE_2",
        primaryAirPollutantFocus: "PM2.5, Incense / Biomass Combustion (Heritage Ghats)",
        municipalPartner: "Varanasi Smart City Limited",
        readinessScore: 94,
      },
      {
        id: "city-pry",
        name: "Prayagraj",
        category: "Tirtha / Heritage",
        position3D: [1.8, 0.2, 2.8],
        targetWards: 60,
        plannedNodes: 90,
        estimatedCostInr: 4100000,
        targetTimelineMonths: 8,
        priorityLevel: "PHASE_3",
        primaryAirPollutantFocus: "Sand Dust, Vehicular Congestion (Civil Lines & Sangam)",
        municipalPartner: "Prayagraj Mela Pradhikaran & Nagar Nigam",
        readinessScore: 86,
      },
      {
        id: "city-ghz",
        name: "Ghaziabad",
        category: "NCR Border",
        position3D: [-4.6, 0.45, -3.2],
        targetWards: 80,
        plannedNodes: 140,
        estimatedCostInr: 6000000,
        targetTimelineMonths: 9,
        priorityLevel: "PHASE_3",
        primaryAirPollutantFocus: "PM2.5, Industrial Fugitive Emissions (Sahibabad / Delhi NCR)",
        municipalPartner: "Ghaziabad Nagar Nigam",
        readinessScore: 91,
      },
    ],
    implementationPhases: [
      {
        phase: "Phase 1: State Capital & Major Industrial Hub",
        timeline: "Months 1 - 4",
        targetCities: ["Lucknow (80 Wards)", "Kanpur (110 Wards)"],
        nodes: 500,
        budgetInr: 20000000,
      },
      {
        phase: "Phase 2: Eco-Sensitive & Heritage Corridors",
        timeline: "Months 5 - 7",
        targetCities: ["Agra (TTZ Zone)", "Varanasi (Smart Ghats)"],
        nodes: 240,
        budgetInr: 10400000,
      },
      {
        phase: "Phase 3: NCR Border & Sangam Hubs",
        timeline: "Months 8 - 10",
        targetCities: ["Ghaziabad (NCR)", "Prayagraj"],
        nodes: 170,
        budgetInr: 8100000,
      },
    ],
  },

  // 8. Expansion Cost
  expansionCost: {
    totalEstimatedBudgetInr: 38500000, // ₹3.85 Crore
    annualOperatingExpenditureInr: 3800000,
    contingencyReserveInr: 1965000,
    citizenPerCapitaCostInr: 2.1,
    breakdown: [
      {
        category: "Sensor Hardware Units",
        description: "910 Class-A Indigenized OPC & Multi-Gas Sensor Pods with heated inlets and solar mounts",
        units: 910,
        unitRateInr: 28500,
        totalInr: 25935000,
        procurementMethod: "GeM Startup Runway Direct Contract (GFR 149)",
        statutoryCode: "CAPEX-HW-01",
      },
      {
        category: "LoRaWAN Gateways & Mast Infrastructure",
        description: "IP67 Outdoor 8-channel LoRaWAN high-elevation gateways with directional repeaters",
        units: 45,
        unitRateInr: 50000,
        totalInr: 2250000,
        procurementMethod: "Open State e-Procurement Tender",
        statutoryCode: "CAPEX-GW-02",
      },
      {
        category: "Field Deployment & Smart Pole Integration",
        description: "Municipal pole clamp brackets, surge protection units, and physical certified electrician installations",
        units: 910,
        unitRateInr: 3000,
        totalInr: 2730000,
        procurementMethod: "Municipal Engineering Works Rate Contract",
        statutoryCode: "WORKS-DEP-03",
      },
      {
        category: "State Data Centre Cloud & Edge Broker",
        description: "3-year high-availability MQTT ingestion, PostGIS database cluster, and municipal dashboard SLA",
        units: 36,
        unitRateInr: 105555,
        totalInr: 3800000,
        procurementMethod: "State IT Mission (UPDESCO / NIC Hosting)",
        statutoryCode: "OPEX-CLOUD-04",
      },
      {
        category: "NABL Bi-Annual Calibration & Audit Reserve",
        description: "Third-party annual sensor collocation verification, mobile calibration chamber field runs",
        units: 6,
        unitRateInr: 303333,
        totalInr: 1820000,
        procurementMethod: "NABL / TERI Empaneled Testing Contract",
        statutoryCode: "AUDIT-CALIB-05",
      },
      {
        category: "Statutory Contingency & Spare Replacements",
        description: "5% strategic reserve for weather-damaged units and urban transit vandalism protection",
        units: 1,
        unitRateInr: 1965000,
        totalInr: 1965000,
        procurementMethod: "Contingency Fund Sanction",
        statutoryCode: "CONT-STAT-06",
      },
    ],
  },

  // 9. Lessons Learned
  lessonsLearned: [
    {
      domain: "Meteorological Sensor Physics",
      observation: "North Indian winter fog (December-January) elevates relative humidity above 90%, triggering hygroscopic optical particle swelling.",
      recommendationForScale: "Mandate PTC heated inlet sampling chambers and dynamic polynomial algorithm correction across all 910 scale-up nodes.",
      priority: "CRITICAL",
    },
    {
      domain: "Urban RF Topology & Heritage Corridors",
      observation: "High-density brick masonry in medieval heritage wards (Chowk, Lalbagh) attenuates 865 MHz LoRa signals by 18 dB.",
      recommendationForScale: "Place gateways on municipal overhead water reservoirs and electrical sub-stations at minimum 25m elevation.",
      priority: "HIGH",
    },
    {
      domain: "Power Resiliency & Load Shedding",
      observation: "Scheduled municipal line maintenance caused 6-hour power outages on streetlights without warning.",
      recommendationForScale: "All scale nodes must include minimum 48-hour solar lithium-iron-phosphate (LiFePO4) reserve batteries.",
      priority: "HIGH",
    },
    {
      domain: "Citizen Engagement & False Alarm Prevention",
      observation: "Short-lived point-source smoke (e.g. tandoor or road sweeping) caused transient AQI spikes leading to citizen distress.",
      recommendationForScale: "Implement a 3-minute rolling time-window smoothing algorithm before triggering automated citizen public advisories.",
      priority: "MEDIUM",
    },
  ],

  // Decision & Audit History
  decisionHistory: [
    {
      id: "DEC-PREV-01",
      action: "START_SCALE_UP",
      label: "Preliminary Scale-Up Review Endorsement",
      decidedBy: "Rajesh Verma",
      officerRole: "GOVERNMENT_OFFICER",
      designation: "Joint Director, Urban Development",
      department: "Directorate of Urban Development, Govt of UP",
      timestamp: "26 Sep 2026, 14:15 IST",
      justification:
        "The Lucknow pilot successfully surpassed all statutory performance metrics with 99.4% node uptime and R² = 0.95 CPCB BAM correlation. Recommended proceeding to Scale-Up Review and multi-city expansion planning under GFR 149.",
      sanctionedBudgetInr: 38500000,
      targetGeographyScope: "80 Lucknow Wards + 5 UP Smart Cities (Kanpur, Agra, Varanasi, Prayagraj, Ghaziabad)",
      digitalSignatureDigest: "SHA256:d8a927c3e1b4...881f",
      isHumanConfirmed: true,
    },
  ],
};

class ScaleUpDatabase {
  private dossier: ScaleUpDossier;

  constructor() {
    this.dossier = { ...INITIAL_SCALE_UP_DOSSIER };
  }

  public getDossier(pilotId?: string): ScaleUpDossier {
    return { ...this.dossier };
  }

  public recordDecision(
    pilotId: string,
    action: ScaleUpDecisionAction,
    payload: {
      justification: string;
      sanctionedBudgetInr?: number;
      targetGeographyScope?: string;
      secondaryPilotConditions?: string;
      modificationRequirements?: string[];
      isHumanConfirmed: boolean;
    },
    officer: {
      name: string;
      role: string;
      designation?: string;
      department?: string;
    }
  ): { success: boolean; dossier?: ScaleUpDossier; error?: string } {
    // 1. Role validation
    const validRoles = ["GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "ADMIN"];
    if (!validRoles.includes(officer.role.toUpperCase().replace(/\s+/g, "_"))) {
      return {
        success: false,
        error: "Forbidden: Only authorized Government Officers, Procurement Officers, or Platform Admins can record statutory scale-up decisions.",
      };
    }

    // 2. Action validation
    const validActions: ScaleUpDecisionAction[] = [
      "START_SCALE_UP",
      "REQUEST_ADDITIONAL_PILOT",
      "MODIFY_RETEST",
      "CLOSE",
    ];
    if (!validActions.includes(action)) {
      return {
        success: false,
        error: `Invalid action '${action}'. Must be one of: START_SCALE_UP, REQUEST_ADDITIONAL_PILOT, MODIFY_RETEST, CLOSE.`,
      };
    }

    // 3. AI Prohibition - Human confirmation check
    if (!payload.isHumanConfirmed) {
      return {
        success: false,
        error: "Statutory Violation: Scale-up decisions cannot be automated by AI algorithms. Explicit human decision-maker confirmation is strictly required under GFR Rule 149.",
      };
    }

    // 4. Justification check
    if (!payload.justification || payload.justification.trim().length < 20) {
      return {
        success: false,
        error: "Statutory justification is required (minimum 20 characters).",
      };
    }

    // Determine lifecycle transition based on action
    let nextStage: ScaleUpLifecycleStage = this.dossier.currentStage;
    let actionLabel = "";

    switch (action) {
      case "START_SCALE_UP":
        nextStage = "PROCUREMENT_REVIEW";
        actionLabel = "Start Scale-Up (Transitioned to Procurement Review)";
        break;
      case "REQUEST_ADDITIONAL_PILOT":
        nextStage = "VALIDATION";
        actionLabel = "Request Additional Pilot (Secondary Testbed Ordered)";
        break;
      case "MODIFY_RETEST":
        nextStage = "SCALE_UP_REVIEW";
        actionLabel = "Modify & Retest (Engineering Revisions Required)";
        break;
      case "CLOSE":
        nextStage = "SCALE_UP_REVIEW";
        actionLabel = "Close Pilot (Concluded Without Scaling)";
        break;
    }

    const digest = `SHA256:${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    const newRecord: ScaleUpDecisionRecord = {
      id: `DEC-${Date.now().toString(36).toUpperCase()}`,
      action,
      label: actionLabel,
      decidedBy: officer.name,
      officerRole: officer.role,
      designation: officer.designation || "Authorized Officer",
      department: officer.department || "Government of Uttar Pradesh",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      justification: payload.justification,
      sanctionedBudgetInr: payload.sanctionedBudgetInr || this.dossier.expansionCost.totalEstimatedBudgetInr,
      targetGeographyScope: payload.targetGeographyScope || "80 Lucknow Wards + 5 UP Smart Cities",
      secondaryPilotConditions: payload.secondaryPilotConditions,
      modificationRequirements: payload.modificationRequirements,
      digitalSignatureDigest: digest,
      isHumanConfirmed: true,
    };

    this.dossier.currentStage = nextStage;
    this.dossier.lastUpdated = new Date().toISOString();
    this.dossier.decisionHistory.unshift(newRecord);

    return {
      success: true,
      dossier: { ...this.dossier },
    };
  }

  public resetToDefaults(): void {
    this.dossier = { ...INITIAL_SCALE_UP_DOSSIER };
  }
}

export const scaleUpDb = new ScaleUpDatabase();
