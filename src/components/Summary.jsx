import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const Summary = ({ 
  type,
  totalSpent = 0, 
  totalIncome = 0, 
  budget = 0, 
  onUpdateBudget, 
  filterCategory = 'All',
  currencySymbol = '₹',
  delay = 0
}) => {
  const [localBudget, setLocalBudget] = useState(budget);

  useEffect(() => {
    setLocalBudget(budget);
  }, [budget]);

  const savings = totalIncome - totalSpent;
  const remaining = budget - totalSpent;
  const isOverBudget = remaining < 0;

  const formatCurrency = (val) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const Label = ({ children }) => (
    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.3em] mb-2 block">
      {children}
    </span>
  );

  const Value = ({ children, className = "" }) => (
    <div className={`text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter ${className}`}>
      <span className="text-xl text-slate-400 dark:text-slate-500 mr-1 font-bold">{currencySymbol}</span>
      {children}
    </div>
  );

  if (type === 'top-income') {
    return (
      <GlassCard delay={delay} className="p-7 overflow-hidden relative">
        <div className="flex justify-between items-center">
          <div>
            <Label>Total Income</Label>
            <Value className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{formatCurrency(totalIncome)}</Value>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (type === 'top-expenses') {
    return (
      <GlassCard delay={delay} className="p-7 overflow-hidden relative">
        <div className="flex justify-between items-center">
          <div>
            <Label>{filterCategory === 'All' ? 'Total Expenses' : `${filterCategory}`}</Label>
            <Value className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]">{formatCurrency(totalSpent)}</Value>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (type === 'savings') {
    return (
      <GlassCard delay={delay} className="p-7">
        <Label>Net Savings</Label>
        <Value className={savings >= 0 ? 'text-emerald-400' : 'text-red-400'}>
          {savings < 0 ? '-' : ''}{formatCurrency(Math.abs(savings))}
        </Value>
      </GlassCard>
    );
  }

  if (type === 'budget') {
    return (
      <GlassCard delay={delay} className="p-7">
        <Label>Monthly Budget</Label>
        <div className="flex items-center gap-1 group/input">
          <span className="text-xl font-bold text-slate-500 opacity-40">{currencySymbol}</span>
          <input 
            type="number" 
            value={localBudget} 
            onChange={(e) => setLocalBudget(e.target.value)}
            onBlur={(e) => onUpdateBudget(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
            className="bg-transparent text-slate-900 dark:text-white font-black text-3xl sm:text-4xl outline-none w-full border-b-2 border-transparent focus:border-blue-500/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none tracking-tighter"
          />
        </div>
      </GlassCard>
    );
  }

  if (type === 'remaining') {
    return (
      <GlassCard delay={delay} className={`p-7 ${isOverBudget ? 'bg-red-500/5 border-red-500/30' : ''}`}>
        <Label>Remaining</Label>
        <Value className={isOverBudget ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'}>
          {formatCurrency(remaining)}
        </Value>
        {isOverBudget && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-red-400 uppercase tracking-widest"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            Limit Exceeded
          </motion.div>
        )}
      </GlassCard>
    );
  }

  return null;
};

export default Summary;
