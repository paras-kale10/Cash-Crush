/* ============================================
   ACHIEVEMENT SYSTEM
   Gamification engine for Cash Crush
   ============================================ */

/**
 * All available achievements
 */
export const ALL_ACHIEVEMENTS = [
  {
    id: 'first-tracker',
    name: 'First Tracker',
    description: 'Track your first expense',
    icon: '📝',
    xp: 50,
    condition: (state) => state.expenses.length >= 1,
  },
  {
    id: 'first-saver',
    name: 'First Saver',
    description: 'Make your first savings deposit',
    icon: '💰',
    xp: 50,
    condition: (state) => state.vault.currentSavings > 0,
  },
  {
    id: 'bill-payer',
    name: 'Bill Payer',
    description: 'Pay your first bill on time',
    icon: '✅',
    xp: 30,
    condition: (state) => state.bills.some(b => b.isPaid),
  },
  {
    id: 'budget-master',
    name: 'Budget Master',
    description: 'Stay within budget for a full month',
    icon: '👑',
    xp: 100,
    condition: (state) => {
      const totalBills = state.bills.reduce((s, b) => s + Number(b.amount), 0);
      const budget = state.monthlyIncome - state.vault.monthlyContribution - totalBills;
      const spent = state.expenses
        .filter(e => {
          const d = new Date(e.date);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, e) => s + Number(e.amount), 0);
      return spent <= budget && state.expenses.length >= 10;
    },
  },
  {
    id: 'goal-setter',
    name: 'Goal Setter',
    description: 'Create your first savings goal',
    icon: '🎯',
    xp: 30,
    condition: (state) => state.goals.length >= 1,
  },
  {
    id: 'goal-achiever',
    name: 'Goal Achiever',
    description: 'Complete a savings goal',
    icon: '🏆',
    xp: 200,
    condition: (state) => state.goals.some(g => g.currentAmount >= g.targetAmount),
  },
  {
    id: 'vault-guardian',
    name: 'Vault Guardian',
    description: 'Save ₹10,000 in your vault',
    icon: '🛡️',
    xp: 150,
    condition: (state) => state.vault.currentSavings >= 10000,
  },
  {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    description: 'Track 50 expenses',
    icon: '🗺️',
    xp: 100,
    condition: (state) => state.expenses.length >= 50,
  },
  {
    id: 'treasure-champion',
    name: 'Treasure Champion',
    description: 'Save ₹50,000 total',
    icon: '💎',
    xp: 300,
    condition: (state) => state.vault.currentSavings >= 50000,
  },
  {
    id: 'all-bills-paid',
    name: 'Bill Crusher',
    description: 'Pay all bills in a month',
    icon: '💪',
    xp: 75,
    condition: (state) => state.bills.length > 0 && state.bills.every(b => b.isPaid),
  },
  {
    id: 'category-explorer',
    name: 'Category Explorer',
    description: 'Have expenses in 5+ categories',
    icon: '🌟',
    xp: 50,
    condition: (state) => {
      const cats = new Set(state.expenses.map(e => e.category));
      return cats.size >= 5;
    },
  },
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Track expenses for 7 consecutive days',
    icon: '🔥',
    xp: 75,
    condition: (state) => {
      return checkStreak(state.expenses, 7);
    },
  },
  {
    id: 'streak-30',
    name: '30-Day Streak',
    description: 'Track expenses for 30 consecutive days',
    icon: '🔥🔥',
    xp: 200,
    condition: (state) => {
      return checkStreak(state.expenses, 30);
    },
  },
];

/**
 * Check if there's a streak of N consecutive days with expenses
 */
function checkStreak(expenses, days) {
  if (expenses.length < days) return false;

  const dates = [...new Set(
    expenses.map(e => new Date(e.date).toISOString().split('T')[0])
  )].sort().reverse();

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i - 1]);
    const prev = new Date(dates[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      if (streak >= days) return true;
    } else {
      streak = 1;
    }
  }
  return streak >= days;
}

/**
 * Check and return newly unlocked achievements
 */
export function checkAchievements(state) {
  const unlocked = state.achievements || [];
  const unlockedNames = new Set(unlocked.map(a => a.name));

  const newlyUnlocked = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (!unlockedNames.has(achievement.name) && achievement.condition(state)) {
      newlyUnlocked.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name: achievement.name,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newlyUnlocked;
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Get title for level
 */
export function getTitle(level) {
  const titles = [
    'Bronze Saver',
    'Silver Saver',
    'Gold Saver',
    'Diamond Saver',
    'Treasure Master',
  ];
  const idx = Math.min(Math.floor((level - 1) / 2), titles.length - 1);
  return titles[idx];
}

/**
 * Get XP needed for next level
 */
export function xpForNextLevel(currentXP) {
  const currentLevel = calculateLevel(currentXP);
  return currentLevel * 100 - currentXP;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
