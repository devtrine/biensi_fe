import type { RolePermissions } from "./administration"

export interface User {
  id: string
  name: string
  email: string
  role?: string
  roleId?: number
  phoneNumber?: string
  photoUrl?: string
  isActive?: boolean
  createdAt?: string
  permissions?: RolePermissions
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phoneNumber?: string
  photoUrl?: string
  role?: string
  roleId?: number
  permissions?: RolePermissions
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
  phoneNumber?: string
  photoUrl?: string
}
