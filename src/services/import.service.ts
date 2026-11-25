import { api } from "../lib/api/client"
import type { ApiResponse } from "../types/api"

export type ImportPeriodMode = "STRICT_SINGLE" | "MULTI_CONFIRM"

export interface ImportModuleOption {
  key: string
  backendModuleCode: string
  validateModuleKey: string
  periodMode: ImportPeriodMode
  label: string
  description: string
  endpoint: string
  category: string
  iconName: string
}

export const IMPORT_MODULES: ImportModuleOption[] = [
  {
    key: "demografi_ho",
    backendModuleCode: "DEMOGRAFI_HO",
    validateModuleKey: "employees",
    periodMode: "STRICT_SINGLE",
    label: "Demografi Karyawan HO",
    description: "Impor demografi karyawan Head Office (wajib 1 bulan & 1 sheet per file Excel/CSV).",
    endpoint: "/employees/import",
    category: "Karyawan",
    iconName: "Users",
  },
  {
    key: "demografi_store",
    backendModuleCode: "DEMOGRAFI_STORE",
    validateModuleKey: "employees",
    periodMode: "STRICT_SINGLE",
    label: "Demografi Karyawan Toko",
    description: "Impor demografi karyawan Store/Ritel (wajib 1 bulan & 1 sheet per file Excel/CSV).",
    endpoint: "/employees/import",
    category: "Karyawan",
    iconName: "Users",
  },
  {
    key: "movement",
    backendModuleCode: "MOVEMENT",
    validateModuleKey: "movement",
    periodMode: "MULTI_CONFIRM",
    label: "Turnover & Pergerakan Karyawan",
    description: "Impor catatan turnover voluntary dan non-voluntary, resign SOP, PHK, efisiensi, dan habis kontrak.",
    endpoint: "/movement/bulk-upload",
    category: "Turnover",
    iconName: "TrendingDown",
  },
  {
    key: "compliance",
    backendModuleCode: "COMPLIANCE",
    validateModuleKey: "compliance",
    periodMode: "MULTI_CONFIRM",
    label: "Perijinan Ketenagakerjaan (WLKP, PP & K3)",
    description: "Impor matriks perijinan ketenagakerjaan (WLKP, PP, K3): entitas, nama toko, dokumen/perizinan, masa berlaku, PIC, dan status.",
    endpoint: "/compilance/import",
    category: "Kepatuhan",
    iconName: "Building2",
  },
  {
    key: "sp",
    backendModuleCode: "SP",
    validateModuleKey: "sp",
    periodMode: "MULTI_CONFIRM",
    label: "Surat Peringatan Disiplin (SP)",
    description: "Impor rekap & detail Surat Peringatan (Jumlah SP Aktif & Jumlah SP Non Aktif) untuk HO & Store.",
    endpoint: "/disciplinary/import-sp",
    category: "Disiplin",
    iconName: "AlertTriangle",
  },
  {
    key: "fraud",
    backendModuleCode: "FRAUD",
    validateModuleKey: "fraud",
    periodMode: "MULTI_CONFIRM",
    label: "Kasus Fraud & Selisih Opname",
    description: "Impor temuan audit selisih stock opname (BAKB) dan investigasi kecurangan transaksi.",
    endpoint: "/disciplinary/import-fraud",
    category: "Disiplin",
    iconName: "ShieldAlert",
  },
  {
    key: "bipartit",
    backendModuleCode: "BIPARTIT",
    validateModuleKey: "bipartit",
    periodMode: "MULTI_CONFIRM",
    label: "Hubungan Industrial (Bipartit & Mediasi)",
    description: "Impor catatan perselisihan hubungan industrial, proses mediasi Disnaker, dan status penyelesaian.",
    endpoint: "/disciplinary/import-bipartit",
    category: "Hubungan Industrial",
    iconName: "Scale",
  },
  {
    key: "attendance",
    backendModuleCode: "ATTENDANCE",
    validateModuleKey: "attendance",
    periodMode: "MULTI_CONFIRM",
    label: "Data Absensi & Kehadiran Bulanan",
    description: "Impor rekapitulasi kehadiran, sakit, izin, cuti tahunan, dan mangkir per bulan untuk HQ dan Toko.",
    endpoint: "/reporting-monthly/bulk-attendance",
    category: "Kehadiran",
    iconName: "CalendarCheck",
  },
  {
    key: "sales",
    backendModuleCode: "SALES",
    validateModuleKey: "sales",
    periodMode: "MULTI_CONFIRM",
    label: "Target & Realisasi Penjualan (Sales)",
    description: "Impor kuantiti dan omset penjualan bersih aktual per gerai toko ritel bulanan.",
    endpoint: "/reporting-monthly/bulk-sales",
    category: "Produktivitas",
    iconName: "DollarSign",
  },
]

