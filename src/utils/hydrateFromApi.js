/**
 * Maps API responses into the shape expected by the Zustand store / UI.
 */
export function mapProfileToStore(profile, transactions) {
  const expenses = (transactions?.items || transactions || [])
    .filter((t) => t.type === 'EXPENSE')
    .map((t) => ({
      id: t.id,
      name: t.name,
      amount: t.amount,
      category: t.category || 'Other',
      date: t.date,
      notes: t.notes || '',
    }));

  const bills = (transactions?.items || transactions || [])
    .filter((t) => t.type === 'BILL')
    .map((t) => ({
      id: t.id,
      name: t.name,
      amount: t.amount,
      category: t.category || 'Other',
      dueDate: t.dueDate,
      isPaid: t.isPaid,
    }));

  const vault = profile.securityVault || {
    monthlyContribution: 0,
    currentSavings: 0,
    history: [],
  };

  return {
    isLoggedIn: true,
    isOnboarded: profile.isOnboarded,
    user: {
      username: profile.username,
      email: profile.email,
      avatar: profile.avatar,
      level: profile.level,
      xp: profile.xp,
      title: profile.title,
      createdAt: profile.createdAt,
    },
    monthlyIncome: profile.monthlyIncome,
    salaryDate: profile.salaryDate,
    vault: {
      monthlyContribution: vault.monthlyContribution,
      currentSavings: vault.currentSavings,
      history: (vault.history || []).map((h) => ({
        month: h.month,
        year: h.year,
        amount: h.amount,
        date: h.date,
      })),
    },
    expenses,
    bills,
    goals: [], // filled separately
    achievements: (profile.achievements || []).map((a) => ({
      id: a.slug,
      name: a.name,
      unlockedAt: a.unlockedAt,
    })),
  };
}

export async function fetchFullUserState() {
  const { userApi, transactionApi, goalApi } = await import('../api/services.js');

  const [profile, transactions, goals] = await Promise.all([
    userApi.getProfile(),
    transactionApi.list({ limit: 500 }),
    goalApi.list(),
  ]);

  const state = mapProfileToStore(profile, transactions);
  state.goals = goals.map((g) => ({
    id: g.id,
    name: g.name,
    targetAmount: g.targetAmount,
    currentAmount: g.currentAmount,
    deadline: g.deadline,
    createdAt: g.createdAt,
  }));

  return state;
}
