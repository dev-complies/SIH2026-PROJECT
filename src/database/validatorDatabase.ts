/**
 * Independent Validation & Verification Database
 * Section 14 & 33 Governance Policy: Third-party accreditation, objective KPI validation,
 * review of 8 dimensions, interactive checklist, and immutable audit logging.
 */

export type ValidationOutcome = "Validated" | "Partially Validated" | "Not Validated";

export type ChecklistItemStatus = "Verified" | "Minor Concern" | "Failed" | "Not Audited";

export type ValidationDimension =
  | "Pilot Objectives"
  | "Methodology"
  | "Baseline"
  | "Targets"
  | "KPI Measurements"
  | "Evidence"
  | "Results"
  | "Limitations";

export interface ValidationChecklistItem {
  id: string;
  dimension: ValidationDimension;
  title: string;
  criteria: string;
  standardReference: string;
  status: ChecklistItemStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  evidenceIds: string[];
}

export interface AuditedKpiResult {
  kpiId: string;
  metricName: string;
  baseline: string;
  target: string;
  measured: string;
  unit: string;
  outcomeStatus: "EXCEEDED" | "MET" | "UNMET";
  validatorConfidence: number; // percentage
  auditorNotes: string;
}

export interface ValidationSubmissionPayload {
  outcome: ValidationOutcome;
  findings: string;
  evidenceReferences: string[];
  limitations: string;
  comments: string;
  checklistUpdates?: Array<{ id: string; status: ChecklistItemStatus; notes?: string }>;
}

export interface ValidationAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  summary: string;
  entityId: string;
  hash: string;
}

export interface ValidationRecord {
  id: string;
  pilotId: string;
  pilotCode: string;
  pilotTitle: string;
  location: string;
  startupName: string;
  startupDpiit: string;
  validatorId: string;
  validatorName: string;
  validatorDesignation: string;
  validatorOrg: string;
  status: "IN_PROGRESS" | "SUBMITTED" | "CERTIFIED";
  outcome: ValidationOutcome | null;
  // 8 Dimensions Detailed Review Data
  objectivesReview: {
    primaryObjective: string;
    targetJurisdiction: string;
    observationPeriod: string;
    beneficiaryWards: string[];
    alignmentAssessment: string;
  };
  methodologyReview: {
    samplingFramework: string;
    hardwareCollocation: string;
    telemetryProtocol: string;
    referenceInstrumentation: string;
    complianceCertification: string;
    auditorEvaluation: string;
  };
  baselineReview: {
    observationDateRange: string;
    baselineCoverage: string;
    baselineAccuracy: string;
    baselineUptime: string;
    priorInterventionConditions: string;
    auditorEvaluation: string;
  };
  targetsReview: {
    statutoryMandate: string;
    targetCoverage: string;
    targetAccuracy: string;
    targetUptime: string;
    performanceThresholdRationale: string;
    auditorEvaluation: string;
  };
  kpiMeasurementsReview: {
    totalMeasurementsAudited: number;
    anomaliesDetectedCount: number;
    auditedKpis: AuditedKpiResult[];
    dataIngressIntegrity: string;
  };
  evidenceReview: {
    totalEvidenceAudited: number;
    sha256Mismatches: number;
    rawTelemetrySampledMb: string;
    primaryEvidenceArtifacts: Array<{
      id: string;
      title: string;
      type: string;
      sha256: string;
      status: string;
    }>;
    auditorEvaluation: string;
  };
  resultsReview: {
    regressionLinearityR2: number;
    meanAbsolutePercentageError: number;
    uptimePercentage: number;
    targetAttainmentScore: number;
    statisticalSignificancePValue: number;
    auditorSummary: string;
  };
  limitationsReview: {
    identifiedConstraints: string[];
    environmentalDriftFindings: string;
    powerThermalThresholds: string;
    scalabilityRiskWarnings: string[];
    scaleUpRecommendations: string;
  };
  // Submission fields (Required when submitted)
  findings: string | null;
  evidenceReferences: string[];
  limitations: string | null;
  comments: string | null;
  digitalSignatureDigest: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Interactive Checklist
  checklist: ValidationChecklistItem[];
  // Audit trail
  auditLog: ValidationAuditEntry[];
}

