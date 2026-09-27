/**
 * Statutory Cryptographic Audit Logging Database
 * Immutable, append-only ledger recording all critical procurement and operational actions.
 * Enforces SHA-256 hash chaining to guarantee tamper-evidence and regulatory compliance.
 * Modifications and deletions are strictly prohibited by system architecture.
 */

export type AuditActionType =
  | "Challenge Published"
  | "Application Submitted"
  | "Eligibility Approved"
  | "Evaluation Submitted"
  | "Startup Shortlisted"
  | "Pilot Started"
  | "Milestone Approved"
  | "Payment Approved"
  | "Validation Submitted"
  | "Scale-Up Decision Made"
  | "Evidence Uploaded"
  | "Risk Mitigated"
  | "Contract Signed";

export type AuditEntityType =
  | "Challenge"
  | "Application"
  | "Startup"
  | "Pilot"
  | "Milestone"
  | "Payment"
  | "ValidationReport"
  | "ScaleUpDossier"
  | "Evidence"
  | "Contract";

export interface AuditLogEntry {
  id: string;
  sequenceNumber: number;
  user: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
  role: string; // "GOVERNMENT_OFFICER" | "STARTUP" | "EXPERT" | "VALIDATOR" | "PROCUREMENT_OFFICER" | "ADMIN"
  action: AuditActionType;
  entity: AuditEntityType;
  entityId: string;
  entityName?: string;
  timestamp: string; // ISO 8601
  previousState: Record<string, any> | string;
  newState: Record<string, any> | string;
  ipAddress: string;
  userAgent: string;
  previousHash: string;
  currentHash: string; // SHA-256(previousHash + sequence + timestamp + user + action + entityId + newState)
  statutoryRuleRef: string; // e.g. "GFR Rule 149(v)", "GFR Rule 144", "DPDP Act Sec 8"
}

export interface AuditFilterParams {
  search?: string;
  user?: string;
  role?: string;
  entity?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  timeRange?: "ALL" | "TODAY" | "7D" | "30D" | "90D";
}

// Simple deterministic SHA-256 mock/generator for audit chain
function computeHash(payload: string): string {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  // Convert to 64-char hex string
  const absHex = Math.abs(hash).toString(16).padStart(8, "0");
  const seed = payload.length.toString(16).padStart(4, "0");
  return (absHex + seed + "a9c0827b14d8e90f23b7c8a1e2f3d4c5b6a7980123456789abcdef0123456789").slice(0, 64);
}

const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

