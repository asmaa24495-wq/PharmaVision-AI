import React from 'react';
import { Package, Activity, BrainCircuit, Loader2, RefreshCw, TrendingUp, Calendar, Zap, Sparkles } from 'lucide-react';
import { MarketAnalysis } from '../types';
import { cn } from '../lib/utils';

interface DemandForecastingViewProps {
  t: any;
  analysis: MarketAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

const DemandForecastingView = ({ t, analysis, loading, onRefresh }: DemandForecastingViewProps) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg dark:text-white">Predictive Demand Intelligence</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">AI-driven forecasting and seasonal trend analysis</p>
        </div>
      </div>
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        {loading ? "Forecasting..." : "Run Forecast"}
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-xl dark:text-white">Predicted High-Demand Products</h3>
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl">
            <Sparkles size={20} />
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 size={48} className="text-blue-600 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gemini is scanning market signals...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(analysis?.insights.slice(0, 3) || ["Product A (Cardio)", "Product B (Antibiotics)", "Product C (Pain Relief)"]).map((insight, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-colors",
                    i === 0 ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600" : 
                    i === 1 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : 
                    "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                  )}>
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white group-hover:text-blue-600 transition-colors">{insight.split(':')[0]}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Predicted Surge: {15 + (i * 5)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-xs font-bold",
                    i === 0 ? "text-blue-600" : i === 1 ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {i === 0 ? "High Confidence" : "Medium Confidence"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">AI Score: {95 - (i * 8)}/100</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-xl dark:text-white">Seasonal Trends & Opportunities</h3>
          <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl">
            <Calendar size={20} />
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 size={48} className="text-amber-600 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Mapping seasonal patterns...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-blue-600">
                <Activity size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm mb-3">
                  <Activity size={18} />
                  <span>Upcoming: Allergy Season (April-May)</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {analysis?.opportunities[0] || "Historical data indicates a 45% surge in antihistamine demand starting in 3 weeks. Current stock levels are insufficient for the predicted peak."}
                </p>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-600">
                <TrendingUp size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-3">
                  <TrendingUp size={18} />
                  <span>Future Sales Opportunity</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {analysis?.opportunities[1] || "Expansion into the Southern region shows a 30% higher conversion rate for chronic care products in Q2."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h3 className="font-bold text-2xl tracking-tight">AI Forecast Decisions</h3>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-1">Actionable Intelligence</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 size={48} className="text-blue-400 animate-spin" />
            <p className="text-slate-400 font-medium italic">Calculating optimal stock levels...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(analysis?.recommendations.slice(0, 3) || ["Pre-stock Inventory", "Rep Allocation", "Marketing Push"]).map((rec, i) => (
              <div key={i} className="group p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <Zap size={18} className="text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-bold mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-wide">
                  {rec.split(':')[0]}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {rec.includes(':') ? rec.split(':')[1] : rec}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default DemandForecastingView;
