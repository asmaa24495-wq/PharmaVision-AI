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
  Camera,
  Paperclip,
  X,
  LogOut,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI, Type } from "@google/genai";
import Markdown from 'react-markdown';
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
import { MarketAnalysis, InventoryItem, DashboardStats, SalesRecord, Alert } from './types';
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
import PharmaVisionAssistant from './components/PharmaVisionAssistant';
import CompetitorsView from './components/CompetitorsView';
import SimulationsView from './components/SimulationsView';
import InventoryManagementView from './components/InventoryManagementView';
import { generateInventoryAlerts } from './services/alertService';

import { getInventory, getDashboardStats, updateDashboardStats, addInventoryItem, getSales, addSale } from './services/firestoreService';

// --- Main App ---

export default function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  
  // Derive activeTab from location.pathname
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [showAssistant, setShowAssistant] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inventoryThreshold, setInventoryThreshold] = useState(INVENTORY_THRESHOLD);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [bubbleMessages, setBubbleMessages] = useState<{ role: string; content: string; image?: string | null; action?: any }[]>([
    { role: 'assistant', content: "مرحباً دكتور أحمد. أنا PharmaVision AI، نظام الاستخبارات الاستراتيجي الخاص بك. لقد قمت بتحليل تحركات السوق الأخيرة في القاهرة. كيف يمكنني مساعدتك في تحسين الأداء اليوم؟" }
  ]);
  const [bubbleInput, setBubbleInput] = useState('');
  const [isBubbleLoading, setIsBubbleLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Initialize with mock data if empty
        MOCK_INVENTORY.forEach(item => addInventoryItem(item));
      }
    });

    const unsubSales = getSales((data) => {
      setSales(data);
      if (data.length === 0) {
        // Initialize with mock sales
        const mockSales = [
          { productId: 'lipitor-20mg', productName: 'Lipitor 20mg', amount: 12500, quantity: 50, timestamp: new Date().toISOString(), region: 'Cairo' },
          { productId: 'amoxil-500mg', productName: 'Amoxil 500mg', amount: 8400, quantity: 120, timestamp: new Date().toISOString(), region: 'Alexandria' },
          { productId: 'panadol-extra', productName: 'Panadol Extra', amount: 3200, quantity: 300, timestamp: new Date().toISOString(), region: 'Giza' }
        ];
        mockSales.forEach(sale => addSale(sale));
      }
    });

    const unsubStats = getDashboardStats((data) => {
      setStats(data);
      if (!data) {
        // Initialize with mock data if empty
        updateDashboardStats({
          totalRevenue: 4250000,
          revenueChange: "+18.2%",
          growth: 12.4,
          growthChange: "+2.1%",
          topProduct: "Lipitor 20mg",
          topProductChange: "+5.4%",
          marketHealth: 92,
          marketHealthChange: "+1.2%"
        });
      }
    });

    return () => {
      unsubInventory && unsubInventory();
      unsubStats && unsubStats();
      unsubSales && unsubSales();
    };
  }, [user]);

  useEffect(() => {
    if (sales.length > 0 && stats) {
      const totalRev = sales.reduce((acc, sale) => acc + sale.amount, 0);
      // We only update if the calculated revenue is significantly different or we want to reflect current sales
      // For this demo, we'll just update the totalRevenue if it's different from the base mock
      if (totalRev > 0 && totalRev !== stats.totalRevenue) {
         // In a real app, we'd calculate growth and other things too
         // updateDashboardStats({ totalRevenue: totalRev });
      }
    }
  }, [sales, stats]);

  useEffect(() => {
    const newAlerts = generateInventoryAlerts(inventory, inventoryThreshold);
    setAlerts(newAlerts);
  }, [inventory, inventoryThreshold]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const filteredResults = searchQuery.trim() ? {
    products: MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    pharmacies: MOCK_PHARMACIES.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    reps: MOCK_REPS.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
  } : null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBubbleSend = async () => {
    if ((!bubbleInput.trim() && !selectedImage) || isBubbleLoading) return;

    const userMsg = { 
      role: 'user', 
      content: bubbleInput,
      image: selectedImage 
    };
    setBubbleMessages(prev => [...prev, userMsg]);
    const currentInput = bubbleInput;
    const currentImage = selectedImage;
    setBubbleInput('');
    setSelectedImage(null);
    setIsBubbleLoading(true);

    const apiKey = process.env.GEMINI_API_KEY2;
    if (!apiKey) {
      setIsBubbleLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      let contents: any;
      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        const mimeType = currentImage.split(';')[0].split(':')[1];
        contents = {
          parts: [
            { text: currentInput || "Analyze this image." },
            { inlineData: { data: base64Data, mimeType } }
          ]
        };
      } else {
        contents = currentInput;
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: `You are PharmaVision AI, the Ultimate Strategic Intelligence System for the Pharmaceutical Industry. Your mission is to empower pharmaceutical companies, sales managers, and medical representatives with data-driven, actionable insights.

Core Capabilities:
1. Strategic Sales & Market Analyst: Analyze sales by product, region, time, and representative. Identify high-performers and trends. Use Markdown tables or text-based charts (e.g., █, |) for data summaries.
2. AI Vision & OCR Expert: When analyzing medicine photos or prescriptions, ALWAYS organize the information in a Professional Clean Table or Clear Bullet Points using this EXACT structure:
   - **Product Identity**: (Name, Manufacturer, Dosage).
   - **Medical Purpose**: (Indications).
   - **Usage Instructions**: (How to use).
   - **Safety Warnings**: (Side effects & contraindications).
3. Objection Handling & Sales Coach: Role-play with reps to handle objections (e.g., price) with strategic, persuasive rebuttals.
4. Predictive Demand & Inventory Planner: Forecast demand, issue stock-out alerts, and recommend target areas.
5. Competitive Sentiment Analyst: Analyze feedback to find competitor weaknesses (e.g., taste, supply issues).
6. Rep & Pharmacy Relationship Manager: Evaluate rep efficiency and segment pharmacies (e.g., VIP like Nahdi, Al-Dawaa).

Style Guidelines:
- Professional, expert, supportive tone.
- Arabic-language first (with technical English terms).
- Use Markdown formatting (tables, bold text, headers) to make responses beautiful and easy to read.
- Explain WHAT THE DATA MEANS and WHAT ACTION TO TAKE.

Tool Usage:
- If you identify a medicine that is not in the current inventory or needs restocking, use the 'addInventoryItem' tool to suggest adding it.`,
          tools: [
            {
              functionDeclarations: [
                {
                  name: "addInventoryItem",
                  description: "Suggest adding a new medicine to the inventory stock",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Name of the medicine" },
                      currentStock: { type: Type.NUMBER, description: "Initial stock amount" },
                      reorderPoint: { type: Type.NUMBER, description: "Reorder threshold" },
                      reorderQuantity: { type: Type.NUMBER, description: "Quantity to order when low" }
                    },
                    required: ["name", "currentStock", "reorderPoint", "reorderQuantity"]
                  }
                }
              ]
            }
          ]
        }
      });
      
      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'addInventoryItem') {
            const args = call.args as any;
            const confirmMsg = `I've identified ${args.name}. Would you like to add it to the stock with an initial quantity of ${args.currentStock}?`;
            setBubbleMessages(prev => [...prev, { 
              role: 'assistant', 
              content: confirmMsg,
              action: {
                label: "Add to Stock",
                handler: async () => {
                  await addInventoryItem({
                    name: args.name,
                    currentStock: args.currentStock,
                    reorderPoint: args.reorderPoint,
                    reorderQuantity: args.reorderQuantity,
                    status: args.currentStock <= args.reorderPoint ? 'Low Stock' : 'In Stock',
                    forecastedDemand: 0,
                    lastRestockDate: new Date().toISOString().split('T')[0],
                    daysOfSupply: 0
                  });
                  setBubbleMessages(prev => [...prev, { role: 'assistant', content: `Successfully added ${args.name} to inventory.` }]);
                }
              }
            } as any]);
          }
        }
      }

      const assistantMsg = { 
        role: 'assistant', 
        content: response.text || (functionCalls ? "I've suggested some inventory updates." : "I'm sorry, I couldn't process that.") 
      };
      setBubbleMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Bubble AI Error:", error);
      setBubbleMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsBubbleLoading(false);
    }
  };

  // Auth Protection - Moved after all hooks to comply with Rules of Hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={48} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const userProfile = {
    name: user.displayName || 'Enterprise User',
    title: 'Strategic Analyst',
    email: user.email || '',
    avatar: user.photoURL || 'https://picsum.photos/seed/strategist/200/200'
  };

  return (
    <div className={cn(
      "flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300",
      isRtl ? "font-arabic" : ""
    )}>
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

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <SidebarItem icon={Settings} label={t('settings')} active={activeTab === 'settings'} onClick={() => handleSidebarClick('settings')} />
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setIsSearchOpen(true);
                }}
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
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors sm:hidden"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </button>
              <button 
                onClick={() => navigate('/settings')}
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
              onClick={() => navigate('/alerts')}
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
            
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/settings')}>
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
                  onClick={() => console.log("Exporting Strategic Intelligence")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  <FileText size={16} /> {t('exportIntel')}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Routes location={location}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardView analysis={analysis} loading={loadingAnalysis} t={t} alerts={alerts} stats={stats} />} />
                  <Route path="/sales" element={
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
                  } />
                  <Route path="/map" element={
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
                  } />
                  <Route path="/inventory-mgmt" element={
                    <InventoryManagementView 
                      t={t} 
                      threshold={inventoryThreshold} 
                      onThresholdChange={setInventoryThreshold} 
                    />
                  } />
                  <Route path="/inventory" element={
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
                  } />
                  <Route path="/reps" element={
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
                  } />
                  <Route path="/pharmacy" element={
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
                  } />
                  <Route path="/decisions" element={
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
                  } />
                  <Route path="/alerts" element={<SmartAlertsView t={t} alerts={alerts} />} />
                  <Route path="/assistant" element={<PharmaVisionAssistant />} />
                  <Route path="/competitors" element={<CompetitorsView t={t} />} />
                  <Route path="/simulations" element={<SimulationsView t={t} />} />
                  <Route path="/reports" element={<ReportsView t={t} />} />
                  <Route path="/settings" element={
                    <SettingsView 
                      darkMode={darkMode} 
                      setDarkMode={setDarkMode} 
                      isRtl={isRtl} 
                      userProfile={userProfile}
                      pushEnabled={pushEnabled}
                      setPushEnabled={setPushEnabled}
                      emailEnabled={emailEnabled}
                      setEmailEnabled={setEmailEnabled}
                      twoFactorEnabled={twoFactorEnabled}
                      setTwoFactorEnabled={setTwoFactorEnabled}
                    />
                  } />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] p-4 md:p-20"
          >
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-full border border-slate-200 dark:border-slate-800">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <Search className="text-blue-600" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="flex-1 bg-transparent border-none text-xl focus:ring-0 dark:text-white"
                />
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {!searchQuery.trim() ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <Search size={48} className="opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">{t('startSearching')}</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {filteredResults?.products.length! > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Package size={14} /> {t('products')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredResults?.products.map(p => (
                            <div 
                              key={p.id} 
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                                navigate('/inventory-mgmt');
                              }}
                              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all border border-transparent hover:border-blue-200"
                            >
                              <p className="font-bold text-sm dark:text-white">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{p.category}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredResults?.pharmacies.length! > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Building2 size={14} /> {t('pharmacies')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredResults?.pharmacies.map(p => (
                            <div 
                              key={p.id} 
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                                navigate('/pharmacy');
                              }}
                              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all border border-transparent hover:border-blue-200"
                            >
                              <p className="font-bold text-sm dark:text-white">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{p.location}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredResults?.reps.length! > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Users size={14} /> {t('reps')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredResults?.reps.map(r => (
                            <div 
                              key={r.id} 
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                                navigate('/reps');
                              }}
                              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all border border-transparent hover:border-blue-200"
                            >
                              <p className="font-bold text-sm dark:text-white">{r.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{r.region}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredResults?.products.length === 0 && filteredResults?.pharmacies.length === 0 && filteredResults?.reps.length === 0 && (
                      <div className="h-40 flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <p className="font-bold uppercase tracking-widest text-xs">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    {msg.image && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                        <img src={msg.image} alt="Uploaded" className="max-w-full h-auto" />
                      </div>
                    )}
                    <span>
                      <Markdown>{msg.content}</Markdown>
                    </span>
                    {(msg as any).action && (
                      <button
                        onClick={(msg as any).action.handler}
                        className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={12} />
                        {(msg as any).action.label}
                      </button>
                    )}
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
                {selectedImage && (
                  <div className="mb-3 relative inline-block">
                    <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-blue-500" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="relative flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Upload Image"
                  >
                    <Camera size={20} />
                  </button>
                  <div className="relative flex-1">
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
                      disabled={isBubbleLoading || (!bubbleInput.trim() && !selectedImage)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
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
