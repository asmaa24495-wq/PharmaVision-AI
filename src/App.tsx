import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Bell, Activity, BarChart3, FileText, Settings, Sun, Moon, Languages, Bot, LogOut, Search, Loader2 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from './lib/utils';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import { Toaster } from 'react-hot-toast';
import { getInventory, getDashboardStats, updateDashboardStats, getUserProfile, updateUserProfile } from './services/firestoreService';

// Views
import DashboardView from './components/DashboardView';
import SalesAnalysisView from './components/SalesAnalysisView';
import InventoryManagementView from './components/InventoryManagementView';
import PharmaVisionAssistant from './components/PharmaVisionAssistant';
import SmartAlertsView from './components/SmartAlertsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import SidebarItem from './components/SidebarItem';

export default function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: 'د. نسيم الفايد', title: 'مدير النظام' });
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isRtl, darkMode]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <LoginPage />;

  return (
    <div className={cn("flex h-screen bg-slate-50 dark:bg-slate-950", isRtl ? "font-arabic" : "")}>
      <Toaster />
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 p-2">
          <Activity className="text-blue-600" />
          <h1 className="font-bold">PharmaVision</h1>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label={t('dashboard')} active={activeTab === 'dashboard'} onClick={() => navigate('/dashboard')} />
          <SidebarItem icon={Package} label={t('inventoryManagement')} active={activeTab === 'inventory-mgmt'} onClick={() => navigate('/inventory-mgmt')} />
          <SidebarItem icon={Bot} label="AI Assistant" active={activeTab === 'assistant'} onClick={() => navigate('/assistant')} />
          <SidebarItem icon={Settings} label={t('settings')} active={activeTab === 'settings'} onClick={() => navigate('/settings')} />
        </nav>
        <button onClick={logout} className="flex items-center gap-2 p-3 text-rose-600 font-bold"><LogOut size={20}/> {t('logout')}</button>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
             <span className="font-bold dark:text-white">{userProfile.name}</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun /> : <Moon />}</button>
            <button onClick={() => i18n.changeLanguage(isRtl ? 'en' : 'ar')}><Languages /></button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
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
