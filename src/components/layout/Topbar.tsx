import React, { useState } from "react"
import {
  Menu,
  Search,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  User,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react"
import { Link } from "react-router-dom"
import { QuestNavigatorModal } from "../ui/QuestNavigatorModal"

interface TopbarProps {
  onToggleSidebar: () => void
  onOpenSearch: () => void
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  onOpenSearch,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showQuestNavigator, setShowQuestNavigator] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Cari karyawan, NIK, departemen...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded shadow-xs">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          type="button"
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:block"
          title="Bantuan & Dokumentasi"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="relative pl-2 border-l border-slate-200">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <img
              src="https://cdn.vectorstock.com/i/1000v/92/05/panda-cartoon-cute-animals-vector-39469205.jpg"
              alt="Budi Santoso"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/20"
            />
            <div className="hidden md:block">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <span>Muntazier</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Admin HR Senior
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">Budi Santoso</p>
                <p className="text-xs text-slate-500">
                  budi.santoso@biensi.co.id
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terhubung Live Engine
                </span>
              </div>
              <div className="py-1">
                <Link
                  to="/setting"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-400" /> Detail Profil
                </Link>
                <Link
                  to="/setting"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" /> Pengaturan Sistem
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <QuestNavigatorModal
        isOpen={showQuestNavigator}
        onClose={() => setShowQuestNavigator(false)}
      />
    </header>
  )
}
