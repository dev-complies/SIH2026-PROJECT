import { z } from "zod";

// 1. Authentication
export const loginSchema = z.object({
  email: z.string().email("A valid official email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerStartupSchema = z.object({
  legalName: z.string().min(2, "Company legal name is required"),
  tradeName: z.string().optional(),
  registrationNumber: z.string().min(3, "Valid registration number (CIN/LLPIN) is required"),
  incorporationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  dpiitRecognitionNumber: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  industry: z.string().min(2, "Industry is required"),
  technologyStack: z.array(z.string()).min(1, "Select at least one core technology"),
  email: z.string().email("A valid official email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

// 2. Challenge Creation Wizard
export const challengeRubricItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Criterion name is required"),
  weight: z.number().min(1).max(100),
  description: z.string().optional(),
});

export const challengeFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  departmentId: z.string().uuid("Select an authorized department"),
  problemStatement: z.string().min(50, "Detailed problem statement is required (min 50 chars)"),
  desiredOutcome: z.string().min(30, "Quantifiable desired outcome is required"),
  technicalRequirements: z.string().min(30, "Technical requirements are required"),
  pilotDesign: z.string().min(30, "Pilot site and constraints specification is required"),
  industryCategory: z.string().min(2, "Industry category is required"),
  targetState: z.string().min(2, "Target State is required"),
  targetDistrict: z.string().optional(),
  totalBudget: z.number().positive("Total budget must be greater than zero"),
  pilotDurationDays: z.number().int().min(14, "Pilot duration must be at least 14 days"),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  evaluationDeadline: z.string().min(1, "Evaluation deadline is required"),
  blindEvaluation: z.boolean().default(true),
  evaluationRubric: z.array(challengeRubricItemSchema).refine(
    (items) => items.reduce((sum, item) => sum + item.weight, 0) === 100,
    { message: "Total rubric weights must sum to exactly 100%" }
  ),
  eligibilityCriteria: z.array(z.string()).default([]),
  complianceChecklist: z.array(z.string()).default([]),
});

// 3. Application Submission
export const applicationFormSchema = z.object({
  challengeId: z.string().uuid(),
  solutionTitle: z.string().min(5, "Solution title is required"),
  executiveSummary: z.string().min(50, "Executive summary must be at least 50 characters"),
  technicalApproach: z.string().min(50, "Technical approach details required"),
  implementationPlan: z.string().min(50, "Implementation plan details required"),
  proposedCost: z.number().positive("Proposed cost must be positive"),
  pilotDurationWeeks: z.number().int().min(2, "Pilot duration in weeks required"),
  teamOverview: z.array(
    z.object({
      name: z.string().min(1, "Member name required"),
      role: z.string().min(1, "Member role required"),
      experienceYears: z.number().min(0),
    })
  ).min(1, "Provide at least one team member"),
  pastExperience: z.array(
    z.object({
      client: z.string().min(1, "Client/Entity name required"),
      project: z.string().min(1, "Project description required"),
      year: z.number().int().min(2000),
    })
  ).default([]),
  riskMitigationPlan: z.string().optional(),
  complianceAcknowledged: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge compliance with government procurement terms",
  }),
});

// 4. Eligibility Screening
export const eligibilityReviewSchema = z.object({
  applicationId: z.string().uuid(),
  decision: z.enum(["ELIGIBLE", "CONDITIONALLY_ELIGIBLE", "INELIGIBLE", "CLARIFICATION_REQUIRED"]),
  reason: z.string().min(10, "Formal justification reason is required"),
  clarificationNotes: z.string().optional(),
  conditionsPrecedent: z.string().optional(),
  checklistResults: z.record(z.boolean()),
});

// 5. Expert Evaluation & Scoring
export const conflictOfInterestSchema = z.object({
  assignmentId: z.string().uuid(),
  hasConflictOfInterest: z.boolean(),
  coiNotes: z.string().optional(),
});

export const evaluationSubmissionSchema = z.object({
  assignmentId: z.string().uuid(),
  scores: z.array(
    z.object({
      criterionId: z.string(),
      criterionName: z.string(),
      rawScore: z.number().min(0).max(100),
      weight: z.number().min(1).max(100),
      justification: z.string().min(5, "Criterion justification is required"),
    })
  ).min(1, "At least one criterion score is required"),
  technicalComments: z.string().min(20, "Comprehensive evaluation remarks required"),
});

// 6. Milestone & Evidence
export const milestoneSubmissionSchema = z.object({
  milestoneId: z.string().uuid(),
  submissionNotes: z.string().min(10, "Deliverable submission summary required"),
  completedChecklistIndices: z.array(z.number()),
});

export const milestoneReviewSchema = z.object({
  milestoneId: z.string().uuid(),
  action: z.enum(["APPROVE", "REJECT"]),
  reviewNotes: z.string().min(10, "Review audit notes required"),
});

// 7. KPI Ingestion
export const kpiMeasurementSchema = z.object({
  kpiId: z.string().uuid(),
  measuredAt: z.string().min(1, "Timestamp required"),
  value: z.number(),
  dataSourceReference: z.string().optional(),
  rawPayload: z.record(z.unknown()).optional(),
  notes: z.string().optional(),
});

// 8. Risks & Issues
export const riskSchema = z.object({
  pilotId: z.string().uuid(),
  category: z.enum([
    "TECHNICAL",
    "FINANCIAL",
    "OPERATIONAL",
    "LEGAL",
    "CYBERSECURITY",
    "DATA",
    "PROCUREMENT",
    "TIMELINE",
  ]),
  title: z.string().min(5, "Risk title is required"),
  description: z.string().min(10, "Risk description is required"),
  probability: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  mitigationStrategy: z.string().min(10, "Mitigation plan is required"),
});

export const issueSchema = z.object({
  pilotId: z.string().uuid(),
  title: z.string().min(5, "Issue title is required"),
  description: z.string().min(10, "Issue description is required"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  deadline: z.string().optional(),
});

// 9. Independent Validation
export const validationReportSchema = z.object({
  pilotId: z.string().uuid(),
  methodologyOverview: z.string().min(30, "Audit methodology overview required"),
  outcome: z.enum(["VALIDATED", "PARTIALLY_VALIDATED", "NOT_VALIDATED"]),
  verifiedStrengths: z.string().min(20, "Verified technical strengths required"),
  limitationsRecorded: z.string().min(20, "Documented limitations required"),
  recommendations: z.string().optional(),
  kpiAuditSummary: z.array(
    z.object({
      kpiId: z.string(),
      metricName: z.string(),
      verifiedBaseline: z.number(),
      verifiedOutcome: z.number(),
      targetMet: z.boolean(),
    })
  ),
});

// 10. Scale-Up Decision
export const scaleUpDecisionSchema = z.object({
  pilotId: z.string().uuid(),
  decision: z.enum(["SCALE", "EXTEND_PILOT", "MODIFY_AND_RETEST", "CLOSE"]),
  justification: z.string().min(30, "Procurement justification required"),
  procurementRecommendation: z.string().optional(),
  approvedScaleBudget: z.number().optional(),
  targetGeographies: z.array(z.string()).default([]),
});
