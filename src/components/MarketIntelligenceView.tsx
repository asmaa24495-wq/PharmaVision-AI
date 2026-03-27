import React, { useState } from 'react';
import { MapPin, TrendingUp, AlertTriangle, Zap, BrainCircuit, Loader2, RefreshCw, Globe, Target } from 'lucide-react';
import { MarketAnalysis, RegionData } from '../types';
import { MOCK_REGIONS } from '../constants';
import { cn } from '../lib/utils';
import ExportDataPanel from './ExportDataPanel';

interface MarketIntelligenceViewProps {
  t: any;
  analysis: MarketAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

const MarketIntelligenceView = ({ t, analysis, loading, onRefresh }: MarketIntelligenceViewProps) => {
  const [filteredRegions, setFilteredRegions] = useState([...MOCK_REGIONS]);
  const sortedBySales = [...filteredRegions].sort((a, b) => b.sales - a.sales);
  const strongestMarket = sortedBySales[0] || { name: 'N/A', sales: 0, pharmacies: 0 };
  const weakestMarket = sortedBySales[sortedBySales.length - 1] || { name: 'N/A', sales: 0, pharmacies: 0 };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">Regional Intelligence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Analysis of regional performance and expansion potential</p>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {loading ? "Analyzing Regions..." : "Analyze Regions"}
        </button>
      </div>

      <ExportDataPanel 
        data={MOCK_REGIONS}
        filename="market_intelligence_report"
        title="PharmaVision Regional Market Intelligence"
        onFilter={setFilteredRegions}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-emerald-600">
            <TrendingUp size={100} />
          </div>
          <h4 className="text-xs font-bold text-emerald-600 uppercase mb-2 tracking-widest">Strongest Market</h4>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{strongestMarket.name}</p>
          <p className="text-sm text-emerald-600 mt-1 font-bold">${(strongestMarket.sales * 1000).toLocaleString()} Revenue</p>
          <p className="text-xs text-emerald-600/70 mt-1">{strongestMarket.pharmacies} Active Pharmacies</p>
        </div>

        <div className="p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-rose-600">
            <AlertTriangle size={100} />
          </div>
          <h4 className="text-xs font-bold text-rose-600 uppercase mb-2 tracking-widest">Weak Region</h4>
          <p className="text-2xl font-bold text-rose-900 dark:text-rose-300">{weakestMarket.name}</p>
          <p className="text-sm text-rose-600 mt-1 font-bold">Requires Recovery Plan</p>
          <p className="text-xs text-rose-600/70 mt-1">Growth below target</p>
        </div>

        <div className="p-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-amber-600">
            <Target size={100} />
          </div>
          <h4 className="text-xs font-bold text-amber-600 uppercase mb-2 tracking-widest">Growth Opportunity</h4>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">Giza South</p>
          <p className="text-sm text-amber-600 mt-1 font-bold">High Pharmacy Density</p>
          <p className="text-xs text-amber-600/70 mt-1">Untapped market potential</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-6">
            <Zap size={20} />
            <h3 className="font-bold text-xl dark:text-white">Expansion Recommendations</h3>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={48} className="text-blue-600 animate-spin" />
              <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gemini is mapping expansion routes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(analysis?.opportunities || ["Giza Market Penetration", "Alexandria Recovery Plan"]).map((opp, i) => (
                <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm dark:text-white group-hover:text-blue-600 transition-colors">{opp}</h4>
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg">
                      <Target size={14} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {analysis?.recommendations[i] || "Strategic expansion recommendation based on regional pharmacy density and competitor weakness."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                <BrainCircuit size={24} />
              </div>
              <h3 className="font-bold text-xl tracking-tight">Regional Insights</h3>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 size={32} className="text-blue-400 animate-spin" />
                <p className="text-slate-400 text-sm italic">Processing geospatial data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(analysis?.insights.slice(0, 3) || ["Cairo leads in general medicine", "Alexandria requires logistics optimization", "Giza shows high demand for specialized care"]).map((insight, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <p className="text-sm leading-relaxed text-slate-300">{insight}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-12 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-2">Expansion Readiness</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">85%</span>
                <span className="text-xs text-blue-100 mb-1.5 font-medium">Ready</span>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[85%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligenceView;
