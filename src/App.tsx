import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';
import { 
  MOCK_PRODUCTS, 
  MOCK_REGIONS, 
  MOCK_PHARMACIES,
  COMPETITOR_DATA
} from './constants';
import { getDetailedAnalysis } from './services/aiService';
import { MarketAnalysis } from './types';
import SettingsView from './components/SettingsView';
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
import ComingSoonView from './components/ComingSoonView';
import PharmaVisionAssistant from './components/PharmaVisionAssistant';
import CompetitorsView from './components/CompetitorsView';
import SimulationsView from './components/SimulationsView';
import InventoryManagementView from './components/InventoryManagementView';
import { generateInventoryAlerts } from './services/alertService';
import { INVENTORY_THRESHOLD, MOCK_INVENTORY } from './constants';
import { Alert } from './types';
import { Toaster, toast } from 'sonner';

// --- Main App ---

export default function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [showAssistant, setShowAssistant] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inventoryThreshold, setInventoryThreshold] = useState(INVENTORY_THRESHOLD);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [bubbleMessages, setBubbleMessages] = useState([
    { role: 'assistant', content: "Hello Dr. Ahmed. I've analyzed the latest market shifts in Cairo. How can I help you today?" }
  ]);
  const [bubbleInput, setBubbleInput] = useState('');
  const [isBubbleLoading, setIsBubbleLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'asmaa saied',
    title: 'Chief Strategist',
    email: 'sooo1421997@gmail.com',
    avatar: 'https://picsum.photos/seed/strategist/200/200'
  });

  const isRtl = i18n.language === 'ar';

  const handleBubbleSend = async () => {
  if (!bubbleInput.trim() || isBubbleLoading) return;

  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    toast.error("API key missing");
    return;
  }

  const userMsg = { role: "user", content: bubbleInput };
  setBubbleMessages(prev => [...prev, userMsg]);

  const currentInput = bubbleInput;
  setBubbleInput('');
  setIsBubbleLoading(true);

  try {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: currentInput }]
        }
      ]
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    const assistantMsg = {
      role: "assistant",
      content: text
    };

    setBubbleMessages(prev => [...prev, assistantMsg]);

  } catch (error) {
    console.error("AI Error:", error);
    toast.error("AI Error");
  } finally {
    setIsBubbleLoading(false);
  }
}; 

    fetchAnalysis();
  }, []);

  useEffect(() => {
    const newAlerts = generateInventoryAlerts(MOCK_INVENTORY, inventoryThreshold);
    
    // Check for new critical alerts to notify
    const criticalAlerts = newAlerts.filter(a => a.type === 'critical');
    if (criticalAlerts.length > 0) {
      criticalAlerts.forEach(alert => {
        toast.error(alert.title, {
          description: alert.message,
          action: {
            label: 'Email Sent',
            onClick: () => console.log('Email notification simulation')
          }
        });
      });
    }

    setAlerts(newAlerts);
  }, [inventoryThreshold]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };const handleBubbleSend = async () => {
  if (!bubbleInput.trim() || isBubbleLoading) return;

  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    toast.error("API Key missing");
    return;
  }

  const userMsg = { role: 'user', content: bubbleInput };
  setBubbleMessages(prev => [...prev, userMsg]);

  const currentInput = bubbleInput;
  setBubbleInput('');
  setIsBubbleLoading(true);

  try {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: currentInput
    });

    const assistantMsg = {
      role: 'assistant',
      content: response.text || "No response"
    };

    setBubbleMessages(prev => [...prev, assistantMsg]);

  } catch (error) {
    console.error(error);
    toast.error("AI Error");
  } finally {
    setIsBubbleLoading(false);
  }
};

  

  return (
    <div className={cn(
      "flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300",
      isRtl ? "font-arabic" : ""
    )}>
      <Toaster position="top-right" richColors />
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

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
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <ChevronRight size={20} className={isRtl ? "" : "rotate-180"} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('dashboard')}</p>
            <nav className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label={t('dashboard')} active={activeTab === 'dashboard'} onClick={() => handleSidebarClick('dashboard')} />
              <SidebarItem icon={BarChart3} label={t('salesAnalysis')} active={activeTab === 'sales'} onClick={() => handleSidebarClick('sales')} />
              <SidebarItem icon={MapIcon} label={t('marketIntelligence')} active={activeTab === 'map'} onClick={() => handleSidebarClick('map')} />
              <SidebarItem icon={Zap} label={t('decisionEngine')} active={activeTab === 'decisions'} onClick={() => handleSidebarClick('decisions')} />
            </nav>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('inventoryDemand')}</p>
            <nav className="space-y-1">
              <SidebarItem icon={Package} label={t('inventoryManagement')} active={activeTab === 'inventory-mgmt'} onClick={() => handleSidebarClick('inventory-mgmt')} />
              <SidebarItem icon={TrendingUp} label={t('demandForecasting')} active={activeTab === 'inventory'} onClick={() => handleSidebarClick('inventory')} />
              <SidebarItem icon={Users} label={t('repPerformance')} active={activeTab === 'reps'} onClick={() => handleSidebarClick('reps')} />
              <SidebarItem icon={Building2} label={t('pharmacyInsights')} active={activeTab === 'pharmacy'} onClick={() => handleSidebarClick('pharmacy')} />
              <SidebarItem icon={Bot} label="AI Assistant" active={activeTab === 'assistant'} onClick={() => handleSidebarClick('assistant')} />
              <SidebarItem icon={Bell} label={t('smartAlerts')} active={activeTab === 'alerts'} onClick={() => handleSidebarClick('alerts')} />
            </nav>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('simulations')}</p>
            <nav className="space-y-1">
              <SidebarItem icon={Target} label={t('competitiveIntel')} active={activeTab === 'competitors'} onClick={() => handleSidebarClick('competitors')} />
              <SidebarItem icon={Activity} label={t('simulations')} active={activeTab === 'simulations'} onClick={() => handleSidebarClick('simulations')} />
              <SidebarItem icon={FileText} label={t('reports')} active={activeTab === 'reports'} onClick={() => handleSidebarClick('reports')} />
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <SidebarItem icon={Settings} label={t('settings')} active={activeTab === 'settings'} onClick={() => handleSidebarClick('settings')} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <LayoutDashboard size={20} />
            </button>
            <div className="relative w-48 md:w-96 hidden sm:block">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className={cn(
                  "w-full py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white",
                  isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck size={14} />
              {t('systemSecure')}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('settings')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  activeTab === 'settings' 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
                title={t('settings')}
              >
                <Settings size={20} />
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={t('themeMode')}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={toggleLanguage}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <Languages size={20} />
                <span className="text-xs font-bold uppercase">{i18n.language}</span>
              </button>
            </div>
            
            <button 
              onClick={() => setActiveTab('alerts')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
            >
              <Bell size={20} />
              {alerts.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                  {alerts.length}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('settings')}>
              <div className="text-right">
                <p className="text-sm font-bold group-hover:text-blue-600 transition-colors dark:text-white">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{userProfile.title}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                <img src={userProfile.avatar} alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <LayoutDashboard size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('commandCenter')}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {activeTab === 'dashboard' && t('dashboard')}
                  {activeTab === 'sales' && t('salesAnalysis')}
                  {activeTab === 'map' && t('marketIntelligence')}
                  {activeTab === 'inventory-mgmt' && t('inventoryManagement')}
                  {activeTab === 'inventory' && t('demandForecasting')}
                  {activeTab === 'reps' && t('repPerformance')}
                  {activeTab === 'pharmacy' && t('pharmacyInsights')}
                  {activeTab === 'decisions' && t('decisionEngine')}
                  {activeTab === 'alerts' && t('smartAlerts')}
                  {activeTab === 'competitors' && t('competitiveIntel')}
                  {activeTab === 'simulations' && t('simulations')}
                  {activeTab === 'reports' && t('reports')}
                  {activeTab === 'settings' && t('settings')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                  {activeTab === 'dashboard' && t('dashboardDesc')}
                  {activeTab === 'sales' && t('salesDesc')}
                  {activeTab === 'map' && t('mapDesc')}
                  {activeTab === 'inventory-mgmt' && t('inventoryMgmtDesc')}
                  {activeTab === 'inventory' && t('inventoryDesc')}
                  {activeTab === 'reps' && t('repsDesc')}
                  {activeTab === 'pharmacy' && t('pharmacyDesc')}
                  {activeTab === 'decisions' && t('decisionsDesc')}
                  {activeTab === 'alerts' && t('alertsDesc')}
                  {activeTab === 'competitors' && t('competitorsDesc')}
                  {activeTab === 'simulations' && t('simulationsDesc')}
                  {activeTab === 'reports' && t('reportsDesc')}
                  {activeTab === 'settings' && t('settingsDesc')}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setSimulationMode(!simulationMode)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                    simulationMode ? "bg-amber-600 text-white shadow-lg shadow-amber-200" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <Activity size={16} /> {simulationMode ? t('exitSimulation') : t('predictiveSimulation')}
                </button>
                <button 
                  onClick={() => toast.success("Exporting Strategic Intelligence", { description: "Preparing PDF and CSV reports for all regions." })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  <FileText size={16} /> {t('exportIntel')}
                </button>
              </div>
            </div>

            {/* View Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && <DashboardView analysis={analysis} loading={loadingAnalysis} t={t} alerts={alerts} />}
                {activeTab === 'sales' && (
                  <SalesAnalysisView 
                    t={t} 
                    analysis={analysis} 
                    loading={loadingAnalysis} 
                    onRefresh={() => {
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
                    }}
                  />
                )}
                {activeTab === 'map' && (
                  <MarketIntelligenceView 
                    t={t} 
                    analysis={analysis} 
                    loading={loadingAnalysis} 
                    onRefresh={() => {
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
                    }}
                  />
                )}
                {activeTab === 'inventory-mgmt' && (
                  <InventoryManagementView 
                    t={t} 
                    threshold={inventoryThreshold} 
                    onThresholdChange={setInventoryThreshold} 
                  />
                )}
                {activeTab === 'inventory' && (
                  <DemandForecastingView 
                    t={t} 
                    analysis={analysis} 
                    loading={loadingAnalysis} 
                    onRefresh={() => {
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
                    }}
                  />
                )}
                {activeTab === 'reps' && (
                  <RepsPerformanceView 
                    t={t} 
                    analysis={analysis} 
                    loading={loadingAnalysis} 
                    onRefresh={() => {
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
                    }}
                  />
                )}
                {activeTab === 'pharmacy' && (
                  <PharmacyInsightsView 
                    t={t} 
                    analysis={analysis} 
                    loading={loadingAnalysis} 
                    onRefresh={() => {
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
                    }}
                  />
                )}
                {activeTab === 'decisions' && (
                  <DecisionEngineView 
                    t={t} 
                    analysis={analysis} 
                    loading={loadingAnalysis} 
                    onRefresh={() => {
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
                    }}
                  />
                )}
                {activeTab === 'alerts' && <SmartAlertsView t={t} alerts={alerts} />}
                {activeTab === 'assistant' && <PharmaVisionAssistant />}
                {activeTab === 'competitors' && <CompetitorsView t={t} />}
                {activeTab === 'simulations' && <SimulationsView t={t} />}
                {activeTab === 'reports' && <ReportsView t={t} />}
                {activeTab === 'settings' && (
                  <SettingsView 
                    darkMode={darkMode} 
                    setDarkMode={setDarkMode} 
                    isRtl={isRtl} 
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    pushEnabled={pushEnabled}
                    setPushEnabled={setPushEnabled}
                    emailEnabled={emailEnabled}
                    setEmailEnabled={setEmailEnabled}
                    twoFactorEnabled={twoFactorEnabled}
                    setTwoFactorEnabled={setTwoFactorEnabled}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* AI Conversational Assistant Bubble */}
      <div className={cn("fixed bottom-8 z-50", isRtl ? "left-8" : "right-8")}>
        <AnimatePresence>
          {showAssistant && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "absolute bottom-20 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden",
                isRtl ? "left-0" : "right-0"
              )}
            >
              <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit size={20} />
                  <span className="font-bold text-sm"><span>PharmaVision AI Assistant</span></span>
                </div>
                <button onClick={() => setShowAssistant(false)} className="hover:bg-white/20 p-1 rounded-lg">
                  <ChevronRight size={18} className={cn(isRtl ? "rotate-180" : "rotate-90")} />
                </button>
              </div>
              <div className="h-80 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950 space-y-4 custom-scrollbar">
                {bubbleMessages.map((msg, i) => (
                  <div 
                    key={`msg-${i}`} 
                    className={cn(
                      "p-3 rounded-2xl shadow-sm text-xs leading-relaxed border border-slate-100 dark:border-slate-800",
                      msg.role === 'assistant' 
                        ? "bg-white dark:bg-slate-900 rounded-tl-none text-slate-600 dark:text-slate-300" 
                        : "bg-blue-600 rounded-tr-none text-white ml-8"
                    )}
                  >
                    <span>{msg.content}</span>
                  </div>
                ))}
                {isBubbleLoading && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
                    <Loader2 size={12} className="animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <input 
                    type="text" 
                    value={bubbleInput}
                    onChange={(e) => setBubbleInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBubbleSend()}
                    placeholder={t('askAiAnything')} 
                    className="w-full pl-4 pr-10 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <button 
                    onClick={handleBubbleSend}
                    disabled={isBubbleLoading || !bubbleInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setShowAssistant(!showAssistant)}
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110 active:scale-95"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
}
