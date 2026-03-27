import React, { useState } from 'react';
import { Target, Users, TrendingUp, Loader2, RefreshCw, Award, AlertCircle, BarChart3, Zap } from 'lucide-react';
import { MarketAnalysis } from '../types';
import { MOCK_REPS } from '../constants';
import { cn } from '../lib/utils';
import ExportDataPanel from './ExportDataPanel';

interface RepsPerformanceViewProps {
  t: any;
  analysis: MarketAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

const RepsPerformanceView = ({ t, analysis, loading, onRefresh }: RepsPerformanceViewProps) => {
  const [filteredReps, setFilteredReps] = useState([...MOCK_REPS]);
  const sortedReps = [...filteredReps].sort((a, b) => b.targetAchievement - a.targetAchievement);
  const topRep = sortedReps[0] || { name: 'N/A', targetAchievement: 0 };
  const lowRep = sortedReps[sortedReps.length - 1] || { name: 'N/A', targetAchievement: 0 };
  
  const avgCoverage = filteredReps.length > 0 
    ? Math.round(filteredReps.reduce((acc, rep) => acc + rep.targetAchievement, 0) / filteredReps.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">Representative Performance Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time tracking of field force efficiency and impact</p>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {loading ? "Analyzing..." : "Analyze Performance"}
        </button>
      </div>

      <ExportDataPanel 
        data={MOCK_REPS}
        filename="reps_performance_report"
        title="PharmaVision Representative Performance Report"
        onFilter={setFilteredReps}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform">
            <Award size={80} />
          </div>
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <Award size={14} className="text-emerald-500" />
            Top Representative
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 font-bold shadow-inner">
              {topRep.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-bold dark:text-white">{topRep.name}</p>
              <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                {topRep.targetAchievement}% Target Achievement
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-rose-600 group-hover:scale-110 transition-transform">
            <AlertCircle size={80} />
          </div>
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-rose-500" />
            Low Performance
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-600 font-bold shadow-inner">
              {lowRep.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-bold dark:text-white">{lowRep.name}</p>
              <p className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                {lowRep.targetAchievement}% Target Achievement
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-blue-600 group-hover:scale-110 transition-transform">
            <BarChart3 size={80} />
          </div>
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-blue-500" />
            Avg. Coverage %
          </h4>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgCoverage}%</p>
            <p className="text-xs text-emerald-600 font-bold mb-1">+4.2%</p>
          </div>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
              style={{ width: `${avgCoverage}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-xl dark:text-white">AI-Driven Improvement Strategies</h3>
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 size={48} className="text-blue-600 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gemini is evaluating field force data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(analysis?.recommendations.slice(0, 4) || []).map((rec, i) => (
              <div key={i} className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-start gap-5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group">
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  i % 2 === 0 ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                )}>
                  {i % 2 === 0 ? <Target size={20} /> : <Users size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm dark:text-white group-hover:text-blue-600 transition-colors">
                    {rec.split(':')[0]}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {rec.includes(':') ? rec.split(':')[1] : rec}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Zap size={12} className="text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Impact Strategy</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h3 className="font-bold text-2xl mb-8 tracking-tight">Sales Impact Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Conversion Rate Impact</span>
                <span className="text-sm font-bold text-emerald-400">+12.5%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Top performers like {topRep.name} are driving a 12.5% higher conversion rate in key accounts, contributing to an estimated $45k in additional monthly revenue.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Coverage vs. Revenue Correlation</span>
                <span className="text-sm font-bold text-blue-400">High (0.88)</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }} />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                There is a strong correlation between pharmacy coverage and revenue growth. Increasing coverage in Alexandria by 15% is predicted to yield a 10% sales lift.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepsPerformanceView;
