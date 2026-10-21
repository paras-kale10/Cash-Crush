import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`🚀 CashCrush API running on http://localhost:${env.port}`);
    console.log(`   Environment: ${env.nodeEnv}`);
  });
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