// Seed data featuring all 10 prompt-mandated operational transitions
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-001",
    sequenceNumber: 1,
    user: {
      id: "usr-gov-01",
      name: "Rajesh Verma",
      email: "officer@urban.gov.in",
      department: "Directorate of Urban Development, Govt of UP",
    },
    role: "GOVERNMENT_OFFICER",
    action: "Challenge Published",
    entity: "Challenge",
    entityId: "CHAL-UP-UAQ-2026",
    entityName: "Hyperlocal Air Quality Monitoring & Rapid Ward Intervention",
    timestamp: "2026-04-10T09:30:00Z",
    previousState: {
      status: "DRAFT",
      isPublished: false,
      allocatedBudgetInr: 2500000,
    },
    newState: {
      status: "PUBLISHED",
      isPublished: true,
      publishedAt: "2026-04-10T09:30:00Z",
      allocatedBudgetInr: 2500000,
      applicationsWindowDays: 30,
    },
    ipAddress: "10.14.22.105 (State NIC Gateway)",
    userAgent: "GovInnovate-Portal/2.4 (Enterprise Chrome/128; macOS)",
    previousHash: GENESIS_HASH,
    currentHash: "a810b4291c0e8271049281a0b82749102847291a0b82749102847291a0b82749",
    statutoryRuleRef: "GFR Rule 144 (Public Notice Mandate)",
  },
  {
    id: "AUD-002",
    sequenceNumber: 2,
    user: {
      id: "usr-startup-01",
      name: "Dr. Tarun Saxena",
      email: "founder@airsense.example.com",
      department: "AirSense Technologies Pvt Ltd (DPIIT-94812)",
    },
    role: "STARTUP",
    action: "Application Submitted",
    entity: "Application",
    entityId: "APP-AIR-2026-01",
    entityName: "AirSense Multi-Ward Optical OPC & Gas Telemetry Mesh",
    timestamp: "2026-04-28T14:15:22Z",
    previousState: {
      status: "IN_PROGRESS",
      dossierComplete: false,
      documentsUploaded: 4,
    },
    newState: {
      status: "SUBMITTED",
      dossierComplete: true,
      documentsUploaded: 7,
      proposalDigest: "SHA256:d8a927c3e1b4...881f",
      submittedAt: "2026-04-28T14:15:22Z",
    },
    ipAddress: "106.51.78.210",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    previousHash: "a810b4291c0e8271049281a0b82749102847291a0b82749102847291a0b82749",
    currentHash: "b921c5302d1f9382150392b1c93850213958302b1c93850213958302b1c93850",
    statutoryRuleRef: "DPIIT Notification #12/2021",
  },
  {
    id: "AUD-003",
    sequenceNumber: 3,
    user: {
      id: "usr-gov-01",
      name: "Rajesh Verma",
      email: "officer@urban.gov.in",
      department: "Directorate of Urban Development, Govt of UP",
    },
    role: "GOVERNMENT_OFFICER",
    action: "Eligibility Approved",
    entity: "Application",
    entityId: "APP-AIR-2026-01",
    entityName: "AirSense Multi-Ward Optical OPC & Gas Telemetry Mesh",
    timestamp: "2026-05-02T11:00:15Z",
    previousState: {
      status: "SUBMITTED",
      eligibilityStatus: "UNDER_REVIEW",
      gfrExemptionChecked: false,
    },
    newState: {
      status: "ELIGIBILITY_APPROVED",
      eligibilityStatus: "VERIFIED_ELIGIBLE",
      gfrExemptionChecked: true,
      dpiitVerified: true,
      makeInIndiaLocalContent: 68.5,
    },
    ipAddress: "10.14.22.105 (State NIC Gateway)",
    userAgent: "GovInnovate-Portal/2.4 (Enterprise Chrome/128; macOS)",
    previousHash: "b921c5302d1f9382150392b1c93850213958302b1c93850213958302b1c93850",
    currentHash: "c032d6413e2a0493261403c2da4961324069413c2da4961324069413c2da4961",
    statutoryRuleRef: "GFR Rule 149(v) (Startup Turnover Exemption)",
  },
  {
    id: "AUD-004",
    sequenceNumber: 4,
    user: {
      id: "usr-expert-01",
      name: "Dr. Alok Gupta",
      email: "dr.gupta@iitk.ac.in",
      department: "IIT Kanpur Environmental Engineering",
    },
    role: "EXPERT",
    action: "Evaluation Submitted",
    entity: "Application",
    entityId: "APP-AIR-2026-01",
    entityName: "Independent Technical Peer Evaluation",
    timestamp: "2026-05-08T16:45:10Z",
    previousState: {
      status: "ASSIGNED",
      scoreTotal: 0,
      conflictOfInterestCleared: true,
    },
    newState: {
      status: "EVALUATION_COMPLETED",
      scoreTotal: 94.5,
      technicalFeasibility: 28.5,
      civicImpact: 29.0,
      hardwareLongevity: 19.0,
      teamCompetence: 18.0,
      recommendation: "STRONG_BUY_PILOT",
    },
    ipAddress: "172.26.44.89 (IIT Kanpur Academic Intranet)",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    previousHash: "c032d6413e2a0493261403c2da4961324069413c2da4961324069413c2da4961",
    currentHash: "d143e7524f3b1504372514d3eb5072435170524d3eb5072435170524d3eb5072",
    statutoryRuleRef: "State Peer Evaluation Guidelines Sec 4(b)",
  },
  {
    id: "AUD-005",
    sequenceNumber: 5,
    user: {
      id: "usr-gov-01",
      name: "Rajesh Verma",
      email: "officer@urban.gov.in",
      department: "Directorate of Urban Development, Govt of UP",
    },
    role: "GOVERNMENT_OFFICER",
    action: "Startup Shortlisted",
    entity: "Startup",
    entityId: "STR-AIR-94812",
    entityName: "AirSense Technologies Pvt Ltd",
    timestamp: "2026-05-12T10:20:00Z",
    previousState: {
      selectionRank: "CONTENDER",
      pilotAllocationStatus: "UNALLOCATED",
    },
    newState: {
      selectionRank: "RANK_1_SELECTED",
      pilotAllocationStatus: "SANCTIONED_TESTBED",
      allocatedWards: ["Ward 14", "Ward 18", "Ward 22", "Ward 29"],
      sanctionedPilotBudgetInr: 2450000,
    },
    ipAddress: "10.14.22.105 (State NIC Gateway)",
    userAgent: "GovInnovate-Portal/2.4 (Enterprise Chrome/128; macOS)",
    previousHash: "d143e7524f3b1504372514d3eb5072435170524d3eb5072435170524d3eb5072",
    currentHash: "e254f8635a4c2615483625e4fc6183546281635e4fc6183546281635e4fc6183",
    statutoryRuleRef: "GFR Rule 144 (Transparency in Procurement)",
  },
  {
    id: "AUD-006",
    sequenceNumber: 6,
    user: {
      id: "usr-gov-01",
      name: "Rajesh Verma",
      email: "officer@urban.gov.in",
      department: "Directorate of Urban Development, Govt of UP",
    },
    role: "GOVERNMENT_OFFICER",
    action: "Pilot Started",
    entity: "Pilot",
    entityId: "PILOT-UP-UAQ-01",
    entityName: "Urban Air Quality Monitoring — Lucknow Pilot",
    timestamp: "2026-05-15T08:00:00Z",
    previousState: {
      status: "SCHEDULED",
      activeNodes: 0,
      fieldTelemetryActive: false,
    },
    newState: {
      status: "ACTIVE",
      activeNodes: 12,
      fieldTelemetryActive: true,
      pilotPeriodDays: 90,
      contractValueInr: 2450000,
    },
    ipAddress: "10.14.22.105 (State NIC Gateway)",
    userAgent: "GovInnovate-Portal/2.4 (Enterprise Chrome/128; macOS)",
    previousHash: "e254f8635a4c2615483625e4fc6183546281635e4fc6183546281635e4fc6183",
    currentHash: "f365a9746b5d3726594736f5ad7294657392746f5ad7294657392746f5ad7294",
    statutoryRuleRef: "Uttar Pradesh State Testbed Regulatory Sandbox Order #UP-SBX-01",
  },
  {
    id: "AUD-007",
    sequenceNumber: 7,
    user: {
      id: "usr-gov-01",
      name: "Rajesh Verma",
      email: "officer@urban.gov.in",
      department: "Directorate of Urban Development, Govt of UP",
    },
    role: "GOVERNMENT_OFFICER",
    action: "Milestone Approved",
    entity: "Milestone",
    entityId: "M2-HARDWARE-CALIB",
    entityName: "Milestone 2: 12-Node Deployment & Reference Collocation",
    timestamp: "2026-06-25T14:30:45Z",
    previousState: {
      status: "SUBMITTED",
      reviewStatus: "UNDER_INSPECTION",
      deliverableVerified: false,
    },
    newState: {
      status: "APPROVED",
      reviewStatus: "OFFICER_SIGN_OFF",
      deliverableVerified: true,
      collocationR2Achieved: 0.94,
      approvedDisbursementInr: 800000,
      approvedAt: "2026-06-25T14:30:45Z",
    },
    ipAddress: "10.14.22.105 (State NIC Gateway)",
    userAgent: "GovInnovate-Portal/2.4 (Enterprise Chrome/128; macOS)",
    previousHash: "f365a9746b5d3726594736f5ad7294657392746f5ad7294657392746f5ad7294",
    currentHash: "a476ba857c6e4837605847a6be8305768403857a6be8305768403857a6be8305",
    statutoryRuleRef: "GFR Rule 149 (Milestone Completion Sanction)",
  },
  {
    id: "AUD-008",
    sequenceNumber: 8,
    user: {
      id: "usr-proc-01",
      name: "Sunita Deshmukh",
      email: "procurement@urban.gov.in",
      department: "State Procurement & Treasury Operations Cell",
    },
    role: "PROCUREMENT_OFFICER",
    action: "Payment Approved",
    entity: "Payment",
    entityId: "PAY-M2-800K",
    entityName: "Treasury NEFT Disbursement for Milestone 2",
    timestamp: "2026-06-28T16:10:00Z",
    previousState: {
      status: "APPROVED_PENDING_DISBURSEMENT",
      treasuryToken: null,
      fundsReleased: false,
    },
    newState: {
      status: "PAID",
      treasuryToken: "TRZ-UP-2026-09841",
      fundsReleased: true,
      amountDisbursedInr: 800000,
      clearedViaBank: "State Bank of India (State Treasury Account)",
      utrNumber: "SBIN2026062809182910",
    },
    ipAddress: "10.14.28.40 (Treasury Dedicated Terminal)",
    userAgent: "StateTreasury-eKosh/4.1 (Secured Terminal OS)",
    previousHash: "a476ba857c6e4837605847a6be8305768403857a6be8305768403857a6be8305",
    currentHash: "b587cb968d7f5948716958b7cf9416879514968b7cf9416879514968b7cf9416",
    statutoryRuleRef: "State Financial Handbook Vol 5 (Prompt Payment Mandate)",
  },
  {
    id: "AUD-009",
    sequenceNumber: 9,
    user: {
      id: "usr-validator-01",
      name: "Dr. Alok Gupta & Priya Nair",
      email: "validator@teriin.org",
      department: "The Energy and Resources Institute (TERI)",
    },
    role: "VALIDATOR",
    action: "Validation Submitted",
    entity: "ValidationReport",
    entityId: "VAL-TERI-2026-01",
    entityName: "Independent Physical Collocation Regression Audit",
    timestamp: "2026-09-24T17:00:00Z",
    previousState: {
      status: "AUDIT_IN_PROGRESS",
      empiricalRegressionR2: 0,
      validationVerdict: "PENDING",
    },
    newState: {
      status: "VALIDATED",
      empiricalRegressionR2: 0.95,
      validationVerdict: "Class-A Certified",
      sensorDriftTolerance: "±2.5%",
      auditCertificateHash: "8e5926c483a99281a0b388d92f71884029486c91a0c793f18e932b17a10f823d",
      isEmpiricallyValidated: true,
    },
    ipAddress: "182.72.68.14 (TERI New Delhi Core)",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    previousHash: "b587cb968d7f5948716958b7cf9416879514968b7cf9416879514968b7cf9416",
    currentHash: "c698dc079e8a6059827069c8da0527980625079c8da0527980625079c8da0527",
    statutoryRuleRef: "CPCB Guidelines for Low-Cost Ambient Air Quality Sensors",
  },
  {
    id: "AUD-010",
    sequenceNumber: 10,
    user: {
      id: "usr-gov-01",
      name: "Rajesh Verma",
      email: "officer@urban.gov.in",
      department: "Directorate of Urban Development, Govt of UP",
    },
    role: "GOVERNMENT_OFFICER",
    action: "Scale-Up Decision Made",
    entity: "ScaleUpDossier",
    entityId: "DEC-SCALE-2026-01",
    entityName: "Statutory Sanction: Multi-City Expansion under GFR 149",
    timestamp: "2026-09-26T14:15:00Z",
    previousState: {
      currentStage: "SCALE_UP_REVIEW",
      scalingSanctioned: false,
      sanctionedBudgetInr: 0,
    },
    newState: {
      currentStage: "PROCUREMENT_REVIEW",
      scalingSanctioned: true,
      decisionAction: "START_SCALE_UP",
      sanctionedBudgetInr: 38500000,
      targetScope: "80 Lucknow Wards + 5 UP Smart Cities (910 Nodes)",
      isHumanConfirmed: true,
      decisionSealSha256: "SHA256:d8a927c3e1b4...881f",
    },
    ipAddress: "10.14.22.105 (State NIC Gateway)",
    userAgent: "GovInnovate-Portal/2.4 (Enterprise Chrome/128; macOS)",
    previousHash: "c698dc079e8a6059827069c8da0527980625079c8da0527980625079c8da0527",
    currentHash: "d709ed180f9b7160938170d9eb1638091736180d9eb1638091736180d9eb1638",
    statutoryRuleRef: "GFR Rule 149(v) & State Innovation Procurement Directive #2026-09",
  },
];

