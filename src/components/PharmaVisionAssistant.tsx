import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, TrendingUp, Target, AlertCircle, RefreshCw, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { MOCK_PRODUCTS, MOCK_REGIONS, MOCK_REPS, MOCK_PHARMACIES, COMPETITOR_DATA } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PharmaVisionAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "مرحباً بك! أنا PharmaVision AI، نظام الاستخبارات الاستراتيجي المتكامل لقطاع الأدوية. لقد قمت بتحليل بيانات المبيعات، أداء الفريق الميداني، واتجاهات السوق الحالية. كيف يمكنني مساعدتك في تعظيم الأرباح وتحسين الأداء اليوم؟",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const apiKey = process.env.GEMINI_API_KEY2;
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
        2. AI Vision & OCR Expert: Analyze prescriptions (privacy first), identify drugs/dosages, and scan pharmacy shelves for display quality.
        3. Objection Handling & Sales Coach: Role-play with reps to handle objections (e.g., price) with strategic, persuasive rebuttals.
        4. Predictive Demand & Inventory Planner: Forecast demand, issue stock-out alerts, and recommend target areas.
        5. Competitive Sentiment Analyst: Analyze feedback to find competitor weaknesses (e.g., taste, supply issues).
        6. Rep & Pharmacy Relationship Manager: Evaluate rep efficiency and segment pharmacies (e.g., VIP like Nahdi, Al-Dawaa).

        Style Guidelines:
        - Professional, expert, supportive tone.
        - Arabic-language first (with technical English terms).
        - Use clear headings, bullet points, and actionable summaries.
        - Explain WHAT THE DATA MEANS and WHAT ACTION TO TAKE.

        You have access to the following market data:
        - Products: ${JSON.stringify(MOCK_PRODUCTS)}
        - Regions: ${JSON.stringify(MOCK_REGIONS)}
        - Representatives: ${JSON.stringify(MOCK_REPS)}
        - Pharmacies: ${JSON.stringify(MOCK_PHARMACIES)}
        - Competitors: ${JSON.stringify(COMPETITOR_DATA)}
      `;

      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: context,
        },
      });

      const response = await chat.sendMessage({ message: input });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm experiencing a temporary connection issue with my neural core. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "How can I increase sales in Alexandria?",
    "Which representative needs coaching?",
    "Analyze competitor PharmaCorp's growth.",
    "Predict Q2 demand for Product A."
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32" />
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">PharmaVision AI Assistant</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Core Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setMessages([{
                id: '1',
                role: 'assistant',
                content: "مرحباً بك! أنا PharmaVision AI، نظام الاستخبارات الاستراتيجي المتكامل لقطاع الأدوية. لقد قمت بتحليل بيانات المبيعات، أداء الفريق الميداني، واتجاهات السوق الحالية. كيف يمكنني مساعدتك في تعظيم الأرباح وتحسين الأداء اليوم؟",
                timestamp: new Date()
              }]);
            }}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
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
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {msg.content}
              </div>
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
              <span className="text-xs font-medium italic">Analyzing market data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-10">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestions.map((s, i) => (
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
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about sales, reps, or market trends..."
              className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 dark:text-white transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
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
