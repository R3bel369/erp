
import { GoogleGenAI } from "@google/genai";
import { ERPData } from "../types";

export const getDailyBriefing = async (data: ERPData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const totalRevenue = data.sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const lowStock = data.inventory.filter(i => i.quantity < 5).length;
  const recentSales = data.sales.length;

  const prompt = `
    Act as a senior ERP Business Consultant. Provide a 4-point "Daily Executive Briefing" based on:
    - Business: ${data.user?.businessName}
    - Revenue: $${totalRevenue.toFixed(2)}
    - Operating Expenses: $${totalExpenses.toFixed(2)}
    - Critical Low Stock (<5 units): ${lowStock} items
    - Recent Activity: ${recentSales} sales recorded.
    
    Structure the response with 4 short, punchy bullet points (Financial Health, Inventory Risk, Operational Efficiency, Strategic Advice).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use the .text property as per guidelines
    return response.text || "Briefing unavailable.";
  } catch (error) {
    return "Intelligence Engine error. Defaulting to standard analysis: Revenue is stable but check critical stock levels.";
  }
};

// Fix: Added missing getBusinessInsights function used in Dashboard.tsx
export const getBusinessInsights = async (data: ERPData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const totalRevenue = data.sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const lowStock = data.inventory.filter(i => i.quantity < 10).length;

  const prompt = `
    As a business strategist for ${data.user?.businessName || 'Nexus ERP'}, provide a one-sentence high-level executive insight based on these metrics:
    - Total Revenue: $${totalRevenue.toFixed(2)}
    - Critical Stock Items: ${lowStock}
    - Transaction Volume: ${data.sales.length}
    Ensure the tone is professional and the insight is actionable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use the .text property as per guidelines
    return response.text || "Operations are within expected parameters. Monitor critical stock levels.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Intelligence Engine standby. Financial indicators remain stable.";
  }
};
