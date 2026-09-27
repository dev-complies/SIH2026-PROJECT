/**
 * GovInnovate Platform Master Coherent Demo Dataset
 * 
 * NOTICE:
 * This is a SYNTHETIC SIMULATION DATASET created exclusively for demonstrating
 * the GovInnovate GovTech platform architecture and statutory workflows.
 * 
 * ALL NAMES, CODES, TELEMETRY, FINANCIAL VALUES, AND DECISIONS ARE FICTIONAL DEMO ARTIFACTS.
 * NOT REAL GOVERNMENT OR STATUTORY RECORDS.
 */

import {
  Department,
  Organization,
  User,
  Challenge,
  Application,
  EligibilityReview,
  EvaluationAssignment,
  EvaluationScore,
  Pilot,
  PilotMilestone,
  KPI,
  KPIMeasurement,
  EvidenceRecord,
  Risk,
  Issue,
  Payment,
  ValidationReport,
  ScaleUpDecision,
  ProvenSolution,
  AuditLog,
} from "@/types";

// ============================================================================
// DEMO METADATA & DISCLAIMER
// ============================================================================
export const DEMO_DATASET_META = {
  isDemo: true,
  datasetVersion: "2026.1-DEMO",
  disclaimer:
    "SYNTHETIC DEMO DATASET — Created for GovInnovate Platform Simulation. Not real government records.",
  generatedAt: "2026-05-01T00:00:00.000Z",
  statutoryFramework: "GFR 2017 Rule 149 & CVC Innovation Procurement Directives (Simulation)",
};

// ============================================================================
// 1. DEPARTMENT (Formulating Public Authority)
// ============================================================================
export const DEMO_DEPARTMENT: Department = {
  id: "dept-urban-001",
  code: "UP-DUD-LKO",
  name: "Department of Urban Development (Demo)",
  ministry: "Ministry of Housing & Urban Affairs (Simulation)",
  state: "Uttar Pradesh",
  district: "Lucknow",
  contactEmail: "demo-officer@urban.gov.example",
  createdAt: "2026-01-10T00:00:00.000Z",
  updatedAt: "2026-01-10T00:00:00.000Z",
};

// ============================================================================
// 2. USERS (Constitutional Stakeholder Personas)
// ============================================================================
export const DEMO_USERS: User[] = [
  {
    id: "user-gov-001",
    email: "rajesh.verma@urban.gov.example",
    firstName: "Rajesh",
    lastName: "Verma (Demo)",
    role: "GOVERNMENT_OFFICER",
    departmentId: "dept-urban-001",
    designation: "Joint Director, Urban Smart Infrastructure (Demo)",
    isActive: true,
    createdAt: "2026-01-11T00:00:00.000Z",
    updatedAt: "2026-01-11T00:00:00.000Z",
  },
  {
    id: "user-proc-001",
    email: "sunita.deshmukh@urban.gov.example",
    firstName: "Sunita",
    lastName: "Deshmukh (Demo)",
    role: "PROCUREMENT_OFFICER",
    departmentId: "dept-urban-001",
    designation: "Chief Procurement & Contracts Officer (Demo)",
    isActive: true,
    createdAt: "2026-01-11T00:00:00.000Z",
    updatedAt: "2026-01-11T00:00:00.000Z",
  },
  {
    id: "user-startup-001",
    email: "aarav@airsense.tech.example",
    firstName: "Aarav",
    lastName: "Sharma (Demo)",
    role: "STARTUP",
    organizationId: "org-airsense-001",
    designation: "Chief Executive Officer & Founder (Demo)",
    isActive: true,
    createdAt: "2026-01-16T00:00:00.000Z",
    updatedAt: "2026-01-16T00:00:00.000Z",
  },
  {
    id: "user-expert-001",
    email: "dr.gupta@iitk.ac.example",
    firstName: "Dr. Alok",
    lastName: "Gupta (Demo)",
    role: "EXPERT_EVALUATOR",
    designation: "Professor of Atmospheric Sciences, IIT Kanpur (Demo)",
    isActive: true,
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "user-expert-002",
    email: "dr.rao@neeri.res.example",
    firstName: "Dr. Sunita",
    lastName: "Rao (Demo)",
    role: "EXPERT_EVALUATOR",
    designation: "Chief Scientist, CSIR-NEERI Environmental Modeling (Demo)",
    isActive: true,
    createdAt: "2026-01-22T00:00:00.000Z",
    updatedAt: "2026-01-22T00:00:00.000Z",
  },
  {
    id: "user-expert-003",
    email: "prof.sen@iisc.ac.example",
    firstName: "Prof. Vikram",
    lastName: "Sen (Demo)",
    role: "EXPERT_EVALUATOR",
    designation: "Senior Fellow, Center for Sustainable Technologies, IISc (Demo)",
    isActive: true,
    createdAt: "2026-01-24T00:00:00.000Z",
    updatedAt: "2026-01-24T00:00:00.000Z",
  },
  {
    id: "user-validator-001",
    email: "priya.nair@teri.res.example",
    firstName: "Priya",
    lastName: "Nair (Demo)",
    role: "INDEPENDENT_VALIDATOR",
    designation: "Lead Auditor, Environmental Systems Testing Laboratory (Demo)",
    isActive: true,
    createdAt: "2026-01-25T00:00:00.000Z",
    updatedAt: "2026-01-25T00:00:00.000Z",
  },
];

// ============================================================================
// 3. STARTUP (DPIIT DeepTech Innovator)
// ============================================================================
export const DEMO_STARTUP: Organization = {
  id: "org-airsense-001",
  legalName: "AirSense Technologies Pvt Ltd (Demo)",
  tradeName: "AirSense",
  registrationNumber: "U72900UP2022PTC158921-DEMO",
  incorporationDate: "2022-04-15",
  dpiitRecognitionNumber: "DIPP98214",
  websiteUrl: "https://airsense.example.com",
  industry: "IoT CleanTech & Environmental Monitoring",
  technologyStack: [
    "Optical Particle Counters (OPC)",
    "Laser Scattering",
    "Edge Machine Learning",
    "LoRaWAN & NB-IoT",
    "Municipal GIS Integration",
  ],
  teamSize: 18,
  profileCompleteness: 100,
  createdAt: "2026-01-15T00:00:00.000Z",
  updatedAt: "2026-01-15T00:00:00.000Z",
};

