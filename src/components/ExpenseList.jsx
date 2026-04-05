import React, { useState } from 'react';

const ExpenseList = ({ expenses, sortedExpenses, handleDeleteExpense, handleEditExpense }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper function for empty states
  const renderEmptyState = () => (
    <div className="py-16 text-center flex flex-col items-center justify-center animate-fade-in w-full px-4">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {expenses.length === 0 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          )}
        </svg>
      </div>
      <p className="text-lg font-bold text-slate-100 tracking-tight">
        {expenses.length === 0 ? "No expenses added yet" : "No matching expenses"}
      </p>
      <p className="text-sm text-slate-400 mt-1 max-w-[250px]">
        {expenses.length === 0 
          ? "Record your first expense using the form above." 
          : "Try selecting a different filter category."}
      </p>
    </div>
  );

  return (
    <section className="w-full">
      
      {/* 📱 MOBILE VIEW: Stacked Cards (Visible under 768px, 0 horizontal scroll) */}
      <div className="md:hidden flex flex-col gap-4">
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map(expense => (
            <div key={expense.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm relative group overflow-hidden flex flex-col gap-3 transition-shadow hover:shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 w-max shadow-sm">
                    {expense.category}
                  </span>
                  <div className="text-xs font-semibold text-slate-400 mt-1">{expense.date}</div>
                </div>
                <div className="text-xl font-black text-slate-100 absolute top-5 right-5">
                  ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {expense.note && (
                <div className="text-sm text-slate-400 border-l-2 border-slate-700 pl-3 py-1 font-medium italic truncate">
                  "{expense.note}"
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-1">
                <div className="flex items-center gap-1 w-full overflow-hidden">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider truncate" title={expense.id}>
                    ID: {expense.id.toString().substring(0, 8)}...
                  </span>
                  <button 
                    onClick={() => handleCopyId(expense.id)}
                    className={`p-1.5 rounded flex items-center justify-center transition-colors ${copiedId === expense.id ? 'text-emerald-400 bg-emerald-900/20' : 'text-slate-500 hover:text-blue-400 hover:bg-slate-800'}`}
                  >
                    {copiedId === expense.id ? (
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1 justify-end shrink-0 pl-4 border-l border-slate-800">
                  <button onClick={() => handleEditExpense(expense.id)} className="text-slate-500 hover:text-amber-400 p-2 rounded-xl hover:bg-slate-800 transition-colors" title="Edit">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-xl hover:bg-slate-800 transition-colors" title="Delete">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800">{renderEmptyState()}</div>
        )}
      </div>

      {/* 💻 DESKTOP VIEW: Traditional Table Layout */}
      <div className="hidden md:block overflow-x-auto -mx-8 px-8">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b-2 border-slate-800">
              <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-widest w-[200px]">Date & ID</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Note</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map(expense => (
                <tr key={expense.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-all group">
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-300 mb-1">{expense.date}</div>
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] text-slate-500 font-mono tracking-wider" title={expense.id}>
                        ID: {expense.id.toString().substring(0, 8)}...
                      </span>
                      <button onClick={() => handleCopyId(expense.id)} className={`p-1 rounded flex items-center transition-colors ${copiedId === expense.id ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`} title="Copy ID">
                        {copiedId === expense.id ? <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 shadow-sm">{expense.category}</span>
                  </td>
                  <td className="py-4 px-5 text-sm text-slate-400 max-w-[180px] truncate" title={expense.note}>
                    {expense.note || <span className="text-slate-600 italic font-light">--</span>}
                  </td>
                  <td className="py-4 px-5 text-base font-extrabold text-slate-100 text-right whitespace-nowrap">
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-5 text-center whitespace-nowrap">
                    <button onClick={() => handleEditExpense(expense.id)} className="text-slate-500 hover:text-amber-400 p-2 rounded-xl hover:bg-slate-700 transition-all opacity-80 hover:opacity-100 mr-1 shadow-sm border border-slate-700 bg-slate-800/80"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button onClick={() => handleDeleteExpense(expense.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-xl hover:bg-slate-700 transition-all opacity-80 hover:opacity-100 shadow-sm border border-slate-700 bg-slate-800/80"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">{renderEmptyState()}</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </section>
  );
};

export default ExpenseList;
