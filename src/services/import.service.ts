import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"

export interface ImportModuleOption {
  key: string
  label: string
  description: string
  endpoint: string
  category: string
  iconName: string
}

export const IMPORT_MODULES: ImportModuleOption[] = [
  // tahan dulu
  // {
  //   key: "auto",
  //   label: "Sinkronisasi Penuh (Rekomendasi)",
  //   description: "Unggah berkas induk HR_Monitoring_Dashboard v2.0 ke semua endpoint backend terkait secara otomatis.",
  //   endpoint: "all",
  //   category: "Semua Data",
  //   iconName: "Sparkles",
  // },
  {
    key: "employees",
    label: "Master Karyawan (HO & Toko)",
    description: "Impor demografi karyawan per Bulan & Tahun, NIK, penempatan divisi/store, jabatan, tanggal kontrak, gaji pokok, dan BPJS.",
    endpoint: "/employees/import",
    category: "Karyawan",
    iconName: "Users",
  },
  {
    key: "movement",
    label: "Turnover & Pergerakan Karyawan",
    description: "Impor catatan turnover voluntary dan non-voluntary, resign SOP, PHK, efisiensi, dan habis kontrak.",
    endpoint: "/movement/bulk-upload",
    category: "Turnover",
    iconName: "TrendingDown",
  },
  {
    key: "compliance",
    label: "Perijinan Ketenagakerjaan (WLKP, PP & K3)",
    description: "Impor matriks perijinan ketenagakerjaan (WLKP, PP, K3): entitas, nama toko, dokumen/perizinan, masa berlaku, PIC, dan status.",
    endpoint: "/compilance/import",
    category: "Kepatuhan",
    iconName: "Building2",
  },
  {
    key: "sp",
    label: "Surat Peringatan Disiplin (SP)",
    description: "Impor rekap & detail Surat Peringatan (Jumlah SP Aktif & Jumlah SP Non Aktif) untuk HO & Store.",
    endpoint: "/disciplinary/import-sp",
    category: "Disiplin",
    iconName: "AlertTriangle",
  },
  {
    key: "fraud",
    label: "Kasus Fraud & Selisih Opname",
    description: "Impor temuan audit selisih stock opname (BAKB) dan investigasi kecurangan transaksi.",
    endpoint: "/disciplinary/import-fraud",
    category: "Disiplin",
    iconName: "ShieldAlert",
  },
  {
    key: "bipartit",
    label: "Hubungan Industrial (Bipartit & Mediasi)",
    description: "Impor catatan perselisihan hubungan industrial, proses mediasi Disnaker, dan status penyelesaian.",
    endpoint: "/disciplinary/import-bipartit",
    category: "Hubungan Industrial",
    iconName: "Scale",
  },
  {
    key: "attendance",
    label: "Data Absensi & Kehadiran Bulanan",
    description: "Impor rekapitulasi kehadiran, sakit, izin, cuti tahunan, dan mangkir per bulan untuk HQ dan Toko.",
    endpoint: "/reporting-monthly/bulk-attendance",
    category: "Kehadiran",
    iconName: "CalendarCheck",
  },
  {
    key: "sales",
    label: "Target & Realisasi Penjualan (Sales)",
    description: "Impor kuantiti dan omset penjualan bersih aktual per gerai toko ritel bulanan.",
    endpoint: "/reporting-monthly/bulk-sales",
    category: "Produktivitas",
    iconName: "DollarSign",
  },
]

export interface ImportResultItem {
  moduleKey: string
  moduleLabel: string
  endpoint: string
  success: boolean
  message: string
  errors?: string[]
}

export interface ImportResponseSummary {
  success: boolean
  message: string
  results: ImportResultItem[]
  errors?: string[]
}

function extractErrorList(payload: any): string[] {
  const rawErrors =
    payload?.errors ||
    payload?.errorList ||
    payload?.data?.errors ||
    payload?.data?.errorList

  if (!Array.isArray(rawErrors)) return []
  return rawErrors
    .map((item) => {
      if (typeof item === "string") return item.trim()
      if (item && typeof item === "object") {
        return item.message || item.error || JSON.stringify(item)
      }
      return String(item ?? "").trim()
    })
    .filter(Boolean)
}

function hasFailureCount(message?: string): boolean {
  return /Gagal:\s*[1-9]\d*/i.test(message || "")
}

