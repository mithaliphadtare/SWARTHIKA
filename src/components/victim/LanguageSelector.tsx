import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { SupportedLanguage } from '../../types/case';
import { Globe, ArrowRight, Check } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, setStep } = useSessionStore();
  const { t } = useTranslation();

  const languageOptions: {
    code: SupportedLanguage;
    title: string;
    nativeName: string;
    script: string;
    description: string;
  }[] = [
    {
      code: 'en',
      title: 'English',
      nativeName: 'English',
      script: 'Latin',
      description: 'Continue assessment in Indian English with real-time speech and acoustic analysis.',
    },
    {
      code: 'hi',
      title: 'Hindi',
      nativeName: 'हिंदी',
      script: 'Devanagari',
      description: 'हिंदी में अपनी बात कहें या लिखें। स्वचालित ध्वनि एवं भाषा विश्लेषण समर्थित।',
    },
    {
      code: 'mr',
      title: 'Marathi',
      nativeName: 'मराठी',
      script: 'Devanagari',
      description: 'मराठी भाषेत सहजपणे संवाद साधा. सुरक्षित आणि गोपनीय साहाय्य मंच.',
    },
  ];

  const handleSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    // Smooth transition to next step
    setTimeout(() => {
      setStep('consent');
    }, 150);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 mb-4 shadow-xs">
          <Globe className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('select_language')}
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-md mx-auto">
          {t('select_language_sub')}
        </p>
      </div>

      {/* 3 Main Language Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {languageOptions.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => handleSelect(opt.code)}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-brand-50/70 border-brand-600 shadow-md ring-2 ring-brand-600/20'
                  : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50/80 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {opt.title}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-sans">
                  {opt.nativeName}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-700 group-hover:text-brand-800">
                <span>Select & Continue</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* More languages hint */}
      <div className="text-center bg-slate-100/70 border border-slate-200 rounded-xl p-4">
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          🌐 {t('more_languages')}
        </p>
      </div>
    </div>
  );
};
