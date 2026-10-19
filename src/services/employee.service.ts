import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"
import type { CreateEmployeePayload, Employee } from "../types/employee"

export async function getEmployees(search?: string): Promise<Employee[]> {
  const url = search ? `/employees?search=${encodeURIComponent(search)}` : "/employees"
  const { data } = await api.get<ApiResponse<Employee[]>>(url)
  return data?.data || []
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const { data } = await api.get<ApiResponse<Employee>>(`/employees/${id}`)
  return data.data
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const { data } = await api.post<ApiResponse<Employee>>("/employees", payload)
  return data.data
}

export async function importEmployees(file: File): Promise<{ message: string; data?: any }> {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post<ApiResponse<any>>("/employees/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return {
    message: data?.message || "Data karyawan berhasil diimport.",
    data: data?.data,
  }
}
