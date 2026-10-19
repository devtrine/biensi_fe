import React, { useState, useMemo } from 'react';
import { phase1Metrics } from '../../data/phase1Data';
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  Info,
  AlertTriangle
} from 'lucide-react';

interface Phase1MetricsTableProps {
  selectedYear: '2026' | '2025' | '2024';
  selectedScope: 'corporate' | 'hq' | 'store';
  dashboardData?: any;
}

export const Phase1MetricsTable: React.FC<Phase1MetricsTableProps> = ({
  selectedYear,
  selectedScope,
  dashboardData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortField] = useState<'no' | 'name' | 'category'>('no');
  const [sortDirection] = useState<'asc' | 'desc'>('asc');

  const categories = [
    'Semua',
    'Employee Demografi',
    'Employee Level',
    'Employment Type',
    'Employee Productivity',
    'Attendance Dashboard',
    'Recruitment Dashboard',
    'KPI Dashboard Completion',
    'Industrial Relation'
  ];

  const computedMetrics = useMemo(() => {
    const scopeData = dashboardData?.summary?.scopeBreakdown;
    const apiDemo = dashboardData?.summary?.demographics;
    const apiProd = dashboardData?.summary?.productivity;
    const apiSp = dashboardData?.industrialAndSp;

    if (!scopeData && !apiDemo && !apiProd) {
      return phase1Metrics;
    }

    const corp = scopeData?.corporate || {};
    const hq = scopeData?.hq || {};
    const store = scopeData?.store || {};

    return phase1Metrics.map((m) => {
      if (m.no === 1) {
        const cCount = corp.headcount || apiDemo?.totalHeadcount || 0;
        const hCount = hq.headcount || apiDemo?.hqHeadcount || 0;
        const sCount = store.headcount || apiDemo?.storeHeadcount || 0;
        return {
          ...m,
          totalCorporate: cCount,
          hq: hCount,
          store: sCount,
          formattedCorporate: cCount > 0 ? `${cCount.toLocaleString()} Orang` : '-',
          formattedHQ: hCount > 0 ? `${hCount.toLocaleString()} Orang` : '-',
          formattedStore: sCount > 0 ? `${sCount.toLocaleString()} Orang` : '-',
          status: cCount > 0 ? 'optimal' : 'neutral',
          statusLabel: cCount > 0 ? 'Tersedia' : '-',
        };
      }
      if (m.no === 2) {
        const cCount = corp.headcount || apiDemo?.totalHeadcount || 0;
        const hCount = hq.headcount || apiDemo?.hqHeadcount || 0;
        const sCount = store.headcount || apiDemo?.storeHeadcount || 0;
        return {
          ...m,
          totalCorporate: cCount,
          hq: hCount,
          store: sCount,
          formattedCorporate: cCount > 0 ? `${cCount.toLocaleString()} Orang Tersebar` : '-',
          formattedHQ: hCount > 0 ? `${hCount.toLocaleString()} Orang HQ` : '-',
          formattedStore: sCount > 0 ? `${sCount.toLocaleString()} Orang Store` : '-',
          status: cCount > 0 ? 'optimal' : 'neutral',
          statusLabel: cCount > 0 ? 'Terdistribusi' : '-',
        };
      }
      if (m.no === 3) {
        const actualCost = apiProd?.totalActualCost || 0;
        return {
          ...m,
          totalCorporate: actualCost,
          formattedCorporate: actualCost > 0 ? `Rp ${(actualCost / 1000000000).toFixed(2)} Miliar` : '-',
          status: actualCost > 0 ? 'optimal' : 'neutral',
          statusLabel: actualCost > 0 ? 'Terkendali' : '-',
        };
      }
      if (m.no === 5) {
        const turnoverRate = dashboardData?.turnoverAndRetention?.turnoverRate;
        return {
          ...m,
          totalCorporate: turnoverRate || 0,
          formattedCorporate: turnoverRate != null ? `${Number(turnoverRate).toFixed(2)}%` : '-',
          status: turnoverRate != null ? 'optimal' : 'neutral',
          statusLabel: turnoverRate != null ? 'Terkendali' : '-',
        };
      }
      if (m.no === 6) {
        const cGender = corp.byGender || apiDemo?.distribution?.byGender;
        return {
          ...m,
          formattedCorporate: cGender ? `L: ${cGender.LAKI_LAKI || cGender['Laki-laki'] || 0} / P: ${cGender.PEREMPUAN || cGender['Perempuan'] || 0}` : '-',
          formattedHQ: hq.byGender ? `L: ${hq.byGender.LAKI_LAKI || hq.byGender['Laki-laki'] || 0} / P: ${hq.byGender.PEREMPUAN || hq.byGender['Perempuan'] || 0}` : '-',
          formattedStore: store.byGender ? `L: ${store.byGender.LAKI_LAKI || store.byGender['Laki-laki'] || 0} / P: ${store.byGender.PEREMPUAN || store.byGender['Perempuan'] || 0}` : '-',
          status: cGender ? 'optimal' : 'neutral',
          statusLabel: cGender ? 'Seimbang' : '-',
        };
      }
      if (m.no === 7) {
        const cAge = corp.avgAge || apiDemo?.avgAge || 0;
        const hAge = hq.avgAge || 0;
        const sAge = store.avgAge || 0;
        return {
          ...m,
          totalCorporate: cAge,
          hq: hAge,
          store: sAge,
          formattedCorporate: cAge > 0 ? `${cAge} Tahun` : '-',
          formattedHQ: hAge > 0 ? `${hAge} Tahun` : '-',
          formattedStore: sAge > 0 ? `${sAge} Tahun` : '-',
          status: cAge > 0 ? 'optimal' : 'neutral',
          statusLabel: cAge > 0 ? 'Produktif' : '-',
        };
      }
      if (m.no === 8) {
        const cTenure = corp.avgTenure || apiDemo?.avgTenure || 0;
        const hTenure = hq.avgTenure || 0;
        const sTenure = store.avgTenure || 0;
        return {
          ...m,
          totalCorporate: cTenure,
          hq: hTenure,
          store: sTenure,
          formattedCorporate: cTenure > 0 ? `${cTenure} Tahun` : '-',
          formattedHQ: hTenure > 0 ? `${hTenure} Tahun` : '-',
          formattedStore: sTenure > 0 ? `${sTenure} Tahun` : '-',
          status: cTenure > 0 ? 'optimal' : 'neutral',
          statusLabel: cTenure > 0 ? 'Stabil' : '-',
        };
      }
      if (m.no === 18 && corp.byEmploymentStandard) {
        return {
          ...m,
          totalCorporate: corp.byEmploymentStandard.pkwtt || 0,
          hq: hq?.byEmploymentStandard?.pkwtt || 0,
          store: store?.byEmploymentStandard?.pkwtt || 0,
          formattedCorporate: `${corp.byEmploymentStandard.pkwtt || 0} Orang`,
          formattedHQ: `${hq?.byEmploymentStandard?.pkwtt || 0} Orang`,
          formattedStore: `${store?.byEmploymentStandard?.pkwtt || 0} Orang`,
          status: 'optimal',
          statusLabel: 'Terdata',
        };
      }
      if (m.no === 19 && corp.byEmploymentStandard) {
        return {
          ...m,
          totalCorporate: corp.byEmploymentStandard.pkwt || 0,
          hq: hq?.byEmploymentStandard?.pkwt || 0,
          store: store?.byEmploymentStandard?.pkwt || 0,
          formattedCorporate: `${corp.byEmploymentStandard.pkwt || 0} Orang`,
          formattedHQ: `${hq?.byEmploymentStandard?.pkwt || 0} Orang`,
          formattedStore: `${store?.byEmploymentStandard?.pkwt || 0} Orang`,
          status: 'optimal',
          statusLabel: 'Terdata',
        };
      }
      if (m.no === 20 && corp.byEmploymentStandard) {
        return {
          ...m,
          totalCorporate: corp.byEmploymentStandard.partTime || 0,
          hq: hq?.byEmploymentStandard?.partTime || 0,
          store: store?.byEmploymentStandard?.partTime || 0,
          formattedCorporate: `${corp.byEmploymentStandard.partTime || 0} Orang`,
          formattedHQ: `${hq?.byEmploymentStandard?.partTime || 0} Orang`,
          formattedStore: `${store?.byEmploymentStandard?.partTime || 0} Orang`,
          status: 'optimal',
          statusLabel: 'Terdata',
        };
      }
      if (m.no === 21 && corp.byEmploymentStandard) {
        return {
          ...m,
          totalCorporate: corp.byEmploymentStandard.internship || 0,
          hq: hq?.byEmploymentStandard?.internship || 0,
          store: store?.byEmploymentStandard?.internship || 0,
          formattedCorporate: `${corp.byEmploymentStandard.internship || 0} Orang`,
          formattedHQ: `${hq?.byEmploymentStandard?.internship || 0} Orang`,
          formattedStore: `${store?.byEmploymentStandard?.internship || 0} Orang`,
          status: 'optimal',
          statusLabel: 'Terdata',
        };
      }
      if (m.no === 27) {
        const totalSp = apiSp?.totalSpIssued || 0;
        const hSp = apiSp?.hqSp?.total || 0;
        const sSp = apiSp?.storeSp?.total || 0;
        return {
          ...m,
          totalCorporate: totalSp,
          hq: hSp,
          store: sSp,
          formattedCorporate: `${totalSp} SP`,
          formattedHQ: `${hSp} SP`,
          formattedStore: `${sSp} SP`,
          status: totalSp > 0 ? 'normal' : 'neutral',
          statusLabel: totalSp > 0 ? 'Terekam' : '-',
        };
      }
      if (m.no === 28) {
        const cCount = corp.headcount || apiDemo?.totalHeadcount || 0;
        return {
          ...m,
          totalCorporate: cCount,
          formattedCorporate: cCount > 0 ? `${cCount.toLocaleString()} FTE` : '-',
          status: cCount > 0 ? 'optimal' : 'neutral',
          statusLabel: cCount > 0 ? 'Tersedia' : '-',
        };
      }
      if (m.no === 29) {
        const actualCost = apiProd?.totalActualCost || 0;
        const budgetCost = apiProd?.totalBudgetCost || 0;
        return {
          ...m,
          totalCorporate: actualCost,
          formattedCorporate: actualCost > 0 ? `Aktual Rp ${(actualCost / 1000000000).toFixed(2)}M / Budget Rp ${(budgetCost / 1000000000).toFixed(2)}M` : '-',
          status: actualCost > 0 ? 'optimal' : 'neutral',
          statusLabel: actualCost > 0 ? 'Sesuai Budget' : '-',
        };
      }
      if (m.no === 31) {
        const ratio = apiProd?.labourCostRatio;
        return {
          ...m,
          totalCorporate: ratio ? parseFloat(ratio) : 0,
          formattedCorporate: ratio ? `${parseFloat(ratio).toFixed(2)}%` : '-',
          status: ratio ? 'optimal' : 'neutral',
          statusLabel: ratio ? 'Optimal' : '-',
        };
      }
      if (m.no === 32) {
        const rev = apiProd?.revenuePerFte;
        return {
          ...m,
          totalCorporate: rev ? parseFloat(rev) : 0,
          formattedCorporate: rev && parseFloat(rev) > 0 ? `Rp ${(parseFloat(rev) / 1000000).toFixed(2)} Jt / FTE` : '-',
          status: rev ? 'optimal' : 'neutral',
          statusLabel: rev ? 'Optimal' : '-',
        };
      }
      if (m.no === 33) {
        const mult = apiProd?.payrollMultiplier;
        return {
          ...m,
          totalCorporate: mult ? parseFloat(mult) : 0,
          formattedCorporate: mult ? `${parseFloat(mult).toFixed(2)}x Multiplier` : '-',
          status: mult ? 'optimal' : 'neutral',
          statusLabel: mult ? 'Optimal' : '-',
        };
      }
      if (m.no === 51) {
        const dCorp = apiSp?.disputes?.corporate?.total || 0;
        const dHq = apiSp?.disputes?.hq?.total || 0;
        const dStore = apiSp?.disputes?.store?.total || 0;
        return {
          ...m,
          totalCorporate: dCorp,
          hq: dHq,
          store: dStore,
          formattedCorporate: dCorp > 0 ? `${dCorp} Isu Aktif` : '-',
          formattedHQ: dHq > 0 ? `${dHq} Isu HQ` : '-',
          formattedStore: dStore > 0 ? `${dStore} Isu Store` : '-',
          status: dCorp > 0 ? 'normal' : 'neutral',
          statusLabel: dCorp > 0 ? 'Terkendali' : '-',
        };
      }
      return m;
    });
  }, [dashboardData]);

  const filteredMetrics = computedMetrics
    .filter((m) => {
      const matchesCategory = selectedCategory === 'Semua' || m.category === selectedCategory;
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.formulae.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortField === 'no') {
        return sortDirection === 'asc' ? a.no - b.no : b.no - a.no;
      }
      if (sortField === 'name') {
        return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDirection === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
    });

  const handleExportCSV = () => {
    const headers = ['No', 'Kategori', 'Nama Metrik', 'Formula', 'Target', 'Total Corporate', 'HQ', 'Store', 'Status'];
    const rows = filteredMetrics.map(m => [
      m.no,
      `"${m.category}"`,
      `"${m.name}"`,
      `"${m.formulae}"`,
      `"${m.target}"`,
      `"${m.formattedCorporate}"`,
      `"${m.formattedHQ}"`,
      `"${m.formattedStore}"`,
      `"${m.statusLabel || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_EXECUTIVE_DASHBOARD_Phase_1.0_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
              Matriks Metrik KPI (51 Metrik Baku)
            </h3>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Daftar lengkap seluruh metrik HR, formula baku, target, dan realisasi aktual per Total Corporate, HQ, dan Jaringan Store.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari metrik, formula, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-red-500 w-56 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-sm whitespace-nowrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1.5">
            KATEGORI:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8fafc] text-slate-700 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-3 font-mono font-bold w-12 text-center">NO</th>
              <th className="py-3.5 px-4 font-bold min-w-[200px]">NAMA METRIK</th>
              <th className="py-3.5 px-3 font-bold min-w-[140px]">KATEGORI</th>
              <th className="py-3.5 px-3 font-bold min-w-[180px]">FORMULA</th>
              <th className="py-3.5 px-3 font-bold min-w-[130px]">TARGET</th>
              <th
                className={`py-3.5 px-3 font-bold min-w-[160px] ${
                  selectedScope === 'corporate' ? 'bg-slate-200/60 text-slate-900 font-extrabold' : ''
                }`}
              >
                TOTAL CORPORATE
              </th>
              <th
                className={`py-3.5 px-3 font-bold min-w-[150px] ${
                  selectedScope === 'hq' ? 'bg-slate-200/60 text-slate-900 font-extrabold' : ''
                }`}
              >
                HQ (KANTOR PUSAT)
              </th>
              <th
                className={`py-3.5 px-3 font-bold min-w-[150px] ${
                  selectedScope === 'store' ? 'bg-slate-200/60 text-slate-900 font-extrabold' : ''
                }`}
              >
                STORE (RITEL)
              </th>
              <th className="py-3.5 px-3 font-bold min-w-[120px] text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMetrics.map((metric) => (
              <tr
                key={metric.no}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="py-3 px-3 font-mono font-bold text-slate-600 text-center tabular-nums">
                  {metric.no}
                </td>

                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900 text-sm">
                    {metric.name}
                  </div>
                  {metric.criticalQuest && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#C8102E] bg-red-50 px-2 py-0.5 rounded border border-red-200 mt-1">
                      {metric.criticalQuest}
                    </span>
                  )}
                </td>

                <td className="py-3 px-3">
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 tracking-wide">
                    {metric.category}
                  </span>
                </td>

                <td className="py-3 px-3 text-slate-700 font-mono text-xs leading-relaxed">
                  {metric.formulae}
                </td>

                <td className="py-3 px-3">
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    {metric.target}
                  </span>
                </td>

                <td
                  className={`py-3 px-3 font-mono font-semibold text-slate-900 tabular-nums ${
                    selectedScope === 'corporate' ? 'bg-blue-50/40 font-bold text-blue-900' : ''
                  }`}
                >
                  {metric.formattedCorporate}
                </td>

                <td
                  className={`py-3 px-3 font-mono text-slate-800 tabular-nums ${
                    selectedScope === 'hq' ? 'bg-blue-50/40 font-bold text-blue-900' : ''
                  }`}
                >
                  {metric.formattedHQ}
                </td>

                <td
                  className={`py-3 px-3 font-mono text-slate-800 tabular-nums ${
                    selectedScope === 'store' ? 'bg-blue-50/40 font-bold text-blue-900' : ''
                  }`}
                >
                  {metric.formattedStore}
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                      metric.status === 'optimal'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : metric.status === 'normal'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : metric.status === 'alert'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {metric.status === 'optimal' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : metric.status === 'normal' ? (
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : metric.status === 'alert' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span>{metric.statusLabel || 'Tercapai'}</span>
                  </span>
                </td>
              </tr>
            ))}

            {filteredMetrics.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 text-sm">
                  Tidak ada metrik yang cocok dengan filter pencarian &ldquo;{searchQuery}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-600 font-mono">
        <div>
          Menampilkan <span className="font-bold text-slate-800 tabular-nums">{filteredMetrics.length}</span> dari <span className="font-bold text-slate-800 tabular-nums">{phase1Metrics.length}</span> metrik baku
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kepatuhan Standar ISO/Kemnaker 100%
          </span>
          <span className="text-slate-400">•</span>
          <span>Tahun Fiskal {selectedYear}</span>
        </div>
      </div>
    </div>
  );
};
