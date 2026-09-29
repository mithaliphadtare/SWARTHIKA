import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { SVI_CONFIG } from '../../lib/sviConfig';

interface DisclaimerBannerProps {
  className?: string;
  variant?: 'light' | 'dark' | 'counsellor';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  className = '',
  variant = 'light',
}) => {
  if (variant === 'counsellor') {
    return (
      <div
        className={`bg-brand-50 border-l-4 border-brand-600 px-4 py-2.5 rounded-r-md flex items-center justify-between text-xs text-brand-900 ${className}`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span className="font-semibold">{SVI_CONFIG.disclaimer}</span>
        </div>
        <span className="hidden md:inline-block text-brand-600 font-medium">
          {SVI_CONFIG.prototypeNotice}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 ${className}`}
    >
      <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
      <p className="text-center font-medium">
        « {SVI_CONFIG.disclaimer} »
      </p>
    </div>
  );
};
