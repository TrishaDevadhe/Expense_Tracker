import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Preset color palette for the distinct categories
const COLORS = [
  '#4f46e5', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#14b8a6', // Teal
];

const ExpenseChart = ({ expenses }) => {
  // Graceful empty state hide
  if (!expenses || expenses.length === 0) return null;

  // 1. Group by category and sum up amounts based on the filtered array passed in
  const dataMap = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // 2. Convert raw map to Recharts format: [ { category: 'Food', total: 100 } ] and sort highest spend first
  const data = Object.entries(dataMap)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  // Y-Axis string formatting
  const formatYAxis = (tickItem) => `₹${tickItem}`;

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-shadow hover:shadow-md animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Spending Distribution
      </h2>
      
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
            <XAxis 
              dataKey="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
              dy={10} 
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
              dx={-10}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Total Spent']}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={60} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ExpenseChart;
