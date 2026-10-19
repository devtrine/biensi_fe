import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCurrentUser } from "../../hooks/use-auth"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user, isPending, isError } = useCurrentUser()

  const isUnauthenticated = !isPending && (isError || !user)

  useEffect(() => {
    if (isUnauthenticated) {
      navigate("/login", { replace: true, state: { from: location } })
    }
  }, [isUnauthenticated, navigate, location])

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--biensi-red)] border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Memuat sesi pengguna...</span>
        </div>
      </div>
    )
  }

  if (isUnauthenticated) return null

  return <>{children}</>
}
