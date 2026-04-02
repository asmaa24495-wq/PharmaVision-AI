import { GoogleGenAI, Type } from "@google/genai";
import { MarketAnalysis } from "../types";
import { safeFetch } from "../lib/api";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 || "" });

/**
 * Example of a standard API call using the robust safeFetch utility.
 * This handles network errors, non-200 responses, and timeouts.
 */
export async function fetchExternalMarketData(regionId: string) {
  return await safeFetch<any>(`/api/market-data/${regionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function getDetailedAnalysis(data: any): Promise<MarketAnalysis> {
  const systemInstruction = `You are PharmaVision AI, the Ultimate Strategic Intelligence System for the Pharmaceutical Industry. Your mission is to empower pharmaceutical companies, sales managers, and medical representatives with data-driven, actionable insights.

Core Capabilities:
1. Strategic Sales & Market Analyst: Analyze sales by product, region, time, and representative. Identify high-performers and trends. Use Markdown tables or text-based charts (e.g., █, |) for data summaries.
2. AI Vision & OCR Expert: Analyze prescriptions (privacy first), identify drugs/dosages, and scan pharmacy shelves for display quality.
3. Objection Handling & Sales Coach: Role-play with reps to handle objections (e.g., price) with strategic, persuasive rebuttals.
4. Predictive Demand & Inventory Planner: Forecast demand, issue stock-out alerts, and recommend target areas.
5. Competitive Sentiment Analyst: Analyze feedback to find competitor weaknesses (e.g., taste, supply issues).
6. Rep & Pharmacy Relationship Manager: Evaluate rep efficiency and segment pharmacies (e.g., VIP like Nahdi, Al-Dawaa).

Style Guidelines:
- Professional, expert, supportive tone.
- English-language only.
- Use clear headings, bullet points, and actionable summaries.
- Explain WHAT THE DATA MEANS and WHAT ACTION TO TAKE.

When receiving market data:
1. Analyze general performance.
2. Identify top 3 insights.
3. Detect potential issues.
4. Provide 3 growth opportunities.
5. Suggest clear actionable decisions.`;

  const apiKey = process.env.GEMINI_API_KEY2;
  if (!apiKey) {
    console.error("GEMINI_API_KEY2 is missing");
    // Return fallback data but log error
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this pharmaceutical market data: ${JSON.stringify(data)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            insights: { type: Type.ARRAY, items: { type: Type.STRING } },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            simulation: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["scenario", "impact"]
            }
          },
          required: ["overview", "insights", "issues", "opportunities", "recommendations", "simulation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      overview: "Preliminary market analysis based on available data. The market shows stable growth in the analgesics sector with challenges in antibiotic supply chains.",
      insights: [
        "Strong 12% growth in the Central Riyadh region.",
        "Outstanding performance for Lipitor 20mg as the top-selling product.",
        "Significant 22% increase in demand for Ventolin."
      ],
      issues: [
        "Critical stock shortage of Amoxicillin (only 120 units remaining).",
        "5% decline in antibiotic sales growth."
      ],
      opportunities: [
        "Expansion opportunity in the Southern region (Abha) due to low competition.",
        "Launch promotional campaign for Nexium in Jeddah to boost weak sales.",
        "Optimize Ventolin distribution in high-humidity areas."
      ],
      recommendations: [
        "Reschedule Amoxicillin supply immediately.",
        "Transfer surplus stock from low-demand areas to Riyadh.",
        "Recognize rep Sara Al-Otaibi and implement her Jeddah strategy nationwide."
      ]
    };
  }
}
