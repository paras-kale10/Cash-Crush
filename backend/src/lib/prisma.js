import { env } from '../config/env.js';

process.env.DATABASE_URL ||= env.databaseUrl;
process.env.JWT_SECRET ||= env.jwtSecret;

const { PrismaClient } = await import('@prisma/client');

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.nodeEnv === 'development' ? ['error', 'warn'] : ['error'],
  });

if (env.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}
