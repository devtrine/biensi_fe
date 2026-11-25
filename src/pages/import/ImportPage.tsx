import React, { useState, useRef, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  FileSpreadsheet,
  RotateCcw,
  Check,
  ArrowRight,
  ArrowLeft,
  Layers,
  HelpCircle,
  Download,
  Copy,
  CheckCheck,
  ChevronDown,
  ShieldCheck,
  Database,
  FileWarning,
  Calendar,
} from "lucide-react"
import {
  IMPORT_MODULES,
  type ImportModuleOption,
  type ReimportWarningInfo,
} from "../../services/import.service"
import {
  useImportExcel,
  useImportYearlyStatus,
  useValidateImport,
} from "../../hooks/use-import"
import { usePersistedState } from "../../hooks/use-persisted-state"
import { downloadExcelTemplate } from "../../services/template.service"
import { useCurrentUser } from "../../hooks/use-auth"
import { hasPermission } from "../../lib/permissions"
import { AccessDeniedCard } from "../../components/ui/AccessDeniedCard"

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

function formatPeriodKeyLabel(periodKey: string): string {
  const [yStr, mStr] = periodKey.split("-")
  const m = Number(mStr)
  if (!yStr || !m || m < 1 || m > 12) return periodKey
  return `${MONTH_NAMES_ID[m - 1]} ${yStr}`
}

