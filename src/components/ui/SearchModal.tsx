import React, { useState, useEffect } from "react"
import { Search, X, User, Building, MapPin, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEmployees } from "../../hooks/use-employees"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (isOpen) {
          onClose()
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const { data: apiEmployees } = useEmployees(query.trim() || undefined)

  if (!isOpen) return null

  const displayEmployees = Array.isArray(apiEmployees) && apiEmployees.length > 0
    ? apiEmployees.slice(0, 6).map((emp: any) => ({
        id: emp.employeeNo || emp.id,
        name: emp.fullName || emp.name,
        position: emp.position?.name || emp.position || 'Associate',
        department: emp.department?.name || emp.store?.storeName || emp.department || 'HQ',
        avatar: emp.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      }))
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Ketik nama karyawan, NIK, departemen, atau toko..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full px-3 py-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded ml-2">
            ESC
          </kbd>
        </div>

        <div className="p-3 max-h-96 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Karyawan & Rekan Kerja
          </div>
          <div className="space-y-1">
            {displayEmployees.map((emp: any) => (
              <div
                key={emp.id}
                onClick={() => {
                  navigate(`/dashboard`)
                  onClose()
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {emp.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {emp.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{emp.position}</span>
                      <span>•</span>
                      <span>{emp.department}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1.5">
            Navigasi Cepat
          </div>
          <div className="grid grid-cols-2 gap-2 px-1">
            <button
              onClick={() => {
                navigate("/dashboard")
                onClose()
              }}
              className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left text-xs font-medium text-slate-700 cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-500" />
              Jumlah Tenaga Kerja
            </button>
            <button
              onClick={() => {
                navigate("/import")
                onClose()
              }}
              className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left text-xs font-medium text-slate-700 cursor-pointer"
            >
              <Building className="w-4 h-4 text-red-500" />
              Impor Data Massal
            </button>
            <button
              onClick={() => {
                navigate("/dashboard")
                onClose()
              }}
              className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left text-xs font-medium text-slate-700 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-500" />
              Performa Toko
            </button>
            <button
              onClick={() => {
                navigate("/dashboard")
                onClose()
              }}
              className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left text-xs font-medium text-slate-700 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 text-emerald-500" />
              Arus Aktivitas Sistem
            </button>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-right text-[11px] text-slate-500">
          Menampilkan data langsung BIENSI HR
        </div>
      </div>
    </div>
  )
}