export interface DetectedPeriodItem {
  key: string
  year: number
  month: number
  label: string
  count: number
  sampleRows?: string[]
}

export interface PeriodPolicyInfo {
  allowed: boolean
  httpStatus: number
  requiresConfirmation: boolean
  confirmStep?: number
  totalConfirmSteps?: number
  isMultiMonth?: boolean
  code?: string
  message?: string
  primaryPeriod?: DetectedPeriodItem | null
  periods: DetectedPeriodItem[]
}

export interface ImportMonthStatus {
  year: number
  month: number
  monthName: string
  periodId: string | null
  status: "SUDAH_DIINPUT" | "BELUM_DIINPUT"
  isInputted: boolean
  fileName: string | null
  totalRecords: number
  lastBatchId: string | null
  uploadedAt: string | null
}

export interface ImportYearlyStatusResponse {
  module: string
  year: number
  summary: {
    inputtedMonths: number
    uninputtedMonths: number
  }
  months: ImportMonthStatus[]
}

export interface ImportHistoryItem {
  id: string
  module: string | null
  periodId: string | null
  periodYear: number | null
  periodMonth: number | null
  fileName: string
  sourceType: string | null
  status: string | null
  totalRows: number | null
  successRows: number | null
  failedRows: number | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string | null
  period?: { id: string; year: number; month: number } | null
}

export interface ImportValidationReport {
  success: boolean
  dryRun: boolean
  canProceed: boolean
  resolvedEndpoint?: string
  periodPolicy?: PeriodPolicyInfo | null
  summary: {
    module: string
    fileName: string
    sheets: string[]
    detectedPeriods: string[]
    totalRows: number
    validRows: number
    errorCount: number
    fileDuplicateCount: number
    dbDuplicateCount: number
  }
  issues: {
    headerErrors: string[]
    rowErrors: string[]
    fileDuplicates: string[]
    dbDuplicates: string[]
  }
  errors?: string[]
  message: string
}

export interface ImportResultItem {
  moduleKey: string
  moduleLabel: string
  endpoint: string
  success: boolean
  message: string
  fileName?: string
  periods?: DetectedPeriodItem[]
  requiresConfirmation?: boolean
  confirmStep?: number
  totalConfirmSteps?: number
  errors?: string[]
}

