import * as XLSX from "xlsx"

export interface TemplateDefinition {
  moduleKey: string
  fileName: string
  sheets: {
    sheetName: string
    rows: any[][]
  }[]
}

const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
  employees: {
    moduleKey: "employees",
    fileName: "Template_Master_Karyawan_HO_dan_Toko.xlsx",
    sheets: [
      {
        sheetName: "Master Data Demografi Sep 26",
        rows: [
          [
            "Employee No",
            "No",
            "DIVISI NEW SYFA",
            "DEPARTEMEN NEW BY HRBP",
            "UNIT DEPTBY HRBP",
            "NAMA KARYAWAN",
            "JABATAN",
            "Level Jabatan",
            "Jenis Kelamin",
            "TANGGAL LAHIR",
            "HEADCOUNT",
            "TGL MSK KRJ",
            "TGL HABIS KONTRAK",
            "STATUS KARYAWAN",
            "PENDIDIKAN TERAKHIR",
            "Labour Cost per Employee ",
            "BPJS KETENAGAKERJAAN",
            "BPJS KESEHATAN"
          ],
          [
            "A15161718",
            1,
            "COMMERCIAL BUSINESS",
            "SALES ONLINE",
            "CREATIVE & PRODUCTION ONLINE",
            "ESMERALDA GONZALES",
            "FOLLOW UP PRODUCTION ONLINE SPECIALIST",
            "ASHEAD",
            "PEREMPUAN",
            "1990-05-15",
            1,
            "2020-01-10",
            "2027-01-10",
            "KONTRAK",
            "SMA",
            8512000,
            "Terdaftar",
            "Terdaftar"
          ],
          [
            "A15161720",
            2,
            "BUSINESS SUPPORT",
            "MARKETING",
            "BRAND 3SECOND",
            "SEBASTIAN GUNAWAN",
            "GRAPHIC DESIGNER ONLINE",
            "STAFF",
            "LAKI-LAKI",
            "1992-08-20",
            1,
            "2021-03-15",
            "2026-12-31",
            "TETAP",
            "S1",
            6500000,
            "Terdaftar",
            "Terdaftar"
          ]
        ]
      },
      {
        sheetName: "demografi Toko September 2026",
        rows: [
          [
            "Employee No",
            "No",
            "DIVISI NEW",
            "DEPARTEMEN NEW BY HRBP",
            "NAMA TOKO",
            "NAMA KARYAWAN",
            "JABATAN",
            "Level Jabatan",
            "Jenis Kelamin",
            "TANGGAL LAHIR",
            "HEADCOUNT",
            "TGL MSK KRJ",
            "TGL HABIS KONTRAK",
            "STATUS KARYAWAN",
            "PENDIDIKAN TERAKHIR",
            "Labour Cost per Employee",
            "BPJS KETENAGAKERJAAN",
            "BPJS KESEHATAN"
          ],
          [
            "A15161760",
            1,
            "COMMERCIAL BUSINESS",
            "SALES OFFLINE",
            "SHOWROOM SUMMARECON MAL BKSI",
            "MEISYA SIREGAR",
            "STORE LEADER",
            "LEADER",
            "PEREMPUAN",
            "1993-11-12",
            1,
            "2022-02-01",
            "2026-12-31",
            "KONTRAK",
            "SMK",
            6850000,
            "Sudah Terdaftar",
            "Sudah Terdaftar"
          ],
          [
            "A15161761",
            2,
            "COMMERCIAL BUSINESS",
            "SALES OFFLINE",
            "SHOWROOM SUMMARECON MAL BKSI",
            "SURYADI PERWIRA",
            "SALES ADVISOR",
            "STAFF",
            "LAKI-LAKI",
            "1998-04-10",
            1,
            "2023-05-10",
            "2026-05-10",
            "KONTRAK",
            "SMA",
            5200000,
            "Sudah Terdaftar",
            "Sudah Terdaftar"
          ]
        ]
      }
    ]
  },
  movement: {
    moduleKey: "movement",
    fileName: "Template_Turnover_Pergerakan_Karyawan.xlsx",
    sheets: [
      {
        sheetName: "TurnOver2026HO",
        rows: [
          [
            "NO",
            "BULAN",
            "DIVISI",
            "DEPARTEMEN",
            "JML",
            "NAMA KARYAWAN",
            "TANGGAL MASUK KERJA",
            "TANGGAL RESIGN/HABIS KONTRAK",
            "KATEGORI PHK"
          ],
          [
            1,
            "Januari 2026",
            "SUPPLY CHAIN",
            "R&D DESIGN",
            1,
            "DAFINA AURELIA MARPAUNG",
            "2023-01-15",
            "2026-01-10",
            "MENGUNDURKAN DIRI"
          ],
          [
            2,
            "Januari 2026",
            "COMMERCIAL BUSINESS",
            "MARKETING",
            1,
            "KARINA BAHRIANI",
            "2022-06-01",
            "2026-01-20",
            "HABIS KONTRAK"
          ]
        ]
      },
      {
        sheetName: "TurnOverToko2026",
        rows: [
          [
            "NO",
            "AREA REGIONAL",
            "ASST HEAD",
            "KATAGORI",
            "SHOWROOM / COUNTER",
            "JML",
            "NAMA KARYAWAN",
            "TANGGAL MASUK KERJA",
            "TGL RESIGN / HABIS KONTRAK",
            "ALASAN RESIGN SOP",
            "ALASAN RESIGN NON SOP",
            "ALASAN HABIS KONTRAK",
            "ALASAN PHK"
          ],
          [],
          [
            1,
            "BARAT",
            "IVAN MAULANA",
            "SHOWROOM",
            "SHOWROOM PVJ BANDUNG",
            1,
            "ANDI SETIAWAN",
            "2024-03-01",
            "2026-01-15",
            "MENDAPATKAN PEKERJAAN LAIN",
            null,
            null,
            null
          ]
        ]
      }
    ]
  },
  compliance: {
    moduleKey: "compliance",
    fileName: "Template_Kepatuhan_Legalitas_Toko.xlsx",
    sheets: [
      {
        sheetName: "WLKP dll",
        rows: [
          ["DATA KEPATUHAN & LEGALITAS TOKO RITEL"],
          [],
          [],
          [],
          [
            "No",
            "Regional",
            "Kategori",
            "Store Name",
            "Alamat Toko",
            "Luas (m2)",
            "Jml Karyawan",
            "PP Tgl Awal",
            "PP Tgl Akhir",
            "WLKP Tgl Awal",
            "WLKP Tgl Akhir",
            "Status WLKP",
            "BPJS Jml Terdaftar",
            "BPJS Tgl Awal",
            "BPJS Tgl Akhir",
            "Status BPJS",
            "Genset Tgl Awal",
            "Genset Tgl Akhir",
            "Status Genset",
            "Kapasitas KVA",
            "Status Izin Genset",
            "Instalasi Listrik KVA",
            "Instalasi Listrik Tgl Awal",
            "Instalasi Listrik Tgl Akhir"
          ],
          [
            1,
            "BARAT",
            "SHOWROOM",
            "SHOWROOM SUMMARECON MAL BKSI",
            "Summarecon Mall Bekasi Lt. 1",
            120,
            12,
            "2024-01-01",
            "2026-12-31",
            "2024-06-01",
            "2027-06-01",
            "LENGKAP",
            12,
            "2024-01-01",
            "2026-12-31",
            "LENGKAP",
            "2023-01-01",
            "2026-01-01",
            "LENGKAP",
            50,
            "LENGKAP",
            60,
            "2023-01-01",
            "2026-01-01"
          ]
        ]
      }
    ]
  },
  sp: {
    moduleKey: "sp",
    fileName: "Template_Surat_Peringatan_SP.xlsx",
    sheets: [
      {
        sheetName: "SPtoko-2026",
        rows: [
          ["DISCIPLINE REPORT"],
          ["1 JANUARI 2026 To 31 DESEMBER 2026"],
          ["Company : Biensi Fesyenindo"],
          [
            "No",
            "Employee No",
            "Name",
            "Position",
            "Organization Unit",
            "Store Name",
            "Disciplines Information",
            "",
            "",
            "",
            "Disciplines Category",
            "",
            "Jumlah",
            "Level Jabatan",
            "Kategori Toko",
            "Regional",
            "Periode"
          ],
          [
            "",
            "",
            "",
            "",
            "",
            "",
            "Reference No",
            "Disciplines Name",
            "Start Date",
            "End Date",
            "Tata Tertib",
            "Non Tata Tertib"
          ],
          [
            1,
            "A25090016",
            "FERRY DARMAWAN",
            "Sales Advisor",
            "Store",
            "FS PALANGKARAYA",
            "DIS20260101521",
            "Surat Peringatan 1",
            "2026-01-05",
            "2026-07-05",
            1,
            null,
            1,
            "Sales Advisor",
            "FAMILY STORE",
            "TIMUR",
            "Januari"
          ]
        ]
      },
      {
        sheetName: "laporan SP 2024-26HO",
        rows: [
          ["DISCIPLINE REPORT"],
          ["SP 2024 - 2026"],
          ["Company : Biensi Fesyenindo"],
          [
            "No",
            "Employee No",
            "Name",
            "Position",
            "Organization Unit",
            "LOKASI KERJA",
            "Disciplines Information",
            "",
            "",
            "",
            "",
            "Disciplines Category",
            "",
            "Jumlah",
            "Divisi",
            "Departement",
            "Level Jabatan",
            "Periode",
            "Jumlah"
          ],
          [
            "",
            "",
            "",
            "",
            "",
            "",
            "Reference No",
            "Disciplines Name",
            "Start Date",
            "End Date",
            "Days Left",
            "Tata Tertib",
            "Non Tata Tertib"
          ],
          [
            1,
            "A15161718",
            "DAFINA AURELIA MARPAUNG",
            "Staff Of Design Graphic",
            "Head Office",
            "Bandung HQ",
            "DIS-HO-2026-001",
            "Surat Peringatan 2",
            "2026-02-01",
            "2026-08-01",
            180,
            1,
            null,
            1,
            "Commercial Business",
            "ONLINE",
            "Staff",
            "Februari 2026",
            1
          ]
        ]
      }
    ]
  },
  fraud: {
    moduleKey: "fraud",
    fileName: "Template_Kasus_Fraud_dan_BAKB.xlsx",
    sheets: [
      {
        sheetName: "Data Fraud 2022-2026",
        rows: [
          ["DISCIPLINE REPORT"],
          ["INVESTIGASI FRAUD & AUDIT STOCK OPNAME"],
          ["Company : Biensi Fesyenindo"],
          [
            "No",
            "Employee No",
            "Name",
            "Position",
            "Store Name",
            "Disciplines Name",
            "Penyebab Fraud",
            "Tgl Audit",
            "Selisih Qty",
            "Nilai BAKB",
            "Target",
            "Pencapaian Sales",
            "Keterangan",
            "Periode"
          ],
          [
            1,
            "A15161760",
            "ARIFIN SURYANA",
            "Store Leader",
            "SHOWROOM SUMMARECON MAL BKSI",
            "Kasus Fraud Transaksi",
            "Pencurian Barang dan Manipulasi Kasir",
            "2026-01-15",
            -5,
            3500000,
            150000000,
            120000000,
            "Dalam proses investigasi audit internal",
            "Januari 2026"
          ]
        ]
      }
    ]
  },
  bipartit: {
    moduleKey: "bipartit",
    fileName: "Template_Hubungan_Industrial_Bipartit.xlsx",
    sheets: [
      {
        sheetName: "Kasus",
        rows: [
          [
            "No",
            "Name",
            "Level Jabatan",
            "Store Name",
            "Kategori",
            "",
            "",
            "Keterangan",
            "Jml",
            "Periode Awal",
            "Periode Selesai"
          ],
          ["", "", "", "", "Bipartit", "Mediasi", "Pihak ke 3"],
          [
            1,
            "FERRY DARMAWAN",
            "STORE LEADER",
            "SHOWROOM LIPPO CIKARANG MALL",
            null,
            "Mediasi Disnaker",
            null,
            "Mediasi Disnaker terkait sisa masa kontrak",
            1,
            "Januari 2026",
            "Maret 2026"
          ],
          [
            2,
            "TRI EKA HARYANTO",
            "CASHIER",
            "FS CILEGON",
            "Bipartit",
            null,
            null,
            "Musyawarah mufakat internal bipartit",
            1,
            "Februari 2026",
            "Februari 2026"
          ],
          [
            3,
            "CHIKA AURELIA PERMATASARI",
            "STORE LEADER",
            "SHOWROOM JATOS BANDUNG",
            null,
            "Mediasi Disnaker",
            null,
            "Mediasi Disnaker perselisihan hak",
            1,
            "Februari 2026",
            "April 2026"
          ],
          [
            4,
            "TIKA FITRIANI HERMAWAN",
            "SALES ADVISOR",
            "FS DEPOK",
            null,
            null,
            "Pihak ke 3",
            "Penyelesaian mediasi pihak ketiga",
            1,
            "Maret 2026",
            "April 2026"
          ]
        ]
      }
    ]
  },
  attendance: {
    moduleKey: "attendance",
    fileName: "Template_Data_Absensi_Bulanan.xlsx",
    sheets: [
      {
        sheetName: "kehadiran2026 ",
        rows: [
          [
            "NO",
            "BULAN",
            "JUMLAH KARYWAN",
            "JML KARYAWAN SAKIT",
            "%TASE KARYAWAN SAKIT",
            "JML KARYAWAN IJIN",
            "%TASE KARYAWAN IJIN",
            "CUTI TAHUNAN",
            "%TASECUTI TAHUNAN",
            "ALPHA",
            "%TASE ALPHA",
            "HARI KERJA",
            "%TASE KEHADIRAN"
          ],
          [
            1,
            "JANUARI 2026",
            362,
            57,
            0.157,
            11,
            0.030,
            150,
            0.414,
            2,
            0.005,
            22,
            0.806
          ],
          [
            2,
            "FEBRUARI 2026",
            364,
            51,
            0.140,
            10,
            0.027,
            142,
            0.390,
            2,
            0.005,
            20,
            0.826
          ],
          [],
          [],
          [],
          [
            "NO",
            "BULAN",
            "JUMLAH KARYWAN STORE",
            "JML KARYAWAN SAKIT",
            "%TASE KARYAWAN SAKIT",
            "JML KARYAWAN IJIN",
            "%TASE KARYAWAN IJIN",
            "CUTI TAHUNAN",
            "%TASECUTI TAHUNAN",
            "ALPHA",
            "%TASE ALPHA",
            "HARI KERJA",
            "%TASE KEHADIRAN"
          ],
          [
            1,
            "JANUARI 2026",
            909,
            170,
            0.187,
            6,
            0.006,
            468,
            0.514,
            84,
            0.092,
            22,
            0.713
          ],
          [
            2,
            "FEBRUARI 2026",
            872,
            186,
            0.213,
            7,
            0.008,
            250,
            0.286,
            101,
            0.115,
            20,
            0.662
          ]
        ]
      }
    ]
  },
  sales: {
    moduleKey: "sales",
    fileName: "Template_Target_dan_Realisasi_Sales.xlsx",
    sheets: [
      {
        sheetName: "SALES2026",
        rows: [
          ["REKAP TARGET & REALISASI SALES 2026"],
          [],
          [],
          [
            "NO",
            "NAMA TOKO",
            "REG",
            "JENIS TOKO",
            "Actual JAN 2026",
            "",
            "Actual FEB 2026",
            "",
            "Actual MARET 2026",
            ""
          ],
          ["", "", "", "", "qty ", "Value ", "qty ", "Value ", "qty ", "Value "],
          [
            1,
            "SHOWROOM SUMMARECON MAL BKSI",
            "BARAT",
            "SHOWROOM",
            500,
            120000000,
            450,
            110000000,
            600,
            150000000
          ],
          [
            2,
            "COUNTER 3S PLAZA ASIA TASIK",
            "BARAT",
            "COUNTER",
            215,
            52483710,
            402,
            77845600,
            1247,
            241685700
          ]
        ]
      }
    ]
  }
}

export function downloadExcelTemplate(moduleKey: string) {
  const wb = XLSX.utils.book_new()

  if (moduleKey === "auto") {
    // Gabungkan seluruh modul ke dalam 1 berkas induk multi-sheet
    Object.values(TEMPLATE_DEFINITIONS).forEach((def) => {
      def.sheets.forEach((s) => {
        const ws = XLSX.utils.aoa_to_sheet(s.rows)
        XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
      })
    })

    XLSX.writeFile(wb, "Template_Induk_HR_Monitoring_Dashboard_v2.0.xlsx")
    return
  }

  const def = TEMPLATE_DEFINITIONS[moduleKey]
  if (!def) {
    throw new Error(`Template untuk modul "${moduleKey}" tidak ditemukan.`)
  }

  def.sheets.forEach((s) => {
    const ws = XLSX.utils.aoa_to_sheet(s.rows)
    XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
  })

  XLSX.writeFile(wb, def.fileName)
}
