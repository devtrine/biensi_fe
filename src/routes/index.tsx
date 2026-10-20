import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '../pages/auth/auth-layout'
import { LoginPage } from '../pages/auth/login-page'
import { DashboardLayout } from '../pages/dashboard/dashboard-layout'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { ImportPage } from '../pages/import/ImportPage'
import { SettingsPage } from '../pages/settings/SettingsPage'
import { NotFoundPage } from '../pages/not-found-page'
import { RequireAuth } from '../components/auth/require-auth'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/setting" element={<SettingsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
export default AppRoutes
