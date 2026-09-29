import React from 'react';
import { Lock, EyeOff, ShieldCheck, Database, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrivacyPanelProps {
  consentGiven: boolean;
  piiRedacted: boolean;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({
  consentGiven,
  piiRedacted,
}) => {
  const items = [
    {
      label: 'Citizen Consent',
      value: consentGiven ? 'Verified & Stored' : 'Pending',
      status: consentGiven ? 'active' : 'warn',
      icon: CheckCircle2,
    },
    {
      label: 'PII Redaction Engine',
      value: piiRedacted ? 'Redacted (Synthetic UUID)' : 'Unredacted',
      status: piiRedacted ? 'active' : 'warn',
      icon: EyeOff,
    },
    {
      label: 'End-to-End Encryption',
      value: 'AES-256 (Prototype Simulation)',
      status: 'active',
      icon: Lock,
    },
    {
      label: 'Data Retention Policy',
      value: '90 Days Max Retention Window',
      status: 'active',
      icon: Database,
    },
    {
      label: 'Audit & Accountability',
      value: 'Continuous Immutable Hash Log',
      status: 'active',
      icon: FileText,
    },
    {
      label: 'Algorithmic Fairness Monitor',
      value: 'Multi-Lingual Parity Active',
      status: 'active',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-tealbrand-600" />
          <h3 className="text-base font-bold text-slate-900">
            Privacy, Security & DPDP Compliance Matrix
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          DPDP Act 2023 Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-tealbrand-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
        <span className="flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>These are visual prototype compliance indicators for SIH evaluation.</span>
        </span>
        <span className="font-mono text-[10px] text-slate-500">
          Compliance Engine v1.04
        </span>
      </div>
    </div>
  );
};
