export default async function handler(req, res) {
  // 1. Check Method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    const { expenses, totalSpent } = req.body;

    // 2. Validate Configuration
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing in Vercel settings." });
    }

    if (!expenses || expenses.length === 0) {
      return res.status(400).json({ error: "No expense data provided." });
    }

    // 3. Prepare Prompt
    const categoryTotals = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const promptContext = `Total Spent: ₹${totalSpent}. Breakdown: ${JSON.stringify(categoryTotals)}`;

    // 4. Call Groq API via Fetch (More stable for Vercel Functions)
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a witty financial advisor. Give EXACTLY 3 short, punchy bullet points of advice with emojis. No conversational filler."
          },
          {
            role: "user",
            content: `Analyze this spending: ${promptContext}`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      throw new Error(`Groq API Error: ${groqResponse.status} - ${errorText}`);
    }

    const data = await groqResponse.json();
    const aiText = data.choices[0]?.message?.content || "";
    
    // 5. Format Response
    const points = aiText
      .split("\n")
      .filter((p) => p.trim().length > 0)
      .map((p) => p.replace(/^[-*]\s*/, "").trim());

    res.status(200).json({ insights: points });
  } catch (error) {
    console.error("CRASH LOG:", error);
    res.status(500).json({ 
      error: "Backend Crash", 
      message: error.message 
    });
  }
}
