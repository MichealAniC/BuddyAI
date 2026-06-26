import prisma from '../config/prisma';

type RiskLevelType = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

interface RiskEvaluation {
  riskLevel: RiskLevelType;
  factors: string[];
  recommendation: string;
}

export async function evaluateRisk(userId: number): Promise<RiskEvaluation> {
  // 1. Get latest PHQ-9 assessment
  const latestAssessment = await prisma.phq9Assessment.findFirst({
    where: { userId },
    orderBy: { completedAt: 'desc' },
  });

  // 2. Get recent message sentiments (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentMessages = await prisma.message.findMany({
    where: {
      conversation: { userId },
      sender: 'USER',
      sentiment: { not: null },
      createdAt: { gte: sevenDaysAgo },
    },
  });

  // 3. Get mood trend
  const recentMoods = await prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: 'desc' },
  });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const olderMoods = await prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: thirtyDaysAgo, lt: sevenDaysAgo } },
  });

  // Calculate factors
  const phqScore = latestAssessment?.totalScore ?? 0;

  const negativeCount = recentMessages.filter((m: { sentiment: string | null }) => m.sentiment === 'NEGATIVE').length;
  const totalMessages = recentMessages.length;
  const negativeSentimentRatio = totalMessages > 0 ? negativeCount / totalMessages : 0;

  const recentMoodAvg = recentMoods.length > 0
    ? recentMoods.reduce((sum: number, m: { moodRating: number }) => sum + m.moodRating, 0) / recentMoods.length
    : null;
  const olderMoodAvg = olderMoods.length > 0
    ? olderMoods.reduce((sum: number, m: { moodRating: number }) => sum + m.moodRating, 0) / olderMoods.length
    : null;

  const moodDeclining = (recentMoodAvg !== null && olderMoodAvg !== null && (recentMoodAvg - olderMoodAvg) < -0.5);

  // Apply risk rules
  const factors: string[] = [];
  let riskLevel: RiskLevelType = 'LOW';

  if (phqScore >= 20) {
    riskLevel = 'SEVERE';
    factors.push(`PHQ-9 score is ${phqScore} (severe depression)`);
  } else if (phqScore >= 15 && negativeSentimentRatio > 0.5) {
    riskLevel = 'HIGH';
    factors.push(`PHQ-9 score is ${phqScore} (moderately severe)`);
    factors.push(`High negative sentiment ratio (${Math.round(negativeSentimentRatio * 100)}%)`);
  } else if (phqScore >= 10 || moodDeclining) {
    riskLevel = 'MODERATE';
    if (phqScore >= 10) factors.push(`PHQ-9 score is ${phqScore} (moderate)`);
    if (moodDeclining) factors.push('Mood trend is declining');
  } else {
    factors.push('All indicators within normal range');
  }

  // Generate recommendation text
  const recommendation = generateRecommendationText(riskLevel);

  // Store recommendation
  await prisma.recommendation.create({
    data: {
      userId,
      recommendationText: recommendation,
      riskLevel,
    },
  });

  // Create risk alert if HIGH or SEVERE
  if ((riskLevel === 'HIGH' || riskLevel === 'SEVERE') && latestAssessment) {
    // Check if alert already exists for this assessment
    const existingAlert = await prisma.riskAlert.findFirst({
      where: { userId, assessmentId: latestAssessment.id, status: 'PENDING' },
    });

    if (!existingAlert) {
      await prisma.riskAlert.create({
        data: {
          userId,
          assessmentId: latestAssessment.id,
          riskLevel,
          status: 'PENDING',
        },
      });
    }
  }

  return { riskLevel, factors, recommendation };
}

function generateRecommendationText(riskLevel: RiskLevelType): string {
  switch (riskLevel) {
    case 'LOW':
      return 'Continue maintaining your well-being. Consider regular exercise, adequate sleep, and staying connected with friends and family. Keep using BuddyAI for check-ins.';
    case 'MODERATE':
      return 'Your results suggest some areas of concern. We recommend practicing stress management techniques, maintaining a regular routine, and considering speaking with a counsellor for additional support.';
    case 'HIGH':
      return 'Your assessment indicates significant distress. We strongly recommend scheduling an appointment with a counsellor. In the meantime, please reach out to a trusted friend or family member and practice self-care.';
    case 'SEVERE':
      return 'Your results indicate serious concern. A counsellor has been notified and will reach out to you. If you are in immediate distress, please contact emergency services or a crisis helpline. You are not alone.';
  }
}

export async function getLatestRiskEvaluation(userId: number) {
  const latestRecommendation = await prisma.recommendation.findFirst({
    where: { userId },
    orderBy: { generatedAt: 'desc' },
  });

  const latestAlert = await prisma.riskAlert.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return {
    recommendation: latestRecommendation,
    alert: latestAlert,
  };
}
