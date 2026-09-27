// In-memory persistent database for Document and Contract Management
// Implements statutory pilot contracts, 8 document types, 5 lifecycle statuses, version history, and role-based access

export type DocumentType =
  | "Pilot Agreement"
  | "NDA"
  | "Data Agreement"
  | "IP Agreement"
  | "Security Checklist"
  | "Evaluation Report"
  | "Validation Report"
  | "Procurement Documents";

export type DocumentStatus =
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Signed"
  | "Expired";

export type DocumentAccessLevel =
  | "Public"
  | "Restricted (Government & Startup)"
  | "Confidential (Government Only)"
  | "Procurement Clearance Required"
  | "Proprietary Startup IP";

export interface DocumentVersionEntry {
  version: string;
  updatedDate: string; // ISO date
  updatedBy: string;
  summaryOfChanges: string;
  fileSize: string;
  sha256Hash: string;
  downloadUrl: string;
}

export interface DocumentSignatory {
  name: string;
  role: string;
  organization: string;
  status: "Pending" | "Signed" | "Declined";
  signedAt?: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: DocumentType;
  version: string;
  owner: string;
  createdDate: string; // ISO date
  updatedDate: string; // ISO date
  expiryDate: string;  // ISO date
  status: DocumentStatus;
  access: DocumentAccessLevel;
  isTemplate: boolean;
  templateDisclaimer?: string;
  description: string;
  fileSize: string;
  fileFormat: string;
  sha256Hash: string;
  pilotId: string;
  signatories: DocumentSignatory[];
  versionHistory: DocumentVersionEntry[];
  confidentialityLevel: "PUBLIC" | "RESTRICTED" | "CONFIDENTIAL_GOV_ONLY" | "PROPRIETARY_STARTUP";
  downloadUrl: string;
}

export const LEGAL_TEMPLATE_DISCLAIMER =
  "LEGAL TEMPLATE — Standard governance draft provided for drafting convenience. Prior to binding execution, municipal legal counsel must review and adapt all indemnity, intellectual property, and dispute resolution covenants to applicable state municipal bylaws and GFR rules.";

