// In-memory persistent database for KPI tracking system
// Supports querying KPIs, historical measurements, and logging new verified data points

export interface KPIRecord {
  id: string;
  name: string;
  description: string;
  baseline: number;
  target: number;
  currentValue: number;
  unit: string;
  frequency: string;
  source: string;
  owner: string;
  status: "ON_TRACK" | "EXCEEDING" | "NEEDS_ATTENTION" | "CRITICAL" | "ACHIEVED";
  warningThreshold: number;
  criticalThreshold: number;
  direction: "HIGHER_IS_BETTER" | "LOWER_IS_BETTER";
  pilotId: string;
  lastMeasuredAt: string;
}

export interface KPIMeasurementRecord {
  id: string;
  kpiId: string;
  measuredAt: string; // ISO date
  dateLabel: string;  // e.g. "Week 1", "07 May"
  value: number;
  targetValue: number;
  baselineValue: number;
  sourceNode: string;
  verifiedBy: string;
  notes: string;
  auditHash: string;
}

// Initial Database Seed
let KPIS_DATABASE: KPIRecord[] = [
  {
    id: "kpi-monitoring-coverage",
    name: "Monitoring Coverage",
    description: "Percentage of municipal ward area within 500m radius of active calibrated particulate sensor node",
    baseline: 35.0,
    target: 85.0,
    currentValue: 86.0,
    unit: "%",
    frequency: "Weekly",
    source: "Municipal GIS Voronoi Buffer Analysis (Lucknow Smart City)",
    owner: "AirSense Technologies & Lucknow Municipal Corporation",
    status: "EXCEEDING",
    warningThreshold: 75.0,
    criticalThreshold: 50.0,
    direction: "HIGHER_IS_BETTER",
    pilotId: "PILOT-UP-UAQ-01",
    lastMeasuredAt: "2026-07-28T08:30:00Z",
  },
  {
    id: "kpi-sensor-accuracy",
    name: "Data Accuracy vs Reference",
    description: "Linear regression correlation coefficient (R² percentage) against collocated CPCB BAM-1020 reference analyzer",
    baseline: 82.0,
    target: 95.0,
    currentValue: 95.0,
    unit: "%",
    frequency: "Bi-weekly Collocation",
    source: "CPCB Lalbagh CAAQMS Reference Station Collocation Log",
    owner: "TERI Environmental Systems & Priya Nair (Lead Auditor)",
    status: "ACHIEVED",
    warningThreshold: 88.0,
    criticalThreshold: 80.0,
    direction: "HIGHER_IS_BETTER",
    pilotId: "PILOT-UP-UAQ-01",
    lastMeasuredAt: "2026-07-28T11:15:00Z",
  },
  {
    id: "kpi-fleet-uptime",
    name: "Device Uptime",
    description: "Percentage of expected hourly MQTT sensor packets successfully ingested into Lucknow ICCC without data loss",
    baseline: 76.0,
    target: 90.0,
    currentValue: 94.0,
    unit: "%",
    frequency: "Continuous Telemetry",
    source: "Lucknow ICCC Ingestion Daemon Heartbeat Logs",
    owner: "AirSense Technologies Cloud Operations",
    status: "EXCEEDING",
    warningThreshold: 85.0,
    criticalThreshold: 75.0,
    direction: "HIGHER_IS_BETTER",
    pilotId: "PILOT-UP-UAQ-01",
    lastMeasuredAt: "2026-07-28T16:00:00Z",
  },
  {
    id: "kpi-misting-latency",
    name: "Automated Misting Trigger Latency",
    description: "Elapsed duration from localized hotspot threshold detection to municipal misting truck automated dispatch",
    baseline: 25.0,
    target: 10.0,
    currentValue: 6.8,
    unit: "minutes",
    frequency: "Per Trigger Event",
    source: "Municipal Fleet Telematics & Geofenced Dispatch API",
    owner: "Lucknow Municipal Fleet Operations",
    status: "EXCEEDING",
    warningThreshold: 15.0,
    criticalThreshold: 20.0,
    direction: "LOWER_IS_BETTER",
    pilotId: "PILOT-UP-UAQ-01",
    lastMeasuredAt: "2026-07-25T14:40:00Z",
  },
  {
    id: "kpi-sensor-drift",
    name: "Optical Chamber Baseline Drift",
    description: "Maximum allowable sensor optical measurement drift over continuous 60 days of operations",
    baseline: 8.5,
    target: 5.0,
    currentValue: 2.8,
    unit: "%",
    frequency: "Weekly Optical Purge",
    source: "Positive-Pressure Cyclonic Purge Optical Sensor Diagnostics",
    owner: "AirSense Hardware Engineering Team",
    status: "ON_TRACK",
    warningThreshold: 6.0,
    criticalThreshold: 8.0,
    direction: "LOWER_IS_BETTER",
    pilotId: "PILOT-UP-UAQ-01",
    lastMeasuredAt: "2026-07-24T18:00:00Z",
  },
];

