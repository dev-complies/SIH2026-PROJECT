// In-memory persistent database for Risk and Issue Management
// Fulfills statutory civic-tech governance across 8 risk categories and 5 issue statuses

export type RiskCategory =
  | "Technical"
  | "Financial"
  | "Operational"
  | "Legal"
  | "Cybersecurity"
  | "Data"
  | "Procurement"
  | "Timeline";

export type RiskStatus =
  | "Identified"
  | "Mitigating"
  | "Accepted"
  | "Closed"
  | "Escalated";

export interface RiskRecord {
  id: string;
  category: RiskCategory;
  title: string;
  description: string;
  probability: number; // 1 to 5 (1: Very Low, 2: Low, 3: Medium, 4: High, 5: Very High)
  impact: number;      // 1 to 5 (1: Negligible, 2: Minor, 3: Moderate, 4: Major, 5: Catastrophic)
  riskScore: number;   // probability * impact (1 to 25)
  owner: string;
  mitigation: string;
  status: RiskStatus;
  dueDate: string;     // ISO date
  pilotId: string;
  createdAt: string;
  updatedAt: string;
}

export type IssueSeverity = "Low" | "Medium" | "High" | "Critical";

export type IssueStatus =
  | "Open"
  | "In Progress"
  | "Blocked"
  | "Resolved"
  | "Closed";

export interface IssueRecord {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  owner: string;
  deadline: string;    // ISO date
  status: IssueStatus;
  resolution: string;
  relatedRiskId?: string;
  pilotId: string;
  createdAt: string;
  updatedAt: string;
}

