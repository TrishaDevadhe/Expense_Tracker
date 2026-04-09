import React, { useState } from 'react';

const SmartAdvisor = ({ expenses }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!expenses || expenses.length === 0) {
      setError("Please add some expenses first! 💸");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const response = await fetch("http://127.0.0.1:5010/api/analyze-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ expenses })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from backend');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAiResponse(data.insights || []);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch insights. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="glass-card p-6 animate-fade-in relative overflow-hidden group">
      {/* Decorative gradient background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] rounded-full -mr-16 -mt-16 transition-all group-hover:bg-blue-600/10"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 relative z-10 border-b border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Smart AI Advisor
        </h2>

        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Ask Smart Advisor
            </>
          )}
        </button>
      </div>

      <div className="relative z-10 w-full mt-2">
        {/* Placeholder / Welcome state */}
        {!aiResponse && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-700/50">
            <p className="text-slate-400 text-sm font-medium">
              Click the button above to get personalized AI driven spending tips!
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium animate-pulse">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* The Grid of Insights once loaded */}
        {aiResponse && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiResponse.map((point, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-950/40 border border-slate-800/50 shadow-sm transition-all hover:border-blue-500/30 hover:bg-slate-900/60 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Suggestion {index + 1}</span>
                </div>
                <p className="text-[14px] font-medium text-slate-200 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SmartAdvisor;
