export type IndicatorStatus = 'LOW' | 'MODERATE' | 'HIGH' | 'NOT DETECTED';

export interface ClinicalIndicator {
  id: string;
  name: string;
  category: 'emotional' | 'situational' | 'behavioral' | 'acute_risk';
  status: IndicatorStatus;
  score: number; // 0 - 100
  evidenceQuotes: string[];
  description: string;
}

export type IndicatorKey =
  | 'fear'
  | 'anxiety'
  | 'trauma'
  | 'socialIsolation'
  | 'intimidation'
  | 'depression'
  | 'suicidalIdeation';

export type DetectedIndicatorsMap = Record<IndicatorKey, ClinicalIndicator>;