// Initial Database Seed for Lucknow Air Quality Pilot (PILOT-UP-UAQ-01)
let RISKS_DATABASE: RiskRecord[] = [
  // 1. Technical
  {
    id: "RSK-01",
    category: "Technical",
    title: "Optical Sensor Ingress & Particulate Soot Fouling",
    description: "High particulate matter concentrations (>300 µg/m³) during peak winter smog may foul laser optical chambers, reducing sensor precision.",
    probability: 3,
    impact: 4,
    riskScore: 12,
    owner: "Dr. Rohan Varma (CTO, AirSense)",
    mitigation: "Automated positive-pressure cyclonic purge cycles run every 2 hours. Micro-fluidic optical lenses pre-treated with hydrophobic fluoropolymer coating.",
    status: "Mitigating",
    dueDate: "2026-08-15",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-07-20T11:00:00Z",
  },
  // 2. Financial
  {
    id: "RSK-02",
    category: "Financial",
    title: "Escrow Disbursement Delay Due to Deliverable Validation Queue",
    description: "Multi-departmental sign-offs between Municipal Corporation and Treasury may delay Milestone 3 fund release, stressing startup working capital.",
    probability: 2,
    impact: 4,
    riskScore: 8,
    owner: "V. K. Saxena (Procurement Accounts Officer)",
    mitigation: "Automated milestone escrow release triggered upon certified cryptographic hash verification by TERI independent validator.",
    status: "Mitigating",
    dueDate: "2026-08-30",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-07-22T14:30:00Z",
  },
  // 3. Operational
  {
    id: "RSK-03",
    category: "Operational",
    title: "Streetlight Pole Power Feed Intermittent Blackouts",
    description: "Unscheduled feeder line maintenance in Old City Lucknow wards can sever AC mains power to mounted sensor enclosures.",
    probability: 4,
    impact: 3,
    riskScore: 12,
    owner: "Suresh Chandra (Chief Electrician, LMC)",
    mitigation: "All 40 units fitted with integrated monocrystalline solar auxiliary panels and 48-hour LiFePO4 battery reserve buffers.",
    status: "Mitigating",
    dueDate: "2026-07-31",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-05-15T08:00:00Z",
    updatedAt: "2026-07-18T16:00:00Z",
  },
  // 4. Legal
  {
    id: "RSK-04",
    category: "Legal",
    title: "Municipal Street Infrastructure Right-of-Way Liability",
    description: "Third-party structural damage or traffic accident claims involving pole-mounted equipment on high-speed corridors.",
    probability: 1,
    impact: 4,
    riskScore: 4,
    owner: "Adv. Meera Sen (Legal Advisor, Urban Dev Dept)",
    mitigation: "Comprehensive comprehensive commercial liability insurance policy executed under Government Pilot Master Service Agreement.",
    status: "Accepted",
    dueDate: "2026-09-15",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-05-20T11:00:00Z",
    updatedAt: "2026-06-05T09:30:00Z",
  },
  // 5. Cybersecurity
  {
    id: "RSK-05",
    category: "Cybersecurity",
    title: "LoRaWAN Gateway Man-in-the-Middle Telemetry Spoofing",
    description: "Adversarial packet injection or relay attacks on unencrypted wireless channels attempting to forge air quality indices.",
    probability: 2,
    impact: 5,
    riskScore: 10,
    owner: "Ananya Dixit (Lead IoT Security Engineer)",
    mitigation: "Hardware secure element (ATECC608A) cryptographically signs every MQTT sensor packet with AES-128-GCM before LoRa transmission.",
    status: "Mitigating",
    dueDate: "2026-08-10",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-05-22T13:00:00Z",
    updatedAt: "2026-07-24T12:00:00Z",
  },
  // 6. Data
  {
    id: "RSK-06",
    category: "Data",
    title: "Relative Humidity Laser Scattering Drift",
    description: "Monsoon relative humidity exceeding 85% causes hygroscopic aerosol growth, artificially elevating optical PM2.5 readings.",
    probability: 4,
    impact: 4,
    riskScore: 16,
    owner: "Dr. Alok Gupta (IIT Kanpur Academic Advisor)",
    mitigation: "Polytropic heated inlet tube activates dynamically above 75% RH combined with calibrated Köhler machine learning correction model.",
    status: "Mitigating",
    dueDate: "2026-08-05",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-05-25T14:00:00Z",
    updatedAt: "2026-07-25T10:00:00Z",
  },
  // 7. Procurement
  {
    id: "RSK-07",
    category: "Procurement",
    title: "Specialized Semiconductor Component Import Bottlenecks",
    description: "Lead times on laser diode sensors and cellular e-SIM modules from overseas manufacturers exceed 6 weeks.",
    probability: 3,
    impact: 3,
    riskScore: 9,
    owner: "Rohan Varma (Founder, AirSense)",
    mitigation: "Dual-sourcing agreement signed with domestic electronic component fabricator in Greater Noida with 20 spare units prepositioned.",
    status: "Closed",
    dueDate: "2026-06-30",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-05-18T10:00:00Z",
    updatedAt: "2026-06-28T15:00:00Z",
  },
  // 8. Timeline
  {
    id: "RSK-08",
    category: "Timeline",
    title: "Monsoon Inundation Delaying Misting Truck Integration (Milestone 4)",
    description: "Heavy localized waterlogging in Charbagh zone may restrict municipal misting truck automated routing trials.",
    probability: 3,
    impact: 3,
    riskScore: 9,
    owner: "Rajesh Verma (Pilot Coordinator, Urban Dev)",
    mitigation: "Geofenced misting routes calibrated to secondary elevated arterial corridors (Hazratganj & Gomti Nagar) with flexible 10-day buffer.",
    status: "Identified",
    dueDate: "2026-08-20",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-07-20T09:00:00Z",
  },
];

