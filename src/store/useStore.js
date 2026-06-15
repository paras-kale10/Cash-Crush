import { create } from 'zustand';
import { checkAchievements, ALL_ACHIEVEMENTS } from '../utils/achievements';
import { isApiEnabled, setToken, getToken } from '../api/client.js';
import { authApi } from '../api/services.js';
import { migrateLegacyDataIfNeeded } from '../utils/migrateLocalStorage.js';
import { fetchFullUserState } from '../utils/hydrateFromApi.js';
import {
  syncProfile,
  syncVault,
  syncCreateBill,
  syncUpdateBill,
  syncDeleteBill,
  syncCreateExpense,
  syncUpdateExpense,
  syncDeleteExpense,
  syncCreateGoal,
  syncUpdateGoal,
  syncDeleteGoal,
  syncVaultDeposit,
} from '../utils/syncToApi.js';

/* ============================================
   LOCAL STORAGE HELPERS
   ============================================ */

const STORAGE_KEY = 'cashcrush_data';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return null;
}

function saveState(state) {
  try {
    const toSave = { ...state };
    // Remove functions from saved state
    Object.keys(toSave).forEach(k => {
      if (typeof toSave[k] === 'function') delete toSave[k];
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save state:', e);
    // Check if it's a quota exceeded error
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded. Some data may not be saved.');
    } else if (e.name === 'SecurityError') {
      console.error('Storage access denied. Private browsing or localStorage disabled.');
    }
  }
}

/* ============================================
   DEFAULT STATE
   ============================================ */

const defaultState = {
  // Auth
  isLoggedIn: false,
  isOnboarded: false,

  // User Profile
  user: {
    username: '',
    email: '',
    password: '',
    avatar: 'adventurer',
    level: 1,
    xp: 0,
    title: 'Bronze Saver',
    createdAt: null,
  },

  // Income
  monthlyIncome: 0,
  salaryDate: 1, // day of month

  // Treasure Vault
  vault: {
    monthlyContribution: 0,
    currentSavings: 0,
    history: [], // { month, year, amount }
  },

  // Bills
  bills: [],
  // Each: { id, name, amount, dueDate, isPaid, category }

  // Expenses
  expenses: [],
  // Each: { id, name, amount, category, date, notes }

  // Goals
  goals: [],
  // Each: { id, name, targetAmount, currentAmount, deadline, createdAt }

  // Achievements
  achievements: [],
  // Each: { id, name, unlockedAt }

  // Settings
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),

  // Notifications
  notifications: [],
};

/* ============================================
   STORE
   ============================================ */

