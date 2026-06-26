import prisma from '../config/prisma';

type SeverityLevel = 'MINIMAL' | 'MILD' | 'MODERATE' | 'MODERATELY_SEVERE' | 'SEVERE';
type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

interface Phq9AssessmentInput {
  userId: number;
  severityLevel: SeverityLevel;
  totalScore: number;
}

function classifySeverity(score: number): SeverityLevel {
  if (score <= 4) return 'MINIMAL';
  if (score <= 9) return 'MILD';
  if (score <= 14) return 'MODERATE';
  if (score <= 19) return 'MODERATELY_SEVERE';
  return 'SEVERE';
}

export async function submitAssessment(userId: number, responses: number[]) {
  const totalScore = responses.reduce((sum, r) => sum + r, 0);
  const severityLevel = classifySeverity(totalScore);

  const assessment = await prisma.phq9Assessment.create({
    data: {
      userId,
      responses,
      totalScore,
      severityLevel,
    },
  });
  return assessment;
}

export async function getAssessmentHistory(userId: number) {
  return prisma.phq9Assessment.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
  });
}

export async function getAssessmentById(id: number, userId: number) {
  return prisma.phq9Assessment.findFirst({
    where: { id, userId },
  });
}

function severityToRiskLevel(severity: SeverityLevel): RiskLevel {
  switch (severity) {
    case 'MINIMAL':
      return 'LOW';
    case 'MILD':
      return 'LOW';
    case 'MODERATE':
      return 'MODERATE';
    case 'MODERATELY_SEVERE':
      return 'HIGH';
    case 'SEVERE':
      return 'SEVERE';
  }
}

function buildRecommendationText(severity: SeverityLevel, totalScore: number): string {
  switch (severity) {
    case 'MODERATE':
      return `PHQ-9 score of ${totalScore} indicates moderate depression. Consider scheduling a session with a counsellor to discuss coping strategies and support options.`;
    case 'MODERATELY_SEVERE':
      return `PHQ-9 score of ${totalScore} indicates moderately severe depression. It is strongly recommended to consult a counsellor or mental health professional for a comprehensive evaluation and treatment plan.`;
    case 'SEVERE':
      return `PHQ-9 score of ${totalScore} indicates severe depression. Immediate consultation with a mental health professional is advised. Please reach out to a counsellor or crisis helpline as soon as possible.`;
    default:
      return '';
  }
}

export async function generateRecommendation(assessment: Phq9AssessmentInput) {
  const riskLevel = severityToRiskLevel(assessment.severityLevel);
  const recommendationText = buildRecommendationText(assessment.severityLevel, assessment.totalScore);

  const recommendation = await prisma.recommendation.create({
    data: {
      userId: assessment.userId,
      recommendationText,
      riskLevel,
    },
  });
  return recommendation;
}
