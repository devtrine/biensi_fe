import { useQuery } from "@tanstack/react-query"
import * as dashboardService from "../services/dashboard.service"
import * as orgService from "../services/organization.service"

export function useDashboardSummary(
  year: string = "2026",
  scope: string = "Corporate",
  month?: string
) {
  const normScope = scope === "hq" ? "HQ" : scope === "store" ? "Store" : "Corporate"
  return useQuery({
    queryKey: ["dashboardSummary", year, normScope, month],
    queryFn: () => dashboardService.getDashboardSummary(year, normScope, month),
    staleTime: 1000 * 60,
  })
}

export function useReportingPeriods() {
  return useQuery({
    queryKey: ["reportingPeriods"],
    queryFn: dashboardService.getReportingPeriods,
    staleTime: 1000 * 60 * 5,
  })
}

export function useDivisions(search?: string) {
  return useQuery({
    queryKey: ["divisions", search],
    queryFn: () => orgService.getDivisions(search),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDepartments(search?: string) {
  return useQuery({
    queryKey: ["departments", search],
    queryFn: () => orgService.getDepartments(search),
    staleTime: 1000 * 60 * 5,
  })
}

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: orgService.getStores,
    staleTime: 1000 * 60 * 5,
  })
}
