import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { message } from "antd"
import { Save, ShieldCheck, Users, RefreshCw, AlertCircle, RotateCcw } from "lucide-react"
import { useCurrentUser } from "../../hooks/use-auth"
import { useRoles, useUpdateRolePermissions } from "../../hooks/use-administration"
import { getErrorMessage } from "../../lib/api/client"
import {
  hasPermission,
  isSuperAdminRole,
  normalizeRoleModules,
  PERMISSION_ACTIONS,
} from "../../lib/permissions"
import type { ModulePermission, PermissionAction, RoleItem } from "../../types/administration"
import { AccessDeniedCard } from "../../components/ui/AccessDeniedCard"

interface RoleDraft {
  modules: Record<string, ModulePermission>
  description: string
  accessLevel: string
}

function buildBaselineDraft(role: RoleItem): RoleDraft {
  const superAdmin = isSuperAdminRole(role.id, role.name)
  return {
    modules: normalizeRoleModules(role.permissions, superAdmin),
    description: role.permissions?.description || "",
    accessLevel: role.permissions?.accessLevel || (superAdmin ? "READ_WRITE" : "RESTRICTED_READ"),
  }
}

export const RolesPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { data: currentUser } = useCurrentUser()

  const canViewRoles = hasPermission(currentUser, "roles", "view")
  const canEditRoles = hasPermission(currentUser, "roles", "edit")
  const canViewUsers = hasPermission(currentUser, "users", "view")

  const { data: roles = [], isLoading, isError, error, refetch } = useRoles(canViewRoles)
  const updateMutation = useUpdateRolePermissions()

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [draftsByRoleId, setDraftsByRoleId] = useState<Record<number, RoleDraft>>({})

  const selectedRole: RoleItem | undefined = useMemo(() => {
    if (roles.length === 0) return undefined
    return roles.find((r) => r.id === selectedRoleId) || roles[0]
  }, [roles, selectedRoleId])

  const baselineDraft = useMemo(
    () => (selectedRole ? buildBaselineDraft(selectedRole) : null),
    [selectedRole]
  )

  const currentDraft = useMemo(() => {
    if (!selectedRole || !baselineDraft) return null
    return draftsByRoleId[selectedRole.id] ?? baselineDraft
  }, [selectedRole, baselineDraft, draftsByRoleId])

  const isDirty = useMemo(() => {
    if (!currentDraft || !baselineDraft) return false
    if (
      currentDraft.description !== baselineDraft.description ||
      currentDraft.accessLevel !== baselineDraft.accessLevel
    ) {
      return true
    }

    return Object.keys(currentDraft.modules).some((key) => {
      const currentMod = currentDraft.modules[key]
      const baseMod = baselineDraft.modules[key]
      if (!baseMod) return true
      return PERMISSION_ACTIONS.some((act) => currentMod[act.key] !== baseMod[act.key])
    })
  }, [currentDraft, baselineDraft])

  if (!canViewRoles) {
    return (
      <AccessDeniedCard
        title="Akses Matriks Peran Ditolak"
        description="Anda tidak memiliki izin untuk melihat Role & Matriks Hak Akses."
      />
    )
  }

  const updateActiveDraft = (updater: (prev: RoleDraft) => RoleDraft) => {
    if (!selectedRole || !baselineDraft) return
    setDraftsByRoleId((prev) => {
      const base = prev[selectedRole.id] ?? baselineDraft
      return {
        ...prev,
        [selectedRole.id]: updater(base),
      }
    })
  }

  const clearActiveDraft = (roleId: number) => {
    setDraftsByRoleId((prev) => {
      const next = { ...prev }
      delete next[roleId]
      return next
    })
  }

  const handleToggleCell = (moduleKey: string, action: PermissionAction) => {
    if (!canEditRoles) return
    updateActiveDraft((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleKey]: {
          ...prev.modules[moduleKey],
          [action]: !prev.modules[moduleKey]?.[action],
        },
      },
    }))
  }

  const handleToggleRow = (moduleKey: string) => {
    if (!canEditRoles || !currentDraft) return
    const mod = currentDraft.modules[moduleKey]
    if (!mod) return
    const allEnabled = PERMISSION_ACTIONS.every((a) => Boolean(mod[a.key]))
    const nextValue = !allEnabled
    updateActiveDraft((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleKey]: {
          ...prev.modules[moduleKey],
          view: nextValue,
          create: nextValue,
          edit: nextValue,
          delete: nextValue,
          export: nextValue,
        },
      },
    }))
  }

  const handleToggleColumn = (action: PermissionAction) => {
    if (!canEditRoles || !currentDraft) return
    const keys = Object.keys(currentDraft.modules)
    if (keys.length === 0) return
    const allEnabled = keys.every((k) => Boolean(currentDraft.modules[k]?.[action]))
    const nextValue = !allEnabled
    updateActiveDraft((prev) => {
      const nextModules: Record<string, ModulePermission> = {}
      Object.keys(prev.modules).forEach((k) => {
        nextModules[k] = { ...prev.modules[k], [action]: nextValue }
      })
      return {
        ...prev,
        modules: nextModules,
      }
    })
  }

  const handleSave = () => {
    if (!selectedRole || !currentDraft || !canEditRoles) return
    updateMutation.mutate(
      {
        roleId: selectedRole.id,
        permissions: {
          ...(typeof selectedRole.permissions === "object" ? selectedRole.permissions : {}),
          description: currentDraft.description,
          accessLevel: currentDraft.accessLevel,
          modules: currentDraft.modules,
        },
      },
      {
        onSuccess: () => {
          clearActiveDraft(selectedRole.id)
          messageApi.success(
            `Matriks izin hak akses berhasil diperbarui untuk peran ${selectedRole.name}!`
          )
        },
        onError: (err) => {
          messageApi.error(getErrorMessage(err))
        },
      }
    )
  }

  const moduleEntries = currentDraft ? Object.entries(currentDraft.modules) : []
  const selectedIsSuperAdmin = selectedRole
    ? isSuperAdminRole(selectedRole.id, selectedRole.name)
    : false

  return (
    <div className="space-y-6">
      {contextHolder}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Matriks Peran & Izin Hak Akses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hak akses mendalam mencakup tindakan operasional, visibilitas data finansial tenaga kerja, dan izin penghapusan
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canViewUsers && (
            <Link
              to="/users"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Manajemen Pengguna</span>
            </Link>
          )}

          {canEditRoles && (
            <>
              {isDirty && selectedRole && (
                <button
                  type="button"
                  onClick={() => clearActiveDraft(selectedRole.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedRole || !isDirty || updateMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#c8102e] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#c8102e] mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Memuat daftar peran dan matriks hak akses...</p>
        </div>
      )}

      {!isLoading && isError && (
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-2xs text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[#c8102e] mx-auto" />
          <p className="text-sm font-bold text-slate-900">Gagal Memuat Matriks Peran</p>
          <p className="text-xs text-slate-500">{getErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!isLoading && !isError && roles.length > 0 && selectedRole && currentDraft && (
        <>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold pb-1">
              {roles.map((r) => {
                const active = r.id === selectedRole.id
                const roleHasDraft = Boolean(draftsByRoleId[r.id])
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                      active
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 ${active ? "text-red-400" : "text-slate-400"}`} />
                    <span>{r.name}</span>
                    {roleHasDraft && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Deskripsi Peran
                </label>
                <input
                  type="text"
                  value={currentDraft.description}
                  onChange={(e) =>
                    updateActiveDraft((prev) => ({ ...prev, description: e.target.value }))
                  }
                  disabled={!canEditRoles}
                  placeholder="Deskripsi cakupan hak akses peran ini..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-red-500 disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Access Level Fallback
                </label>
                <select
                  value={currentDraft.accessLevel}
                  onChange={(e) =>
                    updateActiveDraft((prev) => ({ ...prev, accessLevel: e.target.value }))
                  }
                  disabled={!canEditRoles}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-red-500 disabled:opacity-70 cursor-pointer"
                >
                  <option value="READ_WRITE">READ_WRITE</option>
                  <option value="READ">READ</option>
                  <option value="RESTRICTED_READ">RESTRICTED_READ</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 font-bold">
                  <tr>
                    <th className="p-3.5">Fitur Modul</th>
                    {PERMISSION_ACTIONS.map((act) => (
                      <th key={act.key} className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleColumn(act.key)}
                          disabled={!canEditRoles}
                          title={canEditRoles ? `Toggle semua kolom ${act.label}` : act.label}
                          className={`uppercase font-bold tracking-wider ${
                            canEditRoles ? "hover:text-[#c8102e] cursor-pointer" : "cursor-default"
                          }`}
                        >
                          {act.label}
                        </button>
                      </th>
                    ))}
                    <th className="p-3.5 text-center">Semua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moduleEntries.map(([moduleKey, mod]) => {
                    const allChecked = PERMISSION_ACTIONS.every((a) => Boolean(mod[a.key]))
                    return (
                      <tr key={moduleKey} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{mod.label || moduleKey}</div>
                          <div className="text-[10px] font-mono text-slate-400">{moduleKey}</div>
                        </td>
                        {PERMISSION_ACTIONS.map((act) => {
                          const enabled = Boolean(mod[act.key])
                          return (
                            <td key={act.key} className="p-3.5 text-center">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={enabled}
                                aria-label={`${mod.label || moduleKey} ${act.label}`}
                                disabled={!canEditRoles}
                                onClick={() => handleToggleCell(moduleKey, act.key)}
                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-hidden ${
                                  enabled ? "bg-[#c8102e]" : "bg-slate-200"
                                } ${canEditRoles ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-150 ${
                                    enabled ? "translate-x-4.5" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </td>
                          )
                        })}
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={allChecked}
                            disabled={!canEditRoles}
                            onChange={() => handleToggleRow(moduleKey)}
                            className="w-4 h-4 text-[#c8102e] accent-[#c8102e] cursor-pointer disabled:cursor-not-allowed"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
