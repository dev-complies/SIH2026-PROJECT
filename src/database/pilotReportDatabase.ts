/**
 * Professional Pilot Report Database & Executive Decision Ledger
 * Governs complete 14-section executive pilot reports for state procurement committees.
 * Enforces human-only decision making (no AI auto-procurement) under GFR Rule 149.
 */

export type RecommendationOption = "Scale" | "Extend Pilot" | "Modify & Retest" | "Close";

export interface KpiComparisonItem {
  id: string;
  metricName: string;
  category: string;
  baseline: string;
  target: string;
  actual: string;
  unit: string;
  status: "EXCEEDED" | "MET" | "UNMET";
  attainmentPercentage: number;
  significance: string;
  dataSource: string;
}

export interface PilotEvidenceReference {
  id: string;
  title: string;
  category: string;
  size: string;
  sha256: string;
  verifiedBy: string;
  uploadDate: string;
}

export interface PilotCostItem {
  tranche: string;
  milestoneCode: string;
  amount: number;
  status: "PAID" | "APPROVED" | "PENDING" | "REMAINING";
  invoiceNumber?: string;
  treasuryRef?: string;
  description: string;
}

export interface PilotRiskSummaryItem {
  area: string; // Technical, Financial, Operational, etc.
  riskTitle: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  mitigation: string;
  currentStatus: "MITIGATED" | "ACTIVE" | "MONITORED";
}

export interface PilotIssueSummaryItem {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  resolution: string;
  status: "RESOLVED" | "CLOSED" | "IN_PROGRESS";
}

export interface DecisionMakerRecommendation {
  option: RecommendationOption;
  enteredBy: string;
  role: string;
  designation: string;
  department: string;
  enteredAt: string; // ISO timestamp
  justification: string;
  targetScaleScope?: string; // e.g. "80 Municipal Wards across Lucknow"
  authorizedBudgetInr?: number;
  digitalSignatureDigest: string;
  isHumanConfirmed: boolean;
}

export interface PilotReportData {
  id: string;
  pilotId: string;
  pilotCode: string;
  title: string;
  subtitle: string;
  jurisdiction: string;
  department: string;
  startupName: string;
  startupDpiit: string;
  duration: string;
  period: string;
  overallStatus: "SUCCESSFULLY_COMPLETED" | "ACTIVE" | "VALIDATED";
  executiveVerdict: string;
  reportDate: string;

  // 14 MANDATORY PROMPT SECTIONS:
  // 1. Executive Summary
  executiveSummary: {
    overview: string;
    keyHighlights: string[];
    contractValue: number;
    disbursedTotal: number;
    overallAttainment: number;
    verdictSummary: string;
  };

  // 2. Problem
  problem: {
    civicContext: string;
    statusQuoFailure: string;
    healthEconomicBurden: string;
    regulatoryUrgency: string;
  };

  // 3. Solution
  solution: {
    technologyDescription: string;
    hardwareArchitecture: string;
    softwareAndAiStack: string;
    intellectualProperty: string;
    vendorCredentials: string;
  };

  // 4. Pilot Methodology
  pilotMethodology: {
    deploymentFramework: string;
    collocationProtocol: string;
    geographicalSampling: string;
    qaQcProcedures: string;
    referenceAnalyzer: string;
  };

  // 5. Baseline
  baseline: {
    description: string;
    observationWindow: string;
    historicalDataSources: string;
    coverageBaseline: string;
    accuracyBaseline: string;
    uptimeBaseline: string;
    responseLatencyBaseline: string;
  };

  // 6. KPIs (Shows clear: Baseline -> Target -> Actual)
  kpis: KpiComparisonItem[];

  // 7. Results
  results: {
    empiricalSummary: string;
    regressionCorrelationR2: number;
    meanAbsolutePercentageError: number;
    interventionsTriggeredCount: number;
    exposureReductionEstimate: string;
    statisticalConfidence: string;
  };

  // 8. Evidence
  evidence: {
    totalRecordsCount: number;
    integrityStatus: string;
    artifacts: PilotEvidenceReference[];
    vaultReferenceUrl: string;
  };

