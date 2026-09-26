/**
 * GovInnovate Core Domain Type Definitions
 * Maps 1:1 with PostgreSQL Schema Specification (docs/database-schema.md)
 */

// 1. Roles & Authorization
export type UserRole =
  | 'ADMIN'
  | 'PLATFORM_ADMIN'
  | 'GOVERNMENT_OFFICER'
  | 'PROCUREMENT_OFFICER'
  | 'STARTUP'
  | 'EXPERT'
  | 'EXPERT_EVALUATOR'
  | 'VALIDATOR'
  | 'INDEPENDENT_VALIDATOR';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  departmentId?: string;
  organizationId?: string;
  designation?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  ministry: string;
  state: string;
  district?: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  legalName: string;
  tradeName?: string;
  registrationNumber: string;
  incorporationDate: string;
  dpiitRecognitionNumber?: string;
  websiteUrl?: string;
  industry: string;
  technologyStack: string[];
  teamSize: number;
  profileCompleteness: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}

// 2. Challenge Lifecycle
export type ChallengeStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'PUBLISHED'
  | 'APPLICATIONS_CLOSED'
  | 'UNDER_EVALUATION'
  | 'SHORTLISTED'
  | 'PILOT_ACTIVE'
  | 'COMPLETED'
  | 'ARCHIVED';

export interface EvaluationCriterion {
  id: string;
  name: string;
  weight: number; // percentage
  description?: string;
}

export interface Challenge {
  id: string;
  departmentId: string;
  createdBy: string;
  title: string;
  code: string;
  problemStatement: string;
  desiredOutcome: string;
  technicalRequirements: string;
  pilotDesign: string;
  industryCategory: string;
  targetState: string;
  targetDistrict?: string;
  totalBudget: number;
  pilotDurationDays: number;
  applicationDeadline: string;
  evaluationDeadline: string;
  pilotStartExpected?: string;
  blindEvaluation: boolean;
  status: ChallengeStatus;
  evaluationRubric: EvaluationCriterion[];
  eligibilityCriteria: string[];
  complianceChecklist: string[];
  aiEnhanced: boolean;
  aiDisclaimer: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
}

// 3. Application & Eligibility Lifecycle
export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_ELIGIBILITY'
  | 'ELIGIBLE'
  | 'CONDITIONALLY_ELIGIBLE'
  | 'INELIGIBLE'
  | 'UNDER_EVALUATION'
  | 'SHORTLISTED'
  | 'NOT_SELECTED'
  | 'PILOT_AWARDED'
  | 'WITHDRAWN';

export type EligibilityDecision =
  | 'ELIGIBLE'
  | 'CONDITIONALLY_ELIGIBLE'
  | 'INELIGIBLE'
  | 'CLARIFICATION_REQUIRED';

export interface Application {
  id: string;
  challengeId: string;
  organizationId: string;
  submittedBy: string;
  applicationNumber: string;
  solutionTitle: string;
  executiveSummary: string;
  technicalApproach: string;
  implementationPlan: string;
  proposedCost: number;
  pilotDurationWeeks: number;
  teamOverview: Array<{ name: string; role: string; experienceYears: number }>;
  pastExperience: Array<{ client: string; project: string; year: number }>;
  riskMitigationPlan?: string;
  complianceAcknowledged: boolean;
  status: ApplicationStatus;
  submittedAt?: string;
  withdrawnAt?: string;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  challenge?: Challenge;
}

export interface EligibilityReview {
  id: string;
  applicationId: string;
  reviewedBy: string;
  decision: EligibilityDecision;
  reason: string;
  clarificationNotes?: string;
  conditionsPrecedent?: string;
  checklistResults: Record<string, boolean>;
  reviewedAt: string;
  createdAt: string;
}

// 4. Expert Evaluation
export interface EvaluationAssignment {
  id: string;
  challengeId: string;
  applicationId: string;
  expertId: string;
  hasConflictOfInterest: boolean;
  coiDeclaredAt?: string;
  coiNotes?: string;
  isCompleted: boolean;
  totalWeightedScore?: number;
  technicalComments?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  expert?: User;
}

export interface EvaluationScore {
  id: string;
  assignmentId: string;
  criterionId: string;
  criterionName: string;
  rawScore: number; // 0 - 100
  weight: number;
  weightedScore: number;
  justification?: string;
  createdAt: string;
}

// 5. Pilots & Execution
export type PilotStatus =
  | 'CONTRACTING'
  | 'ACTIVE'
  | 'PAUSED'
  | 'UNDER_VALIDATION'
  | 'COMPLETED'
  | 'TERMINATED'
  | 'SCALE_PENDING'
  | 'SCALED'
  | 'CLOSED';

export interface Pilot {
  id: string;
  challengeId: string;
  applicationId: string;
  organizationId: string;
  departmentId: string;
  pilotCode: string;
  title: string;
  scopeDescription: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  elevationMeters?: number;
  meshNodeId?: string;
  totalBudget: number;
  disbursedAmount: number;
  startDate: string;
  endDate: string;
  overallProgress: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: PilotStatus;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  department?: Department;
  challenge?: Challenge;
}

// 6. Milestones & KPIs
export type MilestoneStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'OVERDUE';

