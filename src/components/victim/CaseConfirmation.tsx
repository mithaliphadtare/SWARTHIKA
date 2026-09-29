import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { PrivacyStatus } from '../shared/PrivacyStatus';

export const CaseConfirmation: React.FC = () => {
  const { generatedCaseId, resetSession, isSOS } = useSessionStore();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {t('confirmation_title')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mb-6">
          {t('confirmation_sub')}
        </p>

        {/* Case ID Badge */}
        {generatedCaseId && (
          <div className="inline-flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 mb-8">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {t('case_ref')}
            </span>
            <span className="text-2xl font-mono font-black text-brand-700 mt-0.5">
              {generatedCaseId}
            </span>
          </div>
        )}

        {/* Emergency SOS Active Alert if triggered */}
        {isSOS && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 mb-8 text-left flex items-start gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping mt-1 flex-shrink-0"></span>
            <div>
              <h4 className="text-sm font-bold text-rose-900">Priority SOS Signal Logged</h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Your situation has been marked with high emergency priority in the counsellor queue. Stay in a safe place.
              </p>
            </div>
          </div>
        )}

        {/* 24x7 Helplines Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-brand-600" />
            <span>{t('helpline_title')}</span>
          </h3>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <span>{t('helpline_telemanas')}</span>
              <a href="tel:14416" className="text-xs font-bold text-brand-600 hover:underline">
                Call 14416
              </a>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <span>{t('helpline_women')}</span>
              <a href="tel:181" className="text-xs font-bold text-brand-600 hover:underline">
                Call 181
              </a>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <span>{t('helpline_police')}</span>
              <a href="tel:112" className="text-xs font-bold text-brand-600 hover:underline">
                Call 112
              </a>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <PrivacyStatus />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetSession}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('return_home')}</span>
          </button>

          <Link
            to="/counsellor"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs hover:shadow-sm"
          >
            <span>Switch to Counsellor View</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
