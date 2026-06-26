import prisma from '../config/prisma';

export async function createMoodEntry(userId: number, moodRating: number, notes?: string) {
  return prisma.moodEntry.create({
    data: { userId, moodRating, notes },
  });
}

export async function getMoodHistory(userId: number, startDate?: Date, endDate?: Date) {
  const where: any = { userId };
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }
  return prisma.moodEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMoodTrends(userId: number) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentEntries = await prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
  });

  const olderEntries = await prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: thirtyDaysAgo, lt: sevenDaysAgo } },
  });

  const recentAvg = recentEntries.length > 0
    ? recentEntries.reduce((sum: number, e: { moodRating: number }) => sum + e.moodRating, 0) / recentEntries.length
    : null;

  const olderAvg = olderEntries.length > 0
    ? olderEntries.reduce((sum: number, e: { moodRating: number }) => sum + e.moodRating, 0) / olderEntries.length
    : null;

  let direction: 'improving' | 'stable' | 'declining' | 'insufficient_data' = 'insufficient_data';
  if (recentAvg !== null && olderAvg !== null) {
    const diff = recentAvg - olderAvg;
    if (diff > 0.5) direction = 'improving';
    else if (diff < -0.5) direction = 'declining';
    else direction = 'stable';
  }

  return {
    recentAverage: recentAvg ? Math.round(recentAvg * 100) / 100 : null,
    thirtyDayAverage: olderAvg ? Math.round(olderAvg * 100) / 100 : null,
    direction,
    totalEntries: recentEntries.length + olderEntries.length,
  };
}
