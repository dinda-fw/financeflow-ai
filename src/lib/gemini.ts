import { GoogleGenAI } from '@google/genai';

export async function parseReceiptWithAI(apiKey: string, base64Image: string) {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const base64Data = base64Image.split(',')[1] || base64Image;
    const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toISOString();

    const prompt = `Analyze this receipt image. It is currently ${currentDate}.
Extract the following information and return it strictly as a JSON object (no markdown, no backticks, just the JSON string):
{
  "merchant": "Name of the store",
  "amount": Total amount as a number,
  "category": "Needs" OR "Wants" OR "Savings" based on the items,
  "item_summary": "Short summary of what was bought (2-4 words)",
  "ai_advice": "A short, witty, realistic financial coaching quote explaining the impact of this purchase."
}
Make sure dates are assumed to be current year ${currentYear} if omitted on the receipt.`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType,
          },
        },
      ],
    });

    const text = response.text || '';
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
    
  } catch (error) {
    console.error("AI parse error:", error);
    throw error;
  }
}

export async function generateFinancialInsights(apiKey: string, transactions: any[], budgets: any[], goals: any[]) {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Anonymize and compress data for the prompt
    const dataStr = JSON.stringify({
      txs: transactions.map(t => ({ a: t.amount, c: t.category })),
      budgets: budgets.map(b => ({ n: b.name, s: b.spent, l: b.limit })),
      goals: goals.map(g => ({ n: g.name, c: g.currentAmount, t: g.targetAmount }))
    });

    const prompt = `You are an expert, strict, and highly sarcastic but helpful financial advisor.
Analyze this financial data (in IDR):
${dataStr}

Based on the budgets, expenses, and goals, generate exactly 3 insights in Bahasa Indonesia:
1. "money_leak": Detect where they are wasting money or close to limits. Give a strict warning.
2. "actionable_advice": Give one highly actionable advice on how to reach their goals faster by cutting specific expenses.
3. "upcoming_bills": Remind them to keep a certain amount in their main account for general survival or specific goals.

Return ONLY a valid JSON object in this format (no markdown, no backticks, just raw JSON):
{
  "money_leak": "Peringatan...",
  "actionable_advice": "Saran...",
  "upcoming_bills": "Pengingat..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash-latest',
      contents: prompt,
    });

    const text = response.text || '';
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI insights error:", error);
    throw error;
  }
}
