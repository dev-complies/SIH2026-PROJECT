import {
  Challenge,
  Application,
  Pilot,
  PilotMilestone,
  KPI,
  KPIMeasurement,
  EvidenceRecord,
  Payment,
  ValidationReport,
  ScaleUpDecision,
  ProvenSolution,
  AuditLog,
} from "@/types";
import {
  MOCK_CHALLENGES,
  MOCK_APPLICATIONS,
  MOCK_PILOTS,
  MOCK_PILOT_MILESTONES,
  MOCK_KPIS,
  MOCK_KPI_MEASUREMENTS,
  MOCK_EVIDENCE,
  MOCK_PAYMENTS,
  MOCK_VALIDATION_REPORT,
  MOCK_SCALE_UP_DECISION,
  MOCK_PROVEN_SOLUTIONS,
  MOCK_AUDIT_LOGS,
} from "@/database/mockData";

export const challengeService = {
  async getChallenges(): Promise<Challenge[]> {
    return MOCK_CHALLENGES;
  },
  async getChallengeById(id: string): Promise<Challenge | undefined> {
    return MOCK_CHALLENGES.find((c) => c.id === id || c.code === id);
  },
};

export const applicationService = {
  async getApplications(challengeId?: string): Promise<Application[]> {
    if (challengeId) {
      return MOCK_APPLICATIONS.filter((a) => a.challengeId === challengeId);
    }
    return MOCK_APPLICATIONS;
  },
  async getApplicationById(id: string): Promise<Application | undefined> {
    return MOCK_APPLICATIONS.find((a) => a.id === id);
  },
};

export const pilotService = {
  async getPilots(): Promise<Pilot[]> {
    return MOCK_PILOTS;
  },
  async getPilotById(id: string): Promise<Pilot | undefined> {
    return MOCK_PILOTS.find((p) => p.id === id || p.pilotCode === id);
  },
};

export const milestoneService = {
  async getMilestones(pilotId: string): Promise<PilotMilestone[]> {
    return MOCK_PILOT_MILESTONES.filter((m) => m.pilotId === pilotId);
  },
};

export const kpiService = {
  async getKPIs(pilotId: string): Promise<KPI[]> {
    return MOCK_KPIS.filter((k) => k.pilotId === pilotId);
  },
  async getMeasurements(kpiId: string): Promise<KPIMeasurement[]> {
    return MOCK_KPI_MEASUREMENTS.filter((m) => m.kpiId === kpiId);
  },
};

export const evidenceService = {
  async getEvidence(pilotId: string): Promise<EvidenceRecord[]> {
    return MOCK_EVIDENCE.filter((e) => e.pilotId === pilotId);
  },
};

export const paymentService = {
  async getPayments(pilotId?: string): Promise<Payment[]> {
    if (pilotId) {
      return MOCK_PAYMENTS.filter((p) => p.pilotId === pilotId);
    }
    return MOCK_PAYMENTS;
  },
};

export const validationService = {
  async getValidationReport(pilotId: string): Promise<ValidationReport | undefined> {
    if (MOCK_VALIDATION_REPORT.pilotId === pilotId) {
      return MOCK_VALIDATION_REPORT;
    }
    return undefined;
  },
};

export const scaleUpService = {
  async getScaleUpDecision(pilotId: string): Promise<ScaleUpDecision | undefined> {
    if (MOCK_SCALE_UP_DECISION.pilotId === pilotId) {
      return MOCK_SCALE_UP_DECISION;
    }
    return undefined;
  },
};

export const provenSolutionService = {
  async getProvenSolutions(): Promise<ProvenSolution[]> {
    return MOCK_PROVEN_SOLUTIONS;
  },
  async getProvenSolutionById(id: string): Promise<ProvenSolution | undefined> {
    return MOCK_PROVEN_SOLUTIONS.find((s) => s.id === id);
  },
};

export const auditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    return MOCK_AUDIT_LOGS;
  },
};
