import ExcelJS from "exceljs"
import {
  DEMOGRAFI_HO_TEMPLATE_ROWS,
  DEMOGRAFI_TOKO_TEMPLATE_ROWS,
} from "./templateDemographyData"

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
        rows: DEMOGRAFI_HO_TEMPLATE_ROWS
      },
      {
        sheetName: "Demografi Toko",
        rows: DEMOGRAFI_TOKO_TEMPLATE_ROWS
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
            "TAHUN",
            "BULAN",
            "DIVISI",
            "DEPARTEMEN",
            "JML",
            "NIK KARYAWAN",
            "NAMA KARYAWAN",
            "JABATAN",
            "LEVEL JABATAN",
            "TANGGAL MASUK KERJA",
            "TANGGAL RESIGN/HABIS KONTRAK",
            "JML MASA KERJA",
            "MASA KERJA",
            "KATEGORI PEMISAHAN KARYAWAN",
            "ALASAN KELUAR",
            "JENIS PEMISAHAN KARYAWAN",
            "TIPE TURNOVER",
            "KATEGORI PHK",
            "ALASAN",
            "Jenis Karyawan Keluar"
          ],
          [
            1,
            2026,
            "Agustus",
            "COMMERCIAL BUSINESS",
            "PROMOTION",
            1,
            "A15161803",
            "MITA RAHAYU",
            "HOST LIVE",
            "STAFF",
            "2024-08-12",
            "2024-08-13",
            1,
            "0 Tahun 0 Bulan",
            "Mengundurkan Diri",
            "Tidak ada kabar",
            "Voluntary",
            "Voluntary",
            "Tidak ada kabar",
            "Tidak ada kabar",
            "Voluntary"
          ],
          [
            2,
            2026,
            "Agustus",
            "SUPPLY CHAIN",
            "R&D DESIGN",
            1,
            "A15161801",
            "DAFINA AURELIA MARPAUNG",
            "STAFF OF DESIGN GRAPHIC",
            "STAFF",
            "2023-01-15",
            "2026-08-20",
            948,
            "2 Tahun 7 Bulan",
            "Mengundurkan Diri",
            "Mendapat Tawaran Lain",
            "Voluntary",
            "Voluntary",
            "Pindah Kerja",
            "Pindah Kerja",
            "Voluntary"
          ]
        ]
      },
      {
        sheetName: "TurnOverToko2026",
        rows: [
          [
            "NO",
            "TAHUN",
            "BULAN",
            "DIVISI",
            "DEPARTEMEN",
            "NAMA TOKO",
            "AREA REGIONAL",
            "JML",
            "NIK KARYAWAN",
            "NAMA KARYAWAN",
            "JABATAN",
            "LEVEL JABATAN",
            "TANGGAL MASUK KERJA",
            "TANGGAL RESIGN/HABIS KONTRAK",
            "JML MASA KERJA",
            "MASA KERJA",
            "KATEGORI PEMISAHAN KARYAWAN",
            "ALASAN KELUAR",
            "JENIS PEMISAHAN KARYAWAN",
            "TIPE TURNOVER",
            "KATEGORI PHK",
            "ALASAN",
            "Jenis Karyawan Keluar"
          ],
          [
            1,
            2026,
            "Januari",
            "COMMERCIAL BUSINESS",
            "SALES OFFLINE",
            "FS PALANGKARAYA",
            "TIMUR",
            1,
            "A24090101",
            "ANDI SETIAWAN",
            "SALES ADVISOR",
            "STAFF",
            "2024-03-01",
            "2026-01-15",
            685,
            "1 Tahun 10 Bulan",
            "Mengundurkan Diri",
            "Mendapatkan Pekerjaan Lain",
            "Voluntary",
            "Voluntary",
            "Pindah Kerja",
            "Mendapat tawaran lain",
            "Voluntary"
          ],
          [
            2,
            2026,
            "Februari",
            "COMMERCIAL BUSINESS",
            "SALES OFFLINE",
            "FS MER SURABAYA",
            "TIMUR",
            1,
            "A24090102",
            "RINA MELATI",
            "CASHIER",
            "STAFF",
            "2023-05-10",
            "2026-02-28",
            1024,
            "2 Tahun 9 Bulan",
            "Habis Kontrak",
            "Habis Kontrak",
            "Involuntary",
            "Involuntary",
            "Habis Kontrak",
            "Habis Kontrak",
            "Involuntary"
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
        sheetName: "SP_HO",
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
            "Days Left",
            "Tata Tertib",
            "Non Tata Tertib",
            "",
            "",
            "",
            "",
            ""
          ],
          [
            1,
            "A15161801",
            "DAFINA AURELIA MARPAUNG",
            "Staff Of Design Graphic",
            "Creative & Production Online",
            "Head Office",
            "DIS2026010101",
            "Surat Peringatan 2",
            "2026-01-15",
            "2026-07-15",
            180,
            1,
            null,
            1,
            "Commercial Business",
            "ONLINE",
            "Staff",
            "Januari 2026"
          ],
          [
            2,
            "A15161802",
            "KARINA BAHRIANI",
            "Senior Manager Technical Service",
            "Technical Service",
            "Head Office",
            "DIS2026010102",
            "Surat Peringatan 1",
            "2026-01-20",
            "2026-07-20",
            180,
            null,
            1,
            1,
            "SUPPLY CHAIN",
            "Technical Service",
            "Manager",
            "Januari 2026"
          ]
        ]
      },
      {
        sheetName: "SP_Toko",
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
            "Nama Toko",
            "Area",
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
            "Periode"
          ],
          [
            "",
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
            "Non Tata Tertib",
            "",
            "",
            "",
            "",
            ""
          ],
          [
            1,
            "A25090016",
            "FERRY DARMAWAN",
            "Sales Advisor",
            "Store",
            "FS PALANGKARAYA",
            "TIMUR",
            "DIS20260101521",
            "Surat Peringatan 1",
            "2026-01-05",
            "2026-07-05",
            180,
            1,
            null,
            1,
            "Commercial Business",
            "Sales Offline",
            "Sales Advisor",
            "Januari 2026"
          ],
          [
            2,
            "A24080021",
            "CHIKA AURELIA PERMATASARI",
            "Cashier",
            "Store",
            "SHOWROOM PVJ BANDUNG",
            "BARAT",
            "DIS20260101520",
            "Surat Peringatan 1",
            "2026-01-10",
            "2026-07-10",
            180,
            1,
            null,
            1,
            "Commercial Business",
            "Sales Offline",
            "Kasir",
            "Januari 2026"
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

async function exportWorkbookWithExcelJS(
  sheets: { sheetName: string; rows: any[][] }[],
  fileName: string
) {
  const wb = new ExcelJS.Workbook()
  wb.creator = "Biensi HR Dashboard"
  wb.created = new Date()

  sheets.forEach((s) => {
    const ws = wb.addWorksheet(s.sheetName.substring(0, 31), {
      views: [{ state: "frozen", ySplit: 1 }]
    })

    const isWlkp = s.sheetName.toLowerCase().includes("wlkp")

    s.rows.forEach((row, rowIdx) => {
      const addedRow = ws.addRow(row)

      if (rowIdx === 0) {
        // HEADER ROW
        addedRow.height = isWlkp ? 28 : 26
        addedRow.eachCell((cell) => {
          if (isWlkp) {
            // KHUSUS WLKPP / WLKP dll: DESIGN HITAM PUTIH SEPERTI YANG DIKIRIM USER
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF000000" } // Hitam pekat
            }
            cell.font = {
              name: "Calibri",
              size: 11,
              bold: true,
              color: { argb: "FFFFFFFF" } // Teks putih
            }
            cell.alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true
            }
            cell.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF333333" } },
              right: { style: "thin", color: { argb: "FF333333" } }
            }
          } else {
            // Elegant modern header for other sheets
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF0F172A" } // Slate 900
            }
            cell.font = {
              name: "Calibri",
              size: 11,
              bold: true,
              color: { argb: "FFFFFFFF" }
            }
            cell.alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true
            }
            cell.border = {
              top: { style: "thin", color: { argb: "FF334155" } },
              bottom: { style: "thin", color: { argb: "FF334155" } },
              left: { style: "thin", color: { argb: "FF334155" } },
              right: { style: "thin", color: { argb: "FF334155" } }
            }
          }
        })
      } else {
        // DATA ROW
        addedRow.height = 20
        addedRow.eachCell((cell) => {
          cell.font = {
            name: "Calibri",
            size: 10,
            color: { argb: "FF0F172A" }
          }
          cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } }
          }
          if (typeof cell.value === "number") {
            cell.alignment = { vertical: "middle", horizontal: "right" }
          } else if (
            typeof cell.value === "string" &&
            (cell.value.match(/^\d{4}-\d{2}-\d{2}$/) || cell.value === "-" || cell.value === "TETAP" || cell.value === "KONTRAK" || cell.value === "Aktif")
          ) {
            cell.alignment = { vertical: "middle", horizontal: "center" }
          } else {
            cell.alignment = { vertical: "middle", horizontal: "left" }
          }
        })
      }
    })

    // Auto-fit column widths
    ws.columns.forEach((col) => {
      let maxLen = 12
      col.eachCell?.({ includeEmpty: false }, (cell) => {
        const valStr = cell.value ? String(cell.value) : ""
        if (valStr.length > maxLen) {
          maxLen = Math.min(valStr.length + 3, 40)
        }
      })
      col.width = maxLen
    })
  })

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export async function downloadExcelTemplate(moduleKey: string) {
  if (moduleKey === "auto") {
    const allSheets: { sheetName: string; rows: any[][] }[] = []

    // 1. Master Data Demografi HO & Toko (50 rows data resmi yang dikirim user)
    TEMPLATE_DEFINITIONS.employees.sheets.forEach((s) => allSheets.push(s))

    // 2. Turnover HO & Toko
    TEMPLATE_DEFINITIONS.movement.sheets.forEach((s) => allSheets.push(s))

    // 3. Legalitas & Kepatuhan Toko (WLKP dll) - Design Hitam Putih
    TEMPLATE_DEFINITIONS.compliance.sheets.forEach((s) => allSheets.push(s))

    // 4. Absensi Kehadiran (HQ & Toko)
    TEMPLATE_DEFINITIONS.attendance.sheets.forEach((s) => allSheets.push(s))

    // 5. Rekap & Disiplin Detail (SPtoko & SPtoko-2026)
    TEMPLATE_DEFINITIONS.sp.sheets.forEach((s) => allSheets.push(s))

    // 6. Target & Realisasi Sales Toko (SALES2026)
    TEMPLATE_DEFINITIONS.sales.sheets.forEach((s) => allSheets.push(s))

    // 7. Fraud & Audit Opname Toko (Data Fraud 2022-2026)
    TEMPLATE_DEFINITIONS.fraud.sheets.forEach((s) => allSheets.push(s))

    // 8. Hubungan Industrial Bipartit & Mediasi (Kasus)
    TEMPLATE_DEFINITIONS.bipartit.sheets.forEach((s) => allSheets.push(s))

    // 9. Monitoring Rekrutmen & KPI Dashboard Completion
    allSheets.push({
      sheetName: "Recruitment_KPI",
      rows: RECRUITMENT_KPI_TEMPLATE_ROWS
    })

    await exportWorkbookWithExcelJS(
      allSheets,
      "Template_Induk_HR_Monitoring_Dashboard.xlsx"
    )
    return
  }

  const def = TEMPLATE_DEFINITIONS[moduleKey]
  if (!def) {
    throw new Error(`Template untuk modul "${moduleKey}" tidak ditemukan.`)
  }

  await exportWorkbookWithExcelJS(def.sheets, def.fileName)
}