let ISSUES_DATABASE: IssueRecord[] = [
  {
    id: "ISS-01",
    title: "Node AS-LKO-018 Intermittent LoRa Gateway Dropout",
    description: "Sensor node mounted at Charbagh multi-modal rotary experienced 14% packet drops during evening rush hour due to concrete flyover multipath interference.",
    severity: "High",
    owner: "Ananya Dixit (AirSense Network Team)",
    deadline: "2026-07-28",
    status: "In Progress",
    resolution: "Field crew scheduled to elevate omnidirectional antenna by 2.5 meters on existing cantilever streetlight arm to establish direct line-of-sight.",
    relatedRiskId: "RSK-05",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-07-23T11:20:00Z",
    updatedAt: "2026-07-25T14:00:00Z",
  },
  {
    id: "ISS-02",
    title: "Lalbagh Reference Station Network Port Mismatch",
    description: "CPCB BAM-1020 reference analyzer serial port baud rate configuration was out of sync with edge datalogger protocol.",
    severity: "Medium",
    owner: "Priya Nair (Lead Validator, TERI)",
    deadline: "2026-07-15",
    status: "Resolved",
    resolution: "RS-485 to Ethernet converter baud rate re-flashed to 9600-8-N-1 with parity verification. Dual-stream sync confirmed at 100% fidelity.",
    relatedRiskId: "RSK-06",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-07-10T08:30:00Z",
    updatedAt: "2026-07-12T16:00:00Z",
  },
  {
    id: "ISS-03",
    title: "Municipal Misting Truck Fleet API Authentication Token Expiry",
    description: "Automated webhook dispatch failed for 2 simulated pollution spikes due to expired OAuth2 bearer token on transport department gateway.",
    severity: "Critical",
    owner: "Municipal Transport IT Division",
    deadline: "2026-07-26",
    status: "Closed",
    resolution: "Implemented automated HMAC-SHA256 refreshed service credentials with 30-day rotation and dead-letter queue retry mechanism.",
    relatedRiskId: "RSK-08",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-07-21T14:00:00Z",
    updatedAt: "2026-07-24T18:00:00Z",
  },
  {
    id: "ISS-04",
    title: "Solar Backup Battery Voltage Dip at Ward 29 Node",
    description: "Monsoon dense cloud cover for 72 consecutive hours caused battery voltage to drop below 11.2V threshold, tripping low-power telemetry mode.",
    severity: "Low",
    owner: "Suresh Chandra (LMC Electrical Crew)",
    deadline: "2026-08-02",
    status: "Open",
    resolution: "Battery pack diagnostic scheduled. Power management firmware threshold to be adjusted to dynamic 15-minute sleep interval during sustained overcast.",
    relatedRiskId: "RSK-03",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-07-25T09:00:00Z",
    updatedAt: "2026-07-25T09:00:00Z",
  },
  {
    id: "ISS-05",
    title: "Hazratganj Street Pole Clearance Withholding by Sub-contractor",
    description: "Third-party municipal advertising vendor delayed unmounting older billboard brackets, preventing sensor mounting on poles HG-108 and HG-109.",
    severity: "Medium",
    owner: "Rajesh Verma (Pilot Coordinator)",
    deadline: "2026-07-20",
    status: "Blocked",
    resolution: "Municipal Corporation issued statutory clearance mandate notice to advertising agency. Site inspection slated for tomorrow morning.",
    relatedRiskId: "RSK-04",
    pilotId: "PILOT-UP-UAQ-01",
    createdAt: "2026-07-18T10:15:00Z",
    updatedAt: "2026-07-23T11:00:00Z",
  },
];

// Query Risks with filters & sorting
export function queryRisks(filters: {
  category?: RiskCategory | "ALL";
  status?: RiskStatus | "ALL";
  minScore?: number;
  maxScore?: number;
  owner?: string;
  search?: string;
  sortBy?: "riskScore" | "dueDate" | "probability" | "impact" | "title";
  sortOrder?: "asc" | "desc";
  pilotId?: string;
}): RiskRecord[] {
  let list = [...RISKS_DATABASE];

  if (filters.pilotId) {
    list = list.filter((r) => r.pilotId === filters.pilotId);
  }

  if (filters.category && filters.category !== "ALL") {
    list = list.filter((r) => r.category === filters.category);
  }

  if (filters.status && filters.status !== "ALL") {
    list = list.filter((r) => r.status === filters.status);
  }

  if (filters.minScore !== undefined) {
    list = list.filter((r) => r.riskScore >= filters.minScore!);
  }

  if (filters.maxScore !== undefined) {
    list = list.filter((r) => r.riskScore <= filters.maxScore!);
  }

  if (filters.owner) {
    list = list.filter((r) => r.owner.toLowerCase().includes(filters.owner!.toLowerCase()));
  }

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.mitigation.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }

  // Sorting
  const sortBy = filters.sortBy || "riskScore";
  const order = filters.sortOrder === "asc" ? 1 : -1;

  list.sort((a, b) => {
    if (sortBy === "riskScore") return (a.riskScore - b.riskScore) * order;
    if (sortBy === "probability") return (a.probability - b.probability) * order;
    if (sortBy === "impact") return (a.impact - b.impact) * order;
    if (sortBy === "dueDate") return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * order;
    if (sortBy === "title") return a.title.localeCompare(b.title) * order;
    return 0;
  });

  return list;
}

