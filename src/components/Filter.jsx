import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Food & Drink', 'Transport', 'Housing', 'Health', 
  'Entertainment', 'Shopping', 'Education', 'Other'
];

const Filter = ({ filterCategory, setFilterCategory, startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="flex flex-col gap-6 w-full lg:w-auto">
      {/* Quick Filters Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar -mx-2 px-2 mask-fade-right lg:mask-none">
        {[
          { label: 'Today', id: 'today' },
          { label: 'Last 7 Days', id: '7days' },
          { label: 'This Month', id: 'month' },
          { label: 'Custom', id: 'custom' }
        ].map(qf => {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          
          let isActive = false;
          if (qf.id === 'today') {
            isActive = startDate === today && endDate === today;
          } else if (qf.id === '7days') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];
            isActive = startDate === sevenDaysStr && endDate === today;
          } else if (qf.id === 'month') {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            isActive = startDate === firstDay && endDate === today;
          } else if (qf.id === 'custom') {
            // Active if dates are set but don't match standard presets
            isActive = startDate && endDate && !['today', '7days', 'month'].some(id => {
               if (id === 'today') return startDate === today && endDate === today;
               if (id === '7days') {
                 const d = new Date(); d.setDate(new Date().getDate() - 7);
                 return startDate === d.toISOString().split('T')[0] && endDate === today;
               }
               if (id === 'month') {
                 const d = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                 return startDate === d.toISOString().split('T')[0] && endDate === today;
               }
               return false;
            });
          }
            
          return (
            <motion.button
              key={qf.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                if (qf.id === 'today') {
                  setStartDate(today);
                  setEndDate(today);
                } else if (qf.id === '7days') {
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(now.getDate() - 7);
                  setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
                  setEndDate(today);
                } else if (qf.id === 'month') {
                  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                  setStartDate(firstDay);
                  setEndDate(today);
                } else if (qf.id === 'custom') {
                  setStartDate('');
                  setEndDate('');
                }
              }}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-[0_5px_15px_rgba(37,99,235,0.3)]' 
                  : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-blue-500/50'
              }`}
            >
              {qf.label}
            </motion.button>
          )
        })}
      </div>

      <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-6 justify-end">
        {/* Category Filter */}
        <div className="flex items-center gap-4">
          <div className="relative w-full xl:w-56 group/select">
            <motion.select
              whileFocus={{ scale: 1.01 }}
              id="filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none pl-5 pr-12 py-3.5 bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] focus:bg-white dark:focus:bg-white/20 focus:border-blue-500/40 outline-none transition-all cursor-pointer text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-white/20 shadow-sm"
            >
              <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                 <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" key={cat} value={cat}>{cat}</option>
              ))}
            </motion.select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500 group-focus-within/select:text-blue-600 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col gap-2">
          <div className={`flex items-center gap-2 bg-slate-100 dark:bg-white/10 p-2 rounded-[1.5rem] border transition-all shadow-sm group/range ${
            startDate && endDate && new Date(startDate) > new Date(endDate) 
              ? 'border-red-500/50 bg-red-500/5 ring-4 ring-red-500/5' 
              : 'border-slate-300 dark:border-white/10 focus-within:border-blue-500/40 focus-within:ring-4 focus-within:ring-blue-500/5'
          }`}>
            <div className="flex flex-col px-3 py-1">
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">From</span>
              <input 
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none p-0 text-[10px] font-bold uppercase tracking-widest focus:ring-0 outline-none text-slate-700 dark:text-slate-300 w-28 cursor-pointer"
              />
            </div>
            
            <div className="w-px h-8 bg-slate-200 dark:bg-white/10 shrink-0"></div>
            
            <div className="flex flex-col px-3 py-1">
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">To</span>
              <input 
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none p-0 text-[10px] font-bold uppercase tracking-widest focus:ring-0 outline-none text-slate-700 dark:text-slate-300 w-28 cursor-pointer"
              />
            </div>
            
            <AnimatePresence>
              {(startDate || endDate || filterCategory !== 'All') && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setFilterCategory('All');
                  }}
                  className="p-2 text-slate-400 dark:text-slate-600 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 transition-all flex items-center justify-center mr-1 shadow-sm ml-2"
                  title="Clear all filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {startDate && endDate && new Date(startDate) > new Date(endDate) && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-[9px] font-black uppercase tracking-wider pl-4"
            >
              Invalid Range: 'To' date is before 'From' date
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
