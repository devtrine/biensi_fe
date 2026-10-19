import React from "react"
import { Outlet } from "react-router-dom"

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Outlet />
      </div>

      <div className="mt-8 text-center text-xs text-slate-500 font-medium">
        &copy; {new Date().getFullYear()} PT Biensi Fesyenindo. All rights reserved.
      </div>
    </div>
  )
}
export default AuthLayout
