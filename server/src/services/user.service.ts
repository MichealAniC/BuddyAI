import prisma from '../config/prisma';

export async function getStudents() {
  return prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      gender: true,
      age: true,
      createdAt: true,
      _count: {
        select: {
          riskAlerts: true,
          assessments: true,
        },
      },
    },
  });
}

export async function getStudentProfile(id: number) {
  const user = await prisma.user.findUnique({
    where: { id, role: 'STUDENT' },
    select: {
      id: true,
      fullName: true,
      email: true,
      gender: true,
      age: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error: Error & { statusCode?: number } = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  const [assessments, moodEntries, riskAlerts] = await Promise.all([
    prisma.phq9Assessment.findMany({
      where: { userId: id },
      orderBy: { completedAt: 'desc' },
    }),
    prisma.moodEntry.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.riskAlert.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        assessment: {
          select: { totalScore: true, severityLevel: true },
        },
      },
    }),
  ]);

  return { user, assessments, moodEntries, riskAlerts };
}
