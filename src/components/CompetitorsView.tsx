import React from 'react';
import { Globe, TrendingUp, TrendingDown, ShieldAlert, Target, Users, Zap } from 'lucide-react';
import { COMPETITOR_DATA } from '../constants';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface CompetitorsViewProps {
  t: any;
}

const CompetitorsView = ({ t }: CompetitorsViewProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 rounded-xl">
          <Globe size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg dark:text-white">Competitive Intelligence</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time tracking of competitor market share and strategic moves</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COMPETITOR_DATA.map((competitor, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                  {competitor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">{competitor.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Global Pharma</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold",
                competitor.marketShare > 15 ? "text-rose-600" : "text-emerald-600"
              )}>
                {competitor.marketShare}% Share
                {competitor.marketShare > 15 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Strength</p>
                <div className="flex items-center gap-2 text-sm dark:text-white">
                  <Target size={16} className="text-blue-500" />
                  {i === 0 ? "Aggressive Pricing" : i === 1 ? "Strong Field Force" : "R&D Innovation"}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recent Move</p>
                <div className="flex items-center gap-2 text-sm dark:text-white">
                  <Zap size={16} className="text-amber-500" />
                  {i === 0 ? "Launched Generic Lipitor" : i === 1 ? "Acquired Local Distributor" : "New Oncology Pipeline"}
                </div>
              </div>
            </div>

            <button 
              onClick={() => toast.info(`Analyzing Counter-Strategy for ${competitor.name}`, { description: "AI is generating a tactical response based on market shifts." })}
              className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert size={14} />
              View Counter-Strategy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorsView;
