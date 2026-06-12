import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';

export async function registerUser({ username, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('Email already registered');

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      securityVault: { create: {} },
    },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      isOnboarded: true,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      isOnboarded: user.isOnboarded,
      migratedFromLocal: user.migratedFromLocal,
    },
    token,
  };
}
