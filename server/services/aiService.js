const { ChatGroq } = require("@langchain/groq");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StructuredOutputParser } = require("@langchain/core/output_parsers");
const { z } = require("zod");

const parseInvoice = async (text) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      merchantName: z.string().describe("The name of the store or place of purchase"),
      totalAmount: z.number().describe("The definitive grand total of the invoice. Ignore line items."),
      date: z.string().describe("The transaction date (YYYY-MM-DD). If not found, use Today's date."),
      category: z.string().describe("Suggested category: Food, Shopping, Transport, Utilities, Fun, Health, etc."),
      currency: z.string().describe("Valid ISO currency code (USD, INR, EUR, etc). If unclear, strictly use 'INR'."),
    })
  );

  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Extract the following information from the invoice text provided below.\n{format_instructions}\nInvoice Text:\n{invoice_text}",
    inputVariables: ["invoice_text"],
    partialVariables: { format_instructions: formatInstructions },
  });

  const input = await prompt.format({ invoice_text: text });
  
  try {
    const response = await model.invoke(input);
    return await parser.parse(response.content);
  } catch (e) {
    console.error("Failed to parse Groq response:", e);
    return null;
  }
};

const generateFinancialInsights = async (expenses, income, budget) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: "llama-3.1-8b-instant", // Or whatever model is preferred
    temperature: 0.7,
  });

  const categoryTotals = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const context = `
    Total Spent: ${expenses.reduce((s, e) => s + e.amount, 0)}
    Total Income: ${income.reduce((s, i) => s + i.amount, 0)}
    Monthly Budget: ${budget}
    Category Breakdown: ${JSON.stringify(categoryTotals)}
  `;

  const prompt = `
    You are a high-level personal financial strategist. Analyze the following user financial data:
    
    DATA:
    ${context}

    Your goal is to provide EXACTLY 3 powerful, actionable insights. 
    Focus on:
    1. **Spending Analysis**: Analyze their spending velocity relative to their budget and income.
    2. **Savings Suggestions**: Specific, high-impact suggestions to increase saving efficiency.
    3. **Unusual Spending Detection**: Detect recurring spikes or anomalies in specific categories.

    CRITICAL REQUIREMENTS:
    - You MUST output exactly 3 lines, with one insight per line.
    - DO NOT include any introductory or concluding text (e.g., "Here are your insights:").
    - DO NOT start lines with hyphens, asterisks, or numbers.
    - Each insight MUST begin with a relevant emoji.
    - Keep advice concise, professional, and data-driven.
  `;

  try {
    const response = await model.invoke(prompt);
    return response.content
      .split("\n")
      .filter((p) => p.trim().length > 10) // Filter out small/empty lines
      .map((p) => p.replace(/^[-*0-9.)]+\s*/, "").trim());
  } catch (e) {
    console.error("AI Insights Error:", e);
    return ["Could not generate insights at this time."];
  }
};

module.exports = { parseInvoice, generateFinancialInsights };
