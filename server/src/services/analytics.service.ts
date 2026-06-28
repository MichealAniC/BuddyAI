import prisma from '../config/prisma';

export interface SystemSnapshot {
  pendingAlerts: number;
  highRiskStudents: number;
  averageResponseTimeHours: number;
}

export interface RiskDistributionItem {
  level: string;
  count: number;
}

export interface TrendPoint {
  month: string;
  averageScore: number;
}

export interface ResolutionVelocity {
  status: string;
  averageHours: number;
}

export interface ReportData {
  populationHealth: RiskDistributionItem[];
  trendData: TrendPoint[];
  resolutionVelocity: ResolutionVelocity[];
}

export async function getSystemSnapshot(): Promise<SystemSnapshot> {
  const [pendingAlerts, highRiskAlerts, resolvedAlerts] = await Promise.all([
    prisma.riskAlert.count({ where: { status: 'PENDING' as any } }),
    prisma.riskAlert.findMany({
      where: { riskLevel: { in: ['HIGH' as any, 'SEVERE' as any] } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.riskAlert.findMany({
      where: { status: 'RESOLVED' as any },
    }) as Promise<any[]>,
  ]);

  const highRiskStudents = highRiskAlerts.length;

  const averageResponseTimeHours =
    resolvedAlerts.length > 0
      ? Math.round(
          resolvedAlerts.reduce((sum, alert) => {
            const created = new Date(alert.createdAt).getTime();
            const updated = new Date(alert.updatedAt ?? alert.createdAt).getTime();
            return sum + (updated - created) / 36e5;
          }, 0) / resolvedAlerts.length
        )
      : 0;

  return {
    pendingAlerts,
    highRiskStudents,
    averageResponseTimeHours,
  };
}

export async function getPopulationHealth(): Promise<RiskDistributionItem[]> {
  const latestAssessments = await prisma.$queryRaw<
    { severityLevel: string; count: bigint }[]
  >`
    SELECT "severityLevel" AS "severityLevel", COUNT(*) AS count
    FROM (
      SELECT DISTINCT ON ("userId")
        "severityLevel",
        "completedAt"
      FROM "Phq9Assessment"
      ORDER BY "userId", "completedAt" DESC
    ) latest
    GROUP BY "severityLevel"
    ORDER BY "severityLevel"
  `;

  const allLevels = ['MINIMAL', 'MILD', 'MODERATE', 'MODERATELY_SEVERE', 'SEVERE'];
  const map = new Map(latestAssessments.map((item) => [item.severityLevel, Number(item.count)]));

  return allLevels.map((level) => ({
    level,
    count: map.get(level) ?? 0,
  }));
}

export async function getTrendData(): Promise<TrendPoint[]> {
  const assessments = await prisma.phq9Assessment.findMany({
    orderBy: { completedAt: 'asc' },
    select: { totalScore: true, completedAt: true },
  });

  if (assessments.length === 0) return [];

  const grouped = new Map<string, number[]>();
  assessments.forEach((a) => {
    const month = new Date(a.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!grouped.has(month)) grouped.set(month, []);
    grouped.get(month)!.push(a.totalScore);
  });

  return Array.from(grouped.entries()).map(([month, scores]) => ({
    month,
    averageScore: Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 10) / 10,
  }));
}

export async function getResolutionVelocity(): Promise<ResolutionVelocity[]> {
  const resolved = (await prisma.riskAlert.findMany({
    where: { status: 'RESOLVED' as any },
  })) as any[];

  const underReview = (await prisma.riskAlert.findMany({
    where: { status: 'UNDER_REVIEW' as any },
  })) as any[];

  const followUp = (await prisma.riskAlert.findMany({
    where: { status: 'FOLLOW_UP_SCHEDULED' as any },
  })) as any[];

  const calculateAverage = (alerts: any[]) =>
    alerts.length > 0
      ? Math.round(
          alerts.reduce((sum, alert) => {
            const hours = (new Date(alert.updatedAt ?? alert.createdAt).getTime() - new Date(alert.createdAt).getTime()) / 36e5;
            return sum + hours;
          }, 0) / alerts.length
        )
      : 0;

  return [
    { status: 'Under Review', averageHours: calculateAverage(underReview) },
    { status: 'Follow-up', averageHours: calculateAverage(followUp) },
    { status: 'Resolved', averageHours: calculateAverage(resolved) },
  ];
}

export async function getReportData(): Promise<ReportData> {
  const [populationHealth, trendData, resolutionVelocity] = await Promise.all([
    getPopulationHealth(),
    getTrendData(),
    getResolutionVelocity(),
  ]);

  return {
    populationHealth,
    trendData,
    resolutionVelocity,
  };
}
