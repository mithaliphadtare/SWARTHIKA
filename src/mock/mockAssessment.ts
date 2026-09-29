import { SVIResult, AcousticMetrics } from '../types/svi';
import { DetectedIndicatorsMap } from '../types/indicators';
import { RecommendationItem, SupportedLanguage } from '../types/case';
import { calculateSVI } from '../lib/sviConfig';

export function analyzeMockInput(
  text: string,
  _lang: SupportedLanguage = 'en',
  acousticOverride?: Partial<AcousticMetrics>
): {
  svi: SVIResult;
  acoustic: AcousticMetrics;
  indicators: DetectedIndicatorsMap;
  recommendations: RecommendationItem[];
} {
  const lower = text.toLowerCase();

  // Heuristic threat and distress counters for mock NLP
  const criticalWords = ['attack', 'kill', 'die', 'threat', 'weapon', 'suicide', 'end this', 'no way out', 'cannot take', 'destroy'];
  const highWords = ['scared', 'afraid', 'police', 'hurt', 'harass', 'stalk', 'violence', 'forced', 'danger', 'crying'];
  const modWords = ['anxious', 'worried', 'neighborhood', 'pressure', 'shouting', 'uncomfortable', 'fight', 'arguing'];

  let criticalMatches = 0;
  let highMatches = 0;
  let modMatches = 0;

  criticalWords.forEach((w) => {
    if (lower.includes(w)) criticalMatches++;
  });
  highWords.forEach((w) => {
    if (lower.includes(w)) highMatches++;
  });
  modWords.forEach((w) => {
    if (lower.includes(w)) modMatches++;
  });

  let baseScore = 20;
  baseScore += criticalMatches * 25;
  baseScore += highMatches * 15;
  baseScore += modMatches * 8;
  baseScore = Math.min(Math.max(baseScore, 15), 94);

  const acousticScore = acousticOverride?.pitch || Math.min(Math.max(baseScore + (Math.random() * 8 - 4), 10), 95);
  const linguisticScore = Math.min(Math.max(baseScore + (Math.random() * 6 - 3), 10), 98);
  const emotionScore = Math.min(Math.max(baseScore + (criticalMatches > 0 ? 10 : -5), 10), 96);
  const vulnerabilityScore = Math.min(Math.max(baseScore - 2, 10), 95);

  const svi = calculateSVI(
    Math.round(acousticScore),
    Math.round(linguisticScore),
    Math.round(emotionScore),
    Math.round(vulnerabilityScore),
    88
  );

  const acoustic: AcousticMetrics = {
    pitch: Math.round(acousticScore),
    energy: Math.round(Math.min(acousticScore * 1.1, 95)),
    speechRate: Math.round(Math.min(acousticScore * 0.9 + 20, 90)),
    pauses: Math.round(Math.min(acousticScore * 0.85 + 10, 92)),
    jitter: +(acousticScore * 0.06).toFixed(1),
    shimmer: +(acousticScore * 0.09).toFixed(1),
    ...acousticOverride,
  };

  const getStatus = (sc: number): 'LOW' | 'MODERATE' | 'HIGH' | 'NOT DETECTED' => {
    if (sc >= 70) return 'HIGH';
    if (sc >= 45) return 'MODERATE';
    if (sc >= 20) return 'LOW';
    return 'NOT DETECTED';
  };

  const fearScore = Math.round(Math.min(baseScore * 1.1, 95));
  const anxScore = Math.round(Math.min(baseScore * 1.05, 92));
  const traumaScore = Math.round(Math.min(baseScore * 0.95, 90));
  const intScore = Math.round(Math.min(baseScore * (highMatches > 0 || criticalMatches > 0 ? 1.15 : 0.6), 95));
  const suiScore = criticalMatches > 0 && lower.includes('no way out') ? 85 : 0;

  const indicators: DetectedIndicatorsMap = {
    fear: {
      id: 'ind-fear',
      name: 'Fear & Threat Perception',
      category: 'emotional',
      status: getStatus(fearScore),
      score: fearScore,
      evidenceQuotes: text ? [text.slice(0, 80)] : [],
      description: 'Threat perception score derived from voice acoustics and distress keywords.',
    },
    anxiety: {
      id: 'ind-anx',
      name: 'Anxiety & Hyperarousal',
      category: 'emotional',
      status: getStatus(anxScore),
      score: anxScore,
      evidenceQuotes: [],
      description: 'Autonomic nervous system arousal correlates from vocal tremor and phrasing.',
    },
    trauma: {
      id: 'ind-trauma',
      name: 'Acute Trauma Markers',
      category: 'emotional',
      status: getStatus(traumaScore),
      score: traumaScore,
      evidenceQuotes: [],
      description: 'Indicators of psychological shock or acute traumatic exposure.',
    },
    socialIsolation: {
      id: 'ind-iso',
      name: 'Social Isolation / Support Deficit',
      category: 'situational',
      status: getStatus(Math.round(baseScore * 0.7)),
      score: Math.round(baseScore * 0.7),
      evidenceQuotes: [],
      description: 'Evaluation of victim support networks and protective factors.',
    },
    intimidation: {
      id: 'ind-int',
      name: 'Coercion & Intimidation',
      category: 'situational',
      status: getStatus(intScore),
      score: intScore,
      evidenceQuotes: [],
      description: 'Hostility and coercion signals identified in narrative context.',
    },
    depression: {
      id: 'ind-dep',
      name: 'Depressive Mood Markers',
      category: 'behavioral',
      status: getStatus(Math.round(baseScore * 0.65)),
      score: Math.round(baseScore * 0.65),
      evidenceQuotes: [],
      description: 'Affective flattening and depressive mood features.',
    },
    suicidalIdeation: {
      id: 'ind-sui',
      name: 'Suicidal Ideation / Self-Harm',
      category: 'acute_risk',
      status: getStatus(suiScore),
      score: suiScore,
      evidenceQuotes: [],
      description: 'Screening for explicit and implicit self-harm or hopelessness markers.',
    },
  };

  const recommendations: RecommendationItem[] = [
    {
      id: 'rec-dyn-1',
      title: svi.score > 70 ? 'Immediate Crisis Counsellor Assignment' : 'Structured Psychological Follow-Up',
      priority: svi.score > 70 ? 'Immediate' : 'Medium',
      category: 'Counselling',
      description: svi.score > 70 ? 'Initiate priority audio/in-person counselling session.' : 'Provide supportive counselling session within 24 hours.',
    },
    {
      id: 'rec-dyn-2',
      title: 'Safety and Protection Review',
      priority: svi.score > 50 ? 'High' : 'Standard',
      category: 'Safety',
      description: 'Review physical environment safety and emergency contact protocol with the user.',
    },
    {
      id: 'rec-dyn-3',
      title: 'Legal Aid & Advisory Services',
      priority: 'Standard',
      category: 'Legal',
      description: 'Connect with designated paralegal aid volunteers for counsel and support.',
    },
  ];

  return { svi, acoustic, indicators, recommendations };
}
