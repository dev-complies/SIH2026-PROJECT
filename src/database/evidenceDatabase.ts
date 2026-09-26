// In-memory persistent database for Evidence Management
// Supports bidirectional traceability: KPI → Measurement → Evidence
// Implements secure file access and confidentiality boundaries

export type EvidenceType =
  | "Document"
  | "Image"
  | "Video"
  | "Sensor Data"
  | "Report"
  | "System Log";

export type VerificationStatus =
  | "Unverified"
  | "Under Review"
  | "Verified"
  | "Rejected";

export type ConfidentialityLevel =
  | "PUBLIC"
  | "RESTRICTED"
  | "CONFIDENTIAL_GOV_ONLY"
  | "PROPRIETARY_STARTUP";

export interface EvidenceRecord {
  id: string;
  title: string;
  type: EvidenceType;
  uploader: {
    id: string;
    name: string;
    role: "STARTUP" | "GOVERNMENT_OFFICER" | "VALIDATOR" | "EXPERT" | "ADMIN";
    organization: string;
    avatarUrl?: string;
  };
  timestamp: string; // ISO date
  relatedKpiId: string;
  relatedKpiName: string;
  relatedMeasurementId: string;
  relatedMeasurementLabel: string;
  relatedMilestoneId: string; // M1, M2, M3, M4, M5
  relatedMilestoneName: string;
  description: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  fileSize: string;
  fileFormat: string;
  sha256Hash: string;
  confidentialityLevel: ConfidentialityLevel;
  pilotId: string;
  previewUrl?: string;
  downloadToken: string;
  metadata?: Record<string, any>;
}

