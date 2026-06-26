import { RiskLevel, SeverityLevel, Sentiment, AlertStatus } from '@/types';

export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    LOW: 'text-green-600 bg-green-50 border-green-200',
    MODERATE: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
    SEVERE: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[level] || colors.LOW;
}

export function getSeverityColor(level: SeverityLevel): string {
  const colors: Record<SeverityLevel, string> = {
    MINIMAL: 'text-green-600 bg-green-50 border-green-200',
    MILD: 'text-blue-600 bg-blue-50 border-blue-200',
    MODERATE: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    MODERATELY_SEVERE: 'text-orange-600 bg-orange-50 border-orange-200',
    SEVERE: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[level] || colors.MINIMAL;
}

export function getSentimentColor(sentiment: Sentiment): string {
  const colors: Record<Sentiment, string> = {
    POSITIVE: 'text-green-600 bg-green-50',
    NEUTRAL: 'text-neutral-600 bg-neutral-100',
    NEGATIVE: 'text-red-600 bg-red-50',
  };
  return colors[sentiment] || colors.NEUTRAL;
}

export function getAlertStatusColor(status: AlertStatus): string {
  const colors: Record<AlertStatus, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    REVIEWED: 'text-blue-600 bg-blue-50 border-blue-200',
    RESOLVED: 'text-green-600 bg-green-50 border-green-200',
  };
  return colors[status] || colors.PENDING;
}
