import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { UserCheck, PhoneCall, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { PrivacyStatus } from '../shared/PrivacyStatus';

export const DirectHumanScreen: React.FC = () => {
  const { setStep } = useSessionStore();
  const { t } = useTranslation();
  const [connectedOfficer, setConnectedOfficer] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectedOfficer('Pooja Deshmukh (Licensed Crisis Counsellor — ID #4829)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <button
        onClick={() => setStep('consent')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <UserCheck className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Direct Counsellor Connection
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
          You have chosen direct human assistance. Automated AI screening is bypassed.
        </p>

        {/* Connection Status Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left">
          {!connectedOfficer ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-brand-600 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {t('connecting_counsellor')}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('connecting_sub')}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-bold">
                  Officer Connected: {connectedOfficer}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                A secure telephone patch is initiating. Please ensure you are in a quiet, safe environment.
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <PrivacyStatus />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setStep('language')}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            End Session & Return
          </button>
        </div>
      </div>
    </div>
  );
};