// Initial Database Seed for Lucknow Air Quality Pilot (PILOT-UP-UAQ-01)
let EVIDENCE_DATABASE: EvidenceRecord[] = [
  // 1. Evidence for KPI: Monitoring Coverage -> Measurement: meas-cov-6 (22 Jul, 78.0%) -> Milestone: M3
  {
    id: "evi-cov-01",
    title: "Lucknow_Ward_Voronoi_Spatial_Coverage_Analysis.geojson",
    type: "Sensor Data",
    uploader: {
      id: "u-founder",
      name: "Rohan Varma",
      role: "STARTUP",
      organization: "AirSense Technologies Pvt Ltd",
    },
    timestamp: "2026-07-22T09:15:00Z",
    relatedKpiId: "kpi-monitoring-coverage",
    relatedKpiName: "Monitoring Coverage",
    relatedMeasurementId: "meas-cov-6",
    relatedMeasurementLabel: "22 Jul (W10) - 78.0% Coverage",
    relatedMilestoneId: "M3",
    relatedMilestoneName: "M3: Urban Deployment & Sensor Mesh Commissioning",
    description:
      "Full GIS polygon Voronoi shapefile confirming 40 active calibrated sensing nodes covering 78.0% of targeted urban ward area within a 500m geofence buffer radius.",
    verificationStatus: "Verified",
    verifiedBy: "Rajesh Verma (Government Officer, Urban Dev)",
    verifiedAt: "2026-07-23T14:30:00Z",
    fileSize: "14.2 MB",
    fileFormat: "GeoJSON / WGS-84",
    sha256Hash: "b38a162df9012a95c478e82110c978bbfa4923e11029487cba1024567561a098",
    confidentialityLevel: "RESTRICTED",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-cov-01-sec",
    metadata: {
      wardsCovered: [14, 18, 22, 29, 34, 41],
      totalSensorNodes: 40,
      bufferRadiusMeters: 500,
    },
  },
  {
    id: "evi-cov-02",
    title: "Hazratganj_Arterial_Pole_Mounting_Verification.jpg",
    type: "Image",
    uploader: {
      id: "u-field-eng",
      name: "Ananya Dixit",
      role: "STARTUP",
      organization: "AirSense Technologies Pvt Ltd",
    },
    timestamp: "2026-07-22T08:45:00Z",
    relatedKpiId: "kpi-monitoring-coverage",
    relatedKpiName: "Monitoring Coverage",
    relatedMeasurementId: "meas-cov-6",
    relatedMeasurementLabel: "22 Jul (W10) - 78.0% Coverage",
    relatedMilestoneId: "M3",
    relatedMilestoneName: "M3: Urban Deployment & Sensor Mesh Commissioning",
    description:
      "Geo-tagged high-resolution photographic evidence showing Node AS-LKO-029 installed on municipal streetlight pole at Hazratganj intersection with solar backup array.",
    verificationStatus: "Verified",
    verifiedBy: "Rajesh Verma (Government Officer, Urban Dev)",
    verifiedAt: "2026-07-23T14:35:00Z",
    fileSize: "4.8 MB",
    fileFormat: "JPEG (EXIF Geotagged)",
    sha256Hash: "7b91c09823fca1102948cde901823746ba1029837461520192837465102a991b",
    confidentialityLevel: "PUBLIC",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-cov-02-sec",
    metadata: {
      latitude: "26.8467° N",
      longitude: "80.9462° E",
      altitude: "123m ASL",
      poleId: "LMC-POLE-HG-104",
    },
  },
  {
    id: "evi-cov-03",
    title: "Municipal_Corridor_Drone_Survey_Flyover.mp4",
    type: "Video",
    uploader: {
      id: "u-founder",
      name: "Rohan Varma",
      role: "STARTUP",
      organization: "AirSense Technologies Pvt Ltd",
    },
    timestamp: "2026-07-21T16:20:00Z",
    relatedKpiId: "kpi-monitoring-coverage",
    relatedKpiName: "Monitoring Coverage",
    relatedMeasurementId: "meas-cov-6",
    relatedMeasurementLabel: "22 Jul (W10) - 78.0% Coverage",
    relatedMilestoneId: "M3",
    relatedMilestoneName: "M3: Urban Deployment & Sensor Mesh Commissioning",
    description:
      "4K aerial drone survey documenting line-of-sight elevation and LoRaWAN gateway signal propagation across Charbagh to Hazratganj arterial corridor.",
    verificationStatus: "Under Review",
    verifiedBy: undefined,
    verifiedAt: undefined,
    fileSize: "186.4 MB",
    fileFormat: "MP4 / H.265",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    confidentialityLevel: "RESTRICTED",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-cov-03-sec",
    metadata: {
      durationSeconds: 184,
      resolution: "3840x2160",
      pilotLicense: "DGCA-RPAS-2025-UP-088",
    },
  },

  // 2. Evidence for KPI: Sensor Accuracy vs Reference -> Measurement: meas-acc-5 (24 Jul, 95.0%) -> Milestone: M1 & M4
  {
    id: "evi-acc-01",
    title: "CPCB_Lalbagh_Collocation_Audit_Certification.pdf",
    type: "Report",
    uploader: {
      id: "u-validator",
      name: "Priya Nair",
      role: "VALIDATOR",
      organization: "TERI Environmental Audit Division",
    },
    timestamp: "2026-07-24T14:10:00Z",
    relatedKpiId: "kpi-sensor-accuracy",
    relatedKpiName: "Sensor Accuracy vs Reference",
    relatedMeasurementId: "meas-acc-5",
    relatedMeasurementLabel: "24 Jul (C5) - R² = 95.0% Accuracy",
    relatedMilestoneId: "M1",
    relatedMilestoneName: "M1: Testbed Collocation & Baseline Calibration",
    description:
      "Statutory independent third-party audit report verifying R² = 0.952 correlation against CPCB BAM-1020 reference station over 60-day collocation testbed.",
    verificationStatus: "Verified",
    verifiedBy: "Dr. Alok Gupta (IIT Kanpur Expert Reviewer)",
    verifiedAt: "2026-07-25T11:00:00Z",
    fileSize: "6.2 MB",
    fileFormat: "PDF / ISO-19005-1 (Archival)",
    sha256Hash: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    confidentialityLevel: "PUBLIC",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-acc-01-sec",
    metadata: {
      accreditation: "NABL-TC-8891 / CPCB Empanelled",
      linearEquation: "y = 0.984x + 1.21",
      rSquare: 0.952,
    },
  },
  {
    id: "evi-acc-02",
    title: "Lalbagh_BAM1020_Dual_Stream_60Day_Telemetry.parquet",
    type: "Sensor Data",
    uploader: {
      id: "u-validator",
      name: "Priya Nair",
      role: "VALIDATOR",
      organization: "TERI Environmental Audit Division",
    },
    timestamp: "2026-07-24T12:30:00Z",
    relatedKpiId: "kpi-sensor-accuracy",
    relatedKpiName: "Sensor Accuracy vs Reference",
    relatedMeasurementId: "meas-acc-5",
    relatedMeasurementLabel: "24 Jul (C5) - R² = 95.0% Accuracy",
    relatedMilestoneId: "M1",
    relatedMilestoneName: "M1: Testbed Collocation & Baseline Calibration",
    description:
      "Synchronous 1-minute time-series telemetry parquet file containing dual-column PM2.5 / PM10 readings from AirSense sensor Node-01 and BAM-1020 Beta-Attenuation Monitor.",
    verificationStatus: "Verified",
    verifiedBy: "Rajesh Verma (Government Officer)",
    verifiedAt: "2026-07-25T11:15:00Z",
    fileSize: "84.1 MB",
    fileFormat: "Apache Parquet / Snappy Compressed",
    sha256Hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    confidentialityLevel: "RESTRICTED",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-acc-02-sec",
    metadata: {
      recordCount: 86400,
      timestampStart: "2026-05-15T00:00:00Z",
      timestampEnd: "2026-07-24T00:00:00Z",
    },
  },

  // 3. Evidence for KPI: Fleet Telemetry Uptime -> Measurement: meas-upt-4 (20 Jul, 97.2%) -> Milestone: M3
  {
    id: "evi-upt-01",
    title: "Lucknow_ICCC_MQTT_Ingestion_Syslog_Archive.log",
    type: "System Log",
    uploader: {
      id: "u-founder",
      name: "Rohan Varma",
      role: "STARTUP",
      organization: "AirSense Technologies Pvt Ltd",
    },
    timestamp: "2026-07-20T10:00:00Z",
    relatedKpiId: "kpi-fleet-uptime",
    relatedKpiName: "Fleet Telemetry Uptime",
    relatedMeasurementId: "meas-upt-4",
    relatedMeasurementLabel: "20 Jul - 97.2% Uptime",
    relatedMilestoneId: "M3",
    relatedMilestoneName: "M3: Urban Deployment & Sensor Mesh Commissioning",
    description:
      "Server-side MQTT broker connection logs, packet sequence verification digests, and TCP socket keepalive heartbeats confirming 97.2% packet retention at Lucknow ICCC.",
    verificationStatus: "Verified",
    verifiedBy: "Lucknow Smart City ICCC Systems Engineer",
    verifiedAt: "2026-07-21T09:00:00Z",
    fileSize: "22.5 MB",
    fileFormat: "Syslog / RFC-5424",
    sha256Hash: "9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    confidentialityLevel: "CONFIDENTIAL_GOV_ONLY",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-upt-01-sec",
    metadata: {
      totalPacketsExpected: 172800,
      totalPacketsReceived: 167961,
      packetLossRatio: "2.8%",
    },
  },

  // 4. Evidence for KPI: Automated Misting Latency -> Measurement: meas-mis-4 (25 Jul, 6.8 min) -> Milestone: M4
  {
    id: "evi-mis-01",
    title: "Municipal_Fleet_Geofenced_Dispatch_Audit_Log.json",
    type: "System Log",
    uploader: {
      id: "u-fleet",
      name: "Suresh Chandra",
      role: "GOVERNMENT_OFFICER",
      organization: "Lucknow Municipal Transport Department",
    },
    timestamp: "2026-07-25T15:30:00Z",
    relatedKpiId: "kpi-misting-latency",
    relatedKpiName: "Automated Misting Trigger Latency",
    relatedMeasurementId: "meas-mis-4",
    relatedMeasurementLabel: "25 Jul - 6.8 min Latency",
    relatedMilestoneId: "M4",
    relatedMilestoneName: "M4: Automated Hotspot Misting Integration",
    description:
      "API webhook audit logs from AirSense pollution spike alert trigger to municipal anti-smog misting gun truck automated ignition and departure.",
    verificationStatus: "Verified",
    verifiedBy: "Rajesh Verma (Government Officer)",
    verifiedAt: "2026-07-25T16:00:00Z",
    fileSize: "3.1 MB",
    fileFormat: "JSON / REST Webhook Log",
    sha256Hash: "3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    confidentialityLevel: "RESTRICTED",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-mis-01-sec",
    metadata: {
      triggerTime: "14:32:10 UTC",
      dispatchAckTime: "14:38:58 UTC",
      elapsedMinutes: 6.8,
    },
  },
  {
    id: "evi-mis-02",
    title: "Anti_Smog_Misting_Truck_Dashcam_Intervention.mp4",
    type: "Video",
    uploader: {
      id: "u-fleet",
      name: "Suresh Chandra",
      role: "GOVERNMENT_OFFICER",
      organization: "Lucknow Municipal Transport Department",
    },
    timestamp: "2026-07-25T15:45:00Z",
    relatedKpiId: "kpi-misting-latency",
    relatedKpiName: "Automated Misting Trigger Latency",
    relatedMeasurementId: "meas-mis-4",
    relatedMeasurementLabel: "25 Jul - 6.8 min Latency",
    relatedMilestoneId: "M4",
    relatedMilestoneName: "M4: Automated Hotspot Misting Integration",
    description:
      "Vehicle onboard telematics dashcam footage verifying misting truck deployment at Charbagh railway rotary within 7 minutes of localized PM10 spike threshold breach.",
    verificationStatus: "Verified",
    verifiedBy: "Rajesh Verma (Government Officer)",
    verifiedAt: "2026-07-25T16:15:00Z",
    fileSize: "142.0 MB",
    fileFormat: "MP4 / H.264 Dashcam Stream",
    sha256Hash: "8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    confidentialityLevel: "PUBLIC",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-mis-02-sec",
    metadata: {
      vehicleRegistration: "UP-32-EG-4912",
      hotspotLocation: "Charbagh Station Circle",
      sprayDurationMin: 35,
    },
  },

  // 5. Evidence for KPI: Optical Chamber Baseline Drift -> Measurement: meas-drf-1 -> Milestone: M2
  {
    id: "evi-drf-01",
    title: "Cyclonic_Purge_Optical_Chamber_Laboratory_Report.pdf",
    type: "Document",
    uploader: {
      id: "u-founder",
      name: "Rohan Varma",
      role: "STARTUP",
      organization: "AirSense Technologies Pvt Ltd",
    },
    timestamp: "2026-07-24T18:30:00Z",
    relatedKpiId: "kpi-sensor-drift",
    relatedKpiName: "Optical Chamber Baseline Drift",
    relatedMeasurementId: "meas-cov-6", // cross-calibration
    relatedMeasurementLabel: "24 Jul - 2.8% Drift",
    relatedMilestoneId: "M2",
    relatedMilestoneName: "M2: Municipal Fleet Sensor Integration",
    description:
      "Proprietary micro-fluidic zero-drift optical chamber test protocol showing laser diode attenuation measurements across 60 days of continuous dust chamber exposure.",
    verificationStatus: "Under Review",
    verifiedBy: undefined,
    verifiedAt: undefined,
    fileSize: "11.8 MB",
    fileFormat: "PDF / Engineering Schematics",
    sha256Hash: "4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
    confidentialityLevel: "PROPRIETARY_STARTUP",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-drf-01-sec",
    metadata: {
      patentRef: "IN-TEMP-2025-09129",
      chamberTemperatureRange: "15°C - 48°C",
    },
  },

  // 6. Rejected Evidence Example (illustrates rejection audit trail)
  {
    id: "evi-rej-01",
    title: "Draft_Collocation_Preliminary_Calculations.xlsx",
    type: "Document",
    uploader: {
      id: "u-intern",
      name: "Amit Saxena",
      role: "STARTUP",
      organization: "AirSense Technologies Pvt Ltd",
    },
    timestamp: "2026-06-18T11:00:00Z",
    relatedKpiId: "kpi-sensor-accuracy",
    relatedKpiName: "Sensor Accuracy vs Reference",
    relatedMeasurementId: "meas-acc-3",
    relatedMeasurementLabel: "20 Jun (C3) - R² = 91.0% Accuracy",
    relatedMilestoneId: "M1",
    relatedMilestoneName: "M1: Testbed Collocation & Baseline Calibration",
    description:
      "Unverified initial spreadsheet with manual regression formulas prior to NABL testbed verification.",
    verificationStatus: "Rejected",
    verifiedBy: "Dr. Alok Gupta (IIT Kanpur Expert Reviewer)",
    verifiedAt: "2026-06-19T10:15:00Z",
    rejectionReason:
      "Raw spreadsheet contains uncalibrated manual baseline offsets without cryptographic raw instrument logs. Please provide direct BAM-1020 collocated CSV/Parquet extract signed by testbed lead.",
    fileSize: "1.4 MB",
    fileFormat: "XLSX",
    sha256Hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    confidentialityLevel: "PROPRIETARY_STARTUP",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-rej-01-sec",
  },

  // 7. Unverified Evidence Example (illustrates pending queue)
  {
    id: "evi-unv-01",
    title: "Weekly_Optical_Chamber_Purge_Diagnostics_Week11.log",
    type: "System Log",
    uploader: {
      id: "u-field-eng",
      name: "Ananya Dixit",
      role: "STARTUP",
      organization: "AirSense Technologies Pvt Ltd",
    },
    timestamp: "2026-07-26T07:10:00Z",
    relatedKpiId: "kpi-sensor-drift",
    relatedKpiName: "Optical Chamber Baseline Drift",
    relatedMeasurementId: "meas-cov-6",
    relatedMeasurementLabel: "26 Jul - Week 11 Diagnostics",
    relatedMilestoneId: "M3",
    relatedMilestoneName: "M3: Urban Deployment & Sensor Mesh Commissioning",
    description:
      "Automated optical purge cycle logs for 40 sensing nodes after monsoon dust storm. Telemetry recorded zero lens fouling across all 40 chambers.",
    verificationStatus: "Unverified",
    verifiedBy: undefined,
    verifiedAt: undefined,
    fileSize: "8.9 MB",
    fileFormat: "ASCII Log / GZIP",
    sha256Hash: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    confidentialityLevel: "RESTRICTED",
    pilotId: "PILOT-UP-UAQ-01",
    downloadToken: "tok-unv-01-sec",
  },
];

