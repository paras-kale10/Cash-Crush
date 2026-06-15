import { isApiEnabled } from '../api/client.js';
import { userApi, transactionApi, goalApi, vaultApi } from '../api/services.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isApiId(id) {
  return typeof id === 'string' && UUID_RE.test(id);
}

function logSyncError(action, err) {
  console.warn(`Failed to sync ${action} to API:`, err);
}

export async function syncProfile(data) {
  if (!isApiEnabled()) return;
  try {
    await userApi.updateProfile(data);
  } catch (err) {
    logSyncError('profile', err);
    throw err;
  }
}

export async function syncVault(data) {
  if (!isApiEnabled()) return;
  try {
    await vaultApi.update(data);
  } catch (err) {
    logSyncError('vault', err);
    throw err;
  }
}

export async function syncCreateBill(bill) {
  if (!isApiEnabled()) return null;
  try {
    const created = await transactionApi.create({
      type: 'BILL',
      name: bill.name,
      amount: Number(bill.amount),
      category: bill.category || 'Other',
      dueDate: bill.dueDate,
      isPaid: bill.isPaid ?? false,
    });
    return {
      id: created.id,
      name: created.name,
      amount: created.amount,
      category: created.category || 'Other',
      dueDate: created.dueDate,
      isPaid: created.isPaid,
    };
  } catch (err) {
    logSyncError('bill create', err);
    throw err;
  }
}

export async function syncUpdateBill(id, updates) {
  if (!isApiEnabled() || !isApiId(id)) return;
  try {
    await transactionApi.update(id, {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.amount !== undefined && { amount: Number(updates.amount) }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
      ...(updates.isPaid !== undefined && { isPaid: updates.isPaid }),
    });
  } catch (err) {
    logSyncError('bill update', err);
    throw err;
  }
}

export async function syncDeleteBill(id) {
  if (!isApiEnabled() || !isApiId(id)) return;
  try {
    await transactionApi.delete(id);
  } catch (err) {
    logSyncError('bill delete', err);
    throw err;
  }
}

export async function syncCreateExpense(expense) {
  if (!isApiEnabled()) return null;
  try {
    const created = await transactionApi.create({
      type: 'EXPENSE',
      name: expense.name,
      amount: Number(expense.amount),
      category: expense.category || 'Other',
      date: expense.date,
      notes: expense.notes || '',
    });
    return {
      id: created.id,
      name: created.name,
      amount: created.amount,
      category: created.category || 'Other',
      date: created.date,
      notes: created.notes || '',
    };
  } catch (err) {
    logSyncError('expense create', err);
    throw err;
  }
}

export async function syncUpdateExpense(id, updates) {
  if (!isApiEnabled() || !isApiId(id)) return;
  try {
    await transactionApi.update(id, {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.amount !== undefined && { amount: Number(updates.amount) }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.date !== undefined && { date: updates.date }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
    });
  } catch (err) {
    logSyncError('expense update', err);
    throw err;
  }
}

export async function syncDeleteExpense(id) {
  if (!isApiEnabled() || !isApiId(id)) return;
  try {
    await transactionApi.delete(id);
  } catch (err) {
    logSyncError('expense delete', err);
    throw err;
  }
}

export async function syncCreateGoal(goal) {
  if (!isApiEnabled()) return null;
  try {
    const created = await goalApi.create({
      name: goal.name,
      targetAmount: Number(goal.targetAmount),
      currentAmount: Number(goal.currentAmount ?? 0),
      deadline: goal.deadline || null,
    });
    return {
      id: created.id,
      name: created.name,
      targetAmount: created.targetAmount,
      currentAmount: created.currentAmount,
      deadline: created.deadline,
      createdAt: created.createdAt,
    };
  } catch (err) {
    logSyncError('goal create', err);
    throw err;
  }
}

export async function syncUpdateGoal(id, updates) {
  if (!isApiEnabled() || !isApiId(id)) return;
  try {
    await goalApi.update(id, {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.targetAmount !== undefined && { targetAmount: Number(updates.targetAmount) }),
      ...(updates.currentAmount !== undefined && { currentAmount: Number(updates.currentAmount) }),
      ...(updates.deadline !== undefined && { deadline: updates.deadline }),
    });
  } catch (err) {
    logSyncError('goal update', err);
    throw err;
  }
}

export async function syncDeleteGoal(id) {
  if (!isApiEnabled() || !isApiId(id)) return;
  try {
    await goalApi.delete(id);
  } catch (err) {
    logSyncError('goal delete', err);
    throw err;
  }
}

export async function syncVaultDeposit(amount) {
  if (!isApiEnabled()) return null;
  try {
    return await vaultApi.update({ depositAmount: Number(amount) });
  } catch (err) {
    logSyncError('vault deposit', err);
    throw err;
  }
}
