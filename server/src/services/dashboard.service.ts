import prisma from '../config/prisma';

export async function getDashboardStats() {
  const [totalAlerts, pendingAlerts, reviewedAlerts, resolvedAlerts, totalStudents, riskDistribution] = await Promise.all([
    prisma.riskAlert.count(),
    prisma.riskAlert.count({ where: { status: 'PENDING' } }),
    prisma.riskAlert.count({ where: { status: 'REVIEWED' } }),
    prisma.riskAlert.count({ where: { status: 'RESOLVED' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.riskAlert.groupBy({ by: ['riskLevel'], _count: { id: true } }),
  ]);

  return {
    alerts: { total: totalAlerts, pending: pendingAlerts, reviewed: reviewedAlerts, resolved: resolvedAlerts },
    totalStudents,
    riskDistribution: riskDistribution.map((r: { riskLevel: string; _count: { id: number } }) => ({ level: r.riskLevel, count: r._count.id })),
  };
}