const INITIAL_CHECKLIST: ValidationChecklistItem[] = [
  // 1. Objectives
  {
    id: "chk-obj-1",
    dimension: "Pilot Objectives",
    title: "Geographical Boundary & Target Ward Scope",
    criteria: "Ensure sensor deployment strictly conforms to designated Lucknow Municipal Wards (14, 18, 22, 29) without unapproved drift.",
    standardReference: "Pilot MoA Schedule A.1",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-28T10:15:00Z",
    notes: "GIS shapefiles match 40 physical streetlight mounts across Wards 14, 18, 22, 29.",
    evidenceIds: ["ev-001", "ev-004"],
  },
  {
    id: "chk-obj-2",
    dimension: "Pilot Objectives",
    title: "Civic Problem Fit & Real-Time Alerting Scope",
    criteria: "Verify localized PM2.5/PM10 exceedance alerts reliably trigger municipal misting truck dispatch protocols within 20 minutes.",
    standardReference: "Urban Clean Air Mission RFP Sec 3.2",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-28T11:40:00Z",
    notes: "18 verified municipal dispatch events logged with average response time of 16.4 minutes.",
    evidenceIds: ["ev-004", "ev-006"],
  },
  // 2. Methodology
  {
    id: "chk-met-1",
    dimension: "Methodology",
    title: "CPCB Station Collocation & Parallel Sampling",
    criteria: "4 calibrated optical particulate counters operated alongside CPCB BAM-1020 reference analyzer for >= 14 consecutive days.",
    standardReference: "CPCB Guidelines for Low-Cost Air Quality Sensors (2020) Sec 4.2",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-28T14:20:00Z",
    notes: "Lalbagh CAAQMS parallel hourly sampling conducted across 14-day calibration window.",
    evidenceIds: ["ev-002", "ev-005"],
  },
  {
    id: "chk-met-2",
    dimension: "Methodology",
    title: "LoRaWAN & MQTT TLS 1.3 Telemetry Protocol",
    criteria: "Verify sensor payload cryptographic transmission to Lucknow ICCC with zero plaintext telemetry ingress.",
    standardReference: "CERT-In IoT Security Directive 2024",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-28T15:10:00Z",
    notes: "End-to-end TLS 1.3 encryption handshakes verified on 40 active node streams.",
    evidenceIds: ["ev-003"],
  },
  // 3. Baseline
  {
    id: "chk-bas-1",
    dimension: "Baseline",
    title: "Pre-Intervention Baseline Verification",
    criteria: "Confirm historic municipal monitoring baseline metrics (Coverage: 35%, Accuracy: 82%, Uptime: 76%) reflect certified pre-pilot records.",
    standardReference: "State Clean Air Action Plan 2024 Baseline Memo",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-28T16:00:00Z",
    notes: "Pre-pilot records reconciled against UP Pollution Control Board regional records.",
    evidenceIds: ["ev-005"],
  },
  // 4. Targets
  {
    id: "chk-tar-1",
    dimension: "Targets",
    title: "Statutory Performance Threshold Conformance",
    criteria: "Validate that pilot performance targets meet or exceed state smart city RFP thresholds (Coverage >= 85%, Accuracy >= 92%, Uptime >= 90%).",
    standardReference: "UP Smart Cities Mission Guidelines G.O. 441",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-28T16:45:00Z",
    notes: "Statutory benchmarks mathematically locked into KPI contract database.",
    evidenceIds: ["ev-005"],
  },
  // 5. KPI Measurements
  {
    id: "chk-kpi-1",
    dimension: "KPI Measurements",
    title: "Continuous 90-Day Sensor Telemetry Audit",
    criteria: "Audit raw timeseries records for data dropouts, synthetic extrapolation, or timecode tampering.",
    standardReference: "ISO/IEC 25012 Data Quality Framework",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-29T09:30:00Z",
    notes: "Analyzed 42.8 MB parquet time-series telemetry. 97.2% overall telemetry completeness.",
    evidenceIds: ["ev-003", "ev-006"],
  },
  // 6. Evidence
  {
    id: "chk-evi-1",
    dimension: "Evidence",
    title: "Cryptographic SHA-256 Digest & Timestamp Integrity",
    criteria: "Verify uploaded raw datasets and third-party laboratory calibration certificates match blockchain/audit digest receipts.",
    standardReference: "Information Technology Act 2000 Section 65B",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-29T10:15:00Z",
    notes: "All 14 uploaded evidence artifacts checked. Zero SHA-256 hash discrepancies.",
    evidenceIds: ["ev-001", "ev-002", "ev-003", "ev-004", "ev-005", "ev-006"],
  },
  // 7. Results
  {
    id: "chk-res-1",
    dimension: "Results",
    title: "BAM-1020 Regression Linearity (R² >= 0.90)",
    criteria: "Statistically evaluate optical counter vs beta attenuation monitor correlation curve.",
    standardReference: "US EPA / CPCB Sensor Equivalence Protocol",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-29T11:00:00Z",
    notes: "Empirical R² of 0.94 achieved, exceeding required target of 0.90.",
    evidenceIds: ["ev-002"],
  },
  {
    id: "chk-res-2",
    dimension: "Results",
    title: "Mean Absolute Percentage Error (MAPE <= 5%)",
    criteria: "Evaluate error residual distribution across variable humidity and temperature gradients.",
    standardReference: "ISO 20988 Air Quality Uncertainty Evaluation",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-29T11:30:00Z",
    notes: "Mean Absolute Percentage Error measured at 3.4% during 60-day dry and humid sampling.",
    evidenceIds: ["ev-002", "ev-005"],
  },
  // 8. Limitations
  {
    id: "chk-lim-1",
    dimension: "Limitations",
    title: "High-Humidity Optical Scattering Characterization (>90% RH)",
    criteria: "Examine sensor optical chamber behavior under monsoon fog and high relative humidity conditions.",
    standardReference: "TERI Environmental Chamber Stress Protocol",
    status: "Minor Concern",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-29T12:00:00Z",
    notes: "Sensors without optical heating elements showed transient 8-12% PM overestimation when RH > 90%. Software compensation algorithm partly mitigated this, but hardware heated inlet is strongly recommended for statewide rollout.",
    evidenceIds: ["ev-005"],
  },
  {
    id: "chk-lim-2",
    dimension: "Limitations",
    title: "LoRaWAN Gateway Coverage Shadows in Dense Built Environments",
    criteria: "Identify cellular and sub-GHz packet attenuation around heritage monuments and dense bazaar alleyways.",
    standardReference: "Municipal RF Spectrum Survey Standards",
    status: "Verified",
    verifiedBy: "Priya Nair (TERI)",
    verifiedAt: "2026-07-29T12:30:00Z",
    notes: "Old City Chowk ward required 2 supplemental directional antennas to eliminate dead zone in narrow lanes.",
    evidenceIds: ["ev-001"],
  },
];

