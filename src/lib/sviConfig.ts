import { RiskLevel, SVIDimensions, SVIResult, AcousticMetrics } from '../types/svi';
import { DetectedIndicatorsMap } from '../types/indicators';

export const SVI_CONFIG = {
  weights: {
    acoustic: 0.25,
    linguistic: 0.30,
    emotion: 0.25,
    vulnerability: 0.20,
  },
  thresholds: {
    LOW: { min: 0, max: 24, label: 'LOW' },
    MODERATE: { min: 25, max: 49, label: 'MODERATE' },
    HIGH: { min: 50, max: 74, label: 'HIGH' },
    CRITICAL: { min: 75, max: 100, label: 'CRITICAL' },
  },
  disclaimer: 'AI-assisted assessment — for decision support only. Human review required before any action.',
  prototypeNotice: 'Prototype values — pending clinical validation',
  dpdpNotice: 'DPDP Act 2023 Compliant Prototype Architecture — End-to-End Synthetic Data Mode Active',
};

export function classifyRisk(score: number, confidence: number = 85): RiskLevel {
  if (confidence < 50) return 'INCONCLUSIVE';
  if (score <= 24) return 'LOW';
  if (score <= 49) return 'MODERATE';
  if (score <= 74) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskColorClass(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hex: string;
} {
  switch (level) {
    case 'LOW':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        hex: '#16a34a',
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        hex: '#d97706',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        hex: '#ea580c',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
        hex: '#dc2626',
      };
    case 'INCONCLUSIVE':
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-800 border-slate-300',
        hex: '#64748b',
      };
  }
}

export function calculateSVI(
  acousticScore: number,
  linguisticScore: number,
  emotionScore: number,
  vulnerabilityScore: number,
  confidence: number = 88
): SVIResult {
  const { weights } = SVI_CONFIG;
  const score = Math.round(
    acousticScore * weights.acoustic +
    linguisticScore * weights.linguistic +
    emotionScore * weights.emotion +
    vulnerabilityScore * weights.vulnerability
  );

  const riskLevel = classifyRisk(score, confidence);

  const topFactors: string[] = [];
  if (linguisticScore >= 60) topFactors.push('Elevated distress/threat linguistic markers detected');
  if (emotionScore >= 60) topFactors.push('High emotional trauma / anxiety indicators in narrative');
  if (acousticScore >= 60) topFactors.push('Vocal strain, pitch irregularities & extended hesitation pauses');
  if (vulnerabilityScore >= 60) topFactors.push('Situational vulnerability & isolation context cues');
  if (topFactors.length === 0) topFactors.push('Calm vocal tone and coherent descriptive report');

  return {
    score,
    riskLevel,
    confidence,
    dimensions: {
      acousticWeight: weights.acoustic,
      acousticScore,
      linguisticWeight: weights.linguistic,
      linguisticScore,
      emotionWeight: weights.emotion,
      emotionScore,
      vulnerabilityWeight: weights.vulnerability,
      vulnerabilityScore,
    },
    topContributingFactors: topFactors,
    calculatedAt: new Date().toISOString(),
  };
}

export const DEFAULT_ACOUSTIC_METRICS: AcousticMetrics = {
  pitch: 34,
  energy: 42,
  speechRate: 50,
  pauses: 20,
};
