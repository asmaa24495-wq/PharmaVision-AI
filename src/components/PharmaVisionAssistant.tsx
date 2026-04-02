import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, TrendingUp, Target, AlertCircle, RefreshCw, X, Camera, Paperclip, Plus } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { MOCK_PRODUCTS, MOCK_REGIONS, MOCK_REPS, MOCK_PHARMACIES, COMPETITOR_DATA } from '../constants';
import { addInventoryItem } from '../services/firestoreService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

const CONTENT = {
  en: {
    title: "PharmaVision AI Assistant",
    status: "Neural Core Online",
    welcome: "Welcome! I am PharmaVision AI, the integrated strategic intelligence system for the pharmaceutical sector. I have analyzed sales data, field team performance, and current market trends. How can I help you maximize profits and optimize performance today?",
    placeholder: "Ask about sales, reps, or market trends...",
    suggestions: [
      "How can I increase sales in Alexandria?",
      "Which representative needs coaching?",
      "Analyze competitor PharmaCorp's growth.",
      "Predict Q2 demand for Product A."
    ],
    analyzing: "Analyzing market data...",
    addToStock: "Add to Stock",
    addedToStock: (name: string) => `Successfully added ${name} to inventory.`,
    confirmAdd: (name: string, amount: number) => `I've identified ${name}. Would you like to add it to the stock with an initial quantity of ${amount}?`,
    uploadImage: "Upload Image",
    resetChat: "Reset Chat",
    error: "I'm experiencing a temporary connection issue with my neural core. Please try again in a moment.",
    user: "User",
    assistant: "Assistant",
    neuralCore: "Neural Core",
    insights: "Strategic Insights",
    criticalIssues: "Critical Issues",
    inventoryUpdateSuggested: "I've suggested some inventory updates.",
    couldNotProcess: "I'm sorry, I couldn't process that request.",
    analyzeImage: "Analyze this image."
  }
};

const PharmaVisionAssistant = () => {
  const dict = CONTENT.en;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: dict.welcome,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API Key is missing");
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const context = `
        You are PharmaVision AI, the Ultimate Strategic Intelligence System for the Pharmaceutical Industry. 
        Your mission is to empower pharmaceutical companies, sales managers, and medical representatives with data-driven, actionable insights.

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
        - English-language first.
        - Use Markdown formatting (tables, bold text, headers) to make responses beautiful and easy to read.
        - Explain WHAT THE DATA MEANS and WHAT ACTION TO TAKE.

        Tool Usage:
        - If you identify a medicine that is not in the current inventory or needs restocking, use the 'addInventoryItem' tool to suggest adding it.

        You have access to the following market data:
        - Products: ${JSON.stringify(MOCK_PRODUCTS)}
        - Regions: ${JSON.stringify(MOCK_REGIONS)}
        - Representatives: ${JSON.stringify(MOCK_REPS)}
        - Pharmacies: ${JSON.stringify(MOCK_PHARMACIES)}
        - Competitors: ${JSON.stringify(COMPETITOR_DATA)}
      `;

      let response: any;
      const config = {
        systemInstruction: context,
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
      };

      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        const mimeType = currentImage.split(';')[0].split(':')[1];
        response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { text: currentInput || dict.analyzeImage },
              { inlineData: { data: base64Data, mimeType } }
            ]
          },
          config
        });
      } else {
        const chat = ai.chats.create({
          model,
          config
        });
        response = await chat.sendMessage({ message: currentInput });
      }
      
      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'addInventoryItem') {
            const args = call.args as any;
            const confirmMsg = dict.confirmAdd(args.name, args.currentStock);
            setMessages(prev => [...prev, { 
              id: (Date.now() + 2).toString(),
              role: 'assistant', 
              content: confirmMsg,
              timestamp: new Date(),
              action: {
                label: dict.addToStock,
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
                  setMessages(prev => [...prev, { 
                    id: (Date.now() + 3).toString(),
                    role: 'assistant', 
                    content: dict.addedToStock(args.name),
                    timestamp: new Date()
                  }]);
                }
              }
            }]);
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || (functionCalls ? dict.inventoryUpdateSuggested : dict.couldNotProcess),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: dict.error,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      dir="ltr"
      className="flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative font-sans"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mt-32 -mr-32" />
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">{dict.title}</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setMessages([{
                id: '1',
                role: 'assistant',
                content: dict.welcome,
                timestamp: new Date()
              }]);
            }}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            title={dict.resetChat}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              msg.role === 'assistant' ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            )}>
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={cn(
              "p-5 rounded-3xl text-sm leading-relaxed shadow-sm",
              msg.role === 'assistant' 
                ? "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none"
                : "bg-blue-600 text-white rounded-tr-none"
            )}>
              {msg.image && (
                <div className="mb-3 rounded-2xl overflow-hidden border border-white/20">
                  <img src={msg.image} alt="Uploaded" className="max-w-full h-auto" />
                </div>
              )}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{msg.content}</Markdown>
              </div>
              {msg.action && (
                <button
                  onClick={msg.action.handler}
                  className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  {msg.action.label}
                </button>
              )}
              <div className={cn(
                "mt-2 text-[10px] opacity-50",
                msg.role === 'user' ? "text-right" : ""
              )}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={20} />
            </div>
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-3xl rounded-tl-none flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-xs font-medium italic">{dict.analyzing}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-10">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <img src={selectedImage} alt="Preview" className="w-32 h-32 object-cover rounded-2xl border-2 border-blue-500 shadow-xl" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-2 shadow-lg hover:bg-rose-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {messages.length === 1 && !selectedImage && (
          <div className="flex flex-wrap gap-2 mb-6">
            {dict.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold rounded-full border border-slate-100 dark:border-slate-800 transition-all flex items-center gap-2"
              >
                <Sparkles size={12} className="text-blue-500" />
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-2xl transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title={dict.uploadImage}
          >
            <Camera size={24} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={dict.placeholder}
              className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 dark:text-white transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmaVisionAssistant;
