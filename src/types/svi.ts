export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'INCONCLUSIVE';

export interface AcousticMetrics {
  pitch: number; // 0 to 100
  energy: number; // 0 to 100
  speechRate: number; // words per min / relative index 0-100
  pauses: number; // 0 to 100 (longer/abnormal pauses)
  jitter?: number;
  shimmer?: number;
}

export interface LinguisticMetrics {
  sentiment: number; // -1 to 1 or 0-100
  urgencyScore: number; // 0 to 100
  distressKeywordsCount: number;
  threatKeywordsCount: number;
  hopelessnessScore: number;
}

export interface SVIDimensions {
  acousticWeight: number; // 0.25
  acousticScore: number; // 0 - 100
  linguisticWeight: number; // 0.30
  linguisticScore: number; // 0 - 100
  emotionWeight: number; // 0.25
  emotionScore: number; // 0 - 100
  vulnerabilityWeight: number; // 0.20
  vulnerabilityScore: number; // 0 - 100
}

export interface SVIResult {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number; // 0 - 100%
  dimensions: SVIDimensions;
  topContributingFactors: string[];
  calculatedAt: string;
}
