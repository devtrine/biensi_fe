export interface Demographics {
  totalHeadcount: number
  hqHeadcount: number
  storeHeadcount: number
  avgAgeAtPeriod: number
  avgTenureYears: number
  leaderToStaffRatio: string
  distribution: {
    byDivision?: Record<string, number>
    byDepartment?: Record<string, number>
    byGender?: Record<string, number>
    byEmploymentType?: Record<string, number>
    byEmployeeLevel?: Record<string, number>
    byAgeBracket?: Record<string, number>
    byTenureBracket?: Record<string, number>
  }
}

export interface Productivity {
  totalBudgetCost: number
  totalActualCost: number
  totalSales: number
  labourCostRatio: string
  revenuePerFte: string | number
  payrollMultiplier: number
  avgEmploymentCost: number
  salesPerFte?: number
  salesMultiplier?: number
  payrollToSalesRatio?: number
  costByDivision?: any[]
  costByDepartment?: any[]
  costByEmploymentType?: any[]
}

export interface ScopeGroup {
  headcount: number
  avgAge: number
  avgTenure: number
  leaderToStaffRatio: string
  byGender?: {
    LAKI_LAKI?: number
    PEREMPUAN?: number
    [key: string]: number | undefined
  }
  byAgeBracket?: {
    under21?: number
    age21To25?: number
    age26To30?: number
    age31To40?: number
    over40?: number
  }
  byTenureBracket?: {
    under1Year?: number
    tenure1To3Years?: number
    tenure3To5Years?: number
    over5Years?: number
  }
  byLevelStandard?: {
    bodPlus?: number
    manager?: number
    associateManager?: number
    lead?: number
    associateLead?: number
    teamLeader?: number
    staffCrew?: number
  }
  byEmploymentStandard?: {
    pkwtt?: number
    pkwt?: number
    partTime?: number
    internship?: number
  }
  productivity?: {
    budgetCost: number
    actualCost: number
    labourCostRatio: string
    revenuePerFte: number
    payrollMultiplier: number
    avgEmploymentCost: number
  }
}

export interface ScopeBreakdown {
  corporate: ScopeGroup
  hq: ScopeGroup
  store: ScopeGroup
}

export interface TurnoverOverview {
  kpi: {
    monthlyTurnover: number
    ytdTurnover: number
    voluntaryCount: number
    involuntaryCount: number
    turnoverRate: string
  }
  trend: {
    monthly: Array<{ month: string; voluntary: number; nonVoluntary: number }>
  }
}

export interface IndustrialAndSp {
  totalSpIssued: number
  storeSp: {
    total: number
    tataTertib: number
    nonTataTertib: number
    sp1?: number
    sp2?: number
    sp3?: number
  }
  hqSp: {
    total: number
    tataTertib: number
    nonTataTertib: number
  }
  disputes: {
    corporate: { total: number; selesai: number; bipartit: number; mediasi: number }
    hq: { total: number; selesai: number; bipartit: number; mediasi: number }
    store: { total: number; selesai: number; bipartit: number; mediasi: number }
  }
}

export interface DashboardSummary {
  period?: {
    id: string
    year: number
    month: number
  }
  demographics?: Demographics
  productivity?: Productivity
  scopeBreakdown?: ScopeBreakdown
  turnoverAndRetention?: {
    overview?: TurnoverOverview
    contractWatch?: any
  }
  industrialAndSp?: IndustrialAndSp
}

export interface MainDashboardResponse {
  filters?: {
    year: number
    month: number
    scope: string
  }
  summary: DashboardSummary
  storePerformance?: any
  turnoverAndRetention?: any
  industrialAndSp?: IndustrialAndSp
}
