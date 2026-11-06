import React, { useState, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Sparkles,
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
} from "lucide-react"
import {
  IMPORT_MODULES,
  type ImportModuleOption,
} from "../../services/import.service"
import { useImportExcel } from "../../hooks/use-import"
import { downloadExcelTemplate } from "../../services/template.service"

export const ImportPage: React.FC = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedModuleKey, setSelectedModuleKey] = useState<string>("auto")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [clientValidationNotice, setClientValidationNotice] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isFailureDetailsOpen, setIsFailureDetailsOpen] = useState<boolean>(true)

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
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleStartImport = () => {
    if (!selectedFile) {
      setClientValidationNotice("Silakan pilih berkas Excel terlebih dahulu.")
      return
    }

    runImport({
      targetKey: selectedModuleKey,
      file: selectedFile,
    })
  }

  const handleReset = () => {
    resetMutation()
    setSelectedFile(null)
    setClientValidationNotice(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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

  const hasAnyFailure = useMemo(() => {
    if (!importResult) return false
    return (
      allFailures.length > 0 ||
      Boolean(importResult.results?.some((r) => !r.success || (r.errors && r.errors.length > 0))) ||
      /Gagal:\s*[1-9]\d*/i.test(importResult.message || "")
    )
  }, [importResult, allFailures])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              Impor Berkas Excel & Sinkronisasi Data
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => downloadExcelTemplate("auto")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
            title={`Unduh template Excel resmi untuk ${currentModule.label}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Template Excel Keseluruhan</span>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c8102e]" />
              Pilih Target Modul Ingesti
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => downloadExcelTemplate(selectedModuleKey)}
              className="flex items-center gap-2 text-xs font-bold text-[#c8102e] bg-red-50/50 rounded-lg hover:bg-red-100/60 border border-black-300 px-3.5 py-1.5  shadow-2xs transition-all cursor-pointer"
              title={`Unduh format file Excel (.xlsx) acuan untuk ${currentModule.label}`}
            >
              <Download className="w-3.5 h-3.5 text-[#c8102e]" />
              <span>Unduh Template ({currentModule.label})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {IMPORT_MODULES.map((mod) => {
            const isSelected = selectedModuleKey === mod.key
            return (
              <button
                key={mod.key}
                type="button"
                disabled={isPending}
                onClick={() => {
                  setSelectedModuleKey(mod.key)
                  setClientValidationNotice(null)
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                  ? "border-red-500 bg-red-50/40 ring-2 ring-red-500/20 shadow-xs"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                  } ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {mod.key === "auto" ? (
                      <Sparkles className={`w-4 h-4 ${isSelected ? "text-[#c8102e]" : "text-amber-500"}`} />
                    ) : (
                      <FileSpreadsheet className={`w-4 h-4 ${isSelected ? "text-[#c8102e]" : "text-slate-400"}`} />
                    )}
                    <span className="text-xs font-bold text-slate-900">
                      {mod.label}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#c8102e] shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {!isSuccess && !isError && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isPending && fileInputRef.current?.click()}
            className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${isDragging
              ? "border-red-500 bg-red-50/30 scale-[0.99]"
              : selectedFile
                ? "border-emerald-400 bg-emerald-50/20"
                : "border-slate-300 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-400"
              } ${isPending ? "pointer-events-none opacity-70" : ""}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#c8102e] mx-auto flex items-center justify-center shadow-xs mb-3">
              {selectedFile ? (
                <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                  Berkas Siap Diunggah
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedFile.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Ukuran: {formatFileSize(selectedFile.size)} • Diubah:{" "}
                  {new Date(selectedFile.lastModified).toLocaleDateString("id-ID")}
                </p>
                <p className="text-xs text-slate-400 pt-2">
                  Klik atau seret berkas lain untuk mengganti
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Tarik & Letakkan Berkas Excel di Sini
                </h3>
                <p className="text-xs text-slate-500">
                  Mendukung format .xlsx dan .xls hingga ukuran 50MB
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

          {isPending && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c8102e]" />
                  {progressStep || "Mengunggah data ke backend..."}
                </span>
                <span className="font-mono font-bold text-slate-700">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c8102e] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Mohon jangan menutup jendela ini saat data sedang diproses oleh backend.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {selectedFile && !isPending && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  Batal
                </button>
              )}
              <button
                type="button"
                disabled={!selectedFile || isPending}
                onClick={handleStartImport}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Mulai Impor</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && importResult && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-xs ${
                hasAnyFailure
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-200"
              }`}
            >
              {hasAnyFailure ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 font-heading">
              {hasAnyFailure
                ? "Impor Selesai dengan Sebagian Gagal"
                : "Impor Berhasil Diproses!"}
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              {importResult.message}
            </p>
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

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        !res.success
                          ? "bg-red-50/30"
                          : modHasError
                            ? "bg-amber-50/20"
                            : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {!res.success ? (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        ) : modHasError ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900">
                            {res.moduleLabel}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {res.message}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono self-start sm:self-center ${
                          !res.success
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : modHasError
                              ? "bg-amber-50 text-amber-800 border border-amber-300"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {!res.success
                          ? "GAGAL"
                          : modHasError
                            ? `SEBAGIAN GAGAL (${res.errors?.length || 1} GAGAL)`
                            : "BERHASIL"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {allFailures.length > 0 && (
            <div className="rounded-xl border border-slate-200/90 bg-amber-50/40 shadow-2xs overflow-hidden transition-all duration-300 animate-alert-entrance">
              {/* Header Bar */}
              <div className="p-3 sm:px-4 flex items-center justify-between gap-2 border-b border-slate-200/90 bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-transparent">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex items-center justify-center shrink-0">
                    <span className="absolute w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" />
                    <AlertTriangle className="w-4 h-4 text-amber-600 relative z-10 shrink-0" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Rincian Baris Gagal
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    {allFailures.length} Catatan
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(allFailures.join("\n"))
                      setIsCopied(true)
                      setTimeout(() => setIsCopied(false), 2000)
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                      isCopied
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                    }`}
                    title="Salin semua catatan kegagalan ke clipboard"
                  >
                    {isCopied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFailureDetailsOpen(!isFailureDetailsOpen)}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-amber-100/60 transition-all cursor-pointer"
                    title={isFailureDetailsOpen ? "Sembunyikan rincian" : "Tampilkan rincian"}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isFailureDetailsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Collapsible Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isFailureDetailsOpen
                    ? "max-h-60 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-3 sm:px-4 space-y-2">
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 divide-y divide-amber-100/60">
                    {allFailures.map((err, idx) => (
                      <div
                        key={idx}
                        className="pt-1.5 first:pt-0 flex items-start gap-2 text-xs font-mono text-slate-800 hover:bg-amber-100/40 p-1.5 rounded-lg transition-all duration-150 group"
                      >
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900 shrink-0 mt-0.5 group-hover:bg-amber-300 transition-colors">
                          #{idx + 1}
                        </span>
                        <span className="leading-relaxed break-all group-hover:translate-x-0.5 transition-transform duration-150">
                          {err}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-amber-800/80 pt-1.5 border-t border-slate-200/90 flex items-center gap-1.5">
                    <span>
                      Baris data lain yang valid telah berhasil disimpan ke database. Anda hanya perlu memperbaiki baris yang tercatat di atas jika ingin melakukan impor ulang.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          

          

          

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Impor Berkas Lain</span>
            </button>
          </div>
        </div>
      )}

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
              <li>Format lembar kerja tidak sesuai dengan templat <code className="font-mono">HR_Monitoring_Dashboard v2.0</code>.</li>
              <li>Data kolom kunci (misalnya NIK, Nama, Tanggal, atau Kode Store) memiliki nilai kosong atau format tidak sesuai.</li>
              <li>Sesi autentikasi telah berakhir.</li>
            </ul>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Unggah Ulang</span>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex item-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

