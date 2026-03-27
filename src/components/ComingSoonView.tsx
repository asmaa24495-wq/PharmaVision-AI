import React from 'react';
import { Construction, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface ComingSoonViewProps {
  title: string;
  t: any;
}

const ComingSoonView = ({ title, t }: ComingSoonViewProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
    <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-[2rem] flex items-center justify-center text-amber-600 shadow-xl shadow-amber-200/20 dark:shadow-none">
      <Construction size={48} />
    </div>
    <div className="space-y-2">
      <h3 className="text-3xl font-bold dark:text-white tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        This module is currently under development as part of the PharmaVision AI Enterprise Suite. 
        Stay tuned for advanced analytics and predictive insights.
      </p>
    </div>
    <button 
      onClick={() => toast.success("Notification set!", { description: `We'll notify you as soon as ${title} is ready for launch.` })}
      className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95"
    >
      <Bell size={18} />
      Notify Me When Ready
    </button>
  </div>
);

export default ComingSoonView;