  // 9. Costs
  costs: {
    totalContractValue: number;
    paidAmount: number;
    approvedAmount: number;
    pendingAmount: number;
    remainingAmount: number;
    perUnitCostInr: number;
    traditionalStationCostInr: number;
    savingsMultiplier: string;
    costLedger: PilotCostItem[];
  };

  // 10. Risks
  risks: PilotRiskSummaryItem[];

  // 11. Issues
  issues: PilotIssueSummaryItem[];

  // 12. Validation
  validation: {
    accreditedAgency: string;
    leadAuditor: string;
    certificationOutcome: "Validated" | "Partially Validated" | "Not Validated";
    auditStandard: string;
    certificationDate: string;
    auditorSummary: string;
    certificateHash: string;
  };

  // 13. Lessons Learned
  lessonsLearned: {
    technicalTakeaways: string[];
    operationalTakeaways: string[];
    procurementSpecificationsForScale: string[];
  };

  // 14. Recommendation (Explicitly entered by authorized decision-maker)
  recommendation: DecisionMakerRecommendation | null;
  auditTrail: Array<{
    timestamp: string;
    actor: string;
    action: string;
    note: string;
  }>;
}

const INITIAL_REPORT_DATA: PilotReportData = {
  id: "REP-UP-UAQ-01",
  pilotId: "PILOT-UP-UAQ-01",
  pilotCode: "PILOT-UP-UAQ-01",
  title: "Urban Air Quality Hyperlocal Monitoring Pilot",
  subtitle: "Final Performance Evaluation & Statutory Procurement Briefing",
  jurisdiction: "Lucknow Municipal Corporation, Uttar Pradesh",
  department: "Directorate of Urban Development & Smart City Mission",
  startupName: "AirSense Technologies Pvt Ltd",
  startupDpiit: "DIPP98214",
  duration: "90 Days",
  period: "01 May 2026 – 30 Jul 2026",
  overallStatus: "VALIDATED",
  executiveVerdict: "Recommended for City-Wide Scaling across remaining 76 wards of Lucknow under GFR Rule 149.",
  reportDate: "27 September 2026",

  // 1. Executive Summary
  executiveSummary: {
    overview:
      "This executive report details the outcomes of the 90-day municipal testbed deployment of 40 hyperlocal optical air quality monitoring nodes across Lucknow Municipal Wards 14 (Hazratganj), 18 (Alambagh), 22 (Gomti Nagar), and 29 (Chowk). Deployed by DPIIT-recognized startup AirSense Technologies under the Uttar Pradesh Urban Innovation Procurement Policy 2024, the system was subjected to rigorous empirical collocation alongside Central Pollution Control Board (CPCB) reference analyzers.",
    keyHighlights: [
      "Linear regression correlation R² of 0.94 achieved against CPCB BAM-1020 reference analyzer (exceeding contractual benchmark of R² ≥ 0.90).",
      "Ward geographic sensing coverage expanded from baseline 35.0% to 88.5% (target ≥ 85.0%).",
      "Fleet operational availability maintained at 97.2% uptime across extreme summer heat (46.5°C) and monsoon humidity.",
      "Successfully integrated with Lucknow ICCC to trigger 18 automated municipal misting truck deployments within 16.4 minutes average response time.",
      "Achieved an estimated 85% capital expenditure reduction relative to traditional CAAQMS monitoring infrastructure.",
    ],
    contractValue: 2450000,
    disbursedTotal: 1150000,
    overallAttainment: 104.2,
    verdictSummary: "The technology has demonstrated empirical maturity, reliability, and cost-efficiency. Independent accredited testing by TERI has certified the system as VALIDATED.",
  },

  // 2. Problem
  problem: {
    civicContext:
      "Lucknow consistently ranks among the most particulate-stressed urban agglomerations in the Indo-Gangetic Plain. Ambient PM2.5 and PM10 levels frequently spike 4 to 8 times above National Ambient Air Quality Standards (NAAQS), particularly during thermal inversion and construction seasons.",
    statusQuoFailure:
      "Prior to this pilot, the city relied on only four continuous ambient air quality monitoring stations (CAAQMS) for an urban area exceeding 350 sq km. This sparse coverage resulted in massive geographic blind spots: localized hyper-toxic dust plumes caused by traffic corridors, construction sites, and waste burning went completely undetected until regional air quality had already deteriorated.",
    healthEconomicBurden:
      "Municipal mitigation measures (such as mechanized road sweepers and anti-smog misting trucks) operated on rigid, predetermined schedules rather than dynamic hazard data. This resulted in wasted municipal resources, delayed dust suppression, and prolonged citizen exposure in vulnerable pedestrian zones.",
    regulatoryUrgency:
      "Under the National Clean Air Programme (NCAP) and Fifteenth Finance Commission air quality performance grants, municipal corporations face strict financial penalties unless measurable reductions in particulate concentrations and evidence-based interventions are demonstrated.",
  },

  // 3. Solution
  solution: {
    technologyDescription:
      "AirSense Technologies engineered an autonomous, compact, streetlight-pole mountable particulate monitoring unit utilizing dual-wavelength laser light scattering spectrometry (0.3μm to 10μm) paired with high-frequency LoRaWAN and 4G dual-SIM telemetry failover.",
    hardwareArchitecture:
      "Each node incorporates an optical particulate counter, relative humidity/temperature micro-sensors, an active cyclonic positive-pressure optical purge pump (to prevent lens fouling), and a high-efficiency monocrystalline solar battery system capable of 72 hours continuous operation during blackout conditions.",
    softwareAndAiStack:
      "Telemetry streams at 60-second intervals into a cloud-native ingestion engine, normalized through polynomial humidity-correction algorithms, and feeds real-time MQTT TLS 1.3 streams into the Lucknow Integrated Command and Control Centre (ICCC) geospatial dashboard.",
    intellectualProperty:
      "AirSense holds Indian Patent Pending #202411039821 ('Adaptive Anti-Fouling Optical Chamber for High-Particulate Environments') and DPIIT Startup Recognition Certificate #DIPP98214.",
    vendorCredentials:
      "Incorporated in 2023, certified ISO 9001:2015, winner of the State Innovation Challenge for Urban Clean Air 2025.",
  },

  // 4. Pilot Methodology
  pilotMethodology: {
    deploymentFramework:
      "The 90-day pilot was executed in 4 sequential phases: (1) Site permissions and reference collocation; (2) Ward pole installation across 40 nodes; (3) 60-day continuous telemetry and automated misting trigger testing; and (4) Third-party empirical regression audit by TERI.",
    collocationProtocol:
      "Four test nodes were physically mounted on the sampling mast of the Central Pollution Control Board (CPCB) continuous analyzer (Thermo Scientific BAM-1020) at Lalbagh CAAQMS station for 14 uninterrupted days to calibrate empirical linear regression slopes.",
    geographicalSampling:
      "40 nodes were deployed across 4 representative municipal wards: commercial high-traffic (Hazratganj), transit hub (Alambagh), residential/commercial planned (Gomti Nagar), and dense historic heritage urban fabric (Old Lucknow Chowk).",
    qaQcProcedures:
      "Automated sensor zero-point drift checks ran nightly at 03:00 IST using internal filtered optical purges. Telemetry packet checksums and SHA-256 batch digests ensured zero synthetic data interpolation.",
    referenceAnalyzer:
      "Thermo Scientific BAM-1020 Beta Attenuation Mass Monitor (CPCB CAAQMS Station #4, Lalbagh, Lucknow).",
  },

  // 5. Baseline
  baseline: {
    description:
      "The pre-pilot baseline represents municipal conditions documented between January 2026 and April 2026 by the Directorate of Urban Development and UP Pollution Control Board prior to pilot deployment.",
    observationWindow: "90 Days historic pre-pilot sampling",
    historicalDataSources: "UPPCB CAAQMS Open Records, Lucknow Nagar Nigam Fleet Logs, Municipal GIS Layer",
    coverageBaseline: "35.0% municipal ward area within 500m of monitoring node",
    accuracyBaseline: "82.0% raw uncalibrated optical counter correlation",
    uptimeBaseline: "76.0% historical availability due to grid power dependency",
    responseLatencyBaseline: "65.0 minutes average municipal misting dispatch latency",
  },

  // 6. KPIs: Baseline -> Target -> Actual
  kpis: [
    {
      id: "kpi-1",
      metricName: "Ward Geographic Sensing Coverage",
      category: "Municipal Spatial Reach",
      baseline: "35.0%",
      target: "≥ 85.0%",
      actual: "88.5%",
      unit: "%",
      status: "EXCEEDED",
      attainmentPercentage: 104.1,
      significance: "p < 0.001",
      dataSource: "Municipal GIS Voronoi Buffer Analysis (500m radial catchment)",
    },
    {
      id: "kpi-2",
      metricName: "Linear Regression Correlation (R²) vs CPCB BAM-1020",
      category: "Sensor Accuracy & Metrology",
      baseline: "82.0%",
      target: "≥ 90.0% (R² 0.90)",
      actual: "94.0% (R² 0.94)",
      unit: "%",
      status: "EXCEEDED",
      attainmentPercentage: 104.4,
      significance: "p < 0.0001",
      dataSource: "Lalbagh CAAQMS 14-Day Continuous Collocation Dataset",
    },
    {
      id: "kpi-3",
      metricName: "Fleet Operational Availability & Uptime",
      category: "Hardware Reliability",
      baseline: "76.0%",
      target: "≥ 90.0%",
      actual: "97.2%",
      unit: "%",
      status: "EXCEEDED",
      attainmentPercentage: 108.0,
      significance: "Zero telemetry loss > 2 hours",
      dataSource: "ICCC Ingestion Daemon Hourly Heartbeat Telemetry Logs",
    },
    {
      id: "kpi-4",
      metricName: "Mean Absolute Percentage Error (MAPE)",
      category: "Metrological Uncertainty",
      baseline: "18.0%",
      target: "≤ 5.0%",
      actual: "3.4%",
      unit: "%",
      status: "EXCEEDED",
      attainmentPercentage: 147.1,
      significance: "Statistically optimal under ISO 20988",
      dataSource: "TERI Accredited Environmental Laboratory Collocation Report",
    },
    {
      id: "kpi-5",
      metricName: "Automated Misting Truck Dispatch Latency",
      category: "Civic Operational Response",
      baseline: "65.0 min",
      target: "≤ 20.0 min",
      actual: "16.4 min",
      unit: "minutes",
      status: "EXCEEDED",
      attainmentPercentage: 122.0,
      significance: "18 autonomous dispatches verified",
      dataSource: "Lucknow ICCC Automated Emergency Dispatch & GPS Trackers",
    },
  ],

  // 7. Results
  results: {
    empiricalSummary:
      "All five core contractual key performance indicators were satisfied or exceeded during the 90-day testbed. The system verified that low-cost optical particulate monitors, when supplemented with real-time relative humidity polynomial corrections and anti-fouling cyclonic purge hardware, can achieve regulatory-grade correlation (R² = 0.94) suitable for dynamic municipal environmental management.",
    regressionCorrelationR2: 0.94,
    meanAbsolutePercentageError: 3.4,
    interventionsTriggeredCount: 18,
    exposureReductionEstimate: "23.4% reduction in peak resident PM2.5 exposure in monitored commercial zones",
    statisticalConfidence: "99.9% (Student's t-test p-value = 0.0001)",
  },

  // 8. Evidence
  evidence: {
    totalRecordsCount: 14,
    integrityStatus: "100% SHA-256 Cryptographically Sealed",
    vaultReferenceUrl: "/evidence",
    artifacts: [
      {
        id: "ev-001",
        title: "Lucknow_Pole_Mounting_GIS_Shapefile.zip",
        category: "GIS Spatial Layer",
        size: "14.2 MB",
        sha256: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
        verifiedBy: "Priya Nair (TERI)",
        uploadDate: "26 Jun 2026",
      },
      {
        id: "ev-002",
        title: "Lalbagh_CAAQMS_14Day_Collocation_Raw.csv",
        category: "Laboratory Telemetry",
        size: "8.4 MB",
        sha256: "9a8f10b28471bade029fa7b1209bca74e2843054f102837bcde2054117849102",
        verifiedBy: "Priya Nair (TERI)",
        uploadDate: "06 Jun 2026",
      },
      {
        id: "ev-003",
        title: "60_Day_Sensor_Telemetry_Dataset.parquet",
        category: "Time-Series Dataset",
        size: "42.8 MB",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        verifiedBy: "Priya Nair (TERI)",
        uploadDate: "28 Jul 2026",
      },
      {
        id: "ev-004",
        title: "Automated_Misting_Dispatch_Audit_Logs.csv",
        category: "Municipal Dispatch Evidence",
        size: "2.4 MB",
        sha256: "721a93b4119fc819a08912e73645019284758129034910284561029348571029",
        verifiedBy: "Lucknow Smart City Engineer",
        uploadDate: "28 Jul 2026",
      },
      {
        id: "ev-005",
        title: "TERI_Accredited_Collocation_Audit_TR1.pdf",
        category: "Third-Party Audit",
        size: "3.2 MB",
        sha256: "b1093ef44e5f9a81e263fa7b1209bca74e2843054f102837bcde205411784910",
        verifiedBy: "Priya Nair (TERI)",
        uploadDate: "07 Jun 2026",
      },
    ],
  },

  // 9. Costs
  costs: {
    totalContractValue: 2450000,
    paidAmount: 1150000,
    approvedAmount: 650000,
    pendingAmount: 400000,
    remainingAmount: 250000,
    perUnitCostInr: 45000,
    traditionalStationCostInr: 12000000, // 1.2 Crore INR
    savingsMultiplier: "26x lower capital cost per sampling point",
    costLedger: [
      {
        tranche: "Tranche 1: Mobilization & Equipment",
        milestoneCode: "M1",
        amount: 500000,
        status: "PAID",
        invoiceNumber: "INV-AS-2026-01",
        treasuryRef: "TREAS-UP-2026-9812489",
        description: "Procurement of optical sensor heads and CPCB testbed setup.",
      },
      {
        tranche: "Tranche 2: Ward Network Deployment",
        milestoneCode: "M2",
        amount: 650000,
        status: "PAID",
        invoiceNumber: "INV-AS-2026-02",
        treasuryRef: "TREAS-UP-2026-9841203",
        description: "Physical mounting of 40 pole nodes and ICCC LoRaWAN gateway configuration.",
      },
      {
        tranche: "Tranche 3: 60-Day Telemetry Operations",
        milestoneCode: "M3",
        amount: 650000,
        status: "APPROVED",
        invoiceNumber: "INV-AS-2026-03",
        treasuryRef: "TREAS-AUTH-UP-2026-3391",
        description: "Continuous streaming telemetry, uptime verification, and misting triggers.",
      },
      {
        tranche: "Tranche 4: Independent Validation Audit",
        milestoneCode: "M4",
        amount: 400000,
        status: "PENDING",
        invoiceNumber: "INV-AS-2026-04-DRAFT",
        description: "Third-party TERI empirical certification and regression report sign-off.",
      },
      {
        tranche: "Tranche 5: Replication Handover Blueprint",
        milestoneCode: "M5",
        amount: 250000,
        status: "REMAINING",
        description: "Final operations manual and replication specifications for 17 UP Smart Cities.",
      },
    ],
  },

  // 10. Risks
  risks: [
    {
      area: "Technical",
      riskTitle: "Optical scattering distortion under extreme monsoon humidity (>90% RH)",
      severity: "MEDIUM",
      mitigation: "Software polynomial compensation active; recommend mandatory hardware heated inlets for winter smog tenders.",
      currentStatus: "MITIGATED",
    },
    {
      area: "Operational",
      riskTitle: "LoRaWAN packet attenuation in narrow heritage alleyways (Chowk Ward)",
      severity: "LOW",
      mitigation: "Deployed 2 supplementary directional gateway repeaters on municipal sub-stations.",
      currentStatus: "MITIGATED",
    },
    {
      area: "Financial",
      riskTitle: "Delays in state treasury escrow disbursement releases",
      severity: "LOW",
      mitigation: "GFR 149 milestone verification protocol implemented directly inside platform ledger.",
      currentStatus: "MONITORED",
    },
    {
      area: "Cybersecurity",
      riskTitle: "Unauthorized sensor node firmware tampering or telemetry spoofing",
      severity: "LOW",
      mitigation: "Hardware-rooted crypto keys, TLS 1.3 encryption, and automated SHA-256 audit chaining.",
      currentStatus: "MITIGATED",
    },
  ],

  // 11. Issues
  issues: [
    {
      id: "ISS-104",
      title: "Ward 22 Sensor #14 optical chamber dust coating",
      severity: "HIGH",
      resolution: "Triggered cyclonic positive-pressure optical purge remotely. Signal attenuation returned to nominal in 120s.",
      status: "RESOLVED",
    },
    {
      id: "ISS-108",
      title: "Chowk Gateway #3 SIM failover during telecommunication maintenance",
      severity: "MEDIUM",
      resolution: "Dual-SIM cellular module successfully failed over to BSNL secondary APN without telemetry packet loss.",
      status: "RESOLVED",
    },
    {
      id: "ISS-112",
      title: "Streetlight utility pole power shutoff during municipal tree-pruning drive",
      severity: "LOW",
      resolution: "Solar battery pack sustained continuous operation for 28 hours until utility line restored.",
      status: "CLOSED",
    },
  ],

  // 12. Validation
  validation: {
    accreditedAgency: "The Energy and Resources Institute (TERI Environmental Laboratory)",
    leadAuditor: "Priya Nair (Senior Environmental Testing Engineer)",
    certificationOutcome: "Validated",
    auditStandard: "CPCB Guidelines 2020 & ISO/IEC 17025 Test Standards",
    certificationDate: "27 September 2026",
    auditorSummary:
      "TERI certifies that the 40-node hyperlocal air monitoring mesh deployed by AirSense Technologies Pvt Ltd meets and exceeds all contractual metrological benchmarks. Correlation against BAM-1020 achieved R² = 0.94. The technology is certified as VALIDATED and suitable for direct scaling.",
    certificateHash: "SHA256:7a92bc44e1f8901239aa889100234bcefa01928374e2b091fca940182749a12c",
  },

  // 13. Lessons Learned
  lessonsLearned: {
    technicalTakeaways: [
      "Hardware Heated Sample Inlets: While software polynomial compensation reduced high-humidity false-positives to 3.4%, North Indian winter fog (November-January) requires integrated micro-heaters in optical inlets to prevent droplet diffraction.",
      "Solar Panel Inclination in High-Dust Zones: Panels mounted at 25-degree tilt near high-traffic corridors required bi-monthly washing due to diesel particulate film; a 35-degree self-cleansing angle is recommended for commercial scaling.",
    ],
    operationalTakeaways: [
      "Municipal Inter-Departmental Right-of-Way SLAs: Explicit agreements must be executed in advance between Municipal Urban Development and the power distribution company (DISCOM) to prevent accidental pole de-energization.",
      "Driver Handshake on Misting Trucks: Automated dispatch notifications delivered directly to misting truck Android terminals improved response times from 65 minutes down to 16.4 minutes.",
    ],
    procurementSpecificationsForScale: [
      "Specify low-cost optical particulate monitors with active cyclonic purge mechanisms to ensure 3-year sensor lifespan.",
      "Require mandatory LoRaWAN + 4G dual-SIM fallback in tender technical specifications under GFR 149.",
      "Standardize ICCC MQTT TLS 1.3 schema to allow interoperability across multiple hardware sensor manufacturers.",
    ],
  },

  // 14. Recommendation (Pre-seeded with official government decision)
  recommendation: {
    option: "Scale",
    enteredBy: "Rajesh Verma",
    role: "GOVERNMENT_OFFICER",
    designation: "Joint Director, Department of Urban Development",
    department: "Government of Uttar Pradesh",
    enteredAt: "2026-09-27T10:45:00Z",
    justification:
      "The pilot has empirically exceeded all statutory targets under GFR Rule 149 and UP Innovation Policy. With an R² of 0.94 and 88.5% ward coverage, the technology provides actionable street-level micro-pollution alerts at 85% lower capital cost than traditional reference stations. Independent validation by TERI confirms metrological reliability. Recommending direct procurement scaling to all 80 wards of Lucknow and replication across Kanpur, Varanasi, and Agra.",
    targetScaleScope: "All 80 Municipal Wards of Lucknow (approx 350 nodes) + Replication Blueprint for Kanpur & Varanasi",
    authorizedBudgetInr: 18500000, // ₹1.85 Crore
    digitalSignatureDigest: "SHA256:88bc2a319f001928475812903491028456102934001928374e2b091fca940182",
    isHumanConfirmed: true,
  },

  auditTrail: [
    {
      timestamp: "2026-05-01T09:00:00Z",
      actor: "Rajesh Verma (Gov Officer)",
      action: "PILOT_INITIATED",
      note: "Authorized commencement of 90-day testbed in Lucknow Wards 14, 18, 22, 29.",
    },
    {
      timestamp: "2026-06-08T15:40:00Z",
      actor: "Priya Nair (TERI Validator)",
      action: "COLLOCATION_VERIFIED",
      note: "Lalbagh CAAQMS 14-day parallel collocation confirmed R² = 0.94.",
    },
    {
      timestamp: "2026-07-28T16:00:00Z",
      actor: "AirSense Technologies (Startup)",
      action: "FINAL_TELEMETRY_SUBMITTED",
      note: "Uploaded 60-day complete time-series dataset (42.8 MB parquet).",
    },
    {
      timestamp: "2026-07-29T15:30:00Z",
      actor: "Priya Nair (TERI Validator)",
      action: "VALIDATION_CERTIFIED",
      note: "Official Third-Party Certificate issued: VALIDATED.",
    },
    {
      timestamp: "2026-09-27T10:45:00Z",
      actor: "Rajesh Verma (Gov Officer)",
      action: "RECOMMENDATION_ENTERED",
      note: "Decision-maker explicitly recorded statutory determination: SCALE (₹1.85 Cr Scope).",
    },
  ],
};

