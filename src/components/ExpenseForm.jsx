import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

const CATEGORIES = [
  'Food & Drink', 'Transport', 'Housing', 'Health', 
  'Entertainment', 'Shopping', 'Education', 'Other'
];

const ExpenseForm = ({ 
  amount, setAmount, category, setCategory, 
  date, setDate, note, setNote, 
  selectedCurrency, setSelectedCurrency,
  errors, successMessage, handleAddExpense, editingId, handleCancelEdit,
  currencies
}) => {
  return (
    <GlassCard className="p-5 sm:p-6 flex flex-col border-white/5 relative overflow-hidden group/form" hover={false} delay={0.3}>
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mt-16 blur-3xl group-hover/form:bg-blue-500/20 transition-all duration-700"></div>
      
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-300 dark:border-white/10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            {editingId ? (
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            )}
          </div>
          <span className="tracking-tight">{editingId ? 'Update Record' : 'Log Transaction'}</span>
        </h2>
        <AnimatePresence>
          {successMessage && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest shadow-sm"
            >
              {successMessage}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <form className="flex flex-col gap-4 flex-1" onSubmit={handleAddExpense}>
        {/* AMOUNT & CURRENCY */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-[0.3em] pl-1" htmlFor="amount">Amount & Currency</label>
          <div className="flex gap-4">
            <div className="relative flex-1 group/input">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 font-black text-base group-focus-within/input:text-blue-600 transition-colors">
                {currencies[selectedCurrency]?.symbol || '₹'}
              </span>
              <motion.input 
                whileFocus={{ scale: 1.01 }}
                type="number" 
                id="amount" 
                step="0.01" 
                placeholder="0.00"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-12 pr-5 py-3 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/20 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 hover:border-blue-500/30 ${errors.amount ? 'border-red-500/40 focus:border-red-500/40 bg-red-500/5' : ''}`}
              />
            </div>
            
            <motion.select 
              whileFocus={{ scale: 1.01 }}
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-24 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none p-3 focus:bg-white dark:focus:bg-white/20 focus:border-blue-500/40 hover:border-slate-300 dark:hover:border-white/20 transition-all appearance-none text-center cursor-pointer"
            >
              {Object.keys(currencies).map(curr => (
                <option key={curr} value={curr} className="bg-white dark:bg-slate-900">{curr}</option>
              ))}
            </motion.select>
          </div>
          {errors.amount && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide pl-2">{errors.amount}</p>}
        </div>

        {/* CATEGORY GRID */}
        <div className="flex flex-col gap-4">
          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-[0.3em] pl-1" htmlFor="category">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                type="button"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 gap-1.5 min-h-[85px] ${
                  category === cat 
                    ? 'bg-blue-600/10 border-blue-500 text-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/20' 
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:border-blue-500/30 hover:shadow-lg'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${category === cat ? 'bg-blue-600/10' : 'bg-slate-200/50 dark:bg-white/5'}`}>
                  {cat === 'Food & Drink' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                  {cat === 'Transport' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                  {cat === 'Housing' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                  {cat === 'Health' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                  {cat === 'Entertainment' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4v-3a2 2 0 00-2-2H5z" /></svg>}
                  {cat === 'Shopping' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                  {cat === 'Education' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.066a11.952 11.952 0 00-6.825-2.948 12.083 12.083 0 01.665-6.479L12 14z" /></svg>}
                  {cat === 'Other' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>}
                </div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider leading-[1.6] text-center px-1 pb-3 mt-1">{cat}</span>
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {errors.category && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wide pl-2"
              >
                {errors.category}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* DATE & NOTE */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-[0.3em] pl-1" htmlFor="date">Date</label>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="date" 
              id="date" 
              max={new Date().toISOString().split('T')[0]}
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl outline-none transition-all text-xs font-bold text-slate-900 dark:text-white hover:border-blue-500/30 focus:bg-white dark:focus:bg-white/20 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 ${errors.date ? 'border-red-500/40 focus:border-red-500/40 bg-red-500/5' : ''}`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-[0.3em] pl-1" htmlFor="note">Reference</label>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="text" 
              id="note" 
              placeholder="E.g. Coffee" 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-xs font-bold text-slate-900 dark:text-white hover:border-blue-500/30 focus:bg-white dark:focus:bg-white/20 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 mt-auto pt-6">
          <motion.button 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 text-white bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_10px_30px_rgba(37,99,235,0.3)] font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl transition-all flex items-center justify-center gap-3 active:shadow-inner"
          >
            {editingId ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4h16v16H4V4z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            )}
            {editingId ? 'Update Record' : 'Add Transaction'}
          </motion.button>
          
          <AnimatePresence>
            {editingId && (
              <motion.button 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                whileHover={{ scale: 1.02, bg: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancelEdit}
                className="w-full py-4 bg-white/5 text-slate-400 border border-white/5 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:text-white transition-all overflow-hidden"
              >
                Cancel Edit
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </GlassCard>
  );
};

export default ExpenseForm;