const useStore = create((set, get) => {
  const saved = loadState();
  const initial = saved ? { ...defaultState, ...saved } : { ...defaultState };

  return {
    ...initial,

    /* ---- Auth ---- */
    signup: async (username, email, password) => {
      if (isApiEnabled()) {
        const { user, token } = await authApi.register({ username, email, password });
        setToken(token);
        await migrateLegacyDataIfNeeded();
        const hydrated = await fetchFullUserState();
        set(() => {
          const newState = {
            ...defaultState,
            ...hydrated,
            isLoggedIn: true,
            user: { ...hydrated.user, email: user.email },
          };
          saveState(newState);
          return newState;
        });
        return true;
      }

      set(state => {
        const newState = {
          ...state,
          isLoggedIn: true,
          user: {
            ...state.user,
            username,
            email,
            password,
            createdAt: new Date().toISOString(),
          },
        };
        saveState(newState);
        return newState;
      });
      return true;
    },

    login: async (email, password) => {
      if (isApiEnabled()) {
        const { user, token } = await authApi.login({ email, password });
        setToken(token);
        await migrateLegacyDataIfNeeded();
        const hydrated = await fetchFullUserState();
        set(() => {
          const newState = {
            ...defaultState,
            ...hydrated,
            isLoggedIn: true,
            user: { ...hydrated.user, email: user.email },
          };
          saveState(newState);
          return newState;
        });
        return true;
      }

      const state = get();
      if (state.user.email === email && state.user.password === password) {
        set(s => {
          const newState = { ...s, isLoggedIn: true };
          saveState(newState);
          return newState;
        });
        return true;
      }
      return false;
    },

    /** Restore session from JWT on app load */
    restoreSession: async () => {
      if (!isApiEnabled() || !getToken()) return false;
      try {
        await migrateLegacyDataIfNeeded();
        const hydrated = await fetchFullUserState();
        set(state => {
          const newState = { ...state, ...hydrated, isLoggedIn: true };
          saveState(newState);
          return newState;
        });
        return true;
      } catch {
        setToken(null);
        return false;
      }
    },

    logout: () => {
      setToken(null);
      set(state => {
        const newState = { ...state, isLoggedIn: false };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Onboarding ---- */
    setAvatar: async (avatar) => {
      await syncProfile({ avatar });
      set(state => {
        const newState = {
          ...state,
          user: { ...state.user, avatar },
        };
        saveState(newState);
        return newState;
      });
    },

    setMonthlyIncome: async (amount) => {
      const monthlyIncome = Number(amount);
      await syncProfile({ monthlyIncome });
      set(state => {
        const newState = { ...state, monthlyIncome };
        saveState(newState);
        return newState;
      });
    },

    setSalaryDate: async (day) => {
      const salaryDate = Number(day);
      await syncProfile({ salaryDate });
      set(state => {
        const newState = { ...state, salaryDate };
        saveState(newState);
        return newState;
      });
    },

    setVaultContribution: async (amount) => {
      const monthlyContribution = Number(amount);
      await syncVault({ monthlyContribution });
      set(state => {
        const newState = {
          ...state,
          vault: { ...state.vault, monthlyContribution },
        };
        saveState(newState);
        return newState;
      });
    },

    completeOnboarding: async () => {
      const state = get();
      const currentSavings = state.vault.monthlyContribution;
      await syncProfile({ isOnboarded: true });
      await syncVault({ currentSavings });
      set(s => {
        const newState = {
          ...s,
          isOnboarded: true,
          vault: {
            ...s.vault,
            currentSavings,
          },
        };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Bills ---- */
    addBill: async (bill) => {
      let newBill = {
        id: Date.now().toString(),
        isPaid: false,
        ...bill,
      };
      const synced = await syncCreateBill(newBill);
      if (synced) newBill = synced;

      set(state => {
        const newState = {
          ...state,
          bills: [...state.bills, newBill],
        };
        saveState(newState);
        return newState;
      });
    },

    updateBill: async (id, updates) => {
      await syncUpdateBill(id, updates);
      set(state => {
        const newState = {
          ...state,
          bills: state.bills.map(b => b.id === id ? { ...b, ...updates } : b),
        };
        saveState(newState);
        return newState;
      });
    },

    deleteBill: async (id) => {
      await syncDeleteBill(id);
      set(state => {
        const newState = {
          ...state,
          bills: state.bills.filter(b => b.id !== id),
        };
        saveState(newState);
        return newState;
      });
    },

    toggleBillPaid: async (id) => {
      const bill = get().bills.find(b => b.id === id);
      if (bill) await syncUpdateBill(id, { isPaid: !bill.isPaid });
      set(state => {
        const newState = {
          ...state,
          bills: state.bills.map(b =>
            b.id === id ? { ...b, isPaid: !b.isPaid } : b
          ),
        };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Expenses ---- */
    addExpense: async (expense) => {
      let newExpense = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...expense,
      };
      const synced = await syncCreateExpense(newExpense);
      if (synced) newExpense = synced;

      set(state => {
        const newState = {
          ...state,
          expenses: [newExpense, ...state.expenses],
        };

        const newlyUnlocked = checkAchievements(newState);
        if (newlyUnlocked.length > 0) {
          const totalXP = newlyUnlocked.reduce((sum, a) => {
            const ach = ALL_ACHIEVEMENTS.find(x => x.name === a.name);
            return sum + (ach?.xp || 0);
          }, 0);
          newState.achievements = [...state.achievements, ...newlyUnlocked];
          newState.user = {
            ...state.user,
            xp: state.user.xp + totalXP,
          };
          const newLevel = Math.floor((state.user.xp + totalXP) / 100) + 1;
          const titles = ['Bronze Saver', 'Silver Saver', 'Gold Saver', 'Diamond Saver', 'Treasure Master'];
          const titleIdx = Math.min(Math.floor((newLevel - 1) / 2), titles.length - 1);
          newState.user.level = newLevel;
          newState.user.title = titles[titleIdx];
        }

        saveState(newState);
        return newState;
      });

      const updated = get().user;
      if (isApiEnabled()) {
        await syncProfile({
          xp: updated.xp,
          level: updated.level,
          title: updated.title,
        }).catch(() => {});
      }
    },

    updateExpense: async (id, updates) => {
      await syncUpdateExpense(id, updates);
      set(state => {
        const newState = {
          ...state,
          expenses: state.expenses.map(e =>
            e.id === id ? { ...e, ...updates } : e
          ),
        };
        saveState(newState);
        return newState;
      });
    },

    deleteExpense: async (id) => {
      await syncDeleteExpense(id);
      set(state => {
        const newState = {
          ...state,
          expenses: state.expenses.filter(e => e.id !== id),
        };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Goals ---- */
    addGoal: async (goal) => {
      let newGoal = {
        id: Date.now().toString(),
        currentAmount: 0,
        createdAt: new Date().toISOString(),
        ...goal,
      };
      const synced = await syncCreateGoal(newGoal);
      if (synced) newGoal = synced;

      set(state => {
        const newState = {
          ...state,
          goals: [...state.goals, newGoal],
        };
        saveState(newState);
        return newState;
      });
    },

    updateGoal: async (id, updates) => {
      await syncUpdateGoal(id, updates);
      set(state => {
        const newState = {
          ...state,
          goals: state.goals.map(g =>
            g.id === id ? { ...g, ...updates } : g
          ),
        };
        saveState(newState);
        return newState;
      });
    },

    deleteGoal: async (id) => {
      await syncDeleteGoal(id);
      set(state => {
        const newState = {
          ...state,
          goals: state.goals.filter(g => g.id !== id),
        };
        saveState(newState);
        return newState;
      });
    },

    addToGoal: async (id, amount) => {
      const goal = get().goals.find(g => g.id === id);
      const currentAmount = (goal?.currentAmount || 0) + Number(amount);
      await syncUpdateGoal(id, { currentAmount });

      set(state => {
        const newState = {
          ...state,
          goals: state.goals.map(g =>
            g.id === id ? { ...g, currentAmount } : g
          ),
        };

        const newlyUnlocked = checkAchievements(newState);
        if (newlyUnlocked.length > 0) {
          const totalXP = newlyUnlocked.reduce((sum, a) => {
            const ach = ALL_ACHIEVEMENTS.find(x => x.name === a.name);
            return sum + (ach?.xp || 0);
          }, 0);
          newState.achievements = [...state.achievements, ...newlyUnlocked];
          newState.user = {
            ...state.user,
            xp: state.user.xp + totalXP,
          };
          const newLevel = Math.floor((state.user.xp + totalXP) / 100) + 1;
          const titles = ['Bronze Saver', 'Silver Saver', 'Gold Saver', 'Diamond Saver', 'Treasure Master'];
          const titleIdx = Math.min(Math.floor((newLevel - 1) / 2), titles.length - 1);
          newState.user.level = newLevel;
          newState.user.title = titles[titleIdx];
        }

        saveState(newState);
        return newState;
      });

      const updated = get().user;
      if (isApiEnabled()) {
        await syncProfile({
          xp: updated.xp,
          level: updated.level,
          title: updated.title,
        }).catch(() => {});
      }
    },

    /* ---- Vault ---- */
    addToVault: async (amount) => {
      const depositAmount = Number(amount);
      const syncedVault = await syncVaultDeposit(depositAmount);

      set(state => {
        const historyEntry = syncedVault?.history?.[0]
          ? {
              month: syncedVault.history[0].month,
              year: syncedVault.history[0].year,
              amount: syncedVault.history[0].amount,
              date: syncedVault.history[0].date,
            }
          : {
              month: new Date().getMonth(),
              year: new Date().getFullYear(),
              amount: depositAmount,
              date: new Date().toISOString(),
            };

        const newState = {
          ...state,
          vault: {
            ...state.vault,
            currentSavings: syncedVault?.currentSavings ?? state.vault.currentSavings + depositAmount,
            history: [...state.vault.history, historyEntry],
          },
        };

        const newlyUnlocked = checkAchievements(newState);
        if (newlyUnlocked.length > 0) {
          const totalXP = newlyUnlocked.reduce((sum, a) => {
            const ach = ALL_ACHIEVEMENTS.find(x => x.name === a.name);
            return sum + (ach?.xp || 0);
          }, 0);
          newState.achievements = [...state.achievements, ...newlyUnlocked];
          newState.user = {
            ...state.user,
            xp: state.user.xp + totalXP,
          };
          const newLevel = Math.floor((state.user.xp + totalXP) / 100) + 1;
          const titles = ['Bronze Saver', 'Silver Saver', 'Gold Saver', 'Diamond Saver', 'Treasure Master'];
          const titleIdx = Math.min(Math.floor((newLevel - 1) / 2), titles.length - 1);
          newState.user.level = newLevel;
          newState.user.title = titles[titleIdx];
        }

        saveState(newState);
        return newState;
      });

      const updated = get().user;
      if (isApiEnabled()) {
        await syncProfile({
          xp: updated.xp,
          level: updated.level,
          title: updated.title,
        }).catch(() => {});
      }
    },

    /* ---- XP & Level ---- */
    addXP: async (amount) => {
      const newXP = get().user.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const titles = ['Bronze Saver', 'Silver Saver', 'Gold Saver', 'Diamond Saver', 'Treasure Master'];
      const titleIdx = Math.min(Math.floor((newLevel - 1) / 2), titles.length - 1);
      const title = titles[titleIdx];

      await syncProfile({ xp: newXP, level: newLevel, title });

      set(state => {
        const newState = {
          ...state,
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel,
            title,
          },
        };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Achievements ---- */
    unlockAchievement: (name) => {
      set(state => {
        if (state.achievements.find(a => a.name === name)) return state;
        const newState = {
          ...state,
          achievements: [
            ...state.achievements,
            { id: Date.now().toString(), name, unlockedAt: new Date().toISOString() },
          ],
          user: {
            ...state.user,
            xp: state.user.xp + 50,
          },
        };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Notifications ---- */
    addNotification: (message, type = 'info') => {
      set(state => {
        const newState = {
          ...state,
          notifications: [
            { id: Date.now().toString(), message, type, read: false, createdAt: new Date().toISOString() },
            ...state.notifications,
          ].slice(0, 50),
        };
        saveState(newState);
        return newState;
      });
    },

    markNotificationRead: (id) => {
      set(state => {
        const newState = {
          ...state,
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        };
        saveState(newState);
        return newState;
      });
    },

    clearNotifications: () => {
      set(state => {
        const newState = { ...state, notifications: [] };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Update Profile ---- */
    updateProfile: async (updates) => {
      const profileFields = {};
      if (updates.username !== undefined) profileFields.username = updates.username;
      if (updates.avatar !== undefined) profileFields.avatar = updates.avatar;
      if (updates.level !== undefined) profileFields.level = updates.level;
      if (updates.xp !== undefined) profileFields.xp = updates.xp;
      if (updates.title !== undefined) profileFields.title = updates.title;
      if (Object.keys(profileFields).length > 0) {
        await syncProfile(profileFields);
      }

      set(state => {
        const newState = {
          ...state,
          user: { ...state.user, ...updates },
        };
        saveState(newState);
        return newState;
      });
    },

    /* ---- Reset ---- */
    resetAll: () => {
      localStorage.removeItem(STORAGE_KEY);
      set(defaultState);
    },

    /* ---- Computed Getters ---- */
    getTotalBills: () => {
      return get().bills.reduce((sum, b) => sum + Number(b.amount), 0);
    },

    getPaidBills: () => {
      return get().bills.filter(b => b.isPaid);
    },

    getUnpaidBills: () => {
      return get().bills.filter(b => !b.isPaid);
    },

    getTotalExpensesThisMonth: () => {
      const now = new Date();
      return get().expenses
        .filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
    },

    getExpensesByCategory: () => {
      const now = new Date();
      const monthly = get().expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const cats = {};
      monthly.forEach(e => {
        cats[e.category] = (cats[e.category] || 0) + Number(e.amount);
      });
      return Object.entries(cats).map(([name, value]) => ({ name, value }));
    },

    getSafeSpendingBudget: () => {
      const state = get();
      return state.monthlyIncome - state.vault.monthlyContribution - state.getTotalBills();
    },

    getRemainingBudget: () => {
      const state = get();
      return state.getSafeSpendingBudget() - state.getTotalExpensesThisMonth();
    },

    getDaysUntilSalary: () => {
      const state = get();
      const now = new Date();
      const salaryDay = state.salaryDate;
      let nextSalary = new Date(now.getFullYear(), now.getMonth(), salaryDay);
      if (nextSalary <= now) {
        nextSalary = new Date(now.getFullYear(), now.getMonth() + 1, salaryDay);
      }
      const diff = Math.ceil((nextSalary - now) / (1000 * 60 * 60 * 24));
      return diff;
    },

    getDailySpendingLimit: () => {
      const state = get();
      const remaining = state.getRemainingBudget();
      const days = state.getDaysUntilSalary();
      if (days <= 0) return remaining;
      return Math.max(0, Math.round(remaining / days));
    },

    getFinancialHealthScore: () => {
      const state = get();
      const budget = state.getSafeSpendingBudget();
      if (budget <= 0) return 50;

      const remaining = state.getRemainingBudget();
      const days = state.getDaysUntilSalary();
      const totalDays = 30;
      const daysPassed = totalDays - days;

      // Expected spending rate
      const expectedSpent = daysPassed > 0 ? (budget / totalDays) * daysPassed : 0;
      const actualSpent = state.getTotalExpensesThisMonth();

      // Score components
      const spendingRatio = expectedSpent > 0 ? Math.min(actualSpent / expectedSpent, 2) : 0;
      const spendingScore = Math.max(0, 100 - (spendingRatio - 1) * 100);

      const billsPaid = state.bills.length > 0
        ? (state.getPaidBills().length / state.bills.length) * 100
        : 100;

      const remainingRatio = budget > 0 ? (remaining / budget) * 100 : 0;

      // Weighted score
      const score = Math.round(
        spendingScore * 0.4 +
        billsPaid * 0.3 +
        remainingRatio * 0.3
      );

      return Math.max(0, Math.min(100, score));
    },
  };
});

export default useStore;
