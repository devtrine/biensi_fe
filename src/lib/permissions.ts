import type { UserProfile } from "../types/auth"
import type { ModulePermission, PermissionAction, RolePermissions } from "../types/administration"

export interface ModuleDefinition {
  key: string
  label: string
}

export const MODULE_CATALOG: ModuleDefinition[] = [
  { key: "dashboard", label: "Dashboard Eksekutif & KPI" },
  { key: "employees", label: "Data Demografi Karyawan" },
  { key: "turnover", label: "Turnover & Movement" },
  { key: "productivity", label: "Produktivitas & Labour Cost" },
  { key: "attendance", label: "Tingkat Kehadiran" },
  { key: "recruitment", label: "Rekrutmen & Man Power" },
  { key: "disciplinary", label: "Surat Peringatan & Kasus" },
  { key: "industrialRelation", label: "Sengketa Hub. Industrial" },
  { key: "compliance", label: "Perizinan (WLKP, PP, K3)" },
  { key: "import", label: "Impor Data Excel (Bulk)" },
  { key: "users", label: "Manajemen Akun Pengguna" },
  { key: "roles", label: "Role & Matriks Hak Akses" },
]

export const PERMISSION_ACTIONS: { key: PermissionAction; label: string }[] = [
  { key: "view", label: "Lihat" },
  { key: "create", label: "Tambah" },
  { key: "edit", label: "Ubah" },
  { key: "delete", label: "Hapus" },
  { key: "export", label: "Ekspor" },
]

export function isSuperAdminRole(roleId?: number | null, roleName?: string | null): boolean {
  const normalized = String(roleName || "").trim().toUpperCase()
  return roleId === 1 || normalized === "SUPER ADMIN" || normalized === "SUPER_ADMIN"
}

export function isSuperAdmin(user?: UserProfile | null): boolean {
  if (!user) return false
  return isSuperAdminRole(user.roleId, user.role)
}

export function hasPermission(
  user: UserProfile | null | undefined,
  moduleKey: string,
  action: PermissionAction = "view"
): boolean {
  if (!user) return false
  if (isSuperAdmin(user)) return true

  const permissions = user.permissions
  const modulesPerm = permissions?.modules
  const modConfig = modulesPerm?.[moduleKey]

  if (modConfig && typeof modConfig === "object") {
    return Boolean(modConfig[action])
  }

  const accessLevel = String(permissions?.accessLevel || "").toUpperCase()
  if (accessLevel === "READ_WRITE") return true
  if (accessLevel === "READ" && action === "view") return true
  return false
}

export function normalizeRoleModules(
  permissions?: RolePermissions | null,
  superAdmin = false
): Record<string, ModulePermission> {
  const existing = permissions?.modules && typeof permissions.modules === "object"
    ? permissions.modules
    : {}

  const result: Record<string, ModulePermission> = {}

  MODULE_CATALOG.forEach((def) => {
    const raw = existing[def.key]
    const fallbackValue = superAdmin && !raw
    result[def.key] = {
      label: raw?.label || def.label,
      view: raw ? Boolean(raw.view) : fallbackValue,
      create: raw ? Boolean(raw.create) : fallbackValue,
      edit: raw ? Boolean(raw.edit) : fallbackValue,
      delete: raw ? Boolean(raw.delete) : fallbackValue,
      export: raw ? Boolean(raw.export) : fallbackValue,
    }
  })

  Object.keys(existing).forEach((key) => {
    if (!result[key]) {
      const raw = existing[key]
      result[key] = {
        label: raw?.label || key,
        view: Boolean(raw?.view),
        create: Boolean(raw?.create),
        edit: Boolean(raw?.edit),
        delete: Boolean(raw?.delete),
        export: Boolean(raw?.export),
      }
    }
  })

  return result
}
