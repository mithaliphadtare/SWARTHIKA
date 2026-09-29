import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SupportedLanguage } from '../../types/case';
import { Globe, Check, ChevronDown } from 'lucide-react';

export const ThreeDLanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const options: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  const currentOption = options.find((o) => o.code === currentLanguage) || options[0];

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* 3D Elevated Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer group active:scale-95"
      >
        <Globe className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
        <span className="font-sans font-bold">{currentOption.native}</span>
        <span className="text-[10px] text-slate-400 font-mono">({currentOption.code.toUpperCase()})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Glassmorphic 3D Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-xl p-2 space-y-1 animate-scaleUp z-50">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Select Preferred Language
          </div>
          {options.map((opt) => {
            const isSelected = currentLanguage === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelect(opt.code)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div>
                  <span className="block text-sm font-sans">{opt.native}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
