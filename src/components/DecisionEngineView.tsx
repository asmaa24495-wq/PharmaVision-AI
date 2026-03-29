import React from 'react';
import { BrainCircuit, Play, CheckCircle2, TrendingUp, Calendar, Target, Zap, Loader2, RefreshCw, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { MarketAnalysis } from '../types';
import { cn } from '../lib/utils';

interface DecisionEngineViewProps {
  t: any;
  analysis: MarketAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

const DecisionEngineView = ({ t, analysis, loading, onRefresh }: DecisionEngineViewProps) => {
  const decisions = [
    {
      title: "Strategic Inventory Reallocation",
      impact: "+$120k Revenue",
      timeline: "Q2 (April - June)",
      action: "Shift 25% of Cardiovascular stock from Alexandria to Giza South to meet predicted 35% demand surge.",
      confidence: 94,
      category: "Logistics"
    },
    {
      title: "VIP Loyalty Rebate Program",
      impact: "+15% Retention",
      timeline: "Immediate (Next 30 Days)",
      action: "Implement a 5% volume-based rebate for Nahdi and Al-Dawaa pharmacies on chronic care bulk orders.",
      confidence: 88,
      category: "Sales"
    },
    {
      title: "Field Force Optimization",
      impact: "+12% Conversion",
      timeline: "Q2 Launch",
      action: "Reallocate 3 general reps to specialized allergy clinics in Cairo to capture seasonal antihistamine surge.",
      confidence: 91,
      category: "Operations"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl shadow-inner">
                <BrainCircuit size={40} />
              </div>
              <div>
                <h3 className="font-bold text-3xl tracking-tight">AI Decision Engine</h3>
                <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mt-1">Strategic Intelligence Hub</p>
              </div>
            </div>
            <button 
              onClick={() => {
                onRefresh();
                toast.success('Simulation started...');
              }}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/40 group active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} className="group-hover:translate-x-1 transition-transform" />}
              {loading ? "Processing Data..." : "Run New Simulation"}
            </button>
          </div>
          
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm max-w-3xl">
            <p className="text-slate-300 leading-relaxed">
              The engine has analyzed <span className="text-white font-bold">1.2M data points</span> across sales, logistics, and competitor pricing. 
              Current market conditions indicate a high-yield opportunity in <span className="text-blue-400 font-bold">Giza South</span> and a seasonal risk in <span className="text-rose-400 font-bold">Alexandria</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm animate-pulse">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6" />
              <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4 mb-4" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2 mb-8" />
              <div className="space-y-3">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-2/3" />
              </div>
            </div>
          ))
        ) : (
          decisions.map((decision, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  "p-3 rounded-2xl transition-colors",
                  i === 0 ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600" : 
                  i === 1 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : 
                  "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                )}>
                  {i === 0 ? <Zap size={24} /> : i === 1 ? <Target size={24} /> : <TrendingUp size={24} />}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{decision.category}</p>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                    <TrendingUp size={14} />
                    {decision.impact}
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-xl mb-2 dark:text-white group-hover:text-blue-600 transition-colors">{decision.title}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
                <Calendar size={14} />
                Timeline: {decision.timeline}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6 flex-grow">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{decision.action}"
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${decision.confidence}%` }} />
                    </div>
                    <span className="text-xs font-bold dark:text-white">{decision.confidence}%</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    toast.success(`Strategy "${decision.title}" executed!`);
                    console.log(`Executing Strategy: ${decision.title}`, `Impact: ${decision.impact}. Action: ${decision.action}`);
                  }}
                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 text-rose-600">
            <AlertTriangle size={100} />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-xl mb-8 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl">
                <AlertTriangle size={20} />
              </div>
              Risk Analysis
            </h4>
            <div className="space-y-4">
              <div className="p-5 border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 rounded-2xl">
                <p className="text-xs font-bold text-rose-600 uppercase mb-2 tracking-widest">Competitor Threat</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Competitor X is planning a major launch in the Cardiovascular segment next month. Predicted market share impact: <span className="text-rose-600 font-bold">-3.5%</span>.
                </p>
              </div>
              <div className="p-5 border border-amber-100 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 rounded-2xl">
                <p className="text-xs font-bold text-amber-600 uppercase mb-2 tracking-widest">Supply Chain Risk</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Raw material shortage for Antibiotics may cause a 10-day delay in production. Confidence: <span className="text-amber-600 font-bold">65%</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 text-emerald-600">
            <ShieldCheck size={100} />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-xl mb-8 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl">
                <ShieldCheck size={20} />
              </div>
              Strategic Recommendations
            </h4>
            <div className="space-y-4">
              {(analysis?.recommendations.slice(0, 3) || [
                "Increase Lipitor inventory in Giza by 25% for Q2.",
                "Reallocate 2 reps from Alexandria to Cairo Central.",
                "Launch 5% discount for Nahdi Pharmacy on bulk orders."
              ]).map((rec, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group">
                  <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionEngineView;
