export type PermissionAction = "view" | "create" | "edit" | "delete" | "export"

export interface ModulePermission {
  label?: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  export: boolean
}

export interface RolePermissions {
  description?: string
  accessLevel?: string
  modules?: Record<string, ModulePermission>
}

export interface RoleItem {
  id: number
  name: string
  permissions: RolePermissions
  createdAt?: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  phoneNumber?: string
  roleId: number | null
  role: string
  accessLevel?: string
  isActive: boolean
  status: string
  lastLogin?: string | null
  createdAt?: string
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  roleId: number
  phoneNumber?: string
  isActive?: boolean
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
  roleId?: number
  phoneNumber?: string
  isActive?: boolean
}
