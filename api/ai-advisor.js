import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { expenses, totalSpent } = req.body;

    if (!expenses || expenses.length === 0) {
      return res.status(400).json({ error: "No expense data provided" });
    }

    // Prepare data (same logic as before, but on the server)
    const categoryTotals = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const promptContext = `
      Total Spent: ₹${totalSpent}
      Category Breakdown: ${JSON.stringify(categoryTotals)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a witty but extremely helpful financial advisor. Analyze the user's spending data and give EXACTLY 3 short, punchy bullet points of advice. Use an emoji for each point. Keep it highly specific to the categories they spent the most money on. Do not add any conversational filler like 'Here is your advice'."
        },
        {
          role: "user",
          content: `Here is my current filtered spending data:\n${promptContext}`
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 200,
    });

    const aiText = chatCompletion.choices[0]?.message?.content || "No insights could be generated.";
    
    // Split the response into points (consistent with frontend logic)
    const points = aiText
      .split("\n")
      .filter((p) => p.trim().length > 0)
      .map((p) => p.replace(/^[-*]\s*/, "").trim());

    res.status(200).json({ insights: points });
  } catch (error) {
    console.error("AI Advisor Error:", error);
    res.status(500).json({ 
      error: "Failed to generate financial insights",
      details: error.message 
    });
  }
}
