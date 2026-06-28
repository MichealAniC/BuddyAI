import prisma from '../config/prisma';

export async function getDashboardStats() {
  const [totalAlerts, pendingAlerts, underReviewAlerts, followUpAlerts, resolvedAlerts, totalStudents, riskDistribution] = await Promise.all([
    prisma.riskAlert.count(),
    prisma.riskAlert.count({ where: { status: 'PENDING' } }),
    prisma.riskAlert.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.riskAlert.count({ where: { status: 'FOLLOW_UP_SCHEDULED' } }),
    prisma.riskAlert.count({ where: { status: 'RESOLVED' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.riskAlert.groupBy({ by: ['riskLevel'], _count: { id: true } }),
  ]);

  return {
    alerts: {
      total: totalAlerts,
      pending: pendingAlerts,
      underReview: underReviewAlerts,
      followUpScheduled: followUpAlerts,
      resolved: resolvedAlerts,
    },
    totalStudents,
    riskDistribution: riskDistribution.map((r: { riskLevel: string; _count: { id: number } }) => ({ level: r.riskLevel, count: r._count.id })),
  };
}
