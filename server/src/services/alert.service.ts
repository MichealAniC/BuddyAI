import prisma from '../config/prisma';

export async function getAlerts(filters?: { status?: string; riskLevel?: string }) {
  const where: any = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.riskLevel) where.riskLevel = filters.riskLevel;

  return prisma.riskAlert.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      assessment: { select: { totalScore: true, severityLevel: true, completedAt: true } },
    },
  });
}

export async function getAlertById(id: number) {
  return prisma.riskAlert.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      assessment: true,
    },
  });
}

export async function updateAlertStatus(id: number, status: 'PENDING' | 'REVIEWED' | 'RESOLVED') {
  return prisma.riskAlert.update({
    where: { id },
    data: { status },
  });
}

export async function getStudentSummary(userId: number) {
  const [user, latestAssessment, recentMoods, recentMessages, recommendations] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, fullName: true, email: true, createdAt: true } }),
    prisma.phq9Assessment.findFirst({ where: { userId }, orderBy: { completedAt: 'desc' } }),
    prisma.moodEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 14 }),
    prisma.message.findMany({ where: { conversation: { userId }, sender: 'USER', sentiment: { not: null } }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.recommendation.findMany({ where: { userId }, orderBy: { generatedAt: 'desc' }, take: 5 }),
  ]);

  const moodAvg = recentMoods.length > 0
    ? Math.round((recentMoods.reduce((sum: number, m: { moodRating: number }) => sum + m.moodRating, 0) / recentMoods.length) * 100) / 100
    : null;

  const sentimentBreakdown = {
    positive: recentMessages.filter((m: { sentiment: string | null }) => m.sentiment === 'POSITIVE').length,
    neutral: recentMessages.filter((m: { sentiment: string | null }) => m.sentiment === 'NEUTRAL').length,
    negative: recentMessages.filter((m: { sentiment: string | null }) => m.sentiment === 'NEGATIVE').length,
  };

  return {
    user,
    latestAssessment,
    moodSummary: { average: moodAvg, recentEntries: recentMoods },
    sentimentBreakdown,
    recommendations,
  };
}
