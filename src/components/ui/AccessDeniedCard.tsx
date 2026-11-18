import React from "react"
import { Link } from "react-router-dom"
import { ShieldAlert, ArrowLeft } from "lucide-react"

interface AccessDeniedCardProps {
  title?: string
  description?: string
  backTo?: string
  backLabel?: string
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  title = "Akses Ditolak",
  description = "Akun Anda tidak memiliki izin untuk mengakses halaman atau modul ini. Hubungi Super Admin jika Anda memerlukan hak akses tambahan.",
  backTo = "/setting",
  backLabel = "Ke Pengaturan Akun",
}) => {
  return (
    <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4 max-w-xl mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c8102e] mx-auto flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div className="pt-2">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </Link>
      </div>
    </div>
  )
}
