// Enums
export type Role = 'STUDENT' | 'COUNSELLOR';
export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type SeverityLevel = 'MINIMAL' | 'MILD' | 'MODERATE' | 'MODERATELY_SEVERE' | 'SEVERE';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
export type AlertStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED';

// Models
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  rating: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  sentiment?: Sentiment;
  createdAt: string;
}

export interface Phq9Assessment {
  id: string;
  userId: string;
  answers: number[];
  totalScore: number;
  severity: SeverityLevel;
  recommendations?: string[];
  createdAt: string;
}

export interface RiskAlert {
  id: string;
  userId: string;
  riskLevel: RiskLevel;
  status: AlertStatus;
  triggers: string[];
  notes?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
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
