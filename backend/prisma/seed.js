import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACHIEVEMENTS = [
  { slug: 'first-tracker', name: 'First Tracker', description: 'Track your first expense', icon: '📝', xp: 50 },
  { slug: 'first-saver', name: 'First Saver', description: 'Make your first savings deposit', icon: '💰', xp: 50 },
  { slug: 'bill-payer', name: 'Bill Payer', description: 'Pay your first bill on time', icon: '✅', xp: 30 },
  { slug: 'budget-master', name: 'Budget Master', description: 'Stay within budget for a full month', icon: '👑', xp: 100 },
  { slug: 'goal-setter', name: 'Goal Setter', description: 'Create your first savings goal', icon: '🎯', xp: 30 },
  { slug: 'goal-achiever', name: 'Goal Achiever', description: 'Complete a savings goal', icon: '🏆', xp: 200 },
  { slug: 'vault-guardian', name: 'Vault Guardian', description: 'Save ₹10,000 in your vault', icon: '🛡️', xp: 150 },
  { slug: 'treasure-hunter', name: 'Treasure Hunter', description: 'Track 50 expenses', icon: '🗺️', xp: 100 },
  { slug: 'streak-saver', name: 'Streak Saver', description: 'Save for 3 consecutive months', icon: '🔥', xp: 120 },
  { slug: 'level-up', name: 'Level Up', description: 'Reach level 5', icon: '⭐', xp: 75 },
];

async function main() {
  for (const ach of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { slug: ach.slug },
      update: ach,
      create: ach,
    });
  }
  console.log(`Seeded ${ACHIEVEMENTS.length} achievements`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
