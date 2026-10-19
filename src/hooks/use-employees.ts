import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as employeeService from "../services/employee.service"
import type { CreateEmployeePayload } from "../types/employee"

export function useEmployees(search?: string) {
  return useQuery({
    queryKey: ["employees", search],
    queryFn: () => employeeService.getEmployees(search),
    staleTime: 1000 * 30,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeService.createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] })
    },
  })
}

export function useImportEmployees() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => employeeService.importEmployees(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] })
    },
  })
}
