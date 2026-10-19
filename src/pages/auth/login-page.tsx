import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react"
import { useLogin } from "../../hooks/use-auth"
import { getErrorMessage } from "../../lib/api/client"

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("hr.manager@company.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const navigate = useNavigate()
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage("Silakan masukkan email dan kata sandi Anda.")
      return
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard", { replace: true })
        },
        onError: (err) => {
          setErrorMessage(getErrorMessage(err))
        },
      }
    )
  }

  const handleFillDemo = () => {
    setEmail("hr.manager@company.com")
    setPassword("password123")
    setErrorMessage(null)
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex flex-col items-center text-center mb-7">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C8102E] to-red-600 flex items-center justify-center shadow-lg shadow-red-950/50 mb-4 border border-red-500/30">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-[11px] font-bold tracking-widest uppercase text-red-300 mb-2 font-mono">
          PT Biensi Fesyenindo
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
          HR Executive Portal
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">
          Masuk untuk mengakses dashboard metrik KPI, analisa tenaga kerja, dan manajemen data.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in shake duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@company.com"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-[var(--biensi-red)] focus:ring-1 focus:ring-[var(--biensi-red)] transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Kata Sandi
            </label>
            <span className="text-xs text-slate-500 hover:text-slate-400 cursor-default">
              Format: min. 8 karakter
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-[var(--biensi-red)] focus:ring-1 focus:ring-[var(--biensi-red)] transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#C8102E] to-red-600 hover:from-red-700 hover:to-[#C8102E] text-white font-bold rounded-xl text-sm shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Akun Demo Tersedia:</span>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-red-400 hover:text-red-300 font-mono font-medium underline underline-offset-2 cursor-pointer"
        >
          Isi Kredensial Super Admin
        </button>
      </div>
    </div>
  )
}
export default LoginPage
