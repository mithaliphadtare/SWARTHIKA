import React, { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { ShieldCheck, UserCheck, CheckCircle2, ArrowLeft, Loader2, PhoneCall } from 'lucide-react';
import { PrivacyStatus } from '../shared/PrivacyStatus';

export const ConsentScreen: React.FC = () => {
  const { setConsent, setStep } = useSessionStore();
  const { t } = useTranslation();
  const [connectingDirect, setConnectingDirect] = useState(false);

  const handleAgree = () => {
    setConsent(true);
    setStep('mode');
  };

  const handleDirectHuman = () => {
    setConnectingDirect(true);
    setTimeout(() => {
      setStep('direct_human');
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-10 animate-fadeIn">
      <button
        onClick={() => setStep('language')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Change Language</span>
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-tealbrand-50 border border-tealbrand-100 text-tealbrand-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('consent_title')}
            </h2>
            <p className="text-xs text-slate-500">
              Transparent, Ethical & Confidential Protocol
            </p>
          </div>
        </div>

        {/* Informational Points */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-tealbrand-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('consent_p1')}
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-tealbrand-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('consent_p2')}
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-tealbrand-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('consent_p3')}
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-tealbrand-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('consent_p4')}
            </p>
          </div>
        </div>

        {/* Privacy indicators */}
        <div className="mb-8 pt-4 border-t border-slate-100">
          <PrivacyStatus />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAgree}
            disabled={connectingDirect}
            className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{t('agree_button')}</span>
          </button>

          <button
            type="button"
            onClick={handleDirectHuman}
            disabled={connectingDirect}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
          >
            {connectingDirect ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                <span>{t('connecting_counsellor')}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-slate-600" />
                <span>{t('direct_human_button')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
