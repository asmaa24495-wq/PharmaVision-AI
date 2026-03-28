import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Zap, RefreshCw, BrainCircuit, Loader2, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import AnalysisSection from './AnalysisSection';
import { MOCK_PRODUCTS, SALES_CHART_DATA } from '../constants';
import { cn } from '../lib/utils';
import { MarketAnalysis } from '../types';
import ExportDataPanel from './ExportDataPanel';

interface SalesAnalysisViewProps {
  t: any;
  analysis: MarketAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

const SalesAnalysisView = ({ t, analysis, loading, onRefresh }: SalesAnalysisViewProps) => {
  const [filteredProducts, setFilteredProducts] = useState([...MOCK_PRODUCTS]);
  const sortedByGrowth = [...filteredProducts].sort((a, b) => b.growth - a.growth);
  const bestProduct = sortedByGrowth[0] || { name: 'N/A', growth: 0 };
  const worstProduct = sortedByGrowth[sortedByGrowth.length - 1] || { name: 'N/A', growth: 0 };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">AI Sales Intelligence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time analysis of current sales data</p>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {loading ? "Running Analysis..." : "Run Analysis"}
        </button>
      </div>

      <ExportDataPanel 
        data={MOCK_PRODUCTS}
        filename="sales_report"
        title="PharmaVision Sales Report"
        onFilter={setFilteredProducts}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="font-bold text-lg mb-4 dark:text-white">Product Performance</h3>
          <div className="space-y-4">
            {filteredProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between group">
                <span className="text-sm font-medium dark:text-slate-300 group-hover:text-blue-600 transition-colors">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">{p.sales} units</span>
                  <span className={cn("text-sm font-bold flex items-center gap-0.5", p.growth > 0 ? "text-emerald-600" : "text-rose-600")}>
                    {p.growth > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(p.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-emerald-600">
            <TrendingUp size={100} />
          </div>
          <h3 className="font-bold text-lg mb-2 text-emerald-700 dark:text-emerald-400">Best Performer</h3>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{bestProduct.name}</p>
          <div className="flex items-center gap-1 text-emerald-600 mt-2 font-bold">
            <ArrowUpRight size={16} />
            <span className="text-sm">+{bestProduct.growth}% Growth</span>
          </div>
          <p className="text-xs text-emerald-600/70 mt-1">Leading market expansion</p>
        </div>

        <div className="bg-rose-50 dark:bg-rose-500/10 p-6 border border-rose-100 dark:border-rose-500/20 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-rose-600">
            <AlertTriangle size={100} />
          </div>
          <h3 className="font-bold text-lg mb-2 text-rose-700 dark:text-rose-400">Underperforming</h3>
          <p className="text-2xl font-bold text-rose-900 dark:text-rose-300">{worstProduct.name}</p>
          <div className="flex items-center gap-1 text-rose-600 mt-2 font-bold">
            <ArrowDownRight size={16} />
            <span className="text-sm">{worstProduct.growth}% Decline</span>
          </div>
          <p className="text-xs text-rose-600/70 mt-1">Requires immediate intervention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-blue-600">
              <BarChart3 size={20} />
              <h3 className="font-bold text-xl">Sales Revenue Trend</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-400 uppercase">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-bold text-slate-400 uppercase">Target</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={SALES_CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#e2e8f0" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-6">
            <TrendingUp size={20} />
            <h3 className="font-bold text-xl">
              {loading ? "Analyzing..." : (analysis?.overview ? "AI Analysis" : "Market Signals")}
            </h3>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={48} className="text-blue-600 animate-spin" />
              <p className="text-slate-500 dark:text-slate-400 font-medium italic text-center">Gemini is processing market signals...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <AnalysisSection 
                title="Key Insights" 
                items={analysis?.insights.slice(0, 2) || ["Volume up by 15% in Cairo", "Average order value increased"]} 
                icon={TrendingUp} 
                colorClass="text-emerald-500" 
              />
              <AnalysisSection 
                title="Critical Issues" 
                items={analysis?.issues.slice(0, 2) || ["Alexandria logistics delays", "Stockouts in Product B"]} 
                icon={AlertTriangle} 
                colorClass="text-rose-500" 
              />
              <AnalysisSection 
                title="Recommended Actions" 
                items={analysis?.recommendations.slice(0, 2) || ["Re-route Alexandria shipments", "Increase safety stock"]} 
                icon={Zap} 
                colorClass="text-blue-500" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysisView;
