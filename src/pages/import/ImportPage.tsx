import React, { useState, useRef } from "react"
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Check,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useImportEmployees } from "../../hooks/use-employees"
import { getErrorMessage } from "../../lib/api/client"

export const ImportPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [uploadedFile, setUploadedFile] = useState<string | null>(
    "rekrutmen_toko_okt2026.xlsx",
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<{ message?: string; errors?: any[] } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const importMutation = useImportEmployees()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadedFile(file.name)
      setStep(2)
    }
  }

  const handleSimulateUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      setStep(2)
    }
  }

  const handleStartProcessing = () => {
    setImportError(null)
    if (selectedFile) {
      importMutation.mutate(selectedFile, {
        onSuccess: (res) => {
          setImportResult(res)
          setStep(4)
        },
        onError: (err) => {
          setImportError(getErrorMessage(err))
          setStep(4)
        },
      })
    } else {
      setStep(4)
    }
  }

  const handleReset = () => {
    setStep(1)
    setSelectedFile(null)
    setImportResult(null)
    setImportError(null)
    setUploadedFile("rekrutmen_toko_okt2026.xlsx")
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Impor Data Massal & Pemetaan Skema
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unggah dan sinkronisasi data karyawan toko ritel dari berkas Excel multi-sheet langsung ke Basis Data HR BIENSI
          </p>
        </div>

        <button
          onClick={() => navigate("/import")}
          className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs cursor-pointer"
        >
          Lihat Riwayat Impor
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
          <div
            className={`flex items-center gap-2 ${step >= 1 ? "text-red-600" : "text-slate-400"}`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 1
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              1
            </span>
            <span>Unggah</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />

          <div
            className={`flex items-center gap-2 ${step >= 2 ? "text-red-600" : "text-slate-400"}`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 2
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              2
            </span>
            <span>Pemetaan</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />

          <div
            className={`flex items-center gap-2 ${step >= 3 ? "text-red-600" : "text-slate-400"}`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 3
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              3
            </span>
            <span>Validasi</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />

          <div
            className={`flex items-center gap-2 ${step >= 4 ? "text-emerald-600" : "text-slate-400"}`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 4
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              4
            </span>
            <span>Hasil</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 shadow-2xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tarik & Letakkan File Excel / CSV di Sini
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mendukung format berkas .xlsx, .xls, atau .csv hingga ukuran 50MB
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleSimulateUpload}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-sm shadow-red-900/20 cursor-pointer"
            >
              Pilih Berkas dari Komputer
            </button>
          </div>
          <div className="pt-4 border-t border-slate-100 max-w-md mx-auto text-left text-xs text-slate-500">
            <strong>Templat Toko yang Didukung:</strong> Templat Roster Toko Ritel 3Second v4.2, Roster Shift Logistik, Format Karyawan Baru Pusat.
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Langkah 2: Pemetaan Kolom Skema
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan kolom judul spreadsheet dengan atribut database HR BIENSI
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700">
              {uploadedFile}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { excel: "NIK", db: "employee_no (NIK)" },
              { excel: "NAMA KARYAWAN", db: "name" },
              { excel: "JABATAN", db: "position" },
              { excel: "DEPARTEMENT", db: "department" },
              { excel: "DIVISI", db: "division" },
              { excel: "TGL MASUK", db: "join_date" },
              { excel: "TGL HABIS KONTRAK", db: "contract_end_date" },
            ].map((col, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-mono font-bold text-slate-800">
                  {col.excel}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {col.db}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Kembali
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
            >
              Validasi Data (Langkah 3) →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Langkah 3: Validasi Integritas Data Sebelum Ingesti
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan duplikasi NIK, referensi data master cabang/toko, dan format tanggal kontrak
              </p>
            </div>
            <span className="text-xs font-extrabold text-slate-900">
              12.450 Total Baris Dipindai
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <span className="text-xl font-black text-emerald-700">
                  12.310
                </span>
                <span className="text-xs font-bold text-emerald-800 block">
                  ✓ Baris Valid
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <div>
                <span className="text-xl font-black text-amber-700">95</span>
                <span className="text-xs font-bold text-amber-800 block">
                  ⚠ Peringatan (Diperbaiki Otomatis)
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <span className="text-xl font-black text-red-700">45</span>
                <span className="text-xs font-bold text-red-800 block">
                  ✕ Galat Ditolak
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Log Pengecualian Galat:
            </span>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 text-xs">
              <div className="p-3 bg-red-50/40 text-red-900 flex justify-between">
                <span>
                  <strong>Baris 128:</strong> NIK Karyawan Duplikat (EMP-09221 sudah terdaftar)
                </span>
                <span className="font-mono text-red-600 font-bold">
                  DITOLAK
                </span>
              </div>
              <div className="p-3 bg-red-50/40 text-red-900 flex justify-between">
                <span>
                  <strong>Baris 219:</strong> Departemen tidak ditemukan ("Store Ops Luar Angkasa")
                </span>
                <span className="font-mono text-red-600 font-bold">
                  DITOLAK
                </span>
              </div>
              <div className="p-3 bg-red-50/40 text-red-900 flex justify-between">
                <span>
                  <strong>Baris 442:</strong> Format tanggal kontrak tidak valid ("31/02/2027")
                </span>
                <span className="font-mono text-red-600 font-bold">
                  DITOLAK
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Kembali
            </button>
            <button
              onClick={handleStartProcessing}
              disabled={importMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              {importMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Ingesti Data...</span>
                </>
              ) : (
                <span>Simpan & Ingest 12.405 Data Valid</span>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
            <Check className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Ingesti Data Berhasil!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {importResult?.message || importError || "12.405 data karyawan berhasil diproses dan diperbarui di Basis Data HR BIENSI."}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Lihat Dashboard
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Impor File Lain
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
