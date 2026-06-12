/* ============================================
   FINANCIAL INSIGHTS GENERATOR
   AI-like spending analysis
   ============================================ */

/**
 * Generate financial insights based on user data
 * @param {object} state - The full app state
 * @returns {object[]} Array of insight objects
 */
export function generateInsights(state) {
  const insights = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter this month's expenses
  const monthlyExpenses = (state.expenses || []).filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = monthlyExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalBills = (state.bills || []).reduce((s, b) => s + Number(b.amount), 0);
  const budget = state.monthlyIncome - (state.vault?.monthlyContribution || 0) - totalBills;
  const remaining = budget - totalSpent;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysLeft = daysInMonth - daysPassed;

  // Daily spending limit
  if (daysLeft > 0 && remaining > 0) {
    const dailyLimit = Math.round(remaining / daysLeft);
    insights.push({
      type: 'daily-limit',
      icon: '💰',
      message: `You can safely spend ₹${dailyLimit.toLocaleString('en-IN')} today.`,
      priority: 'high',
      color: 'green',
    });
  } else if (remaining <= 0) {
    insights.push({
      type: 'overspent',
      icon: '🚨',
      message: `You've exceeded your budget by ₹${Math.abs(remaining).toLocaleString('en-IN')}. Try to reduce spending.`,
      priority: 'critical',
      color: 'red',
    });
  }

  // Spending pace
  if (daysPassed > 5 && budget > 0) {
    const expectedRate = budget / daysInMonth;
    const actualRate = totalSpent / daysPassed;
    const ratio = actualRate / expectedRate;

    if (ratio > 1.3) {
      insights.push({
        type: 'pace-warning',
        icon: '⚡',
        message: `You're spending ${Math.round((ratio - 1) * 100)}% faster than planned this month.`,
        priority: 'high',
        color: 'yellow',
      });
    } else if (ratio < 0.8) {
      insights.push({
        type: 'pace-good',
        icon: '🎯',
        message: `Great pace! You're spending ${Math.round((1 - ratio) * 100)}% less than planned.`,
        priority: 'medium',
        color: 'green',
      });
    }
  }

  // Category analysis
  const categories = {};
  monthlyExpenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + Number(e.amount);
  });

  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) {
    const [topCat, topAmount] = sorted[0];
    const percentage = budget > 0 ? Math.round((topAmount / budget) * 100) : 0;
    insights.push({
      type: 'top-category',
      icon: '📊',
      message: `Your biggest spending category is ${topCat} at ₹${topAmount.toLocaleString('en-IN')} (${percentage}% of budget).`,
      priority: 'medium',
      color: 'blue',
    });
  }

  // Week-over-week comparison
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const thisWeekExpenses = monthlyExpenses.filter(e => new Date(e.date) >= thisWeekStart);
  const lastWeekExpenses = monthlyExpenses.filter(e => {
    const d = new Date(e.date);
    return d >= lastWeekStart && d < thisWeekStart;
  });

  const thisWeekTotal = thisWeekExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const lastWeekTotal = lastWeekExpenses.reduce((s, e) => s + Number(e.amount), 0);

  if (lastWeekTotal > 0) {
    const change = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    if (change > 20) {
      insights.push({
        type: 'week-increase',
        icon: '📈',
        message: `Your spending increased by ${Math.round(change)}% compared to last week.`,
        priority: 'medium',
        color: 'yellow',
      });
    } else if (change < -15) {
      insights.push({
        type: 'week-decrease',
        icon: '📉',
        message: `Your spending decreased by ${Math.round(Math.abs(change))}% compared to last week. Keep it up!`,
        priority: 'low',
        color: 'green',
      });
    }
  }

  // Goal progress
  (state.goals || []).forEach(goal => {
    const progress = goal.targetAmount > 0
      ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
      : 0;

    if (progress >= 80 && progress < 100) {
      insights.push({
        type: 'goal-close',
        icon: '🏆',
        message: `Almost there! "${goal.name}" is ${progress}% complete.`,
        priority: 'medium',
        color: 'gold',
      });
    } else if (progress >= 100) {
      insights.push({
        type: 'goal-complete',
        icon: '🎉',
        message: `Congratulations! You've achieved your "${goal.name}" goal!`,
        priority: 'high',
        color: 'green',
      });
    }
  });

  // Savings encouragement
  if (remaining > 0 && daysLeft <= 5) {
    insights.push({
      type: 'month-end-save',
      icon: '💎',
      message: `You can save ₹${remaining.toLocaleString('en-IN')} more this month. Transfer to your goal fund!`,
      priority: 'medium',
      color: 'gold',
    });
  }

  // Bill reminders
  const unpaidBills = (state.bills || []).filter(b => !b.isPaid);
  unpaidBills.forEach(bill => {
    const dueDay = Number(bill.dueDate);
    const daysDiff = dueDay - now.getDate();
    if (daysDiff >= 0 && daysDiff <= 3) {
      insights.push({
        type: 'bill-due',
        icon: '📋',
        message: daysDiff === 0
          ? `"${bill.name}" is due today! Pay ₹${Number(bill.amount).toLocaleString('en-IN')} now.`
          : `"${bill.name}" is due in ${daysDiff} day${daysDiff > 1 ? 's' : ''}. Amount: ₹${Number(bill.amount).toLocaleString('en-IN')}.`,
        priority: daysDiff === 0 ? 'critical' : 'high',
        color: daysDiff === 0 ? 'red' : 'yellow',
      });
    }
  });

  // Default encouragement if no insights
  if (insights.length === 0) {
    insights.push({
      type: 'welcome',
      icon: '🗺️',
      message: 'Start tracking your expenses to get personalized financial insights!',
      priority: 'low',
      color: 'blue',
    });
  }

  return insights.sort((a, b) => {
    const priority = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priority[a.priority] || 3) - (priority[b.priority] || 3);
  });
}

/**
 * Get weekly spending data for charts
 */
export function getWeeklySpendingData(expenses) {
  const now = new Date();
  const weeks = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= weekStart && d <= weekEnd;
    });

    const total = weekExpenses.reduce((s, e) => s + Number(e.amount), 0);
    weeks.push({
      name: `Week ${4 - i}`,
      amount: total,
    });
  }

  return weeks;
}

/**
 * Get daily spending for the current week
 */
export function getDailySpendingData(expenses) {
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const dayStr = day.toISOString().split('T')[0];

    const dayTotal = expenses
      .filter(e => new Date(e.date).toISOString().split('T')[0] === dayStr)
      .reduce((s, e) => s + Number(e.amount), 0);

    data.push({
      name: dayNames[day.getDay()],
      amount: dayTotal,
    });
  }

  return data;
}
