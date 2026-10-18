import React from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { historicalYearData } from '../../data/phase1Data';

interface ExecutiveHeroMetricsProps {
  selectedYear: '2026' | '2025' | '2024';
  selectedScope: 'corporate' | 'hq' | 'store';
}

export const ExecutiveHeroMetrics: React.FC<ExecutiveHeroMetricsProps> = ({
  selectedYear,
  selectedScope,
}) => {
  const currentData = historicalYearData[selectedYear];

  const displayHeadcount =
    selectedScope === 'hq'
      ? currentData.hqHeadcount
      : selectedScope === 'store'
        ? currentData.storeHeadcount
        : currentData.totalHeadcount;

  const prevYearKey = selectedYear === '2026' ? '2025' : selectedYear === '2025' ? '2024' : null;
  const prevData = prevYearKey ? historicalYearData[prevYearKey] : null;

  const headcountDiffPct = prevData
    ? (((currentData.totalHeadcount - prevData.totalHeadcount) / prevData.totalHeadcount) * 100).toFixed(1)
    : '-';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#0f131f] text-white p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                TOTAL HEADCOUNT
              </span>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-800/80 text-slate-200 border border-slate-700/60 tracking-wider">
              {selectedYear}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
              {displayHeadcount.toLocaleString()}
            </span>
            <span className="text-sm text-slate-300 font-mono font-medium">Orang</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-xs">
            {Number(headcountDiffPct) <= 0 ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-mono font-semibold text-sm">
                <ArrowDownRight className="w-4 h-4" />
                {headcountDiffPct}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-amber-400 font-mono font-semibold text-sm">
                <ArrowUpRight className="w-4 h-4" />
                +{headcountDiffPct}%
              </span>
            )}
            <span className="text-slate-300 text-xs font-medium">vs tahun sebelumnya (As per Budget)</span>
          </div>
        </div>

        <div className="pt-3.5 mt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">HQ (KANTOR PUSAT)</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              {currentData.hqHeadcount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">(28.5%)</span>
            </span>
          </div>
          <div className="bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">STORE (JARINGAN RITEL)</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              {currentData.storeHeadcount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">(71.5%)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0f131f] text-white p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ALL PRODUCTIVITY - SALES
              </span>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 tracking-wider">
              Ratio: {currentData.labourCostRatio}%
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
              Rp 45.08
            </span>
            <span className="text-sm text-slate-300 font-mono font-medium">Jt / FTE / Bln</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 text-emerald-400 font-mono font-semibold text-sm">
              <ArrowUpRight className="w-4 h-4" />
              +8.4%
            </span>
            <span className="text-slate-300 text-xs font-medium">vs tahun sebelumnya • Payroll Mult: 12.8x</span>
          </div>
        </div>

        <div className="pt-3.5 mt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">% GAJI VS SALES</span>
            <span className="text-base font-bold font-mono text-emerald-400 tabular-nums flex items-center gap-1.5">
              {currentData.labourCostRatio}% <span className="text-xs text-slate-400 font-normal">(&lt; 10%)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 inline shrink-0" />
            </span>
          </div>
          <div className="bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">PEAK LEBARAN (MAR)</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              Rp 30.5M <span className="text-xs text-emerald-400 font-normal">(13.2%)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0f131f] text-white p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                PRODUCTIVITY - PRODUCTION
              </span>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-800/40 tracking-wider">
              Target 0.05
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
              Ratio 1 : 20
            </span>
            <span className="text-sm text-purple-300 font-mono font-medium">(0.05)</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5 text-emerald-400 font-mono font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Target Tercapai
            </span>
            <span className="text-slate-300 text-xs font-medium">vs tahun lalu: +4.2% Efisiensi CMT</span>
          </div>
        </div>

        <div className="pt-3.5 mt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">TENAGA KERJA CMT</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              48 FTE <span className="text-xs text-slate-400 font-normal">(QA & Aplikasi)</span>
            </span>
          </div>
          <div className="bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">ON-TIME OUTPUT</span>
            <span className="text-base font-bold font-mono text-purple-300 tabular-nums">
              95.2% <span className="text-xs text-slate-400 font-normal">Garment</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
