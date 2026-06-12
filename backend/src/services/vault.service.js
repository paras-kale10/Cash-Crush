import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../utils/errors.js';

export async function getVault(userId) {
  let vault = await prisma.securityVault.findUnique({
    where: { userId },
    include: {
      history: { orderBy: { depositedAt: 'desc' }, take: 100 },
    },
  });

  if (!vault) {
    vault = await prisma.securityVault.create({
      data: { userId },
      include: { history: true },
    });
  }

  return formatVault(vault);
}

export async function updateVault(userId, data) {
  let vault = await prisma.securityVault.findUnique({ where: { userId } });
  if (!vault) {
    vault = await prisma.securityVault.create({ data: { userId } });
  }

  const updates = {};
  if (data.monthlyContribution !== undefined) {
    updates.monthlyContribution = data.monthlyContribution;
  }
  if (data.currentSavings !== undefined) {
    updates.currentSavings = data.currentSavings;
  }

  if (data.depositAmount) {
    updates.currentSavings = Number(vault.currentSavings) + data.depositAmount;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.securityVault.update({
      where: { userId },
      data: updates,
    });

    if (data.depositAmount) {
      const now = new Date();
      await tx.vaultHistory.create({
        data: {
          vaultId: result.id,
          amount: data.depositAmount,
          month: now.getMonth(),
          year: now.getFullYear(),
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: 'VAULT_DEPOSIT',
          name: 'Vault Deposit',
          amount: data.depositAmount,
          category: 'Vault',
          date: now,
        },
      });
    }

    return tx.securityVault.findUnique({
      where: { userId },
      include: { history: { orderBy: { depositedAt: 'desc' }, take: 100 } },
    });
  });

  return formatVault(updated);
}

function formatVault(vault) {
  return {
    id: vault.id,
    monthlyContribution: Number(vault.monthlyContribution),
    currentSavings: Number(vault.currentSavings),
    history: vault.history.map((h) => ({
      id: h.id,
      amount: Number(h.amount),
      month: h.month,
      year: h.year,
      date: h.depositedAt,
    })),
    createdAt: vault.createdAt,
    updatedAt: vault.updatedAt,
  };
}
