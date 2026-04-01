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

    // Reset messages
    setErrors({});
    setSuccessMessage('');

    // Validate inputs
    const newErrors = {};
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!category) {
      newErrors.category = 'Category is required';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }

    // Stop if there are errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create the expense object
    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      date,
      note: note.trim()
    };

    // Update state & localStorage (prepend so newest is on top)
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // Clear form and show success
    setAmount('');
    setCategory('');
    setDate('');
    setNote('');
    setSuccessMessage('Expense Added ✅');

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

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
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {successMessage}
              </span>
            )}
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleAddExpense}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">Amount</label>
                <input 
                  type="number" 
                  id="amount" 
                  step="0.01"
                  placeholder="e.g. 200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category</label>
                <select 
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
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
                  type="date" 
                  id="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full flex-grow-[2]">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="note">Note (Optional)</label>
                <input 
                  type="text" 
                  id="note" 
                  placeholder="e.g. Lunch with team"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
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

        {/* Expenses List Section (Minimal Implementation for display only) */}
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
                      No expenses found. Start adding some!
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
