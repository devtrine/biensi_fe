import React from "react"
import { Link } from "react-router-dom"
import { Home, AlertTriangle } from "lucide-react"

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-20 h-20 text-red-500" />
      </div>
      <span className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest mb-1">
        Error 404
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading mb-2">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        Halaman yang Anda tuju tidak ditemukan atau URL mungkin salah ketik.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span>Kembali ke Dashboard</span>
      </Link>
    </div>
  )
}
export default NotFoundPage