export interface ImportResponseSummary {
  success: boolean
  message: string
  fileName?: string
  periods?: DetectedPeriodItem[]
  requiresConfirmation?: boolean
  confirmStep?: number
  totalConfirmSteps?: number
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

async function postDryRun(
  moduleKey: string,
  commitEndpoint: string,
  file: File
): Promise<ImportValidationReport> {
  const formData = new FormData()
  formData.append("file", file)
  try {
    const { data } = await api.post<ImportValidationReport>(
      `/import/validate/${moduleKey}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    if (!data || !data.dryRun || !data.summary || !data.issues) {
      throw new Error(
        "Respons validasi dari backend tidak sesuai. Pastikan server backend sudah di-restart dengan versi terbaru."
      )
    }
    return { ...data, resolvedEndpoint: commitEndpoint }
  } catch (err: any) {
    if (err?.response?.status === 404) {
      throw new Error(
        "Endpoint validasi (/import/validate) belum aktif di backend. Silakan restart server backend terlebih dahulu."
      )
    }
    throw err
  }
}

export async function validateImportFile(
  targetKey: string,
  file: File
): Promise<ImportValidationReport> {
  const mod = IMPORT_MODULES.find((m) => m.key === targetKey)
  if (!mod || mod.endpoint === "all") {
    throw new Error(`Modul target "${targetKey}" tidak valid.`)
  }

  if (mod.validateModuleKey === "sp") {
    const detailReport = await postDryRun("sp", "/disciplinary/import-sp", file)
    if (detailReport.summary.totalRows > 0 || detailReport.canProceed) {
      return detailReport
    }
    try {
      const rekapReport = await postDryRun("sp-rekap", "/disciplinary/sp-rekap/import", file)
      if (rekapReport.summary.totalRows > 0) {
        return rekapReport
      }
    } catch {
    }
    return detailReport
  }

  return await postDryRun(mod.validateModuleKey, mod.endpoint, file)
}

export async function uploadToEndpoint(
  endpoint: string,
  file: File,
  confirmStep: number = 0
): Promise<{
  success: boolean
  message: string
  fileName?: string
  periods?: DetectedPeriodItem[]
  requiresConfirmation?: boolean
  confirmStep?: number
  totalConfirmSteps?: number
  errors?: string[]
}> {
  const formData = new FormData()
  formData.append("file", file)
  if (confirmStep > 0) {
    formData.append("confirmStep", String(confirmStep))
  }

  const targetUrl =
    confirmStep > 0
      ? `${endpoint}${endpoint.includes("?") ? "&" : "?"}confirmStep=${confirmStep}`
      : endpoint

  const { data } = await api.post<ApiResponse<any> & Record<string, any>>(targetUrl, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  const errorsList = extractErrorList(data)
  const rawPeriods: DetectedPeriodItem[] | undefined =
    data?.data?.periods ||
    data?.periods ||
    (data?.data?.period ? [data.data.period] : undefined)

  return {
    success: data?.success ?? true,
    message: data?.message || "File berhasil diproses oleh backend.",
    fileName: data?.data?.fileName || data?.fileName || file.name,
    periods: rawPeriods,
    requiresConfirmation: Boolean(data?.requiresConfirmation),
    confirmStep: data?.confirmStep,
    totalConfirmSteps: data?.totalConfirmSteps,
    errors: errorsList.length > 0 ? errorsList : undefined,
  }
}

async function uploadSpCombined(
  file: File,
  confirmStep: number = 0
): Promise<{
  success: boolean
  message: string
  fileName?: string
  periods?: DetectedPeriodItem[]
  requiresConfirmation?: boolean
  confirmStep?: number
  totalConfirmSteps?: number
  errors?: string[]
}> {
  const messages: string[] = []
  const errors: string[] = []
  let anySuccess = false
  let anyResponded = false
  let resolvedFileName: string | undefined
  let resolvedPeriods: DetectedPeriodItem[] | undefined
  let needsConfirm = false
  let nextConfirmStep: number | undefined
  let totalConfirmSteps: number | undefined

  const spEndpoints = [
    { endpoint: "/disciplinary/import-sp", label: "Detail SP" },
    { endpoint: "/disciplinary/sp-rekap/import", label: "Rekap SP Toko" },
  ]

  for (const item of spEndpoints) {
    try {
      const res = await uploadToEndpoint(item.endpoint, file, confirmStep)
      anyResponded = true
      if (!resolvedFileName && res.fileName) resolvedFileName = res.fileName
      if (!resolvedPeriods && res.periods) resolvedPeriods = res.periods
      if (res.requiresConfirmation) {
        needsConfirm = true
        nextConfirmStep = res.confirmStep
        totalConfirmSteps = res.totalConfirmSteps
      }

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
    fileName: resolvedFileName || file.name,
    periods: resolvedPeriods,
    requiresConfirmation: needsConfirm || undefined,
    confirmStep: nextConfirmStep,
    totalConfirmSteps,
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
  onProgress?: (currentModule: string, index: number, total: number) => void,
  resolvedEndpoint?: string,
  confirmStep: number = 0
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

  const targetEndpoint = resolvedEndpoint || mod.endpoint

  try {
    const res =
      mod.key === "sp" && !resolvedEndpoint
        ? await uploadSpCombined(file, confirmStep)
        : await uploadToEndpoint(targetEndpoint, file, confirmStep)

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
      fileName: res.fileName || file.name,
      periods: res.periods,
      requiresConfirmation: res.requiresConfirmation,
      confirmStep: res.confirmStep,
      totalConfirmSteps: res.totalConfirmSteps,
      results: [
        {
          moduleKey: mod.key,
          moduleLabel: mod.label,
          endpoint: targetEndpoint,
          success: isOk,
          message: res.message,
          fileName: res.fileName || file.name,
          periods: res.periods,
          requiresConfirmation: res.requiresConfirmation,
          confirmStep: res.confirmStep,
          totalConfirmSteps: res.totalConfirmSteps,
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
            endpoint: targetEndpoint,
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

export async function getImportYearlyStatus(
  moduleCode: string,
  year: number
): Promise<ImportYearlyStatusResponse> {
  const { data } = await api.get<ApiResponse<ImportYearlyStatusResponse>>(
    `/import/status?module=${encodeURIComponent(moduleCode)}&year=${year}`
  )
  return data.data
}

export async function getImportHistory(
  moduleCode?: string,
  year?: number,
  limit: number = 20
): Promise<ImportHistoryItem[]> {
  const params = new URLSearchParams()
  if (moduleCode) params.append("module", moduleCode)
  if (year) params.append("year", String(year))
  params.append("limit", String(limit))
  const { data } = await api.get<ApiResponse<ImportHistoryItem[]>>(
    `/import/history?${params.toString()}`
  )
  return Array.isArray(data?.data) ? data.data : []
}
