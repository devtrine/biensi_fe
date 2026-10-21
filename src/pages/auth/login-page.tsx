import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CircleUserRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useLogin } from '../../hooks/use-auth'
import { getErrorMessage } from '../../lib/api/client'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<string | null>(null)

  const navigate = useNavigate()
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessInfo(null)

    const finalEmail = email.trim() || 'hr.manager@company.com'
    const finalPassword = password || 'password123'

    loginMutation.mutate(
      { email: finalEmail, password: finalPassword },
      {
        onSuccess: () => {
          navigate('/dashboard', { replace: true })
        },
        onError: (err) => {
          setErrorMessage(getErrorMessage(err))
        },
      }
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-[#141724] flex items-center justify-center p-3 sm:p-5 lg:p-7 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <div className="absolute top-[8%] left-[5%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-red-600/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[8%] right-[8%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-slate-800/35 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1220px] bg-white rounded-[36px] sm:rounded-[40px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.65)] p-3 sm:p-4 lg:p-4.5 flex flex-col lg:flex-row items-stretch border border-white/80 animate-entrance">
        <div className="relative w-full lg:w-[50%] xl:w-[52%] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#0d101d] min-h-[460px] sm:min-h-[520px] lg:min-h-[660px] flex flex-col justify-between p-6 sm:p-8 select-none border border-slate-900/60 shadow-inner">
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-red-600/25 rounded-full blur-[110px] animate-orb-1" />
            <div className="absolute bottom-1/3 right-1/4 w-[320px] h-[320px] bg-red-700/18 rounded-full blur-[90px] animate-orb-2" />
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <img
              src="/biensilogoglow.svg"
              alt=""
              aria-hidden="true"
              className="absolute select-none pointer-events-none max-w-none origin-top-left opacity-90 animate-glow-pulse"
              style={{
                width: '1614px',
                height: '1338px',
                transform: 'translate(-380px, -360px) rotate(32.5deg) scale(0.96)',
              }}
            />
          </div>

          {/* Middle Atmosphere Glow */}
          <div className="relative z-10 my-auto py-8">
            <div className="max-w-xs sm:max-w-sm">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Biensi HR Workspace
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/80 mt-2 font-light">
                Modern workforce intelligence & real-time governance
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[50%] xl:w-[48%] bg-white flex flex-col justify-between px-6 sm:px-10 lg:px-14 py-7 sm:py-9">
          <div className="my-auto py-6 sm:py-8 max-w-[390px] w-full mx-auto">
            <div className="text-center mb-7">
              <div className="flex items-center gap-2.5 select-none justify-center">
                <img
                  src="/BiensiIcon.webp"
                  alt="Biensi Icon"
                  className="h-16 w-auto mb-10 object-contain shrink-0"
                />
                {/* <img
                src="/BiensiType.webp"
                alt="BIENSI"
                className="h-3.5 w-auto object-contain shrink-0"
              /> */}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Hi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
                Welcome to BIENSI
              </p>
            </div>

            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successInfo && (
              <div className="w-full mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{successInfo}</span>
              </div>
            )}

            {/* Inputs & Actions */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-3.5">
              {/* Email Input with Red CircleUserRound Icon */}
              <div>
                <div className="w-full h-11.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/15 px-3.5 flex items-center gap-3 transition-all shadow-xs">
                  <CircleUserRound
                    className="w-5 h-5 text-[#D61F11] shrink-0"
                    strokeWidth={1.8}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 font-normal outline-none border-none p-0"
                  />
                </div>
              </div>

              {/* Password Input with Red Lock Icon & Eye Toggle */}
              <div>
                <div className="w-full h-11.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/15 px-3.5 flex items-center gap-3 transition-all shadow-xs">
                  <div className="w-5 flex items-center justify-center shrink-0">
                    <Lock
                      className="w-[18px] h-[19px] text-[#D61F11]"
                      strokeWidth={1.8}
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 font-normal outline-none border-none p-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer focus:outline-none shrink-0"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="relative overflow-hidden w-full h-11.5 !mt-3.5 bg-[#E02618] hover:bg-[#C91A0D] active:scale-[0.99] text-white font-semibold text-sm rounded-xl flex items-center justify-center transition-all shadow-[0_8px_20px_rgba(224,38,24,0.3)] hover:shadow-[0_12px_28px_rgba(224,38,24,0.45)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed select-none"
              >
                {/* Subtle Shimmer Sweep */}
                <div className="pointer-events-none absolute inset-0 -top-full -bottom-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />

                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
