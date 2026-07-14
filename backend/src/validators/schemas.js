import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(50).trim(),
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(6).max(128),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(50).trim().optional(),
    avatar: z.string().min(1).max(50).optional(),
    monthlyIncome: z.number().min(0).optional(),
    initialBalance: z.number().min(0).optional(),
    salaryDate: z.number().int().min(1).max(31).optional(),
    isOnboarded: z.boolean().optional(),
    level: z.number().int().min(1).optional(),
    xp: z.number().int().min(0).optional(),
    title: z.string().max(100).optional(),
    achievements: z.array(z.string()).optional(),
  }),
});

export const transactionSchema = z.object({
  body: z.object({
    type: z.enum(['EXPENSE', 'BILL', 'VAULT_DEPOSIT', 'INCOME']),
    name: z.string().min(1).max(200).trim(),
    amount: z.number().positive(),
    category: z.string().max(100).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().max(500).optional(),
    isPaid: z.boolean().optional(),
    dueDate: z.number().int().min(1).max(31).optional(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    type: z.enum(['EXPENSE', 'BILL', 'VAULT_DEPOSIT', 'INCOME']).optional(),
    name: z.string().min(1).max(200).trim().optional(),
    amount: z.number().positive().optional(),
    category: z.string().max(100).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().max(500).optional(),
    isPaid: z.boolean().optional(),
    dueDate: z.number().int().min(1).max(31).optional(),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const goalSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).trim(),
    targetAmount: z.number().positive(),
    currentAmount: z.number().min(0).optional(),
    deadline: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional().nullable(),
  }),
});

export const updateGoalSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(1).max(200).trim().optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().min(0).optional(),
    deadline: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional().nullable(),
  }),
});

export const goalIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const vaultUpdateSchema = z.object({
  body: z.object({
    monthlyContribution: z.number().min(0).optional(),
    currentSavings: z.number().min(0).optional(),
    depositAmount: z.number().positive().optional(),
  }),
});

export const migrateLocalSchema = z.object({
  body: z.object({
    localData: z.record(z.unknown()),
  }),
});

export const transactionQuerySchema = z.object({
  query: z.object({
    type: z.enum(['EXPENSE', 'BILL', 'VAULT_DEPOSIT', 'INCOME']).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  }),
});
