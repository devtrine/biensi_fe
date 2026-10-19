import axios, { type AxiosError } from "axios"

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"
export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "")

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const reqUrl = error.config?.url || ""
      const isAuthEndpoint = reqUrl.includes("/auth/login") || reqUrl.includes("/auth/logout")
      if (!isAuthEndpoint && typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        if (window.location.pathname !== "/login") {
          window.location.replace("/login")
        }
      }
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Terlalu banyak permintaan. Silakan tunggu beberapa saat."
    }
    const data = error.response?.data as { message?: string; error?: { message?: string } } | undefined
    return data?.error?.message || data?.message || error.message
  }
  if (error instanceof Error) return error.message
  return "Terjadi kesalahan pada sistem."
}
