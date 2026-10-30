import * as XLSX from "xlsx"
import {
  PHASE_1_TEMPLATE_ROWS,
  CRITICAL_QA_TEMPLATE_ROWS,
  SP_TOKO_TEMPLATE_ROWS,
} from "./templateMasterData"

export function autoFitColumns(rows: any[][], minWidth = 12): { wch: number }[] {
  const colWidths: number[] = []
  rows.forEach((row) => {
    if (!Array.isArray(row)) return
    row.forEach((cell, colIdx) => {
      let cellLen = 0
      if (cell !== null && cell !== undefined) {
        cellLen = String(cell).length
      }
      colWidths[colIdx] = Math.max(colWidths[colIdx] || minWidth, Math.min(cellLen + 3, 60))
    })
  })
  return colWidths.map((w) => ({ wch: Math.max(w || minWidth, minWidth) }))
}

export const RECRUITMENT_KPI_TEMPLATE_ROWS: any[][] = [
  ["MONITORING REKRUTMEN & KPI COMPLETION 2026"],
  ["PT BIPA BIENSI FESYENINDO"],
  [],
  ["BAGIAN A: PEMENUHAN TENAGA KERJA (MAN POWER REQUEST & RECRUITMENT FULFILLMENT 2026)"],
  [
    "No",
    "Bulan / Periode",
    "Divisi",
    "Departemen / Store",
    "Jabatan / Posisi",
    "Level Jabatan",
    "Jumlah Request (MPR)",
    "Jumlah Terisi (Hired)",
    "Status Pemenuhan",
    "Time to Hire (Hari)",
    "Total Biaya Rekrutmen (Rp)",
    "Cost per Hire (Rp)",
    "Turnover < 1 Tahun (Orang)",
    "Keterangan / Status Onboarding"
  ],
  [
    1,
    "Januari 2026",
    "COMMERCIAL BUSINESS",
    "SALES OFFLINE",
    "Sales Advisor",
    "Staff",
    12,
    11,
    "TERPENUHI 92%",
    14,
    8800000,
    800000,
    0,
    "Selesai Onboarding Batch 1"
  ],
  [
    2,
    "Februari 2026",
    "BUSINESS SUPPORT",
    "HUMAN RESOURCE",
    "HRBP Specialist",
    "Lead",
    1,
    1,
    "TERPENUHI 100%",
    21,
    1500000,
    1500000,
    0,
    "Probation Aktif"
  ],
  [
    3,
    "Maret 2026",
    "SUPPLY CHAIN",
    "PRODUCTION",
    "QC Specialist",
    "Staff",
    5,
    5,
    "TERPENUHI 100%",
    16,
    4000000,
    800000,
    0,
    "Onboarding Aktif"
  ],
  [],
  [],
  ["BAGIAN B: KPI DASHBOARD COMPLETION 2026"],
  [
    "No",
    "Divisi",
    "Departemen / Store",
    "Posisi / Jabatan",
    "PIC Evaluasi KPI",
    "Jumlah KPI Disusun",
    "Jumlah KPI Disetujui (Approved)",
    "Jumlah KPI Selesai Diinput (Completed)",
    "% KPI Completion",
    "Status Dashboard Completion",
    "Periode Review"
  ],
  [
    1,
    "COMMERCIAL BUSINESS",
    "SALES OFFLINE",
    "Store Leader",
    "Area Manager Barat",
    15,
    15,
    15,
    "100.0%",
    "COMPLETED",
    "Q1 2026"
  ],
  [
    2,
    "COMMERCIAL BUSINESS",
    "SALES ONLINE",
    "E-Commerce Specialist",
    "Head of Commercial",
    10,
    10,
    10,
    "100.0%",
    "COMPLETED",
    "Q1 2026"
  ],
  [
    3,
    "SUPPLY CHAIN",
    "PRODUCTION & QA",
    "Production QA Specialist",
    "Head of Supply Chain",
    8,
    8,
    8,
    "100.0%",
    "COMPLETED",
    "Q1 2026"
  ],
  [
    4,
    "BUSINESS SUPPORT",
    "HUMAN RESOURCE",
    "HR Generalist",
    "HR Manager",
    9,
    9,
    8,
    "88.9%",
    "IN PROGRESS",
    "Q1 2026"
  ]
]

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
    fileName: "Template_Master_Demografi_Karyawan_Bulanan.xlsx",
    sheets: [
      {
        sheetName: "Master Data Demografi HO",
        rows: [
          [
            "Employee No",
            "No",
            "Bulan",
            "Tahun",
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
            "September",
            2026,
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
            "September",
            2026,
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
        sheetName: "Demografi Toko",
        rows: [
          [
            "Employee No",
            "No",
            "Bulan",
            "Tahun",
            "DIVISI NEW",
            "DEPARTEMEN NEW BY HRBP",
            "NAMA TOKO",
            "Area Regional",
            "Kategori Toko",
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
            "September",
            2026,
            "COMMERCIAL BUSINESS",
            "SALES OFFLINE",
            "SHOWROOM SUMMARECON MAL BKSI",
            "BARAT",
            "SHOWROOM",
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
            "September",
            2026,
            "COMMERCIAL BUSINESS",
            "SALES OFFLINE",
            "SHOWROOM SUMMARECON MAL BKSI",
            "BARAT",
            "SHOWROOM",
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
            "Employee No",
            "NAMA KARYAWAN",
            "DIVISI",
            "DEPARTEMEN",
            "JABATAN / POSITION",
            "JML",
            "TANGGAL MASUK KERJA",
            "TANGGAL RESIGN/HABIS KONTRAK",
            "KATEGORI PHK"
          ],
          [
            1,
            "Januari 2026",
            "A15161801",
            "DAFINA AURELIA MARPAUNG",
            "SUPPLY CHAIN",
            "R&D DESIGN",
            "STAFF OF DESIGN GRAPHIC",
            1,
            "2023-01-15",
            "2026-01-10",
            "MENGUNDURKAN DIRI"
          ],
          [
            2,
            "Januari 2026",
            "A15161802",
            "KARINA BAHRIANI",
            "COMMERCIAL BUSINESS",
            "MARKETING",
            "MARKETING SPECIALIST",
            1,
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
            "Employee No",
            "NAMA KARYAWAN",
            "JABATAN / POSITION",
            "JML",
            "TANGGAL MASUK KERJA",
            "TGL RESIGN / HABIS KONTRAK",
            "ALASAN RESIGN SOP",
            "ALASAN RESIGN KASUS / NON SOP",
            "ALASAN HABIS KONTRAK",
            "ALASAN CLOSING TOKO",
            "ALASAN PHK"
          ],
          [
            1,
            "BARAT",
            "IVAN MAULANA",
            "SHOWROOM",
            "SHOWROOM PVJ BANDUNG",
            "A24090101",
            "ANDI SETIAWAN",
            "SALES ADVISOR",
            1,
            "2024-03-01",
            "2026-01-15",
            "MENDAPATKAN PEKERJAAN LAIN",
            null,
            null,
            null,
            null
          ],
          [
            2,
            "TIMUR",
            "DEDEN",
            "FAMILY STORE",
            "FS MER SURABAYA",
            "A24090102",
            "RINA MELATI",
            "CASHIER",
            1,
            "2023-05-10",
            "2026-02-28",
            null,
            null,
            "HABIS KONTRAK",
            null,
            null
          ]
        ]
      }
    ]
  },
  compliance: {
    moduleKey: "compliance",
    fileName: "Template_Perijinan_Ketenagakerjaan_WLKP_PP_K3.xlsx",
    sheets: [
      {
        sheetName: "WLKP dll",
        rows: [
          [
            "No.",
            "Perusahaan / Entitas",
            "Jenis Perijinan Ketenagakerjaan",
            "Nama Toko",
            "Dokumen / Perizinan",
            "Lokasi",
            "Tanggal Terbit",
            "Tanggal Berakhir",
            "PIC",
            "Status",
            "Sisa Hari",
            "Keterangan"
          ],
          [
            1,
            "Biensi",
            "WLKP",
            null,
            "Pelaporan WLKP Online",
            "HO",
            null,
            null,
            "HR Compliance",
            "Aktif",
            0,
            "Monitoring pelaporan"
          ],
          [
            2,
            "Biensi",
            "PP",
            null,
            "Pengesahan Peraturan Perusahaan",
            "HO",
            "04-Oct-26",
            "04-Oct-27",
            "HR Service",
            "Aktif",
            365,
            "Persiapan pembaruan"
          ],
          [
            3,
            "Biensi",
            "K3",
            null,
            "Sertifikat / dokumen K3",
            "HO",
            null,
            null,
            "GA / K3",
            "Aktif",
            0,
            "Monitoring masa berlaku"
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
        sheetName: "SPtoko",
        rows: SP_TOKO_TEMPLATE_ROWS
      },
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
          [
            "NO",
            "NAMA TOKO",
            "REG",
            "JENIS TOKO",
            "Target JAN 2026",
            null,
            "Actual JAN 2026",
            null,
            "Target FEB 2026",
            null,
            "Actual FEB 2026",
            null,
            "Target MARET 2026",
            null,
            "Actual MARET 2026",
            null
          ],
          [
            null,
            null,
            null,
            null,
            "qty ",
            "Value ",
            "qty ",
            "Value ",
            "qty ",
            "Value ",
            "qty ",
            "Value ",
            "qty ",
            "Value ",
            "qty ",
            "Value "
          ],
          [
            1,
            "SHOWROOM SUMMARECON MAL BKSI",
            "BARAT",
            "SHOWROOM",
            480,
            115000000,
            500,
            120000000,
            430,
            105000000,
            450,
            110000000,
            550,
            140000000,
            600,
            150000000
          ],
          [
            2,
            "COUNTER 3S PLAZA ASIA TASIK",
            "BARAT",
            "COUNTER",
            200,
            50000000,
            215,
            52483710,
            380,
            75000000,
            402,
            77845600,
            1150,
            225000000,
            1247,
            241685700
          ]
        ]
      }
    ]
  },
  recruitment: {
    moduleKey: "recruitment",
    fileName: "Template_Recruitment_dan_KPI_Completion.xlsx",
    sheets: [
      {
        sheetName: "Recruitment_KPI",
        rows: RECRUITMENT_KPI_TEMPLATE_ROWS
      }
    ]
  },
  kpi: {
    moduleKey: "kpi",
    fileName: "Template_Recruitment_dan_KPI_Completion.xlsx",
    sheets: [
      {
        sheetName: "Recruitment_KPI",
        rows: RECRUITMENT_KPI_TEMPLATE_ROWS
      }
    ]
  }
}

