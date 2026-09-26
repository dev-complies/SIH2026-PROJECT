import { Pilot, KPI, Payment } from "@/types";

export interface PortfolioAnalytics {
  totalBudgetCommitted: number;
  totalFundsDisbursed: number;
  overallDisbursementRate: number; // percentage
  averagePilotProgress: number;
  kpiAchievementRate: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

/**
 * Calculates aggregate portfolio performance metrics
 */
export function calculatePortfolioAnalytics(
  pilots: Pilot[],
  kpis: KPI[],
  payments: Payment[]
): PortfolioAnalytics {
  const totalBudgetCommitted = pilots.reduce((acc, p) => acc + p.totalBudget, 0);
  const totalFundsDisbursed = payments
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.amount, 0);

  const overallDisbursementRate =
    totalBudgetCommitted > 0 ? (totalFundsDisbursed / totalBudgetCommitted) * 100 : 0;

  const averagePilotProgress =
    pilots.length > 0 ? pilots.reduce((acc, p) => acc + p.overallProgress, 0) / pilots.length : 0;

  const targetMetKPIs = kpis.filter((k) => k.currentValue >= k.targetValue).length;
  const kpiAchievementRate = kpis.length > 0 ? (targetMetKPIs / kpis.length) * 100 : 0;

  const riskDistribution = {
    low: pilots.filter((p) => p.riskLevel === "LOW").length,
    medium: pilots.filter((p) => p.riskLevel === "MEDIUM").length,
    high: pilots.filter((p) => p.riskLevel === "HIGH").length,
    critical: pilots.filter((p) => p.riskLevel === "CRITICAL").length,
  };

  return {
    totalBudgetCommitted,
    totalFundsDisbursed,
    overallDisbursementRate: Math.round(overallDisbursementRate),
    averagePilotProgress: Math.round(averagePilotProgress),
    kpiAchievementRate: Math.round(kpiAchievementRate),
    riskDistribution,
  };
}
