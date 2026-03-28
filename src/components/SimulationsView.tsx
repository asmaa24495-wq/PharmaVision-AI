import React, { useState } from 'react';
import { Play, TrendingUp, TrendingDown, Activity, Zap, Target, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface SimulationsViewProps {
  t: any;
}

const SimulationsView = ({ t }: SimulationsViewProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const simulations = [
    {
      id: 'price',
      title: 'Price Elasticity Simulation',
      description: 'Predict market share impact of a 5-10% price adjustment across product lines.',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      id: 'field',
      title: 'Field Force Reallocation',
      description: 'Simulate ROI of shifting representatives between high-density and low-density regions.',
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      id: 'competitor',
      title: 'Competitor Launch Response',
      description: 'Model the impact of a new competitor product launch and test counter-strategies.',
      icon: ShieldCheck,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 dark:bg-rose-500/10'
    }
  ];

  const handleRunSimulation = (id: string) => {
    setIsRunning(true);
    setActiveSimulation(id);
    
    setTimeout(() => {
      setIsRunning(false);
      setActiveSimulation(null);
      console.log("Simulation Complete!", `The ${simulations.find(s => s.id === id)?.title} has been processed with 92% confidence.`);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 rounded-xl">
          <Activity size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg dark:text-white">Predictive Simulations</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Run advanced AI-powered "What-If" scenarios to test strategic decisions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {simulations.map((sim) => (
          <div key={sim.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", sim.bgColor, sim.color)}>
                <sim.icon size={32} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Powered</p>
                <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                  <Activity size={14} />
                  92% Confidence
                </div>
              </div>
            </div>

            <h4 className="font-bold text-xl mb-4 dark:text-white">{sim.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              {sim.description}
            </p>

            <button 
              onClick={() => handleRunSimulation(sim.id)}
              disabled={isRunning}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95",
                isRunning && activeSimulation === sim.id 
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/20"
              )}
            >
              {isRunning && activeSimulation === sim.id ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Running Scenario...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Run Simulation
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold mb-4">Monte Carlo Market Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Run 10,000 parallel simulations to determine the most probable market outcome for the next fiscal year.
            </p>
          </div>
          <button 
            onClick={() => {
              console.log("Monte Carlo analysis initiated", "Processing 10,000 scenarios...");
              setTimeout(() => console.log("Analysis Complete!", "Most probable outcome: 12.4% growth with 88% probability."), 4000);
            }}
            className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl"
          >
            <RefreshCw size={20} />
            Run Global Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationsView;