// Helper: Secure file access authorization checker
export function canUserAccessEvidence(
  evidence: EvidenceRecord,
  user: {
    role: string;
    organization?: string;
    userId?: string;
  }
): { allowed: boolean; reason?: string } {
  // Public files can be viewed by any authenticated user
  if (evidence.confidentialityLevel === "PUBLIC") {
    return { allowed: true };
  }

  // Admins and assigned Government Officers have oversight of pilot evidence
  if (user.role === "ADMIN" || user.role === "GOVERNMENT_OFFICER" || user.role === "PROCUREMENT_OFFICER") {
    return { allowed: true };
  }

  // Validators can view RESTRICTED and PUBLIC files for audit
  if (user.role === "VALIDATOR") {
    if (evidence.confidentialityLevel === "CONFIDENTIAL_GOV_ONLY") {
      return { allowed: false, reason: "Restricted to municipal government and procurement officers." };
    }
    return { allowed: true };
  }

  // Experts can view technical evidence except internal government notes or non-assigned files
  if (user.role === "EXPERT") {
    if (evidence.confidentialityLevel === "CONFIDENTIAL_GOV_ONLY") {
      return { allowed: false, reason: "Confidential internal government administrative record." };
    }
    return { allowed: true };
  }

  // Startups: Can ONLY access their own proprietary or public/restricted files in their pilot
  if (user.role === "STARTUP") {
    if (evidence.confidentialityLevel === "CONFIDENTIAL_GOV_ONLY") {
      return { allowed: false, reason: "Confidential government audit notes are shielded from startups." };
    }

    // Check if the startup belongs to the same organization that uploaded or owns the pilot
    if (
      evidence.confidentialityLevel === "PROPRIETARY_STARTUP" &&
      user.organization &&
      evidence.uploader.organization !== user.organization
    ) {
      return {
        allowed: false,
        reason: "Access denied: Proprietary IP of another startup organization.",
      };
    }

    return { allowed: true };
  }

  return { allowed: false, reason: "Insufficient clearance credentials." };
}

