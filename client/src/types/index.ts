// Enums
export type Role = 'STUDENT' | 'COUNSELLOR';
export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type SeverityLevel = 'MINIMAL' | 'MILD' | 'MODERATE' | 'MODERATELY_SEVERE' | 'SEVERE';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
export type AlertStatus = 'PENDING' | 'UNDER_REVIEW' | 'FOLLOW_UP_SCHEDULED' | 'RESOLVED';

// Models
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  gender?: string;
  age?: number;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodRating: number;
  notes?: string;
  sentiment?: Sentiment;
  createdAt: string;
}

export interface MoodTrend {
  date: string;
  averageRating: number;
  count: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  startedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  messageText: string;
  sender: 'USER' | 'BOT';
  sentiment?: Sentiment;
  sentimentScore?: number;
  createdAt: string;
}

export interface Phq9Assessment {
  id: string;
  userId: string;
  responses: number[];
  totalScore: number;
  severityLevel: SeverityLevel;
  completedAt: string;
}

export interface RiskAlert {
  id: string;
  userId: string;
  riskLevel: RiskLevel;
  status: AlertStatus;
  triggers: string[];
  notes?: string;
  followUpDate?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  assessment?: {
    totalScore: number;
    severityLevel: string;
    completedAt?: string;
  };
}

export interface Recommendation {
  id: string;
  userId: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents?: number;
  activeAlerts?: number;
  casesInProgress?: number;
  recentMood?: MoodEntry[];
  riskLevel?: RiskLevel;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
