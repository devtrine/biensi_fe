import React, { useState } from "react"
import {
  UserPlus,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  X,
  Check,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCreateEmployee } from "../../hooks/use-employees"
import { getErrorMessage } from "../../lib/api/client"

interface QuickActionsModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEmployeeSuccess?: (name: string) => void
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onAddEmployeeSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"menu" | "addEmployee">("menu")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Store Ops – Bandung 01",
    position: "Store Associate",
    brand: "3SECOND",
    employmentType: "PKWT",
  })
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const createEmployeeMutation = useCreateEmployee()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return
    setErrorMessage(null)
    const empNo = 'EMP-' + Math.floor(10000 + Math.random() * 90000)
    createEmployeeMutation.mutate(
      {
        employeeNo: empNo,
        fullName: formData.name,
        employmentType: formData.employmentType.includes('PKWTT') ? 'PKWTT' : 'PKWT',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      },
      {
        onSuccess: () => {
          setSavedSuccess(true)
          setTimeout(() => {
            setSavedSuccess(false)
            setActiveTab("menu")
            if (onAddEmployeeSuccess) onAddEmployeeSuccess(formData.name)
            onClose()
          }, 1200)
        },
        onError: (err) => {
          setErrorMessage(getErrorMessage(err))
        }
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeTab === "menu"
                  ? "Aksi Cepat Eksekutif"
                  : "Onboard Karyawan Baru"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {activeTab === "menu"
                  ? "Jalankan alur kerja operasional utama di 3SECOND Group"
                  : "Proses onboarding cepat langsung ke BIENSI Live HR Engine"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {activeTab === "menu" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("addEmployee")}
                className="flex flex-col items-start p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900">
                  Onboard Karyawan
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Tambahkan staf ke daftar karyawan, toko, atau kantor pusat
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate("/import")
                  onClose()
                }}
                className="flex flex-col items-start p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900">
                  Impor Lembar Excel
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Unggah file rekrutmen massal beberapa toko
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate("/dashboard")
                  onClose()
                }}
                className="flex flex-col items-start p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900">
                  Pembaruan Kontrak
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Tinjau & perbarui kontrak PKWT yang akan berakhir
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate("/dashboard")
                  onClose()
                }}
                className="flex flex-col items-start p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900">
                  Terbitkan SP / Kasus IR
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Catat surat peringatan disiplin, audit fraud, atau mediasi
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {savedSuccess ? (
                <div className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Karyawan Berhasil Didaftarkan!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.name} telah ditambahkan ke {formData.department}.
                  </p>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="cth: Rizky Fauzan"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Kerja
                      </label>
                      <input
                        type="email"
                        placeholder="cth: rizky.f@biensi.co.id"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Departemen
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 bg-white"
                      >
                        <option>Store Ops – Bandung 01</option>
                        <option>Fashion Design – HQ</option>
                        <option>Logistics & Fulfillment</option>
                        <option>Visual Merchandising</option>
                        <option>Store Ops – Jakarta Flagship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Brand
                      </label>
                      <select
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 bg-white"
                      >
                        <option>3SECOND</option>
                        <option>GREENLIGHT</option>
                        <option>FAMO</option>
                        <option>MOUTLEY</option>
                        <option>FMC SPEED SUPPLY</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipe Ketenagakerjaan
                      </label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employmentType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 bg-white"
                      >
                        <option>PKWT (Kontrak)</option>
                        <option>PKWTT (Tetap)</option>
                        <option>Masa Percobaan</option>
                        <option>Magang</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab("menu")}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={createEmployeeMutation.isPending}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#c8102e] hover:bg-red-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {createEmployeeMutation.isPending ? "Menyimpan..." : "Simpan & Tambah ke Daftar"}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        {activeTab === "menu" && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Masuk sebagai Budi Santoso</span>
          </div>
        )}
      </div>
    </div>
  )
}
