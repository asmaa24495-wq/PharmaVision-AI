import React, { useState } from 'react';
import { Download, FileText, Table, Calendar, Filter, X } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../lib/exportUtils';
import { cn } from '../lib/utils';

interface ExportDataPanelProps {
  data: any[];
  filename: string;
  title: string;
  onFilter?: (filteredData: any[]) => void;
  filterOptions?: {
    key: string;
    label: string;
    options: string[];
  }[];
}

const ExportDataPanel = ({ data, filename, title, onFilter, filterOptions }: ExportDataPanelProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = (newFilters: Record<string, string>, start: string, end: string) => {
    let filtered = [...data];
    
    // Apply select filters
    Object.entries(newFilters).forEach(([k, v]) => {
      filtered = filtered.filter(item => String(item[k]) === String(v));
    });
    
    // Apply date filters if data has a date field (assuming 'date' or 'lastUpdated' or 'createdAt')
    if (start || end) {
      filtered = filtered.filter(item => {
        const itemDateStr = item.date || item.lastUpdated || item.createdAt;
        if (!itemDateStr) return true;
        
        const itemDate = new Date(itemDateStr);
        if (start && itemDate < new Date(start)) return false;
        if (end && itemDate > new Date(end)) return false;
        return true;
      });
    }
    
    if (onFilter) onFilter(filtered);
    return filtered;
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    if (value === '') {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
    applyFilters(newFilters, startDate, endDate);
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      applyFilters(activeFilters, value, endDate);
    } else {
      setEndDate(value);
      applyFilters(activeFilters, startDate, value);
    }
  };

  const getFilteredData = () => {
    return applyFilters(activeFilters, startDate, endDate);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div 
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
          <Download size={20} className="text-blue-600" />
          <h3 className="font-bold text-sm">Export & Filter Data</h3>
        </div>
        <div className="flex items-center gap-2">
          {Object.keys(activeFilters).length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">
              {Object.keys(activeFilters).length} Active Filters
            </span>
          )}
          <Filter size={16} className={cn("text-slate-400 transition-transform", isOpen ? "rotate-180" : "")} />
        </div>
      </div>

      {isOpen && (
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} /> Start Date
              </label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} /> End Date
              </label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
              />
            </div>

            {filterOptions?.map((filter) => (
              <div key={filter.key} className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filter.label}</label>
                <select 
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 transition-all dark:text-white appearance-none"
                >
                  <option value="">All {filter.label}s</option>
                  {filter.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => {
                setActiveFilters({});
                setStartDate('');
                setEndDate('');
                if (onFilter) onFilter(data);
              }}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <X size={14} /> Clear All Filters
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => exportToCSV(getFilteredData(), filename)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <Table size={14} className="text-emerald-600" />
                Export CSV
              </button>
              <button 
                onClick={() => exportToPDF(getFilteredData(), filename, title)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
              >
                <FileText size={14} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDataPanel;
