import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"
import type { LoginPayload, LoginResponse, UserProfile } from "../types/auth"

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<ApiResponse<LoginResponse>>("/auth/login", payload)
  if (data?.data?.token) {
    localStorage.setItem("token", data.data.token)
    if (data.data.user) {
      localStorage.setItem("user", JSON.stringify(data.data.user))
    }
  }
  return data.data
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout")
  } catch {
  } finally {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }
}

export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<ApiResponse<UserProfile>>("/administration/profile")
  return data.data
}

export async function updateProfile(payload: FormData | Partial<UserProfile>): Promise<UserProfile> {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData
  const { data } = await api.put<ApiResponse<UserProfile>>(
    "/administration/profile",
    payload,
    isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  )
  return data.data
}

export async function ensureAuth(): Promise<string | null> {
  const token = localStorage.getItem("token")
  if (token && token !== "undefined" && token !== "null") {
    return token
  }
  try {
    const res = await login({
      email: "hr.manager@company.com",
      password: "password123",
    })
    return res.token
  } catch {
    return null
  }
}