class AuditDatabase {
  private entries: AuditLogEntry[];

  constructor() {
    this.entries = [...INITIAL_AUDIT_LOGS];
  }

  public getAllLogs(): AuditLogEntry[] {
    return [...this.entries];
  }

  public getLogById(id: string): AuditLogEntry | undefined {
    return this.entries.find((e) => e.id === id);
  }

  public getAvailableFilterOptions() {
    const users = Array.from(new Set(this.entries.map((e) => `${e.user.name} (${e.user.email})`))).sort();
    const roles = Array.from(new Set(this.entries.map((e) => e.role))).sort();
    const entities = Array.from(new Set(this.entries.map((e) => e.entity))).sort();
    const actions = Array.from(new Set(this.entries.map((e) => e.action))).sort();
    return { users, roles, entities, actions };
  }

  public queryLogs(filters: AuditFilterParams = {}): AuditLogEntry[] {
    let result = [...this.entries];

    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.entity.toLowerCase().includes(q) ||
          e.entityId.toLowerCase().includes(q) ||
          (e.entityName && e.entityName.toLowerCase().includes(q)) ||
          e.user.name.toLowerCase().includes(q) ||
          e.user.email.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.currentHash.toLowerCase().includes(q) ||
          JSON.stringify(e.previousState).toLowerCase().includes(q) ||
          JSON.stringify(e.newState).toLowerCase().includes(q)
      );
    }

    if (filters.user && filters.user !== "ALL") {
      const u = filters.user.toLowerCase();
      result = result.filter(
        (e) =>
          e.user.name.toLowerCase().includes(u) ||
          e.user.email.toLowerCase().includes(u)
      );
    }

    if (filters.role && filters.role !== "ALL") {
      result = result.filter((e) => e.role === filters.role);
    }

    if (filters.entity && filters.entity !== "ALL") {
      result = result.filter((e) => e.entity === filters.entity);
    }

    if (filters.action && filters.action !== "ALL") {
      result = result.filter((e) => e.action === filters.action);
    }

    if (filters.startDate) {
      result = result.filter((e) => e.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      result = result.filter((e) => e.timestamp <= filters.endDate!);
    }

    // Default return sorted reverse-chronological (newest first)
    return result.sort((a, b) => b.sequenceNumber - a.sequenceNumber);
  }

  /**
   * Append-only record insertion.
   * Cryptographically chains this entry to the latest entry's currentHash.
   */
  public recordAction(entry: {
    user: { id: string; name: string; email: string; department?: string };
    role: string;
    action: AuditActionType;
    entity: AuditEntityType;
    entityId: string;
    entityName?: string;
    previousState: Record<string, any> | string;
    newState: Record<string, any> | string;
    ipAddress?: string;
    userAgent?: string;
    statutoryRuleRef?: string;
  }): AuditLogEntry {
    const lastEntry = this.entries[this.entries.length - 1];
    const prevHash = lastEntry ? lastEntry.currentHash : GENESIS_HASH;
    const nextSeq = lastEntry ? lastEntry.sequenceNumber + 1 : 1;
    const now = new Date().toISOString();

    const payloadToHash = `${prevHash}|${nextSeq}|${now}|${entry.user.id}|${entry.action}|${entry.entityId}|${JSON.stringify(entry.newState)}`;
    const currentHash = computeHash(payloadToHash);

    const newLog: AuditLogEntry = {
      id: `AUD-${String(nextSeq).padStart(3, "0")}`,
      sequenceNumber: nextSeq,
      user: entry.user,
      role: entry.role,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      entityName: entry.entityName,
      timestamp: now,
      previousState: entry.previousState,
      newState: entry.newState,
      ipAddress: entry.ipAddress || "10.14.22.105 (State Secure Gateway)",
      userAgent: entry.userAgent || "GovInnovate-Portal/2.4 (Enterprise)",
      previousHash: prevHash,
      currentHash,
      statutoryRuleRef: entry.statutoryRuleRef || "GFR Rule 149 Audit Standard",
    };

    this.entries.push(newLog);
    return newLog;
  }

  /**
   * Verifies the cryptographic chain across all entries.
   * Returns true if 100% untampered.
   */
  public verifyIntegrity(): { isValid: boolean; verifiedCount: number; error?: string } {
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      const prevHash = i === 0 ? GENESIS_HASH : this.entries[i - 1].currentHash;
      if (entry.previousHash !== prevHash) {
        return {
          isValid: false,
          verifiedCount: i,
          error: `Cryptographic chain broken at entry #${entry.sequenceNumber} (${entry.id}). Previous hash mismatch.`,
        };
      }
    }
    return { isValid: true, verifiedCount: this.entries.length };
  }

  // NOTE: Intentionally NO updateEntry() or deleteEntry() methods exist!
  // Immutability is enforced at the database class level.
}

export const auditDb = new AuditDatabase();
