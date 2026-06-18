import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../utils/errors.js';

const userProfileSelect = {
  id: true,
  email: true,
  username: true,
  avatar: true,
  level: true,
  xp: true,
  title: true,
  monthlyIncome: true,
  salaryDate: true,
  isOnboarded: true,
  migratedFromLocal: true,
  createdAt: true,
  updatedAt: true,
  securityVault: {
    select: {
      id: true,
      monthlyContribution: true,
      currentSavings: true,
      history: {
        orderBy: { depositedAt: 'desc' },
        take: 50,
      },
    },
  },
  userAchievements: {
    select: {
      unlockedAt: true,
      achievement: {
        select: { slug: true, name: true, description: true, icon: true, xp: true },
      },
    },
  },
};

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userProfileSelect,
  });
  if (!user) throw new NotFoundError('User not found');
  return formatProfile(user);
}

export async function updateUserProfile(userId, data) {
  const userUpdate = {
    ...(data.username !== undefined && { username: data.username }),
    ...(data.avatar !== undefined && { avatar: data.avatar }),
    ...(data.monthlyIncome !== undefined && { monthlyIncome: data.monthlyIncome }),
    ...(data.salaryDate !== undefined && { salaryDate: data.salaryDate }),
    ...(data.isOnboarded !== undefined && { isOnboarded: data.isOnboarded }),
    ...(data.level !== undefined && { level: data.level }),
    ...(data.xp !== undefined && { xp: data.xp }),
    ...(data.title !== undefined && { title: data.title }),
  };

  if (data.achievements !== undefined) {
    const allAchievements = await prisma.achievement.findMany();
    for (const name of data.achievements) {
      const match = allAchievements.find(
        (a) => a.name.toLowerCase() === name.toLowerCase()
      );
      if (match) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: match.id,
            },
          },
          update: {},
          create: {
            userId,
            achievementId: match.id,
          },
        });
      }
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: userUpdate,
    select: userProfileSelect,
  });
  return formatProfile(user);
}

function formatProfile(user) {
  return {
    ...user,
    monthlyIncome: Number(user.monthlyIncome),
    securityVault: user.securityVault
      ? {
          ...user.securityVault,
          monthlyContribution: Number(user.securityVault.monthlyContribution),
          currentSavings: Number(user.securityVault.currentSavings),
          history: user.securityVault.history.map((h) => ({
            ...h,
            amount: Number(h.amount),
          })),
        }
      : null,
    achievements: user.userAchievements.map((ua) => ({
      slug: ua.achievement.slug,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      xp: ua.achievement.xp,
      unlockedAt: ua.unlockedAt,
    })),
    userAchievements: undefined,
  };
}
