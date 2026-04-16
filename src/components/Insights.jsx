import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

const Insights = ({ expenses, totalSpent, income, budget, onGetInsights, aiInsights, aiLoading, error, isCompact = false }) => {
  // Removed return null to ensure component is always part of layout

  return (
    <GlassCard className={`${isCompact ? 'p-4 md:p-5' : 'p-5 md:p-6'} flex flex-col border-white/5 relative overflow-hidden group/insights`} delay={0.6} hover={false}>
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full -mr-40 -mt-40 transition-all group-hover/insights:bg-blue-600/10 duration-1000"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 relative z-10 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 shadow-md">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="tracking-tight">Smart Advisor</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-[11px] font-black mt-2 uppercase tracking-[0.3em]">Deep Learning Financial Intelligence</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGetInsights}
          disabled={aiLoading}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 border border-white/10 transition-all hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)]"
        >
          {aiLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>Get AI Insights</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!aiInsights && !aiLoading && !error && (
            <motion.div 
              key="awaiting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-2"
            >
              <div className="w-12 h-12 rounded-[1.5rem] bg-slate-100 dark:bg-white/10 flex items-center justify-center mx-auto mb-3 border border-slate-200 dark:border-white/10 shadow-inner">
                <svg className="w-6 h-6 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Awaiting Signal</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full flex items-center gap-5 bg-red-500/5 p-6 rounded-3xl border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold shadow-sm"
            >
              <div className="p-2 rounded-xl bg-red-500/10">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              {error}
            </motion.div>
          )}

          {aiInsights && (
            <motion.div 
              key="response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            >
              {aiInsights.slice(0, 3).map((point, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.04)', borderColor: 'rgba(59, 130, 246, 0.3)' }}
                  className="flex gap-5 items-start p-7 rounded-3xl bg-slate-100/50 dark:bg-white/10 border border-slate-300 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-all group/point cursor-default shadow-sm"
                >
                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover/point:scale-125 transition-transform shrink-0"></div>
                  <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-relaxed tracking-tight group-hover/point:text-slate-900 dark:group-hover/point:text-white transition-colors">{point}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

export default Insights;