export async function uploadToEndpoint(
  endpoint: string,
  file: File
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await api.post<ApiResponse<any>>(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  const errorsList = extractErrorList(data)

  return {
    success: data?.success ?? true,
    message: data?.message || "File berhasil diproses oleh backend.",
    errors: errorsList.length > 0 ? errorsList : undefined,
  }
}

async function uploadSpCombined(
  file: File
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  const messages: string[] = []
  const errors: string[] = []
  let anySuccess = false
  let anyResponded = false

  const spEndpoints = [
    { endpoint: "/disciplinary/import-sp", label: "Detail SP" },
    { endpoint: "/disciplinary/sp-rekap/import", label: "Rekap SP Toko" },
  ]

  for (const item of spEndpoints) {
    try {
      const res = await uploadToEndpoint(item.endpoint, file)
      anyResponded = true

      if (res.success !== false) {
        anySuccess = true
        messages.push(res.message)
      } else if (!res.errors?.length && res.message) {
        errors.push(`[${item.label}] ${res.message}`)
      }

      if (res.errors && res.errors.length > 0) {
        errors.push(...res.errors)
      }
    } catch (err: any) {
      const respErrors = extractErrorList(err?.response?.data)
      if (respErrors.length > 0) {
        errors.push(...respErrors.map((e) => `[${item.label}] ${e}`))
      } else {
        errors.push(
          `[${item.label}] ${err?.response?.data?.message || err?.message || "Gagal memproses"}`
        )
      }
    }
  }

  if (!anyResponded) {
    throw new Error(errors[0] || "Gagal memproses berkas Surat Peringatan (SP).")
  }

  return {
    success: anySuccess,
    message: messages.join(" • ") || errors[0] || "Gagal memproses berkas Surat Peringatan (SP).",
    errors: errors.length > 0 ? errors : undefined,
  }
}

export async function importAllModules(
  file: File,
  onProgress?: (currentModule: string, index: number, total: number) => void
): Promise<ImportResponseSummary> {
  const targetModules = IMPORT_MODULES.filter((m) => m.key !== "auto")
  const results: ImportResultItem[] = []
  let anySuccess = false
  const allErrors: string[] = []

  for (let i = 0; i < targetModules.length; i++) {
    const mod = targetModules[i]
    if (onProgress) {
      onProgress(mod.label, i + 1, targetModules.length)
    }

    try {
      const res =
        mod.key === "sp"
          ? await uploadSpCombined(file)
          : await uploadToEndpoint(mod.endpoint, file)
      const isOk = res.success !== false
      if (isOk) anySuccess = true

      const modErrors =
        res.errors && res.errors.length > 0
          ? res.errors
          : !isOk || hasFailureCount(res.message)
            ? [res.message]
            : undefined

      results.push({
        moduleKey: mod.key,
        moduleLabel: mod.label,
        endpoint: mod.endpoint,
        success: isOk,
        message: res.message,
        errors: modErrors,
      })

      if (modErrors && modErrors.length > 0) {
        allErrors.push(...modErrors.map((e) => `[${mod.label}] ${e}`))
      }
    } catch (err: any) {
      const respErrors = extractErrorList(err?.response?.data)
      const errMsg = err?.response?.data?.message || err?.message || "Gagal memproses modul ini"
      const modErrors = respErrors.length > 0 ? respErrors : [errMsg]

      results.push({
        moduleKey: mod.key,
        moduleLabel: mod.label,
        endpoint: mod.endpoint,
        success: false,
        message: errMsg,
        errors: modErrors,
      })
      allErrors.push(...modErrors.map((e) => `[${mod.label}] ${e}`))
    }
  }

  const successCount = results.filter((r) => r.success).length
  return {
    success: anySuccess,
    message: anySuccess
      ? `Sinkronisasi selesai. ${successCount} dari ${targetModules.length} modul berhasil diproses.`
      : "Seluruh modul gagal diproses. Periksa format berkas Excel Anda.",
    results,
    errors: allErrors,
  }
}

export async function executeImport(
  targetKey: string,
  file: File,
  onProgress?: (currentModule: string, index: number, total: number) => void
): Promise<ImportResponseSummary> {
  if (targetKey === "auto") {
    return await importAllModules(file, onProgress)
  }

  const mod = IMPORT_MODULES.find((m) => m.key === targetKey)
  if (!mod || mod.endpoint === "all") {
    throw new Error(`Modul target "${targetKey}" tidak valid.`)
  }

  if (onProgress) {
    onProgress(mod.label, 1, 1)
  }

  try {
    const res =
      mod.key === "sp"
        ? await uploadSpCombined(file)
        : await uploadToEndpoint(mod.endpoint, file)

    const isOk = res.success !== false
    const modErrors =
      res.errors && res.errors.length > 0
        ? res.errors
        : !isOk || hasFailureCount(res.message)
          ? [res.message]
          : undefined

    return {
      success: isOk,
      message: res.message,
      results: [
        {
          moduleKey: mod.key,
          moduleLabel: mod.label,
          endpoint: mod.endpoint,
          success: isOk,
          message: res.message,
          errors: modErrors,
        },
      ],
      errors: modErrors,
    }
  } catch (err: any) {
    const respErrors = extractErrorList(err?.response?.data)
    if (respErrors.length > 0) {
      const errMsg = err?.response?.data?.message || err?.message || "Gagal memproses modul ini"
      return {
        success: false,
        message: errMsg,
        results: [
          {
            moduleKey: mod.key,
            moduleLabel: mod.label,
            endpoint: mod.endpoint,
            success: false,
            message: errMsg,
            errors: respErrors,
          },
        ],
        errors: respErrors,
      }
    }
    throw err
  }
}
