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
} from "../../services/import.service"
import {
  useImportExcel,
  useImportYearlyStatus,
  useValidateImport,
} from "../../hooks/use-import"
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

  const [selectedModuleKey, setSelectedModuleKey] = useState<string>(
    IMPORT_MODULES[0]?.key || "demografi_ho"
  )
  const [statusYear, setStatusYear] = useState<number>(() => new Date().getFullYear())
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [clientValidationNotice, setClientValidationNotice] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true)
  const [isSubmittedCurrentFile, setIsSubmittedCurrentFile] = useState<boolean>(false)
  const [multiMonthConfirmStage, setMultiMonthConfirmStage] = useState<0 | 1 | 2>(0)

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
    isLoading: isLoadingStatus,
    refetch: refetchYearlyStatus,
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

  const isMultiMonthGeneral = useMemo(() => {
    if (currentModule.periodMode !== "MULTI_CONFIRM" || !validationReport?.canProceed) {
      return false
    }
    const detectedCount = validationReport.summary?.detectedPeriods?.length ?? 0
    return Boolean(validationReport.periodPolicy?.requiresConfirmation) || detectedCount > 1
  }, [currentModule.periodMode, validationReport])

  const isDemographyPolicyRejected = useMemo(() => {
    if (currentModule.periodMode !== "STRICT_SINGLE" || !validationReport) return false
    const code = validationReport.periodPolicy?.code
    return (
      !validationReport.canProceed &&
      Boolean(validationReport.periodPolicy && !validationReport.periodPolicy.allowed) &&
      (code === "MULTI_SHEET_NOT_ALLOWED" || code === "DEMOGRAPHY_MULTI_MONTH_REJECTED")
    )
  }, [currentModule.periodMode, validationReport])

  const isBusy = isValidating || isPending

  const currentStep: 1 | 2 | 3 = useMemo(() => {
    if (isSuccess || isError) return 3
    if (validationReport?.canProceed && selectedFile && !isValidating) return 2
    return 1
  }, [isSuccess, isError, validationReport, selectedFile, isValidating])

  const triggerValidation = (moduleKey: string, file: File) => {
    resetMutation()
    resetValidation()
    setIsSubmittedCurrentFile(false)
    setMultiMonthConfirmStage(0)
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

  const handleConfirmImport = (confirmStepOverride?: number) => {
    if (!selectedFile || !validationReport?.canProceed || isBusy || isSubmittedCurrentFile) {
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
      resolvedEndpoint: validationReport.resolvedEndpoint,
      confirmStep: finalConfirmStep,
    })
  }

  const handleReset = () => {
    resetMutation()
    resetValidation()
    setSelectedFile(null)
    setClientValidationNotice(null)
    setIsSubmittedCurrentFile(false)
    setMultiMonthConfirmStage(0)
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
                      ? "bg-emerald-600 text-white"
                      : isActive
                        ? "bg-[#c8102e] text-white"
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
            <Layers className="w-4 h-4 text-[#c8102e]" />
            Pilih Target Modul Ingesti
          </h3>

          <button
            type="button"
            onClick={() => downloadExcelTemplate(selectedModuleKey)}
            className="flex items-center gap-2 text-xs font-bold text-[#c8102e] bg-red-50/50 rounded-lg hover:bg-red-100/60 border border-red-200 px-3.5 py-1.5 shadow-2xs transition-all cursor-pointer self-start md:self-auto"
            title={`Unduh format file Excel (.xlsx) acuan untuk ${currentModule.label}`}
          >
            <Download className="w-3.5 h-3.5 text-[#c8102e]" />
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
                    ? "border-red-500 bg-red-50/40 ring-2 ring-red-500/20 shadow-xs"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileSpreadsheet
                      className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#c8102e]" : "text-slate-400"}`}
                    />
                    <span className="text-xs font-bold text-slate-900 truncate">{mod.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        mod.periodMode === "STRICT_SINGLE"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      {mod.periodMode === "STRICT_SINGLE" ? "1 Bulan" : "Multi-Bulan"}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#c8102e]" />}
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
              <Calendar className="w-4 h-4 text-[#c8102e]" />
              <span>Status Input &amp; Identifikasi File Excel — {currentModule.label}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pantau bulan yang sudah atau belum diinput beserta nama file Excel sumbernya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {yearlyStatus && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sudah: {yearlyStatus.summary.inputtedMonths}/12
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
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
            <button
              type="button"
              onClick={() => refetchYearlyStatus()}
              className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
              title="Segarkan status periode"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {(yearlyStatus?.months ||
            MONTH_NAMES_ID.map((monthName, idx) => ({
              year: statusYear,
              month: idx + 1,
              monthName,
              periodId: null,
              status: "BELUM_DIINPUT" as const,
              isInputted: false,
              fileName: null,
              totalRecords: 0,
              lastBatchId: null,
              uploadedAt: null,
            }))
          ).map((m) => {
            const pKey = `${statusYear}-${String(m.month).padStart(2, "0")}`
            const isTargetedBySelectedFile = Boolean(selectedFile) && detectedPeriodsSet.has(pKey)
            return (
              <div
                key={m.month}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isTargetedBySelectedFile
                    ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-400/20"
                    : m.isInputted
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900">{m.monthName}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      m.isInputted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {m.isInputted ? "Sudah" : "Belum"}
                  </span>
                </div>

                {m.isInputted ? (
                  <div className="mt-1.5 space-y-0.5">
                    <div
                      className="text-[11px] font-mono text-slate-800 truncate font-medium"
                      title={m.fileName || undefined}
                    >
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
                  <div
                    className="mt-1.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono truncate"
                    title={`File dipilih: ${selectedFile.name}`}
                  >
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
                ? "border-red-500 bg-red-50/30 scale-[0.99]"
                : selectedFile
                  ? validationReport?.canProceed
                    ? "border-emerald-400 bg-emerald-50/20"
                    : validationReport && !validationReport.canProceed
                      ? "border-red-300 bg-red-50/20"
                      : "border-slate-300 bg-slate-50/60"
                  : "border-slate-300 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-400"
            } ${isBusy ? "pointer-events-none opacity-70" : ""}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#c8102e] mx-auto flex items-center justify-center shadow-xs mb-3">
              {selectedFile ? (
                <FileSpreadsheet
                  className={`w-8 h-8 ${
                    validationReport?.canProceed
                      ? "text-emerald-600"
                      : validationReport && !validationReport.canProceed
                        ? "text-red-600"
                        : "text-slate-700"
                  }`}
                />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                    isValidating
                      ? "bg-blue-100 text-blue-800"
                      : validationReport?.canProceed
                        ? "bg-emerald-100 text-emerald-800"
                        : validationReport && !validationReport.canProceed
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {isValidating
                    ? "Sedang Memeriksa Berkas..."
                    : validationReport?.canProceed
                      ? "Lolos Validasi 100% — Siap Dikonfirmasi"
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
                  <span className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs transition-colors">
                    Pilih Berkas dari Komputer
                  </span>
                </div>
              </div>
            )}
          </div>

          {clientValidationNotice && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{clientValidationNotice}</span>
            </div>
          )}

          {/* Status Auto Pre-Check Sedang Berjalan */}
          {isValidating && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#c8102e] shrink-0" />
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
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-red-800">
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Gagal Menjalankan Pemeriksaan Berkas</div>
                  <p className="mt-0.5 text-red-700">
                    {validateErrorMessage || "Tidak dapat memvalidasi berkas di server."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => triggerValidation(selectedModuleKey, selectedFile)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-lg cursor-pointer"
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
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Total Baris
                  </span>
                  <span className="text-xl font-black font-mono text-slate-900 tabular-nums">
                    {validationReport.summary.totalRows ?? 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Baris Valid
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-700 tabular-nums">
                    {validationReport.summary.validRows ?? 0}
                  </span>
                </div>
                <div
                  className={`p-3.5 rounded-xl border ${
                    (validationReport.summary.errorCount ?? 0) > 0
                      ? "bg-red-50/70 border-red-200"
                      : "bg-slate-50 border-slate-200/80"
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Typo / Error
                  </span>
                  <span
                    className={`text-xl font-black font-mono tabular-nums ${
                      (validationReport.summary.errorCount ?? 0) > 0 ? "text-red-600" : "text-slate-900"
                    }`}
                  >
                    {validationReport.summary.errorCount ?? 0}
                  </span>
                </div>
                <div
                  className={`p-3.5 rounded-xl border ${
                    (validationReport.summary.fileDuplicateCount ?? 0) +
                      (validationReport.summary.dbDuplicateCount ?? 0) >
                    0
                      ? "bg-amber-50/70 border-amber-200"
                      : "bg-slate-50 border-slate-200/80"
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
                        ? "text-amber-700"
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
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                      File Excel: {selectedFile.name}
                    </span>
                  )}
                  {(validationReport.summary.sheets?.length ?? 0) > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      Sheet: {validationReport.summary.sheets.join(", ")}
                    </span>
                  )}
                  {(validationReport.summary.detectedPeriods?.length ?? 0) > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
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
                <div className="p-4 rounded-xl border-2 border-red-300 bg-red-50 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-red-900 uppercase tracking-wide">
                        Upload Ditolak — Aturan Ketat Module Demografi (Wajib 1 Bulan / 1 Sheet)
                      </h4>
                      <p className="text-xs text-red-800 leading-relaxed">
                        {validationReport.periodPolicy.message}
                      </p>
                      {validationReport.periodPolicy.periods.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {validationReport.periodPolicy.periods.map((p) => (
                            <span
                              key={p.key}
                              className="px-2 py-0.5 rounded bg-red-100 text-red-900 text-[11px] font-mono"
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

              {/* Jika TIDAK Lolos Validasi -> Blokir Impor & Tampilkan Detail */}
              {!validationReport.canProceed && (
                <div className="rounded-xl border border-red-200 bg-red-50/30 overflow-hidden">
                  <div className="p-3.5 sm:px-4 flex flex-wrap items-center justify-between gap-2 border-b border-red-200/80 bg-red-50/70">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileWarning className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="text-xs font-bold text-red-900">
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
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
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
                        className="p-1 rounded-lg text-slate-600 hover:bg-red-100/60 cursor-pointer"
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
                    <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                      {validationIssueGroups.map((group) => (
                        <div key={group.key} className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            {group.key === "dbDup" ? (
                              <Database className="w-3.5 h-3.5 text-amber-600" />
                            ) : (
                              <AlertTriangle
                                className={`w-3.5 h-3.5 ${
                                  group.tone === "red" ? "text-red-600" : "text-amber-600"
                                }`}
                              />
                            )}
                            <span>{group.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                group.tone === "red"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {group.items.length}
                            </span>
                          </div>
                          <div className="space-y-1 pl-1">
                            {group.items.map((msg, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs font-mono text-slate-800 bg-white/80 p-2 rounded-lg border border-slate-200/70"
                              >
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 shrink-0">
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

                  <div className="px-4 py-3 bg-white border-t border-red-100 flex flex-wrap items-center justify-between gap-2 text-xs">
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
                        className="px-3.5 py-1.5 font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-lg cursor-pointer"
                      >
                        Ganti Berkas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Jika Lolos 100% -> Panel Konfirmasi Eksplisit User (Tahap 2: Normal atau Verifikasi Ganda Multi-Bulan) */}
              {validationReport.canProceed && isMultiMonthGeneral && (
                <div
                  className={`p-5 rounded-xl border-2 space-y-4 ${
                    multiMonthConfirmStage === 2
                      ? "border-red-400 bg-red-50/40"
                      : "border-amber-300 bg-amber-50/60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        multiMonthConfirmStage === 2
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            multiMonthConfirmStage === 2
                              ? "bg-red-600 text-white"
                              : "bg-amber-600 text-white"
                          }`}
                        >
                          Verifikasi Ganda Multi-Bulan — Tahap{" "}
                          {multiMonthConfirmStage === 2 ? "2/2" : "1/2"}
                        </span>
                        <span className="text-xs font-mono text-slate-700">
                          File: <strong>{selectedFile?.name}</strong>
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-slate-900">
                        {multiMonthConfirmStage === 2
                          ? "Konfirmasi Akhir (Tahap 2/2): Simpan Data Lintas Bulan ke Database?"
                          : "Apakah yakin ingin melanjutkan proses import meskipun terdapat perbedaan bulan pada data yang diinput?"}
                      </h3>

                      <p className="text-xs text-slate-700 leading-relaxed">
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
                            className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-[11px] font-mono font-bold text-slate-800"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-amber-200/70">
                    {multiMonthConfirmStage === 2 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setMultiMonthConfirmStage(1)}
                          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Kembali ke Tahap 1</span>
                        </button>
                        <button
                          type="button"
                          disabled={isPending || isSubmittedCurrentFile}
                          onClick={() => handleConfirmImport(2)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
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
                          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Batalkan Upload</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMultiMonthConfirmStage(2)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Ya, Lanjutkan (Konfirmasi 1/2)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {validationReport.canProceed && !isMultiMonthGeneral && (
                <div className="p-5 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-emerald-950">
                        Berkas 100% Aman — Menunggu Konfirmasi Anda
                      </h3>
                      <p className="text-xs text-emerald-900/80 leading-relaxed">
                        <strong>{validationReport.summary.totalRows} baris</strong> dari file{" "}
                        <strong className="font-mono">{selectedFile?.name}</strong> untuk modul{" "}
                        <strong>{currentModule.label}</strong> lolos pengecekan tanpa typo, error format,
                        maupun duplikat di file &amp; database. Belum ada data yang disimpan sampai Anda
                        menekan tombol konfirmasi di bawah.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-emerald-200/70">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali / Batalkan</span>
                    </button>
                    <button
                      type="button"
                      disabled={isPending || isSubmittedCurrentFile}
                      onClick={() => handleConfirmImport(0)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
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
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c8102e]" />
                  {progressStep || "Menyimpan data terverifikasi ke database..."}
                </span>
                <span className="font-mono font-bold text-slate-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c8102e] transition-all duration-300 rounded-full"
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
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-xs ${
                allFailedCompletely
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : hasAnyFailure
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-200"
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
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
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
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        modIsTotalFail
                          ? "bg-red-50/30"
                          : modHasError
                            ? "bg-amber-50/20"
                            : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {modIsTotalFail ? (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        ) : modHasError ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900">{res.moduleLabel}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{res.message}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono self-start sm:self-center ${
                          modIsTotalFail
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : modHasError
                              ? "bg-amber-50 text-amber-800 border border-amber-300"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
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
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 overflow-hidden">
              <div className="p-3 sm:px-4 flex items-center justify-between gap-2 border-b border-amber-200/70">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
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
              <div className="p-3 sm:px-4 space-y-2">
                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {allFailures.map((err, idx) => (
                    <div key={idx} className="text-xs font-mono text-slate-800 flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="break-words leading-relaxed">{err}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-amber-800/80 pt-1.5 border-t border-amber-200/70">
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
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-200 shadow-2xs space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center shadow-xs">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 font-heading">
              Gagal Memproses Impor
            </h2>
            <p className="text-xs text-red-600 max-w-xl mx-auto font-medium">
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
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