// Initial Database Seed for Lucknow Air Quality Pilot (PILOT-UP-UAQ-01)
let DOCUMENTS_DATABASE: DocumentRecord[] = [
  // 1. Pilot Agreement (Signed)
  {
    id: "DOC-AGR-01",
    name: "Tripartite Pilot Execution Agreement — Lucknow Smart City",
    type: "Pilot Agreement",
    version: "v1.2",
    owner: "Directorate of Urban Development, Govt of UP & AirSense Technologies",
    createdDate: "2026-05-10",
    updatedDate: "2026-05-14",
    expiryDate: "2027-05-14",
    status: "Signed",
    access: "Restricted (Government & Startup)",
    isTemplate: false,
    description:
      "Statutory tripartite operational deed governing field deployment of 40 calibrated particulate sensor nodes, municipal streetlight pole mounting covenants, and 90-day evaluation parameters.",
    fileSize: "8.4 MB",
    fileFormat: "PDF / Digital Signature Compliant",
    sha256Hash: "b38a162df9012a95c478e82110c978bbfa4923e11029487cba1024567561a098",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "RESTRICTED",
    downloadUrl: "/secure-vault/docs/tripartite_pilot_agreement_v1.2.pdf",
    signatories: [
      {
        name: "Rajesh Verma",
        role: "Director of Municipal Services",
        organization: "Dept of Urban Development, UP",
        status: "Signed",
        signedAt: "2026-05-14T11:20:00Z",
      },
      {
        name: "Dr. Rohan Varma",
        role: "Managing Director",
        organization: "AirSense Technologies Pvt Ltd",
        status: "Signed",
        signedAt: "2026-05-14T10:45:00Z",
      },
      {
        name: "Indrajeet Singh, IAS",
        role: "Chief Executive Officer",
        organization: "Lucknow Smart City SPV",
        status: "Signed",
        signedAt: "2026-05-14T14:00:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v1.2",
        updatedDate: "2026-05-14",
        updatedBy: "Rajesh Verma (Officer)",
        summaryOfChanges: "Final execution copy; incorporated municipal pole attachment safety guidelines and GFR Rule 149 escrow milestone clauses.",
        fileSize: "8.4 MB",
        sha256Hash: "b38a162df9012a95c478e82110c978bbfa4923e11029487cba1024567561a098",
        downloadUrl: "/secure-vault/docs/tripartite_pilot_agreement_v1.2.pdf",
      },
      {
        version: "v1.1",
        updatedDate: "2026-05-12",
        updatedBy: "Adv. Meera Sen (Legal Advisor)",
        summaryOfChanges: "Legal review markup: clarified background IP retention boundaries and sovereign data residency clauses.",
        fileSize: "8.1 MB",
        sha256Hash: "4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
        downloadUrl: "/secure-vault/docs/tripartite_pilot_agreement_v1.1.pdf",
      },
      {
        version: "v1.0",
        updatedDate: "2026-05-10",
        updatedBy: "Rohan Varma (AirSense)",
        summaryOfChanges: "Initial bilateral draft submitted by startup based on state innovation pilot framework.",
        fileSize: "7.9 MB",
        sha256Hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        downloadUrl: "/secure-vault/docs/tripartite_pilot_agreement_v1.0.pdf",
      },
    ],
  },

  // 2. NDA (Signed)
  {
    id: "DOC-NDA-01",
    name: "Mutual Non-Disclosure & Telemetry Confidentiality Covenant",
    type: "NDA",
    version: "v1.0",
    owner: "Lucknow Smart City SPV & AirSense Technologies",
    createdDate: "2026-05-02",
    updatedDate: "2026-05-05",
    expiryDate: "2028-05-05",
    status: "Signed",
    access: "Restricted (Government & Startup)",
    isTemplate: false,
    description:
      "Protects municipal SCADA protocols, proprietary optical firmware algorithms, and unreleased micro-hotspot geospatial coordinate datasets from public leak.",
    fileSize: "3.2 MB",
    fileFormat: "PDF / e-Sign Standard",
    sha256Hash: "9a81e263fa7b1209bca74e2843054f102837bcde20541178491028471bade029",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "RESTRICTED",
    downloadUrl: "/secure-vault/docs/mutual_nda_covenant_v1.0.pdf",
    signatories: [
      {
        name: "Priya Nair",
        role: "Data Privacy Officer",
        organization: "Lucknow Smart City SPV",
        status: "Signed",
        signedAt: "2026-05-05T09:30:00Z",
      },
      {
        name: "Dr. Rohan Varma",
        role: "Founder & CTO",
        organization: "AirSense Technologies Pvt Ltd",
        status: "Signed",
        signedAt: "2026-05-05T10:15:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v1.0",
        updatedDate: "2026-05-05",
        updatedBy: "Adv. Meera Sen",
        summaryOfChanges: "Standard mutual non-disclosure execution version with 24-month term.",
        fileSize: "3.2 MB",
        sha256Hash: "9a81e263fa7b1209bca74e2843054f102837bcde20541178491028471bade029",
        downloadUrl: "/secure-vault/docs/mutual_nda_covenant_v1.0.pdf",
      },
    ],
  },

  // 3. Data Agreement (Approved)
  {
    id: "DOC-DAT-01",
    name: "ICCC Real-Time Ingestion & Open Telemetry Data Agreement",
    type: "Data Agreement",
    version: "v1.1",
    owner: "Lucknow Integrated Command and Control Centre (ICCC)",
    createdDate: "2026-05-18",
    updatedDate: "2026-06-01",
    expiryDate: "2027-06-01",
    status: "Approved",
    access: "Public",
    isTemplate: false,
    description:
      "Sets telemetry ingestion protocol standards (MQTT / TLS 1.3), JSON schema definitions for ambient particulate readings, and Open Data governance rules under National Data Sharing and Accessibility Policy (NDSAP).",
    fileSize: "4.5 MB",
    fileFormat: "PDF / Technical Specification",
    sha256Hash: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "PUBLIC",
    downloadUrl: "/secure-vault/docs/iccc_telemetry_data_agreement_v1.1.pdf",
    signatories: [
      {
        name: "ICCC Systems Lead",
        role: "Principal Architect",
        organization: "Lucknow Smart City ICCC",
        status: "Signed",
        signedAt: "2026-06-01T14:00:00Z",
      },
      {
        name: "Ananya Dixit",
        role: "Lead IoT Systems Engineer",
        organization: "AirSense Technologies Pvt Ltd",
        status: "Signed",
        signedAt: "2026-06-01T15:20:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v1.1",
        updatedDate: "2026-06-01",
        updatedBy: "ICCC Systems Lead",
        summaryOfChanges: "Added MQTT quality-of-service QoS-1 acknowledgement requirements and heartbeat rate-limiting parameters.",
        fileSize: "4.5 MB",
        sha256Hash: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
        downloadUrl: "/secure-vault/docs/iccc_telemetry_data_agreement_v1.1.pdf",
      },
      {
        version: "v1.0",
        updatedDate: "2026-05-18",
        updatedBy: "Ananya Dixit",
        summaryOfChanges: "Initial telemetry protocol specification draft.",
        fileSize: "4.1 MB",
        sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        downloadUrl: "/secure-vault/docs/iccc_telemetry_data_agreement_v1.0.pdf",
      },
    ],
  },

  // 4. IP Agreement (Signed)
  {
    id: "DOC-IP-01",
    name: "Background IP Preservation & Foreground Civic License Deed",
    type: "IP Agreement",
    version: "v2.0",
    owner: "Department of IT & Electronics, Govt of UP",
    createdDate: "2026-05-08",
    updatedDate: "2026-05-20",
    expiryDate: "2031-05-20",
    status: "Signed",
    access: "Restricted (Government & Startup)",
    isTemplate: false,
    description:
      "Protects AirSense pre-existing proprietary laser scatter calibration patents while granting the state government a perpetual, non-exclusive license to use telemetry models and API endpoints for municipal urban planning.",
    fileSize: "2.8 MB",
    fileFormat: "PDF / Legal Instrument",
    sha256Hash: "c819a08912e73645019284758129034910284561029348571029384756102938",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "RESTRICTED",
    downloadUrl: "/secure-vault/docs/background_ip_retention_deed_v2.0.pdf",
    signatories: [
      {
        name: "Dr. Rohan Varma",
        role: "Sole Inventor & Founder",
        organization: "AirSense Technologies Pvt Ltd",
        status: "Signed",
        signedAt: "2026-05-20T10:00:00Z",
      },
      {
        name: "Joint Secretary (IT)",
        role: "Authorized Signatory",
        organization: "Govt of Uttar Pradesh",
        status: "Signed",
        signedAt: "2026-05-20T16:30:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v2.0",
        updatedDate: "2026-05-20",
        updatedBy: "Adv. Meera Sen",
        summaryOfChanges: "Executed deed incorporating Department of Science & Technology patent preservation schedules.",
        fileSize: "2.8 MB",
        sha256Hash: "c819a08912e73645019284758129034910284561029348571029384756102938",
        downloadUrl: "/secure-vault/docs/background_ip_retention_deed_v2.0.pdf",
      },
      {
        version: "v1.0",
        updatedDate: "2026-05-08",
        updatedBy: "AirSense Legal Counsel",
        summaryOfChanges: "First draft defining background IP schedules 1 and 2.",
        fileSize: "2.4 MB",
        sha256Hash: "7b91c09823fca1102948cde901823746ba1029837461520192837465102a991b",
        downloadUrl: "/secure-vault/docs/background_ip_retention_deed_v1.0.pdf",
      },
    ],
  },

  // 5. Security Checklist (Approved)
  {
    id: "DOC-SEC-01",
    name: "CERT-In IoT Security Audit & Penetration Testing Checklist",
    type: "Security Checklist",
    version: "v1.3",
    owner: "State Cyber Security Operations Centre & STQC Laboratory",
    createdDate: "2026-06-05",
    updatedDate: "2026-06-18",
    expiryDate: "2027-06-18",
    status: "Approved",
    access: "Confidential (Government Only)",
    isTemplate: false,
    description:
      "Comprehensive 48-point cybersecurity checklist certifying edge hardware firmware integrity, memory protection, disabled JTAG debug ports on deployed poles, and TLS 1.3 telemetry encryption.",
    fileSize: "5.1 MB",
    fileFormat: "PDF / Audit Checklist",
    sha256Hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "CONFIDENTIAL_GOV_ONLY",
    downloadUrl: "/secure-vault/docs/certin_iot_security_checklist_v1.3.pdf",
    signatories: [
      {
        name: "Lead Auditor (STQC)",
        role: "Certified Information Systems Auditor",
        organization: "STQC Cyber Security Division",
        status: "Signed",
        signedAt: "2026-06-18T12:00:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v1.3",
        updatedDate: "2026-06-18",
        updatedBy: "STQC Auditor",
        summaryOfChanges: "Zero high or critical vulnerabilities; all 48 test assertions passed with hardware tamper protection.",
        fileSize: "5.1 MB",
        sha256Hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        downloadUrl: "/secure-vault/docs/certin_iot_security_checklist_v1.3.pdf",
      },
    ],
  },

  // 6. Evaluation Report (Signed)
  {
    id: "DOC-EVA-01",
    name: "Independent Academic Committee Technical Evaluation Report",
    type: "Evaluation Report",
    version: "v1.0",
    owner: "Dr. Alok Gupta (IIT Kanpur) & Technical Selection Panel",
    createdDate: "2026-04-20",
    updatedDate: "2026-04-28",
    expiryDate: "2028-04-28",
    status: "Signed",
    access: "Confidential (Government Only)",
    isTemplate: false,
    description:
      "Blind expert technical evaluation and rubric scoring (92.5/100) endorsing the micro-cyclonic self-cleaning optical design for Lucknow ambient winter conditions.",
    fileSize: "6.8 MB",
    fileFormat: "PDF / Technical Peer Review",
    sha256Hash: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "CONFIDENTIAL_GOV_ONLY",
    downloadUrl: "/secure-vault/docs/iitk_technical_evaluation_report_v1.0.pdf",
    signatories: [
      {
        name: "Dr. Alok Gupta",
        role: "Professor of Environmental Engineering",
        organization: "IIT Kanpur",
        status: "Signed",
        signedAt: "2026-04-28T14:30:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v1.0",
        updatedDate: "2026-04-28",
        updatedBy: "Dr. Alok Gupta",
        summaryOfChanges: "Final certified evaluation report submitted to state procurement board.",
        fileSize: "6.8 MB",
        sha256Hash: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
        downloadUrl: "/secure-vault/docs/iitk_technical_evaluation_report_v1.0.pdf",
      },
    ],
  },

  // 7. Validation Report (Approved)
  {
    id: "DOC-VAL-01",
    name: "TERI Collocation Regression Audit & Statutory Accuracy Certificate",
    type: "Validation Report",
    version: "v1.0",
    owner: "TERI Environmental Audit Division & CPCB Lalbagh Station",
    createdDate: "2026-07-24",
    updatedDate: "2026-07-25",
    expiryDate: "2027-07-25",
    status: "Approved",
    access: "Public",
    isTemplate: false,
    description:
      "Statutory empirical audit certificate confirming R² = 0.952 correlation against collocated CPCB BAM-1020 reference analyzer across 1,440 continuous hourly data points.",
    fileSize: "6.2 MB",
    fileFormat: "PDF / NABL Certified",
    sha256Hash: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "PUBLIC",
    downloadUrl: "/secure-vault/docs/teri_collocation_validation_report_v1.0.pdf",
    signatories: [
      {
        name: "Priya Nair",
        role: "Lead Environmental Validator",
        organization: "TERI Environmental Audit Division",
        status: "Signed",
        signedAt: "2026-07-25T11:00:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v1.0",
        updatedDate: "2026-07-25",
        updatedBy: "Priya Nair (TERI)",
        summaryOfChanges: "First official statutory issuance following 60-day collocation testbed completion.",
        fileSize: "6.2 MB",
        sha256Hash: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
        downloadUrl: "/secure-vault/docs/teri_collocation_validation_report_v1.0.pdf",
      },
    ],
  },

  // 8. Procurement Documents (Under Review)
  {
    id: "DOC-PRO-01",
    name: "Public Procurement Replication Brief & Direct Award Justification",
    type: "Procurement Documents",
    version: "v1.2",
    owner: "Public Procurement Directorate & Municipal SPV",
    createdDate: "2026-07-15",
    updatedDate: "2026-07-26",
    expiryDate: "2026-12-31",
    status: "Under Review",
    access: "Procurement Clearance Required",
    isTemplate: false,
    description:
      "Statutory justification docket under General Financial Rules (GFR) Rule 149(viii) enabling direct commercial rollout across remaining 8 Uttar Pradesh Smart Cities based on validated pilot results.",
    fileSize: "7.4 MB",
    fileFormat: "PDF / GFR Audit Docket",
    sha256Hash: "8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    pilotId: "PILOT-UP-UAQ-01",
    confidentialityLevel: "CONFIDENTIAL_GOV_ONLY",
    downloadUrl: "/secure-vault/docs/procurement_replication_brief_v1.2.pdf",
    signatories: [
      {
        name: "V. K. Saxena",
        role: "Procurement Officer",
        organization: "State Procurement Directorate",
        status: "Pending",
      },
      {
        name: "Rajesh Verma",
        role: "Director of Municipal Services",
        organization: "Dept of Urban Development",
        status: "Signed",
        signedAt: "2026-07-26T14:15:00Z",
      },
    ],
    versionHistory: [
      {
        version: "v1.2",
        updatedDate: "2026-07-26",
        updatedBy: "Rajesh Verma",
        summaryOfChanges: "Incorporated TERI R²=0.952 certified validation benchmarks as evidence appendix.",
        fileSize: "7.4 MB",
        sha256Hash: "8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
        downloadUrl: "/secure-vault/docs/procurement_replication_brief_v1.2.pdf",
      },
      {
        version: "v1.1",
        updatedDate: "2026-07-20",
        updatedBy: "V. K. Saxena",
        summaryOfChanges: "Refined multi-city budget benchmarking against central NCAP unit rates.",
        fileSize: "7.0 MB",
        sha256Hash: "3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
        downloadUrl: "/secure-vault/docs/procurement_replication_brief_v1.1.pdf",
      },
    ],
  },

  // =========================================================================
  // LEGAL TEMPLATES (Standardized drafts requiring appropriate legal review)
  // =========================================================================
  {
    id: "TMPL-AGR-01",
    name: "Master Municipal Innovation Pilot Agreement Template",
    type: "Pilot Agreement",
    version: "v2.4",
    owner: "Department of Urban Development Legal Cell",
    createdDate: "2026-01-15",
    updatedDate: "2026-04-10",
    expiryDate: "2029-12-31",
    status: "Approved",
    access: "Public",
    isTemplate: true,
    templateDisclaimer: LEGAL_TEMPLATE_DISCLAIMER,
    description:
      "Standard legal agreement template for municipal testbed pilots. Includes boilerplate clauses for sandbox immunity, milestone verification criteria, civic indemnity, and termination protocols.",
    fileSize: "1.9 MB",
    fileFormat: "DOCX / Legal Master Template",
    sha256Hash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    pilotId: "GLOBAL_TEMPLATE",
    confidentialityLevel: "PUBLIC",
    downloadUrl: "/templates/master_municipal_pilot_agreement_template_v2.4.docx",
    signatories: [],
    versionHistory: [
      {
        version: "v2.4",
        updatedDate: "2026-04-10",
        updatedBy: "State Legal Cell",
        summaryOfChanges: "Updated arbitration forum to State Dispute Mediation Council under updated 2026 procurement rules.",
        fileSize: "1.9 MB",
        sha256Hash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
        downloadUrl: "/templates/master_municipal_pilot_agreement_template_v2.4.docx",
      },
    ],
  },
  {
    id: "TMPL-NDA-01",
    name: "Model Mutual Non-Disclosure Agreement Template",
    type: "NDA",
    version: "v2.1",
    owner: "State IT & Legal Directorate",
    createdDate: "2026-01-20",
    updatedDate: "2026-03-15",
    expiryDate: "2029-12-31",
    status: "Approved",
    access: "Public",
    isTemplate: true,
    templateDisclaimer: LEGAL_TEMPLATE_DISCLAIMER,
    description:
      "Standard mutual non-disclosure template protecting startup trade secrets, algorithm codebases, and municipal sensitive critical infrastructure data.",
    fileSize: "1.2 MB",
    fileFormat: "DOCX / Legal Master Template",
    sha256Hash: "1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e",
    pilotId: "GLOBAL_TEMPLATE",
    confidentialityLevel: "PUBLIC",
    downloadUrl: "/templates/model_mutual_nda_template_v2.1.docx",
    signatories: [],
    versionHistory: [
      {
        version: "v2.1",
        updatedDate: "2026-03-15",
        updatedBy: "State IT Legal Advisor",
        summaryOfChanges: "Added Digital Personal Data Protection (DPDP) Act compliance schedule.",
        fileSize: "1.2 MB",
        sha256Hash: "1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e",
        downloadUrl: "/templates/model_mutual_nda_template_v2.1.docx",
      },
    ],
  },
  {
    id: "TMPL-IP-01",
    name: "Model Intellectual Property & Background IP Preservation Deed",
    type: "IP Agreement",
    version: "v1.8",
    owner: "Department of Science & Technology Legal Cell",
    createdDate: "2026-02-01",
    updatedDate: "2026-03-22",
    expiryDate: "2029-12-31",
    status: "Approved",
    access: "Public",
    isTemplate: true,
    templateDisclaimer: LEGAL_TEMPLATE_DISCLAIMER,
    description:
      "Recommended template clarifying that startups retain 100% ownership of pre-existing patents and code, granting municipal government only a non-exclusive operational usage right.",
    fileSize: "1.5 MB",
    fileFormat: "DOCX / Legal Master Template",
    sha256Hash: "8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a",
    pilotId: "GLOBAL_TEMPLATE",
    confidentialityLevel: "PUBLIC",
    downloadUrl: "/templates/model_ip_preservation_deed_template_v1.8.docx",
    signatories: [],
    versionHistory: [
      {
        version: "v1.8",
        updatedDate: "2026-03-22",
        updatedBy: "DST Legal Specialist",
        summaryOfChanges: "Clarified open-source dependency exclusion clauses.",
        fileSize: "1.5 MB",
        sha256Hash: "8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a",
        downloadUrl: "/templates/model_ip_preservation_deed_template_v1.8.docx",
      },
    ],
  },
];

