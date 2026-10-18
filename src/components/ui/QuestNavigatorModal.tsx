import React, { useState } from "react"
import {
  X,
  Search,
  CheckCircle2,
  Target,
  ChevronRight,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export interface QuestItem {
  id: number
  priority: "High" | "Medium" | "Low"
  question: string
  metric: string
  pageName: string
  route: string
  tab?: string
  status: "Selesai"
}

const QUEST_LIST: QuestItem[] = [
  {
    id: 1,
    priority: "High",
    question: "Apakah total headcount di store sejalan dengan tren target penjualan fashion ritel bulan ini?",
    metric: "Total Headcount, Headcount per Divisi & As per Budget",
    pageName: "Executive Dashboard & Store Performance",
    route: "/dashboard",
    status: "Selesai",
  },
  {
    id: 2,
    priority: "High",
    question: "Divisi/Departemen mana yang memiliki rasio labour cost tertinggi dibandingkan dengan kontribusi revenue?",
    metric: "Labour cost per divisi, per dept",
    pageName: "Labour Cost & Productivity",
    route: "/labour-cost",
    status: "Selesai",
  },
  {
    id: 3,
    priority: "High",
    question: "Apakah komposisi jabatan (rasio SPG/B terhadap Store Manager) sudah optimal untuk produktivitas toko?",
    metric: "Komposisi jabatan per dept & Store Staffing Ratio",
    pageName: "Store Performance",
    route: "/store-performance",
    status: "Selesai",
  },
  {
    id: 4,
    priority: "High",
    question: "Berapa persen tingkat turnover sukarela (voluntary) di posisi kunci seperti Area Store Manager atau Visual Merchandiser?",
    metric: "Turnover voluntary - sukarela % & Komposisi jabatan",
    pageName: "Turnover & Attrition",
    route: "/turnover",
    status: "Selesai",
  },
  {
    id: 5,
    priority: "High",
    question: "Apakah ada korelasi antara tingginya turnover non-voluntary dengan rendahnya performa di region (Barat/Timur)?",
    metric: "Nonvoluntary - PHK perusahaan % & Area Store",
    pageName: "Turnover & Attrition",
    route: "/turnover",
    status: "Selesai",
  },
  {
    id: 6,
    priority: "Medium",
    question: "Tipe Store mana (Family Store, Showroom, Counter) yang memiliki turnover karyawan tertinggi, dan mengapa?",
    metric: "Turnover % & Tipe Store",
    pageName: "Turnover & Attrition",
    route: "/turnover",
    status: "Selesai",
  },
  {
    id: 7,
    priority: "Medium",
    question: "Apakah komposisi gender di toko (Sales Offline) sudah representatif dengan target demografi pembeli brand?",
    metric: "Komposisi Gender & Dept Sales Offline",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "demographics",
    status: "Selesai",
  },
  {
    id: 8,
    priority: "Medium",
    question: "Apakah ada risiko succession planning di level manajerial karena mayoritas karyawan berada di masa pensiun/usia lanjut?",
    metric: "Komposisi usia berdasarkan kelompok jabatan",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "demographics",
    status: "Selesai",
  },
  {
    id: 9,
    priority: "Low",
    question: "Bagaimana distribusi masa kerja di tim Product Development & Merchandising? Apakah berisiko minim inovasi baru?",
    metric: "Komposisi masa kerja & Dept Product Development",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "rnd-design",
    status: "Selesai",
  },
  {
    id: 10,
    priority: "Medium",
    question: "Apakah strategi perekrutan usia muda (Gen Z) sudah efektif untuk mendorong divisi Sales Online?",
    metric: "Komposisi usia & Dept Sales Online",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "headcount",
    status: "Selesai",
  },
  {
    id: 11,
    priority: "High",
    question: "Berapa besar penghematan biaya dari penggunaan Part-time dan Internship saat peak season (Lebaran/End Year)?",
    metric: "Labour cost, Part time & Internship Employee",
    pageName: "Labour Cost & Productivity",
    route: "/labour-cost",
    status: "Selesai",
  },
  {
    id: 12,
    priority: "Medium",
    question: "Apakah persentase Full-time employee di Warehouse dan Logistics terlalu tinggi dibandingkan volume pengiriman harian?",
    metric: "Fulltime Employee & Dept Supply Chain/Logistics",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "organization",
    status: "Selesai",
  },
  {
    id: 13,
    priority: "High",
    question: "Berapa banyak karyawan kontrak (terutama SPG/B di Counter) yang kontraknya akan habis (<30 hari) di masa krusial?",
    metric: "Kontrak Segera Habis (<=30 hr)",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "employment",
    status: "Selesai",
  },
  {
    id: 14,
    priority: "Medium",
    question: "Apakah tingkat turnover di bulan pertama (30-day turnover) untuk karyawan kontrak sangat tinggi?",
    metric: "Turnover % & Contract Employee",
    pageName: "Turnover & Attrition",
    route: "/turnover",
    status: "Selesai",
  },
  {
    id: 15,
    priority: "High",
    question: "Departemen mana (HQ vs Store) yang paling banyak menyerap labour cost melebihi (over) budget yang ditetapkan?",
    metric: "Labour cost per divisi & Budget",
    pageName: "Labour Cost & Productivity",
    route: "/labour-cost",
    status: "Selesai",
  },
  {
    id: 16,
    priority: "Medium",
    question: "Apakah ada kesenjangan (gap) masa kerja yang jauh antara Store Manager (senior) dan staf (baru) yang memicu konflik?",
    metric: "Komposisi masa kerja berdasarkan kelompok jabatan",
    pageName: "Retail Store Performance (Tenure Gap Q16)",
    route: "/store-performance#quest-16",
    status: "Selesai",
  },
  {
    id: 17,
    priority: "Medium",
    question: "Bagaimana tren demografi dan produktivitas karyawan di toko-toko area Timur dibandingkan area Barat?",
    metric: "Demografi (Usia/Masa Kerja) & Area Store",
    pageName: "Retail Store Performance (Area Barat vs Timur)",
    route: "/store-performance#quest-17",
    status: "Selesai",
  },
  {
    id: 18,
    priority: "Medium",
    question: "Apakah rasio struktur organisasi (Headcount HQ vs Store) efisien dan tidak memberatkan biaya operasional ritel?",
    metric: "Total Corporate (HQ) vs Store",
    pageName: "Executive Dashboard",
    route: "/dashboard",
    status: "Selesai",
  },
  {
    id: 19,
    priority: "Low",
    question: "Apakah ada lonjakan PHK (Non-voluntary) di tim Supply Chain akibat otomatisasi proses gudang/logistik?",
    metric: "Nonvoluntary - PHK % & Dept Supply Chain",
    pageName: "Industrial Relations & Risk",
    route: "/industrial-relation",
    status: "Selesai",
  },
  {
    id: 20,
    priority: "High",
    question: "Seberapa cepat kita bisa mengisi kekosongan jika ada karyawan yang kontraknya habis dan tidak diperpanjang?",
    metric: "Kontrak Segera Habis & Turnover (Time-to-Fill)",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "recruitment",
    status: "Selesai",
  },
  {
    id: 21,
    priority: "High",
    question: "Bagaimana rasio biaya tenaga kerja (labour cost) terhadap total penjualan (Revenue per FTE)?",
    metric: "Labour cost & Total Headcount",
    pageName: "Labour Cost & Productivity",
    route: "/labour-cost",
    status: "Selesai",
  },
  {
    id: 22,
    priority: "High",
    question: "Apakah karyawan Part-time memiliki produktivitas (Sales per Hour) yang sepadan dengan Full-time di jam sibuk?",
    metric: "Part time, Fulltime & Labour cost",
    pageName: "Labour Cost & Productivity",
    route: "/labour-cost",
    status: "Selesai",
  },
  {
    id: 23,
    priority: "Medium",
    question: "Divisi mana yang paling sering gagal mencapai target headcount sesuai budget, dan apa bottleneck-nya?",
    metric: "Headcount per dept & As per Budget",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "headcount",
    status: "Selesai",
  },
  {
    id: 24,
    priority: "Low",
    question: "Apakah usia rata-rata karyawan Research & Development sesuai dengan profil/persona pelanggan fashion kita?",
    metric: "Komposisi usia & Dept Research & Development",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "rnd-design",
    status: "Selesai",
  },
  {
    id: 25,
    priority: "High",
    question: "Apakah tingginya turnover sukarela di Sales Offline dipicu oleh sistem komisi/insentif yang tidak kompetitif?",
    metric: "Turnover voluntary - sukarela %",
    pageName: "Turnover & Attrition",
    route: "/turnover",
    status: "Selesai",
  },
  {
    id: 26,
    priority: "Medium",
    question: "Apakah distribusi beban kerja (headcount) merata dan efektif antara tim Marketing dan Commercial?",
    metric: "Headcount per divisi (Marketing vs Commercial)",
    pageName: "Executive Dashboard",
    route: "/dashboard",
    status: "Selesai",
  },
  {
    id: 27,
    priority: "Low",
    question: "Seberapa banyak karyawan magang (Internship) yang dinilai layak dan berhasil dikonversi menjadi Full-time?",
    metric: "Internship Employee & Fulltime Employee",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "recruitment",
    status: "Selesai",
  },
  {
    id: 28,
    priority: "Medium",
    question: "Apakah tingginya masa kerja (> 5 tahun) Store Manager berkontribusi positif terhadap konsistensi capai target toko?",
    metric: "Komposisi masa kerja & Kelompok Jabatan",
    pageName: "Store Performance",
    route: "/store-performance",
    status: "Selesai",
  },
  {
    id: 29,
    priority: "Low",
    question: "Apakah ada bias gender yang signifikan dalam komposisi kelompok jabatan level Manajerial ke atas?",
    metric: "Komposisi Gender & Kelompok Jabatan",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "demographics",
    status: "Selesai",
  },
  {
    id: 30,
    priority: "Medium",
    question: "Seberapa siap talenta HR memfasilitasi ekspansi pembukaan toko baru berdasarkan headcount saat ini?",
    metric: "Total Headcount & Budget",
    pageName: "Workforce Analytics",
    route: "/workforce",
    tab: "recruitment",
    status: "Selesai",
  },
]

interface QuestNavigatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export const QuestNavigatorModal: React.FC<QuestNavigatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filterPriority, setFilterPriority] = useState<"All" | "High" | "Medium" | "Low">("All")
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  if (!isOpen) return null

  const filteredQuests = QUEST_LIST.filter((q) => {
    const matchPriority = filterPriority === "All" || q.priority === filterPriority
    const matchSearch =
      q.id.toString().includes(searchQuery) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.pageName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchPriority && matchSearch
  })

  const handleNavigate = (route: string) => {
    navigate(route)
    onClose()
    if (route.includes("#")) {
      const hash = route.split("#")[1]
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 150)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8102e] text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 font-heading">
                  Executive Presentation Quest Navigator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  30/30 Selesai
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Panduan presentasi interaktif untuk 30 pertanyaan bisnis & HR strategis dari data Excel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor quest (cth: 11), topik, atau divisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-inter"
            />
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-stretch sm:self-auto justify-center">
            {(["All", "High", "Medium", "Low"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterPriority === p
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {p === "All"
                  ? "Semua (30)"
                  : p === "High"
                  ? `Tinggi (${QUEST_LIST.filter((q) => q.priority === p).length})`
                  : p === "Medium"
                  ? `Sedang (${QUEST_LIST.filter((q) => q.priority === p).length})`
                  : `Rendah (${QUEST_LIST.filter((q) => q.priority === p).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 bg-slate-50/50">
          {filteredQuests.map((q) => (
            <div
              key={q.id}
              className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-red-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs shrink-0 mt-0.5">
                  #{q.id}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        q.priority === "High"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : q.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      Prioritas:{" "}
                      {q.priority === "High"
                        ? "Tinggi"
                        : q.priority === "Medium"
                        ? "Sedang"
                        : "Rendah"}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-700">
                      {q.pageName}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-red-700 transition-colors">
                    {q.question}
                  </h3>

                  <p className="text-[11px] text-slate-500 font-inter">
                    <strong>Metrik Terkait:</strong> {q.metric}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleNavigate(q.route)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#c8102e] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Buka di UI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredQuests.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada quest yang cocok dengan kata kunci pencarian.
            </div>
          )}
        </div>

        <div className="p-3.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>
            Setiap kartu dan chart di dashboard telah dilengkapi label penanda{" "}
            <strong className="text-slate-800"> Quest #Nomor</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
