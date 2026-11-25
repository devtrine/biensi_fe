import * as XLSX from "xlsx"
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
    description: "Impor demografi karyawan Store/Ritel (wajib 1 bulan & 1 sheet; NIK mutasi beda toko otomatis memakai baris terakhir sebagai toko aktif).",
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
  files?: string[]
  totalRecords: number
  lastBatchId: string | null
  uploadedAt: string | null
}

export interface ReimportWarningInfo {
  isDuplicateFile: boolean
  isDbDuplicate: boolean
  canReimport: boolean
  fileName: string
  matchedPeriods: Array<{
    key: string
    year: number
    month: number
    label: string
    fileName: string
    uploadedAt: string | null
    totalRecords: number
  }>
  message: string
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

export interface DemographyMutationOccurrence {
  rowNum: number
  sheetName: string
  storeLabel: string
}

export interface DemographyMutationItem {
  employeeNo: string
  fullName: string
  periodKey: string
  occurrences: DemographyMutationOccurrence[]
  originStores: string[]
  finalStore: string
  finalRowNum: number
}

export interface DemographyMutationSummary {
  totalValidRows: number
  uniqueHeadcount: number
  mutatedEmployeeCount: number
  extraRowCount: number
  items: DemographyMutationItem[]
}

export interface ImportValidationReport {
  success: boolean
  dryRun: boolean
  canProceed: boolean
  resolvedEndpoint?: string
  periodPolicy?: PeriodPolicyInfo | null
  reimportWarning?: ReimportWarningInfo | null
  mutationSummary?: DemographyMutationSummary | null
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
  requiresReimportConfirmation?: boolean
  reimportWarning?: ReimportWarningInfo | null
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
  requiresReimportConfirmation?: boolean
  reimportWarning?: ReimportWarningInfo | null
  confirmStep?: number
  totalConfirmSteps?: number
  results: ImportResultItem[]
  errors?: string[]
}

const DEMOGRAFI_MONTH_MAP: Record<string, number> = {
  jan: 1, januari: 1, january: 1,
  feb: 2, februari: 2, february: 2, peb: 2,
  mar: 3, maret: 3, march: 3,
  apr: 4, april: 4,
  mei: 5, may: 5,
  jun: 6, juni: 6, june: 6,
  jul: 7, juli: 7, july: 7,
  agu: 8, agustus: 8, aug: 8, august: 8, agt: 8,
  sep: 9, september: 9, sept: 9,
  okt: 10, oktober: 10, oct: 10, october: 10,
  nov: 11, november: 11, nop: 11,
  des: 12, desember: 12, dec: 12, december: 12,
}

const normHeaderKey = (v: unknown): string =>
  String(v ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()

const getRowValByAliases = (row: Record<string, unknown>, ...aliases: string[]): unknown => {
  const keys = Object.keys(row)
  for (const alias of aliases) {
    const target = normHeaderKey(alias)
    const match = keys.find((k) => normHeaderKey(k) === target)
    if (
      match !== undefined &&
      row[match] !== undefined &&
      row[match] !== null &&
      String(row[match]).trim() !== ""
    ) {
      return row[match]
    }
  }
  return undefined
}

const cleanDemographyStoreName = (val: unknown): string | null => {
  if (val === undefined || val === null) return null
  const s = String(val).replace(/\u00A0/g, " ").trim().toUpperCase()
  if (!s) return null
  const ignore = [
    "-", "TOTAL", "HO", "PUSAT", "KANTOR PUSAT", "HEAD OFFICE",
    "N/A", "NA", "0", "NONE", "SEMUA", "NULL",
  ]
  if (
    ignore.includes(s) ||
    s.startsWith("HO ") ||
    s.startsWith("HO-") ||
    s.includes("HEAD OFFICE") ||
    s.includes("KANTOR PUSAT")
  ) {
    return null
  }
  return s.replace(/\s+/g, " ")
}

const detectMonthYearFromLabel = (text: string): { year: number | null; month: number | null } | null => {
  if (!text) return null
  const lower = text.toLowerCase()
  let year: number | null = null
  const matchYear = lower.match(/\b(20[2-3]\d)\b/) || lower.match(/\b(20\d{2})\b/)
  if (matchYear) year = parseInt(matchYear[1], 10)

  let month: number | null = null
  const sorted = Object.entries(DEMOGRAFI_MONTH_MAP).sort((a, b) => b[0].length - a[0].length)
  for (const [mName, mNum] of sorted) {
    if (new RegExp(`(?<![a-z])${mName}(?![a-z])`).test(lower)) {
      month = mNum
      break
    }
  }
  return !month && !year ? null : { year, month }
}

const parseDemographyPeriodKey = (
  rawMonth: unknown,
  rawYear: unknown,
  fallback: { year: number; month: number }
): string => {
  let month: number | null = null
  let year: number | null = null

  if (rawMonth instanceof Date && !isNaN(rawMonth.getTime()) && rawMonth.getFullYear() >= 2020) {
    return `${rawMonth.getFullYear()}-${String(rawMonth.getMonth() + 1).padStart(2, "0")}`
  }
  if (typeof rawMonth === "number" && rawMonth >= 30000 && rawMonth <= 100000) {
    const d = new Date(Math.round((rawMonth - 25569) * 86400 * 1000))
    if (!isNaN(d.getTime()) && d.getUTCFullYear() >= 2020) {
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
    }
  }

  if (rawYear !== undefined && rawYear !== null && String(rawYear).trim() !== "") {
    const yrStr = String(rawYear).trim()
    const yrMatch = yrStr.match(/\b(20\d{2})\b/)
    if (yrMatch) {
      year = parseInt(yrMatch[1], 10)
    } else {
      const yrNum = parseInt(yrStr, 10)
      if (!isNaN(yrNum)) year = yrNum < 100 ? 2000 + yrNum : yrNum
    }
  }

  if (rawMonth !== undefined && rawMonth !== null && String(rawMonth).trim() !== "") {
    const mStr = String(rawMonth).trim().toLowerCase()
    if (!year) {
      const yrIn = mStr.match(/\b(20\d{2})\b/)
      if (yrIn) year = parseInt(yrIn[1], 10)
    }
    const sorted = Object.entries(DEMOGRAFI_MONTH_MAP).sort((a, b) => b[0].length - a[0].length)
    for (const [mName, mNum] of sorted) {
      if (new RegExp(`(?<![a-z])${mName}(?![a-z])`).test(mStr)) {
        month = mNum
        break
      }
    }
    if (!month) {
      const iso = mStr.match(/^20\d{2}[-/](\d{1,2})$/)
      if (iso) {
        month = parseInt(iso[1], 10)
      } else if (/^\d{1,2}$/.test(mStr)) {
        const mNum = parseInt(mStr, 10)
        if (mNum >= 1 && mNum <= 12) month = mNum
      }
    }
  }

  const finalYear = year && year >= 2020 && year <= 2100 ? year : fallback.year
  const finalMonth = month && month >= 1 && month <= 12 ? month : fallback.month
  return `${finalYear}-${String(finalMonth).padStart(2, "0")}`
}

/**
 * Inspeksi client-side untuk mendeteksi 1 NIK yang muncul di >1 toko dalam bulan yang sama (kasus mutasi).
 * Mengikuti aturan backend: baris paling bawah di Excel menjadi toko aktif akhir pada bulan tersebut.
 */
export async function inspectDemographyMutations(
  file: File
): Promise<DemographyMutationSummary | null> {
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) return null

    let targetSheets = workbook.SheetNames.filter((name) => {
      const l = name.toLowerCase()
      return l.includes("demografi") || l.includes("karyawan") || l.includes("pegawai")
    })
    if (targetSheets.length === 0) {
      targetSheets = workbook.SheetNames.filter((name) => {
        const l = name.toLowerCase()
        if (
          [
            "turnover", "kehadiran", "sales", "fraud", "kasus",
            "phase", "wlkp", "critical", "visual", "panduan",
          ].some((k) => l.includes(k))
        ) {
          return false
        }
        const preview = XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[name], { header: 1 }).slice(0, 6)
        const flat = preview.flat().map(normHeaderKey).join(" ")
        return flat.includes("employeeno") || flat.includes("namakaryawan") || flat.includes("nik")
      })
    }
    if (targetSheets.length === 0) targetSheets = [workbook.SheetNames[0]]

