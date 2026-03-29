import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Map as MapIcon, 
  Users, 
  Bell, 
  ChevronRight,
  Activity,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  Building2,
  Zap,
  Target,
  Sun,
  Moon,
  Languages,
  BrainCircuit,
  Search,
  Bot,
  Send,
  Loader2,
  LogOut,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from './lib/utils';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import { 
  MOCK_PRODUCTS, 
  MOCK_REGIONS, 
  MOCK_PHARMACIES,
  MOCK_REPS,
  COMPETITOR_DATA,
  MOCK_INVENTORY,
  INVENTORY_THRESHOLD
} from './constants';
import { getDetailedAnalysis } from './services/aiService';
import { MarketAnalysis, InventoryItem, DashboardStats, SalesRecord, Alert, UserProfile } from './types';
import SidebarItem from './components/SidebarItem';
import DashboardView from './components/DashboardView';
import SalesAnalysisView from './components/SalesAnalysisView';
import MarketIntelligenceView from './components/MarketIntelligenceView';
import DemandForecastingView from './components/DemandForecastingView';
import RepsPerformanceView from './components/RepsPerformanceView';
import PharmacyInsightsView from './components/PharmacyInsightsView';
import ReportsView from './components/ReportsView';
import DecisionEngineView from './components/DecisionEngineView';
import SmartAlertsView from './components/SmartAlertsView';
import PharmaVisionAssistant from './components/PharmaVisionAssistant';
import CompetitorsView from './components/CompetitorsView';
import SimulationsView from './components/SimulationsView';
import InventoryManagementView from './components/InventoryManagementView';
import { generateInventoryAlerts } from './services/alertService';

import { Toaster } from 'react-hot-toast';
import { getInventory, getDashboardStats, updateDashboardStats, addInventoryItem, getSales, addSale, getUserProfile, updateUserProfile } from './services/firestoreService';

export default function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryThreshold, setInventoryThreshold] = useState(INVENTORY_THRESHOLD);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    uid: '',
    email: '',
    name: 'د. نسيم الفايد',
    title: 'مدير الصيدلية الذكي',
    avatar: 'https://picsum.photos/seed/doc/200/200',
    role: 'admin',
    darkMode: false,
    pushEnabled: true,
    emailEnabled: true,
    twoFactorEnabled: false
  });

  const isRtl = i18n.language === 'ar';

  const handleSidebarClick = (tab: string) => {
    setIsSidebarOpen(false);
    navigate(`/${tab}`);
  };

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadingAnalysis(true);
      const res = await getDetailedAnalysis({ 
        products: MOCK_PRODUCTS, 
        regions: MOCK_REGIONS,
        pharmacies: MOCK_PHARMACIES,
        competitors: COMPETITOR_DATA
      });
      setAnalysis(res);
      setLoadingAnalysis(false);
    };
    fetchAnalysis();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubInventory = getInventory((items) => {
      setInventory(items);
      if (items.length === 0) {
        MOCK_INVENTORY.forEach(item => addInventoryItem(item));
      }
    });

    const unsubStats = getDashboardStats((data) => {
      setStats(data);
      if (!data) {
        updateDashboardStats({
          totalRevenue: 4250000,
          revenueChange: "+18.2%",
          growth: 12.4,
          marketHealth: 92
        });
      }
    });

    const unsubProfile = getUserProfile(user.uid, (profile) => {
      if (profile) {
        setUserProfile(profile);
        setDarkMode(profile.darkMode);
      }
    });

    return () => {
      unsubInventory && unsubInventory();
      unsubStats && unsubStats();
      unsubProfile && unsubProfile();
    };
  }, [user]);

  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    if (user) {
      updateUserProfile(user.uid, { darkMode: val });
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 size={48} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <div className={cn(
      "flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300",
      isRtl ? "font-arabic" : ""
    )}>
      <Toaster position="top-center" />

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 z-50 w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 border-slate-200 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : (isRtl ? "translate-x-full" : "-translate-x-full")
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{t('appName')}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('enterpriseAI')}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label={t('dashboard')} active={activeTab === 'dashboard'} onClick={() => handleSidebarClick('dashboard')} />
            <SidebarItem icon={BarChart3} label={t('salesAnalysis')} active={activeTab === 'sales'} onClick={() => handleSidebarClick('sales')} />
            <SidebarItem icon={Package} label={t('inventoryManagement')} active={activeTab === 'inventory-mgmt'} onClick={() => handleSidebarClick('inventory-mgmt')} />
            <SidebarItem icon={Bot} label="AI Assistant" active={activeTab === 'assistant'} onClick={() => handleSidebarClick('assistant')} />
            <SidebarItem icon={Bell} label={t('smartAlerts')} active={activeTab === 'alerts'} onClick={() => handleSidebarClick('alerts')} />
            <SidebarItem icon={FileText} label={t('reports')} active={activeTab === 'reports'} onClick={() => handleSidebarClick('reports')} />
            <SidebarItem icon={Settings} label={t('settings')} active={activeTab === 'settings'} onClick={() => handleSidebarClick('settings')} />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm">
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <LayoutDashboard size={20} />
            </button>
            <div className="relative w-48 md:w-96 hidden sm:block">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className={cn("w-full py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white", isRtl ? "pr-10 pl-4" : "pl-10 pr-4")}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={() => handleSetDarkMode(!darkMode)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 rounded-lg">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleLanguage} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 rounded-lg flex items-center gap-1">
              <Languages size={20} />
              <span className="text-xs font-bold uppercase">{i18n.language}</span>
            </button>
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/settings')}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold dark:text-white">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{userProfile.title}</p>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-blue-100">
                <img src={userProfile.avatar} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardView analysis={analysis} loading={loadingAnalysis} t={t} alerts={alerts} stats={stats} />} />
            <Route path="/sales" element={<SalesAnalysisView t={t} analysis={analysis} loading={loadingAnalysis} onRefresh={() => {}} />} />
            <Route path="/inventory-mgmt" element={<InventoryManagementView t={t} inventory={inventory} />} />
            <Route path="/assistant" element={<PharmaVisionAssistant />} />
            <Route path="/alerts" element={<SmartAlertsView t={t} alerts={alerts} />} />
            <Route path="/reports" element={<ReportsView t={t} />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
    }
