import React, { useState } from 'react';
import { ChevronRight, Store, Star, AlertCircle, TrendingUp, Loader2, RefreshCw, Target, ShoppingCart, Zap, Sparkles } from 'lucide-react';
import { MarketAnalysis } from '../types';
import { MOCK_PHARMACIES } from '../constants';
import { cn } from '../lib/utils';
import ExportDataPanel from './ExportDataPanel';

interface PharmacyInsightsViewProps {
  t: any;
  analysis: MarketAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

const PharmacyInsightsView = ({ t, analysis, loading, onRefresh }: PharmacyInsightsViewProps) => {
  const [filteredPharmacies, setFilteredPharmacies] = useState([...MOCK_PHARMACIES]);
  const vipPharmacies = filteredPharmacies.filter(ph => ph.tier === 'VIP');
  const weakPharmacies = filteredPharmacies.filter(ph => ph.tier === 'Weak');
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 rounded-xl">
            <Store size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">Pharmacy Performance Insights</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deep dive into client tiers, purchasing behavior, and targeting strategies</p>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {loading ? "Analyzing..." : "Analyze Clients"}
        </button>
      </div>

      <ExportDataPanel 
        data={MOCK_PHARMACIES}
        filename="pharmacy_insights_report"
        title="PharmaVision Pharmacy Insights Report"
        onFilter={setFilteredPharmacies}
        filterOptions={[
          { key: 'tier', label: 'Tier', options: ['VIP', 'Regular', 'Weak'] },
          { key: 'location', label: 'Location', options: ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'] }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-amber-600 group-hover:scale-110 transition-transform">
            <Star size={100} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl mb-8 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl">
                <Star size={20} fill="currentColor" />
              </div>
              VIP Pharmacies
            </h3>
            <div className="space-y-4">
              {vipPharmacies.map((ph, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all cursor-pointer group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-amber-600 font-bold shadow-sm">
                      {ph.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white group-hover/item:text-amber-600 transition-colors">{ph.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{ph.location} • ${ph.sales.toLocaleString()}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-amber-500 group-hover/item:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-rose-600 group-hover:scale-110 transition-transform">
            <AlertCircle size={100} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl mb-8 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl">
                <AlertCircle size={20} />
              </div>
              Low-Performing Clients
            </h3>
            <div className="space-y-4">
              {weakPharmacies.map((ph, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-500/5 rounded-2xl border border-rose-100 dark:border-rose-500/10 hover:border-rose-300 dark:hover:border-rose-500/30 transition-all cursor-pointer group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-rose-600 font-bold shadow-sm">
                      {ph.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white group-hover/item:text-rose-600 transition-colors">{ph.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{ph.location} • ${ph.sales.toLocaleString()}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-rose-500 group-hover/item:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-xl dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl">
              <ShoppingCart size={20} />
            </div>
            Purchasing Behavior & AI Insights
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles size={12} className="text-blue-500" />
            AI-Driven Analysis
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 size={48} className="text-blue-600 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gemini is analyzing purchasing patterns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(analysis?.insights.slice(0, 4) || []).map((insight, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-start gap-5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm dark:text-white group-hover:text-blue-600 transition-colors">
                    {insight.split(':')[0]}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {insight.includes(':') ? insight.split(':')[1] : insight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
              <Target size={28} />
            </div>
            <div>
              <h3 className="font-bold text-2xl tracking-tight">Targeting & Sales Strategies</h3>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-1">Strategic Growth Roadmap</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={48} className="text-blue-400 animate-spin" />
              <p className="text-slate-400 font-medium italic">Generating strategic recommendations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">1</div>
                  <h4 className="font-bold text-lg text-blue-400 group-hover:text-white transition-colors">Retention (VIP)</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {analysis?.recommendations[0] || "Implement a 'Premier Partner' program for VIP accounts. Offer exclusive early access to new product launches and dedicated 24/7 logistics support."}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                  <Zap size={10} />
                  High Loyalty Impact
                </div>
              </div>

              <div className="space-y-6 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">2</div>
                  <h4 className="font-bold text-lg text-blue-400 group-hover:text-white transition-colors">Growth (Weak)</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {analysis?.recommendations[1] || "Launch a 'Small Pharmacy' starter kit for underperforming clients. Provide 60-day credit terms and free point-of-sale marketing materials to boost initial volume."}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                  <TrendingUp size={10} />
                  Volume Expansion
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyInsightsView;