export const ImportPage: React.FC = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: currentUser } = useCurrentUser()
  const canAccessImport =
    hasPermission(currentUser, "import", "create") ||
    hasPermission(currentUser, "import", "view")

  const [selectedModuleKey, setSelectedModuleKey] = usePersistedState<string>(
    "biensi:filter:import:module",
    IMPORT_MODULES[0]?.key || "demografi_ho",
    (v): v is string => typeof v === "string" && IMPORT_MODULES.some((m) => m.key === v)
  )
  const [statusYear, setStatusYear] = usePersistedState<number>(
    "biensi:filter:import:year",
    () => new Date().getFullYear(),
    (v): v is number => typeof v === "number" && v >= 2020 && v <= 2100
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [clientValidationNotice, setClientValidationNotice] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true)
  const [isSubmittedCurrentFile, setIsSubmittedCurrentFile] = useState<boolean>(false)
  const [multiMonthConfirmStage, setMultiMonthConfirmStage] = useState<0 | 1 | 2>(0)
  const [reimportConfirmed, setReimportConfirmed] = useState<boolean>(false)

  const {
    mutate: runValidate,
    isPending: isValidating,
    isError: isValidateError,
    data: validationReport,
    errorMessage: validateErrorMessage,
    reset: resetValidation,
  } = useValidateImport()

  const {
    mutate: runImport,
    isPending,
    isSuccess,
    isError,
    data: importResult,
    progressStep,
    progressPercent,
    errorMessage,
    reset: resetMutation,
  } = useImportExcel()

  const currentModule: ImportModuleOption =
    IMPORT_MODULES.find((m) => m.key === selectedModuleKey) || IMPORT_MODULES[0]

  const effectiveStatusModuleCode =
    currentModule.key === "sp" && validationReport?.resolvedEndpoint?.includes("sp-rekap")
      ? "SP_REKAP"
      : currentModule.backendModuleCode

  const {
    data: yearlyStatus,
  } = useImportYearlyStatus(effectiveStatusModuleCode, statusYear)

  const statusYearOptions = useMemo(() => {
    const nowYear = new Date().getFullYear()
    const years = new Set<number>([nowYear - 2, nowYear - 1, nowYear, nowYear + 1, statusYear])
    ;(validationReport?.summary?.detectedPeriods || []).forEach((pk) => {
      const y = Number(pk.split("-")[0])
      if (y >= 2020 && y <= 2100) years.add(y)
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [statusYear, validationReport])

  useEffect(() => {
    const firstKey = validationReport?.summary?.detectedPeriods?.[0]
    if (firstKey) {
      const y = Number(firstKey.split("-")[0])
      if (y >= 2020 && y <= 2100) {
        setStatusYear(y)
      }
    }
  }, [validationReport])

  const detectedPeriodsSet = useMemo(() => {
    return new Set(validationReport?.summary?.detectedPeriods || [])
  }, [validationReport])

  const isDemographyPolicyRejected = useMemo(() => {
    if (currentModule.periodMode !== "STRICT_SINGLE" || !validationReport) return false
    const code = validationReport.periodPolicy?.code
    return (
      !validationReport.canProceed &&
      Boolean(validationReport.periodPolicy && !validationReport.periodPolicy.allowed) &&
      (code === "MULTI_SHEET_NOT_ALLOWED" || code === "DEMOGRAPHY_MULTI_MONTH_REJECTED")
    )
  }, [currentModule.periodMode, validationReport])

  const effectiveReimportWarning: ReimportWarningInfo | null = useMemo(() => {
    if (validationReport?.reimportWarning?.canReimport) {
      return validationReport.reimportWarning
    }
    if (
      !validationReport ||
      !selectedFile ||
      isDemographyPolicyRejected ||
      (validationReport.summary?.errorCount ?? 0) > 0 ||
      (validationReport.summary?.fileDuplicateCount ?? 0) > 0 ||
      (validationReport.summary?.totalRows ?? 0) === 0
    ) {
      return null
    }

    const uploadedNameLower = selectedFile.name.trim().toLowerCase()
    const detected = validationReport.summary?.detectedPeriods || []
    const matchedFromStatus = (yearlyStatus?.months || [])
      .filter((m) => {
        const key = `${m.year}-${String(m.month).padStart(2, "0")}`
        if (!detected.includes(key) || !m.isInputted) return false
        const matchPrimary = (m.fileName || "").trim().toLowerCase() === uploadedNameLower
        const matchHistory = Boolean(
          m.files?.some((f) => f.trim().toLowerCase() === uploadedNameLower)
        )
        return matchPrimary || matchHistory
      })
      .map((m) => ({
        key: `${m.year}-${String(m.month).padStart(2, "0")}`,
        year: m.year,
        month: m.month,
        label: `${m.monthName} ${m.year}`,
        fileName: m.fileName || selectedFile.name,
        uploadedAt: m.uploadedAt,
        totalRecords: m.totalRecords,
      }))

    if (matchedFromStatus.length === 0) return null

    const labels = matchedFromStatus.map((p) => p.label).join(", ")
    return {
      isDuplicateFile: true,
      isDbDuplicate: false,
      canReimport: true,
      fileName: selectedFile.name,
      matchedPeriods: matchedFromStatus,
      message: `File "${selectedFile.name}" sudah pernah dimasukkan pada bulan ${labels}. Apakah Anda yakin ingin memasukkan lagi file yang sama?`,
    }
  }, [validationReport, selectedFile, isDemographyPolicyRejected, yearlyStatus])

  const hasReimportAlert = useMemo(() => {
    return Boolean(
      effectiveReimportWarning?.canReimport &&
        (effectiveReimportWarning.isDuplicateFile || effectiveReimportWarning.isDbDuplicate)
    )
  }, [effectiveReimportWarning])

  const canProceedEffective = useMemo(() => {
    if (!validationReport) return false
    if (hasReimportAlert && !reimportConfirmed) return false
    return Boolean(validationReport.canProceed || (hasReimportAlert && reimportConfirmed))
  }, [validationReport, hasReimportAlert, reimportConfirmed])

  const isMultiMonthGeneral = useMemo(() => {
    if (currentModule.periodMode !== "MULTI_CONFIRM") return false
    if (!validationReport?.canProceed && !hasReimportAlert) return false
    const detectedCount = validationReport?.summary?.detectedPeriods?.length ?? 0
    return Boolean(validationReport?.periodPolicy?.requiresConfirmation) || detectedCount > 1
  }, [currentModule.periodMode, validationReport, hasReimportAlert])

  const isBusy = isValidating || isPending

  const currentStep: 1 | 2 | 3 = useMemo(() => {
    if (isSuccess || isError) return 3
    if ((validationReport?.canProceed || hasReimportAlert) && selectedFile && !isValidating) return 2
    return 1
  }, [isSuccess, isError, validationReport, hasReimportAlert, selectedFile, isValidating])

  const triggerValidation = (moduleKey: string, file: File) => {
    resetMutation()
    resetValidation()
    setIsSubmittedCurrentFile(false)
    setMultiMonthConfirmStage(0)
    setReimportConfirmed(false)
    setIsDetailsOpen(true)
    runValidate({ targetKey: moduleKey, file })
  }

  const handleFile = (file: File) => {
    setClientValidationNotice(null)
    const validExtensions = [".xlsx", ".xls", ".csv"]
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!validExtensions.includes(fileExt)) {
      setClientValidationNotice("Format berkas harus .xlsx, .xls, atau .csv.")
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setClientValidationNotice("Ukuran berkas melebihi batas maksimum 50MB.")
      return
    }

    setSelectedFile(file)
    triggerValidation(selectedModuleKey, file)
  }

  const handleModuleChange = (modKey: string) => {
    if (isBusy) return
    setSelectedModuleKey(modKey)
    setClientValidationNotice(null)
    if (selectedFile && !isSuccess) {
      triggerValidation(modKey, selectedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    // Reset value agar memilih file yang sama setelah diperbaiki tetap memicu onChange
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isBusy) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (isBusy) return
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleConfirmImport = (confirmStepOverride?: number, forceAllowReimport?: boolean) => {
    const allowReimport = forceAllowReimport ?? hasReimportAlert
    const allowedNow = validationReport?.canProceed || (hasReimportAlert && (reimportConfirmed || allowReimport))
    if (!selectedFile || !allowedNow || isBusy || isSubmittedCurrentFile) {
      return
    }

    if (isMultiMonthGeneral && multiMonthConfirmStage < 2 && confirmStepOverride !== 2) {
      setMultiMonthConfirmStage(2)
      return
    }

    const finalConfirmStep = confirmStepOverride ?? (isMultiMonthGeneral ? 2 : 0)
    setIsSubmittedCurrentFile(true)
    runImport({
      targetKey: selectedModuleKey,
      file: selectedFile,
      resolvedEndpoint: validationReport?.resolvedEndpoint,
      confirmStep: finalConfirmStep,
      allowReimport,
    })
  }

  const handleConfirmReimport = () => {
    if (!selectedFile || !validationReport || isBusy) return
    setReimportConfirmed(true)
    if (!isMultiMonthGeneral) {
      handleConfirmImport(0, true)
    }
  }

  const handleReset = () => {
    resetMutation()
    resetValidation()
    setSelectedFile(null)
    setClientValidationNotice(null)
    setIsSubmittedCurrentFile(false)
    setMultiMonthConfirmStage(0)
    setReimportConfirmed(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validationIssueGroups = useMemo(() => {
    if (!validationReport?.issues) return []
    const { headerErrors, rowErrors, fileDuplicates, dbDuplicates } = validationReport.issues
    return [
      { key: "header", title: "Error Header / Typo Kolom", items: headerErrors || [], tone: "red" as const },
      { key: "row", title: "Error Data / Format Baris", items: rowErrors || [], tone: "red" as const },
      { key: "fileDup", title: "Duplikat di Dalam Berkas Excel", items: fileDuplicates || [], tone: "amber" as const },
      { key: "dbDup", title: "Duplikat dengan Data di Database", items: dbDuplicates || [], tone: "amber" as const },
    ].filter((g) => g.items.length > 0)
  }, [validationReport])

  const allValidationIssues = useMemo(
    () => validationIssueGroups.flatMap((g) => g.items.map((item) => `[${g.title}] ${item}`)),
    [validationIssueGroups]
  )

  const allFailures = useMemo(() => {
    if (!importResult) return []
    const list: string[] = []
    if (importResult.errors && Array.isArray(importResult.errors)) {
      list.push(...importResult.errors)
    }
    if (importResult.results) {
      for (const r of importResult.results) {
        if (r.errors && Array.isArray(r.errors)) {
          for (const err of r.errors) {
            if (!list.includes(err)) list.push(err)
          }
        }
      }
    }
    return list
  }, [importResult])

  const isZeroSuccessMessage = (msg?: string) =>
    /Sukses:\s*0\b/i.test(msg || "") ||
    /Berhasil memproses(?:\s+data\s+dari)?\s+0\b/i.test(msg || "")

  const hasAnyFailure = useMemo(() => {
    if (!importResult) return false
    return (
      !importResult.success ||
      allFailures.length > 0 ||
      Boolean(importResult.results?.some((r) => !r.success || (r.errors && r.errors.length > 0))) ||
      /Gagal:\s*[1-9]\d*/i.test(importResult.message || "")
    )
  }, [importResult, allFailures])

  const allFailedCompletely = useMemo(() => {
    if (!importResult || !hasAnyFailure) return false
    if (!importResult.success) return true
    const results = importResult.results || []
    if (results.length === 0) return isZeroSuccessMessage(importResult.message)
    return results.every((r) => {
      const modFailed =
        !r.success ||
        (r.errors && r.errors.length > 0) ||
        /Gagal:\s*[1-9]\d*/i.test(r.message || "")
      return !r.success || (modFailed && isZeroSuccessMessage(r.message))
    })
  }, [importResult, hasAnyFailure])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const copyText = (lines: string[]) => {
    navigator.clipboard.writeText(lines.join("\n"))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  if (!canAccessImport) {
    return (
      <AccessDeniedCard
        title="Akses Impor Data Terbatas"
        description="Peran akun Anda tidak memiliki izin untuk mengimpor berkas Excel."
      />
    )
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Impor Berkas Excel & Sinkronisasi Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan typo &amp; duplikat otomatis (file &amp; database) sebelum konfirmasi impor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => downloadExcelTemplate("auto")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
            title="Unduh seluruh template Excel resmi"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Template Excel Keseluruhan</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Stepper 3 Tahap */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { num: 1, title: "Pilih & Cek Otomatis" },
            { num: 2, title: "Konfirmasi Impor" },
            { num: 3, title: "Hasil Impor" },
          ].map((step) => {
            const isDone = currentStep > step.num
            const isActive = currentStep === step.num
            return (
              <div
                key={step.num}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isActive
                    ? "border-red-300 bg-red-50/40"
                    : isDone
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-slate-200/80 bg-slate-50/50"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isDone
                      ? "bg-emerald-600/85 text-white"
                      : isActive
                        ? "bg-slate-900 text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{step.title}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pilihan Target Modul */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            Pilih Target Modul Ingesti
          </h3>

          <button
            type="button"
            onClick={() => downloadExcelTemplate(selectedModuleKey)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 shadow-2xs transition-all cursor-pointer self-start md:self-auto"
            title={`Unduh format file Excel (.xlsx) acuan untuk ${currentModule.label}`}
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Unduh Template ({currentModule.label})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {IMPORT_MODULES.map((mod) => {
            const isSelected = selectedModuleKey === mod.key
            const locked = isBusy || isSuccess
            return (
              <button
                key={mod.key}
                type="button"
                disabled={locked}
                onClick={() => handleModuleChange(mod.key)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-slate-700 bg-slate-50 ring-1 ring-slate-700/15 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50/70 hover:border-slate-300"
                } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileSpreadsheet
                      className={`w-4 h-4 shrink-0 ${isSelected ? "text-slate-800" : "text-slate-400"}`}
                    />
                    <span className="text-xs font-bold text-slate-900 truncate">{mod.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        mod.periodMode === "STRICT_SINGLE"
                          ? "bg-rose-50/70 text-rose-700/85 border-rose-200/70"
                          : "bg-slate-100 text-slate-600 border-slate-200/80"
                      }`}
                    >
                      {mod.periodMode === "STRICT_SINGLE" ? "1 Bulan" : "Multi-Bulan"}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-slate-800" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status Input Data & Identifikasi File Excel per Periode (Jan - Des) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Status Input &amp; Identifikasi File Excel — {currentModule.label}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pantau bulan yang sudah atau belum diinput beserta nama file Excel sumbernya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {yearlyStatus && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50/60 text-emerald-700/85 border border-emerald-200/70">
                  Sudah: {yearlyStatus.summary.inputtedMonths}/12
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                  Belum: {yearlyStatus.summary.uninputtedMonths}
                </span>
              </div>
            )}
            <select
              value={statusYear}
              onChange={(e) => setStatusYear(Number(e.target.value))}
              className="px-3 py-1.5 text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              aria-label="Pilih Tahun Status Import"
            >
              {statusYearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  Tahun {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 overflow-visible">
          {(yearlyStatus?.months ||
            MONTH_NAMES_ID.map((monthName, idx) => ({
              year: statusYear,
              month: idx + 1,
              monthName,
              periodId: null,
              status: "BELUM_DIINPUT" as const,
              isInputted: false,
              fileName: null,
              files: [] as string[],
              totalRecords: 0,
              lastBatchId: null,
              uploadedAt: null,
            }))
          ).map((m, idx) => {
            const pKey = `${statusYear}-${String(m.month).padStart(2, "0")}`
            const isTargetedBySelectedFile = Boolean(selectedFile) && detectedPeriodsSet.has(pKey)
            const edgeAlignClass =
              idx % 6 === 0
                ? "left-0"
                : idx % 6 === 5
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2"
            return (
              <div
                key={m.month}
                className={`relative group p-3 rounded-xl border text-left transition-all ${
                  isTargetedBySelectedFile
                    ? "border-slate-500 bg-slate-100/70 ring-1 ring-slate-400/25"
                    : m.isInputted
                      ? "border-slate-200 border-l-4 border-l-emerald-500/60 bg-white hover:border-slate-300"
                      : "border-slate-200/90 bg-slate-50/50 hover:border-slate-300"
                }`}
              >
                {/* Tooltip Hover Detail File yang Diimport */}
                <div
                  role="tooltip"
                  className={`pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute bottom-full ${edgeAlignClass} mb-2 z-50 w-72 p-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700/80 text-left space-y-1.5`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5">
                    <span className="text-xs font-bold text-white">
                      {m.monthName} {statusYear}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        m.isInputted
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {m.isInputted ? "Sudah Diinput" : "Belum Diinput"}
                    </span>
                  </div>

                  {m.isInputted ? (
                    <div className="space-y-1 text-[11px]">
                      <div className="text-slate-400">File diimport:</div>
                      <div className="font-mono text-slate-100 break-all font-semibold">
                        {m.fileName || "Data tersimpan (nama file belum tercatat)"}
                      </div>
                      {m.files && m.files.length > 1 && (
                        <div className="pt-1 border-t border-slate-800 space-y-0.5">
                          <div className="text-[10px] text-slate-400">Riwayat file lain:</div>
                          {m.files.slice(1, 4).map((fn) => (
                            <div key={fn} className="text-[10px] font-mono text-slate-300 break-all">
                              • {fn}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-300 pt-0.5">
                        {m.totalRecords} baris
                        {m.uploadedAt
                          ? ` • ${new Date(m.uploadedAt).toLocaleString("id-ID")}`
                          : ""}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-300">
                      Belum ada file yang diimport pada bulan ini.
                    </div>
                  )}

                  {isTargetedBySelectedFile && selectedFile && (
                    <div className="pt-1 border-t border-slate-700 text-[10px] font-mono text-slate-200 break-all">
                      File baru terpilih: {selectedFile.name}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900">{m.monthName}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      m.isInputted
                        ? "bg-emerald-50/70 text-emerald-700/85 border-emerald-200/70"
                        : "bg-slate-100 text-slate-500 border-slate-200/70"
                    }`}
                  >
                    {m.isInputted ? "Sudah" : "Belum"}
                  </span>
                </div>

                {m.isInputted ? (
                  <div className="mt-1.5 space-y-0.5">
                    <div className="text-[11px] font-mono text-slate-800 truncate font-medium">
                      {m.fileName || "Data tersimpan"}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {m.totalRecords} baris
                      {m.uploadedAt
                        ? ` • ${new Date(m.uploadedAt).toLocaleDateString("id-ID")}`
                        : ""}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1.5 text-[10px] text-slate-400">Belum ada data</div>
                )}

                {isTargetedBySelectedFile && selectedFile && (
                  <div className="mt-1.5 px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 border border-slate-300/70 text-[10px] font-mono truncate">
                    File baru: {selectedFile.name}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tahap 1 & Tahap 2: Upload Dropzone, Pre-Check, & Konfirmasi User */}
      {!isSuccess && !isError && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isBusy && fileInputRef.current?.click()}
            className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
              isDragging
                ? "border-slate-600 bg-slate-100/80 scale-[0.99]"
                : selectedFile
                  ? canProceedEffective
                    ? "border-emerald-300/80 bg-white"
                    : hasReimportAlert
                      ? "border-amber-300/80 bg-white"
                      : validationReport && !validationReport.canProceed
                        ? "border-red-300/70 bg-white"
                        : "border-slate-300 bg-slate-50/60"
                  : "border-slate-300 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-400"
            } ${isBusy ? "pointer-events-none opacity-70" : ""}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 mx-auto flex items-center justify-center shadow-xs mb-3">
              {selectedFile ? (
                <FileSpreadsheet
                  className={`w-8 h-8 ${
                    canProceedEffective
                      ? "text-emerald-600/80"
                      : hasReimportAlert
                        ? "text-amber-600/80"
                        : validationReport && !validationReport.canProceed
                          ? "text-red-600/80"
                          : "text-slate-700"
                  }`}
                />
              ) : (
                <UploadCloud className="w-8 h-8 text-slate-600" />
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${
                    isValidating
                      ? "bg-slate-100 text-slate-700 border-slate-200"
                      : canProceedEffective
                        ? "bg-emerald-50/70 text-emerald-700/90 border-emerald-200/70"
                        : hasReimportAlert
                          ? "bg-amber-50/70 text-amber-800/90 border-amber-200/70"
                          : validationReport && !validationReport.canProceed
                            ? "bg-red-50/70 text-red-700/90 border-red-200/70"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {isValidating
                    ? "Sedang Memeriksa Berkas..."
                    : canProceedEffective
                      ? "Lolos Validasi — Siap Dikonfirmasi"
                      : hasReimportAlert
                        ? "File Sudah Pernah Diinput — Menunggu Konfirmasi Ulang"
                        : validationReport && !validationReport.canProceed
                          ? "Validasi Ditolak — Perlu Perbaikan"
                          : "Berkas Terpilih"}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedFile.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Ukuran: {formatFileSize(selectedFile.size)} • Diubah:{" "}
                  {new Date(selectedFile.lastModified).toLocaleDateString("id-ID")}
                </p>
                {!isBusy && (
                  <p className="text-xs text-slate-400 pt-2">
                    Klik atau seret berkas lain untuk mengganti (pengecekan berjalan otomatis)
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Tarik &amp; Letakkan Berkas Excel di Sini
                </h3>
                <p className="text-xs text-slate-500">
                  Mendukung format .xlsx dan .xls hingga 50MB • Sistem akan otomatis memeriksa typo &amp; duplikat terlebih dahulu
                </p>
                <div className="pt-3">
                  <span className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors">
                    Pilih Berkas dari Komputer
                  </span>
                </div>
              </div>
            )}
          </div>

          {clientValidationNotice && (
            <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-amber-400/75 rounded-xl flex items-center gap-3 text-xs text-slate-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600/80" />
              <span>{clientValidationNotice}</span>
            </div>
          )}

          {/* Status Auto Pre-Check Sedang Berjalan */}
          {isValidating && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">
                  Memeriksa Berkas Excel (Dry-Run Validation)...
                </div>
                <div className="text-slate-500 mt-0.5">
                  Mengecek typo header, format kolom, duplikat internal berkas, serta duplikat terhadap database. Belum ada data yang disimpan.
                </div>
              </div>
            </div>
          )}

          {/* Error saat memanggil endpoint dry-run */}
          {isValidateError && !isValidating && (
            <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-red-400/75 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <XCircle className="w-4 h-4 text-red-600/80 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Gagal Menjalankan Pemeriksaan Berkas</div>
                  <p className="mt-0.5 text-slate-600">
                    {validateErrorMessage || "Tidak dapat memvalidasi berkas di server."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => triggerValidation(selectedModuleKey, selectedFile)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cek Ulang
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Ganti Berkas
                </button>
              </div>
            </div>
          )}

          {/* Hasil Dry-Run Validation */}
          {validationReport && validationReport.summary && !isValidating && !isPending && (
            <div className="space-y-4">
              {/* 4 Metrik Ringkasan Validasi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/90">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Total Baris
                  </span>
                  <span className="text-xl font-black font-mono text-slate-900 tabular-nums">
                    {validationReport.summary.totalRows ?? 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 border-l-4 border-l-emerald-500/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Baris Valid
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-700/90 tabular-nums">
                    {validationReport.summary.validRows ?? 0}
                  </span>
                </div>
                <div
                  className={`p-3.5 rounded-xl border border-slate-200/90 bg-white ${
                    (validationReport.summary.errorCount ?? 0) > 0
                      ? "border-l-4 border-l-red-400/75"
                      : ""
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Typo / Error
                  </span>
                  <span
                    className={`text-xl font-black font-mono tabular-nums ${
                      (validationReport.summary.errorCount ?? 0) > 0 ? "text-red-700/85" : "text-slate-900"
                    }`}
                  >
                    {validationReport.summary.errorCount ?? 0}
                  </span>
                </div>
                <div
                  className={`p-3.5 rounded-xl border border-slate-200/90 bg-white ${
                    (validationReport.summary.fileDuplicateCount ?? 0) +
                      (validationReport.summary.dbDuplicateCount ?? 0) >
                    0
                      ? "border-l-4 border-l-amber-400/75"
                      : ""
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Duplikat (File / DB)
                  </span>
                  <span
                    className={`text-xl font-black font-mono tabular-nums ${
                      (validationReport.summary.fileDuplicateCount ?? 0) +
                        (validationReport.summary.dbDuplicateCount ?? 0) >
                      0
                        ? "text-amber-700/90"
                        : "text-slate-900"
                    }`}
                  >
                    {validationReport.summary.fileDuplicateCount ?? 0} /{" "}
                    {validationReport.summary.dbDuplicateCount ?? 0}
                  </span>
                </div>
              </div>

              {/* Info File, Sheet & Periode Terdeteksi */}
              {((validationReport.summary.sheets?.length ?? 0) > 0 ||
                (validationReport.summary.detectedPeriods?.length ?? 0) > 0 ||
                selectedFile) && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-700">
                  {selectedFile && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
                      File Excel: {selectedFile.name}
                    </span>
                  )}
                  {(validationReport.summary.sheets?.length ?? 0) > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
                      Sheet: {validationReport.summary.sheets.join(", ")}
                    </span>
                  )}
                  {(validationReport.summary.detectedPeriods?.length ?? 0) > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
                      Periode:{" "}
                      {validationReport.summary.detectedPeriods
                        .map(formatPeriodKeyLabel)
                        .join(", ")}
                    </span>
                  )}
                </div>
              )}

              {/* Penolakan Keras Khusus Demografi (Multi-Bulan / Multi-Sheet) */}
              {isDemographyPolicyRejected && validationReport.periodPolicy && (
                <div className="p-4 rounded-xl border border-slate-200 border-l-4 border-l-red-400/80 bg-white space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-50/70 text-red-600/80 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Upload Ditolak — Aturan Ketat Module Demografi (Wajib 1 Bulan / 1 Sheet)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {validationReport.periodPolicy.message}
                      </p>
                      {validationReport.periodPolicy.periods.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {validationReport.periodPolicy.periods.map((p) => (
                            <span
                              key={p.key}
                              className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-mono"
                            >
                              {p.label} ({p.count} baris)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Alert Peringatan Re-Import File yang Sama pada Bulan yang Sama */}
              {hasReimportAlert && !reimportConfirmed && effectiveReimportWarning && (
                <div className="p-5 rounded-xl border border-slate-200 border-l-4 border-l-amber-400/80 bg-white space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50/70 text-amber-700/80 border border-amber-200/60 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50/80 text-amber-800/90 border border-amber-200/80">
                          Peringatan Duplikat File
                        </span>
                        <span className="text-xs font-mono text-slate-600">
                          File: <strong className="text-slate-900">{effectiveReimportWarning.fileName}</strong>
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900">
                        File Ini Sudah Pernah Dimasukkan pada Bulan Ini
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {effectiveReimportWarning.message}
                      </p>
                      {effectiveReimportWarning.matchedPeriods.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {effectiveReimportWarning.matchedPeriods.map((mp) => (
                            <span
                              key={mp.key}
                              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700"
                            >
                              {mp.label} • {mp.fileName} ({mp.totalRecords} baris
                              {mp.uploadedAt
                                ? `, ${new Date(mp.uploadedAt).toLocaleDateString("id-ID")}`
                                : ""}
                              )
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Batalkan / Ganti Berkas</span>
                    </button>
                    <button
                      type="button"
                      disabled={isPending || isSubmittedCurrentFile}
                      onClick={handleConfirmReimport}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Ya, Masukkan Lagi File Ini</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Jika TIDAK Lolos Validasi (Error Keras) -> Blokir Impor & Tampilkan Detail */}
              {!canProceedEffective && !hasReimportAlert && (
                <div className="rounded-xl border border-slate-200 border-l-4 border-l-red-400/75 bg-white overflow-hidden">
                  <div className="p-3.5 sm:px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/70">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileWarning className="w-4 h-4 text-red-600/80 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">
                        {validationReport.message}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {allValidationIssues.length > 0 && (
                        <button
                          type="button"
                          onClick={() => copyText(allValidationIssues)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isCopied
                              ? "bg-emerald-50/70 text-emerald-700 border-emerald-200"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Salin Semua</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsDetailsOpen((prev) => !prev)}
                        className="p-1 rounded-lg text-slate-600 hover:bg-slate-200/70 cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isDetailsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isDetailsOpen && validationIssueGroups.length > 0 && (
                    <div className="p-4 space-y-3 max-h-72 overflow-y-auto bg-slate-50/40">
                      {validationIssueGroups.map((group) => (
                        <div key={group.key} className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            {group.key === "dbDup" ? (
                              <Database className="w-3.5 h-3.5 text-amber-600/80" />
                            ) : (
                              <AlertTriangle
                                className={`w-3.5 h-3.5 ${
                                  group.tone === "red" ? "text-red-600/80" : "text-amber-600/80"
                                }`}
                              />
                            )}
                            <span>{group.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                group.tone === "red"
                                  ? "bg-red-50/70 text-red-700/90 border-red-200/70"
                                  : "bg-amber-50/70 text-amber-800/90 border-amber-200/70"
                              }`}
                            >
                              {group.items.length}
                            </span>
                          </div>
                          <div className="space-y-1 pl-1">
                            {group.items.map((msg, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs font-mono text-slate-800 bg-white p-2 rounded-lg border border-slate-200/80"
                              >
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 shrink-0">
                                  #{idx + 1}
                                </span>
                                <span className="leading-relaxed break-words">{msg}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-600">
                      Belum ada data yang masuk ke database. Perbaiki berkas Excel lalu unggah ulang.
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => triggerValidation(selectedModuleKey, selectedFile)}
                          className="px-3.5 py-1.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Cek Ulang
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-3.5 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        Ganti Berkas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Jika Lolos 100% (atau user sudah menyetujui re-import) -> Panel Konfirmasi Eksplisit User */}
              {canProceedEffective && isMultiMonthGeneral && (
                <div
                  className={`p-5 rounded-xl border border-slate-200 border-l-4 bg-white space-y-4 ${
                    multiMonthConfirmStage === 2
                      ? "border-l-rose-400/85"
                      : "border-l-amber-400/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                        multiMonthConfirmStage === 2
                          ? "bg-rose-50/70 text-rose-700/80 border-rose-200/70"
                          : "bg-amber-50/70 text-amber-700/80 border-gray-200/70"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            multiMonthConfirmStage === 2
                              ? "bg-rose-50/80 text-rose-800/90 border-rose-200/80"
                              : "bg-amber-50/80 text-amber-800/90 border-gray-200/80"
                          }`}
                        >
                          Verifikasi Ganda Multi-Bulan
                        </span>
                        <span className="text-xs font-mono text-slate-600">
                          File: <strong className="text-slate-900">{selectedFile?.name}</strong>
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-slate-900">
                        {multiMonthConfirmStage === 2
                          ? "Konfirmasi Akhir (Tahap 2/2): Simpan Data Lintas Bulan ke Database?"
                          : "Apakah yakin ingin melanjutkan proses import meskipun terdapat perbedaan bulan pada data yang diinput?"}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {multiMonthConfirmStage === 2
                          ? `Seluruh ${validationReport.summary.totalRows} baris dari file "${selectedFile?.name}" lintas ${validationReport.summary.detectedPeriods.length} bulan akan disimpan sekaligus ke database dan dicatat pada masing-masing periode.`
                          : `Terdeteksi data lintas ${validationReport.summary.detectedPeriods.length} bulan dalam file "${selectedFile?.name}". Diperlukan 2 tahap konfirmasi sebelum data disimpan.`}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {(validationReport.periodPolicy?.periods?.length
                          ? validationReport.periodPolicy.periods.map((p) => p.label)
                          : validationReport.summary.detectedPeriods.map(formatPeriodKeyLabel)
                        ).map((lbl) => (
                          <span
                            key={lbl}
                            className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-mono font-bold text-slate-700"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                    {multiMonthConfirmStage === 2 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setMultiMonthConfirmStage(1)}
                          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Kembali ke Tahap 1</span>
                        </button>
                        <button
                          type="button"
                          disabled={isPending || isSubmittedCurrentFile}
                          onClick={() => handleConfirmImport(2)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Ya, Saya Yakin — Simpan Sekarang (2/2)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Batalkan Upload</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMultiMonthConfirmStage(2)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Ya, Lanjutkan (Konfirmasi 1/2)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {canProceedEffective && !isMultiMonthGeneral && (
                <div className="p-5 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500/70 bg-white space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50/70 text-emerald-700/80 border border-emerald-200/60 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-slate-900">
                        Berkas 100% Aman — Menunggu Konfirmasi Anda
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">{validationReport.summary.totalRows} baris</strong> dari file{" "}
                        <strong className="font-mono text-slate-900">{selectedFile?.name}</strong> untuk modul{" "}
                        <strong className="text-slate-900">{currentModule.label}</strong> lolos pengecekan tanpa typo, error format,
                        maupun duplikat di file &amp; database. Belum ada data yang disimpan sampai Anda
                        menekan tombol konfirmasi di bawah.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali / Batalkan</span>
                    </button>
                    <button
                      type="button"
                      disabled={isPending || isSubmittedCurrentFile}
                      onClick={() => handleConfirmImport(0)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Lanjutkan &amp; Impor Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar saat Commit Impor */}
          {isPending && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-600" />
                  {progressStep || "Menyimpan data terverifikasi ke database..."}
                </span>
                <span className="font-mono font-bold text-slate-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-800 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Mohon jangan menutup jendela ini. Setelah selesai, Anda dapat menentukan sendiri untuk menuju Dashboard atau kembali mengimpor berkas lain.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tahap 3: Hasil Impor (TIDAK Auto-Redirect ke Dashboard) */}
      {isSuccess && importResult && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-xs border ${
                allFailedCompletely
                  ? "bg-red-50/60 text-red-600/80 border-red-200/70"
                  : hasAnyFailure
                    ? "bg-amber-50/60 text-amber-600/80 border-amber-200/70"
                    : "bg-emerald-50/60 text-emerald-600/80 border-emerald-200/70"
              }`}
            >
              {allFailedCompletely ? (
                <XCircle className="w-8 h-8" />
              ) : hasAnyFailure ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 font-heading">
              {allFailedCompletely
                ? "Impor Gagal Diproses"
                : hasAnyFailure
                  ? "Impor Selesai dengan Sebagian Gagal"
                  : "Impor 100% Berhasil Disimpan!"}
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">{importResult.message}</p>
            {(importResult.fileName || selectedFile) && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                  File: {importResult.fileName || selectedFile?.name}
                </span>
                {(importResult.periods?.length
                  ? importResult.periods.map((p) => p.label)
                  : (validationReport?.summary?.detectedPeriods || []).map(formatPeriodKeyLabel)
                ).length > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    Periode:{" "}
                    {(importResult.periods?.length
                      ? importResult.periods.map((p) => p.label)
                      : (validationReport?.summary?.detectedPeriods || []).map(formatPeriodKeyLabel)
                    ).join(", ")}
                  </span>
                )}
              </div>
            )}
          </div>

          {importResult.results && importResult.results.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Rincian Status:
              </span>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 text-xs overflow-hidden">
                {importResult.results.map((res, idx) => {
                  const modHasError = Boolean(
                    !res.success ||
                      (res.errors && res.errors.length > 0) ||
                      /Gagal:\s*[1-9]\d*/i.test(res.message || "")
                  )
                  const modIsTotalFail = Boolean(
                    !res.success || (modHasError && isZeroSuccessMessage(res.message))
                  )

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white ${
                        modIsTotalFail
                          ? "border-l-4 border-l-red-400/70"
                          : modHasError
                            ? "border-l-4 border-l-amber-400/70"
                            : ""
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {modIsTotalFail ? (
                          <XCircle className="w-4 h-4 text-red-600/80 shrink-0" />
                        ) : modHasError ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600/80 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600/80 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900">{res.moduleLabel}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{res.message}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono self-start sm:self-center border ${
                          modIsTotalFail
                            ? "bg-red-50/70 text-red-700/85 border-red-200/70"
                            : modHasError
                              ? "bg-amber-50/70 text-amber-800/85 border-amber-200/70"
                              : "bg-emerald-50/70 text-emerald-700/85 border-emerald-200/70"
                        }`}
                      >
                        {modIsTotalFail
                          ? `GAGAL${res.errors?.length ? ` (${res.errors.length} GAGAL)` : ""}`
                          : modHasError
                            ? `CATATAN (${res.errors?.length || 1})`
                            : "BERHASIL"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {allFailures.length > 0 && (
            <div className="rounded-xl border border-slate-200 border-l-4 border-l-amber-400/75 bg-white overflow-hidden">
              <div className="p-3 sm:px-4 flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600/80 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    Rincian Catatan ({allFailures.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(allFailures)}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Tersalin!" : "Salin"}</span>
                </button>
              </div>
              <div className="p-3 sm:px-4 space-y-2 bg-slate-50/40">
                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {allFailures.map((err, idx) => (
                    <div key={idx} className="text-xs font-mono text-slate-800 flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200/70">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="break-words leading-relaxed">{err}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 pt-1.5 border-t border-slate-200">
                  {allFailedCompletely
                    ? "Seluruh baris gagal diproses. Periksa pesan error di atas sebelum mengunggah ulang."
                    : "Baris data lain yang valid telah berhasil disimpan ke database. Anda hanya perlu memperbaiki baris yang tercatat di atas jika ingin melakukan impor ulang."}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Kembali — Impor Berkas Lain</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Selesai — Ke Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Error saat Commit */}
      {isError && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 border-l-4 border-l-red-400/75 shadow-2xs space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50/60 text-red-600/80 border border-red-200/70 mx-auto flex items-center justify-center shadow-xs">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 font-heading">
              Gagal Memproses Impor
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
              {errorMessage || "Terjadi kesalahan saat memproses berkas Excel di backend."}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-xl mx-auto">
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              Kemungkinan Penyebab:
            </span>
            <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-1 pl-1">
              <li>Terdapat typo, kolom wajib kosong, atau duplikat baru di database saat konfirmasi.</li>
              <li>Format lembar kerja tidak sesuai dengan templat modul terpilih.</li>
              <li>Sesi login telah berakhir.</li>
            </ul>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Kembali &amp; Pilih Ulang Berkas</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ke Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}