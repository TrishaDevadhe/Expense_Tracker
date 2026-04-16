import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpenseList = ({ expenses, sortedExpenses, handleDeleteExpense, handleEditExpense, displayCurrency, currencySymbol, currencies }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderEmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-24 text-center flex flex-col items-center justify-center w-full px-4"
    >
      <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-slate-200 dark:border-white/5 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {expenses.length === 0 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          )}
        </svg>
      </div>
      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
        {expenses.length === 0 ? "No records found" : "No matches found"}
      </p>
      <p className="text-sm text-slate-500 mt-2 max-w-[280px] font-bold leading-relaxed opacity-60">
        {expenses.length === 0 
          ? "Start building your history by logging your first transaction above." 
          : "Try adjusting your filters to find what you're looking for."}
      </p>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full relative">
      
      {/* 📱 MOBILE VIEW */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="md:hidden flex flex-col gap-5"
      >
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map(expense => (
            <motion.div 
              key={expense.id} 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 relative group overflow-hidden flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="chip-category">
                    {expense.category}
                  </span>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    {new Date(expense.date).toLocaleDateString('en-GB')}
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                  <span className="text-lg text-slate-400 dark:text-slate-600 mr-1 font-bold">{currencies[expense.currency]?.symbol || currencySymbol}</span>
                  {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </div>

              {expense.note && (
                <div className="text-sm text-slate-600 dark:text-slate-300 border-l-2 border-slate-300 dark:border-white/20 pl-4 py-1.5 font-bold italic truncate">
                  "{expense.note}"
                </div>
              )}

              <div className="pt-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em]">ID: {expense.id.toString().substring(0, 8)}</span>
                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEditExpense(expense.id)} className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/5 transition-all shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteExpense(expense.id)} className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/5 transition-all shadow-sm">
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass-card border-none">{renderEmptyState()}</div>
        )}
      </motion.div>

      {/* 💻 DESKTOP VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="py-6 px-8 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.4em] bg-white/70 dark:bg-[#020617]/40 backdrop-blur-md border-b border-slate-200 dark:border-white/10">Date</th>
              <th className="py-6 px-8 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.4em] bg-white/70 dark:bg-[#020617]/40 backdrop-blur-md border-b border-slate-200 dark:border-white/10">Category</th>
              <th className="py-6 px-8 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.4em] bg-white/70 dark:bg-[#020617]/40 backdrop-blur-md border-b border-slate-200 dark:border-white/10">Reference</th>
              <th className="py-6 px-8 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.4em] bg-white/70 dark:bg-[#020617]/40 backdrop-blur-md border-b border-slate-200 dark:border-white/10 text-right">Amount</th>
              <th className="py-6 px-8 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.4em] bg-white/70 dark:bg-[#020617]/40 backdrop-blur-md border-b border-slate-200 dark:border-white/10 text-center">Actions</th>
            </tr>
          </thead>
          <motion.tbody 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-slate-200 dark:divide-white/10"
          >
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map(expense => (
                <motion.tr 
                  key={expense.id} 
                  variants={itemVariants}
                  className="group hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors duration-300"
                >
                  <td className="py-7 px-8 whitespace-nowrap">
                    <div className="text-[13px] font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                      {new Date(expense.date).toLocaleDateString('en-GB')}
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-slate-800 dark:text-slate-200 font-black uppercase tracking-widest" title={expense.id}># {expense.id.toString().substring(0, 8)}</span>
                       <button onClick={() => handleCopyId(expense.id)} className={`transition-all ${copiedId === expense.id ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-700 hover:text-slate-600 dark:hover:text-slate-500'}`}>
                        {copiedId === expense.id ? (
                           <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                        ) : (
                           <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        )}
                       </button>
                    </div>
                  </td>
                  <td className="py-7 px-8 whitespace-nowrap">
                    <span className="chip-category group-hover:bg-blue-600/10 group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:border-blue-500/20">{expense.category}</span>
                  </td>
                  <td className="py-7 px-8 text-sm text-slate-900 dark:text-slate-100 font-bold max-w-[220px] truncate" title={expense.description}>
                    {expense.description || <span className="text-slate-700 dark:text-slate-300 italic font-black text-[10px] uppercase tracking-widest">No metadata</span>}
                  </td>
                  <td className="py-7 px-8 text-2xl font-black text-slate-900 dark:text-white text-right whitespace-nowrap tracking-tighter">
                    <span className="text-lg text-slate-400 dark:text-slate-600 mr-1.5 font-bold">{currencies[expense.currency]?.symbol || currencySymbol}</span>
                    {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-7 px-8 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                      <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} onClick={() => handleEditExpense(expense.id)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/5 transition-all shadow-sm"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></motion.button>
                      <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteExpense(expense.id)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/5 transition-all shadow-sm"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <motion.tr variants={itemVariants}><td colSpan="5">{renderEmptyState()}</td></motion.tr>
            )}
          </motion.tbody>
        </table>
      </div>

    </section>
  );
};

export default ExpenseList;
