import { useQuery } from "@tanstack/react-query"
import * as dashboardService from "../services/dashboard.service"
import * as orgService from "../services/organization.service"

export function useDashboardSummary(
  year: string = String(new Date().getFullYear()),
  scope: string = "Corporate",
  month?: string,
  spYear?: string
) {
  const normScope = scope === "hq" ? "HQ" : scope === "store" ? "Store" : "Corporate"
  return useQuery({
    queryKey: ["dashboardSummary", year, normScope, month, spYear],
    queryFn: () => dashboardService.getDashboardSummary(year, normScope, month, spYear),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  })
}

export function useReportingPeriods() {
  return useQuery({
    queryKey: ["reportingPeriods"],
    queryFn: dashboardService.getReportingPeriods,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export function useDivisions(search?: string) {
  return useQuery({
    queryKey: ["divisions", search],
    queryFn: () => orgService.getDivisions(search),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export function useDepartments(search?: string) {
  return useQuery({
    queryKey: ["departments", search],
    queryFn: () => orgService.getDepartments(search),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: orgService.getStores,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