export function downloadExcelTemplate(moduleKey: string) {
  const wb = XLSX.utils.book_new()

  if (moduleKey === "auto") {
    // 1. Phase 1.0 (Master Baku 51 Metrik HR)
    const wsPhase1 = XLSX.utils.aoa_to_sheet(PHASE_1_TEMPLATE_ROWS)
    wsPhase1["!cols"] = autoFitColumns(PHASE_1_TEMPLATE_ROWS, 14)
    XLSX.utils.book_append_sheet(wb, wsPhase1, "Phase 1.0")

    // 2. Critical Q&A (30 Business Impact Questions)
    const wsQA = XLSX.utils.aoa_to_sheet(CRITICAL_QA_TEMPLATE_ROWS)
    wsQA["!cols"] = autoFitColumns(CRITICAL_QA_TEMPLATE_ROWS, 15)
    XLSX.utils.book_append_sheet(wb, wsQA, "Critical Q&A")

    // 3. Master Data Demografi HO & Toko
    TEMPLATE_DEFINITIONS.employees.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 4. Turnover HO & Toko
    TEMPLATE_DEFINITIONS.movement.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 5. Legalitas & Kepatuhan Toko (WLKP dll)
    TEMPLATE_DEFINITIONS.compliance.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 6. Absensi Kehadiran 2026 (HQ & Toko)
    TEMPLATE_DEFINITIONS.attendance.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 7. Rekap & Disiplin Detail (SPtoko, SPtoko-2026 & SP HO 2024-2026)
    TEMPLATE_DEFINITIONS.sp.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 8. Target & Realisasi Sales Toko (SALES2026)
    TEMPLATE_DEFINITIONS.sales.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 9. Fraud & Audit Opname Toko (Data Fraud 2022-2026)
    TEMPLATE_DEFINITIONS.fraud.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 10. Hubungan Industrial Bipartit & Mediasi (Kasus)
    TEMPLATE_DEFINITIONS.bipartit.sheets.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows)
      ws["!cols"] = autoFitColumns(s.rows, 14)
      XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
    })

    // 11. Monitoring Rekrutmen & KPI Dashboard Completion 2026
    const wsRecruit = XLSX.utils.aoa_to_sheet(RECRUITMENT_KPI_TEMPLATE_ROWS)
    wsRecruit["!cols"] = autoFitColumns(RECRUITMENT_KPI_TEMPLATE_ROWS, 15)
    XLSX.utils.book_append_sheet(wb, wsRecruit, "Recruitment_KPI")

    XLSX.writeFile(wb, "Template_Induk_HR_Monitoring_Dashboard_v2.0.xlsx")
    return
  }

  const def = TEMPLATE_DEFINITIONS[moduleKey]
  if (!def) {
    throw new Error(`Template untuk modul "${moduleKey}" tidak ditemukan.`)
  }

  def.sheets.forEach((s) => {
    const ws = XLSX.utils.aoa_to_sheet(s.rows)
    ws["!cols"] = autoFitColumns(s.rows, 14)
    XLSX.utils.book_append_sheet(wb, ws, s.sheetName.substring(0, 31))
  })

  XLSX.writeFile(wb, def.fileName)
}
