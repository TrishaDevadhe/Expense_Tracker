import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Summary from '../components/Summary';
import Filter from '../components/Filter';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseBarChart from '../components/ExpenseBarChart';
import Insights from '../components/Insights';
import ExpenseList from '../components/ExpenseList';
import axios from 'axios';
import { LogOut, Upload, FileText, Sun, Moon } from 'lucide-react';
import { CURRENCIES, convertToBase, convertFromBase } from '../utils/currency';
import IncomeForm from '../components/IncomeForm';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budget, setBudget] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState(localStorage.getItem('currency') || 'INR');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // Form States
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem('currency') || 'INR');
  const [editingId, setEditingId] = useState(null);
  
  const [filterCategory, setFilterCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, incRes, budRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/data/income'),
        api.get('/data/budgets')
      ]);
      console.log('Fetched Expenses:', expRes.data);
      console.log('Fetched Income:', incRes.data);
      console.log('Fetched Budgets:', budRes.data);
      
      setExpenses(expRes.data);
      setIncome(incRes.data);
      if (budRes.data.length > 0) {
        const totalBudget = budRes.data.reduce((sum, b) => sum + b.limit, 0);
        console.log('Setting Total Budget to:', totalBudget);
        setBudget(totalBudget);
      } else {
        console.log('No budgets found, setting to 0');
        setBudget(0);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, { amount, category, date, description: note, currency: selectedCurrency });
        setEditingId(null);
      } else {
        await api.post('/expenses', { amount, category, date, description: note, currency: selectedCurrency });
      }
      fetchData();
      setAmount(''); setCategory(''); setDate(''); setNote('');
    } catch (err) {
      alert(editingId ? 'Failed to update expense' : 'Failed to add expense');
    }
  };

  const handleEditExpense = (id) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(expense.date ? expense.date.split('T')[0] : '');
      setNote(expense.description || '');
      setSelectedCurrency(expense.currency || 'USD');
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAmount(''); setCategory(''); setDate(''); setNote('');
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete expense: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('invoice', file);

    setUploading(true);
    try {
      const { data } = await api.post('/invoices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchData();
      alert(`Transaction added: ${data.extractedData.currency} ${data.extractedData.totalAmount} from ${data.extractedData.merchantName}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Automation failed - Please ensure the file is a clear invoice.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleUpdateCurrency = (curr) => {
    setDisplayCurrency(curr);
    localStorage.setItem('currency', curr);
  };

  const handleGetAIInsights = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/data/ai-insights', {
        expenses: filteredExpenses,
        income,
        budget
      });
      setAiInsights(data.insights);
    } catch (err) {
      alert('AI Advisor failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  // Removed local currency helpers (moved to utils)

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-[#0c0c14] flex items-center justify-center text-gray-900 dark:text-white">Loading your intelligence...</div>;

  const filteredExpenses = expenses.filter(expense => {
    const matchCategory = filterCategory === 'All' || expense.category === filterCategory;
    
    // Fix: Filter by actual transaction date field
    const expDate = new Date(expense.date).getTime();
    const start = startDate ? new Date(startDate).getTime() : -Infinity;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    const matchDate = expDate >= start && expDate <= (end + 86400000); // include full 'to' day

    return matchCategory && matchDate;
  });

  const currentDate = new Date();
  const currentMonthExpenses = expenses.filter(exp => {
    if (!exp.date) return false;
    // Extract YYYY-MM-DD and force local noon to avoid UTC midnight shift bugs
    const safeDateStr = exp.date.includes('T') ? exp.date.split('T')[0] : exp.date;
    const expDate = new Date(`${safeDateStr}T12:00:00`);
    return expDate.getMonth() === currentDate.getMonth() && expDate.getFullYear() === currentDate.getFullYear();
  });
  
  const currentMonthSpentBase = currentMonthExpenses.reduce((sum, exp) => sum + convertToBase(exp.amount, exp.currency), 0);
  const displayCurrentMonthSpent = convertFromBase(currentMonthSpentBase, displayCurrency);

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0); 
  
  const filteredSpent = filteredExpenses.reduce((sum, exp) => sum + convertToBase(exp.amount, exp.currency), 0);
  const displaySpent = convertFromBase(filteredSpent, displayCurrency);
  const displayIncome = convertFromBase(totalIncome, displayCurrency);
  const displayBudget = convertFromBase(convertToBase(budget, 'INR'), displayCurrency);

  return (
    <div className="min-h-screen p-6 sm:p-10 flex flex-col items-center bg-transparent transition-colors duration-300">
      <div className="noise-overlay" />
      
      <header className="max-w-7xl w-full mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Expense<span className="text-blue-500">IQ</span></h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">AI-Powered Production Suite</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <select 
            value={displayCurrency}
            onChange={(e) => handleUpdateCurrency(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-2xl text-sm font-bold text-gray-800 dark:text-white outline-none cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
          >
            {Object.keys(CURRENCIES).map(curr => <option key={curr} value={curr} className="bg-white dark:bg-[#0c0c14]">{curr}</option>)}
          </select>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-white flex items-center justify-center"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <label className="cursor-pointer bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-2 text-gray-800 dark:text-white">
            <Upload size={18} className="text-blue-400" />
            <span className="text-sm font-semibold">{uploading ? 'Processing...' : 'Upload Invoice'}</span>
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,image/*" />
          </label>
          
          <button 
            onClick={handleLogout}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500/20 transition-all transition-all flex items-center justify-center"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto space-y-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Summary type="top-income" totalIncome={displayIncome} currencySymbol={CURRENCIES[displayCurrency].symbol} />
          <Summary type="top-expenses" totalSpent={displaySpent} filterCategory={filterCategory} currencySymbol={CURRENCIES[displayCurrency].symbol} />
          <Summary 
            type="budget" 
            budget={displayBudget} 
            onUpdateBudget={async (val) => {
              if (val === '' || isNaN(val)) return;
              console.log('Updating Budget to:', val);
              try {
                const baseValue = convertToBase(Number(val), displayCurrency);
                const res = await api.post('/data/budgets', { limit: baseValue, category: 'Total' });
                console.log('Budget API Response:', res.data);
                fetchData();
              } catch (err) {
                console.error('Budget Update Failed:', err);
                alert('Failed to update budget');
              }
            }} 
            currencySymbol={CURRENCIES[displayCurrency].symbol} 
          />
          <Summary type="remaining" budget={displayBudget} totalSpent={displayCurrentMonthSpent} currencySymbol={CURRENCIES[displayCurrency].symbol} />
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Row 1: Log Transaction and Graph */}
          <div className="lg:col-span-4">
            <ExpenseForm 
              amount={amount} setAmount={setAmount}
              category={category} setCategory={setCategory}
              date={date} setDate={setDate}
              note={note} setNote={setNote}
              handleAddExpense={handleAddExpense}
              currencies={CURRENCIES}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              errors={{}}
              editingId={editingId}
              handleCancelEdit={handleCancelEdit}
            />
          </div>
          <div className="lg:col-span-8 h-full">
            <ExpenseBarChart 
              expenses={filteredExpenses}
              displayCurrency={displayCurrency}
              currencySymbol={CURRENCIES[displayCurrency].symbol}
              convertToBase={convertToBase}
              convertFromBase={convertFromBase}
              isDarkMode={true}
            />
          </div>

          {/* Row 2: Inflow Channel and AI Insights */}
          <div className="lg:col-span-4">
            <IncomeForm 
              onSuccess={() => { fetchData(); }}
              onCancel={() => {}}
              currencySymbol={CURRENCIES[displayCurrency].symbol}
              isSmaller={true}
            />
          </div>
          <div className="lg:col-span-8">
            <Insights 
              expenses={filteredExpenses} 
              totalSpent={displaySpent} 
              income={income}
              budget={budget}
              onGetInsights={handleGetAIInsights}
              aiInsights={aiInsights}
              aiLoading={aiLoading}
              isCompact={true}
            />
          </div>
        </div>

        <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
               <FileText className="text-blue-500" />
               Recent Transactions
             </h2>
             <Filter 
              filterCategory={filterCategory} 
              setFilterCategory={setFilterCategory}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
             />
          </div>
          <ExpenseList 
            expenses={expenses}
            sortedExpenses={filteredExpenses}
            displayCurrency={displayCurrency}
            currencySymbol={CURRENCIES[displayCurrency].symbol}
            currencies={CURRENCIES}
            handleEditExpense={handleEditExpense}
            handleDeleteExpense={handleDeleteExpense}
          />
        </GlassCard>
      </main>
    </div>
  );
};

export default Dashboard;
