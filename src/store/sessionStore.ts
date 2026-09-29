import { create } from 'zustand';
import { SupportedLanguage, CommunicationChannel } from '../types/case';
import { AcousticMetrics, SVIResult, RiskLevel } from '../types/svi';
import { DetectedIndicatorsMap } from '../types/indicators';
import { DEFAULT_ACOUSTIC_METRICS, calculateSVI } from '../lib/sviConfig';
import { analyzeMockInput } from '../mock/mockAssessment';

export type VictimStep = 'language' | 'consent' | 'mode' | 'interactive' | 'confirmation' | 'direct_human';

interface SessionState {
  currentStep: VictimStep;
  language: SupportedLanguage;
  consentGiven: boolean;
  interactionMode: CommunicationChannel;
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  transcript: string;
  transcriptEntries: { speaker: 'Victim' | 'System'; text: string; timestamp: string }[];
  acousticMetrics: AcousticMetrics;
  currentSVI: number;
  riskLevel: RiskLevel;
  sviResult: SVIResult | null;
  indicators: DetectedIndicatorsMap | null;
  isSOS: boolean;
  generatedCaseId: string | null;

  // Actions
  setStep: (step: VictimStep) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setConsent: (consent: boolean) => void;
  setInteractionMode: (mode: CommunicationChannel) => void;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  setTranscript: (text: string) => void;
  appendTranscript: (text: string) => void;
  setAcousticMetrics: (metrics: Partial<AcousticMetrics>) => void;
  processAssessment: (customText?: string) => Promise<void>;
  triggerSOS: () => void;
  resetSession: () => void;
  setGeneratedCaseId: (id: string) => void;
}

const initialSVIResult = calculateSVI(20, 20, 20, 20, 85);

export const useSessionStore = create<SessionState>((set, get) => ({
  currentStep: 'language',
  language: 'en',
  consentGiven: false,
  interactionMode: 'Voice',
  isRecording: false,
  isPaused: false,
  isProcessing: false,
  transcript: '',
  transcriptEntries: [],
  acousticMetrics: { ...DEFAULT_ACOUSTIC_METRICS },
  currentSVI: 20,
  riskLevel: 'LOW',
  sviResult: initialSVIResult,
  indicators: null,
  isSOS: false,
  generatedCaseId: null,

  setStep: (step) => set({ currentStep: step }),

  setLanguage: (language) => set({ language }),

  setConsent: (consentGiven) => set({ consentGiven }),

  setInteractionMode: (interactionMode) => set({ interactionMode }),

  startRecording: () =>
    set({
      isRecording: true,
      isPaused: false,
    }),

  stopRecording: () =>
    set({
      isRecording: false,
      isPaused: false,
    }),

  pauseRecording: () =>
    set((state) => ({
      isPaused: !state.isPaused,
    })),

  setTranscript: (transcript) => set({ transcript }),

  appendTranscript: (text) =>
    set((state) => {
      const updated = state.transcript ? `${state.transcript} ${text}` : text;
      return {
        transcript: updated,
      };
    }),

  setAcousticMetrics: (metrics) =>
    set((state) => ({
      acousticMetrics: { ...state.acousticMetrics, ...metrics },
    })),

  processAssessment: async (customText) => {
    const state = get();
    const textToAnalyze = customText !== undefined ? customText : state.transcript;
    set({ isProcessing: true });

    // Mock analysis delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const analysis = analyzeMockInput(textToAnalyze, state.language, state.acousticMetrics);

    set({
      isProcessing: false,
      sviResult: analysis.svi,
      currentSVI: analysis.svi.score,
      riskLevel: analysis.svi.riskLevel,
      indicators: analysis.indicators,
      acousticMetrics: analysis.acoustic,
    });
  },

  triggerSOS: () => {
    set((state) => ({
      isSOS: true,
      currentSVI: Math.max(state.currentSVI, 88),
      riskLevel: 'CRITICAL',
    }));
  },

  resetSession: () =>
    set({
      currentStep: 'language',
      consentGiven: false,
      interactionMode: 'Voice',
      isRecording: false,
      isPaused: false,
      isProcessing: false,
      transcript: '',
      transcriptEntries: [],
      acousticMetrics: { ...DEFAULT_ACOUSTIC_METRICS },
      currentSVI: 20,
      riskLevel: 'LOW',
      sviResult: initialSVIResult,
      indicators: null,
      isSOS: false,
      generatedCaseId: null,
    }),

  setGeneratedCaseId: (id) => set({ generatedCaseId: id }),
}));
