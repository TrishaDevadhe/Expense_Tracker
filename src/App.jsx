import React, { useState, useEffect } from 'react';

function App() {
  // State for expenses
  const [expenses, setExpenses] = useState([]);

  // Form states
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  // Validation & feedback states
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load from localStorage on app start
  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Handle adding an expense
  const handleAddExpense = (e) => {
    e.preventDefault();

    setErrors({});
    setSuccessMessage('');

    // Validate inputs
    const newErrors = {};
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be > 0';
    }
    if (!category) {
      newErrors.category = 'Required';
    }
    if (!date) {
      newErrors.date = 'Required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      date,
      note: note.trim()
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    setAmount('');
    setCategory('');
    setDate('');
    setNote('');
    setSuccessMessage('Expense Added ✅');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

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
        {/* Add Expense Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Expense</h2>
            {successMessage && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                {successMessage}
              </span>
            )}
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleAddExpense}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">Amount</label>
                <input 
                  type="number" id="amount" step="0.01" placeholder="e.g. 200"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  className={`w-full px-4 py-2 bg-white border rounded-lg outline-none transition-shadow ${errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500 focus:ring-2'}`}
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category</label>
                <select 
                  id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-2 bg-white border rounded-lg outline-none transition-shadow ${errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500 focus:ring-2'}`}
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
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Date</label>
                <input 
                  type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-4 py-2 bg-white border rounded-lg outline-none transition-shadow ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500 focus:ring-2'}`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full flex-grow-[2]">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="note">Note (Optional)</label>
                <input 
                  type="text" id="note" placeholder="e.g. Lunch with team" value={note} onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                />
              </div>

              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 focus:ring-4 focus:ring-primary-300 transition-colors shadow-sm h-[42px]"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Expenses List Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Expenses</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 rounded-tl-lg">Date</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Note</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Amount</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center rounded-tr-lg w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.length > 0 ? (
                  sortedExpenses.map(expense => (
                    <tr key={expense.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">{expense.date}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 max-w-[200px] truncate" title={expense.note}>
                        {expense.note || <span className="text-gray-300 italic">None</span>}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-900 text-right whitespace-nowrap">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          title="Delete expense"
                          aria-label="Delete expense"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-base font-medium text-gray-500">No expenses added yet</p>
                        <p className="text-sm mt-1">Fill out the form above to record your first expense.</p>
                      </div>
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
