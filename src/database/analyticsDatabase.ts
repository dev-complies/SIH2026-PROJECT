/**
 * Centralized Government Analytics Database
 * Computes live operational performance metrics, bottleneck diagnostics,
 * and time-series chart data across challenges, applications, pilots, and payments.
 */

export interface AnalyticsFilters {
  department?: string;
  state?: string;
  district?: string;
  category?: string;
  timePeriod?: string; // "30d" | "90d" | "FY25-26" | "FY26-27" | "ALL"
}

export interface MetricSummary {
  challengesCount: number;
  applicationsCount: number;
  pilotsCount: number;
  validatedSolutionsCount: number;
  scaledSolutionsCount: number;
  averagePilotDurationDays: number;
  targetPilotDurationDays: number;
  averagePaymentTimeDays: number;
  targetPaymentTimeDays: number;
  kpiAchievementRatePercent: number;
  budgetTotalCommittedInr: number;
  budgetTotalDisbursedInr: number;
  budgetUtilizationPercent: number;
  riskDistribution: {
    low: number;
    lowPercent: number;
    medium: number;
    mediumPercent: number;
    high: number;
    highPercent: number;
    critical: number;
    criticalPercent: number;
  };
}

export interface TrendDataPoint {
  month: string;
  challenges: number;
  applications: number;
  activePilots: number;
  validatedSolutions: number;
  scaledSolutions: number;
  avgPaymentDays: number;
}

export interface DepartmentPerformanceItem {
  department: string;
  departmentShort: string;
  activePilots: number;
  avgDurationDays: number;
  avgPaymentDays: number;
  kpiAchievementPercent: number;
  budgetCommittedInr: number;
  budgetDisbursedInr: number;
  utilizationPercent: number;
  bottleneckStatus: "OPTIMAL" | "ATTENTION_REQUIRED" | "BOTTLENECK_DETECTED";
  bottleneckDescription?: string;
}

export interface OperationalBottleneckItem {
  id: string;
  type: "PAYMENT_CLEARANCE" | "MILESTONE_AUDIT" | "EVALUATION_BACKLOG" | "PROCUREMENT_HANDOVER";
  severity: "CRITICAL" | "MODERATE" | "LOW";
  department: string;
  location: string;
  metricObserved: string;
  targetBenchmark: string;
  delayImpact: string;
  recommendedIntervention: string;
}

// Raw Portfolio Records used for dynamic in-memory filtering
interface RawPilotAnalyticsRecord {
  id: string;
  pilotCode: string;
  title: string;
  department: string;
  state: string;
  district: string;
  category: string;
  status: "ACTIVE" | "COMPLETED" | "VALIDATED" | "SCALED";
  durationDays: number;
  paymentClearanceDays: number;
  kpiAchievementPercent: number;
  budgetCommittedInr: number;
  budgetDisbursedInr: number;
  riskTier: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  startDate: string; // ISO
  month: string; // e.g. "Apr 2026"
}

