import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Label } from 'recharts';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const COLORS = [
  { start: '#3b82f6', end: '#60a5fa' }, // Blue
  { start: '#8b5cf6', end: '#a78bfa' }, // Violet
  { start: '#06b6d4', end: '#22d3ee' }, // Cyan
  { start: '#6366f1', end: '#818cf8' }, // Indigo
  { start: '#2dd4bf', end: '#5eead4' }, // Teal
  { start: '#ec4899', end: '#f472b6' }, // Pink
  { start: '#f59e0b', end: '#fbbf24' }, // Amber
  { start: '#10b981', end: '#34d399' }, // Emerald
];

const ExpenseBarChart = ({ expenses, displayCurrency, currencySymbol, convertToBase, convertFromBase, isDarkMode }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <GlassCard className="p-12 h-full flex flex-col items-center justify-center min-h-[600px]" delay={0.4}>
        <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8 border border-slate-200 dark:border-white/5 shadow-inner">
          <svg className="w-10 h-10 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Analytics Unavailable</h2>
        <p className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Log transactions to reveal insights</p>
      </GlassCard>
    );
  }

  const dataMap = expenses.reduce((acc, expense) => {
    const inBase = convertToBase(expense.amount, expense.currency || 'INR');
    const inDisplay = convertFromBase(inBase, displayCurrency);
    acc[expense.category] = (acc[expense.category] || 0) + inDisplay;
    return acc;
  }, {});

  const data = Object.entries(dataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const renderTooltipFormatter = (value) => {
    return [`${currencySymbol}${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 'Total Spent'];
  };

  return (
    <GlassCard className="p-10 h-full flex flex-col relative overflow-hidden group/chart" delay={0.4} hover={false}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
            Spending Intelligence
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Visualizing resource allocation</p>
        </div>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.3em] bg-blue-500/10 dark:bg-blue-500/20 px-5 py-2 rounded-full border border-blue-500/20 dark:border-blue-500/30 shadow-sm"
        >
          Real-time Engine
        </motion.div>
      </div>
      
      <div className="flex-1 w-full min-h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color.start} stopOpacity={1} />
                  <stop offset="100%" stopColor={color.end} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="5 5" stroke={isDarkMode ? "#ffffff" : "#000000"} vertical={false} opacity={isDarkMode ? 0.08 : 0.1} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#000000', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} 
              interval={0}
              dy={15}
            >
              <Label value="Categories" offset={-25} position="insideBottom" fill="#000000" fontSize={13} fontWeight={900} />
            </XAxis>
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#000000', fontSize: 13, fontWeight: 800 }}
              tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
            >
              <Label value={`Amount (${currencySymbol})`} angle={-90} position="insideLeft" offset={0} style={{ textAnchor: 'middle', fill: '#000000', fontSize: 13, fontWeight: 900 }} />
            </YAxis>
            <Tooltip 
              cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', radius: 12 }}
              contentStyle={{ 
                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', 
                backdropFilter: 'blur(20px)',
                color: isDarkMode ? '#F9FAFB' : '#111827', 
                borderRadius: '24px', 
                border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '16px 20px',
                borderBottom: '4px solid #3b82f6'
              }}
              itemStyle={{ fontWeight: 'bold', fontSize: '15px', color: isDarkMode ? '#F9FAFB' : '#111827' }}
              labelStyle={{ color: isDarkMode ? '#E5E7EB' : '#374151', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              formatter={renderTooltipFormatter}
            />
            <Bar 
              dataKey="value" 
              radius={[12, 12, 4, 4]} 
              animationDuration={2500}
              animationBegin={200}
              maxBarSize={60}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#barGradient-${index % COLORS.length})`}
                  style={{ filter: isDarkMode ? 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' : 'drop-shadow(0 5px 5px rgba(0,0,0,0.05))' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default ExpenseBarChart;