// Helper: Check RBAC access to documents
export function canUserAccessDocument(
  doc: DocumentRecord,
  user?: { role: string; organizationId?: string; id?: string }
): { allowed: boolean; reason?: string } {
  // Public documents or legal templates are accessible to all authenticated or public users
  if (doc.access === "Public" || doc.confidentialityLevel === "PUBLIC" || doc.isTemplate) {
    return { allowed: true };
  }

  if (!user) {
    return { allowed: false, reason: "Authentication required to access restricted documents." };
  }

  // Admins & Government Officers have general oversight
  if (user.role === "ADMIN" || user.role === "GOVERNMENT_OFFICER") {
    return { allowed: true };
  }

  // Procurement Officers can access Procurement Documents, Pilot Agreements, NDAs, and Public/Restricted items
  if (user.role === "PROCUREMENT_OFFICER") {
    return { allowed: true };
  }

  // Validators & Experts
  if (user.role === "VALIDATOR" || user.role === "EXPERT") {
    if (doc.confidentialityLevel === "CONFIDENTIAL_GOV_ONLY" && doc.type === "Procurement Documents") {
      return { allowed: false, reason: "Internal government procurement clearance docket is restricted." };
    }
    return { allowed: true };
  }

  // Startups: Can access their own agreements, reports, NDAs, but NOT confidential government dockets
  if (user.role === "STARTUP") {
    if (doc.confidentialityLevel === "CONFIDENTIAL_GOV_ONLY") {
      return { allowed: false, reason: "Internal government administrative and evaluation docket is shielded." };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: "Insufficient role clearance." };
}

// Query Documents with filters & sorting
export function queryDocuments(
  filters: {
    type?: DocumentType | "ALL";
    status?: DocumentStatus | "ALL";
    isTemplate?: boolean;
    search?: string;
    pilotId?: string;
    sortBy?: "updatedDate" | "createdDate" | "name" | "type" | "status";
    sortOrder?: "asc" | "desc";
  },
  currentUser?: { role: string; organizationId?: string; id?: string }
): DocumentRecord[] {
  let list = [...DOCUMENTS_DATABASE];

  if (filters.pilotId) {
    list = list.filter((d) => d.pilotId === filters.pilotId || d.pilotId === "GLOBAL_TEMPLATE");
  }

  if (filters.isTemplate !== undefined) {
    list = list.filter((d) => d.isTemplate === filters.isTemplate);
  }

  if (filters.type && filters.type !== "ALL") {
    list = list.filter((d) => d.type === filters.type);
  }

  if (filters.status && filters.status !== "ALL") {
    list = list.filter((d) => d.status === filters.status);
  }

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.owner.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.version.toLowerCase().includes(q) ||
        d.sha256Hash.toLowerCase().includes(q)
    );
  }

  // Enforce RBAC filtering
  list = list.filter((d) => canUserAccessDocument(d, currentUser).allowed);

  // Sorting
  const sortBy = filters.sortBy || "updatedDate";
  const order = filters.sortOrder === "asc" ? 1 : -1;

  list.sort((a, b) => {
    if (sortBy === "updatedDate") {
      return (new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime()) * order;
    }
    if (sortBy === "createdDate") {
      return (new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()) * order;
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name) * order;
    }
    if (sortBy === "type") {
      return a.type.localeCompare(b.type) * order;
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status) * order;
    }
    return 0;
  });

  return list;
}