export interface PilotMilestone {
  id: string;
  pilotId: string;
  milestoneNumber: number;
  name: string;
  description: string;
  deadline: string;
  deliverablesChecklist: Array<{ item: string; completed: boolean }>;
  allocatedPayment: number;
  status: MilestoneStatus;
  submittedAt?: string;
  submissionNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KPI {
  id: string;
  pilotId: string;
  name: string;
  metricCode: string;
  description?: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  measurementFrequency: string;
  dataSource: string;
  isCritical: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KPIMeasurement {
  id: string;
  kpiId: string;
  measuredAt: string;
  value: number;
  recordedBy?: string;
  dataSourceReference?: string;
  rawPayload?: Record<string, unknown>;
  notes?: string;
  createdAt?: string;
}

// 7. Evidence
export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CLARIFICATION_REQUESTED';

export interface EvidenceRecord {
  id: string;
  pilotId: string;
  milestoneId?: string;
  kpiId?: string;
  uploadedBy: string;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  validatorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// 8. Risks & Issues
export type RiskCategory =
  | 'TECHNICAL'
  | 'FINANCIAL'
  | 'OPERATIONAL'
  | 'LEGAL'
  | 'CYBERSECURITY'
  | 'DATA'
  | 'PROCUREMENT'
  | 'TIMELINE';

export type RiskStatus = 'IDENTIFIED' | 'MITIGATING' | 'CONTROLLED' | 'CLOSED';

export interface Risk {
  id: string;
  pilotId: string;
  category: RiskCategory;
  title: string;
  description: string;
  probability: number; // 1 - 5
  impact: number; // 1 - 5
  riskScore: number; // probability * impact (1 - 25)
  ownerId?: string;
  mitigationStrategy: string;
  contingencyPlan?: string;
  status: RiskStatus;
  createdAt: string;
  updatedAt: string;
}

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'RESOLVED' | 'CLOSED';

export interface Issue {
  id: string;
  pilotId: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  ownerId?: string;
  reportedBy: string;
  deadline?: string;
  status: IssueStatus;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 9. Document & Data/IP Governance
export type DocumentCategory =
  | 'PILOT_AGREEMENT'
  | 'NDA'
  | 'DATA_AGREEMENT'
  | 'IP_AGREEMENT'
  | 'SECURITY_CHECKLIST'
  | 'EVALUATION_REPORT'
  | 'VALIDATION_REPORT'
  | 'PROCUREMENT_DOCUMENT'
  | 'OTHER';

export interface Document {
  id: string;
  pilotId: string;
  category: DocumentCategory;
  title: string;
  documentNumber?: string;
  version: number;
  filePath: string;
  mimeType: string;
  sha256Hash: string;
  ownerId: string;
  expiryDate?: string;
  isSigned: boolean;
  signatures: Array<{ signerId: string; signedAt: string; signatureHash: string }>;
  dataClassification: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataIPGovernance {
  id: string;
  pilotId: string;
  dataOwner: string;
  dataProcessor: string;
  dataAccessPolicy: string;
  retentionPeriodMonths: number;
  dataUsageRestrictions: string;
  ipOwnershipTerms: string;
  licensingTerms: string;
  isTemplateStandard: boolean;
  legalDisclaimer: string;
  createdAt: string;
  updatedAt: string;
}

// 10. Milestone Payments
export type PaymentStatus =
  | 'NOT_DUE'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED';

export interface Payment {
  id: string;
  milestoneId: string;
  pilotId: string;
  amount: number;
  status: PaymentStatus;
  paymentReference?: string;
  invoiceNumber?: string;
  requestedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  disbursedAt?: string;
  mockTransactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 11. Independent Validation
export type ValidationOutcome =
  | 'VALIDATED'
  | 'PARTIALLY_VALIDATED'
  | 'NOT_VALIDATED';

export interface ValidationReport {
  id: string;
  pilotId: string;
  validatorId: string;
  methodologyOverview: string;
  evidenceReviewedCount: number;
  kpiAuditSummary: Array<{
    kpiId: string;
    metricName: string;
    verifiedBaseline: number;
    verifiedOutcome: number;
    targetMet: boolean;
  }>;
  outcome: ValidationOutcome;
  verifiedStrengths: string;
  limitationsRecorded: string;
  recommendations?: string;
  formalReportDocumentId?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 12. Scale-Up & Proven Solutions
export type ScaleUpOutcome =
  | 'SCALE'
  | 'EXTEND_PILOT'
  | 'MODIFY_AND_RETEST'
  | 'CLOSE';

export interface ScaleUpDecision {
  id: string;
  pilotId: string;
  decision: ScaleUpOutcome;
  justification: string;
  procurementRecommendation?: string;
  approvedScaleBudget?: number;
  targetGeographies: string[];
  decisionCommittee: Array<{ name: string; title: string; vote: string }>;
  decidedBy: string;
  decidedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProvenSolution {
  id: string;
  pilotId: string;
  organizationId: string;
  title: string;
  problemAddressed: string;
  technologyStack: string[];
  testedLocation: string;
  pilotDurationDays: number;
  totalPilotCost: number;
  validatedKPIs: Array<{
    name: string;
    baseline: number;
    achieved: number;
    unit: string;
  }>;
  applicableDepartmentTypes: string[];
  replicationGuidelines: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// 13. Notifications & Tamper-Evident Audit Logs
export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userRole?: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  tamperHash: string; // SHA-256
  createdAt: string;
}

// Standard API Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}
