import React, { useState, useEffect } from 'react';
import Summary from './components/Summary';
import Filter from './components/Filter';
import ExpenseForm from './components/ExpenseForm';
import ExpenseChart from './components/ExpenseChart';
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
          editingId={editingId} handleCancelEdit={handleCancelEdit}
        />

        {/* Dynamic Spend Distribution Chart */}
        <ExpenseChart expenses={filteredExpenses} />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 mt-4 w-full">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 whitespace-nowrap">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              History
            </h2>
            <button
              onClick={handleExportCSV}
              disabled={sortedExpenses.length === 0}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Export visible data to CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-emerald-500">
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
      </main>
      
      <footer className="max-w-5xl mx-auto mt-12 text-center text-sm text-gray-400 pb-8">
        Built via AI collaboration. Offline Capable.
      </footer>
    </div>
  );
}

export default App;