// Get document by ID with RBAC check
export function getDocumentById(
  id: string,
  currentUser?: { role: string; organizationId?: string; id?: string }
): { document?: DocumentRecord; error?: string; status?: number } {
  const item = DOCUMENTS_DATABASE.find((d) => d.id === id);
  if (!item) {
    return { error: "Document record not found", status: 404 };
  }

  const accessCheck = canUserAccessDocument(item, currentUser);
  if (!accessCheck.allowed) {
    return { error: accessCheck.reason || "Forbidden: Access denied to restricted document", status: 403 };
  }

  return { document: item, status: 200 };
}

// Insert new document
export function insertDocument(data: Omit<DocumentRecord, "id" | "createdDate" | "updatedDate" | "versionHistory">): DocumentRecord {
  const now = new Date().toISOString().split("T")[0];
  const newId = `DOC-${data.type.substring(0, 3).toUpperCase()}-${String(DOCUMENTS_DATABASE.length + 1).padStart(2, "0")}`;

  const initialVersion: DocumentVersionEntry = {
    version: data.version || "v1.0",
    updatedDate: now,
    updatedBy: data.owner,
    summaryOfChanges: "Initial document upload and registration.",
    fileSize: data.fileSize || "3.5 MB",
    sha256Hash: data.sha256Hash || `sha256:${Math.random().toString(36).substring(2, 12)}...`,
    downloadUrl: data.downloadUrl || `/secure-vault/docs/${newId.toLowerCase()}.pdf`,
  };

  const newDoc: DocumentRecord = {
    ...data,
    id: newId,
    createdDate: now,
    updatedDate: now,
    versionHistory: [initialVersion],
  };

  if (newDoc.isTemplate && !newDoc.templateDisclaimer) {
    newDoc.templateDisclaimer = LEGAL_TEMPLATE_DISCLAIMER;
  }

  DOCUMENTS_DATABASE.unshift(newDoc);
  return newDoc;
}

