import React from 'react';
import Chart from 'react-apexcharts';
import { visualChartDatasets } from '../../data/phase1Data';
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
}

export const Phase1VisualCharts: React.FC<Phase1VisualChartsProps> = () => {
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
      categories: visualChartDatasets.headcountHistory.categories,
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
    { name: 'Store Network', data: visualChartDatasets.headcountHistory.store },
    { name: 'Head Office (HQ)', data: visualChartDatasets.headcountHistory.hq }
  ];

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
      categories: visualChartDatasets.labourCostBudgetActual.categories,
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
    { name: 'Budget Bulanan', data: visualChartDatasets.labourCostBudgetActual.budget },
    { name: 'Realisasi Aktual', data: visualChartDatasets.labourCostBudgetActual.actual }
  ];

  const genderDonutOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: "'Geist', sans-serif"
    },
    colors: visualChartDatasets.genderComposition.colors,
    labels: visualChartDatasets.genderComposition.labels,
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
              formatter: () => '1,271'
            }
          }
        }
      }
    },
    tooltip: { theme: 'dark' }
  };

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
        const item = visualChartDatasets.employeeLevels[idx] || visualChartDatasets.employeeLevels[0];
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
      categories: visualChartDatasets.employeeLevels.map((l) => l.level),
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
      data: visualChartDatasets.employeeLevels.map((l) => l.count)
    }
  ];

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
      categories: visualChartDatasets.attendanceTrend2026.months,
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    yaxis: {
      min: 60,
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
    { name: '% Kehadiran HQ (81.6% Avg)', data: visualChartDatasets.attendanceTrend2026.hqAttendance },
    { name: '% Kehadiran Store (75.2% Avg)', data: visualChartDatasets.attendanceTrend2026.storeAttendance }
  ];

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
      categories: visualChartDatasets.salesProductivityMonthly.months,
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
      data: visualChartDatasets.salesProductivityMonthly.salesMiliar
    },
    {
      name: '% Gaji vs Sales (Ratio)',
      type: 'line',
      data: visualChartDatasets.salesProductivityMonthly.payrollRatioPct
    }
  ];

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
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">1,550</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">2025 Konsolidasi</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">1,390</span>
            </div>
            <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
              <span className="text-xs text-blue-700 uppercase font-bold block mb-0.5">2026 Optimasi</span>
              <span className="text-base font-bold font-mono text-blue-900 tabular-nums">1,271</span>
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
                -1.6% Variance
              </span>
            </div>

            <div className="pt-3">
              <Chart options={labourCostChartOptions} series={labourCostSeries} type="bar" height={280} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Total Run-rate Bulanan:</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              Rp 7.50 Miliar <span className="text-emerald-600 font-normal">(Hemat Rp 120Jt)</span>
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
              <Chart options={genderDonutOptions} series={visualChartDatasets.genderComposition.series} type="donut" width="100%" height={190} />
            </div>

            <div className="space-y-2 pt-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A]" /> Laki-laki
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  686 <span className="text-slate-500 font-normal text-xs">(54%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" /> Perempuan
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  585 <span className="text-slate-500 font-normal text-xs">(46%)</span>
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
              <span className="text-xs font-mono font-semibold text-slate-500">Rata-rata 24.2th</span>
            </div>

            <div className="space-y-2.5 pt-3">
              {visualChartDatasets.ageComposition.categories.map((cat, idx) => {
                const pct = visualChartDatasets.ageComposition.percentages[idx];
                const count = visualChartDatasets.ageComposition.counts[idx];
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
                        style={{ width: `${pct * 1.8}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            63.6% karyawan tergolong Gen-Z muda produktif.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-heading">
                Komposisi Masa Kerja
              </h3>
              <span className="text-xs font-mono font-semibold text-slate-500">Rata-rata 2.3th</span>
            </div>

            <div className="space-y-2.5 pt-3">
              {visualChartDatasets.tenureComposition.labels.map((lbl, idx) => {
                const count = visualChartDatasets.tenureComposition.series[idx];
                const pct = ((count / 1271) * 100).toFixed(1);
                const color = visualChartDatasets.tenureComposition.colors[idx];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-800 font-medium">{lbl}</span>
                      <span className="font-mono text-slate-700 tabular-nums">
                        {count} <span className="text-slate-500 text-xs">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            30.6% telah mengabdi &gt; 3 tahun (Core Staff & Leader).
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
            <span>Struktur Ramping</span>
            <span className="font-mono font-bold text-slate-900 text-sm">1:7.4 Rasio Leader</span>
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
                <span className="text-2xl font-black font-mono text-emerald-600 tabular-nums">0.77%</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Voluntary vs Nonvoluntary</span>
                <span className="text-sm font-mono font-bold text-slate-800">45.2% Sukarela • 54.8% Perusahaan</span>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-sm">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Kategori Alasan PHK / Resign (Data Aktual Excel)
              </span>
              {visualChartDatasets.turnoverReasons.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-800 font-medium text-sm">{item.reason}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                    {item.count} <span className="text-slate-500 font-normal text-xs">({item.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>Formula: Keluar / Avg Headcount × 100%</span>
            <span className="font-mono font-bold text-emerald-600 text-sm">Sangat Sehat</span>
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
                Jan – Agu 2026
              </span>
            </div>

            <div className="pt-3">
              <Chart options={attendanceChartOptions} series={attendanceSeries} type="line" height={270} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5 pt-3.5 mt-2 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">% Sakit HQ</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">13.9%</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">% Cuti HQ</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">35.4%</span>
            </div>
            <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-700 uppercase font-bold block mb-0.5">% Alpa HQ</span>
              <span className="text-base font-bold font-mono text-emerald-700 tabular-nums flex items-center justify-center gap-1">
                0.55%
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">% Alpa Store</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">8.4%</span>
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
                Peak Lebaran Rp 30.5M
              </span>
            </div>

            <div className="pt-3">
              <Chart options={salesProductivityOptions} series={salesProductivitySeries} type="line" height={270} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">Net Sales / FTE</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">Rp 45.08 Jt</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">Sales Multiplier</span>
              <span className="text-base font-bold font-mono text-emerald-600 tabular-nums">12.78x</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">Ratio Normal</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">7.82%</span>
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
                Total SP: 31
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 my-3.5">
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--biensi-red)] block mb-1">
                  Kategori SP
                </span>
                <div className="text-base font-mono font-bold text-slate-900">
                  25 Tata Tertib • 6 Non-TT
                </div>
                <span className="text-xs text-slate-500 mt-1 block font-medium">Store: 25 | HQ: 6</span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Status Sengketa (25)
                </span>
                <div className="text-base font-mono font-bold text-slate-900">
                  13 Selesai • 9 Bipartit
                </div>
                <span className="text-xs text-slate-500 mt-1 block font-medium">3 Mediasi Disnaker</span>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-700 font-medium">Fulfillment Rekrutmen 2026:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">3,180 / 3,450 (92.2%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--biensi-dark)]" style={{ width: '92.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 pt-0.5">
                  <span className="text-slate-700 font-medium">KPI Dashboard Completion 2026:</span>
                  <span className="font-mono font-bold text-[var(--biensi-red)] tabular-nums flex items-center gap-1.5">
                    81 / 84 Posisi (96.4%)
                    <CheckCircle2 className="w-4 h-4 text-[var(--biensi-red)] inline" />
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--biensi-red)]" style={{ width: '96.4%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avg Time to Hire: <strong className="text-slate-800 font-mono">14.2 Hari</strong> (&lt; 21 Hari)</span>
            <span>Cost/Hire: <strong className="text-slate-800 font-mono">Rp 1.25M</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