const INITIAL_AUDIT_LOG: ValidationAuditEntry[] = [
  {
    id: "va-1",
    timestamp: "2026-05-20T10:00:00Z",
    actor: "Priya Nair",
    actorRole: "INDEPENDENT_VALIDATOR",
    action: "VALIDATOR_ASSIGNED",
    summary: "TERI appointed as statutory independent testing & verification authority for PILOT-UP-UAQ-01.",
    entityId: "PILOT-UP-UAQ-01",
    hash: "9a81e263fa7b1209bca74e2843054f102837bcde20541178491028471bade029",
  },
  {
    id: "va-2",
    timestamp: "2026-06-08T11:30:00Z",
    actor: "Priya Nair",
    actorRole: "INDEPENDENT_VALIDATOR",
    action: "COLLOCATION_AUDIT_CONDUCTED",
    summary: "Onsite physical calibration spot audit executed at Lalbagh CPCB station. Regression R² confirmed 0.94.",
    entityId: "PILOT-UP-UAQ-01",
    hash: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
  },
  {
    id: "va-3",
    timestamp: "2026-07-15T14:00:00Z",
    actor: "Priya Nair",
    actorRole: "INDEPENDENT_VALIDATOR",
    action: "TELEMETRY_DATASET_VERIFIED",
    summary: "Inspected 60-day parquet telemetry dataset. SHA-256 seal matches municipal ingestion records.",
    entityId: "PILOT-UP-UAQ-01",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
];

const INITIAL_VALIDATION_RECORD: ValidationRecord = {
  id: "VAL-UP-UAQ-001",
  pilotId: "PILOT-UP-UAQ-01",
  pilotCode: "PILOT-UP-UAQ-01",
  pilotTitle: "Urban Air Quality Hyperlocal Monitoring — Lucknow Pilot",
  location: "Lucknow (Wards 14, 18, 22, 29)",
  startupName: "AirSense Technologies Pvt Ltd",
  startupDpiit: "DIPP98214",
  validatorId: "user-validator-001",
  validatorName: "Priya Nair",
  validatorDesignation: "Senior Environmental Testing Engineer",
  validatorOrg: "The Energy and Resources Institute (TERI)",
  status: "SUBMITTED",
  outcome: "Validated",
  objectivesReview: {
    primaryObjective: "Deploy hyperlocal optical particulate monitoring network across 4 municipal wards to guide autonomous misting truck dispatch and reduce peak PM exposure.",
    targetJurisdiction: "Lucknow Municipal Corporation (Wards 14 Hazratganj, 18 Alambagh, 22 Gomti Nagar, 29 Chowk)",
    observationPeriod: "90 Days (01 May 2026 – 30 Jul 2026)",
    beneficiaryWards: ["Ward 14 (Hazratganj)", "Ward 18 (Alambagh)", "Ward 22 (Gomti Nagar)", "Ward 29 (Chowk)"],
    alignmentAssessment: "The pilot addresses critical urban air pollution blind spots by providing street-level granularity impossible with single centralized CAAQMS analyzers.",
  },
  methodologyReview: {
    samplingFramework: "Continuous dual-wavelength optical particulate spectrometry (0.3μm to 10μm) sampled at 60-second intervals.",
    hardwareCollocation: "4 test nodes co-located with CPCB reference BAM-1020 beta attenuation monitor at Lalbagh station for 14 continuous days.",
    telemetryProtocol: "Encrypted LoRaWAN transmission to 4 municipal gateway towers with MQTT TLS 1.3 push to Lucknow ICCC.",
    referenceInstrumentation: "Thermo Scientific BAM-1020 reference analyzer (CPCB Station #4, Lalbagh, Lucknow).",
    complianceCertification: "ISO/IEC 17025 accredited laboratory test procedures followed.",
    auditorEvaluation: "Methodology conforms strictly with CPCB guidelines for sensor-based air quality monitoring systems (2020).",
  },
  baselineReview: {
    observationDateRange: "January 2026 – April 2026 (Pre-pilot municipal baseline)",
    baselineCoverage: "35.0% municipal ward coverage (only 1 static station for entire district)",
    baselineAccuracy: "82.0% uncalibrated sensor correlation",
    baselineUptime: "76.0% historical availability",
    priorInterventionConditions: "Misting vehicle dispatch was manual and scheduled on fixed routes rather than driven by dynamic particulate plumes.",
    auditorEvaluation: "Historical baseline figures are verified using state pollution control board open records.",
  },
  targetsReview: {
    statutoryMandate: "National Clean Air Programme (NCAP) & UP Urban Innovation Procurement Policy 2024",
    targetCoverage: "≥ 85.0% ward area within 500m radius of active sensor",
    targetAccuracy: "Linear correlation coefficient R² ≥ 0.90 (90.0% equivalent) vs BAM-1020",
    targetUptime: "≥ 90.0% hourly node fleet availability",
    performanceThresholdRationale: "High threshold required to ensure municipal dust-suppression interventions are legally justifiable under public audit scrutiny.",
    auditorEvaluation: "Targets are ambitious, objective, and mathematically measurable.",
  },
  kpiMeasurementsReview: {
    totalMeasurementsAudited: 129600, // 40 nodes * 90 days * 36 readings/day
    anomaliesDetectedCount: 14,
    auditedKpis: [
      {
        kpiId: "kpi-monitoring-coverage",
        metricName: "Ward Monitoring Coverage",
        baseline: "35.0%",
        target: "85.0%",
        measured: "88.5%",
        unit: "%",
        outcomeStatus: "EXCEEDED",
        validatorConfidence: 98,
        auditorNotes: "Voronoi buffer analysis confirms 88.5% coverage across all 4 designated wards.",
      },
      {
        kpiId: "kpi-sensor-accuracy",
        metricName: "BAM-1020 Linear Correlation (R²)",
        baseline: "82.0%",
        target: "≥ 90.0%",
        measured: "94.0%",
        unit: "%",
        outcomeStatus: "EXCEEDED",
        validatorConfidence: 96,
        auditorNotes: "Regression correlation R² = 0.94 established during 14-day parallel collocation audit.",
      },
      {
        kpiId: "kpi-fleet-uptime",
        metricName: "Fleet Telemetry Uptime",
        baseline: "76.0%",
        target: "≥ 90.0%",
        measured: "97.2%",
        unit: "%",
        outcomeStatus: "EXCEEDED",
        validatorConfidence: 99,
        auditorNotes: "Node uptime maintained above 95% threshold across entire 90-day observation window.",
      },
    ],
    dataIngressIntegrity: "Zero synthetic interpolation detected. Dropped packets during monsoon storm accounted for less than 2.8% of total transmissions.",
  },
  evidenceReview: {
    totalEvidenceAudited: 14,
    sha256Mismatches: 0,
    rawTelemetrySampledMb: "42.8 MB",
    primaryEvidenceArtifacts: [
      { id: "ev-001", title: "Lucknow_Pole_Mounting_GIS_Shapefile.zip", type: "GIS Spatial Layer", sha256: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", status: "VERIFIED" },
      { id: "ev-002", title: "Lalbagh_CAAQMS_14Day_Collocation_Raw.csv", type: "Laboratory Telemetry", sha256: "9a8f10b2...7f8g", status: "VERIFIED" },
      { id: "ev-003", title: "60_Day_Sensor_Telemetry_Dataset.parquet", type: "Time-Series Dataset", sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", status: "VERIFIED" },
      { id: "ev-004", title: "Automated_Misting_Dispatch_Audit_Logs.csv", type: "Municipal Dispatch Evidence", sha256: "721a93b4...119f", status: "VERIFIED" },
      { id: "ev-005", title: "TERI_Accredited_Collocation_Audit_TR1.pdf", type: "Third-Party Audit Report", sha256: "b1093ef4...4e5f", status: "VERIFIED" },
    ],
    auditorEvaluation: "All evidence files carry verified cryptographic SHA-256 digests matching municipal upload logs.",
  },
  resultsReview: {
    regressionLinearityR2: 0.94,
    meanAbsolutePercentageError: 3.4,
    uptimePercentage: 97.2,
    targetAttainmentScore: 104.2,
    statisticalSignificancePValue: 0.0001,
    auditorSummary: "All 3 core pilot performance targets have been exceeded with statistical significance p < 0.001.",
  },
  limitationsReview: {
    identifiedConstraints: [
      "Humidity Sensitivity: Optical sensors show 8-12% particle diameter overestimation when relative humidity exceeds 90%.",
      "Cellular Blindspots in Narrow Lanes: Chowk historic area required directional high-gain antennas due to dense masonry.",
      "Solar Panel Dust Coating: Units mounted near major transit junctions require bi-monthly optical window cleaning.",
    ],
    environmentalDriftFindings: "Baseline drift measured at less than 1.8% over 90 days, within manufacturer tolerance.",
    powerThermalThresholds: "Solar battery pack operated reliably up to 46.5°C ambient summer temperatures.",
    scalabilityRiskWarnings: [
      "Heating inlet elements must be made mandatory in procurement tender specs for North Indian winter smog & fog conditions.",
      "Municipal right-of-way pole mount SLA must be established with state DISCOM to avoid power shutoff delays.",
    ],
    scaleUpRecommendations: "Recommended for direct scale-up across remaining 76 wards of Lucknow and replication in Kanpur and Varanasi.",
  },
  findings: "The 90-day pilot deployment by AirSense Technologies Pvt Ltd in Lucknow Wards 14, 18, 22, and 29 has successfully achieved and exceeded all contractual performance benchmarks. The empirical correlation against the Central Pollution Control Board (CPCB) BAM-1020 reference analyzer yielded an R² of 0.94 (target ≥ 0.90), with 88.5% ward geographical coverage (target ≥ 85%) and 97.2% fleet operational uptime (target ≥ 90%). Sensor telemetry streaming into the Lucknow Integrated Command and Control Centre (ICCC) reliably triggered 18 automated municipal misting truck dispatches.",
  evidenceReferences: ["ev-001", "ev-002", "ev-003", "ev-004", "ev-005"],
  limitations: "1. High Relative Humidity Distortion: Relative humidity exceeding 90% introduces optical scattering overestimation (8-12%). A hardware heated inlet must be included in scale-up procurement specifications.\n2. Dense Built-Environment Signal Attenuation: Deep alleyways in Old Lucknow require supplementary gateway repeaters.\n3. Maintenance Cadence: Optical lens cleaning is required every 60 days in high-traffic corridors.",
  comments: "TERI certifies this pilot as VALIDATED under Section 14 of the UP Urban Innovation Procurement Guidelines. The technology has demonstrated sufficient empirical maturity, reliability, and cost-effectiveness to proceed to final milestone payment and scale-up tender under GFR 149.",
  digitalSignatureDigest: "SHA256:7a92bc44e1f8901239aa889100234bcefa01928374e2b091fca940182749a12c",
  submittedAt: "2026-07-29T15:30:00Z",
  createdAt: "2026-05-20T10:00:00Z",
  updatedAt: "2026-07-29T15:30:00Z",
  checklist: [...INITIAL_CHECKLIST],
  auditLog: [...INITIAL_AUDIT_LOG],
};

class ValidatorDatabase {
  private validationRecords: ValidationRecord[] = [{ ...INITIAL_VALIDATION_RECORD }];

  public getValidationRecord(pilotId: string = "PILOT-UP-UAQ-01"): ValidationRecord | undefined {
    return this.validationRecords.find(
      (r) => r.pilotId.toLowerCase() === pilotId.toLowerCase()
    );
  }

  public getAllRecords(): ValidationRecord[] {
    return [...this.validationRecords];
  }

  public updateChecklistItem(
    pilotId: string,
    itemId: string,
    status: ChecklistItemStatus,
    notes?: string,
    actorName: string = "Priya Nair (TERI)",
    actorRole: string = "INDEPENDENT_VALIDATOR"
  ): { success: boolean; error?: string; item?: ValidationChecklistItem } {
    // Role check: Startups are forbidden
    if (actorRole === "STARTUP") {
      return {
        success: false,
        error: "Access Denied: Startups are strictly prohibited from modifying independent validation checklists.",
      };
    }

    const record = this.getValidationRecord(pilotId);
    if (!record) {
      return { success: false, error: `Validation record for pilot ${pilotId} not found.` };
    }

    const item = record.checklist.find((c) => c.id === itemId);
    if (!item) {
      return { success: false, error: `Checklist item ${itemId} not found.` };
    }

    item.status = status;
    item.verifiedBy = actorName;
    item.verifiedAt = new Date().toISOString();
    if (notes !== undefined) {
      item.notes = notes;
    }

    // Add audit entry
    record.auditLog.unshift({
      id: `va-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole,
      action: "CHECKLIST_ITEM_UPDATED",
      summary: `Updated checklist item '${item.title}' to '${status}'.`,
      entityId: itemId,
      hash: `SHA256:${Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`,
    });

    record.updatedAt = new Date().toISOString();
    return { success: true, item };
  }

  public submitValidationReport(
    pilotId: string,
    payload: ValidationSubmissionPayload,
    actorName: string = "Priya Nair",
    actorRole: string = "INDEPENDENT_VALIDATOR",
    actorOrg: string = "The Energy and Resources Institute (TERI)"
  ): { success: boolean; error?: string; record?: ValidationRecord } {
    // 1. Strict Role-Based Access: Startups cannot submit or mutate findings
    if (actorRole === "STARTUP") {
      return {
        success: false,
        error: "Security Violation: Startups cannot create or modify validator findings. Independent validation requires a separate role.",
      };
    }

    // 2. Validate Outcome Enum
    const validOutcomes: ValidationOutcome[] = ["Validated", "Partially Validated", "Not Validated"];
    if (!validOutcomes.includes(payload.outcome)) {
      return {
        success: false,
        error: `Invalid outcome '${payload.outcome}'. Must be 'Validated', 'Partially Validated', or 'Not Validated'.`,
      };
    }

    // 3. Required Fields Validation: Findings, Evidence References, Limitations, Comments
    if (!payload.findings || payload.findings.trim().length < 20) {
      return {
        success: false,
        error: "Findings is a required field and must provide detailed empirical verification.",
      };
    }

    if (!payload.evidenceReferences || payload.evidenceReferences.length === 0) {
      return {
        success: false,
        error: "Evidence References is required. You must cite at least one supporting evidence artifact.",
      };
    }

    if (!payload.limitations || payload.limitations.trim().length < 10) {
      return {
        success: false,
        error: "Limitations is a required field. You must state any identified technical or field constraints.",
      };
    }

    if (!payload.comments || payload.comments.trim().length < 10) {
      return {
        success: false,
        error: "Comments is a required field. You must provide statutory recommendations or remedial remarks.",
      };
    }

    const record = this.getValidationRecord(pilotId);
    if (!record) {
      return { success: false, error: `Pilot ${pilotId} not found in validation registry.` };
    }

    // Update Checklist if updates provided
    if (payload.checklistUpdates && Array.isArray(payload.checklistUpdates)) {
      for (const update of payload.checklistUpdates) {
        const item = record.checklist.find((c) => c.id === update.id);
        if (item) {
          item.status = update.status;
          item.verifiedBy = `${actorName} (${actorOrg})`;
          item.verifiedAt = new Date().toISOString();
          if (update.notes) item.notes = update.notes;
        }
      }
    }

    const digest = `SHA256:${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    record.outcome = payload.outcome;
    record.findings = payload.findings;
    record.evidenceReferences = payload.evidenceReferences;
    record.limitations = payload.limitations;
    record.comments = payload.comments;
    record.status = "SUBMITTED";
    record.digitalSignatureDigest = digest;
    record.submittedAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();
    record.validatorName = actorName;
    record.validatorOrg = actorOrg;

    // Record in Audit Log
    record.auditLog.unshift({
      id: `va-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${actorName} (${actorOrg})`,
      actorRole,
      action: "PILOT_VALIDATION_SUBMITTED",
      summary: `Statutory Validation Report submitted with determination '${payload.outcome}'. SHA-256 seal: ${digest.slice(0, 16)}...`,
      entityId: record.id,
      hash: digest,
    });

    return { success: true, record };
  }

  public resetToDefaults(): void {
    this.validationRecords = [{ ...INITIAL_VALIDATION_RECORD }];
  }
}

export const validatorDb = new ValidatorDatabase();