// Commit a new version of a document
export function addDocumentVersion(
  id: string,
  versionNumber: string,
  summaryOfChanges: string,
  updatedBy: string,
  fileSize?: string,
  newHash?: string
): { success: boolean; document?: DocumentRecord; error?: string } {
  const doc = DOCUMENTS_DATABASE.find((d) => d.id === id);
  if (!doc) return { success: false, error: "Document not found" };

  const now = new Date().toISOString().split("T")[0];
  const sha = newHash || `sha256:${Math.random().toString(36).substring(2, 12)}...`;
  const size = fileSize || doc.fileSize;

  const newVersionEntry: DocumentVersionEntry = {
    version: versionNumber,
    updatedDate: now,
    updatedBy,
    summaryOfChanges,
    fileSize: size,
    sha256Hash: sha,
    downloadUrl: `/secure-vault/docs/${doc.id.toLowerCase()}_${versionNumber}.pdf`,
  };

  doc.version = versionNumber;
  doc.updatedDate = now;
  doc.fileSize = size;
  doc.sha256Hash = sha;
  doc.versionHistory.unshift(newVersionEntry);

  return { success: true, document: doc };
}

// Update document metadata or status
export function updateDocument(
  id: string,
  updates: Partial<Omit<DocumentRecord, "id" | "createdDate" | "versionHistory">>
): { success: boolean; document?: DocumentRecord; error?: string } {
  const doc = DOCUMENTS_DATABASE.find((d) => d.id === id);
  if (!doc) return { success: false, error: "Document not found" };

  if (updates.name) doc.name = updates.name;
  if (updates.status) doc.status = updates.status;
  if (updates.owner) doc.owner = updates.owner;
  if (updates.expiryDate) doc.expiryDate = updates.expiryDate;
  if (updates.access) doc.access = updates.access;
  if (updates.description) doc.description = updates.description;
  if (updates.signatories) doc.signatories = updates.signatories;

  doc.updatedDate = new Date().toISOString().split("T")[0];

  return { success: true, document: doc };
}
