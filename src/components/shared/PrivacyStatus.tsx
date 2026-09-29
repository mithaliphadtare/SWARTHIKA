import React from 'react';
import { Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyStatus: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 py-2">
      <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
        <span>End-to-End Encrypted Session</span>
      </div>
      <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
        <EyeOff className="w-3.5 h-3.5 text-brand-600" />
        <span>PII Automatically Redacted</span>
      </div>
      <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-tealbrand-600" />
        <span>DPDP Act 2023 Compliant Design</span>
      </div>
      <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
        <FileText className="w-3.5 h-3.5 text-slate-500" />
        <span>90-Day Retention Policy</span>
      </div>
    </div>
  );
};
