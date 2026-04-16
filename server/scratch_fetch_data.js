const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- USERS ---');
  const users = await prisma.user.findMany();
  console.table(users.map(u => ({ id: u.id, name: u.name, email: u.email })));

  console.log('\n--- EXPENSES ---');
  const expenses = await prisma.expense.findMany();
  console.table(expenses.map(e => ({ amount: e.amount, category: e.category, date: e.date?.toLocaleDateString() || 'N/A', description: e.description })));

  console.log('\n--- INCOME ---');
  const income = await prisma.income.findMany();
  console.table(income.map(i => ({ amount: i.amount, source: i.source, date: i.date?.toLocaleDateString() || 'N/A' })));

  console.log('\n--- BUDGETS ---');
  const budgets = await prisma.budget.findMany();
  console.table(budgets.map(b => ({ limit: b.limit, category: b.category, month: b.month, year: b.year })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
