const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Groq } = require('groq-sdk');

dotenv.config({ path: '../.env' }); // Load .env from root

const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors());
app.use(express.json());

// Initialize Groq SDK
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post('/api/analyze-expenses', async (req, res) => {
    try {
        const { expenses } = req.body;

        if (!expenses || !Array.isArray(expenses)) {
            return res.status(400).json({ error: 'Expenses array is required' });
        }

        // 1. Format data for the prompt
        // We aggregate by category to keep the prompt clean and effective
        const categoryTotals = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});

        const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        
        let contextString = `Total Spent: ₹${totalSpent}\n`;
        for (const [cat, amt] of Object.entries(categoryTotals)) {
            contextString += `- ${cat}: ₹${amt}\n`;
        }

        // 2. Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional but witty financial advisor. Analyze the user's spending data and provide EXACTLY 3 short, actionable suggestions to save money or optimize spending. Each suggestion MUST start with a relevant emoji. Use a clear and punchy tone. Do NOT include any intro or outro text."
                },
                {
                    role: "user",
                    content: `Here is my current spending data:\n${contextString}\nGive me 3 smart suggestions.`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "";
        
        // Split into bullet points by newline, cleaning up markers like "1.", "-", "*"
        const insights = aiResponse
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^(\d+\.|-|[*])\s*/, '').trim())
            .slice(0, 3);

        res.json({ insights });
    } catch (error) {
        console.error('Groq API Error:', error);
        res.status(500).json({ error: 'Unable to fetch insights. Try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 ExpenseIQ Backend running at http://localhost:${PORT}`);
});
