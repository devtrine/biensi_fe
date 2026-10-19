import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"
import type { MainDashboardResponse } from "../types/dashboard"

export async function getDashboardSummary(
  year: string = "2026",
  scope: string = "Corporate",
  month?: string
): Promise<MainDashboardResponse | null> {
  const params = new URLSearchParams()
  if (year) params.append("year", year)
  if (scope) params.append("scope", scope)
  if (month) params.append("month", month)

  const { data } = await api.get<ApiResponse<MainDashboardResponse>>(
    `/dashboard/summary?${params.toString()}`
  )
  return data?.data || null
}
