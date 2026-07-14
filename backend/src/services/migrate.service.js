import { prisma } from '../lib/prisma.js';
import { ConflictError } from '../utils/errors.js';

/**
 * Migrates legacy localStorage payload into PostgreSQL.
 * Idempotent: skips if user.migratedFromLocal is already true.
 */
export async function migrateLocalStorageData(userId, localData) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ConflictError('User not found');
  if (user.migratedFromLocal) {
    return { migrated: false, reason: 'already_migrated' };
  }

  const profile = localData.user || {};

  // Only migrate if localStorage email matches the authenticated user
  if (profile.email && profile.email.toLowerCase() !== user.email.toLowerCase()) {
    return { migrated: false, reason: 'email_mismatch' };
  }
  const vault = localData.vault || {};
  const expenses = localData.expenses || [];
  const bills = localData.bills || [];
  const goals = localData.goals || [];
  const achievements = localData.achievements || [];

  await prisma.$transaction(async (tx) => {
    // Update user profile fields from localStorage
    await tx.user.update({
      where: { id: userId },
      data: {
        username: profile.username || user.username,
        avatar: profile.avatar || user.avatar,
        level: profile.level ?? user.level,
        xp: profile.xp ?? user.xp,
        title: profile.title || user.title,
        monthlyIncome: localData.monthlyIncome ?? Number(user.monthlyIncome),
        initialBalance: localData.initialBalance ?? Number(user.initialBalance),
        salaryDate: localData.salaryDate ?? user.salaryDate,
        isOnboarded: localData.isOnboarded ?? user.isOnboarded,
        migratedFromLocal: true,
      },
    });

    // Vault
    let securityVault = await tx.securityVault.findUnique({ where: { userId } });
    if (!securityVault) {
      securityVault = await tx.securityVault.create({ data: { userId } });
    }

    await tx.securityVault.update({
      where: { userId },
      data: {
        monthlyContribution: vault.monthlyContribution ?? 0,
        currentSavings: vault.currentSavings ?? 0,
      },
    });

    if (Array.isArray(vault.history)) {
      for (const entry of vault.history) {
        await tx.vaultHistory.create({
          data: {
            vaultId: securityVault.id,
            amount: entry.amount ?? 0,
            month: entry.month ?? new Date().getMonth(),
            year: entry.year ?? new Date().getFullYear(),
            depositedAt: entry.date ? new Date(entry.date) : new Date(),
          },
        });
      }
    }

    // Expenses → transactions
    for (const exp of expenses) {
      await tx.transaction.create({
        data: {
          userId,
          type: 'EXPENSE',
          name: exp.name || 'Expense',
          amount: exp.amount ?? 0,
          category: exp.category,
          date: exp.date ? new Date(exp.date) : new Date(),
          notes: exp.notes,
        },
      });
    }

    // Bills → transactions
    for (const bill of bills) {
      await tx.transaction.create({
        data: {
          userId,
          type: 'BILL',
          name: bill.name || 'Bill',
          amount: bill.amount ?? 0,
          category: bill.category,
          isPaid: bill.isPaid ?? false,
          dueDate: bill.dueDate,
          date: new Date(),
        },
      });
    }

    // Goals
    for (const goal of goals) {
      await tx.goal.create({
        data: {
          userId,
          name: goal.name || 'Goal',
          targetAmount: goal.targetAmount ?? goal.target ?? 0,
          currentAmount: goal.currentAmount ?? goal.saved ?? 0,
          deadline: goal.deadline ? new Date(goal.deadline) : null,
          createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
        },
      });
    }

    // Achievements — match by name to seeded slugs
    const allAchievements = await tx.achievement.findMany();
    for (const ach of achievements) {
      const match = allAchievements.find(
        (a) => a.slug === ach.id || a.name === ach.name
      );
      if (match) {
        await tx.userAchievement.upsert({
          where: {
            userId_achievementId: { userId, achievementId: match.id },
          },
          create: {
            userId,
            achievementId: match.id,
            unlockedAt: ach.unlockedAt ? new Date(ach.unlockedAt) : new Date(),
          },
          update: {},
        });
      }
    }
  });

  return { migrated: true };
}
