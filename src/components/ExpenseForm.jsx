import React from 'react';

const CATEGORIES = [
  'Food & Drink', 'Transport', 'Housing', 'Health', 
  'Entertainment', 'Shopping', 'Education', 'Other'
];

const ExpenseForm = ({ 
  amount, setAmount, category, setCategory, 
  date, setDate, note, setNote, 
  errors, successMessage, handleAddExpense, editingId, handleCancelEdit 
}) => {
  return (
    <section className="glass-card p-4 transition-all">
      <div className="flex justify-between items-center mb-4 border-b border-slate-800/50 pb-3">
        <div className="flex flex-col">
          <h2 className="text-[13px] font-bold text-slate-100 flex items-center gap-2">
            {editingId ? (
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            ) : (
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            )}
            {editingId ? 'Update Record' : 'Record Expense'}
          </h2>
        </div>
        {successMessage && (
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-fade-in uppercase tracking-wider">
            {successMessage}
          </span>
        )}
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleAddExpense}>
        {/* AMOUNT */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest pl-0.5" htmlFor="amount">Amount (₹)</label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₹</span>
            <input 
              type="number" 
              id="amount" 
              step="0.01" 
              placeholder="0.00"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-7 pr-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg outline-none transition-all placeholder-slate-600 text-[13px] font-bold text-slate-100 ${errors.amount ? 'border-red-500 focus:ring-red-500/10' : 'focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-slate-700'}`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-[9px] font-bold mt-0.5 uppercase tracking-tight pl-0.5">{errors.amount}</p>}
        </div>

        {/* CATEGORY */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest pl-0.5" htmlFor="category">Category</label>
          <div className="relative group">
            <select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full appearance-none pl-3 pr-10 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg outline-none transition-all cursor-pointer text-[13px] font-bold text-slate-100 ${errors.category ? 'border-red-500 focus:ring-red-500/10' : 'focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-slate-700'}`}
            >
              <option value="" disabled>Select category...</option>
              {CATEGORIES.map(cat => (
                <option className="bg-slate-900 text-slate-100" key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.category && <p className="text-red-500 text-[9px] font-bold mt-0.5 uppercase tracking-tight pl-0.5">{errors.category}</p>}
        </div>

        {/* DATE */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest pl-0.5" htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg outline-none transition-all text-[13px] font-bold text-slate-100 ${errors.date ? 'border-red-500 focus:ring-red-500/10' : 'focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-slate-700'}`}
          />
          {errors.date && <p className="text-red-500 text-[9px] font-bold mt-0.5 uppercase tracking-tight pl-0.5">{errors.date}</p>}
        </div>

        {/* NOTE */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest pl-0.5" htmlFor="note">Note (Optional)</label>
          <input 
            type="text" 
            id="note" 
            placeholder="Details..." 
            value={note} 
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-slate-700 outline-none transition-all placeholder-slate-600 text-[13px] font-bold text-slate-100"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-2 mt-2">
          <button 
            type="submit"
            className="w-full py-2.5 text-white bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.1)] font-black text-[11px] uppercase tracking-[0.2em] rounded-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 hover:bg-blue-500 transform active:scale-[0.98]"
          >
            {editingId ? 'Update Record' : 'Log Transaction'}
          </button>
          {editingId && (
            <button 
              type="button"
              onClick={handleCancelEdit}
              className="w-full py-2 bg-slate-800/30 text-slate-500 border border-slate-800/50 font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-slate-800 hover:text-slate-300 transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ExpenseForm;
