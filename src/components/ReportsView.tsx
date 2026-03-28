import React, { useState } from 'react';
import { FileText, Download, BarChart3, Package, Globe, Users, Store, Calendar, ArrowRight, Check, ChevronLeft, ChevronRight, Layout, PieChart, Table as TableIcon, Layers } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_INVENTORY, MOCK_REGIONS, MOCK_REPS, MOCK_PHARMACIES } from '../constants';
import { exportToCSV, exportToPDF } from '../lib/exportUtils';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ReportsViewProps {
  t: any;
}

const ReportsView = ({ t }: ReportsViewProps) => {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [reportType, setReportType] = useState('table');

  const reportTypes = [
    {
      id: 'sales',
      title: 'Sales Performance Report',
      description: 'Detailed analysis of product sales, growth trends, and revenue impact.',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      data: MOCK_PRODUCTS,
      filename: 'sales_performance_report'
    },
    {
      id: 'inventory',
      title: 'Inventory Status Report',
      description: 'Current stock levels, reorder points, and stockout risk assessment.',
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      data: MOCK_INVENTORY,
      filename: 'inventory_status_report'
    },
    {
      id: 'market',
      title: 'Regional Market Intelligence',
      description: 'Geospatial analysis of pharmacy density and regional sales performance.',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
      data: MOCK_REGIONS,
      filename: 'market_intelligence_report'
    },
    {
      id: 'reps',
      title: 'Field Force Performance',
      description: 'Individual representative targets, achievements, and coverage metrics.',
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
      data: MOCK_REPS,
      filename: 'reps_performance_report'
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy Insights Report',
      description: 'Client tiering, purchasing behavior, and strategic targeting data.',
      icon: Store,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 dark:bg-rose-500/10',
      data: MOCK_PHARMACIES,
      filename: 'pharmacy_insights_report'
    }
  ];

  const handleExport = (report: any, format: 'csv' | 'pdf') => {
    try {
      if (format === 'csv') {
        exportToCSV(report.data, report.filename);
      } else {
        exportToPDF(report.data, report.filename, report.title);
      }
      console.log(`${report.title} exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const generateCustomReport = () => {
    console.log('Custom report generated successfully!', `Combined ${selectedSources.length} data sources into a ${reportType} view.`);
    setShowWizard(false);
    setWizardStep(1);
    setSelectedSources([]);
  };

  if (showWizard) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowWizard(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h3 className="font-bold text-lg dark:text-white">Custom Report Builder</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step {wizardStep} of 3</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all duration-500",
                  step <= wizardStep ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                )}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {wizardStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div>
                  <h4 className="text-xl font-bold dark:text-white mb-2"><span>Select Data Sources</span></h4>
                  <p className="text-sm text-slate-500"><span>Choose the datasets you want to combine in your report.</span></p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportTypes.map(source => (
                    <button
                      key={source.id}
                      onClick={() => toggleSource(source.id)}
                      className={cn(
                        "p-6 rounded-3xl border-2 transition-all text-left group relative",
                        selectedSources.includes(source.id)
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-600/10"
                          : "border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50"
                      )}
                    >
                      <div className={cn("p-3 rounded-2xl mb-4 inline-block", source.bgColor, source.color)}>
                        <source.icon size={24} />
                      </div>
                      <h5 className="font-bold dark:text-white mb-1">{source.title}</h5>
                      <p className="text-[10px] text-slate-500 leading-tight">{source.description}</p>
                      {selectedSources.includes(source.id) && (
                        <div className="absolute top-4 right-4 text-blue-600">
                          <Check size={20} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {wizardStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div>
                  <h4 className="text-xl font-bold dark:text-white mb-2"><span>Visualization Type</span></h4>
                  <p className="text-sm text-slate-500"><span>How would you like to visualize the combined data?</span></p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'table', title: 'Data Table', icon: TableIcon, desc: 'Detailed row-by-row view' },
                    { id: 'bar', title: 'Bar Chart', icon: BarChart3, desc: 'Compare metrics across categories' },
                    { id: 'pie', title: 'Pie Chart', icon: PieChart, desc: 'Distribution and proportions' },
                    { id: 'multi', title: 'Multi-View', icon: Layout, desc: 'Combined dashboard layout' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={cn(
                        "p-6 rounded-3xl border-2 transition-all text-left group relative",
                        reportType === type.id
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-600/10"
                          : "border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50"
                      )}
                    >
                      <div className={cn("p-3 rounded-2xl mb-4 inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400", reportType === type.id && "bg-blue-600 text-white")}>
                        <type.icon size={24} />
                      </div>
                      <h5 className="font-bold dark:text-white mb-1">{type.title}</h5>
                      <p className="text-[10px] text-slate-500 leading-tight">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {wizardStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-200 dark:shadow-blue-900/20 mb-6">
                  <Layers size={40} />
                </div>
                <div className="max-w-md">
                  <h4 className="text-2xl font-bold dark:text-white mb-2"><span>Ready to Generate</span></h4>
                  <p className="text-sm text-slate-500">
                    <span>You've selected </span><span className="font-bold text-blue-600">{selectedSources.length}</span><span> data sources to be visualized as a </span><span className="font-bold text-blue-600 uppercase">{reportType}</span><span>.</span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedSources.map(s => (
                    <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {reportTypes.find(rt => rt.id === s)?.title}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button 
              onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
              disabled={wizardStep === 1}
              className="px-6 py-3 text-slate-500 font-bold text-sm disabled:opacity-30"
            >
              <span>Back</span>
            </button>
            {wizardStep < 3 ? (
              <button 
                onClick={() => setWizardStep(prev => prev + 1)}
                disabled={wizardStep === 1 && selectedSources.length === 0}
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                onClick={generateCustomReport}
                className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/20"
              >
                Generate Report
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg dark:text-white">Enterprise Reports Center</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate and export comprehensive business intelligence reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <div key={report.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${report.bgColor} ${report.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                  <report.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg dark:text-white">{report.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{report.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Calendar size={12} />
                Last Updated: Today
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleExport(report, 'csv')}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <span>CSV</span>
                </button>
                <button 
                  onClick={() => handleExport(report, 'pdf')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                >
                  <Download size={14} />
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold mb-4">Custom Report Builder</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Need a specialized report? Our AI-powered report builder can combine data from multiple sources to create the exact view you need.
            </p>
          </div>
          <button 
            onClick={() => setShowWizard(true)}
            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl"
          >
            Launch Builder
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
