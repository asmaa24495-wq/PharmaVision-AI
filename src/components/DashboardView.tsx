import React from 'react';
import { TrendingUp, Activity, Package, ShieldCheck, AlertTriangle, BrainCircuit, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import StatCard from './StatCard';
import { MarketAnalysis, Alert } from '../types';
import { cn } from '../lib/utils';

interface DashboardViewProps {
  analysis: MarketAnalysis | null;
  loading: boolean;
  t: any;
  alerts: Alert[];
}

const DashboardView = ({ analysis, loading, t, alerts }: DashboardViewProps) => (
  <div className="space-y-8">
    {/* KPI Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title={t('totalRevenue')} value="$4,250,000" change="+18.2%" trend="up" icon={TrendingUp} t={t} />
      <StatCard title={t('growth')} value="12.4%" change="+2.1%" trend="up" icon={Activity} t={t} />
      <StatCard title={t('topProduct')} value="Lipitor 20mg" change="+5.4%" trend="up" icon={Package} t={t} />
      <StatCard title={t('marketHealth')} value="92%" change="+1.2%" trend="up" icon={ShieldCheck} t={t} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-8">
        {/* Market Summary Card */}
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <CheckCircle2 size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">{t('marketSummary')}</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 dark:text-white">Strategic Overview</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
              "{analysis?.overview || "The pharmaceutical market is currently experiencing robust growth in the cardiovascular segment, driven by increased demand for statins. Supply chains remain stable, though minor bottlenecks are emerging in the antibiotic category due to raw material shortages."}"
            </p>
          </div>
        </div>

        {/* Insights & Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Insights */}
          <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl dark:text-white">{t('keyInsights')}</h3>
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl">
                <TrendingUp size={20} />
              </div>
            </div>
            <ul className="space-y-4">
              {(analysis?.insights.slice(0, 3) || ["Insight 1", "Insight 2", "Insight 3"]).map((insight, i) => (
                <li key={i} className="flex gap-4 group">
                  <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-150 transition-transform" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{insight}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl dark:text-white text-rose-600">{t('criticalAlerts')}</h3>
              <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl">
                <AlertTriangle size={20} />
              </div>
            </div>
            <ul className="space-y-4">
              {alerts.length > 0 ? (
                alerts.slice(0, 3).map((alert) => (
                  <li key={alert.id} className="flex gap-4 p-3 bg-rose-50/50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-500/10">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-rose-900 dark:text-rose-300">{alert.title}</p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 line-clamp-1">{alert.message}</p>
                    </div>
                  </li>
                ))
              ) : (
                (analysis?.issues.slice(0, 2) || ["Alert 1", "Alert 2"]).map((alert, i) => (
                  <li key={i} className="flex gap-4 p-3 bg-rose-50/50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-500/10">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-rose-900 dark:text-rose-300">{alert}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar / Quick Decisions */}
      <div className="lg:col-span-4">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white h-full border border-white/5 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                <BrainCircuit size={24} />
              </div>
              <h3 className="font-bold text-xl tracking-tight">AI Decision Engine</h3>
            </div>
            
            <div className="space-y-6">
              {analysis?.recommendations.slice(0, 3).map((rec, i) => (
                <div 
                  key={i} 
                  onClick={() => console.log(`Strategy ${i+1} selected`, rec)}
                  className="group p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Strategy {i+1}</p>
                    <ArrowUpRight size={14} className="text-white/30 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 group-hover:text-white transition-colors">{rec}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-2">Market Health</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">92%</span>
                <span className="text-xs text-blue-100 mb-1.5 font-medium">Optimal</span>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[92%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardView;
