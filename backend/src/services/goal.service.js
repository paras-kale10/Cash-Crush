import { prisma } from '../lib/prisma.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

function formatGoal(g) {
  return {
    ...g,
    targetAmount: Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
  };
}

export async function listGoals(userId) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return goals.map(formatGoal);
}

export async function createGoal(userId, data) {
  const goal = await prisma.goal.create({
    data: {
      userId,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount ?? 0,
      deadline: data.deadline ? new Date(data.deadline) : null,
    },
  });
  return formatGoal(goal);
}

export async function updateGoal(userId, id, data) {
  const existing = await prisma.goal.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Goal not found');
  if (existing.userId !== userId) throw new ForbiddenError();

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.targetAmount !== undefined && { targetAmount: data.targetAmount }),
      ...(data.currentAmount !== undefined && { currentAmount: data.currentAmount }),
      ...(data.deadline !== undefined && {
        deadline: data.deadline ? new Date(data.deadline) : null,
      }),
    },
  });
  return formatGoal(goal);
}

export async function deleteGoal(userId, id) {
  const existing = await prisma.goal.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Goal not found');
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.goal.delete({ where: { id } });
  return { deleted: true };
}
