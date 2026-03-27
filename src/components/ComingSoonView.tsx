import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonViewProps {
  title: string;
  t: any;
}

const ComingSoonView = ({ title, t }: ComingSoonViewProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
      <Construction size={40} />
    </div>
    <h3 className="text-2xl font-bold dark:text-white">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-md">
      This module is currently under development as part of the PharmaVision AI Enterprise Suite. 
      Stay tuned for advanced analytics and predictive insights.
    </p>
  </div>
);

export default ComingSoonView;