    const now = new Date()
    const filePeriodHint = detectMonthYearFromLabel(file.name)

    interface ParsedMutationRow {
      empNo: string
      fullName: string
      periodKey: string
      storeKey: string
      storeLabel: string
      rowNum: number
      sheetName: string
    }

    const parsedRows: ParsedMutationRow[] = []

    for (const sheetName of targetSheets) {
      const sheet = workbook.Sheets[sheetName]
      const matrix = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 })
      if (matrix.length === 0) continue

      let headerRowIdx = -1
      for (let r = 0; r < Math.min(10, matrix.length); r++) {
        const rowNorm = (matrix[r] || []).map(normHeaderKey)
        if (rowNorm.some((c) => ["employeeno", "nik", "idkaryawan", "namakaryawan"].includes(c))) {
          headerRowIdx = r
          break
        }
      }
      if (headerRowIdx === -1) continue

      const titleHint = detectMonthYearFromLabel(
        matrix.slice(0, Math.min(6, matrix.length)).flat().join(" ")
      )
      const sheetHint = detectMonthYearFromLabel(sheetName)
      const fallbackPeriod = {
        year: sheetHint?.year || titleHint?.year || filePeriodHint?.year || now.getFullYear(),
        month: sheetHint?.month || titleHint?.month || filePeriodHint?.month || now.getMonth() + 1,
      }

      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { range: headerRowIdx })
      rows.forEach((row, idx) => {
        const rowNum = headerRowIdx + 2 + idx
        const rawEmpNo = getRowValByAliases(row, "employeeno", "nik", "idkaryawan")
        const rawName = getRowValByAliases(row, "namakaryawan", "nama", "name")
        const empNoClean = String(rawEmpNo ?? "")
          .trim()
          .replace(/^['"`\s]+/, "")
          .toUpperCase()
        const nameClean = String(rawName ?? "")
          .replace(/\u00A0/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .toUpperCase()

        if (!empNoClean && !nameClean) return
        if (
          ["TOTAL", "SUM", "SUBTOTAL", "RATA-RATA", "1"].includes(empNoClean) &&
          (!nameClean || nameClean === "TOTAL" || /^\d+$/.test(nameClean))
        ) {
          return
        }
        if (/^\d+$/.test(empNoClean) && /^\d+$/.test(nameClean)) return
        if (empNoClean.length < 3) return

        const rawBulan = getRowValByAliases(
          row, "bulan", "month", "periode", "period", "bulantahun", "cutoff", "tanggal"
        )
        const rawTahun = getRowValByAliases(row, "tahun", "year", "periode", "period", "bulantahun")
        const periodKey = parseDemographyPeriodKey(rawBulan, rawTahun, fallbackPeriod)

        const store = cleanDemographyStoreName(
          getRowValByAliases(row, "namatoko", "store", "storename", "showroom", "toko")
        )
        const storeKey = store || "HO"
        const storeLabel = store || "HO (Kantor Pusat)"

        parsedRows.push({
          empNo: empNoClean,
          fullName: nameClean || `KARYAWAN ${empNoClean}`,
          periodKey,
          storeKey,
          storeLabel,
          rowNum,
          sheetName,
        })
      })
    }

    if (parsedRows.length === 0) return null

    const grouped = new Map<string, ParsedMutationRow[]>()
    for (const r of parsedRows) {
      const k = `${r.empNo}|${r.periodKey}`
      const list = grouped.get(k)
      if (list) list.push(r)
      else grouped.set(k, [r])
    }

    const items: DemographyMutationItem[] = []
    let extraRowCount = 0

    for (const group of grouped.values()) {
      if (group.length < 2) continue
      const distinctStores = new Set(group.map((g) => g.storeKey))
      if (distinctStores.size < 2) continue

      const finalRow = group[group.length - 1]
      const occurrences: DemographyMutationOccurrence[] = group.map((g) => ({
        rowNum: g.rowNum,
        sheetName: g.sheetName,
        storeLabel: g.storeLabel,
      }))

      extraRowCount += group.length - 1
      items.push({
        employeeNo: finalRow.empNo,
        fullName: finalRow.fullName,
        periodKey: finalRow.periodKey,
        occurrences,
        originStores: occurrences.slice(0, -1).map((o) => o.storeLabel),
        finalStore: finalRow.storeLabel,
        finalRowNum: finalRow.rowNum,
      })
    }

    if (items.length === 0) return null

    return {
      totalValidRows: parsedRows.length,
      uniqueHeadcount: grouped.size,
      mutatedEmployeeCount: items.length,
      extraRowCount,
      items,
    }
  } catch {
    return null
  }
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
  confirmStep: number = 0,
  allowReimport: boolean = false
): Promise<{
  success: boolean
  message: string
  fileName?: string
  periods?: DetectedPeriodItem[]
  requiresConfirmation?: boolean
  requiresReimportConfirmation?: boolean
  reimportWarning?: ReimportWarningInfo | null
  confirmStep?: number
  totalConfirmSteps?: number
  errors?: string[]
}> {
  const formData = new FormData()
  formData.append("file", file)
  if (confirmStep > 0) {
    formData.append("confirmStep", String(confirmStep))
  }
  if (allowReimport) {
    formData.append("allowReimport", "true")
  }

  const queryParts: string[] = []
  if (confirmStep > 0) queryParts.push(`confirmStep=${confirmStep}`)
  if (allowReimport) queryParts.push("allowReimport=true")
  const targetUrl =
    queryParts.length > 0
      ? `${endpoint}${endpoint.includes("?") ? "&" : "?"}${queryParts.join("&")}`
      : endpoint

  const { data } = await api.post<ApiResponse<any> & Record<string, any>>(targetUrl, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  const errorsList = extractErrorList(data)
  const rawPeriods: DetectedPeriodItem[] | undefined =
    data?.data?.periods ||
    data?.periods ||
    (data?.data?.period ? [data.data.period] : undefined)

  const requiresReimportConfirmation = Boolean(
    data?.requiresReimportConfirmation || data?.code === "DUPLICATE_FILE_REIMPORT_CONFIRM"
  )

  return {
    success: data?.success ?? true,
    message: data?.message || "File berhasil diproses oleh backend.",
    fileName: data?.data?.fileName || data?.fileName || file.name,
    periods: rawPeriods,
    requiresConfirmation: Boolean(data?.requiresConfirmation),
    requiresReimportConfirmation,
    reimportWarning: (data?.reimportWarning as ReimportWarningInfo | undefined) ?? null,
    confirmStep: data?.confirmStep,
    totalConfirmSteps: data?.totalConfirmSteps,
    errors: errorsList.length > 0 ? errorsList : undefined,
  }
}

async function uploadSpCombined(
  file: File,
  confirmStep: number = 0,
  allowReimport: boolean = false
): Promise<{
  success: boolean
  message: string
  fileName?: string
  periods?: DetectedPeriodItem[]
  requiresConfirmation?: boolean
  requiresReimportConfirmation?: boolean
  reimportWarning?: ReimportWarningInfo | null
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
  let needsReimportConfirm = false
  let resolvedReimportWarning: ReimportWarningInfo | null = null
  let nextConfirmStep: number | undefined
  let totalConfirmSteps: number | undefined

  const spEndpoints = [
    { endpoint: "/disciplinary/import-sp", label: "Detail SP" },
    { endpoint: "/disciplinary/sp-rekap/import", label: "Rekap SP Toko" },
  ]

  for (const item of spEndpoints) {
    try {
      const res = await uploadToEndpoint(item.endpoint, file, confirmStep, allowReimport)
      anyResponded = true
      if (!resolvedFileName && res.fileName) resolvedFileName = res.fileName
      if (!resolvedPeriods && res.periods) resolvedPeriods = res.periods
      if (res.requiresConfirmation) {
        needsConfirm = true
        nextConfirmStep = res.confirmStep
        totalConfirmSteps = res.totalConfirmSteps
      }
      if (res.requiresReimportConfirmation) {
        needsReimportConfirm = true
        if (!resolvedReimportWarning && res.reimportWarning) {
          resolvedReimportWarning = res.reimportWarning
        }
        if (res.message && !messages.includes(res.message)) {
          messages.push(res.message)
        }
      }

      if (res.success !== false) {
        anySuccess = true
        messages.push(res.message)
      } else if (!res.requiresReimportConfirmation && !res.errors?.length && res.message) {
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
    requiresReimportConfirmation: needsReimportConfirm || undefined,
    reimportWarning: resolvedReimportWarning,
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
  confirmStep: number = 0,
  allowReimport: boolean = false
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
        ? await uploadSpCombined(file, confirmStep, allowReimport)
        : await uploadToEndpoint(targetEndpoint, file, confirmStep, allowReimport)

    const isOk = res.success !== false
    const needsReimportConfirm = Boolean(res.requiresReimportConfirmation)
    const modErrors =
      res.errors && res.errors.length > 0
        ? res.errors
        : !needsReimportConfirm && (!isOk || hasFailureCount(res.message))
          ? [res.message]
          : undefined

    return {
      success: isOk,
      message: res.message,
      fileName: res.fileName || file.name,
      periods: res.periods,
      requiresConfirmation: res.requiresConfirmation,
      requiresReimportConfirmation: needsReimportConfirm || undefined,
      reimportWarning: res.reimportWarning ?? null,
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
          requiresReimportConfirmation: needsReimportConfirm || undefined,
          reimportWarning: res.reimportWarning ?? null,
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
