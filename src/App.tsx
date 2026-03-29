import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Activity, Bot, Settings, Sun, Moon, LogOut, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from './lib/utils';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import { Toaster } from 'react-hot-toast';

// استدعاء مباشر للمكونات (تأكدي أن الأسماء مطابقة لما في مجلد components)
import DashboardView from './components/DashboardView';
import InventoryManagementView from './components/InventoryManagementView';
import PharmaVisionAssistant from './components/PharmaVisionAssistant';
import SettingsView from './components/SettingsView';

export default function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isRtl, darkMode]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (!user) return <LoginPage />;

  return (
    <div className={cn("flex h-screen bg-slate-50 dark:bg-slate-950", isRtl ? "font-arabic" : "")}>
      <Toaster />
      
      {/* Sidebar البسيط بدون مكونات خارجية */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 p-2 text-blue-600 font-bold text-xl">
          <Activity /> <span>PharmaVision</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
            <LayoutDashboard size={20} /> <span>{t('dashboard')}</span>
          </button>
          <button onClick={() => navigate('/inventory-mgmt')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
            <Package size={20} /> <span>{t('inventoryManagement')}</span>
          </button>
          <button onClick={() => navigate('/assistant')} className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <Bot size={20} /> <span>AI Assistant</span>
          </button>
          <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
            <Settings size={20} /> <span>{t('settings')}</span>
          </button>
        </nav>
        <button onClick={logout} className="flex items-center gap-2 p-3 text-rose-600 font-bold mt-auto"><LogOut size={20}/> {t('logout')}</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b flex items-center justify-between px-8">
          <span className="font-bold dark:text-white">د. نسيم الفايد</span>
          <div className="flex gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardView t={t} />} />
            <Route path="/inventory-mgmt" element={<InventoryManagementView t={t} />} />
            <Route path="/assistant" element={<PharmaVisionAssistant />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
          }
