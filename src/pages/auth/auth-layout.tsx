import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <main className="min-h-screen w-full bg-[#0a0d17] overflow-hidden relative">
      <Outlet />
    </main>
  )
}

export default AuthLayout