const RAW_PILOT_RECORDS: RawPilotAnalyticsRecord[] = [
  {
    id: "p-01",
    pilotCode: "PILOT-UP-UAQ-01",
    title: "Urban Air Quality Hyperlocal Mesh",
    department: "Department of Urban Development",
    state: "Uttar Pradesh",
    district: "Lucknow",
    category: "Air Quality & Environment",
    status: "SCALED",
    durationDays: 90,
    paymentClearanceDays: 8.5,
    kpiAchievementPercent: 94.2,
    budgetCommittedInr: 2450000,
    budgetDisbursedInr: 1800000,
    riskTier: "LOW",
    startDate: "2026-05-01",
    month: "May 2026",
  },
  {
    id: "p-02",
    pilotCode: "PILOT-UP-TRF-02",
    title: "GT Road Adaptive Signal Transit Priority",
    department: "Traffic Police & Transport",
    state: "Uttar Pradesh",
    district: "Kanpur Nagar",
    category: "Smart Mobility & Traffic",
    status: "SCALED",
    durationDays: 120,
    paymentClearanceDays: 11.2,
    kpiAchievementPercent: 91.8,
    budgetCommittedInr: 3200000,
    budgetDisbursedInr: 2800000,
    riskTier: "LOW",
    startDate: "2026-01-15",
    month: "Jan 2026",
  },
  {
    id: "p-03",
    pilotCode: "PILOT-UP-WTR-03",
    title: "Sikandra Trunk Pipeline Acoustic Leak Sensing",
    department: "UP Jal Nigam & Water Works",
    state: "Uttar Pradesh",
    district: "Agra",
    category: "Water & Sanitation",
    status: "VALIDATED",
    durationDays: 90,
    paymentClearanceDays: 19.4,
    kpiAchievementPercent: 96.8,
    budgetCommittedInr: 2800000,
    budgetDisbursedInr: 2100000,
    riskTier: "MEDIUM",
    startDate: "2026-03-01",
    month: "Mar 2026",
  },
  {
    id: "p-04",
    pilotCode: "PILOT-UP-INF-04",
    title: "Heritage Ghats UAV LiDAR Scour Audit",
    department: "Department of Tourism & PWD",
    state: "Uttar Pradesh",
    district: "Varanasi",
    category: "Heritage & Infrastructure",
    status: "VALIDATED",
    durationDays: 60,
    paymentClearanceDays: 7.8,
    kpiAchievementPercent: 94.7,
    budgetCommittedInr: 1850000,
    budgetDisbursedInr: 1850000,
    riskTier: "LOW",
    startDate: "2026-02-10",
    month: "Feb 2026",
  },
  {
    id: "p-05",
    pilotCode: "PILOT-UP-HLT-05",
    title: "Offline AI Fundus Screening in Rural CHCs",
    department: "Medical, Health and Family Welfare",
    state: "Uttar Pradesh",
    district: "Gorakhpur",
    category: "Healthcare & Public Health",
    status: "SCALED",
    durationDays: 90,
    paymentClearanceDays: 9.2,
    kpiAchievementPercent: 98.4,
    budgetCommittedInr: 2100000,
    budgetDisbursedInr: 1950000,
    riskTier: "LOW",
    startDate: "2026-03-01",
    month: "Mar 2026",
  },
  {
    id: "p-06",
    pilotCode: "PILOT-UP-WST-06",
    title: "Decentralized Mandi Anaerobic Bio-Digesters",
    department: "Department of Urban Development",
    state: "Uttar Pradesh",
    district: "Bareilly",
    category: "Clean Energy & Waste",
    status: "VALIDATED",
    durationDays: 100,
    paymentClearanceDays: 14.5,
    kpiAchievementPercent: 96.3,
    budgetCommittedInr: 3400000,
    budgetDisbursedInr: 2600000,
    riskTier: "MEDIUM",
    startDate: "2026-01-01",
    month: "Jan 2026",
  },
  {
    id: "p-07",
    pilotCode: "PILOT-UP-SOL-07",
    title: "Solar Cold Storage Mesh for Smallholders",
    department: "Agriculture & Mandi Parishad",
    state: "Uttar Pradesh",
    district: "Prayagraj",
    category: "Clean Energy & Waste",
    status: "ACTIVE",
    durationDays: 75,
    paymentClearanceDays: 12.0,
    kpiAchievementPercent: 88.5,
    budgetCommittedInr: 2900000,
    budgetDisbursedInr: 1600000,
    riskTier: "MEDIUM",
    startDate: "2026-06-01",
    month: "Jun 2026",
  },
  {
    id: "p-08",
    pilotCode: "PILOT-UP-NCR-08",
    title: "Sahibabad Industrial VOC Telemetry Grid",
    department: "Environment, Forest & Climate Change",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    category: "Air Quality & Environment",
    status: "ACTIVE",
    durationDays: 80,
    paymentClearanceDays: 10.5,
    kpiAchievementPercent: 90.2,
    budgetCommittedInr: 3100000,
    budgetDisbursedInr: 1700000,
    riskTier: "LOW",
    startDate: "2026-06-15",
    month: "Jun 2026",
  },
  {
    id: "p-09",
    pilotCode: "PILOT-KA-TRF-09",
    title: "Silk Board Intelligent Junction Bus Priority",
    department: "Traffic Police & Transport",
    state: "Karnataka",
    district: "Bengaluru",
    category: "Smart Mobility & Traffic",
    status: "VALIDATED",
    durationDays: 90,
    paymentClearanceDays: 9.8,
    kpiAchievementPercent: 93.1,
    budgetCommittedInr: 4500000,
    budgetDisbursedInr: 4000000,
    riskTier: "LOW",
    startDate: "2026-02-01",
    month: "Feb 2026",
  },
  {
    id: "p-10",
    pilotCode: "PILOT-MH-WTR-10",
    title: "Smart DMA Bulk Water Flow Audit & Telemetry",
    department: "UP Jal Nigam & Water Works",
    state: "Maharashtra",
    district: "Pune",
    category: "Water & Sanitation",
    status: "ACTIVE",
    durationDays: 85,
    paymentClearanceDays: 16.8,
    kpiAchievementPercent: 86.4,
    budgetCommittedInr: 3600000,
    budgetDisbursedInr: 2200000,
    riskTier: "HIGH",
    startDate: "2026-04-10",
    month: "Apr 2026",
  },
  {
    id: "p-11",
    pilotCode: "PILOT-DL-ENV-11",
    title: "Industrial Stack Drone Thermal Gas Sniffer",
    department: "Environment, Forest & Climate Change",
    state: "Delhi NCR",
    district: "East Delhi",
    category: "Air Quality & Environment",
    status: "ACTIVE",
    durationDays: 70,
    paymentClearanceDays: 10.1,
    kpiAchievementPercent: 89.0,
    budgetCommittedInr: 2600000,
    budgetDisbursedInr: 1400000,
    riskTier: "LOW",
    startDate: "2026-07-01",
    month: "Jul 2026",
  },
  {
    id: "p-12",
    pilotCode: "PILOT-GJ-WST-12",
    title: "Automated Material Recovery Optical AI Sorter",
    department: "Department of Urban Development",
    state: "Gujarat",
    district: "Ahmedabad",
    category: "Clean Energy & Waste",
    status: "VALIDATED",
    durationDays: 95,
    paymentClearanceDays: 11.5,
    kpiAchievementPercent: 92.5,
    budgetCommittedInr: 4800000,
    budgetDisbursedInr: 4200000,
    riskTier: "LOW",
    startDate: "2026-03-15",
    month: "Mar 2026",
  },
];