// ============================================================================
// 4. PRIMARY DEMO CHALLENGE: "Urban Air Quality Monitoring"
// ============================================================================
export const DEMO_CHALLENGE: Challenge = {
  id: "chal-air-001",
  departmentId: "dept-urban-001",
  createdBy: "user-gov-001",
  title: "Urban Air Quality Monitoring (Hyperlocal Sensing Mesh)",
  code: "CHAL-UP-DUD-2026-001",
  problemStatement:
    "Municipal wards in central Lucknow suffer from localized winter PM2.5 and PM10 spikes. Existing CPCB reference stations are sparse (3 across the city), providing regional averages that fail to detect street-level industrial plumes, vehicular idling, and construction micro-dust hot-spots.",
  desiredOutcome:
    "Deploy a dense, calibrated IoT air sensor grid providing real-time 15-minute GIS air quality index telemetry, with minimum 90% device uptime, 95% correlation with reference instruments, and automated alert dispatch for municipal dust-suppression trucks.",
  technicalRequirements:
    "Laser scattering particle counters (PM1, PM2.5, PM10); IP65 weatherproof enclosure with automated anti-fouling purge; solar/battery dual power backup; cellular NB-IoT telemetry; REST API integration with Municipal Integrated Command & Control Center (ICCC).",
  pilotDesign:
    "Deploy 40 sensor nodes across 4 identified municipal wards in Lucknow for a 90-day winter evaluation cycle with independent collocation audit.",
  industryCategory: "CleanTech & Environmental IoT",
  targetState: "Uttar Pradesh",
  targetDistrict: "Lucknow",
  totalBudget: 2500000, // ₹25,00,000 INR
  pilotDurationDays: 90,
  applicationDeadline: "2026-03-31T18:00:00.000Z",
  evaluationDeadline: "2026-04-15T18:00:00.000Z",
  pilotStartExpected: "2026-05-01",
  blindEvaluation: true,
  status: "PILOT_ACTIVE",
  evaluationRubric: [
    { id: "tech", name: "Technical Feasibility & Sensor Accuracy", weight: 25 },
    { id: "fit", name: "Problem Fit & Ward Spatial Resolution", weight: 20 },
    { id: "innov", name: "Edge Calibration & Anti-Fouling Innovation", weight: 15 },
    { id: "scale", name: "Scalability to Full 80 Municipal Wards", weight: 15 },
    { id: "cost", name: "Cost Effectiveness & Lifecycle TCO", weight: 15 },
    { id: "security", name: "Data Localization & TLS 1.3 Security", weight: 10 },
  ],
  eligibilityCriteria: [
    "DPIIT-recognized Indian Startup or MSME",
    "Minimum 1-year operational track record with previous field deployment",
    "Positive net worth with verifiable operating runway",
    "IP65 and RoHS environmental compliance certifications",
    "Strict sovereign data localization within Republic of India",
  ],
  complianceChecklist: [
    "Statutory non-conflict of interest declaration under CVC regulations",
    "Agreement to Municipal Open Data sharing protocol",
    "Independent NABL laboratory calibration audit covenant",
  ],
  aiEnhanced: true,
  aiDisclaimer: "AI-generated formulation suggestions — verified by Rajesh Verma, Joint Director.",
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-15T00:00:00.000Z",
};

// ============================================================================
// 5. APPLICATION (AirSense Technologies Proposal)
// ============================================================================
export const DEMO_APPLICATION: Application = {
  id: "app-airsense-001",
  challengeId: "chal-air-001",
  organizationId: "org-airsense-001",
  submittedBy: "user-startup-001",
  applicationNumber: "APP-2026-UAQ-001",
  solutionTitle: "AirSense Hyperlocal AI Sensor Mesh & Automated Anomaly Detection",
  executiveSummary:
    "AirSense proposes deploying 40 low-maintenance solar-powered optical particle counters with on-device machine learning calibration curves collocated against reference CPCB BAM-1020 stations.",
  technicalApproach:
    "Dual laser scattering particulate sensors combined with electrochemical NO2/SO2 modules, transmitting via cellular NB-IoT with edge data smoothing and automated optical purge.",
  implementationPlan:
    "Phase 1: Ward site survey & baseline calibration (15 days); Phase 2: Full 40-node mesh deployment and GIS streaming (30 days); Phase 3: 90-day continuous verification and municipal dispatch linkage (45 days).",
  proposedCost: 2200000, // ₹22,00,000 INR
  pilotDurationWeeks: 12, // 90 days / ~12.8 weeks
  teamOverview: [
    { name: "Aarav Sharma", role: "Hardware Systems Lead", experienceYears: 8 },
    { name: "Meera Sen", role: "Atmospheric Data Scientist", experienceYears: 6 },
    { name: "Rohan Varma", role: "Embedded Firmware Engineer", experienceYears: 5 },
  ],
  pastExperience: [
    { client: "Noida Authority / Waste SPV", project: "Industrial Boundary AQI Grid (20 Nodes)", year: 2024 },
    { client: "Kanpur Smart City Cell", project: "Corridor Particulate Telemetry Pilot", year: 2025 },
  ],
  riskMitigationPlan:
    "Dual redundant optical channels prevent single-point fouling; 48-hour solar battery buffer prevents grid-cut outages; local EEPROM stores 14 days of telemetry during telecom network disruption.",
  complianceAcknowledged: true,
  status: "PILOT_AWARDED",
  submittedAt: "2026-02-18T14:30:00.000Z",
  createdAt: "2026-02-15T10:00:00.000Z",
  updatedAt: "2026-02-28T16:00:00.000Z",
};

// ============================================================================
// 6. ELIGIBILITY REVIEW (Government Officer Compliance Sign-off)
// ============================================================================
export const DEMO_ELIGIBILITY_REVIEW: EligibilityReview = {
  id: "elig-airsense-001",
  applicationId: "app-airsense-001",
  reviewedBy: "user-gov-001",
  decision: "ELIGIBLE",
  reason:
    "AirSense Technologies Pvt Ltd fully satisfies all 5 statutory criteria under GFR Rule 149 innovation screening: verified active DPIIT certificate DIPP98214, 2 previous municipal deployments, audited positive net worth, IP65/RoHS certificates verified, and sovereign Indian cloud hosting confirmed.",
  conditionsPrecedent:
    "Mandatory collocated reference calibration audit against CPCB BAM-1020 must be completed before Milestone 2 fund release.",
  checklistResults: {
    dpiitRecognition: true,
    priorDeploymentExperience: true,
    positiveNetWorth: true,
    environmentalCertifications: true,
    sovereignDataHosting: true,
    noBoardConflictOfInterest: true,
  },
  reviewedAt: "2026-02-22T11:30:00.000Z",
  createdAt: "2026-02-22T11:30:00.000Z",
};

// ============================================================================
// 7. 3 EXPERT EVALUATIONS (Blind Independent Technical Scoring)
// ============================================================================
export interface DemoExpertEvaluationDetail {
  assignment: EvaluationAssignment;
  scores: EvaluationScore[];
}

