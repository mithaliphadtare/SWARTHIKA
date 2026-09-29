import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number; // 0 to 100
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence }) => {
  const getQualityLabel = (val: number) => {
    if (val >= 85) return 'High Confidence';
    if (val >= 70) return 'Moderate Confidence';
    if (val >= 50) return 'Low Confidence';
    return 'Inconclusive (<50%)';
  };

  return (
    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
        <div className="flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="w-4 h-4 text-tealbrand-600" />
          <span>Model Diagnostic Confidence</span>
        </div>
        <span className="font-mono font-bold text-slate-900">{confidence}%</span>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full transition-all duration-300 ${
            confidence >= 80 ? 'bg-tealbrand-600' : confidence >= 60 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${confidence}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>{getQualityLabel(confidence)}</span>
        <span className="italic">Multi-modal fusion</span>
      </div>
    </div>
  );
};
