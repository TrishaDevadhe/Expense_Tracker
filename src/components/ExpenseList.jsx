import React from 'react';

const ExpenseList = ({ expenses, sortedExpenses, handleDeleteExpense }) => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b-2 border-gray-100 bg-gray-50/50">
              <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest rounded-tl-xl w-[120px]">Date</th>
              <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Note</th>
              <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
              <th className="py-4 px-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center rounded-tr-xl w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map(expense => (
                <tr key={expense.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-all group">
                  <td className="py-5 px-5 text-sm font-medium text-gray-500 whitespace-nowrap">
                    {expense.date}
                  </td>
                  <td className="py-5 px-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100/50 shadow-sm">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-5 px-5 text-sm text-gray-500 max-w-[180px] truncate hidden sm:table-cell" title={expense.note}>
                    {expense.note || <span className="text-gray-300 italic font-light">--</span>}
                  </td>
                  <td className="py-5 px-5 text-base font-extrabold text-gray-900 text-right whitespace-nowrap">
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-5 px-5 text-center">
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Delete expense"
                      aria-label="Delete expense"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center animate-fade-in">
                    {expenses.length === 0 ? (
                      <>
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-gray-800 tracking-tight">No expenses added yet</p>
                        <p className="text-sm text-gray-500 mt-1 max-w-[250px]">Record your first expense using the form above to get started.</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-gray-800 tracking-tight">No matching expenses</p>
                        <p className="text-sm text-gray-500 mt-1">Try selecting a different filter category to see your records.</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ExpenseList;
