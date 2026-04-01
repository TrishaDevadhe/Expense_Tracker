import React, { useState, useEffect } from 'react';
import Summary from './components/Summary';
import Filter from './components/Filter';
import ExpenseForm from './components/ExpenseForm';
import ExpenseChart from './components/ExpenseChart';
import ExpenseList from './components/ExpenseList';
import { createExpense } from './utils/expenseModel';

function App() {
  const [expenses, setExpenses] = useState([]);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  
  const [filterCategory, setFilterCategory] = useState('All');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  const handleAddExpense = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      // Create sanitized data using centralized function
      const newExpense = createExpense(amount, category, date, note);
      
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
      setSuccessMessage('Added Successfully! 🎉');

      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      // Map string message to relevant field validation blindly or cleanly
      if (err.message.includes('Amount')) setErrors({ amount: err.message });
      else if (err.message.includes('category')) setErrors({ category: err.message });
      else if (err.message.includes('Date')) setErrors({ date: err.message });
      else setErrors({ note: 'Validation Failed' });
    }
  };



  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);

  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalSpent = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 font-sans bg-gray-50 text-gray-900 selection:bg-primary-200">
      <header className="max-w-5xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
              Expense <span className="text-primary-600">Tracker</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-md">
              A meticulously designed, offline-first dashboard to monitor your personal finances.
            </p>
          </div>
          
          <Summary filterCategory={filterCategory} totalSpent={totalSpent} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <ExpenseForm 
          amount={amount} setAmount={setAmount}
          category={category} setCategory={setCategory}
          date={date} setDate={setDate}
          note={note} setNote={setNote}
          errors={errors} successMessage={successMessage}
          handleAddExpense={handleAddExpense}
        />

        {/* Dynamic Spend Distribution Chart */}
        <ExpenseChart expenses={filteredExpenses} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            Transaction History
          </h2>
          
          <Filter filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
        </div>

        <ExpenseList 
          expenses={expenses}
          sortedExpenses={sortedExpenses}
          handleDeleteExpense={handleDeleteExpense}
        />
      </main>
      
      <footer className="max-w-5xl mx-auto mt-12 text-center text-sm text-gray-400 pb-8">
        Built via AI collaboration. Offline Capable.
      </footer>
    </div>
  );
}

export default App;
