import React from 'react';

const Insights = ({ expenses, totalSpent }) => {
  if (!expenses || expenses.length === 0) return null;

  // 🧠 1. Core AI Simulation Logic
  const THRESHOLD = 5000;

  // Mappings
  const categoryTotals = {};
  const categoryCounts = {};

  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
  });

  // Calculate highest spend category
  let topCategory = null;
  let topAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > topAmount) {
      topAmount = amt;
      topCategory = cat;
    }
  }

  // Calculate most frequent category
  let freqCategory = null;
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      freqCategory = cat;
    }
  }

  // 📝 2. Dynamic Insight Strings
  const insightHighest = topCategory 
    ? `You spent the most on ${topCategory} (₹${topAmount.toLocaleString('en-IN')}).` 
    : '';

  const insightThreshold = totalSpent > THRESHOLD
    ? `Your spending is high this month. You have exceeded the ₹${THRESHOLD} threshold.`
    : `Your spending is under control. Great job staying below ₹${THRESHOLD}!`;

  const insightSuggestion = topCategory && totalSpent > 0
    ? `Try reducing your spending on ${topCategory} to boost your savings.`
    : '';

  const insightFrequent = freqCategory && maxCount > 1
    ? `You most frequently spend on ${freqCategory} (${maxCount} transactions).`
    : '';

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-100 mb-8 animate-fade-in relative overflow-hidden">
      
      {/* Decorative AI Sparks Background Icon */}
      <svg className="absolute -right-6 -top-6 w-32 h-32 text-indigo-500/10 rotate-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z" />
      </svg>

      <h2 className="text-xl font-bold text-indigo-900 mb-5 flex items-center gap-2 relative z-10">
        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Smart Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        
        {/* Insight Item 1 */}
        {insightHighest && (
          <div className="flex gap-3 items-start bg-white/60 p-4 rounded-xl shadow-sm border border-indigo-50/50">
            <span className="text-indigo-500 mt-0.5"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></span>
            <p className="text-sm font-medium text-indigo-900">{insightHighest}</p>
          </div>
        )}

        {/* Insight Item 2 */}
        <div className="flex gap-3 items-start bg-white/60 p-4 rounded-xl shadow-sm border border-indigo-50/50">
          <span className={`mt-0.5 ${totalSpent > THRESHOLD ? 'text-rose-500' : 'text-emerald-500'}`}>
            {totalSpent > THRESHOLD ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </span>
          <p className={`text-sm font-medium ${totalSpent > THRESHOLD ? 'text-rose-900' : 'text-emerald-900'}`}>{insightThreshold}</p>
        </div>

        {/* Insight Item 3 */}
        {insightFrequent && (
          <div className="flex gap-3 items-start bg-white/60 p-4 rounded-xl shadow-sm border border-indigo-50/50">
             <span className="text-purple-500 mt-0.5"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></span>
             <p className="text-sm font-medium text-purple-900">{insightFrequent}</p>
          </div>
        )}

        {/* Insight Item 4 */}
        {insightSuggestion && (
          <div className="flex gap-3 items-start bg-white/60 p-4 rounded-xl shadow-sm border border-indigo-50/50">
             <span className="text-blue-500 mt-0.5"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></span>
             <p className="text-sm font-medium text-blue-900">{insightSuggestion}</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Insights;
