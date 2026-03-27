import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnalysisSectionProps {
  title: string;
  items: string[];
  icon: LucideIcon;
  colorClass: string;
}

const AnalysisSection = ({ title, items, icon: Icon, colorClass }: AnalysisSectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Icon size={18} className={colorClass} />
      <h4 className="font-bold text-sm dark:text-white">{title}</h4>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default AnalysisSection;
