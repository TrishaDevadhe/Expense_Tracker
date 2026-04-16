const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

const createExpense = async (req, res) => {
  const { amount, category, currency, date, description } = req.body;

  try {
    const expense = await prisma.expense.create({
      data: {
        userId: req.user.id,
        amount: parseFloat(amount),
        category,
        currency: currency || 'USD',
        date: date ? new Date(date) : new Date(),
        description,
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating expense' });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, currency, date, description } = req.body;

  try {
    // Ensure the expense belongs to the user (strict isolation)
    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        category,
        currency,
        date: date ? new Date(date) : undefined,
        description,
      },
    });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Error updating expense' });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({ where: { id } });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