export const DEMO_EXPERT_EVALUATIONS: DemoExpertEvaluationDetail[] = [
  // Expert 1: Dr. Alok Gupta (IIT Kanpur)
  {
    assignment: {
      id: "eval-asgn-001",
      challengeId: "chal-air-001",
      applicationId: "app-airsense-001",
      expertId: "user-expert-001",
      hasConflictOfInterest: false,
      coiDeclaredAt: "2026-02-25T09:00:00.000Z",
      coiNotes: "Certified zero financial or advisory affiliation with AirSense Technologies.",
      isCompleted: true,
      totalWeightedScore: 92.5,
      technicalComments:
        "The proposed dual-beam laser scattering methodology is scientifically robust. Incorporating collocated polynomial regression curves with ambient humidity compensation resolves typical low-cost sensor drift. Highly recommended.",
      submittedAt: "2026-03-05T15:20:00.000Z",
      createdAt: "2026-02-24T10:00:00.000Z",
      updatedAt: "2026-03-05T15:20:00.000Z",
    },
    scores: [
      { id: "sc-1-1", assignmentId: "eval-asgn-001", criterionId: "tech", criterionName: "Technical Feasibility", rawScore: 95, weight: 25, weightedScore: 23.75, justification: "Dual-beam laser scattering exceeds standard resolution.", createdAt: "2026-03-05" },
      { id: "sc-1-2", assignmentId: "eval-asgn-001", criterionId: "fit", criterionName: "Problem Fit & Ward Coverage", rawScore: 92, weight: 20, weightedScore: 18.4, justification: "40 nodes across 4 wards provides <400m spatial buffer.", createdAt: "2026-03-05" },
      { id: "sc-1-3", assignmentId: "eval-asgn-001", criterionId: "innov", criterionName: "Edge Calibration", rawScore: 94, weight: 15, weightedScore: 14.1, justification: "On-device humidity compensation curves are state of the art.", createdAt: "2026-03-05" },
      { id: "sc-1-4", assignmentId: "eval-asgn-001", criterionId: "scale", criterionName: "Scalability to 80 Wards", rawScore: 90, weight: 15, weightedScore: 13.5, justification: "Cellular NB-IoT avoids gateway mesh congestion at scale.", createdAt: "2026-03-05" },
      { id: "sc-1-5", assignmentId: "eval-asgn-001", criterionId: "cost", criterionName: "Cost Effectiveness", rawScore: 88, weight: 15, weightedScore: 13.2, justification: "₹55,000 per node lifecycle TCO is highly competitive.", createdAt: "2026-03-05" },
      { id: "sc-1-6", assignmentId: "eval-asgn-001", criterionId: "security", criterionName: "Data Security & API", rawScore: 95, weight: 10, weightedScore: 9.5, justification: "Strict TLS 1.3 push to Municipal ICCC webhook verified.", createdAt: "2026-03-05" },
    ],
  },
  // Expert 2: Dr. Sunita Rao (CSIR-NEERI)
  {
    assignment: {
      id: "eval-asgn-002",
      challengeId: "chal-air-001",
      applicationId: "app-airsense-001",
      expertId: "user-expert-002",
      hasConflictOfInterest: false,
      coiDeclaredAt: "2026-02-25T11:15:00.000Z",
      coiNotes: "No conflict of interest declared under CSIR research covenants.",
      isCompleted: true,
      totalWeightedScore: 89.0,
      technicalComments:
        "Field experience in Noida is an asset. The anti-fouling optical purge is crucial for North Indian winter dust storms. Recommended with condition of weekly calibration audits.",
      submittedAt: "2026-03-06T14:40:00.000Z",
      createdAt: "2026-02-24T10:00:00.000Z",
      updatedAt: "2026-03-06T14:40:00.000Z",
    },
    scores: [
      { id: "sc-2-1", assignmentId: "eval-asgn-002", criterionId: "tech", criterionName: "Technical Feasibility", rawScore: 90, weight: 25, weightedScore: 22.5, justification: "Satisfies CPCB continuous monitoring criteria.", createdAt: "2026-03-06" },
      { id: "sc-2-2", assignmentId: "eval-asgn-002", criterionId: "fit", criterionName: "Problem Fit & Ward Coverage", rawScore: 90, weight: 20, weightedScore: 18.0, justification: "Ward layout aligns with localized emission pockets.", createdAt: "2026-03-06" },
      { id: "sc-2-3", assignmentId: "eval-asgn-002", criterionId: "innov", criterionName: "Edge Calibration", rawScore: 88, weight: 15, weightedScore: 13.2, justification: "Ultrasonic optical purge effectively prevents fog buildup.", createdAt: "2026-03-06" },
      { id: "sc-2-4", assignmentId: "eval-asgn-002", criterionId: "scale", criterionName: "Scalability to 80 Wards", rawScore: 88, weight: 15, weightedScore: 13.2, justification: "Modular pole mounts allow 15-minute field replacement.", createdAt: "2026-03-06" },
      { id: "sc-2-5", assignmentId: "eval-asgn-002", criterionId: "cost", criterionName: "Cost Effectiveness", rawScore: 87, weight: 15, weightedScore: 13.05, justification: "Within budget ceiling with healthy contingency margin.", createdAt: "2026-03-06" },
      { id: "sc-2-6", assignmentId: "eval-asgn-002", criterionId: "security", criterionName: "Data Security & API", rawScore: 91, weight: 10, weightedScore: 9.1, justification: "National NIC-cloud compatibility confirmed.", createdAt: "2026-03-06" },
    ],
  },
  // Expert 3: Prof. Vikram Sen (IISc Bengaluru)
  {
    assignment: {
      id: "eval-asgn-003",
      challengeId: "chal-air-001",
      applicationId: "app-airsense-001",
      expertId: "user-expert-003",
      hasConflictOfInterest: false,
      coiDeclaredAt: "2026-02-26T08:30:00.000Z",
      coiNotes: "Statutory affidavit of impartiality filed.",
      isCompleted: true,
      totalWeightedScore: 93.5,
      technicalComments:
        "The architecture represents one of the cleanest low-cost municipal environmental sensing proposals reviewed this cycle. Edge calibration prevents raw-sensor data skew. Strongly recommended.",
      submittedAt: "2026-03-07T11:00:00.000Z",
      createdAt: "2026-02-24T10:00:00.000Z",
      updatedAt: "2026-03-07T11:00:00.000Z",
    },
    scores: [
      { id: "sc-3-1", assignmentId: "eval-asgn-003", criterionId: "tech", criterionName: "Technical Feasibility", rawScore: 96, weight: 25, weightedScore: 24.0, justification: "High optical fidelity across PM2.5 and PM10 simultaneously.", createdAt: "2026-03-07" },
      { id: "sc-3-2", assignmentId: "eval-asgn-003", criterionId: "fit", criterionName: "Problem Fit & Ward Coverage", rawScore: 94, weight: 20, weightedScore: 18.8, justification: "Directly solves the lack of micro-dust spatial telemetry.", createdAt: "2026-03-07" },
      { id: "sc-3-3", assignmentId: "eval-asgn-003", criterionId: "innov", criterionName: "Edge Calibration", rawScore: 95, weight: 15, weightedScore: 14.25, justification: "Polynomial coefficient adjustment model is well reasoned.", createdAt: "2026-03-07" },
      { id: "sc-3-4", assignmentId: "eval-asgn-003", criterionId: "scale", criterionName: "Scalability to 80 Wards", rawScore: 92, weight: 15, weightedScore: 13.8, justification: "Low bandwidth NB-IoT minimizes state telecom recurring fees.", createdAt: "2026-03-07" },
      { id: "sc-3-5", assignmentId: "eval-asgn-003", criterionId: "cost", criterionName: "Cost Effectiveness", rawScore: 89, weight: 15, weightedScore: 13.35, justification: "Provides 10x spatial resolution at 1/15th reference station cost.", createdAt: "2026-03-07" },
      { id: "sc-3-6", assignmentId: "eval-asgn-003", criterionId: "security", criterionName: "Data Security & API", rawScore: 93, weight: 10, weightedScore: 9.3, justification: "End-to-end payload signature verifies transmission authenticity.", createdAt: "2026-03-07" },
    ],
  },
];