let KPI_MEASUREMENTS_DATABASE: KPIMeasurementRecord[] = [
  // 1. Monitoring Coverage (Baseline: 35% -> Target: 85% -> Current: 78%)
  {
    id: "meas-cov-1",
    kpiId: "kpi-monitoring-coverage",
    measuredAt: "2026-05-15T10:00:00Z",
    dateLabel: "15 May (W1)",
    value: 35.0,
    targetValue: 85.0,
    baselineValue: 35.0,
    sourceNode: "GIS Voronoi Engine",
    verifiedBy: "Dr. Alok Gupta (IIT Kanpur)",
    notes: "Contractual baseline survey. 10 initial prototype nodes active in Ward 14.",
    auditHash: "sha256:7b91c...102a",
  },
  {
    id: "meas-cov-2",
    kpiId: "kpi-monitoring-coverage",
    measuredAt: "2026-05-29T10:00:00Z",
    dateLabel: "29 May (W3)",
    value: 46.0,
    targetValue: 85.0,
    baselineValue: 35.0,
    sourceNode: "GIS Voronoi Engine",
    verifiedBy: "Rajesh Verma (Officer)",
    notes: "Batch 1 mounting on Hazratganj arterial streetlight poles completed.",
    auditHash: "sha256:4f53c...11ba",
  },
  {
    id: "meas-cov-3",
    kpiId: "kpi-monitoring-coverage",
    measuredAt: "2026-06-12T10:00:00Z",
    dateLabel: "12 Jun (W5)",
    value: 58.0,
    targetValue: 85.0,
    baselineValue: 35.0,
    sourceNode: "GIS Voronoi Engine",
    verifiedBy: "Lucknow Smart City Engineer",
    notes: "Expanded into Gomti Nagar residential wards. 24 nodes operational.",
    auditHash: "sha256:9a81e...bade",
  },
  {
    id: "meas-cov-4",
    kpiId: "kpi-monitoring-coverage",
    measuredAt: "2026-06-26T10:00:00Z",
    dateLabel: "26 Jun (W7)",
    value: 69.0,
    targetValue: 85.0,
    baselineValue: 35.0,
    sourceNode: "GIS Voronoi Engine",
    verifiedBy: "Priya Nair (TERI)",
    notes: "Charbagh multi-modal railway hub nodes commissioned.",
    auditHash: "sha256:c819a...1029",
  },
  {
    id: "meas-cov-5",
    kpiId: "kpi-monitoring-coverage",
    measuredAt: "2026-07-10T10:00:00Z",
    dateLabel: "10 Jul (W9)",
    value: 74.0,
    targetValue: 85.0,
    baselineValue: 35.0,
    sourceNode: "GIS Voronoi Engine",
    verifiedBy: "Dr. Alok Gupta (IIT Kanpur)",
    notes: "Alambagh bus depot intervention node operational.",
    auditHash: "sha256:e3b0c...4298",
  },
  {
    id: "meas-cov-6",
    kpiId: "kpi-monitoring-coverage",
    measuredAt: "2026-07-22T10:00:00Z",
    dateLabel: "22 Jul (W10)",
    value: 78.0,
    targetValue: 85.0,
    baselineValue: 35.0,
    sourceNode: "GIS Voronoi Engine",
    verifiedBy: "Rajesh Verma (Officer)",
    notes: "Current audit. 40 nodes online with elevated LoRaWAN antenna placement.",
    auditHash: "sha256:b38a1...7561",
  },

  // 2. Sensor Accuracy vs BAM-1020 Reference (Baseline: 82% -> Target: 92% -> Current: 95%)
  {
    id: "meas-acc-1",
    kpiId: "kpi-sensor-accuracy",
    measuredAt: "2026-05-15T12:00:00Z",
    dateLabel: "15 May (C1)",
    value: 82.0,
    targetValue: 92.0,
    baselineValue: 82.0,
    sourceNode: "Lalbagh BAM-1020 Analyzer",
    verifiedBy: "Priya Nair (TERI)",
    notes: "Factory bench calibration before deployment.",
    auditHash: "sha256:1a2b3...4c5d",
  },
  {
    id: "meas-acc-2",
    kpiId: "kpi-sensor-accuracy",
    measuredAt: "2026-06-01T12:00:00Z",
    dateLabel: "01 Jun (C2)",
    value: 86.5,
    targetValue: 92.0,
    baselineValue: 82.0,
    sourceNode: "Lalbagh BAM-1020 Analyzer",
    verifiedBy: "Priya Nair (TERI)",
    notes: "First on-site collocation polynomial correction.",
    auditHash: "sha256:2b3c4...5d6e",
  },
  {
    id: "meas-acc-3",
    kpiId: "kpi-sensor-accuracy",
    measuredAt: "2026-06-20T12:00:00Z",
    dateLabel: "20 Jun (C3)",
    value: 91.0,
    targetValue: 92.0,
    baselineValue: 82.0,
    sourceNode: "Lalbagh BAM-1020 Analyzer",
    verifiedBy: "Priya Nair (TERI)",
    notes: "Relative humidity machine-learning compensation activated.",
    auditHash: "sha256:3c4d5...6e7f",
  },
  {
    id: "meas-acc-4",
    kpiId: "kpi-sensor-accuracy",
    measuredAt: "2026-07-10T12:00:00Z",
    dateLabel: "10 Jul (C4)",
    value: 93.5,
    targetValue: 92.0,
    baselineValue: 82.0,
    sourceNode: "Lalbagh BAM-1020 Analyzer",
    verifiedBy: "Priya Nair (TERI)",
    notes: "Statutory target exceeded under intense summer dust conditions.",
    auditHash: "sha256:4d5e6...7f8g",
  },
  {
    id: "meas-acc-5",
    kpiId: "kpi-sensor-accuracy",
    measuredAt: "2026-07-24T12:00:00Z",
    dateLabel: "24 Jul (C5)",
    value: 95.0,
    targetValue: 92.0,
    baselineValue: 82.0,
    sourceNode: "Lalbagh BAM-1020 Analyzer",
    verifiedBy: "Priya Nair (TERI)",
    notes: "Official verification audit confirming R² = 0.952.",
    auditHash: "sha256:5e6f7...8g9h",
  },

  // 3. Fleet Uptime (Baseline: 76% -> Target: 95% -> Current: 97.2%)
  {
    id: "meas-upt-1",
    kpiId: "kpi-fleet-uptime",
    measuredAt: "2026-05-20T00:00:00Z",
    dateLabel: "20 May",
    value: 76.0,
    targetValue: 95.0,
    baselineValue: 76.0,
    sourceNode: "ICCC Heartbeat Daemon",
    verifiedBy: "ICCC Operations Lead",
    notes: "Initial deployment telemetry; solar battery cycling in progress.",
    auditHash: "sha256:6f7g8...9h0i",
  },
  {
    id: "meas-upt-2",
    kpiId: "kpi-fleet-uptime",
    measuredAt: "2026-06-10T00:00:00Z",
    dateLabel: "10 Jun",
    value: 84.5,
    targetValue: 95.0,
    baselineValue: 76.0,
    sourceNode: "ICCC Heartbeat Daemon",
    verifiedBy: "ICCC Operations Lead",
    notes: "Firmware watchdog update applied OTA.",
    auditHash: "sha256:7g8h9...0i1j",
  },
  {
    id: "meas-upt-3",
    kpiId: "kpi-fleet-uptime",
    measuredAt: "2026-06-30T00:00:00Z",
    dateLabel: "30 Jun",
    value: 92.0,
    targetValue: 95.0,
    baselineValue: 76.0,
    sourceNode: "ICCC Heartbeat Daemon",
    verifiedBy: "ICCC Operations Lead",
    notes: "LoRaWAN gateway redundancy enabled across Hazratganj.",
    auditHash: "sha256:8h9i0...1j2k",
  },
  {
    id: "meas-upt-4",
    kpiId: "kpi-fleet-uptime",
    measuredAt: "2026-07-20T00:00:00Z",
    dateLabel: "20 Jul",
    value: 97.2,
    targetValue: 95.0,
    baselineValue: 76.0,
    sourceNode: "ICCC Heartbeat Daemon",
    verifiedBy: "ICCC Operations Lead",
    notes: "Zero packet dropouts recorded across 7 consecutive operational days.",
    auditHash: "sha256:9i0j1...2k3l",
  },

  // 4. Misting Latency (Baseline: 25.0 min -> Target: 10.0 min -> Current: 6.8 min)
  {
    id: "meas-mis-1",
    kpiId: "kpi-misting-latency",
    measuredAt: "2026-05-25T14:00:00Z",
    dateLabel: "25 May",
    value: 25.0,
    targetValue: 10.0,
    baselineValue: 25.0,
    sourceNode: "Municipal Telematics",
    verifiedBy: "Fleet Manager",
    notes: "Manual telephone dispatch baseline.",
    auditHash: "sha256:0j1k2...3l4m",
  },
  {
    id: "meas-mis-2",
    kpiId: "kpi-misting-latency",
    measuredAt: "2026-06-15T14:00:00Z",
    dateLabel: "15 Jun",
    value: 15.5,
    targetValue: 10.0,
    baselineValue: 25.0,
    sourceNode: "Municipal Telematics",
    verifiedBy: "Fleet Manager",
    notes: "SMS alert to misting driver.",
    auditHash: "sha256:1k2l3...4m5n",
  },
  {
    id: "meas-mis-3",
    kpiId: "kpi-misting-latency",
    measuredAt: "2026-07-05T14:00:00Z",
    dateLabel: "05 Jul",
    value: 9.4,
    targetValue: 10.0,
    baselineValue: 25.0,
    sourceNode: "Municipal Telematics",
    verifiedBy: "Fleet Manager",
    notes: "Direct geofenced API vehicle dispatch integration.",
    auditHash: "sha256:2l3m4...5n6o",
  },
  {
    id: "meas-mis-4",
    kpiId: "kpi-misting-latency",
    measuredAt: "2026-07-25T14:00:00Z",
    dateLabel: "25 Jul",
    value: 6.8,
    targetValue: 10.0,
    baselineValue: 25.0,
    sourceNode: "Municipal Telematics",
    verifiedBy: "Fleet Manager",
    notes: "Automated vehicle dispatch under 7 minutes confirmed.",
    auditHash: "sha256:3m4n5...6o7p",
  },
];

