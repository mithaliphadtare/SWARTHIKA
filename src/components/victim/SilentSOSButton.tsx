import React, { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from '../../hooks/useTranslation';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface SilentSOSButtonProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export const SilentSOSButton: React.FC<SilentSOSButtonProps> = ({
  className = '',
  variant = 'inline',
}) => {
  const { isSOS, triggerSOS } = useSessionStore();
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    triggerSOS();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Subtle Discreet SOS Trigger Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isSOS}
        aria-label="Discreet Emergency Signal"
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isSOS
            ? 'bg-rose-100 text-rose-800 border border-rose-300'
            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs hover:shadow-sm'
        }`}
      >
        <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
        <span>{isSOS ? 'SOS Flag Dispatched' : t('silent_sos')}</span>
      </button>

      {/* Reassuring Discreet Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700 animate-slideUp z-50 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-0.5">
              {t('sos_sent_msg')}
            </p>
            <p className="text-xs text-slate-300 leading-normal">
              {t('sos_acknowledged')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
