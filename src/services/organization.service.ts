import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"
import type { Department, Division, Store } from "../types/employee"

export async function getDivisions(search?: string): Promise<Division[]> {
  const url = search ? `/divisions?search=${encodeURIComponent(search)}` : "/divisions"
  const { data } = await api.get<ApiResponse<Division[]>>(url)
  return Array.isArray(data?.data) ? data.data : []
}

export async function getDepartments(search?: string): Promise<Department[]> {
  const url = search ? `/departments?search=${encodeURIComponent(search)}` : "/departments"
  const { data } = await api.get<ApiResponse<Department[]>>(url)
  return Array.isArray(data?.data) ? data.data : []
}

export async function getStores(): Promise<Store[]> {
  const { data } = await api.get<ApiResponse<Store[]>>("/stores")
  return Array.isArray(data?.data) ? data.data : []
}
