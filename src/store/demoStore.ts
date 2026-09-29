import { create } from 'zustand';
import { DEMO_SCENARIOS, DemoScenario } from '../mock/demoScenarios';
import { mockWebSocket } from '../lib/mockWebSocket';
import { useSessionStore } from './sessionStore';
import { useCaseStore } from './caseStore';
import { mockApi } from '../lib/mockApi';

interface DemoState {
  activeScenario: DemoScenario | null;
  isRunning: boolean;
  isComplete: boolean;
  progress: number;
  currentWord: string;
  displayedTranscript: string;
  liveSVI: number;
  playbackSpeed: number; // 1 = normal, 1.5 = fast, 2 = very fast
  unsubscribeWs: (() => void) | null;

  // Actions
  runScenario: (scenarioId: string) => Promise<void>;
  stopScenario: () => void;
  setSpeed: (speed: number) => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  activeScenario: null,
  isRunning: false,
  isComplete: false,
  progress: 0,
  currentWord: '',
  displayedTranscript: '',
  liveSVI: 0,
  playbackSpeed: 1,
  unsubscribeWs: null,

  runScenario: async (scenarioId: string) => {
    const prevCleanup = get().unsubscribeWs;
    if (prevCleanup) prevCleanup();

    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    // Reset session store & set demo state
    const sessionStore = useSessionStore.getState();
    sessionStore.resetSession();
    sessionStore.setLanguage(scenario.language);
    sessionStore.setConsent(true);
    sessionStore.setStep('interactive');
    sessionStore.setInteractionMode('Voice');
    sessionStore.startRecording();

    set({
      activeScenario: scenario,
      isRunning: true,
      isComplete: false,
      progress: 0,
      currentWord: '',
      displayedTranscript: '',
      liveSVI: 0,
    });

    const cleanupStream = mockWebSocket.streamScenario(
      scenario.transcript,
      scenario.acousticTimeline,
      scenario.sviResult,
      scenario.indicators,
      async () => {
        // Complete callback
        sessionStore.stopRecording();
        sessionStore.setTranscript(scenario.transcript);
        sessionStore.setAcousticMetrics(scenario.acousticMetrics);
        if (scenario.isSOS) {
          sessionStore.triggerSOS();
        }

        // Create mock case automatically so counsellor dashboard receives it
        const newCase = await mockApi.createCase({
          language: scenario.language,
          channel: 'Voice',
          status: scenario.isSOS ? 'Escalated' : 'New',
          riskLevel: scenario.expectedRisk,
          sviScore: scenario.sviResult.score,
          confidence: scenario.sviResult.confidence,
          sviDetails: scenario.sviResult,
          acousticMetrics: scenario.acousticMetrics,
          transcript: scenario.transcript,
          transcriptEntries: [
            { speaker: 'System', text: 'Demo voice assessment stream started.', timestamp: 'Just now' },
            { speaker: 'Victim', text: scenario.transcript, timestamp: 'Just now' },
            ...(scenario.isSOS
              ? [{ speaker: 'System' as const, text: 'Silent SOS triggered in critical state.', timestamp: 'Just now' }]
              : []),
          ],
          indicators: scenario.indicators,
          recommendations: scenario.recommendations,
          isSOS: scenario.isSOS,
          sosTimestamp: scenario.isSOS ? new Date().toISOString() : undefined,
          isDemo: true,
          counsellorAssigned: scenario.isSOS ? 'Dr. Anita Sharma (Lead Supervisor)' : undefined,
          consentGiven: true,
          piiRedacted: true,
          notes: `[Judge Demo Simulation] Scenario: ${scenario.name}. ${scenario.explanation}`,
        });

        // Add to case store
        useCaseStore.getState().addCase(newCase);
        sessionStore.setGeneratedCaseId(newCase.id);

        set({
          isRunning: false,
          isComplete: true,
          progress: 100,
          liveSVI: scenario.sviResult.score,
        });
      },
      (word, currentSVI) => {
        set((state) => ({
          currentWord: word,
          displayedTranscript: state.displayedTranscript ? `${state.displayedTranscript} ${word}` : word,
          liveSVI: currentSVI,
          progress: Math.min(Math.round((currentSVI / scenario.sviResult.score) * 100), 99),
        }));

        sessionStore.setTranscript(get().displayedTranscript);
      }
    );

    set({ unsubscribeWs: cleanupStream });
  },

  stopScenario: () => {
    const cleanup = get().unsubscribeWs;
    if (cleanup) cleanup();
    set({
      isRunning: false,
      unsubscribeWs: null,
    });
  },

  setSpeed: (playbackSpeed) => set({ playbackSpeed }),
}));