// Database Query Functions
export function queryAllKPIs(pilotId?: string): KPIRecord[] {
  if (pilotId) {
    return KPIS_DATABASE.filter((k) => k.pilotId === pilotId);
  }
  return KPIS_DATABASE;
}

export function queryKPIById(id: string): KPIRecord | undefined {
  return KPIS_DATABASE.find((k) => k.id === id);
}

export function queryHistoricalMeasurements(kpiId: string): KPIMeasurementRecord[] {
  return KPI_MEASUREMENTS_DATABASE
    .filter((m) => m.kpiId === kpiId)
    .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime());
}

export function insertKPIMeasurement(
  kpiId: string,
  value: number,
  notes: string,
  sourceNode?: string,
  verifiedBy?: string
): { success: boolean; measurement?: KPIMeasurementRecord; kpi?: KPIRecord } {
  const kpi = KPIS_DATABASE.find((k) => k.id === kpiId);
  if (!kpi) return { success: false };

  const now = new Date();
  const dateLabel = `${now.getDate()} ${now.toLocaleString("en-IN", { month: "short" })}`;

  const randomHash = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

  const newMeasurement: KPIMeasurementRecord = {
    id: `meas-${Date.now()}`,
    kpiId,
    measuredAt: now.toISOString(),
    dateLabel,
    value,
    targetValue: kpi.target,
    baselineValue: kpi.baseline,
    sourceNode: sourceNode || "Manual Field Calibration Log",
    verifiedBy: verifiedBy || "Government Officer",
    notes: notes || "Empirical field measurement recorded.",
    auditHash: `sha256:${randomHash.slice(0, 8)}...${randomHash.slice(-4)}`,
  };

  KPI_MEASUREMENTS_DATABASE.push(newMeasurement);

  // Update current value & status in KPI record
  kpi.currentValue = value;
  kpi.lastMeasuredAt = now.toISOString();

  if (kpi.direction === "HIGHER_IS_BETTER") {
    if (value >= kpi.target) kpi.status = "EXCEEDING";
    else if (value >= kpi.warningThreshold) kpi.status = "ON_TRACK";
    else if (value >= kpi.criticalThreshold) kpi.status = "NEEDS_ATTENTION";
    else kpi.status = "CRITICAL";
  } else {
    // LOWER_IS_BETTER
    if (value <= kpi.target) kpi.status = "EXCEEDING";
    else if (value <= kpi.warningThreshold) kpi.status = "ON_TRACK";
    else if (value <= kpi.criticalThreshold) kpi.status = "NEEDS_ATTENTION";
    else kpi.status = "CRITICAL";
  }

  return { success: true, measurement: newMeasurement, kpi };
}
