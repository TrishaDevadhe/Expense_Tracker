import React from 'react';

const CATEGORIES = [
  'Food & Drink', 'Transport', 'Housing', 'Health', 
  'Entertainment', 'Shopping', 'Education', 'Other'
];

const ExpenseForm = ({ 
  amount, setAmount, category, setCategory, 
  date, setDate, note, setNote, 
  errors, successMessage, handleAddExpense 
}) => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Expense
        </h2>
        {successMessage && (
          <span className="text-sm font-semibold text-green-700 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 animate-pulse">
            {successMessage}
          </span>
        )}
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleAddExpense}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* AMOUNT INPUT */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="amount">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input 
                type="number" 
                id="amount" 
                step="0.01" 
                placeholder="e.g. 500"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-8 pr-4 py-2.5 bg-gray-50/50 border rounded-xl outline-none transition-all ${errors.amount ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-gray-200 focus:ring-primary-500 focus:border-primary-500 focus:bg-white hover:border-gray-300'}`}
              />
            </div>
            {errors.amount && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>{errors.amount}</p>}
          </div>
          
          {/* CATEGORY SELECT */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="category">Category</label>
            <div className="relative">
              <select 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50/50 border rounded-xl outline-none transition-all cursor-pointer font-medium text-gray-700 ${errors.category ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-gray-200 focus:ring-primary-500 focus:border-primary-500 focus:bg-white hover:border-gray-300'}`}
              >
                <option value="" disabled>Select category...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            {errors.category && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>{errors.category}</p>}
          </div>

          {/* DATE PICKER */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="date">Date</label>
            <input 
              type="date" 
              id="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-2.5 bg-gray-50/50 border rounded-xl outline-none transition-all font-medium text-gray-700 ${errors.date ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-gray-200 focus:ring-primary-500 focus:border-primary-500 focus:bg-white hover:border-gray-300'}`}
            />
            {errors.date && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>{errors.date}</p>}
          </div>
        </div>

        {/* BOTTOM ROW (NOTE + BUTTON) */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end mt-1">
          <div className="flex-1 w-full flex-grow-[2]">
            <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide" htmlFor="note">Optional Note</label>
            <input 
              type="text" 
              id="note" 
              placeholder="e.g. Lunch with team..." 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white hover:border-gray-300 outline-none transition-all placeholder-gray-400"
            />
          </div>

          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <button 
              type="submit"
              className="w-full sm:w-auto px-8 py-2.5 bg-primary-600 text-white font-bold tracking-wide rounded-xl hover:bg-primary-500 hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-primary-300 focus:outline-none transition-all active:translate-y-0 h-[46px] flex items-center justify-center gap-2"
            >
              Add Expense
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ExpenseForm;
