import React, { useState } from "react"
import { User, Shield, Bell, Palette, Globe, Check } from "lucide-react"

export const SettingsPage: React.FC = () => {
  const [section, setSection] = useState<
    "profile" | "security" | "app" | "notification" | "appearance"
  >("profile")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Konfigurasi sistem berhasil disimpan!</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Akun & Sistem
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola profil administrator, autentikasi keamanan, pemicu notifikasi waspada, dan preferensi tampilan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1 text-xs font-bold">
          {[
            { id: "profile", label: "Profil Admin", icon: User },
            { id: "security", label: "Keamanan & 2FA", icon: Shield },
            { id: "app", label: "Parameter Sistem HR", icon: Globe },
            { id: "notification", label: "Pemicu Notifikasi", icon: Bell },
            { id: "appearance", label: "Tema & Identitas Brand", icon: Palette },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id as "profile" | "security" | "app" | "notification" | "appearance")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${section === item.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          {section === "profile" && (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Profil Administrator
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-500/20"
                />
                <div>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    Ganti Foto Profil
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">
                    JPG, GIF atau PNG. Ukuran maksimal 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    defaultValue="Muntazier"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    defaultValue="muntazier@biensi.co.id"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jabatan Resmi
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin HR Senior"
                    readOnly
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Telepon Kantor
                  </label>
                  <input
                    type="text"
                    defaultValue="+62 22 7300-3333 (Ext Kantor Pusat 201)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#c8102e] hover:bg-red-700 rounded-xl shadow-xs"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {section === "security" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Keamanan & Autentikasi Dua Faktor (2FA)
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Autentikasi Dua Faktor (2FA)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Aktif
                  </span>
                </div>
                <p className="text-slate-500">
                  Akun Anda dilindungi dengan verifikasi OTP Google Authenticator.
                </p>
              </div>
            </div>
          )}

          {section === "app" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Parameter Mesin BIENSI Live HR
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Frekuensi Sinkronisasi Presensi Biometrik
                    </span>
                    <span className="text-slate-500">
                      Frekuensi data scan sidik jari/wajah toko ditarik ke basis data pusat
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    Setiap 15 Menit
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Ambang Batas Peringatan Habis Kontrak
                    </span>
                    <span className="text-slate-500">
                      Memicu notifikasi Pusat Peringatan sebelum tanggal akhir PKWT
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    30 Hari
                  </span>
                </div>
              </div>
            </div>
          )}

          {section === "notification" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Langganan Notifikasi Peringatan
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-red-600 accent-red-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Peringatan Kontrak Berakhir (≤ 30 hari)
                    </span>
                    <span className="text-slate-500">
                      Dapatkan lencana notifikasi waktu nyata saat staf toko memasuki jendela kritis kontrak
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-red-600 accent-red-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Peringatan Anggaran Biaya Tenaga Kerja Melampaui Batas (Over-Budget)
                    </span>
                    <span className="text-slate-500">
                      Kirimkan notifikasi saat rasio penggajian divisi melampaui batas anggaran yang dialokasikan
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {section === "appearance" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Pengaturan Tema & Identitas Palet Brand
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="font-bold text-slate-800 block">
                  Aksen Brand Korporat
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg bg-[#C8102E] ring-2 ring-red-400"
                    title="3SECOND Crimson"
                  />
                  <div
                    className="w-8 h-8 rounded-lg bg-[#172B4D]"
                    title="Navy Slate"
                  />
                  <div
                    className="w-8 h-8 rounded-lg bg-[#0F172A]"
                    title="Dark Obsidian"
                  />
                </div>
                <p className="text-slate-500 mt-2">
                  Token desain aktif dikonfigurasikan dengan{" "}
                  <strong>3SECOND Crimson Red (#C8102E)</strong> dan Navigasi Dark Slate.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