// ============================================================================
// 8. SHORTLIST RECORD (Consensus Evaluation Committee Decision)
// ============================================================================
export const DEMO_SHORTLIST = {
  id: "shortlist-air-001",
  challengeId: "chal-air-001",
  applicationId: "app-airsense-001",
  organizationId: "org-airsense-001",
  candidateName: "AirSense Technologies Pvt Ltd",
  rank: 1,
  compositeWeightedScore: 91.67, // Average of 92.5, 89.0, 93.5
  expertPanelConsensus: "UNANIMOUS_RECOMMENDATION",
  decision: "PILOT_AWARDED",
  officerJustification:
    "AirSense Technologies achieved the highest consensus technical score (91.67/100) from independent evaluators across IIT Kanpur, CSIR-NEERI, and IISc. The proposed 40-node mesh provides immediate ward coverage at competitive cost.",
  sanctionOrderNumber: "ORD-UP-DUD-2026-PILOT-01",
  sanctionedBudgetInr: 2200000,
  awardedBy: "user-gov-001",
  sanctionedDate: "2026-03-15T12:00:00.000Z",
};

// ============================================================================
// 9. PILOT: "Lucknow Urban Air Quality Pilot" (90 Days)
// ============================================================================
export const DEMO_PILOT: Pilot = {
  id: "pilot-air-001",
  challengeId: "chal-air-001",
  applicationId: "app-airsense-001",
  organizationId: "org-airsense-001",
  departmentId: "dept-urban-001",
  pilotCode: "PILOT-UP-UAQ-2026-01",
  title: "Lucknow Urban Air Quality Pilot",
  scopeDescription:
    "Controlled municipal pilot deployment of 40 real-time ambient particulate and gas sensors across Lucknow Wards 14, 18, 22, and 29 for 90 days with continuous CPCB BAM-1020 collocation.",
  locationName: "Lucknow, Uttar Pradesh",
  latitude: 26.8467,
  longitude: 80.9462,
  elevationMeters: 123,
  meshNodeId: "node-lucknow-central-grid",
  totalBudget: 2200000,
  disbursedAmount: 1400000, // Milestone 1 (₹6L) + Milestone 2 (₹8L) paid
  startDate: "2026-05-01",
  endDate: "2026-07-30",
  overallProgress: 100, // 90 days concluded and verified
  riskLevel: "LOW",
  status: "ACTIVE",
  createdAt: "2026-04-20T00:00:00.000Z",
  updatedAt: "2026-07-30T00:00:00.000Z",
};

// ============================================================================
// 10. PILOT MILESTONES (149 Performance Escrow Tranches)
// ============================================================================
export const DEMO_MILESTONES: PilotMilestone[] = [
  {
    id: "m-1",
    pilotId: "pilot-air-001",
    milestoneNumber: 1,
    name: "Site Survey, Sensor Calibration & Initial 10 Nodes Deployment",
    description: "Install 10 baseline units and establish cross-calibration with reference CPCB monitor.",
    deadline: "2026-05-20",
    deliverablesChecklist: [
      { item: "Site permissions verified with Municipal Ward Offices", completed: true },
      { item: "10 sensor nodes physically mounted and powered", completed: true },
      { item: "Calibration curves registered with independent validator", completed: true },
    ],
    allocatedPayment: 600000,
    status: "APPROVED",
    submittedAt: "2026-05-18T12:00:00.000Z",
    approvedAt: "2026-05-21T10:00:00.000Z",
    approvedBy: "user-gov-001",
    createdAt: "2026-04-25T00:00:00.000Z",
    updatedAt: "2026-05-21T10:00:00.000Z",
  },
  {
    id: "m-2",
    pilotId: "pilot-air-001",
    milestoneNumber: 2,
    name: "Full 40 Node Mesh Deployment & GIS Telemetry Integration",
    description: "Complete deployment across all 4 target wards with live streaming API ingestion.",
    deadline: "2026-06-20",
    deliverablesChecklist: [
      { item: "40 operational nodes continuously sending telemetry", completed: true },
      { item: "Live data integration into Municipal GIS dashboard", completed: true },
      { item: "Uptime reporting above 90%", completed: true },
    ],
    allocatedPayment: 800000,
    status: "APPROVED",
    submittedAt: "2026-06-19T14:00:00.000Z",
    approvedAt: "2026-06-22T09:30:00.000Z",
    approvedBy: "user-gov-001",
    createdAt: "2026-04-25T00:00:00.000Z",
    updatedAt: "2026-06-22T09:30:00.000Z",
  },
  {
    id: "m-3",
    pilotId: "pilot-air-001",
    milestoneNumber: 3,
    name: "90-Day Continuous Evaluation, Anomaly Detection & Independent Audit",
    description: "Conclude 90-day observation window and submit dataset for third-party validation.",
    deadline: "2026-07-30",
    deliverablesChecklist: [
      { item: "Complete 90-day time-series dataset archived", completed: true },
      { item: "Third-party validator onsite spot check completed", completed: true },
      { item: "Final technical report and scale-up procurement specification", completed: true },
    ],
    allocatedPayment: 800000,
    status: "APPROVED",
    submittedAt: "2026-07-28T16:00:00.000Z",
    approvedAt: "2026-07-30T14:00:00.000Z",
    approvedBy: "user-gov-001",
    createdAt: "2026-04-25T00:00:00.000Z",
    updatedAt: "2026-07-30T14:00:00.000Z",
  },
];

