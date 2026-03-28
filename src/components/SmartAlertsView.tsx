import React from 'react';
import { AlertTriangle, Bell, Info, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Alert } from '../types';
import { cn } from '../lib/utils';

interface SmartAlertsViewProps {
  t: any;
  alerts: Alert[];
}

const SmartAlertsView = ({ t, alerts }: SmartAlertsViewProps) => {
  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const successCount = alerts.filter(a => a.type === 'success').length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle size={24} />;
      case 'warning': return <Info size={24} />;
      case 'info': return <CheckCircle2 size={24} />;
      case 'success': return <Sparkles size={24} />;
      default: return <Bell size={24} />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical': return 'border-rose-600 bg-rose-50/50 dark:bg-rose-500/5';
      case 'warning': return 'border-amber-500 bg-amber-50/50 dark:bg-amber-500/5';
      case 'info': return 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5';
      case 'success': return 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5';
      default: return 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/5';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600';
      case 'warning': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600';
      case 'info': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600';
      case 'success': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600';
      default: return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'inventory': return 'bg-slate-100 text-slate-600';
      case 'market': return 'bg-purple-100 text-purple-600';
      case 'sales': return 'bg-rose-100 text-rose-600';
      case 'opportunity': return 'bg-emerald-100 text-emerald-600';
      case 'risk': return 'bg-amber-100 text-amber-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl dark:text-white flex items-center gap-2">
          <Bell size={24} className="text-blue-600" />
          {t('smartAlerts')}
        </h3>
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {criticalCount} CRITICAL
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {warningCount} WARNINGS
            </span>
          )}
          {successCount > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {successCount} OPPORTUNITIES
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 opacity-20" />
            <p className="text-slate-400 font-medium">All systems operational. No active alerts.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={cn(
                "p-6 bg-white dark:bg-slate-900 border-l-4 rounded-2xl shadow-sm flex items-start gap-4 transition-all hover:shadow-md",
                getAlertStyles(alert.type)
              )}
            >
              <div className={cn("p-3 rounded-xl", getIconStyles(alert.type))}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">{alert.title}</h4>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight", getCategoryBadge(alert.category))}>
                      {alert.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <Clock size={10} />
                    {formatTime(alert.timestamp)}
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{alert.message}</p>
                {alert.actionLabel && (
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={() => console.log(`Action: ${alert.actionLabel}`, `Initiating ${alert.actionLabel} for ${alert.title}`)}
                      className={cn(
                        "px-4 py-2 text-white text-xs font-bold rounded-lg transition-all hover:scale-105 active:scale-95",
                        alert.type === 'critical' ? 'bg-rose-600 hover:bg-rose-700' : 
                        alert.type === 'success' ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-amber-500 hover:bg-amber-600'
                      )}
                    >
                      {alert.actionLabel}
                    </button>
                    <button 
                      onClick={() => console.log('Alert ignored', `Alert "${alert.title}" has been archived.`)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Ignore
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SmartAlertsView;
