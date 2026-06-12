import { prisma } from '../lib/prisma.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

function formatTransaction(t) {
  return {
    ...t,
    amount: Number(t.amount),
  };
}

export async function listTransactions(userId, { type, limit = 100, offset = 0 } = {}) {
  const where = { userId, ...(type && { type }) };

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    items: items.map(formatTransaction),
    total,
    limit,
    offset,
  };
}

export async function createTransaction(userId, data) {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: data.type,
      name: data.name,
      amount: data.amount,
      category: data.category,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes,
      isPaid: data.isPaid ?? false,
      dueDate: data.dueDate,
    },
  });
  return formatTransaction(transaction);
}

export async function updateTransaction(userId, id, data) {
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Transaction not found');
  if (existing.userId !== userId) throw new ForbiddenError();

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.isPaid !== undefined && { isPaid: data.isPaid }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
    },
  });
  return formatTransaction(transaction);
}

export async function deleteTransaction(userId, id) {
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Transaction not found');
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.transaction.delete({ where: { id } });
  return { deleted: true };
}