// ============================================================================
// 11. DEMO KPI DATA (Exact User Specification)
// Coverage: Baseline 35% | Target 85% | Current 86%
// Data Accuracy: Baseline 82% | Target 95% | Current 95%
// Device Uptime: Baseline 76% | Target 90% | Current 94%
// ============================================================================
export const DEMO_KPIS: KPI[] = [
  {
    id: "kpi-cov-001",
    pilotId: "pilot-air-001",
    name: "Monitoring Coverage",
    metricCode: "MONITORING_COVERAGE_PCT",
    description: "Percentage of municipal ward area within active sensing radius of calibrated nodes",
    baselineValue: 35.0,
    targetValue: 85.0,
    currentValue: 86.0,
    unit: "%",
    measurementFrequency: "Weekly GIS Buffer Audit",
    dataSource: "Municipal GIS Shapefile Spatial Voronoi Buffer Layer",
    isCritical: true,
    createdAt: "2026-04-25T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  },
  {
    id: "kpi-acc-002",
    pilotId: "pilot-air-001",
    name: "Data Accuracy",
    metricCode: "DATA_ACCURACY_R2_PCT",
    description: "Statistical regression correlation against reference CPCB BAM-1020 Beta-Attenuation Monitor",
    baselineValue: 82.0,
    targetValue: 95.0,
    currentValue: 95.0,
    unit: "%",
    measurementFrequency: "Bi-weekly Reference Collocation Audit",
    dataSource: "Collocated BAM-1020 Analyzer Spot Audit & Linear Regression",
    isCritical: true,
    createdAt: "2026-04-25T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  },
  {
    id: "kpi-upt-003",
    pilotId: "pilot-air-001",
    name: "Device Uptime",
    metricCode: "DEVICE_UPTIME_PCT",
    description: "Percentage of expected hourly telemetry packets successfully ingested by Municipal ICCC",
    baselineValue: 76.0,
    targetValue: 90.0,
    currentValue: 94.0,
    unit: "%",
    measurementFrequency: "Continuous Telemetry Ingestion Ping",
    dataSource: "Automated Municipal ICCC Telemetry Heartbeat Daemon",
    isCritical: true,
    createdAt: "2026-04-25T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  },
];

// ============================================================================
// 12. KPI MEASUREMENTS (Empirical Time-Series Progression)
// ============================================================================
export const DEMO_KPI_MEASUREMENTS: KPIMeasurement[] = [
  // Monitoring Coverage: Baseline 35% -> Target 85% -> Current 86%
  { id: "m-cov-1", kpiId: "kpi-cov-001", measuredAt: "2026-05-07", value: 35.0, notes: "Baseline 10 nodes deployed across Ward 14" },
  { id: "m-cov-2", kpiId: "kpi-cov-001", measuredAt: "2026-05-21", value: 52.0, notes: "18 nodes operational covering Wards 14 & 18" },
  { id: "m-cov-3", kpiId: "kpi-cov-001", measuredAt: "2026-06-05", value: 68.0, notes: "28 nodes active; fringe arterial coverage added" },
  { id: "m-cov-4", kpiId: "kpi-cov-001", measuredAt: "2026-06-20", value: 81.0, notes: "All 40 nodes installed across 4 municipal wards" },
  { id: "m-cov-5", kpiId: "kpi-cov-001", measuredAt: "2026-07-15", value: 85.0, notes: "Target reached; antenna mast heights optimized" },
  { id: "m-cov-6", kpiId: "kpi-cov-001", measuredAt: "2026-07-30", value: 86.0, notes: "Final validated coverage across 4 pilot wards (86% achieved)" },

  // Data Accuracy: Baseline 82% -> Target 95% -> Current 95%
  { id: "m-acc-1", kpiId: "kpi-acc-002", measuredAt: "2026-05-07", value: 82.0, notes: "Factory baseline calibration vs reference station" },
  { id: "m-acc-2", kpiId: "kpi-acc-002", measuredAt: "2026-05-25", value: 86.5, notes: "Collocated regression polynomial coefficients updated" },
  { id: "m-acc-3", kpiId: "kpi-acc-002", measuredAt: "2026-06-15", value: 91.0, notes: "On-device humidity compensation curves activated" },
  { id: "m-acc-4", kpiId: "kpi-acc-002", measuredAt: "2026-07-10", value: 94.2, notes: "Collocation audit by TERI at Hazratganj CPCB station" },
  { id: "m-acc-5", kpiId: "kpi-acc-002", measuredAt: "2026-07-30", value: 95.0, notes: "Target satisfied: R2 = 0.95 across 90-day cycle" },

  // Device Uptime: Baseline 76% -> Target 90% -> Current 94%
  { id: "m-upt-1", kpiId: "kpi-upt-003", measuredAt: "2026-05-07", value: 76.0, notes: "Initial solar battery cycling during unseasonal cloud cover" },
  { id: "m-upt-2", kpiId: "kpi-upt-003", measuredAt: "2026-05-28", value: 84.0, notes: "Firmware OTA update v2.1.2 enabled power saving" },
  { id: "m-upt-3", kpiId: "kpi-upt-003", measuredAt: "2026-06-22", value: 90.5, notes: "Target reached: cellular dual-SIM carrier failover live" },
  { id: "m-upt-4", kpiId: "kpi-upt-003", measuredAt: "2026-07-20", value: 93.8, notes: "Zero outages through monsoon downpour week" },
  { id: "m-upt-5", kpiId: "kpi-upt-003", measuredAt: "2026-07-30", value: 94.0, notes: "Target exceeded: 94% cumulative operational uptime" },
];

// ============================================================================
// 13. EVIDENCE RECORDS (Cryptographically Sealed with SHA-256)
// ============================================================================
export const DEMO_EVIDENCE: EvidenceRecord[] = [
  {
    id: "ev-001",
    pilotId: "pilot-air-001",
    milestoneId: "m-1",
    kpiId: "kpi-cov-001",
    uploadedBy: "user-startup-001",
    title: "10 Node Installation Geo-tagged Photo Logs & GIS Shapefiles",
    description: "Complete photographic evidence and GPS coordinates of batch 1 deployment in Hazratganj.",
    fileName: "lucknow_nodes_batch1_geologs.pdf",
    filePath: "/uploads/evidence/demo/lucknow_nodes_batch1_geologs.pdf",
    fileSizeBytes: 4200000,
    mimeType: "application/pdf",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verificationStatus: "VERIFIED",
    verifiedBy: "user-validator-001",
    verifiedAt: "2026-05-20T11:00:00.000Z",
    validatorNotes: "Physical mounting, pole fixtures, and solar panel orientation verified on-site.",
    createdAt: "2026-05-18T10:00:00.000Z",
    updatedAt: "2026-05-20T11:00:00.000Z",
  },
  {
    id: "ev-002",
    pilotId: "pilot-air-001",
    milestoneId: "m-2",
    kpiId: "kpi-acc-002",
    uploadedBy: "user-startup-001",
    title: "Collocation Calibration Audit Report vs. CPCB Reference BAM-1020",
    description: "Statistical regression analysis comparing AirSense laser particle counter with CPCB reference BAM-1020.",
    fileName: "collocation_audit_june2026.pdf",
    filePath: "/uploads/evidence/demo/collocation_audit_june2026.pdf",
    fileSizeBytes: 2850000,
    mimeType: "application/pdf",
    sha256Hash: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
    verificationStatus: "VERIFIED",
    verifiedBy: "user-validator-001",
    verifiedAt: "2026-06-21T14:30:00.000Z",
    validatorNotes: "Confirmed R2 = 0.95 across 14-day continuous sampling collocation cycle.",
    createdAt: "2026-06-19T11:00:00.000Z",
    updatedAt: "2026-06-21T14:30:00.000Z",
  },
  {
    id: "ev-003",
    pilotId: "pilot-air-001",
    milestoneId: "m-3",
    kpiId: "kpi-upt-003",
    uploadedBy: "user-startup-001",
    title: "90-Day Full Telemetry Dataset & Municipal ICCC Ingestion Log",
    description: "Complete raw and calibrated hourly time-series data covering all 40 nodes over 90 days.",
    fileName: "lucknow_90day_telemetry_digest.csv.gz",
    filePath: "/uploads/evidence/demo/lucknow_90day_telemetry_digest.csv.gz",
    fileSizeBytes: 18400000,
    mimeType: "application/gzip",
    sha256Hash: "8a123fcd77921ba8921820938102938102938102938102938102938102938102",
    verificationStatus: "VERIFIED",
    verifiedBy: "user-validator-001",
    verifiedAt: "2026-07-29T10:00:00.000Z",
    validatorNotes: "Dataset integrity verified against cryptographic hash; zero missing packets detected.",
    createdAt: "2026-07-28T16:00:00.000Z",
    updatedAt: "2026-07-29T10:00:00.000Z",
  },
];

// ============================================================================
// 14. RISKS (Concrete Risk Governance Registry)
// ============================================================================
export const DEMO_RISKS: Risk[] = [
  {
    id: "risk-001",
    pilotId: "pilot-air-001",
    category: "TECHNICAL",
    title: "High-Humidity Optical Scattering Distortion",
    description: "Severe fog and monsoonal relative humidity (>90%) can cause water droplets to be miscounted as particulate matter.",
    probability: 4,
    impact: 3,
    riskScore: 12,
    ownerId: "user-startup-001",
    mitigationStrategy: "Active intake heating purge element and algorithmic humidity attenuation curves applied in firmware.",
    contingencyPlan: "Flag readings above 95% RH with quality assurance uncertainty bit in telemetry payload.",
    status: "CONTROLLED",
    createdAt: "2026-04-28T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  },
  {
    id: "risk-002",
    pilotId: "pilot-air-001",
    category: "OPERATIONAL",
    title: "Street Pole Solar Power Interruption",
    description: "Urban tree canopy overgrowth or heavy dust accumulation on small solar panels during dry spells.",
    probability: 3,
    impact: 3,
    riskScore: 9,
    ownerId: "user-startup-001",
    mitigationStrategy: "48-hour lithium iron phosphate (LiFePO4) battery buffer and bi-weekly municipal pole maintenance inspections.",
    contingencyPlan: "Rapid modular hot-swap battery pack replacement by field technician within 4 hours.",
    status: "CONTROLLED",
    createdAt: "2026-04-28T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  },
  {
    id: "risk-003",
    pilotId: "pilot-air-001",
    category: "DATA",
    title: "Cellular Backhaul Telemetry Packet Loss",
    description: "Network congestion in central commercial markets during festival hours.",
    probability: 2,
    impact: 2,
    riskScore: 4,
    ownerId: "user-startup-001",
    mitigationStrategy: "Dual-SIM carrier failover (BSNL + Airtel) and on-device 14-day ring-buffer memory storage.",
    contingencyPlan: "Automatic batch sync upon network restoration with cryptographic timestamp receipt.",
    status: "MITIGATING",
    createdAt: "2026-04-28T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  },
  {
    id: "risk-004",
    pilotId: "pilot-air-001",
    category: "CYBERSECURITY",
    title: "Physical Sensor Enclosure Tampering",
    description: "Vandalism or unauthorized physical port access to sensors mounted on low municipal street poles.",
    probability: 2,
    impact: 4,
    riskScore: 8,
    ownerId: "user-gov-001",
    mitigationStrategy: "Mounting height restricted to minimum 4.5m above ground; tamper-detection micro-switch sends instant alarm.",
    contingencyPlan: "Municipal ward police beat alert triggered on tamper switch trip.",
    status: "CONTROLLED",
    createdAt: "2026-04-28T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  },
  {
    id: "risk-005",
    pilotId: "pilot-air-001",
    category: "FINANCIAL",
    title: "Milestone Escrow Disbursement Delay",
    description: "Delayed state treasury sanction processing affecting startup component procurement for Milestone 2.",
    probability: 2,
    impact: 3,
    riskScore: 6,
    ownerId: "user-proc-001",
    mitigationStrategy: "Pre-funded dedicated SBI Treasury Escrow account established prior to pilot kick-off.",
    contingencyPlan: "Automatic 72-hour disbursement window upon Officer digital signature.",
    status: "CONTROLLED",
    createdAt: "2026-04-28T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  },
  {
    id: "risk-006",
    pilotId: "pilot-air-001",
    category: "TIMELINE",
    title: "Monsoon Waterlogging Delaying Ward Site Access",
    description: "Inundation of low-lying alleys preventing technicians from mounting nodes in Ward 29.",
    probability: 3,
    impact: 2,
    riskScore: 6,
    ownerId: "user-gov-001",
    mitigationStrategy: "Advance survey prioritizing high-ground municipal buildings and school rooftops.",
    contingencyPlan: "Pre-approved alternate mounting points in ward master plan.",
    status: "CLOSED",
    createdAt: "2026-04-28T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  },
];

// ============================================================================
// 15. ISSUES (Active Incident Resolution Trail)
// ============================================================================
export const DEMO_ISSUES: Issue[] = [
  {
    id: "iss-001",
    pilotId: "pilot-air-001",
    title: "Optical Aperture Dust Occlusion on Node #14 (Hazratganj)",
    description: "Construction fly-ash from nearby metro expansion caused 8% laser power attenuation on Node 14.",
    severity: "MEDIUM",
    ownerId: "user-startup-001",
    reportedBy: "user-validator-001",
    status: "RESOLVED",
    resolution: "Triggered remote ultrasonic air-purge sequence via NB-IoT downlink; laser power returned to 99.4% normal baseline.",
    resolvedAt: "2026-06-08T16:30:00.000Z",
    createdAt: "2026-06-08T09:15:00.000Z",
    updatedAt: "2026-06-08T16:30:00.000Z",
  },
  {
    id: "iss-002",
    pilotId: "pilot-air-001",
    title: "Dual-SIM Carrier Handover Glitch on Node #22 (Gomti Nagar)",
    description: "Tower maintenance by primary telecom carrier caused 45-minute telemetry latency on Node 22.",
    severity: "LOW",
    ownerId: "user-startup-001",
    reportedBy: "user-gov-001",
    status: "RESOLVED",
    resolution: "Firmware OTA update v2.1.4 pushed; secondary eSIM carrier APN auto-switched seamlessly with zero subsequent data drop.",
    resolvedAt: "2026-06-25T11:00:00.000Z",
    createdAt: "2026-06-24T18:00:00.000Z",
    updatedAt: "2026-06-25T11:00:00.000Z",
  },
];

// ============================================================================
// 16. PAYMENT RECORDS (Milestone Performance Releases)
// ============================================================================
export const DEMO_PAYMENTS: Payment[] = [
  {
    id: "pay-001",
    milestoneId: "m-1",
    pilotId: "pilot-air-001",
    amount: 600000, // ₹6,00,000 INR
    status: "PAID",
    paymentReference: "RBI-NEFT-20260523-89104",
    invoiceNumber: "INV-AS-2026-01",
    requestedAt: "2026-05-21T11:00:00.000Z",
    approvedBy: "user-proc-001",
    approvedAt: "2026-05-22T14:00:00.000Z",
    disbursedAt: "2026-05-23T10:00:00.000Z",
    mockTransactionId: "TXN_MOCK_SBI_UP_98124",
    notes: "Milestone 1 (Site Survey & 10 Initial Nodes) cleared by Joint Director Rajesh Verma.",
    createdAt: "2026-05-21T11:00:00.000Z",
    updatedAt: "2026-05-23T10:00:00.000Z",
  },
  {
    id: "pay-002",
    milestoneId: "m-2",
    pilotId: "pilot-air-001",
    amount: 800000, // ₹8,00,000 INR
    status: "PAID",
    paymentReference: "RBI-NEFT-20260624-91283",
    invoiceNumber: "INV-AS-2026-02",
    requestedAt: "2026-06-22T10:00:00.000Z",
    approvedBy: "user-proc-001",
    approvedAt: "2026-06-23T15:30:00.000Z",
    disbursedAt: "2026-06-24T11:30:00.000Z",
    mockTransactionId: "TXN_MOCK_SBI_UP_98902",
    notes: "Milestone 2 (Full 40-Node Mesh & GIS Telemetry) verified against ICCC live dashboard.",
    createdAt: "2026-06-22T10:00:00.000Z",
    updatedAt: "2026-06-24T11:30:00.000Z",
  },
  {
    id: "pay-003",
    milestoneId: "m-3",
    pilotId: "pilot-air-001",
    amount: 800000, // ₹8,00,000 INR
    status: "APPROVED",
    paymentReference: "RBI-NEFT-20260801-99412",
    invoiceNumber: "INV-AS-2026-03",
    requestedAt: "2026-07-28T16:30:00.000Z",
    approvedBy: "user-proc-001",
    approvedAt: "2026-07-30T16:00:00.000Z",
    disbursedAt: "2026-08-01T10:30:00.000Z",
    mockTransactionId: "TXN_MOCK_SBI_UP_99412",
    notes: "Milestone 3 (90-Day Validation & Audit) approved upon delivery of TERI Validation Report.",
    createdAt: "2026-07-28T16:30:00.000Z",
    updatedAt: "2026-08-01T10:30:00.000Z",
  },
];

// ============================================================================
// 17. VALIDATION REPORT (Independent Verification Audit by TERI)
// ============================================================================
export const DEMO_VALIDATION_REPORT: ValidationReport = {
  id: "val-rep-001",
  pilotId: "pilot-air-001",
  validatorId: "user-validator-001",
  methodologyOverview:
    "Independent 90-day physical and statistical verification of 40 deployed air quality nodes against Lucknow CPCB station reference instruments using continuous collocation, packet transmission checksum audits, and unannounced field spot checks.",
  evidenceReviewedCount: 14,
  kpiAuditSummary: [
    {
      kpiId: "kpi-cov-001",
      metricName: "Monitoring Coverage",
      verifiedBaseline: 35.0,
      verifiedOutcome: 86.0,
      targetMet: true,
    },
    {
      kpiId: "kpi-acc-002",
      metricName: "Data Accuracy",
      verifiedBaseline: 82.0,
      verifiedOutcome: 95.0,
      targetMet: true,
    },
    {
      kpiId: "kpi-upt-003",
      metricName: "Device Uptime",
      verifiedBaseline: 76.0,
      verifiedOutcome: 94.0,
      targetMet: true,
    },
  ],
  outcome: "VALIDATED",
  verifiedStrengths:
    "Exceptional correlation (R² = 0.95) with reference BAM-1020 monitors; robust 48-hour LiFePO4 battery resilience during monsoons; seamless GIS data streaming into Municipal ICCC.",
  limitationsRecorded:
    "Extreme humidity events (>90% RH) require active optical heating to prevent water droplet scattering false positives; recommended inclusion of heated inlet in city-wide tender specifications.",
  recommendations:
    "Recommended for direct city-wide public procurement scale-up across the remaining 80 municipal wards of Lucknow.",
  submittedAt: "2026-07-29T10:00:00.000Z",
  createdAt: "2026-07-29T10:00:00.000Z",
  updatedAt: "2026-07-29T10:00:00.000Z",
};

// ============================================================================
// 18. PILOT EXECUTIVE REPORT (14-Section Statutory Dossier)
// ============================================================================
export const DEMO_PILOT_REPORT = {
  id: "rep-pilot-air-001",
  pilotId: "pilot-air-001",
  pilotCode: "PILOT-UP-UAQ-2026-01",
  title: "Executive Pilot Evaluation & Scale-Up Dossier: Lucknow Urban Air Quality Mesh",
  subtitle: "90-Day Empirical Field Validation under Smart Cities Mission Framework",
  jurisdiction: "Lucknow Municipal Corporation, Uttar Pradesh",
  department: "Department of Urban Development",
  startupName: "AirSense Technologies Pvt Ltd",
  startupDpiit: "DIPP98214",
  duration: "90 Days (01 May 2026 – 30 July 2026)",
  overallStatus: "VALIDATED" as const,
  executiveVerdict: "HIGH-IMPACT EMPIRICAL SUCCESS — RECOMMENDED FOR CITY-WIDE TENDER SCALE",
  reportDate: "2026-07-30",
  kpiAttainmentSummary: {
    coverage: { baseline: "35%", target: "85%", actual: "86%", verdict: "EXCEEDED" },
    accuracy: { baseline: "82%", target: "95%", actual: "95%", verdict: "MET" },
    uptime: { baseline: "76%", target: "90%", actual: "94%", verdict: "EXCEEDED" },
  },
  costSummary: {
    sanctionedBudget: 2200000,
    disbursedToDate: 2200000,
    costPerCalibratedNode: 55000,
    referenceStationCostRatio: "1:15 cost reduction per monitored sq km",
  },
  signatories: [
    { name: "Rajesh Verma", designation: "Joint Director, Urban Development", signedAt: "2026-07-30" },
    { name: "Sunita Deshmukh", designation: "Chief Procurement Officer", signedAt: "2026-07-30" },
    { name: "Priya Nair", designation: "Lead Independent Validator (TERI)", signedAt: "2026-07-29" },
  ],
};

// ============================================================================
// 19. SCALE-UP DECISION (GFR Rule 149 Public Procurement Transition)
// ============================================================================
export const DEMO_SCALE_UP_DECISION: ScaleUpDecision = {
  id: "scale-dec-001",
  pilotId: "pilot-air-001",
  decision: "SCALE",
  justification:
    "Lucknow Urban Air Quality Pilot achieved 95% data accuracy, 94% telemetry uptime, and 86% ward coverage over 90 days. The system enabled municipal misting trucks to dispatch within 22 minutes of micro-dust hot-spots (down from 4.5 hours baseline). The solution is certified field-proven under GFR Rule 149.",
  procurementRecommendation:
    "Authorize competitive public procurement tender for full 80-ward deployment (350 nodes) under Smart Cities Urban Infrastructure Mission, incorporating pilot-tested technical specifications.",
  approvedScaleBudget: 18500000, // ₹1,85,00,000 INR (1.85 Crore)
  targetGeographies: ["Lucknow Municipal Corporation (All 80 Wards)", "Kanpur Nagar Core Arterials"],
  decisionCommittee: [
    { name: "Rajesh Verma", title: "Joint Director, Urban Development (Chair)", vote: "APPROVE" },
    { name: "Sunita Deshmukh", title: "Chief Procurement Officer", vote: "APPROVE" },
    { name: "Dr. Alok Gupta", title: "Technical Evaluator (IIT Kanpur)", vote: "APPROVE" },
  ],
  decidedBy: "user-gov-001",
  decidedAt: "2026-07-30T15:00:00.000Z",
  createdAt: "2026-07-30T15:00:00.000Z",
  updatedAt: "2026-07-30T15:00:00.000Z",
};

// ============================================================================
// 20. PROVEN SOLUTION (National Evidence-Based Repository Entry)
// ============================================================================
export const DEMO_PROVEN_SOLUTION: ProvenSolution = {
  id: "sol-air-001",
  pilotId: "pilot-air-001",
  organizationId: "org-airsense-001",
  title: "Hyperlocal IoT Air Quality Monitoring & Rapid Ward Intervention Grid",
  problemAddressed: "Lack of ward-level granular particulate sensing for rapid municipal dust suppression.",
  technologyStack: [
    "Laser Scattering Particulate Sensors",
    "LoRaWAN & NB-IoT",
    "Machine Learning Collocation Curves",
    "Municipal GIS Webhook Stream",
  ],
  testedLocation: "Lucknow, Uttar Pradesh (Wards 14, 18, 22, 29)",
  pilotDurationDays: 90,
  totalPilotCost: 2200000,
  validatedKPIs: [
    { name: "Monitoring Coverage", baseline: 35.0, achieved: 86.0, unit: "%" },
    { name: "Data Accuracy vs. CPCB Reference Monitor", baseline: 82.0, achieved: 95.0, unit: "%" },
    { name: "Device Uptime", baseline: 76.0, achieved: 94.0, unit: "%" },
  ],
  applicableDepartmentTypes: ["Municipal Corporations", "Urban Development", "State Pollution Control Boards"],
  replicationGuidelines:
    "Deploy 8–10 calibrated nodes per municipal ward; mandate 14-day collocation calibration prior to live ingestion; require heated optical intake for winter deployment.",
  isPublic: true,
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
};

// ============================================================================
// 21. MASTER RELATIONAL DATASET EXPORT & CONVENIENCE ACCESSORS
// ============================================================================
export const MASTER_DEMO_DATASET = {
  meta: DEMO_DATASET_META,
  department: DEMO_DEPARTMENT,
  users: DEMO_USERS,
  startup: DEMO_STARTUP,
  challenge: DEMO_CHALLENGE,
  application: DEMO_APPLICATION,
  eligibilityReview: DEMO_ELIGIBILITY_REVIEW,
  expertEvaluations: DEMO_EXPERT_EVALUATIONS,
  shortlist: DEMO_SHORTLIST,
  pilot: DEMO_PILOT,
  milestones: DEMO_MILESTONES,
  kpis: DEMO_KPIS,
  kpiMeasurements: DEMO_KPI_MEASUREMENTS,
  evidence: DEMO_EVIDENCE,
  risks: DEMO_RISKS,
  issues: DEMO_ISSUES,
  payments: DEMO_PAYMENTS,
  validationReport: DEMO_VALIDATION_REPORT,
  pilotReport: DEMO_PILOT_REPORT,
  scaleUpDecision: DEMO_SCALE_UP_DECISION,
  provenSolution: DEMO_PROVEN_SOLUTION,
};

/**
 * Accessor returning the fully connected demo lifecycle bundle for 'Urban Air Quality Monitoring'.
 */
export function getDemoFullLifecycle() {
  return MASTER_DEMO_DATASET;
}
