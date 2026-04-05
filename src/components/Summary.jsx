import React from 'react';

const Summary = ({ filterCategory, totalSpent, highestCategory }) => {
  return (
    <div className="glass-card p-4 flex flex-col items-start min-w-[200px] transition-all relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {filterCategory === 'All' ? 'Total Portfolio Spend' : `${filterCategory} Total`}
      </span>
      <span className="text-4xl font-black text-white tracking-tighter">
        ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        <span className="text-lg font-medium text-slate-500 ml-1">.{(totalSpent % 1).toFixed(2).split('.')[1]}</span>
      </span>
      
      {highestCategory && filterCategory === 'All' && (
        <span className="mt-2 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md animate-fade-in flex items-center gap-1 shadow-sm border border-slate-700">
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Highest: {highestCategory}
        </span>
      )}
    </div>
  );
};

export default Summary;
