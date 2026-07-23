import { prisma } from '../lib/prisma.js';

export async function getDashboardStats(userId) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [user, monthlyTransactions, bills, goals, vault] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        initialBalance: true,
        monthlyIncome: true,
        salaryDate: true,
        level: true,
        xp: true,
        title: true,
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        type: { in: ['EXPENSE', 'INCOME', 'VAULT_DEPOSIT'] },
        date: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.transaction.findMany({
      where: { userId, type: 'BILL' },
    }),
    prisma.goal.findMany({ where: { userId } }),
    prisma.securityVault.findUnique({ where: { userId } }),
  ]);

  const initialBalance = Number(user?.initialBalance ?? 0);
  const monthlyIncome = Number(user?.monthlyIncome ?? 0);
  const vaultContribution = Number(vault?.monthlyContribution ?? 0);
  const vaultSavings = Number(vault?.currentSavings ?? 0);

  const expenses = monthlyTransactions.filter((t) => t.type === 'EXPENSE');
  const incomes = monthlyTransactions.filter((t) => t.type === 'INCOME');
  const vaultDeposits = monthlyTransactions.filter((t) => t.type === 'VAULT_DEPOSIT');

  const totalExpensesThisMonth = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalExtraIncomeThisMonth = incomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalVaultDepositsThisMonth = vaultDeposits.reduce((s, v) => s + Number(v.amount), 0);

  const totalBills = bills.reduce((s, b) => s + Number(b.amount), 0);
  const paidBillsList = bills.filter((b) => b.isPaid);
  const paidBillsCount = paidBillsList.length;
  const paidBillsAmount = paidBillsList.reduce((s, b) => s + Number(b.amount), 0);

  const salaryDay = user?.salaryDate ?? 1;
  const salaryReceived = now.getDate() >= salaryDay;
  const salaryAdd = salaryReceived ? monthlyIncome : 0;

  const safeSpendingBudget = salaryAdd + totalExtraIncomeThisMonth - vaultContribution - totalBills;
  const remainingBudget = safeSpendingBudget - totalExpensesThisMonth;

  const currentBalance = initialBalance + salaryAdd + totalExtraIncomeThisMonth - totalExpensesThisMonth - paidBillsAmount - totalVaultDepositsThisMonth;

  let nextSalary = new Date(now.getFullYear(), now.getMonth(), salaryDay);
  if (nextSalary <= now) {
    nextSalary = new Date(now.getFullYear(), now.getMonth() + 1, salaryDay);
  }
  const daysUntilSalary = Math.ceil((nextSalary - now) / (1000 * 60 * 60 * 24));
  const dailySpendingLimit =
    daysUntilSalary > 0 ? Math.max(0, Math.round(remainingBudget / daysUntilSalary)) : remainingBudget;

  const expensesByCategory = {};
  expenses.forEach((e) => {
    const cat = e.category || 'Other';
    expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Number(e.amount);
  });

  const goalsCompleted = goals.filter(
    (g) => Number(g.currentAmount) >= Number(g.targetAmount)
  ).length;

  const budget = safeSpendingBudget;
  let financialHealthScore = 50;
  if (budget > 0) {
    const totalDays = 30;
    const daysPassed = totalDays - daysUntilSalary;
    const expectedSpent = daysPassed > 0 ? (budget / totalDays) * daysPassed : 0;
    const spendingRatio = expectedSpent > 0 ? Math.min(totalExpensesThisMonth / expectedSpent, 2) : 0;
    const spendingScore = Math.max(0, 100 - (spendingRatio - 1) * 100);
    const billsPaidPct = bills.length > 0 ? (paidBillsCount / bills.length) * 100 : 100;
    const remainingRatio = (remainingBudget / budget) * 100;
    financialHealthScore = Math.round(spendingScore * 0.4 + billsPaidPct * 0.3 + remainingRatio * 0.3);
    financialHealthScore = Math.max(0, Math.min(100, financialHealthScore));
  }

  return {
    monthlyIncome,
    salaryDate: user?.salaryDate ?? 1,
    level: user?.level ?? 1,
    xp: user?.xp ?? 0,
    title: user?.title ?? 'Bronze Saver',
    balance: {
      initial: initialBalance,
      current: currentBalance,
    },
    vault: {
      monthlyContribution: vaultContribution,
      currentSavings: vaultSavings,
    },
    bills: {
      total: bills.length,
      paid: paidBillsCount,
      pending: bills.length - paidBillsCount,
      totalAmount: totalBills,
    },
    expenses: {
      totalThisMonth: totalExpensesThisMonth,
      countThisMonth: expenses.length,
      byCategory: Object.entries(expensesByCategory).map(([name, value]) => ({ name, value })),
    },
    goals: {
      total: goals.length,
      completed: goalsCompleted,
    },
    budget: {
      safeSpending: safeSpendingBudget,
      remaining: remainingBudget,
      dailyLimit: dailySpendingLimit,
      daysUntilSalary,
    },
    financialHealthScore,
    savingsRate:
      monthlyIncome > 0 ? Math.round((remainingBudget / monthlyIncome) * 1000) / 10 : 0,
  };
}
