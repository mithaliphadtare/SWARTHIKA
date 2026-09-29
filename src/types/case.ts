import { RiskLevel, SVIResult, AcousticMetrics } from './svi';
export type { RiskLevel, SVIResult, AcousticMetrics };
import { DetectedIndicatorsMap } from './indicators';

export type CaseStatus = 'New' | 'Under Review' | 'Escalated' | 'Resolved';
export type CommunicationChannel = 'Voice' | 'Text';
export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  notes?: string;
  previousValue?: string;
  newValue?: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  priority: 'Immediate' | 'High' | 'Medium' | 'Standard';
  description: string;
  category: 'Counselling' | 'Legal' | 'Safety' | 'Medical' | 'Social';
}

export interface CaseRecord {
  id: string; // e.g., 'SW-1042'
  timestamp: string;
  language: SupportedLanguage;
  channel: CommunicationChannel;
  status: CaseStatus;
  riskLevel: RiskLevel;
  originalRiskLevel?: RiskLevel;
  overrideReason?: string;
  isOverridden?: boolean;
  sviScore: number;
  confidence: number;
  sviDetails: SVIResult;
  acousticMetrics?: AcousticMetrics;
  transcript: string;
  transcriptEntries?: { speaker: 'Victim' | 'System'; text: string; timestamp: string }[];
  indicators: DetectedIndicatorsMap;
  recommendations: RecommendationItem[];
  isSOS: boolean;
  sosTimestamp?: string;
  isDemo: boolean;
  counsellorAssigned?: string;
  auditTrail: AuditLogEntry[];
  consentGiven: boolean;
  piiRedacted: boolean;
  notes?: string;
}