class PilotReportDatabase {
  private reportData: PilotReportData = { ...INITIAL_REPORT_DATA };

  public getReport(pilotId: string = "PILOT-UP-UAQ-01"): PilotReportData {
    return { ...this.reportData };
  }

  public recordRecommendation(
    pilotId: string,
    payload: {
      option: RecommendationOption;
      justification: string;
      targetScaleScope?: string;
      authorizedBudgetInr?: number;
      isHumanConfirmed: boolean;
    },
    user: {
      name: string;
      role: string;
      designation?: string;
      department?: string;
    }
  ): { success: boolean; error?: string; report?: PilotReportData } {
    // 1. Role Enforcement: Only Government Officers, Procurement Officers, or Platform Admins
    const allowedRoles = ["GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"];
    if (!allowedRoles.includes(user.role)) {
      return {
        success: false,
        error: "Permission Denied: Recommendations must be explicitly entered by an authorized government decision-maker.",
      };
    }

    // 2. Automated AI Prevention Check
    if (!payload.isHumanConfirmed) {
      return {
        success: false,
        error: "Procurement decisions cannot be automated by AI. The decision-maker must explicitly confirm human review.",
      };
    }

    // 3. Option Validation
    const validOptions: RecommendationOption[] = ["Scale", "Extend Pilot", "Modify & Retest", "Close"];
    if (!validOptions.includes(payload.option)) {
      return {
        success: false,
        error: `Invalid option '${payload.option}'. Must be one of: Scale, Extend Pilot, Modify & Retest, Close.`,
      };
    }

    // 4. Justification Required
    if (!payload.justification || payload.justification.trim().length < 25) {
      return {
        success: false,
        error: "A detailed statutory justification is required (minimum 25 characters).",
      };
    }

    const digest = `SHA256:${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    this.reportData.recommendation = {
      option: payload.option,
      enteredBy: user.name,
      role: user.role,
      designation: user.designation || "Authorized Procurement Decision-Maker",
      department: user.department || "Government of Uttar Pradesh",
      enteredAt: new Date().toISOString(),
      justification: payload.justification,
      targetScaleScope: payload.targetScaleScope,
      authorizedBudgetInr: payload.authorizedBudgetInr,
      digitalSignatureDigest: digest,
      isHumanConfirmed: true,
    };

    this.reportData.auditTrail.unshift({
      timestamp: new Date().toISOString(),
      actor: `${user.name} (${user.role})`,
      action: "RECOMMENDATION_ENTERED",
      note: `Statutory recommendation updated: '${payload.option}'. Seal: ${digest.slice(0, 16)}...`,
    });

    return { success: true, report: { ...this.reportData } };
  }

  public resetToDefaults(): void {
    this.reportData = { ...INITIAL_REPORT_DATA };
  }
}

export const pilotReportDb = new PilotReportDatabase();
