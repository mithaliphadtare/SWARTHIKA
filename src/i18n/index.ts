import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';
import { SupportedLanguage } from '../types/case';

export const translations = {
  en,
  hi,
  mr,
} as const;

export type TranslationKey = keyof typeof en;

export function t(key: TranslationKey, lang: SupportedLanguage = 'en'): string {
  const dict = translations[lang] || translations.en;
  return (dict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
}