// Query Issues with filters & sorting
export function queryIssues(filters: {
  status?: IssueStatus | "ALL";
  severity?: IssueSeverity | "ALL";
  owner?: string;
  search?: string;
  sortBy?: "deadline" | "severity" | "status" | "title" | "createdAt";
  sortOrder?: "asc" | "desc";
  pilotId?: string;
}): IssueRecord[] {
  let list = [...ISSUES_DATABASE];

  if (filters.pilotId) {
    list = list.filter((i) => i.pilotId === filters.pilotId);
  }

  if (filters.status && filters.status !== "ALL") {
    list = list.filter((i) => i.status === filters.status);
  }

  if (filters.severity && filters.severity !== "ALL") {
    list = list.filter((i) => i.severity === filters.severity);
  }

  if (filters.owner) {
    list = list.filter((i) => i.owner.toLowerCase().includes(filters.owner!.toLowerCase()));
  }

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.resolution.toLowerCase().includes(q) ||
        i.owner.toLowerCase().includes(q)
    );
  }

  // Severity rank helper
  const severityRank: Record<IssueSeverity, number> = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortBy = filters.sortBy || "deadline";
  const order = filters.sortOrder === "asc" ? 1 : -1;

  list.sort((a, b) => {
    if (sortBy === "severity") {
      return (severityRank[a.severity] - severityRank[b.severity]) * order;
    }
    if (sortBy === "deadline") {
      return (new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) * order;
    }
    if (sortBy === "createdAt") {
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status) * order;
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title) * order;
    }
    return 0;
  });

  return list;
}

// Insert Risk
export function insertRisk(data: Omit<RiskRecord, "id" | "riskScore" | "createdAt" | "updatedAt">): RiskRecord {
  const prob = Math.max(1, Math.min(5, Math.round(data.probability)));
  const imp = Math.max(1, Math.min(5, Math.round(data.impact)));
  const now = new Date().toISOString();

  const newRisk: RiskRecord = {
    ...data,
    id: `RSK-${String(RISKS_DATABASE.length + 1).padStart(2, "0")}`,
    probability: prob,
    impact: imp,
    riskScore: prob * imp,
    createdAt: now,
    updatedAt: now,
  };

  RISKS_DATABASE.unshift(newRisk);
  return newRisk;
}

// Insert Issue
export function insertIssue(data: Omit<IssueRecord, "id" | "createdAt" | "updatedAt">): IssueRecord {
  const now = new Date().toISOString();

  const newIssue: IssueRecord = {
    ...data,
    id: `ISS-${String(ISSUES_DATABASE.length + 1).padStart(2, "0")}`,
    createdAt: now,
    updatedAt: now,
  };

  ISSUES_DATABASE.unshift(newIssue);
  return newIssue;
}

// Update Risk
export function updateRisk(
  id: string,
  updates: Partial<Omit<RiskRecord, "id" | "createdAt">>
): { success: boolean; risk?: RiskRecord; error?: string } {
  const risk = RISKS_DATABASE.find((r) => r.id === id);
  if (!risk) return { success: false, error: "Risk record not found" };

  if (updates.probability !== undefined) risk.probability = updates.probability;
  if (updates.impact !== undefined) risk.impact = updates.impact;
  risk.riskScore = risk.probability * risk.impact;

  if (updates.title) risk.title = updates.title;
  if (updates.description) risk.description = updates.description;
  if (updates.category) risk.category = updates.category;
  if (updates.owner) risk.owner = updates.owner;
  if (updates.mitigation) risk.mitigation = updates.mitigation;
  if (updates.status) risk.status = updates.status;
  if (updates.dueDate) risk.dueDate = updates.dueDate;
  risk.updatedAt = new Date().toISOString();

  return { success: true, risk };
}

// Update Issue
export function updateIssue(
  id: string,
  updates: Partial<Omit<IssueRecord, "id" | "createdAt">>
): { success: boolean; issue?: IssueRecord; error?: string } {
  const issue = ISSUES_DATABASE.find((i) => i.id === id);
  if (!issue) return { success: false, error: "Issue record not found" };

  if (updates.title) issue.title = updates.title;
  if (updates.description) issue.description = updates.description;
  if (updates.severity) issue.severity = updates.severity;
  if (updates.owner) issue.owner = updates.owner;
  if (updates.deadline) issue.deadline = updates.deadline;
  if (updates.status) issue.status = updates.status;
  if (updates.resolution !== undefined) issue.resolution = updates.resolution;
  issue.updatedAt = new Date().toISOString();

  return { success: true, issue };
}
