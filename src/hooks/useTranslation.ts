import { useSessionStore } from '../store/sessionStore';
import { t, TranslationKey } from '../i18n';
import { SupportedLanguage } from '../types/case';

export function useTranslation() {
  const language = useSessionStore((s) => s.language);
  const setLanguage = useSessionStore((s) => s.setLanguage);

  const translate = (key: TranslationKey, langOverride?: SupportedLanguage): string => {
    return t(key, langOverride || language);
  };

  return {
    t: translate,
    currentLanguage: language,
    setLanguage,
  };
}
