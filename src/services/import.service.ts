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

export async function uploadToEndpoint(
  endpoint: string,
  file: File
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await api.post<ApiResponse<any>>(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return {
    success: data?.success ?? true,
    message: data?.message || "File berhasil diproses oleh backend.",
    errors: (data as any)?.errors,
  }
}

async function uploadSpCombined(
  file: File
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  const messages: string[] = []
  const errors: string[] = []
  let anyOk = false

  try {
    const detailRes = await uploadToEndpoint("/disciplinary/import-sp", file)
    if (detailRes.success !== false) {
      anyOk = true
      messages.push(detailRes.message)
    }
  } catch (err: any) {
    errors.push(err?.response?.data?.message || err?.message || "Detail SP dilewati")
  }

  try {
    const rekapRes = await uploadToEndpoint("/disciplinary/sp-rekap/import", file)
    if (rekapRes.success !== false) {
      anyOk = true
      messages.push(rekapRes.message)
    }
  } catch (err: any) {
    errors.push(err?.response?.data?.message || err?.message || "Rekap SP Toko dilewati")
  }

  if (!anyOk) {
    throw new Error(errors[0] || "Gagal memproses berkas Surat Peringatan (SP).")
  }

  return {
    success: true,
    message: messages.join(" • ") || "Data Surat Peringatan berhasil diproses.",
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

      results.push({
        moduleKey: mod.key,
        moduleLabel: mod.label,
        endpoint: mod.endpoint,
        success: isOk,
        message: res.message,
        errors: res.errors,
      })

      if (res.errors && res.errors.length > 0) {
        allErrors.push(...res.errors.map((e) => `[${mod.label}] ${e}`))
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Gagal memproses modul ini"
      results.push({
        moduleKey: mod.key,
        moduleLabel: mod.label,
        endpoint: mod.endpoint,
        success: false,
        message: errMsg,
        errors: [errMsg],
      })
      allErrors.push(`[${mod.label}] ${errMsg}`)
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

  const res =
    mod.key === "sp"
      ? await uploadSpCombined(file)
      : await uploadToEndpoint(mod.endpoint, file)

  return {
    success: res.success !== false,
    message: res.message,
    results: [
      {
        moduleKey: mod.key,
        moduleLabel: mod.label,
        endpoint: mod.endpoint,
        success: res.success !== false,
        message: res.message,
        errors: res.errors,
      },
    ],
    errors: res.errors,
  }
}
