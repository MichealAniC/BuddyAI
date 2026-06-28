import { RiskLevel, SeverityLevel, Sentiment, AlertStatus } from '@/types';

export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    LOW: 'text-sage-600 bg-sage-50 border-sage-200',
    MODERATE: 'text-amber-600 bg-amber-50 border-amber-200',
    HIGH: 'text-amber-700 bg-amber-50 border-amber-200',
    SEVERE: 'text-rose-600 bg-rose-50 border-rose-200',
  };
  return colors[level] || colors.LOW;
}

export function getSeverityColor(level: SeverityLevel): string {
  const colors: Record<SeverityLevel, string> = {
    MINIMAL: 'text-sage-600 bg-sage-50 border-sage-200',
    MILD: 'text-primary-600 bg-primary-50 border-primary-200',
    MODERATE: 'text-amber-600 bg-amber-50 border-amber-200',
    MODERATELY_SEVERE: 'text-amber-700 bg-amber-50 border-amber-200',
    SEVERE: 'text-rose-600 bg-rose-50 border-rose-200',
  };
  return colors[level] || colors.MINIMAL;
}

export function getSentimentColor(sentiment: Sentiment): string {
  const colors: Record<Sentiment, string> = {
    POSITIVE: 'text-sage-600 bg-sage-50',
    NEUTRAL: 'text-text-muted bg-surface-secondary',
    NEGATIVE: 'text-rose-600 bg-rose-50',
  };
  return colors[sentiment] || colors.NEUTRAL;
}

export function getAlertStatusColor(status: AlertStatus): string {
  const colors: Record<AlertStatus, string> = {
    PENDING: 'text-amber-600 bg-amber-50 border-amber-200',
    UNDER_REVIEW: 'text-primary-600 bg-primary-50 border-primary-200',
    FOLLOW_UP_SCHEDULED: 'text-primary-700 bg-primary-50 border-primary-200',
    RESOLVED: 'text-sage-600 bg-sage-50 border-sage-200',
  };
  return colors[status] || colors.PENDING;
}
