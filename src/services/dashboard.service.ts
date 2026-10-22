import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"
import type { MainDashboardResponse } from "../types/dashboard"

export interface ReportingPeriodItem {
  id: string
  year: number
  month: number
  periodStart: string
  periodEnd: string
}

export async function getDashboardSummary(
  year: string = "2026",
  scope: string = "Corporate",
  month?: string
): Promise<MainDashboardResponse | null> {
  try {
    const params = new URLSearchParams()
    if (year) params.append("year", year)
    if (scope) params.append("scope", scope)

    const effectiveMonth = month || (year === "2026" ? "7" : undefined)
    if (effectiveMonth) params.append("month", effectiveMonth)

    const { data } = await api.get<ApiResponse<MainDashboardResponse>>(
      `/dashboard/summary?${params.toString()}`
    )
    return data?.data || null
  } catch {
    return null
  }
}

export async function getReportingPeriods(): Promise<ReportingPeriodItem[]> {
  try {
    const { data } = await api.get<ApiResponse<ReportingPeriodItem[]>>("/reporting-monthly")
    return Array.isArray(data?.data) ? data.data : []
  } catch {
    return []
  }
}
