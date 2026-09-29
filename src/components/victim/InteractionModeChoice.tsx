import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Mic, MessageSquare, ArrowLeft, Volume2, Keyboard } from 'lucide-react';
import { CommunicationChannel } from '../../types/case';

export const InteractionModeChoice: React.FC = () => {
  const { setInteractionMode, setStep } = useSessionStore();
  const { t } = useTranslation();

  const handleSelect = (mode: CommunicationChannel) => {
    setInteractionMode(mode);
    setStep('interactive');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <button
        onClick={() => setStep('consent')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Consent</span>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('choose_mode_title')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          {t('choose_mode_sub')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {/* Speak Card */}
        <button
          type="button"
          onClick={() => handleSelect('Voice')}
          className="p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 shadow-xs hover:shadow-md transition-all text-left flex flex-col items-center text-center group cursor-pointer"
        >
          <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
            <Mic className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {t('mode_speak_title')} 🎙️
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {t('mode_speak_desc')}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice Acoustics Active</span>
          </span>
        </button>

        {/* Type Card */}
        <button
          type="button"
          onClick={() => handleSelect('Text')}
          className="p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-tealbrand-500 hover:bg-tealbrand-50/40 shadow-xs hover:shadow-md transition-all text-left flex flex-col items-center text-center group cursor-pointer"
        >
          <div className="w-20 h-20 rounded-3xl bg-tealbrand-50 text-tealbrand-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-tealbrand-600 group-hover:text-white transition-all shadow-sm">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {t('mode_type_title')} ⌨️
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {t('mode_type_desc')}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-tealbrand-700 bg-tealbrand-50 px-3 py-1.5 rounded-full border border-tealbrand-200">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Text NLP Stream</span>
          </span>
        </button>
      </div>
    </div>
  );
};
