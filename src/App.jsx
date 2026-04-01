import React, { useState } from 'react';

function App() {
  // Hard-coded sample data for Commit 1
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 200,
      category: 'Food & Drink',
      date: '2026-04-01',
      note: 'Lunch',
    },
    {
      id: 2,
      amount: 500,
      category: 'Transport',
      date: '2026-04-02',
      note: 'Auto',
    },
  ]);

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans bg-gray-50 text-gray-900">
      <header className="max-w-4xl mx-auto mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          AI-Assisted <span className="text-primary-600">Expense Tracker</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Easily manage your personal finances offline.
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Add Expense Section - Minimally Working Initial Layout */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Expense</h2>
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">Amount</label>
              <input 
                type="number" 
                id="amount" 
                placeholder="200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category</label>
              <select 
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow bg-white"
                defaultValue=""
              >
                <option value="" disabled>Select category</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              />
            </div>

            <div className="flex items-end">
              <button 
                type="button"
                className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 focus:ring-4 focus:ring-primary-300 transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
          </form>
        </section>

        {/* Expenses List Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Expenses</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Note</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map(expense => (
                    <tr key={expense.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-600">{expense.date}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{expense.note || '-'}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                        ${expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-sm text-gray-500">
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