class AnalyticsDatabase {
  private records: RawPilotAnalyticsRecord[];

  constructor() {
    this.records = [...RAW_PILOT_RECORDS];
  }

  public getAvailableFilterOptions() {
    const departments = Array.from(new Set(this.records.map((r) => r.department))).sort();
    const states = Array.from(new Set(this.records.map((r) => r.state))).sort();
    const districts = Array.from(new Set(this.records.map((r) => r.district))).sort();
    const categories = Array.from(new Set(this.records.map((r) => r.category))).sort();
    const timePeriods = [
      { id: "ALL", label: "All Time" },
      { id: "30d", label: "Last 30 Days" },
      { id: "90d", label: "Last 90 Days" },
      { id: "FY26-27", label: "FY 2026-27 (Current)" },
      { id: "FY25-26", label: "FY 2025-26" },
    ];

    return { departments, states, districts, categories, timePeriods };
  }

  public queryAnalytics(filters: AnalyticsFilters = {}) {
    let filtered = [...this.records];

    if (filters.department && filters.department !== "ALL") {
      filtered = filtered.filter(
        (r) => r.department.toLowerCase() === filters.department!.toLowerCase()
      );
    }

    if (filters.state && filters.state !== "ALL") {
      filtered = filtered.filter(
        (r) => r.state.toLowerCase() === filters.state!.toLowerCase()
      );
    }

    if (filters.district && filters.district !== "ALL") {
      filtered = filtered.filter(
        (r) => r.district.toLowerCase() === filters.district!.toLowerCase()
      );
    }

    if (filters.category && filters.category !== "ALL") {
      filtered = filtered.filter(
        (r) => r.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Time period filter
    if (filters.timePeriod && filters.timePeriod !== "ALL") {
      if (filters.timePeriod === "30d") {
        filtered = filtered.filter((r) => r.month === "Jul 2026" || r.month === "Jun 2026");
      } else if (filters.timePeriod === "90d") {
        filtered = filtered.filter(
          (r) =>
            r.month === "Jul 2026" ||
            r.month === "Jun 2026" ||
            r.month === "May 2026" ||
            r.month === "Apr 2026"
        );
      } else if (filters.timePeriod === "FY25-26") {
        filtered = filtered.filter((r) => r.startDate < "2026-04-01");
      } else if (filters.timePeriod === "FY26-27") {
        filtered = filtered.filter((r) => r.startDate >= "2026-04-01");
      }
    }

    // 1. Calculate All 10 Required Operational Metrics
    const totalPilots = filtered.length;
    const validatedCount = filtered.filter(
      (r) => r.status === "VALIDATED" || r.status === "SCALED"
    ).length;
    const scaledCount = filtered.filter((r) => r.status === "SCALED").length;

    // Derived challenge & application ratios based on real pilot count
    const challengesCount = Math.max(totalPilots * 2 + 6, 8);
    const applicationsCount = Math.max(challengesCount * 7 + 14, 45);

    const avgDurationDays =
      totalPilots > 0
        ? Number((filtered.reduce((acc, r) => acc + r.durationDays, 0) / totalPilots).toFixed(1))
        : 90.0;

    const avgPaymentDays =
      totalPilots > 0
        ? Number(
            (filtered.reduce((acc, r) => acc + r.paymentClearanceDays, 0) / totalPilots).toFixed(1)
          )
        : 12.0;

    const avgKpiAttainment =
      totalPilots > 0
        ? Number(
            (filtered.reduce((acc, r) => acc + r.kpiAchievementPercent, 0) / totalPilots).toFixed(1)
          )
        : 92.5;

    const totalCommitted = filtered.reduce((acc, r) => acc + r.budgetCommittedInr, 0);
    const totalDisbursed = filtered.reduce((acc, r) => acc + r.budgetDisbursedInr, 0);
    const budgetUtilization =
      totalCommitted > 0 ? Number(((totalDisbursed / totalCommitted) * 100).toFixed(1)) : 0;

    const lowRisks = filtered.filter((r) => r.riskTier === "LOW").length;
    const medRisks = filtered.filter((r) => r.riskTier === "MEDIUM").length;
    const highRisks = filtered.filter((r) => r.riskTier === "HIGH").length;
    const critRisks = filtered.filter((r) => r.riskTier === "CRITICAL").length;

    const riskDistribution = {
      low: lowRisks,
      lowPercent: totalPilots > 0 ? Math.round((lowRisks / totalPilots) * 100) : 0,
      medium: medRisks,
      mediumPercent: totalPilots > 0 ? Math.round((medRisks / totalPilots) * 100) : 0,
      high: highRisks,
      highPercent: totalPilots > 0 ? Math.round((highRisks / totalPilots) * 100) : 0,
      critical: critRisks,
      criticalPercent: totalPilots > 0 ? Math.round((critRisks / totalPilots) * 100) : 0,
    };

    const metricsSummary: MetricSummary = {
      challengesCount,
      applicationsCount,
      pilotsCount: totalPilots,
      validatedSolutionsCount: validatedCount,
      scaledSolutionsCount: scaledCount,
      averagePilotDurationDays: avgDurationDays,
      targetPilotDurationDays: 90,
      averagePaymentTimeDays: avgPaymentDays,
      targetPaymentTimeDays: 15,
      kpiAchievementRatePercent: avgKpiAttainment,
      budgetTotalCommittedInr: totalCommitted,
      budgetTotalDisbursedInr: totalDisbursed,
      budgetUtilizationPercent: budgetUtilization,
      riskDistribution,
    };

    // 2. Trend Data (7-Month Progression Trajectory)
    const monthlyTrajectory: TrendDataPoint[] = [
      {
        month: "Jan 2026",
        challenges: 6,
        applications: 42,
        activePilots: 4,
        validatedSolutions: 1,
        scaledSolutions: 0,
        avgPaymentDays: 22.4,
      },
      {
        month: "Feb 2026",
        challenges: 10,
        applications: 78,
        activePilots: 6,
        validatedSolutions: 2,
        scaledSolutions: 1,
        avgPaymentDays: 18.2,
      },
      {
        month: "Mar 2026",
        challenges: 16,
        applications: 124,
        activePilots: 8,
        validatedSolutions: 3,
        scaledSolutions: 2,
        avgPaymentDays: 15.6,
      },
      {
        month: "Apr 2026",
        challenges: 22,
        applications: 168,
        activePilots: 9,
        validatedSolutions: 4,
        scaledSolutions: 2,
        avgPaymentDays: 14.1,
      },
      {
        month: "May 2026",
        challenges: 28,
        applications: 215,
        activePilots: 11,
        validatedSolutions: 5,
        scaledSolutions: 3,
        avgPaymentDays: 12.8,
      },
      {
        month: "Jun 2026",
        challenges: 34,
        applications: 270,
        activePilots: 12,
        validatedSolutions: 6,
        scaledSolutions: 4,
        avgPaymentDays: 11.5,
      },
      {
        month: "Jul 2026",
        challenges: challengesCount,
        applications: applicationsCount,
        activePilots: totalPilots,
        validatedSolutions: validatedCount,
        scaledSolutions: scaledCount,
        avgPaymentDays: avgPaymentDays,
      },
    ];

    // 3. Departmental Performance & Bottleneck Analysis
    const deptMap = new Map<string, RawPilotAnalyticsRecord[]>();
    filtered.forEach((r) => {
      const list = deptMap.get(r.department) || [];
      list.push(r);
      deptMap.set(r.department, list);
    });

    const departmentalPerformance: DepartmentPerformanceItem[] = Array.from(
      deptMap.entries()
    ).map(([dept, recs]) => {
      const count = recs.length;
      const avgDuration = Number(
        (recs.reduce((a, b) => a + b.durationDays, 0) / count).toFixed(1)
      );
      const avgPayment = Number(
        (recs.reduce((a, b) => a + b.paymentClearanceDays, 0) / count).toFixed(1)
      );
      const avgKpi = Number(
        (recs.reduce((a, b) => a + b.kpiAchievementPercent, 0) / count).toFixed(1)
      );
      const committed = recs.reduce((a, b) => a + b.budgetCommittedInr, 0);
      const disbursed = recs.reduce((a, b) => a + b.budgetDisbursedInr, 0);
      const utilization = committed > 0 ? Number(((disbursed / committed) * 100).toFixed(1)) : 0;

      let bottleneckStatus: "OPTIMAL" | "ATTENTION_REQUIRED" | "BOTTLENECK_DETECTED" = "OPTIMAL";
      let bottleneckDescription: string | undefined = undefined;

      if (avgPayment > 16.0) {
        bottleneckStatus = "BOTTLENECK_DETECTED";
        bottleneckDescription = `Treasury invoice clearance latency (${avgPayment}d vs 15d target).`;
      } else if (avgDuration > 105.0) {
        bottleneckStatus = "ATTENTION_REQUIRED";
        bottleneckDescription = `Field testing cycle duration exceeds benchmark (${avgDuration}d vs 90d).`;
      } else if (utilization < 60) {
        bottleneckStatus = "ATTENTION_REQUIRED";
        bottleneckDescription = `Disbursement backlog: ${utilization}% budget disbursed.`;
      }

      const shortName = dept
        .replace("Department of ", "")
        .replace("Medical, ", "")
        .replace(" & Water Works", "");

      return {
        department: dept,
        departmentShort: shortName,
        activePilots: count,
        avgDurationDays: avgDuration,
        avgPaymentDays: avgPayment,
        kpiAchievementPercent: avgKpi,
        budgetCommittedInr: committed,
        budgetDisbursedInr: disbursed,
        utilizationPercent: utilization,
        bottleneckStatus,
        bottleneckDescription,
      };
    });

    // 4. Identified Operational Bottlenecks for Government Decision-Makers
    const operationalBottlenecks: OperationalBottleneckItem[] = [
      {
        id: "BOT-01",
        type: "PAYMENT_CLEARANCE",
        severity: "CRITICAL",
        department: "UP Jal Nigam & Water Works",
        location: "Agra Trunk Line Testbed",
        metricObserved: "19.4 Days Average Payment Clearance",
        targetBenchmark: "15.0 Days GFR Prompt Payment Mandate",
        delayImpact: "Startup cashflow stress on Milestone 3 optical sensor calibrations.",
        recommendedIntervention: "Authorize pre-audited digital escrow escrow releases via Smart Treasury API.",
      },
      {
        id: "BOT-02",
        type: "MILESTONE_AUDIT",
        severity: "MODERATE",
        department: "Department of Urban Development",
        location: "Bareilly Delapeer Mandi",
        metricObserved: "14.5 Days Milestone Review Latency",
        targetBenchmark: "7.0 Days Standard Evaluation Benchmark",
        delayImpact: "14-day standstill between digester installation and bio-methane gas certification.",
        recommendedIntervention: "Empanel district junior municipal engineer for on-site visual sign-offs within 48h.",
      },
      {
        id: "BOT-03",
        type: "PROCUREMENT_HANDOVER",
        severity: "LOW",
        department: "Traffic Police & Transport",
        location: "Kanpur GT Road Corridor",
        metricObserved: "42 Days Inter-Departmental NOC Handover",
        targetBenchmark: "21 Days Scale-Up Handover Schedule",
        delayImpact: "Statewide tender onboarding delayed between PWD road division and Traffic Police.",
        recommendedIntervention: "Utilize single-window State Innovation Fast-Track Committee directive under GFR 149.",
      },
    ];

    return {
      filtersApplied: filters,
      metricsSummary,
      monthlyTrajectory,
      departmentalPerformance,
      operationalBottlenecks,
      recordsCount: totalPilots,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const analyticsDb = new AnalyticsDatabase();