// Query all evidence with security filtering
export function queryEvidence(
  filters: {
    kpiId?: string;
    measurementId?: string;
    milestoneId?: string;
    type?: EvidenceType;
    status?: VerificationStatus;
    pilotId?: string;
  },
  currentUser?: {
    role: string;
    organization?: string;
    userId?: string;
  }
): EvidenceRecord[] {
  return EVIDENCE_DATABASE.filter((evi) => {
    if (filters.kpiId && evi.relatedKpiId !== filters.kpiId) return false;
    if (filters.measurementId && evi.relatedMeasurementId !== filters.measurementId) return false;
    if (filters.milestoneId && evi.relatedMilestoneId !== filters.milestoneId) return false;
    if (filters.type && evi.type !== filters.type) return false;
    if (filters.status && evi.verificationStatus !== filters.status) return false;
    if (filters.pilotId && evi.pilotId !== filters.pilotId) return false;

    // RBAC check
    if (currentUser) {
      const access = canUserAccessEvidence(evi, currentUser);
      if (!access.allowed) return false;
    }

    return true;
  });
}

// Get single evidence with security check
export function getEvidenceById(
  id: string,
  currentUser?: {
    role: string;
    organization?: string;
    userId?: string;
  }
): { evidence?: EvidenceRecord; error?: string; status?: number } {
  const item = EVIDENCE_DATABASE.find((e) => e.id === id);
  if (!item) {
    return { error: "Evidence record not found", status: 404 };
  }

  if (currentUser) {
    const access = canUserAccessEvidence(item, currentUser);
    if (!access.allowed) {
      return { error: access.reason || "Forbidden: Access to private evidence denied", status: 403 };
    }
  }

  return { evidence: item, status: 200 };
}

