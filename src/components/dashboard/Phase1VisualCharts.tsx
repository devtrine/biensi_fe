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
} from 'lucide-react';

interface Phase1VisualChartsProps {
  selectedYear: '2026' | '2025' | '2024';
  selectedScope: 'corporate' | 'hq' | 'store';
  dashboardData?: any;
  divisionFilter?: string;
  departmentFilter?: string;
  storeTypeFilter?: string;
  regionalFilter?: string;
}

export const Phase1VisualCharts: React.FC<Phase1VisualChartsProps> = ({
  dashboardData,
  divisionFilter,
  departmentFilter,
  storeTypeFilter,
  regionalFilter,
}) => {
  const apiDemo = dashboardData?.summary?.demographics;
  const apiProd = dashboardData?.summary?.productivity;
  const apiSp = dashboardData?.industrialAndSp;

  const dynamicStoreHeadcount = apiDemo?.storeHeadcount || 0;
  const dynamicHqHeadcount = apiDemo?.hqHeadcount || 0;
  const totalHeadcount = apiDemo?.totalHeadcount || 0;

  const headcountCategories = ['2024', '2025', '2026 (Optimasi)'];
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

  const genderLaki = apiDemo?.distribution?.byGender?.['LAKI_LAKI'] || apiDemo?.distribution?.byGender?.['Laki-laki'] || 0;
  const genderPerempuan = apiDemo?.distribution?.byGender?.['PEREMPUAN'] || apiDemo?.distribution?.byGender?.['Perempuan'] || 0;
  const genderSeries = [genderLaki, genderPerempuan];
  const genderTotal = genderLaki + genderPerempuan;
  const genderLakiPct = genderTotal > 0 ? Math.round((genderLaki / genderTotal) * 100) : 0;
  const genderPerempuanPct = genderTotal > 0 ? Math.round((genderPerempuan / genderTotal) * 100) : 0;

  const totalSpCount = apiSp?.totalSpIssued || 0;
  const storeSpCount = apiSp?.storeSp?.total || 0;
  const hqSpCount = apiSp?.hqSp?.total || 0;
  const ttCount = (apiSp?.storeSp?.tataTertib || 0) + (apiSp?.hqSp?.tataTertib || 0);
  const nonTtCount = (apiSp?.storeSp?.nonTataTertib || 0) + (apiSp?.hqSp?.nonTataTertib || 0);
  const disputesSelesai = apiSp?.disputes?.corporate?.selesai || 0;
  const disputesBipartit = apiSp?.disputes?.corporate?.bipartit || 0;
  const disputesMediasi = apiSp?.disputes?.corporate?.mediasi || 0;
  const disputesTotal = apiSp?.disputes?.corporate?.total || 0;

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

  const hqAtt = dashboardData?.summary?.attendanceByScope?.hq;
  const storeAtt = dashboardData?.summary?.attendanceByScope?.store;
  const hqRateNum = hqAtt?.attendanceRate ? Number((parseFloat(hqAtt.attendanceRate) * 100).toFixed(1)) : 0;
  const storeRateNum = storeAtt?.attendanceRate ? Number((parseFloat(storeAtt.attendanceRate) * 100).toFixed(1)) : 0;
  const avgAttendanceHq = `${hqRateNum}%`;
  const avgAttendanceStore = `${storeRateNum}%`;

  const attendanceMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'];
  const attendanceHq = [80.6, 82.6, 87.4, 74.2, 79.0, 83.4, hqRateNum || 75.4, 91.5];
  const attendanceStore = [71.3, 66.2, 71.8, 66.5, 73.2, 73.9, storeRateNum || 76.3, 0];

  const attendanceChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      height: 270,
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
      size: 4,
      colors: ['#0F172A', '#C8102E'],
      strokeWidth: 2
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => (val != null ? `${val.toFixed(1)}%` : '')
      }
    }
  };

  const attendanceSeries = [
    { name: `% Kehadiran HQ (${avgAttendanceHq})`, data: attendanceHq },
    { name: `% Kehadiran Store (${avgAttendanceStore})`, data: attendanceStore }
  ];

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

  const ageCategories = ['< 21 Thn', '21 – 25 Thn', '26 – 30 Thn', '31 – 40 Thn', '> 40 Thn'];
  const ageCounts = [
    apiDemo?.distribution?.byAgeBracket?.under21 || 0,
    apiDemo?.distribution?.byAgeBracket?.age21To25 || 0,
    apiDemo?.distribution?.byAgeBracket?.age26To30 || 0,
    apiDemo?.distribution?.byAgeBracket?.age31To40 || 0,
    apiDemo?.distribution?.byAgeBracket?.over40 ?? apiDemo?.distribution?.byAgeBracket?.above40 ?? 0
  ];
  const agePercentages = ageCounts.map((cnt) =>
    totalHeadcount > 0 ? Number(((cnt / totalHeadcount) * 100).toFixed(1)) : 0
  );

  const tenureLabels = ['< 1 Tahun', '1 – 3 Tahun', '3 – 5 Tahun', '> 5 Tahun'];
  const tenureColors = ['#38BDF8', '#0F172A', '#F59E0B', '#16A34A'];
  const tenureCounts = [
    apiDemo?.distribution?.byTenureBracket?.under1Year || 0,
    apiDemo?.distribution?.byTenureBracket?.tenure1To3Years ?? apiDemo?.distribution?.byTenureBracket?.year1To3 ?? 0,
    apiDemo?.distribution?.byTenureBracket?.tenure3To5Years ?? apiDemo?.distribution?.byTenureBracket?.year3To5 ?? 0,
    apiDemo?.distribution?.byTenureBracket?.over5Years ?? apiDemo?.distribution?.byTenureBracket?.above5Years ?? 0
  ];

  const turnoverKpi = dashboardData?.turnoverAndRetention?.overview?.kpi;
  const turnoverRateDisplay = turnoverKpi?.annualTurnoverRate || dashboardData?.summary?.retention?.turnoverRate || '0.00%';
  const voluntaryPct = turnoverKpi?.voluntaryPercentage || '0.0%';
  const nonVoluntaryPct = turnoverKpi?.voluntaryPercentage
    ? `${(100 - parseFloat(turnoverKpi.voluntaryPercentage)).toFixed(1)}%`
    : '0.0%';

  const invReasons = dashboardData?.turnoverAndRetention?.deepDive?.involuntaryClassification || [];
  const volReasons = dashboardData?.turnoverAndRetention?.deepDive?.voluntaryTopReasons || [];
  const totalTurnoverCount = turnoverKpi?.totalYtd || 1;
  const turnoverColors = ['#C8102E', '#F59E0B', '#3B82F6', '#8B5CF6', '#64748B'];
  const turnoverReasons = [...volReasons, ...invReasons].slice(0, 5).map((item: any, idx: number) => ({
    reason: item.name,
    count: item.count,
    pct: totalTurnoverCount > 0 ? Number(((item.count / totalTurnoverCount) * 100).toFixed(1)) : 0,
    color: turnoverColors[idx % turnoverColors.length]
  }));

  const hqSickDisplay = hqAtt && hqAtt.totalEmployees > 0
    ? `${((hqAtt.sickCount / hqAtt.totalEmployees) * 100).toFixed(1)}%`
    : '0%';
  const hqLeaveDisplay = hqAtt && hqAtt.totalEmployees > 0
    ? `${((hqAtt.annualLeaveCount / hqAtt.totalEmployees) * 100).toFixed(1)}%`
    : '0%';
  const hqAlphaDisplay = hqAtt && hqAtt.totalEmployees > 0
    ? `${((hqAtt.absentCount / hqAtt.totalEmployees) * 100).toFixed(1)}%`
    : '0%';
  const storeAlphaDisplay = storeAtt && storeAtt.totalEmployees > 0
    ? `${((storeAtt.absentCount / storeAtt.totalEmployees) * 100).toFixed(1)}%`
    : '0%';

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

  const recruitmentFulfilled = dashboardData?.recruitment?.fulfilled || 0;
  const recruitmentTarget = dashboardData?.recruitment?.target || 0;
  const recruitmentPct = recruitmentTarget > 0 ? ((recruitmentFulfilled / recruitmentTarget) * 100).toFixed(1) : '0';

  const kpiCompleted = dashboardData?.kpi?.completed || 0;
  const kpiTotal = dashboardData?.kpi?.total || 0;
  const kpiPct = kpiTotal > 0 ? ((kpiCompleted / kpiTotal) * 100).toFixed(1) : '0';

  const avgTimeToHire = dashboardData?.recruitment?.avgTimeToHire ? `${dashboardData.recruitment.avgTimeToHire} Hari` : '0 Hari';
  const costPerHire = dashboardData?.recruitment?.costPerHire ? `Rp ${(dashboardData.recruitment.costPerHire / 1000000).toFixed(2)}M` : 'Rp 0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
              Visual Analytics Suite
            </h2>
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
            <span>Aktual 2026</span>
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
                HQ vs Store Network
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
              <span className="text-xs text-blue-700 uppercase font-bold block mb-0.5">2026 Optimasi</span>
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                Komposisi Gender
              </h3>
              <PieIcon className="w-4 h-4 text-slate-400" />
            </div>

            <div className="py-2 flex justify-center">
              <Chart options={genderDonutOptions} series={genderSeries} type="donut" width="100%" height={190} />
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                Distribusi Usia
              </h3>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {apiDemo?.avgAge ? `Rata-rata ${apiDemo.avgAge}th` : 'Rata-rata 0th'}
              </span>
            </div>

            <div className="space-y-2.5 pt-3">
              {ageCategories.map((cat, idx) => {
                const count = ageCounts[idx];
                const pct = agePercentages[idx];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-800 font-medium">{cat}</span>
                      <span className="font-mono text-slate-700 tabular-nums">
                        {count} <span className="text-slate-500 text-xs">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${idx === 1 ? 'bg-[#C8102E]' : 'bg-slate-800'}`}
                        style={{ width: `${Math.min(pct * 1.8, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            {((agePercentages[0] || 0) + (agePercentages[1] || 0)).toFixed(1)}% karyawan tergolong kelompok usia muda produktif.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                Komposisi Masa Kerja
              </h3>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {apiDemo?.avgTenure ? `Rata-rata ${apiDemo.avgTenure}th` : 'Rata-rata 0th'}
              </span>
            </div>

            <div className="space-y-2.5 pt-3">
              {tenureLabels.map((lbl, idx) => {
                const count = tenureCounts[idx];
                const pct = totalHeadcount > 0 ? Number(((count / totalHeadcount) * 100).toFixed(1)) : 0;
                const color = tenureColors[idx];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-800 font-medium">{lbl}</span>
                      <span className="font-mono text-slate-700 tabular-nums">
                        {count} <span className="text-slate-500 text-xs">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            {totalHeadcount > 0 ? (((tenureCounts[2] + tenureCounts[3]) / totalHeadcount) * 100).toFixed(1) : '0'}% telah mengabdi &gt; 3 tahun.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                Piramida Jabatan
              </h3>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <div className="pt-2">
              <Chart options={levelFunnelOptions} series={levelSeries} type="bar" height={240} />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-600 flex items-center justify-between">
            <span>Struktur Organisasi</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {apiDemo?.leaderStaffRatio || '1:0'} Rasio Leader
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
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                Target &lt; 3%
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              </span>
            </div>

            <div className="my-3.5 p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Turnover Bulanan Aktual</span>
                <span className="text-2xl font-black font-mono text-emerald-600 tabular-nums">{turnoverRateDisplay}</span>
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
            <span className="font-mono font-bold text-emerald-600 text-sm">Terkendali</span>
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
                Tahun 2026
              </span>
            </div>

            <div className="pt-3">
              <Chart options={attendanceChartOptions} series={attendanceSeries} type="line" height={270} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5 pt-3.5 mt-2 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">% Sakit HQ</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">{hqSickDisplay}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">% Cuti HQ</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">{hqLeaveDisplay}</span>
            </div>
            <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-700 uppercase font-bold block mb-0.5">% Alpa HQ</span>
              <span className="text-base font-bold font-mono text-emerald-700 tabular-nums flex items-center justify-center gap-1">
                {hqAlphaDisplay}
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">% Alpa Store</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">{storeAlphaDisplay}</span>
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
                  Produktivitas Penjualan & Rasio Payroll vs Sales (2026)
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
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--biensi-red)] block mb-1">
                  Kategori SP
                </span>
                <div className="text-base font-mono font-bold text-slate-900">
                  {ttCount} Tata Tertib • {nonTtCount} Non-TT
                </div>
                <span className="text-xs text-slate-500 mt-1 block font-medium">Store: {storeSpCount} | HQ: {hqSpCount}</span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Status Sengketa ({disputesTotal})
                </span>
                <div className="text-base font-mono font-bold text-slate-900">
                  {disputesSelesai} Selesai • {disputesBipartit} Bipartit
                </div>
                <span className="text-xs text-slate-500 mt-1 block font-medium">{disputesMediasi} Mediasi Disnaker</span>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-700 font-medium">Fulfillment Rekrutmen 2026:</span>
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
                  <span className="text-slate-700 font-medium">KPI Dashboard Completion 2026:</span>
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
            <span>Avg Time to Hire: <strong className="text-slate-800 font-mono">{avgTimeToHire}</strong> (&lt; 21 Hari)</span>
            <span>Cost/Hire: <strong className="text-slate-800 font-mono">{costPerHire}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
