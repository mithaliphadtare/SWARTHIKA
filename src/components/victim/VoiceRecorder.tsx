import React, { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { useCaseStore } from '../../store/caseStore';
import { mockApi } from '../../lib/mockApi';
import {
  Mic,
  Square,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { AcousticVisualizer } from './AcousticVisualizer';
import { TranscriptDisplay } from './TranscriptDisplay';
import { SilentSOSButton } from './SilentSOSButton';

export const VoiceRecorder: React.FC = () => {
  const {
    language,
    isRecording,
    isPaused,
    isProcessing,
    transcript,
    acousticMetrics,
    sviResult,
    isSOS,
    startRecording,
    stopRecording,
    pauseRecording,
    processAssessment,
    setStep,
    setInteractionMode,
    setGeneratedCaseId,
    indicators,
  } = useSessionStore();

  const { t } = useTranslation();
  const addCase = useCaseStore((s) => s.addCase);

  const { isListening, startListening, stopListening } = useVoiceRecorder({
    language,
  });

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
      stopListening();
    } else {
      startRecording();
      startListening();
    }
  };

  const handleFinalSubmit = async () => {
    stopRecording();
    stopListening();
    await processAssessment();

    const currentState = useSessionStore.getState();

    // Create a new mock case in frontend state
    const newCase = await mockApi.createCase({
      language,
      channel: 'Voice',
      status: currentState.isSOS ? 'Escalated' : 'New',
      riskLevel: currentState.riskLevel,
      sviScore: currentState.currentSVI,
      confidence: currentState.sviResult?.confidence || 88,
      sviDetails: currentState.sviResult || ({} as any),
      acousticMetrics: currentState.acousticMetrics,
      transcript: currentState.transcript || 'Voice interaction submitted.',
      transcriptEntries: [
        { speaker: 'System', text: 'Live voice assessment completed.', timestamp: 'Just now' },
        { speaker: 'Victim', text: currentState.transcript || 'Spoken session', timestamp: 'Just now' },
      ],
      indicators: currentState.indicators || ({} as any),
      recommendations: [
        {
          id: 'rec-sub-1',
          title: 'Structured Psychological Follow-Up',
          priority: currentState.currentSVI > 60 ? 'High' : 'Medium',
          category: 'Counselling',
          description: 'A trained human counsellor will contact within standard protocol window.',
        },
      ],
      isSOS: currentState.isSOS,
      isDemo: false,
      consentGiven: true,
      piiRedacted: true,
      notes: 'Submitted via citizen voice assessment portal.',
    });

    addCase(newCase);
    setGeneratedCaseId(newCase.id);
    setStep('confirmation');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn">
      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping-slow"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Language: <strong className="text-brand-600 font-extrabold">{language.toUpperCase()}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setInteractionMode('Text')}
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('switch_to_text')}</span>
          </button>

          <SilentSOSButton />
        </div>
      </div>

      {/* Main Visualizer */}
      <AcousticVisualizer isRecording={isRecording && !isPaused} />

      {/* Live Transcript Display */}
      <TranscriptDisplay transcript={transcript} isStreaming={isRecording && !isPaused} />

      {/* Primary Microphone & Recording Control Center */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center shadow-xs">
        <div className="mb-4">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            {isProcessing
              ? t('processing')
              : isRecording
              ? isPaused
                ? t('paused')
                : t('listening')
              : t('mic_start')}
          </p>
          <p className="text-xs text-slate-500 mt-1">{t('voice_sub')}</p>
        </div>

        {/* Large Mic Button with Animated Rings */}
        <div className="relative inline-flex items-center justify-center my-4">
          {isRecording && !isPaused && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-rose-400/30 animate-ping"></div>
              <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-pulse"></div>
            </>
          )}

          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isProcessing}
            aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300'
                : 'bg-brand-600 hover:bg-brand-700 text-white ring-4 ring-brand-100 hover:scale-105'
            }`}
          >
            {isRecording ? (
              <Square className="w-8 h-8 fill-current" />
            ) : (
              <Mic className="w-9 h-9" />
            )}
          </button>
        </div>

        {/* Pause & Final Actions */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          {isRecording && (
            <button
              type="button"
              onClick={pauseRecording}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isProcessing || !transcript}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              transcript
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Signals...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{t('complete_assessment')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
