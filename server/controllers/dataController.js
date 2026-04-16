const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Income Controllers
const getIncome = async (req, res) => {
  try {
    const income = await prisma.income.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
    });
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching income' });
  }
};

const createIncome = async (req, res) => {
  const { amount, source, date } = req.body;
  try {
    const income = await prisma.income.create({
      data: {
        userId: req.user.id,
        amount: parseFloat(amount),
        source,
        date: date ? new Date(date) : new Date(),
      },
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: 'Error creating income' });
  }
};

// Budget Controllers
const getBudgets = async (req, res) => {
  const { month, year } = req.query;
  const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
  const currentYear = year ? parseInt(year) : new Date().getFullYear();

  try {
    const budgets = await prisma.budget.findMany({
      where: { 
        userId: req.user.id,
        month: currentMonth,
        year: currentYear
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
};

const createBudget = async (req, res) => {
  const { limit, category, currency, month, year } = req.body;
  const budgetCategory = category || 'Total';
  const currentMonth = month || new Date().getMonth() + 1;
  const currentYear = year || new Date().getFullYear();

  try {
    // Check if a budget for this category and month already exists
    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        category: budgetCategory,
        month: currentMonth,
        year: currentYear,
      },
    });

    if (existingBudget) {
      const updatedBudget = await prisma.budget.update({
        where: { id: existingBudget.id },
        data: {
          limit: parseFloat(limit),
          currency: currency || 'USD',
        },
      });
      return res.json(updatedBudget);
    }

    const budget = await prisma.budget.create({
      data: {
        userId: req.user.id,
        limit: parseFloat(limit),
        category: budgetCategory,
        month: currentMonth,
        year: currentYear,
        currency: currency || 'USD',
      },
    });
    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating budget' });
  }
};

const { generateFinancialInsights } = require('../services/aiService');

const getAIInsights = async (req, res) => {
  try {
    const { expenses, income, budget } = req.body;
    
    // Fallback to DB if frontend didn't send data (optional but safer)
    let finalExpenses = expenses;
    let finalIncome = income;
    let finalBudget = budget;

    if (!finalExpenses) {
      finalExpenses = await prisma.expense.findMany({ where: { userId: req.user.id } });
    }
    if (!finalIncome) {
      finalIncome = await prisma.income.findMany({ where: { userId: req.user.id } });
    }
    if (finalBudget === undefined) {
      const b = await prisma.budget.findFirst({ where: { userId: req.user.id } });
      finalBudget = b ? b.limit : 0;
    }

    const insights = await generateFinancialInsights(finalExpenses, finalIncome, finalBudget);
    res.json({ insights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating AI insights' });
  }
};

module.exports = {
  getIncome,
  createIncome,
  getBudgets,
  createBudget,
  getAIInsights,
};
