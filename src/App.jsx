import React, { useState, useEffect } from 'react';
import Summary from './components/Summary';
import Filter from './components/Filter';
import ExpenseForm from './components/ExpenseForm';
import ExpenseBarChart from './components/ExpenseBarChart';
import Insights from './components/Insights';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState([]);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  
  const [filterCategory, setFilterCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [editingId, setEditingId] = useState(null);
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

    const newErrors = {};
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount > 0';
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

    if (editingId) {
      // 📝 Update existing expense
      const updatedExpenses = expenses.map(expense => 
        expense.id === editingId 
          ? { ...expense, amount: parseFloat(amount), category, date, note: note.trim() }
          : expense
      );
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      setSuccessMessage('Expense Updated! ✏️');
      setEditingId(null);
    } else {
      // ➕ Create new expense
      const newExpense = {
        id: crypto.randomUUID(),
        amount: parseFloat(amount),
        category,
        date,
        note: note.trim()
      };
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      setSuccessMessage('Added Successfully! 🎉');
    }

    setAmount('');
    setCategory('');
    setDate('');
    setNote('');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditExpense = (id) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    if (!expenseToEdit) return;
    
    setEditingId(id);
    setAmount(expenseToEdit.amount.toString());
    setCategory(expenseToEdit.category);
    setDate(expenseToEdit.date);
    setNote(expenseToEdit.note || '');
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll user up to the form
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAmount('');
    setCategory('');
    setDate('');
    setNote('');
    setErrors({});
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchCategory = filterCategory === 'All' || expense.category === filterCategory;
    const expDate = new Date(expense.date);
    // Use setHours(0,0,0,0) to ignore time matching issues if applicable, but string compare works too.
    const matchStart = startDate ? expDate >= new Date(startDate) : true;
    const matchEnd = endDate ? expDate <= new Date(endDate) : true;
    return matchCategory && matchStart && matchEnd;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalSpent = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // 🤖 Bonus 6: AI-like Spending Category Insight Logic
  let highestCategory = null;
  let highestAmount = 0;
  
  if (sortedExpenses.length > 0) {
    const dataMap = sortedExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    for (const [cat, amt] of Object.entries(dataMap)) {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    }
  }

  const handleExportCSV = () => {
    const headers = ['id', 'amount', 'category', 'date', 'note'];
    const csvRows = sortedExpenses.map(expense => {
      return [
        expense.id,
        expense.amount,
        `"${expense.category}"`,
        expense.date,
        `"${(expense.note || '').replace(/"/g, '""')}"`
      ].join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-10 font-sans text-gray-900 selection:bg-primary-200 flex flex-col items-center">
      <header className="max-w-6xl w-full mx-auto mb-10 mt-6 px-4 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Expense<span className="text-blue-500">IQ</span>
            </h1>
            <div className="h-1 w-20 bg-blue-500 rounded-full mt-2 hidden sm:block"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-0 flex flex-col gap-6 mb-12">
        {/* 📊 Section 1: Dashboard Top Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          {/* Left Column: Total + Log Expense */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Summary filterCategory={filterCategory} totalSpent={totalSpent} highestCategory={highestCategory} />
            <ExpenseForm 
              amount={amount} setAmount={setAmount}
              category={category} setCategory={setCategory}
              date={date} setDate={setDate}
              note={note} setNote={setNote}
              errors={errors} successMessage={successMessage}
              handleAddExpense={handleAddExpense}
              editingId={editingId} handleCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Right Column: Chart (Full height of left side) */}
          <div className="lg:col-span-8 h-full min-h-[350px]">
            <ExpenseBarChart expenses={filteredExpenses} />
          </div>
        </div>

        {/* 🧠 Section 2: Smart Advisor (Full Width) */}
        <div className="w-full">
          <Insights expenses={filteredExpenses} totalSpent={totalSpent} />
        </div>

        {/* 📋 Section 3: Financial Records (Full Width Table) */}
        <div className="glass-card p-6 md:p-8 w-full flex flex-col overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 w-full border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 whitespace-nowrap">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Financial Records
              </h2>
              <button
                onClick={handleExportCSV}
                disabled={sortedExpenses.length === 0}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-100 font-bold rounded-lg text-xs hover:border-slate-600 hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Export visible data to CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-emerald-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
            
            <Filter 
              filterCategory={filterCategory} setFilterCategory={setFilterCategory} 
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
            />
          </div>

          <ExpenseList 
            expenses={expenses}
            sortedExpenses={sortedExpenses}
            handleDeleteExpense={handleDeleteExpense}
            handleEditExpense={handleEditExpense}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
