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
    byEmployeeLevel?: Record<string, number> | Array<{ level: string; count: number; percentage?: number }>
    byAgeBracket?: Record<string, number>
    byTenureBracket?: Record<string, number>
  }
}

export interface ProductionProductivity {
  productionHeadcount: number
  totalHeadcount: number
  ratioText: string
  ratioDecimal: number
  targetDecimal: number
  isTargetAchieved: boolean
}

export interface Productivity {
  totalBudgetCost: number
  totalActualCost: number
  totalSales: number
  labourCostRatio: string
  revenuePerFte: string | number
  payrollMultiplier: number
  avgEmploymentCost: number
  productionProductivity?: ProductionProductivity
  cmtRatio?: string
  cmtRatioDecimal?: string | number
  cmtTargetAchieved?: boolean
  cmtEfficiency?: number
  cmtFte?: number
  onTimeOutput?: number
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
    "LAKI-LAKI"?: number
    LAKI_LAKI?: number
    PEREMPUAN?: number
    [key: string]: number | undefined
  }
  byAgeBracket?: {
    under21?: number
    age21To25?: number
    age26To30?: number
    age31To40?: number
    age40To50?: number
    age50To60?: number
    over60?: number
    over40?: number
  }
  byTenureBracket?: {
    under1Year?: number
    tenure1To3Years?: number
    tenure3To5Years?: number
    tenure5To7Years?: number
    tenure7To10Years?: number
    over10Years?: number
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

export interface ComplianceScopeSummary {
  total: number
  patuh: number
  akanJatuhTempo: number
  kadaluarsa: number
  wlkp: number
  pp: number
  k3: number
}

export interface ComplianceItem {
  id: string
  storeId: string | null
  isHq: boolean
  area: string
  description: string
  entity: string
  entityName: string
  location: string
  validFrom: string | null
  validUntil: string | null
  pic: string
  remainingDays: number
  notes: string
  status: string
}

export interface CompliancePermits {
  kpi: {
    total: number
    patuh: number
    akanJatuhTempo: number
    kadaluarsa: number
  }
  byType: {
    wlkp: number
    pp: number
    k3: number
    lainnya: number
  }
  byScope: {
    corporate: ComplianceScopeSummary
    hq: ComplianceScopeSummary
    store: ComplianceScopeSummary
  }
  tableData: ComplianceItem[]
}

export interface AttendanceAggregateItem {
  id?: string
  periodId?: string
  scope?: "HQ" | "STORE" | string
  totalEmployees: number
  sickCount: number
  permissionCount: number
  annualLeaveCount: number
  absentCount: number
  workingDays: number
  attendanceRate: number | string
  period?: {
    id: string
    year: number
    month: number
  }
}

export interface IndustrialAndSp {
  totalSpIssued: number
  corporateSp?: {
    total: number
    spAktif: number
    spNonAktif: number
    tataTertib: number
    nonTataTertib: number
  }
  storeSp: {
    total: number
    spAktif?: number
    spNonAktif?: number
    tataTertib: number
    nonTataTertib: number
    sp1?: number
    sp2?: number
    sp3?: number
  }
  hqSp: {
    total: number
    spAktif?: number
    spNonAktif?: number
    tataTertib: number
    nonTataTertib: number
  }
  disputes: {
    corporate: { total: number; selesai: number; bipartit: number; mediasi: number; phi?: number }
    hq: { total: number; selesai: number; bipartit: number; mediasi: number; phi?: number }
    store: { total: number; selesai: number; bipartit: number; mediasi: number; phi?: number }
  }
  overdueContracts?: {
    corporate: number
    hq: number
    store: number
  }
  compliancePermits?: CompliancePermits
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
  attendanceByScope?: {
    hq?: AttendanceAggregateItem | null
    store?: AttendanceAggregateItem | null
  }
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
  compliance?: CompliancePermits
  attendanceHistory?: AttendanceAggregateItem[]
}
