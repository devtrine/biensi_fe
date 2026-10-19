import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as authService from "../services/auth.service"
import type { LoginPayload, UserProfile } from "../types/auth"

export function useCurrentUser() {
  return useQuery<UserProfile | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token")
      if (!token || token === "undefined" || token === "null") {
        return null
      }
      try {
        return await authService.getMe()
      } catch {
        return null
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user)
      queryClient.invalidateQueries({ queryKey: ["auth"] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authService.logout,
    onSettled: async () => {
      await queryClient.cancelQueries()
      queryClient.setQueryData(["auth", "me"], null)
      queryClient.clear()
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.replace("/login")
      }
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: FormData | Partial<UserProfile>) => authService.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["auth", "me"], updated)
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] })
    },
  })
}
