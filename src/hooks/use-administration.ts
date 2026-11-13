import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as administrationService from "../services/administration.service"
import type {
  CreateUserPayload,
  RolePermissions,
  UpdateUserPayload,
} from "../types/administration"

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ["administration", "users"],
    queryFn: administrationService.getUsers,
    enabled,
  })
}

export function useRoles(enabled = true) {
  return useQuery({
    queryKey: ["administration", "roles"],
    queryFn: administrationService.getRoles,
    enabled,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => administrationService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "users"] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      administrationService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "users"] })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => administrationService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "users"] })
    },
  })
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: number; permissions: RolePermissions }) =>
      administrationService.updateRolePermissions(roleId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "roles"] })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}