// KPI → Measurement → Evidence Traceability Chain
export interface TraceabilityNode {
  kpiId: string;
  kpiName: string;
  baseline: number;
  target: number;
  currentValue: number;
  unit: string;
  status: string;
  measurements: {
    measurementId: string;
    dateLabel: string;
    measuredAt: string;
    value: number;
    notes: string;
    sourceNode: string;
    verifiedBy: string;
    evidence: EvidenceRecord[];
  }[];
}

export function getKpiTraceability(
  kpiId: string,
  kpiList: { id: string; name: string; baseline: number; target: number; currentValue: number; unit: string; status: string }[],
  measurementList: { id: string; kpiId: string; dateLabel: string; measuredAt: string; value: number; notes: string; sourceNode: string; verifiedBy: string }[],
  currentUser?: { role: string; organization?: string; userId?: string }
): TraceabilityNode | null {
  const kpi = kpiList.find((k) => k.id === kpiId);
  if (!kpi) return null;

  const kpiMeasurements = measurementList.filter((m) => m.kpiId === kpiId);

  const measurementsWithEvidence = kpiMeasurements.map((m) => {
    const evidenceForMeas = queryEvidence({ measurementId: m.id }, currentUser);
    return {
      measurementId: m.id,
      dateLabel: m.dateLabel,
      measuredAt: m.measuredAt,
      value: m.value,
      notes: m.notes,
      sourceNode: m.sourceNode,
      verifiedBy: m.verifiedBy,
      evidence: evidenceForMeas,
    };
  });

  return {
    kpiId: kpi.id,
    kpiName: kpi.name,
    baseline: kpi.baseline,
    target: kpi.target,
    currentValue: kpi.currentValue,
    unit: kpi.unit,
    status: kpi.status,
    measurements: measurementsWithEvidence,
  };
}

// Insert new evidence record
export function insertEvidenceRecord(data: Omit<EvidenceRecord, "id" | "timestamp" | "downloadToken">): EvidenceRecord {
  const randomToken = "tok-" + Math.random().toString(36).substring(2, 10);
  const newRecord: EvidenceRecord = {
    ...data,
    id: `evi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    downloadToken: randomToken,
  };

  EVIDENCE_DATABASE.unshift(newRecord);
  return newRecord;
}

// Verify or reject evidence record
export function updateEvidenceVerification(
  evidenceId: string,
  newStatus: VerificationStatus,
  verifier: { name: string; role: string },
  rejectionReason?: string
): { success: boolean; evidence?: EvidenceRecord; error?: string } {
  const item = EVIDENCE_DATABASE.find((e) => e.id === evidenceId);
  if (!item) {
    return { success: false, error: "Evidence record not found" };
  }

  item.verificationStatus = newStatus;
  item.verifiedBy = `${verifier.name} (${verifier.role})`;
  item.verifiedAt = new Date().toISOString();

  if (newStatus === "Rejected") {
    item.rejectionReason = rejectionReason || "Evidence failed technical validation criteria.";
  } else {
    item.rejectionReason = undefined;
  }

  return { success: true, evidence: item };
}
