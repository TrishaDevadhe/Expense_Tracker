import React, { useState } from 'react';

const Insights = ({ expenses, totalSpent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  if (!expenses || expenses.length === 0) return null;

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    // Prepare data to send to AI (we don't send individual items to save tokens, just aggregates)
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const promptContext = `
      Total Spent: ₹${totalSpent}
      Category Breakdown: ${JSON.stringify(categoryTotals)}
    `;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // Fast and capable model
          messages: [{
            role: "system",
            content: "You are a witty but extremely helpful financial advisor. Analyze the user's spending data and give EXACTLY 3 short, punchy bullet points of advice. Use an emoji for each point. Keep it highly specific to the categories they spent the most money on. Do not add any conversational filler like 'Here is your advice'."
          }, {
            role: "user",
            content: `Here is my current filtered spending data:\n${promptContext}`
          }],
          temperature: 0.7,
          max_tokens: 200,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Groq API');
      }

      const data = await response.json();
      const aiText = data.choices[0]?.message?.content || "No insights could be generated.";

      // Split the response into separate strings assuming bullet points
      // We'll clean up empty strings or formatting
      const points = aiText.split('\n').filter(p => p.trim().length > 0).map(p => p.replace(/^[-*]\s*/, '').trim());

      setAiResponse(points);
    } catch (err) {
      console.error(err);
      setError("Oops! My AI brain is offline right now. Check your API key or internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="glass-card p-6 animate-fade-in relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] rounded-full -mr-16 -mt-16 transition-all group-hover:bg-blue-600/10"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 relative z-10 border-b border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Smart AI Advisor
        </h2>

        <button
          onClick={generateInsights}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Analyzing Data...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Ask Smart Advisor
            </>
          )}
        </button>
      </div>

      <div className="relative z-10 w-full mt-4">
        {/* Placeholder before running */}
        {!aiResponse && !isLoading && !error && (
          <div className="flex items-center justify-center text-center gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium shadow-sm w-full min-h-[100px]">
            Ready to analyze your spending data. 
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl shadow-sm border border-red-200 text-red-700 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* The Grid of Insights once loaded */}
        {aiResponse && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiResponse.map((point, index) => (
              <div key={index} className="flex gap-4 items-start p-5 rounded-2xl bg-slate-950/40 border border-slate-800/50 shadow-sm transition-all hover:border-blue-500/30 hover:bg-slate-900/60 group">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></div>
                <p className="text-[13px] font-semibold text-slate-300 leading-relaxed tracking-tight">{point}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Insights;
