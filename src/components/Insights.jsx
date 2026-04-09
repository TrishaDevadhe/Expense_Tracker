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

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          expenses,
          totalSpent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch from AI Advisor');
      }

      const data = await response.json();
      setAiResponse(data.insights);
    } catch (err) {
      console.error(err);
      setError("Oops! My AI brain is offline right now. Our team has been notified.");
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
