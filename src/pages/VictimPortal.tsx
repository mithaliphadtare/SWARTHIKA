import React from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSelector } from '../components/victim/LanguageSelector';
import { ConsentScreen } from '../components/victim/ConsentScreen';
import { InteractionModeChoice } from '../components/victim/InteractionModeChoice';
import { VoiceRecorder } from '../components/victim/VoiceRecorder';
import { TextInput } from '../components/victim/TextInput';
import { CaseConfirmation } from '../components/victim/CaseConfirmation';
import { DirectHumanScreen } from '../components/victim/DirectHumanScreen';
import { DisclaimerBanner } from '../components/shared/DisclaimerBanner';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, ArrowLeft } from 'lucide-react';

export const VictimPortal: React.FC = () => {
  const { currentStep, interactionMode } = useSessionStore();
  const { t } = useTranslation();

  const stepsList = [
    { key: 'language', label: t('step_language') },
    { key: 'consent', label: t('step_consent') },
    { key: 'mode', label: t('step_interaction') },
    { key: 'interactive', label: t('step_session') },
    { key: 'confirmation', label: t('step_confirmation') },
  ];

  const getStepIndex = () => {
    switch (currentStep) {
      case 'language':
        return 0;
      case 'consent':
        return 1;
      case 'mode':
        return 2;
      case 'interactive':
        return 3;
      case 'confirmation':
      case 'direct_human':
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex();

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50 flex flex-col justify-between py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Navigation & Home Back Link */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to SWARTHIKA Home</span>
          </Link>

          <span className="text-xs font-bold text-slate-400 font-mono">
            Module 01: Citizen Portal
          </span>
        </div>

        {/* Step Progress Header */}
        <div className="mb-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-300 z-0"
              style={{ width: `${(activeIndex / (stepsList.length - 1)) * 100}%` }}
            />

            {stepsList.map((step, idx) => {
              const isDone = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-brand-600 text-white'
                        : isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                        : 'bg-white text-slate-400 border-2 border-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${
                      isCurrent ? 'text-brand-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Step Views */}
        {currentStep === 'language' && <LanguageSelector />}
        {currentStep === 'consent' && <ConsentScreen />}
        {currentStep === 'mode' && <InteractionModeChoice />}
        {currentStep === 'interactive' &&
          (interactionMode === 'Voice' ? <VoiceRecorder /> : <TextInput />)}
        {currentStep === 'confirmation' && <CaseConfirmation />}
        {currentStep === 'direct_human' && <DirectHumanScreen />}
      </div>

      {/* Persistent Bottom Disclaimer */}
      <div className="max-w-3xl mx-auto w-full mt-8">
        <DisclaimerBanner />
      </div>
    </div>
  );
};
