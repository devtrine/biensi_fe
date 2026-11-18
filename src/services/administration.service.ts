import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"
import type {
  AdminUser,
  CreateUserPayload,
  RoleItem,
  RolePermissions,
  UpdateUserPayload,
} from "../types/administration"

export async function getUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<ApiResponse<AdminUser[]>>("/administration/users")
  return data.data || []
}

export async function createUser(payload: CreateUserPayload): Promise<AdminUser> {
  const { data } = await api.post<ApiResponse<AdminUser>>("/administration/users", payload)
  return data.data
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<AdminUser> {
  const { data } = await api.put<ApiResponse<AdminUser>>(`/administration/users/${id}`, payload)
  return data.data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/administration/users/${id}`)
}

export async function getRoles(): Promise<RoleItem[]> {
  const { data } = await api.get<ApiResponse<RoleItem[]>>("/administration/roles")
  return data.data || []
}

export async function updateRolePermissions(
  roleId: number,
  permissions: RolePermissions
): Promise<RoleItem> {
  const { data } = await api.put<ApiResponse<RoleItem>>(
    `/administration/roles/${roleId}/permissions`,
    { permissions }
  )
  return data.data
}
