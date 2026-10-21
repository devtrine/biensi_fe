import React, { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart2,
  Table as TableIcon,
  Layers,
  Calendar,
  ChevronDown,
  Check,
  UploadCloud,
  RefreshCw,
  AlertCircle,
  Filter,
} from "lucide-react"
import { ExecutiveHeroMetrics } from "../../components/dashboard/ExecutiveHeroMetrics"
import { Phase1VisualCharts } from "../../components/dashboard/Phase1VisualCharts"
import { Phase1MetricsTable } from "../../components/dashboard/Phase1MetricsTable"
import { QuickActionsModal } from "../../components/ui/QuickActionsModal"
import { useDashboardSummary, useDivisions, useDepartments } from "../../hooks/use-dashboard"

const MONTHS = [
  { id: "1", label: "01 - Januari" },
  { id: "2", label: "02 - Februari" },
  { id: "3", label: "03 - Maret" },
  { id: "4", label: "04 - April" },
  { id: "5", label: "05 - Mei" },
  { id: "6", label: "06 - Juni" },
  { id: "7", label: "07 - Juli (Aktif)" },
  { id: "8", label: "08 - Agustus" },
  { id: "9", label: "09 - September" },
  { id: "10", label: "10 - Oktober" },
  { id: "11", label: "11 - November" },
  { id: "12", label: "12 - Desember" },
]

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"visual" | "matrix" | "both">("both")
  const [selectedYear, setSelectedYear] = useState<"2026" | "2025" | "2024">("2026")
  const [selectedMonth, setSelectedMonth] = useState<string>("7")
  const [selectedScope, setSelectedScope] = useState<"corporate" | "hq" | "store">("corporate")
  const [departmentFilter, setDepartmentFilter] = useState("Semua Departemen")
  const [divisionFilter, setDivisionFilter] = useState("Semua Divisi")
  const [storeTypeFilter, setStoreTypeFilter] = useState("Semua Tipe Store")
  const [regionalFilter, setRegionalFilter] = useState("Semua Area (Barat & Timur)")
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const yearDropdownRef = useRef<HTMLDivElement>(null)
  const monthDropdownRef = useRef<HTMLDivElement>(null)

  const {
    data: dashboardResponse,
    isLoading,
    isError,
    refetch,
  } = useDashboardSummary(selectedYear, selectedScope, selectedMonth)

  const { data: divisionsData } = useDivisions()
  const { data: departmentsData } = useDepartments()

  const availableDivisions = useMemo(() => {
    const list: Array<{ name: string; count?: number }> = []
    const costDivs = dashboardResponse?.summary?.productivity?.costByDivision || []
    const demoDivs = dashboardResponse?.summary?.demographics?.distribution?.byDivision || {}

    if (costDivs.length > 0) {
      costDivs.forEach((d: any) => {
        list.push({ name: d.name, count: d.headcount })
      })
    } else if (Object.keys(demoDivs).length > 0) {
      Object.entries(demoDivs).forEach(([name, count]) => {
        list.push({ name, count: Number(count) })
      })
    } else if (divisionsData && divisionsData.length > 0) {
      divisionsData.forEach((d: any) => {
        list.push({ name: d.name })
      })
    }
    return list
  }, [dashboardResponse, divisionsData])

  const availableDepartments = useMemo(() => {
    const list: Array<{ name: string; count?: number; parentDivision?: string }> = []
    const costDepts = dashboardResponse?.summary?.productivity?.costByDepartment || []

    let source = costDepts
    if (divisionFilter && divisionFilter !== "Semua Divisi") {
      const cleanDiv = divisionFilter.split("(")[0].trim().toUpperCase()
      source = costDepts.filter((d: any) => (d.parentDivision || "").toUpperCase() === cleanDiv)
    }

    if (source.length > 0) {
      source.forEach((d: any) => {
        list.push({ name: d.name, count: d.headcount, parentDivision: d.parentDivision })
      })
    } else {
      const demoDepts = dashboardResponse?.summary?.demographics?.distribution?.byDepartment || {}
      if (Object.keys(demoDepts).length > 0) {
        Object.entries(demoDepts).forEach(([name, count]) => {
          list.push({ name, count: Number(count) })
        })
      } else if (departmentsData && departmentsData.length > 0) {
        departmentsData.forEach((d: any) => {
          list.push({ name: d.name })
        })
      }
    }
    return list
  }, [dashboardResponse, divisionFilter, departmentsData])

  const isAnyFilterActive =
    divisionFilter !== "Semua Divisi" ||
    departmentFilter !== "Semua Departemen" ||
    storeTypeFilter !== "Semua Tipe Store" ||
    regionalFilter !== "Semua Area (Barat & Timur)"

  const handleResetFilters = () => {
    setDivisionFilter("Semua Divisi")
    setDepartmentFilter("Semua Departemen")
    setStoreTypeFilter("Semua Tipe Store")
    setRegionalFilter("Semua Area (Barat & Timur)")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(target)) {
        setIsYearDropdownOpen(false)
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(target)) {
        setIsMonthDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleQuickActionSuccess = (name: string) => {
    setToastMessage(`Karyawan baru ${name} berhasil ditambahkan ke database!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const selectedMonthLabel =
    MONTHS.find((m) => m.id === selectedMonth)?.label || `Bulan ${selectedMonth}`

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 border border-red-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              HR EXECUTIVE DASHBOARD
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
            <strong className="text-slate-900 font-semibold">Pelaporan Bulanan (Monthly Reporting)</strong> PT Biensi Fesyenindo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("/import")}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#c8102e] hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-xs cursor-pointer transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Impor Excel</span>
          </button>

          <div className="relative" ref={monthDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsMonthDropdownOpen((prev) => !prev)
                setIsYearDropdownOpen(false)
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#c8102e]" />
              <span>{selectedMonthLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isMonthDropdownOpen ? "rotate-180 text-slate-700" : ""
                  }`}
              />
            </button>

            {isMonthDropdownOpen && (
              <div className="absolute right-0 sm:left-0 sm:right-auto mt-1.5 w-48 max-h-64 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                {MONTHS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(m.id)
                      setIsMonthDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${selectedMonth === m.id
                      ? "bg-slate-900 text-white font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    <span>{m.label}</span>
                    {selectedMonth === m.id && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={yearDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsYearDropdownOpen((prev) => !prev)
                setIsMonthDropdownOpen(false)
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 shadow-2xs transition-all cursor-pointer"
            >
              <span>{selectedYear}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isYearDropdownOpen ? "rotate-180 text-slate-700" : ""
                  }`}
              />
            </button>

            {isYearDropdownOpen && (
              <div className="absolute right-0 sm:left-0 sm:right-auto mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                {(["2026", "2025", "2024"] as const).map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year)
                      setIsYearDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-mono transition-colors text-left cursor-pointer ${selectedYear === year
                      ? "bg-slate-900 text-white font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    <span>{year}</span>
                    {selectedYear === year && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-sm font-medium">
            <button
              type="button"
              onClick={() => setSelectedScope("corporate")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${selectedScope === "corporate"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
            >
              Corporate
            </button>
            <button
              type="button"
              onClick={() => setSelectedScope("hq")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${selectedScope === "hq"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
            >
              HQ (Pusat)
            </button>
            <button
              type="button"
              onClick={() => setSelectedScope("store")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${selectedScope === "store"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
            >
              Store (Ritel)
            </button>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            title="Muat ulang data dashboard"
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#c8102e]" : ""}`} />
          </button>
        </div>
      </div>

      <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "visual"
              ? "bg-white text-slate-900 font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <BarChart2 className="w-4 h-4 text-[#C8102E]" />
            <span>Tampilan Visual (Visual Charts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "matrix"
              ? "bg-white text-slate-900 font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <TableIcon className="w-4 h-4 text-slate-700" />
            <span>Matriks Metrik (51 KPI)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("both")}
            className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "both"
              ? "bg-white text-slate-900 font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Layers className="w-4 h-4 text-slate-700" />
            <span>Lengkap (Keduanya)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>
            Skop: <strong className="text-slate-900 uppercase">{selectedScope}</strong> • Periode: <strong className="text-slate-900">{selectedMonthLabel} {selectedYear}</strong>
          </span>
        </div>
      </div>

      <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#c8102e]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Filter Organisasi & Segmentasi Operasional:
            </span>
          </div>
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#c8102e] hover:text-red-700 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>✕ Reset Semua Filter</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end text-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              DIVISI HQ
            </label>
            <select
              value={divisionFilter}
              onChange={(e) => {
                setDivisionFilter(e.target.value)
                setDepartmentFilter("Semua Departemen")
              }}
              className="w-full px-3 py-2 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              <option value="Semua Divisi">Semua Divisi</option>
              {availableDivisions.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}{d.count != null ? ` (${d.count} Org)` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              DEPARTEMEN HQ
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              <option value="Semua Departemen">Semua Departemen</option>
              {availableDepartments.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}{d.count != null ? ` (${d.count} Org)` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              TIPE STORE RITEL
            </label>
            <select
              value={storeTypeFilter}
              onChange={(e) => setStoreTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              <option value="Semua Tipe Store">Semua Tipe Store</option>
              <option value="Family Store (FS)">Family Store (FS)</option>
              <option value="Showroom (Mall)">Showroom (Mall)</option>
              <option value="Counter (Dept Store/YDS)">Counter (Dept Store/YDS)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              AREA REGIONAL STORE
            </label>
            <select
              value={regionalFilter}
              onChange={(e) => setRegionalFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              <option value="Semua Area (Barat & Timur)">Semua Area (Barat & Timur)</option>
              <option value="Area Regional Barat">Area Regional Barat (35 Store)</option>
              <option value="Area Regional Timur">Area Regional Timur (6 Store)</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c8102e] mx-auto flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#c8102e]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Memuat Data Dashboard Eksekutif...
            </h3>
            <p className="text-xs text-slate-500">
              Mengambil metrik KPI untuk periode {selectedMonthLabel} {selectedYear} dari backend.
            </p>
          </div>
        </div>
      )}

      {!isLoading && (isError || !dashboardResponse) && (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-2xs text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center shadow-xs">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 font-heading">
              Data Periode Belum Tersedia
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Basis data belum memiliki rekapitulasi untuk periode <strong>{selectedMonthLabel} {selectedYear}</strong>. Silakan unggah berkas Excel atau pilih bulan yang telah memiliki data (Juli 2026).
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedYear("2026")
                setSelectedMonth("7")
              }}
              className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
            >
              Tampilkan Bulan Juli 2026
            </button>
            <button
              onClick={() => navigate("/import")}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Impor Berkas Excel</span>
            </button>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
            >
              Coba Muat Ulang
            </button>
          </div>
        </div>
      )}

      {!isLoading && dashboardResponse && (
        <>
          <ExecutiveHeroMetrics
            selectedYear={selectedYear}
            selectedScope={selectedScope}
            dashboardData={dashboardResponse}
          />

          {activeTab === "visual" && (
            <Phase1VisualCharts
              selectedYear={selectedYear}
              selectedScope={selectedScope}
              dashboardData={dashboardResponse}
              divisionFilter={divisionFilter}
              departmentFilter={departmentFilter}
              storeTypeFilter={storeTypeFilter}
              regionalFilter={regionalFilter}
            />
          )}

          {activeTab === "matrix" && (
            <Phase1MetricsTable
              selectedYear={selectedYear}
              selectedScope={selectedScope}
              dashboardData={dashboardResponse}
            />
          )}

          {activeTab === "both" && (
            <div className="space-y-8">
              <Phase1VisualCharts
                selectedYear={selectedYear}
                selectedScope={selectedScope}
                dashboardData={dashboardResponse}
                divisionFilter={divisionFilter}
                departmentFilter={departmentFilter}
                storeTypeFilter={storeTypeFilter}
                regionalFilter={regionalFilter}
              />
              <Phase1MetricsTable
                selectedYear={selectedYear}
                selectedScope={selectedScope}
                dashboardData={dashboardResponse}
              />
            </div>
          )}
        </>
      )}

      <QuickActionsModal
        isOpen={quickActionsOpen}
        onClose={() => setQuickActionsOpen(false)}
        onAddEmployeeSuccess={handleQuickActionSuccess}
      />
    </div>
  )
}
