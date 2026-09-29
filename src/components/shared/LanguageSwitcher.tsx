import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SupportedLanguage } from '../../types/case';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { currentLanguage, setLanguage } = useTranslation();

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
        <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              currentLanguage === lang.code
                ? 'bg-white text-brand-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
            currentLanguage === lang.code
              ? 'bg-brand-600 text-white font-medium shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>{lang.native}</span>
          <span className="text-xs opacity-75 font-normal">({lang.label})</span>
        </button>
      ))}
    </div>
  );
};
