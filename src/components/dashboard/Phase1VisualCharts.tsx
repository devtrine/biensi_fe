import React from 'react';
import Chart from 'react-apexcharts';
import {
  Users,
  DollarSign,
  TrendingDown,
  CalendarCheck,
  Briefcase,
  ShieldAlert,
  PieChart as PieIcon,
  Layers,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface Phase1VisualChartsProps {
  selectedYear: '2026' | '2025' | '2024';
  selectedMonth?: string;
  selectedMonthName?: string;
  selectedScope: 'corporate' | 'hq' | 'store';
  dashboardData?: any;
  divisionFilter?: string;
  departmentFilter?: string;
  storeTypeFilter?: string;
  regionalFilter?: string;
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTH_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function toPercentValue(rawRate: any): number {
  if (rawRate === null || rawRate === undefined) return 0;
  const parsed = parseFloat(String(rawRate));
  if (isNaN(parsed)) return 0;
  return parsed <= 1.5 ? Number((parsed * 100).toFixed(1)) : Number(parsed.toFixed(1));
}

function calcCountPct(count: any, total: any): string {
  const c = Number(count || 0);
  const t = Number(total || 0);
  if (t <= 0) return '0.0%';
  return `${((c / t) * 100).toFixed(1)}%`;
}

export const Phase1VisualCharts: React.FC<Phase1VisualChartsProps> = ({
  selectedYear,
  selectedMonth,
  selectedMonthName,
  selectedScope,
  dashboardData,
  divisionFilter,
  departmentFilter,
  storeTypeFilter,
  regionalFilter,
}) => {
  const [hoveredHqKey, setHoveredHqKey] = React.useState<string | null>(null);
  const [hoveredStoreKey, setHoveredStoreKey] = React.useState<string | null>(null);

  const apiDemo = dashboardData?.summary?.demographics;
  const apiProd = dashboardData?.summary?.productivity;
  const apiSp = dashboardData?.industrialAndSp;
  const periodInfo = dashboardData?.summary?.period;

  const activePeriodYear = periodInfo?.year || Number(selectedYear);
  const activePeriodMonthNum = periodInfo?.month || Number(selectedMonth || 9);
  const activePeriodLabel = `${selectedMonthName || MONTH_FULL[activePeriodMonthNum - 1] || `Bulan ${activePeriodMonthNum}`} ${activePeriodYear}`;

  const dynamicStoreHeadcount = apiDemo?.storeHeadcount || 0;
  const dynamicHqHeadcount = apiDemo?.hqHeadcount || 0;
  const totalHeadcount = apiDemo?.totalHeadcount || 0;

  const headcountCategories = ['2024', '2025', `${selectedYear} (${MONTH_SHORT[activePeriodMonthNum - 1] || 'Aktif'})`];
  const headcountChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 280,
      toolbar: { show: false },
      fontFamily: "'Geist', sans-serif"
    },
    colors: ['#0F172A', '#C8102E'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`,
      style: {
        fontSize: '12px',
        fontFamily: "'Geist Mono', monospace",
        colors: ['#FFFFFF']
      }
    },
    xaxis: {
      categories: headcountCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}`,
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontFamily: "'Geist Mono', monospace"
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: "'Geist', sans-serif",
      labels: { colors: '#475569' }
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const headcountSeries = [
    { name: 'Store Network', data: [0, 0, dynamicStoreHeadcount] },
    { name: 'Head Office (HQ)', data: [0, 0, dynamicHqHeadcount] }
  ];

  let displayCostItems = apiProd?.costByDivision && Array.isArray(apiProd.costByDivision) ? apiProd.costByDivision : [];

  if (divisionFilter && !divisionFilter.includes("Semua")) {
    const cleanDiv = divisionFilter.split("(")[0].trim().toUpperCase();
    const deptsOfDiv = (apiProd?.costByDepartment || []).filter(
      (d: any) => (d.parentDivision || "").toUpperCase() === cleanDiv
    );
    if (deptsOfDiv.length > 0) {
      displayCostItems = deptsOfDiv;
    } else {
      displayCostItems = displayCostItems.filter(
        (d: any) => (d.name || d.division || "").toUpperCase() === cleanDiv
      );
    }
  }

  if (departmentFilter && !departmentFilter.includes("Semua")) {
    const cleanDept = departmentFilter.split("(")[0].trim().toUpperCase();
    const specificDept = (apiProd?.costByDepartment || []).filter(
      (d: any) => (d.name || "").toUpperCase() === cleanDept
    );
    if (specificDept.length > 0) {
      displayCostItems = specificDept;
    }
  }

  const labourCategories = displayCostItems.map((d: any) => d.name || d.division || 'Uncategorized');
  const labourBudgetSeries = displayCostItems.map((d: any) => Number(((d.budgetCost ?? d.budget ?? 0) / 1000000000).toFixed(2)));
  const labourActualSeries = displayCostItems.map((d: any) => Number(((d.actualCost ?? d.actual ?? 0) / 1000000000).toFixed(2)));

  const labourCostChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      fontFamily: "'Geist', sans-serif"
    },
    colors: ['#64748B', '#C8102E'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: labourCategories,
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Miliar Rupiah (Rp)',
        style: { color: '#64748B', fontSize: '12px' }
      },
      labels: {
        formatter: (val) => `Rp ${val.toFixed(1)}M`,
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontFamily: "'Geist Mono', monospace"
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: { colors: '#475569' }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => (val != null ? `Rp ${val.toFixed(2)} Miliar` : '')
      }
    }
  };

  const labourCostSeries = [
    { name: 'Budget Bulanan', data: labourBudgetSeries },
    { name: 'Realisasi Aktual', data: labourActualSeries }
  ];

  const budgetCostTotal = apiProd?.totalBudgetCost || 0;
  const actualCostTotal = apiProd?.totalActualCost || 0;
  const variancePct = budgetCostTotal > 0
    ? (((actualCostTotal - budgetCostTotal) / budgetCostTotal) * 100).toFixed(1)
    : '0.0';
  const totalRunrateDisplay = `Rp ${(actualCostTotal / 1000000000).toFixed(2)} Miliar`;
  const diffCost = budgetCostTotal - actualCostTotal;
  const savingDisplay = diffCost >= 0
    ? `(Hemat Rp ${(diffCost / 1000000).toFixed(0)}Jt)`
    : `(Lebih Rp ${(Math.abs(diffCost) / 1000000).toFixed(0)}Jt)`;

  // Poin 2: Komposisi Gender (mendukung key 'LAKI-LAKI' maupun 'LAKI_LAKI' dari BE)
  const rawGender = apiDemo?.distribution?.byGender || {};
  const genderLaki =
    rawGender['LAKI-LAKI'] ??
    rawGender['LAKI_LAKI'] ??
    rawGender['Laki-laki'] ??
    rawGender['L'] ??
    0;
  const genderPerempuan =
    rawGender['PEREMPUAN'] ??
    rawGender['Perempuan'] ??
    rawGender['P'] ??
    0;
  const genderSeries = [genderLaki, genderPerempuan];
  const genderTotal = genderLaki + genderPerempuan;
  const genderLakiPct = genderTotal > 0 ? Number(((genderLaki / genderTotal) * 100).toFixed(1)) : 0;
  const genderPerempuanPct = genderTotal > 0 ? Number(((genderPerempuan / genderTotal) * 100).toFixed(1)) : 0;

  // Poin 6: Surat Peringatan (Jumlah SP Aktif & Jumlah SP Non Aktif)
  const storeSpCount = apiSp?.storeSp?.total || 0;
  const hqSpCount = apiSp?.hqSp?.total || 0;
  const spScopeObj =
    selectedScope === 'hq'
      ? apiSp?.hqSp
      : selectedScope === 'store'
        ? apiSp?.storeSp
        : apiSp?.corporateSp;

  const totalSpCount =
    selectedScope === 'hq'
      ? hqSpCount
      : selectedScope === 'store'
        ? storeSpCount
        : (apiSp?.totalSpIssued ?? storeSpCount + hqSpCount);

  const spAktifCount =
    spScopeObj?.spAktif ??
    ((apiSp?.storeSp?.spAktif ?? apiSp?.storeSp?.tataTertib ?? 0) +
      (apiSp?.hqSp?.spAktif ?? apiSp?.hqSp?.tataTertib ?? 0));
  const spNonAktifCount =
    spScopeObj?.spNonAktif ??
    ((apiSp?.storeSp?.spNonAktif ?? apiSp?.storeSp?.nonTataTertib ?? 0) +
      (apiSp?.hqSp?.spNonAktif ?? apiSp?.hqSp?.nonTataTertib ?? 0));

  const disputeScopeObj =
    selectedScope === 'hq'
      ? apiSp?.disputes?.hq
      : selectedScope === 'store'
        ? apiSp?.disputes?.store
        : apiSp?.disputes?.corporate;

  const disputesSelesai = disputeScopeObj?.selesai || 0;
  const disputesBipartit = disputeScopeObj?.bipartit || 0;
  const disputesMediasi = disputeScopeObj?.mediasi || 0;
  const disputesTotal = disputeScopeObj?.total || 0;

  const genderDonutOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: "'Geist', sans-serif"
    },
    colors: ['#0F172A', '#C8102E'],
    labels: ['Laki-laki', 'Perempuan'],
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 2, colors: ['#ffffff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'TOTAL',
              color: '#64748B',
              fontSize: '13px',
              fontFamily: "'Geist', sans-serif",
              fontWeight: 700,
              formatter: () => genderTotal.toLocaleString()
            }
          }
        }
      }
    },
    tooltip: { theme: 'dark' }
  };

  const levelStandard = apiDemo?.distribution?.byEmployeeLevel || {};
  const employeeLevels = Array.isArray(apiDemo?.distribution?.byEmployeeLevel) && apiDemo.distribution.byEmployeeLevel.length > 0
    ? apiDemo.distribution.byEmployeeLevel
    : [
        { level: 'BOD+', count: levelStandard.bodPlus || 0 },
        { level: 'Manager', count: levelStandard.manager || 0 },
        { level: 'Associate Manager', count: levelStandard.associateManager || 0 },
        { level: 'Lead / Head', count: levelStandard.lead || 0 },
        { level: 'Associate Lead', count: levelStandard.associateLead || 0 },
        { level: 'Team Leader', count: levelStandard.teamLeader || 0 },
        { level: 'Staff / Crew / SA', count: levelStandard.staffCrew || 0 }
      ].map((item) => ({
        ...item,
        percentage: totalHeadcount > 0 ? Number(((item.count / totalHeadcount) * 100).toFixed(1)) : 0
      }));

  const levelFunnelOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 260,
      toolbar: { show: false },
      fontFamily: "'Geist', sans-serif"
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '65%',
        distributed: true
      }
    },
    colors: ['#0F172A', '#1E293B', '#334155', '#475569', '#64748B', '#C8102E', '#E11D48'],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: (_val, opt?: { dataPointIndex: number }) => {
        const idx = opt?.dataPointIndex ?? 0;
        const item = employeeLevels[idx] || employeeLevels[0];
        return `${item.count} (${item.percentage}%)`;
      },
      offsetX: 10,
      style: {
        fontSize: '12px',
        fontFamily: "'Geist Mono', monospace",
        colors: ['#0F172A']
      }
    },
    xaxis: {
      categories: employeeLevels.map((l: any) => l.level),
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#334155',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} Orang`
      }
    }
  };

  const levelSeries = [
    {
      name: 'Jumlah Karyawan',
      data: employeeLevels.map((l: any) => l.count)
    }
  ];

  // Poin 5: Kehadiran HQ & Store lengkap (% Hadir, % Sakit, % Izin, % Cuti, % Alpa)
  const attHistoryYear = (dashboardData?.attendanceHistory || []).filter(
    (item: any) => Number(item?.period?.year) === Number(selectedYear)
  );

  const hqByMonth = new Map<number, any>();
  const storeByMonth = new Map<number, any>();
  attHistoryYear.forEach((item: any) => {
    const m = Number(item?.period?.month);
    const sc = String(item?.scope || '').toUpperCase();
    if (!m) return;
    if (sc === 'HQ') hqByMonth.set(m, item);
    if (sc === 'STORE') storeByMonth.set(m, item);
  });

  const periodHqAtt = dashboardData?.summary?.attendanceByScope?.hq;
  const periodStoreAtt = dashboardData?.summary?.attendanceByScope?.store;

  const latestUploadedAttMonth = Math.max(
    0,
    ...Array.from(hqByMonth.keys()),
    ...Array.from(storeByMonth.keys())
  );

  const activeHqAtt =
    periodHqAtt || (latestUploadedAttMonth > 0 ? hqByMonth.get(latestUploadedAttMonth) : null);
  const activeStoreAtt =
    periodStoreAtt || (latestUploadedAttMonth > 0 ? storeByMonth.get(latestUploadedAttMonth) : null);

  const activeAttMonthNum =
    periodHqAtt || periodStoreAtt
      ? activePeriodMonthNum
      : latestUploadedAttMonth || activePeriodMonthNum;
  const activeAttPeriodBadge =
    activeAttMonthNum > 0
      ? `${MONTH_FULL[activeAttMonthNum - 1] || `Bulan ${activeAttMonthNum}`} ${selectedYear}`
      : `Tahun ${selectedYear}`;

  const hqRateNum = activeHqAtt ? toPercentValue(activeHqAtt.attendanceRate) : 0;
  const storeRateNum = activeStoreAtt ? toPercentValue(activeStoreAtt.attendanceRate) : 0;
  const avgAttendanceHq = `${hqRateNum}%`;
  const avgAttendanceStore = `${storeRateNum}%`;

  const attendanceMonths = MONTH_SHORT;
  const attendanceHq: Array<number | null> = MONTH_SHORT.map((_, idx) => {
    const m = idx + 1;
    if (hqByMonth.has(m)) return toPercentValue(hqByMonth.get(m).attendanceRate);
    if (m === activePeriodMonthNum && periodHqAtt) return toPercentValue(periodHqAtt.attendanceRate);
    return null;
  });
  const attendanceStore: Array<number | null> = MONTH_SHORT.map((_, idx) => {
    const m = idx + 1;
    if (storeByMonth.has(m)) return toPercentValue(storeByMonth.get(m).attendanceRate);
    if (m === activePeriodMonthNum && periodStoreAtt) return toPercentValue(periodStoreAtt.attendanceRate);
    return null;
  });

  const attendanceChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      height: 260,
      toolbar: { show: false },
      fontFamily: "'Geist', sans-serif"
    },
    colors: ['#0F172A', '#C8102E'],
    stroke: {
      curve: 'smooth',
      width: [3, 2.5],
      dashArray: [0, 2]
    },
    xaxis: {
      categories: attendanceMonths,
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (val) => `${val}%`,
        style: { colors: '#64748B', fontSize: '12px', fontFamily: "'Geist Mono', monospace" }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px'
    },
    markers: {
      size: 5,
      colors: ['#0F172A', '#C8102E'],
      strokeWidth: 2
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => (val != null ? `${val.toFixed(1)}%` : '-')
      }
    }
  };

  const attendanceSeries = [
    { name: `% Kehadiran HQ (${avgAttendanceHq})`, data: attendanceHq },
    { name: `% Kehadiran Store (${avgAttendanceStore})`, data: attendanceStore }
  ];

  const hqSickDisplay = calcCountPct(activeHqAtt?.sickCount, activeHqAtt?.totalEmployees);
  const hqPermitDisplay = calcCountPct(activeHqAtt?.permissionCount, activeHqAtt?.totalEmployees);
  const hqLeaveDisplay = calcCountPct(activeHqAtt?.annualLeaveCount, activeHqAtt?.totalEmployees);
  const hqAlphaDisplay = calcCountPct(activeHqAtt?.absentCount, activeHqAtt?.totalEmployees);

  const storeSickDisplay = calcCountPct(activeStoreAtt?.sickCount, activeStoreAtt?.totalEmployees);
  const storePermitDisplay = calcCountPct(activeStoreAtt?.permissionCount, activeStoreAtt?.totalEmployees);
  const storeLeaveDisplay = calcCountPct(activeStoreAtt?.annualLeaveCount, activeStoreAtt?.totalEmployees);
  const storeAlphaDisplay = calcCountPct(activeStoreAtt?.absentCount, activeStoreAtt?.totalEmployees);

  const parseAttendancePct = (v: any): number => {
    if (v === null || v === undefined) return 0;
    const n = parseFloat(String(v).replace('%', '').trim());
    return isNaN(n) ? 0 : n;
  };

  const hqStatItems = [
    { key: 'hadir', label: '% Hadir', display: avgAttendanceHq, val: parseAttendancePct(avgAttendanceHq) },
    { key: 'sakit', label: '% Sakit', display: hqSickDisplay, val: parseAttendancePct(hqSickDisplay) },
    { key: 'izin', label: '% Izin', display: hqPermitDisplay, val: parseAttendancePct(hqPermitDisplay) },
    { key: 'cuti', label: '% Cuti', display: hqLeaveDisplay, val: parseAttendancePct(hqLeaveDisplay) },
    { key: 'alpa', label: '% Alpa', display: hqAlphaDisplay, val: parseAttendancePct(hqAlphaDisplay) },
  ];
  const maxHqVal = Math.max(...hqStatItems.map(i => i.val));
  const maxHqKey = maxHqVal > 0 ? (hqStatItems.find(i => i.val === maxHqVal)?.key || null) : null;
  const activeHqKey = hoveredHqKey || maxHqKey;

  const storeStatItems = [
    { key: 'hadir', label: '% Hadir', display: avgAttendanceStore, val: parseAttendancePct(avgAttendanceStore) },
    { key: 'sakit', label: '% Sakit', display: storeSickDisplay, val: parseAttendancePct(storeSickDisplay) },
    { key: 'izin', label: '% Izin', display: storePermitDisplay, val: parseAttendancePct(storePermitDisplay) },
    { key: 'cuti', label: '% Cuti', display: storeLeaveDisplay, val: parseAttendancePct(storeLeaveDisplay) },
    { key: 'alpa', label: '% Alpa', display: storeAlphaDisplay, val: parseAttendancePct(storeAlphaDisplay) },
  ];
  const maxStoreVal = Math.max(...storeStatItems.map(i => i.val));
  const maxStoreKey = maxStoreVal > 0 ? (storeStatItems.find(i => i.val === maxStoreVal)?.key || null) : null;
  const activeStoreKey = hoveredStoreKey || maxStoreKey;

  const rawLeaderboard = dashboardData?.storePerformance?.storeLeaderboard || [];
  const filteredLeaderboard = rawLeaderboard.filter((s: any) => {
    if (regionalFilter && !regionalFilter.includes("Semua")) {
      const isBarat = regionalFilter.toLowerCase().includes("barat");
      const isTimur = regionalFilter.toLowerCase().includes("timur");
      const reg = String(s.region || "").toUpperCase();
      if (isBarat && !reg.includes("BARAT")) return false;
      if (isTimur && !reg.includes("TIMUR")) return false;
    }
    if (storeTypeFilter && !storeTypeFilter.includes("Semua")) {
      const sType = String(s.storeType || "").toUpperCase();
      const sName = String(s.storeName || "").toUpperCase();
      if (storeTypeFilter.toLowerCase().includes("family") && !sType.includes("FAMILY") && !sName.startsWith("FS")) return false;
      if (storeTypeFilter.toLowerCase().includes("showroom") && !sType.includes("SHOWROOM") && !sName.startsWith("SHOWROOM")) return false;
      if (storeTypeFilter.toLowerCase().includes("counter") && !sType.includes("COUNTER") && !sName.startsWith("COUNTER")) return false;
    }
    return true;
  });

  const topStores = (filteredLeaderboard.length > 0 ? filteredLeaderboard : rawLeaderboard).slice(0, 7);
  const salesMonths = topStores.length > 0
    ? topStores.map((s: any) => s.storeName.replace('FAMILY STORE', 'FS').replace('SHOWROOM', 'SR').slice(0, 16))
    : ['FS KEPATIHAN', 'FS GARUT', 'FS TASIK', 'FS CSB', 'FS TEGAL', 'FS CIANJUR', 'FS SUBANG'];
  const salesMiliarData = topStores.length > 0
    ? topStores.map((s: any) => Number(((s.netSales || 0) / 1000000000).toFixed(2)))
    : [0, 0, 0, 0, 0, 0, 0];
  const payrollRatioData = topStores.length > 0
    ? topStores.map((s: any) => parseFloat(s.labourCostRatio || '0'))
    : [0, 0, 0, 0, 0, 0, 0];

  const salesProductivityOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      height: 270,
      toolbar: { show: false },
      fontFamily: "'Geist', sans-serif"
    },
    colors: ['#0F172A', '#16A34A'],
    stroke: {
      width: [0, 3],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4
      }
    },
    xaxis: {
      categories: salesMonths,
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Net Sales (Miliar Rp)',
          style: { color: '#0F172A', fontSize: '12px' }
        },
        labels: {
          formatter: (val) => `Rp ${val.toFixed(0)}M`,
          style: { colors: '#0F172A', fontSize: '12px', fontFamily: "'Geist Mono', monospace" }
        }
      },
      {
        opposite: true,
        title: {
          text: '% Labour Cost vs Sales',
          style: { color: '#16A34A', fontSize: '12px' }
        },
        labels: {
          formatter: (val) => `${val.toFixed(1)}%`,
          style: { colors: '#16A34A', fontSize: '12px', fontFamily: "'Geist Mono', monospace" }
        }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px'
    },
    tooltip: { theme: 'dark' }
  };

  const salesProductivitySeries = [
    {
      name: 'Total Penjualan',
      type: 'column',
      data: salesMiliarData
    },
    {
      name: '% Gaji vs Sales (Ratio)',
      type: 'line',
      data: payrollRatioData
    }
  ];

  // Poin 3: 7 Kategori Distribusi Usia
  const ageCategories = [
    '< 21 Thn',
    '21 – 25 Thn',
    '26 – 30 Thn',
    '31 – 40 Thn',
    '40 - 50 Thn',
    '50 - 60 Thn',
    '> 60 Thn',
  ];
  const rawAge = apiDemo?.distribution?.byAgeBracket || {};
  const ageCounts = [
    rawAge.under21 || 0,
    rawAge.age21To25 || 0,
    rawAge.age26To30 || 0,
    rawAge.age31To40 || 0,
    rawAge.age40To50 || 0,
    rawAge.age50To60 || 0,
    rawAge.over60 || 0,
  ];
  const agePercentages = ageCounts.map((cnt) =>
    totalHeadcount > 0 ? Number(((cnt / totalHeadcount) * 100).toFixed(1)) : 0
  );
  const avgAgeDisplay = apiDemo?.avgAgeAtPeriod ?? apiDemo?.avgAge ?? 0;

  // Poin 4: 6 Kategori Komposisi Masa Kerja
  const tenureLabels = [
    '< 1 tahun',
    '1 – 3 tahun',
    '> 3 – 5 tahun',
    '> 5 – 7 tahun',
    '> 7 – 10 tahun',
    '> 10 tahun',
  ];
  const tenureColors = ['#38BDF8', '#0F172A', '#F59E0B', '#16A34A', '#6366F1', '#C8102E'];
  const rawTenure = apiDemo?.distribution?.byTenureBracket || {};
  const tenureCounts = [
    rawTenure.under1Year || 0,
    rawTenure.tenure1To3Years ?? rawTenure.year1To3 ?? 0,
    rawTenure.tenure3To5Years ?? rawTenure.year3To5 ?? 0,
    rawTenure.tenure5To7Years || 0,
    rawTenure.tenure7To10Years || 0,
    rawTenure.over10Years || 0,
  ];
  const avgTenureDisplay = apiDemo?.avgTenureYears ?? apiDemo?.avgTenure ?? 0;
  const tenureOver3Count = tenureCounts.slice(2).reduce((sum, n) => sum + n, 0);

  const turnoverKpi = dashboardData?.turnoverAndRetention?.overview?.kpi;
  const rawTurnoverRate =
    dashboardData?.summary?.retention?.turnoverRate ??
    turnoverKpi?.monthlyTurnoverRate ??
    turnoverKpi?.annualTurnoverRate;

  const parsedTurnoverRate = rawTurnoverRate != null ? parseFloat(String(rawTurnoverRate)) : 0;
  const turnoverNum = isNaN(parsedTurnoverRate) ? 0 : parsedTurnoverRate;

  const turnoverRateDisplay = rawTurnoverRate != null && rawTurnoverRate !== ''
    ? (String(rawTurnoverRate).endsWith('%') ? String(rawTurnoverRate) : `${turnoverNum.toFixed(1)}%`)
    : '0.0%';

  const isTurnoverOptimal = turnoverNum <= 3.0;

  const totalTurnoverCount = turnoverKpi?.totalYtd ?? 0;
  const monthlyTurnoverCount = turnoverKpi?.monthlyTurnover ?? 0;
  const hasTurnoverMovements = totalTurnoverCount > 0 || monthlyTurnoverCount > 0;

  const voluntaryPct = hasTurnoverMovements && turnoverKpi?.voluntaryPercentage
    ? (String(turnoverKpi.voluntaryPercentage).endsWith('%')
        ? turnoverKpi.voluntaryPercentage
        : `${turnoverKpi.voluntaryPercentage}%`)
    : '0.0%';

  const nonVoluntaryPct = hasTurnoverMovements && turnoverKpi?.voluntaryPercentage
    ? `${Math.max(0, 100 - parseFloat(String(turnoverKpi.voluntaryPercentage))).toFixed(1)}%`
    : '0.0%';

  const invReasons = dashboardData?.turnoverAndRetention?.deepDive?.involuntaryClassification || [];
  const volReasons = dashboardData?.turnoverAndRetention?.deepDive?.voluntaryTopReasons || [];
  const denominator = totalTurnoverCount > 0 ? totalTurnoverCount : (monthlyTurnoverCount > 0 ? monthlyTurnoverCount : 1);
  const turnoverColors = ['#C8102E', '#F59E0B', '#3B82F6', '#8B5CF6', '#64748B'];
  const turnoverReasons = [...volReasons, ...invReasons].slice(0, 5).map((item: any, idx: number) => ({
    reason: item.name,
    count: item.count,
    pct: hasTurnoverMovements ? Number(((item.count / denominator) * 100).toFixed(1)) : 0,
    color: turnoverColors[idx % turnoverColors.length]
  }));

  const netSalesPerFte = apiProd?.revenuePerFte && parseFloat(apiProd.revenuePerFte) > 0
    ? `Rp ${(parseFloat(apiProd.revenuePerFte) / 1000000).toFixed(2)} Jt`
    : 'Rp 0 Jt';
  const salesMultiplier = apiProd?.payrollMultiplier
    ? `${parseFloat(apiProd.payrollMultiplier).toFixed(2)}x`
    : '0x';
  const ratioNormal = apiProd?.labourCostRatio
    ? `${parseFloat(apiProd.labourCostRatio).toFixed(2)}%`
    : '0.00%';

  const peakSalesTitle = apiProd?.totalSales && apiProd.totalSales > 0
    ? `Total Sales Rp ${(apiProd.totalSales / 1000000000).toFixed(1)}M`
    : 'Rp 0';

  const recruitmentFulfilled = dashboardData?.recruitment?.fulfilled ?? 0;
  const recruitmentTarget = dashboardData?.recruitment?.target ?? 0;
  const recruitmentPct =
    recruitmentTarget > 0
      ? ((recruitmentFulfilled / recruitmentTarget) * 100).toFixed(1)
      : '0.0';

  const kpiCompleted = dashboardData?.kpi?.completed ?? 0;
  const kpiTotal = dashboardData?.kpi?.total ?? 0;
  const kpiPct =
    kpiTotal > 0 ? ((kpiCompleted / kpiTotal) * 100).toFixed(1) : '0.0';

  const avgTimeToHire = dashboardData?.recruitment?.avgTimeToHire != null
    ? `${dashboardData.recruitment.avgTimeToHire} Hari`
    : '-';
  const costPerHire = dashboardData?.recruitment?.costPerHire != null
    ? `Rp ${dashboardData.recruitment.costPerHire.toLocaleString()}`
    : '-';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
              Visual Analytics Suite
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-red-50 text-[#c8102e] border border-red-200">
              <Calendar className="w-3.5 h-3.5" />
              Demografi: {activePeriodLabel}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">
            Eksplorasi visual komprehensif berdasarkan 51 metrik baku HR_Monitoring_Dashboard v2.0
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Optimal (&lt; 3% Turnover / &lt; 10% Ratio)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Aktual {selectedYear}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-heading">
                  Trajektori Headcount (2024 – 2026)
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-600">
                Periode: {activePeriodLabel}
              </span>
            </div>

            <div className="pt-3">
              <Chart options={headcountChartOptions} series={headcountSeries} type="bar" height={280} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-3.5 mt-2 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">2024 Basis</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">0</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">2025 Konsolidasi</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">0</span>
            </div>
            <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
              <span className="text-xs text-blue-700 uppercase font-bold block mb-0.5">{activePeriodLabel}</span>
              <span className="text-base font-bold font-mono text-blue-900 tabular-nums">{totalHeadcount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-heading">
                  Labour Cost: Budget vs Actual
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {variancePct}% Variance
              </span>
            </div>

            <div className="pt-3">
              <Chart options={labourCostChartOptions} series={labourCostSeries} type="bar" height={280} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Total Run-rate Bulanan:</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {totalRunrateDisplay} <span className="text-emerald-600 font-normal">{savingDisplay}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                  Komposisi Gender
                </h3>
                <span className="text-[11px] font-mono text-slate-500">{activePeriodLabel}</span>
              </div>
              <PieIcon className="w-4 h-4 text-slate-400" />
            </div>

            <div className="py-2 flex justify-center">
              <Chart
                key={`gender-${selectedScope}-${selectedYear}-${selectedMonth}-${genderTotal}`}
                options={genderDonutOptions}
                series={genderSeries}
                type="donut"
                width="100%"
                height={190}
              />
            </div>

            <div className="space-y-2 pt-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A]" /> Laki-laki
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {genderLaki} <span className="text-slate-500 font-normal text-xs">({genderLakiPct}%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" /> Perempuan
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {genderPerempuan} <span className="text-slate-500 font-normal text-xs">({genderPerempuanPct}%)</span>
                </span>
              </div>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            Representasi seimbang di gerai ritel & kantor pusat.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                  Distribusi Usia
                </h3>
                <span className="text-[11px] font-mono text-slate-500">{activePeriodLabel}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">
                Rata-rata {avgAgeDisplay}th
              </span>
            </div>

            <div className="space-y-2 pt-2.5">
              {ageCategories.map((cat, idx) => {
                const count = ageCounts[idx];
                const pct = agePercentages[idx];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-800 font-medium">{cat}</span>
                      <span className="font-mono text-slate-700 tabular-nums">
                        {count} <span className="text-slate-500 text-xs">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${idx === 1 || idx === 2 ? 'bg-[#C8102E]' : 'bg-slate-800'}`}
                        style={{ width: `${Math.min(pct * 1.8, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            {((agePercentages[0] || 0) + (agePercentages[1] || 0) + (agePercentages[2] || 0)).toFixed(1)}% karyawan berusia ≤ 30 tahun.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                  Komposisi Masa Kerja
                </h3>
                <span className="text-[11px] font-mono text-slate-500">{activePeriodLabel}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">
                Rata-rata {avgTenureDisplay}th
              </span>
            </div>

            <div className="space-y-2 pt-2.5">
              {tenureLabels.map((lbl, idx) => {
                const count = tenureCounts[idx];
                const pct = totalHeadcount > 0 ? Number(((count / totalHeadcount) * 100).toFixed(1)) : 0;
                const color = tenureColors[idx];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-800 font-medium">{lbl}</span>
                      <span className="font-mono text-slate-700 tabular-nums">
                        {count} <span className="text-slate-500 text-xs">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            {totalHeadcount > 0 ? ((tenureOver3Count / totalHeadcount) * 100).toFixed(1) : '0.0'}% telah mengabdi &gt; 3 tahun.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                  Piramida Jabatan
                </h3>
                <span className="text-[11px] font-mono text-slate-500">{activePeriodLabel}</span>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <div className="pt-2">
              <Chart options={levelFunnelOptions} series={levelSeries} type="bar" height={240} />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-600 flex items-center justify-between">
            <span>Struktur Organisasi</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {apiDemo?.leaderToStaffRatio || apiDemo?.leaderStaffRatio || '1:0'} Rasio Leader
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#C8102E]" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-heading">
                  Turnover Voluntary vs Nonvoluntary
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 ${
                isTurnoverOptimal
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                Target &lt; 3%
                {isTurnoverOptimal ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 inline" />
                )}
              </span>
            </div>

            <div className="my-3.5 p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Turnover Bulanan Aktual</span>
                <span className={`text-2xl font-black font-mono tabular-nums ${
                  isTurnoverOptimal ? 'text-emerald-600' : 'text-rose-600'
                }`}>{turnoverRateDisplay}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Voluntary vs Nonvoluntary</span>
                <span className="text-sm font-mono font-bold text-slate-800">{voluntaryPct} Sukarela • {nonVoluntaryPct} Perusahaan</span>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-sm">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Kategori Alasan PHK / Resign
              </span>
              {turnoverReasons.length > 0 ? (
                turnoverReasons.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || '#64748B' }} />
                      <span className="text-slate-800 font-medium text-sm">{item.reason}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                      {item.count} <span className="text-slate-500 font-normal text-xs">({item.pct}%)</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400 font-mono">
                  Belum ada catatan turnover untuk periode ini
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>Formula: Keluar / Avg Headcount × 100%</span>
            <span className={`font-mono font-bold text-sm ${
              isTurnoverOptimal ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {isTurnoverOptimal ? 'Terkendali' : 'Melebihi Target'}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-heading">
                  Tingkat Kehadiran Bulanan (% Kehadiran HQ vs Store)
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-600">
                Rekap: {activeAttPeriodBadge}
              </span>
            </div>

            <div className="pt-2">
              <Chart
                key={`att-${selectedYear}-${selectedMonth}-${hqRateNum}-${storeRateNum}`}
                options={attendanceChartOptions}
                series={attendanceSeries}
                type="line"
                height={250}
              />
            </div>
          </div>

          <div className="space-y-2.5 pt-3 mt-2 border-t border-slate-100">
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
                  HQ (Kantor Pusat)
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {activeHqAtt?.totalEmployees ? `${activeHqAtt.totalEmployees} Karyawan` : 'Belum ada data'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center">
                {hqStatItems.map((item) => {
                  const isSelected = activeHqKey === item.key;
                  const isMax = maxHqKey === item.key && maxHqVal > 0;

                  let cardCls = "bg-white border-slate-100 text-slate-900";
                  let lblCls = "text-slate-500 font-semibold";
                  let valCls = "text-slate-900";

                  if (isSelected) {
                    if (item.key === 'hadir') {
                      cardCls = "bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-300/70 shadow-xs";
                      lblCls = "text-emerald-700 font-bold";
                      valCls = "text-emerald-700 font-black";
                    } else if (item.key === 'alpa') {
                      cardCls = "bg-rose-50/90 border-rose-300 ring-1 ring-rose-300/70 shadow-xs";
                      lblCls = "text-rose-700 font-bold";
                      valCls = "text-rose-700 font-black";
                    } else {
                      cardCls = "bg-sky-50/90 border-sky-300 ring-1 ring-sky-300/70 shadow-xs";
                      lblCls = "text-sky-700 font-bold";
                      valCls = "text-sky-700 font-black";
                    }
                  }

                  return (
                    <div
                      key={item.key}
                      onMouseEnter={() => setHoveredHqKey(item.key)}
                      onMouseLeave={() => setHoveredHqKey(null)}
                      className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer relative select-none hover:-translate-y-0.5 hover:shadow-xs ${cardCls}`}
                      title={isMax ? `${item.label} merupakan persentase tertinggi (${item.display})` : undefined}
                    >
                      {isMax && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2" title="Tertinggi">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      <span className={`text-[10px] uppercase block transition-colors ${lblCls}`}>
                        {item.label}
                      </span>
                      <span className={`text-sm font-bold font-mono tabular-nums transition-colors ${valCls}`}>
                        {item.display}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-red-50/30 p-2.5 rounded-xl border border-red-100/80">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                  Store (Toko Ritel)
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {activeStoreAtt?.totalEmployees ? `${activeStoreAtt.totalEmployees} Karyawan` : 'Belum ada data'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center">
                {storeStatItems.map((item) => {
                  const isSelected = activeStoreKey === item.key;
                  const isMax = maxStoreKey === item.key && maxStoreVal > 0;

                  let cardCls = "bg-white border-slate-100 text-slate-900";
                  let lblCls = "text-slate-500 font-semibold";
                  let valCls = item.key === 'hadir' ? "text-[#C8102E]" : "text-slate-900";

                  if (isSelected) {
                    if (item.key === 'hadir') {
                      cardCls = "bg-red-50/90 border-red-300 ring-1 ring-red-300/70 shadow-xs";
                      lblCls = "text-[#C8102E] font-bold";
                      valCls = "text-[#C8102E] font-black";
                    } else if (item.key === 'alpa') {
                      cardCls = "bg-rose-50/90 border-rose-300 ring-1 ring-rose-300/70 shadow-xs";
                      lblCls = "text-rose-700 font-bold";
                      valCls = "text-rose-700 font-black";
                    } else {
                      cardCls = "bg-sky-50/90 border-sky-300 ring-1 ring-sky-300/70 shadow-xs";
                      lblCls = "text-sky-700 font-bold";
                      valCls = "text-sky-700 font-black";
                    }
                  }

                  return (
                    <div
                      key={item.key}
                      onMouseEnter={() => setHoveredStoreKey(item.key)}
                      onMouseLeave={() => setHoveredStoreKey(null)}
                      className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer relative select-none hover:-translate-y-0.5 hover:shadow-xs ${cardCls}`}
                      title={isMax ? `${item.label} merupakan persentase tertinggi (${item.display})` : undefined}
                    >
                      {isMax && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2" title="Tertinggi">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8102E]"></span>
                        </span>
                      )}
                      <span className={`text-[10px] uppercase block transition-colors ${lblCls}`}>
                        {item.label}
                      </span>
                      <span className={`text-sm font-bold font-mono tabular-nums transition-colors ${valCls}`}>
                        {item.display}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-heading">
                  Produktivitas Penjualan & Rasio Payroll vs Sales ({selectedYear})
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                {peakSalesTitle}
              </span>
            </div>

            <div className="pt-3">
              <Chart options={salesProductivityOptions} series={salesProductivitySeries} type="line" height={270} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">Net Sales / FTE</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">{netSalesPerFte}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">Sales Multiplier</span>
              <span className="text-base font-bold font-mono text-emerald-600 tabular-nums">{salesMultiplier}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">Ratio Normal</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">{ratioNormal}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[var(--biensi-red)]" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-heading">
                  Hubungan Industrial & Surat Peringatan (SP)
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200/80">
                Total SP: {totalSpCount}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 my-3.5">
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--biensi-red)] block mb-1.5">
                  Kategori Surat Peringatan
                </span>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-sans font-medium">Jumlah SP Aktif</span>
                    <span className="font-bold text-slate-900 text-sm tabular-nums">{spAktifCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-sans font-medium">Jumlah SP Non Aktif</span>
                    <span className="font-bold text-slate-900 text-sm tabular-nums">{spNonAktifCount}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/70 block font-medium">
                  Store: {storeSpCount} | HQ: {hqSpCount}
                </span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Status Sengketa ({disputesTotal})
                  </span>
                  <div className="text-base font-mono font-bold text-slate-900">
                    {disputesSelesai} Selesai • {disputesBipartit} Bipartit
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/70 block font-medium">
                  {disputesMediasi} Mediasi Disnaker
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-700 font-medium">Fulfillment Rekrutmen {selectedYear}:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {recruitmentFulfilled.toLocaleString()} / {recruitmentTarget.toLocaleString()} ({recruitmentPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--biensi-dark)]" style={{ width: `${Math.min(Number(recruitmentPct), 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 pt-0.5">
                  <span className="text-slate-700 font-medium">KPI Dashboard Completion {selectedYear}:</span>
                  <span className="font-mono font-bold text-[var(--biensi-red)] tabular-nums flex items-center gap-1.5">
                    {kpiCompleted} / {kpiTotal} Posisi ({kpiPct}%)
                    <CheckCircle2 className="w-4 h-4 text-[var(--biensi-red)] inline" />
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--biensi-red)]" style={{ width: `${Math.min(Number(kpiPct), 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avg Time to Hire: <strong className="text-slate-800 font-mono">{avgTimeToHire}</strong> {avgTimeToHire !== '-' ? '(< 21 Hari)' : ''}</span>
            <span>Cost/Hire: <strong className="text-slate-800 font-mono">{costPerHire}</strong></span>
          </div>
        </div>
      </div>

      {/* <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#c8102e]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-heading">
                Matriks Perijinan Ketenagakerjaan (WLKP, PP &amp; K3)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Monitoring masa berlaku dokumen Wajib Lapor Ketenagakerjaan Perusahaan (WLKP), Peraturan Perusahaan (PP), dan K3.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              WLKP: {complianceScopeStats?.wlkp ?? compliancePermits?.byType?.wlkp ?? 0}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              PP: {complianceScopeStats?.pp ?? compliancePermits?.byType?.pp ?? 0}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
              K3: {complianceScopeStats?.k3 ?? compliancePermits?.byType?.k3 ?? 0}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Aktif: {complianceScopeStats?.patuh ?? 0}
            </span>
            {(complianceScopeStats?.akanJatuhTempo ?? 0) > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold border border-amber-200">
                Segera Habis: {complianceScopeStats?.akanJatuhTempo}
              </span>
            )}
            {(complianceScopeStats?.kadaluarsa ?? 0) > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold border border-red-200">
                Kadaluarsa: {complianceScopeStats?.kadaluarsa}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8fafc] text-slate-700 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center w-12 font-mono">No.</th>
                <th className="py-3 px-3 min-w-[140px]">Perusahaan / Entitas</th>
                <th className="py-3 px-3 min-w-[160px]">Jenis Perijinan Ketenagakerjaan</th>
                <th className="py-3 px-3 min-w-[140px]">Nama Toko</th>
                <th className="py-3 px-3 min-w-[200px]">Dokumen / Perizinan</th>
                <th className="py-3 px-3 min-w-[100px]">Lokasi</th>
                <th className="py-3 px-3 min-w-[120px]">Tanggal Terbit</th>
                <th className="py-3 px-3 min-w-[120px]">Tanggal Berakhir</th>
                <th className="py-3 px-3 min-w-[120px]">PIC</th>
                <th className="py-3 px-3 min-w-[100px] text-center">Status</th>
                <th className="py-3 px-3 min-w-[95px] text-right font-mono">Sisa Hari</th>
                <th className="py-3 px-3 min-w-[170px]">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplianceTable.length > 0 ? (
                filteredComplianceTable.map((item, idx) => {
                  const rawStatus = String(item.status || 'PATUH').toUpperCase();
                  const statusLabel =
                    rawStatus === 'PATUH'
                      ? 'Aktif'
                      : rawStatus === 'SEGERA HABIS'
                        ? 'Segera Habis'
                        : rawStatus === 'KADALUARSA'
                          ? 'Kadaluarsa'
                          : item.status;
                  const statusClass =
                    rawStatus === 'KADALUARSA'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : rawStatus === 'SEGERA HABIS'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  const storeDisplay = item.storeId ? item.entity : '-';

                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-600 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {item.entityName || 'Biensi'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-900 text-white">
                          {item.area || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {storeDisplay}
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium">
                        {item.description || '-'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {item.location || '-'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                        {formatComplianceDate(item.validFrom)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                        {formatComplianceDate(item.validUntil)}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {item.pic || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {item.remainingDays ?? 0}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {item.notes || '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400 text-xs sm:text-sm font-mono">
                    Belum ada data perijinan ketenagakerjaan (WLKP, PP, K3) untuk skop ini. Silakan impor template WLKP.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};
