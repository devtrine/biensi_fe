import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { message } from "antd"
import {
  Plus,
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useCurrentUser } from "../../hooks/use-auth"
import {
  useCreateUser,
  useDeleteUser,
  useRoles,
  useUpdateUser,
  useUsers,
} from "../../hooks/use-administration"
import { getErrorMessage } from "../../lib/api/client"
import { hasPermission } from "../../lib/permissions"
import type { AdminUser } from "../../types/administration"
import { AccessDeniedCard } from "../../components/ui/AccessDeniedCard"

function formatDateTime(value?: string | null): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateOnly(value?: string | null): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export const UsersPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { data: currentUser } = useCurrentUser()

  const canViewUsers = hasPermission(currentUser, "users", "view")
  const canCreateUsers = hasPermission(currentUser, "users", "create")
  const canEditUsers = hasPermission(currentUser, "users", "edit")
  const canDeleteUsers = hasPermission(currentUser, "users", "delete")
  const canViewRoles = hasPermission(currentUser, "roles", "view")
  const isCreatorSuperAdmin = currentUser?.roleId === 1

  const { data: users = [], isLoading, isError, error, refetch } = useUsers(canViewUsers)
  const { data: roles = [] } = useRoles(canViewRoles)

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)

  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formRoleId, setFormRoleId] = useState<number>(4)
  const [formIsActive, setFormIsActive] = useState(true)

  const roleOptions = useMemo(() => {
    if (roles.length > 0) return roles
    const map = new Map<number, string>()
    users.forEach((u) => {
      if (u.roleId != null) {
        map.set(u.roleId, u.role)
      }
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [roles, users])

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && u.isActive) ||
        (statusFilter === "INACTIVE" && !u.isActive)
      const matchesRole = roleFilter === "ALL" || String(u.roleId) === roleFilter
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [users, searchQuery, statusFilter, roleFilter])

  if (!canViewUsers) {
    return (
      <AccessDeniedCard
        title="Akses Manajemen Pengguna Ditolak"
        description="Anda tidak memiliki izin untuk melihat daftar akun pengguna sistem."
      />
    )
  }

  const openCreateModal = () => {
    const defaultRole =
      roleOptions.find((r) => (isCreatorSuperAdmin ? true : r.id !== 1))?.id ?? 4
    setEditingUser(null)
    setFormName("")
    setFormEmail("")
    setFormPhone("")
    setFormPassword("")
    setFormRoleId(defaultRole)
    setFormIsActive(true)
    setModalMode("create")
  }

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u)
    setFormName(u.name)
    setFormEmail(u.email)
    setFormPhone(u.phoneNumber || "")
    setFormPassword("")
    setFormRoleId(u.roleId ?? 4)
    setFormIsActive(u.isActive)
    setModalMode("edit")
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingUser(null)
  }

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault()

    if (modalMode === "create") {
      createMutation.mutate(
        {
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          roleId: formRoleId,
          phoneNumber: formPhone.trim() || undefined,
          isActive: formIsActive,
        },
        {
          onSuccess: () => {
            messageApi.success("Pengguna baru berhasil ditambahkan.")
            closeModal()
          },
          onError: (err) => {
            messageApi.error(getErrorMessage(err))
          },
        }
      )
      return
    }

    if (modalMode === "edit" && editingUser) {
      const payload: {
        name: string
        email: string
        phoneNumber: string
        roleId: number
        isActive: boolean
        password?: string
      } = {
        name: formName.trim(),
        email: formEmail.trim(),
        phoneNumber: formPhone.trim(),
        roleId: formRoleId,
        isActive: formIsActive,
      }
      if (formPassword.trim()) {
        payload.password = formPassword
      }

      updateMutation.mutate(
        { id: editingUser.id, payload },
        {
          onSuccess: () => {
            messageApi.success("Data pengguna berhasil diperbarui.")
            closeModal()
          },
          onError: (err) => {
            messageApi.error(getErrorMessage(err))
          },
        }
      )
    }
  }

  const handleToggleActive = (u: AdminUser) => {
    if (!canEditUsers || u.id === currentUser?.id) return
    updateMutation.mutate(
      {
        id: u.id,
        payload: {
          isActive: !u.isActive,
          roleId: u.roleId ?? undefined,
        },
      },
      {
        onSuccess: () => {
          messageApi.success(
            `Akun ${u.name} berhasil ${!u.isActive ? "diaktifkan" : "dinonaktifkan"}.`
          )
        },
        onError: (err) => {
          messageApi.error(getErrorMessage(err))
        },
      }
    )
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        messageApi.success(`Pengguna ${deleteTarget.name} berhasil dihapus.`)
        setDeleteTarget(null)
      },
      onError: (err) => {
        messageApi.error(getErrorMessage(err))
      },
    })
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      {contextHolder}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pengguna Sistem & Manajemen Hak Akses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengaturan akun administrator HR, peninjau eksekutif, dan analis toko regional
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canViewRoles && (
            <Link
              to="/roles"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
            >
              Matriks Hak Akses
            </Link>
          )}
          {canCreateUsers && (
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#c8102e] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau peran..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:border-red-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Peran</option>
            {roleOptions.map((r) => (
              <option key={r.id} value={String(r.id)}>
                {r.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Non-Aktif</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#c8102e] mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Memuat daftar pengguna...</p>
        </div>
      )}

      {!isLoading && isError && (
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-2xs text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[#c8102e] mx-auto" />
          <p className="text-sm font-bold text-slate-900">Gagal Memuat Daftar Pengguna</p>
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

      {!isLoading && !isError && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 font-bold">
                <tr>
                  <th className="p-3.5">Nama Pengguna & Email</th>
                  <th className="p-3.5">Peran / Hak Akses</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Login Terakhir</th>
                  <th className="p-3.5">Akun Dibuat</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Tidak ada pengguna yang cocok dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{u.name}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-bold uppercase">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                          {u.phoneNumber && (
                            <div className="text-[10px] font-mono text-slate-400">{u.phoneNumber}</div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-800">
                            <Shield className="w-3 h-3 text-[#c8102e]" />
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {canEditUsers && !isSelf && (
                              <button
                                type="button"
                                role="switch"
                                aria-checked={u.isActive}
                                aria-label={`Ubah status ${u.name}`}
                                disabled={updateMutation.isPending}
                                onClick={() => handleToggleActive(u)}
                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 cursor-pointer disabled:opacity-50 ${
                                  u.isActive ? "bg-emerald-500" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-150 ${
                                    u.isActive ? "translate-x-4.5" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            )}
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {u.isActive ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {u.isActive ? "Aktif" : "Non-Aktif"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-600">
                          {formatDateTime(u.lastLogin)}
                        </td>
                        <td className="p-3.5 text-slate-500">{formatDateOnly(u.createdAt)}</td>
                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            {canEditUsers && (
                              <button
                                type="button"
                                onClick={() => openEditModal(u)}
                                title="Ubah Pengguna"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            {canDeleteUsers && !isSelf && (
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(u)}
                                title="Hapus Pengguna"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#c8102e] hover:bg-red-50 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Tambah Pengguna Baru" : "Ubah Data Pengguna"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peran *</label>
                  <select
                    value={formRoleId}
                    onChange={(e) => setFormRoleId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-red-500 cursor-pointer"
                  >
                    {roleOptions.map((r) => {
                      const restrictedSuperAdmin = r.id === 1 && !isCreatorSuperAdmin
                      return (
                        <option key={r.id} value={r.id} disabled={restrictedSuperAdmin}>
                          {r.name}{restrictedSuperAdmin ? " (Khusus Super Admin)" : ""}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0812..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {modalMode === "create"
                    ? "Password *"
                    : "Password Baru (Kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  required={modalMode === "create"}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-red-500"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Status Akun Aktif</span>
                  <span className="text-[11px] text-slate-500">
                    Akun non-aktif tidak dapat login ke sistem
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#c8102e] cursor-pointer"
                />
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-4 py-2 font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isMutating
                    ? "Menyimpan..."
                    : modalMode === "create"
                      ? "Buat Akun"
                      : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Hapus Pengguna?</h3>
              <p className="text-xs text-slate-500">
                Akun <strong>{deleteTarget.name}</strong> ({deleteTarget.email}) akan dihapus permanen.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
