import React from 'react';
import { DetectedIndicatorsMap, ClinicalIndicator, IndicatorStatus } from '../../types/indicators';
import {
  AlertTriangle,
  HeartCrack,
  UserX,
  ShieldAlert,
  Brain,
  Flame,
  LifeBuoy,
} from 'lucide-react';

interface IndicatorListProps {
  indicators: DetectedIndicatorsMap;
}

export const IndicatorList: React.FC<IndicatorListProps> = ({ indicators }) => {
  const getStatusBadge = (status: IndicatorStatus) => {
    switch (status) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium';
      case 'NOT DETECTED':
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200 font-normal';
    }
  };

  const indicatorConfig: { key: keyof DetectedIndicatorsMap; icon: any }[] = [
    { key: 'fear', icon: Flame },
    { key: 'anxiety', icon: AlertTriangle },
    { key: 'trauma', icon: HeartCrack },
    { key: 'socialIsolation', icon: UserX },
    { key: 'intimidation', icon: ShieldAlert },
    { key: 'depression', icon: Brain },
    { key: 'suicidalIdeation', icon: LifeBuoy },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Detected Clinical & Behavioral Indicators
          </h3>
          <p className="text-xs text-slate-500">
            Multi-tier symptom and situation triage matrix
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          7 Monitored Vectors
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {indicatorConfig.map(({ key, icon: Icon }) => {
          const item: ClinicalIndicator = indicators[key] || {
            id: key,
            name: key,
            category: 'emotional',
            status: 'NOT DETECTED',
            score: 0,
            evidenceQuotes: [],
            description: 'No detected activity',
          };

          return (
            <div
              key={key}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                item.status === 'HIGH'
                  ? 'bg-rose-50/40 border-rose-200'
                  : item.status === 'MODERATE'
                  ? 'bg-amber-50/30 border-amber-200'
                  : item.status === 'LOW'
                  ? 'bg-slate-50/60 border-slate-200'
                  : 'bg-white border-slate-150 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        item.status === 'HIGH'
                          ? 'bg-rose-100 text-rose-700'
                          : item.status === 'MODERATE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {item.name}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                  {item.description}
                </p>

                {item.evidenceQuotes && item.evidenceQuotes.length > 0 && (
                  <div className="mb-2 p-1.5 bg-white rounded-lg border border-slate-200 text-[10px] text-slate-600 italic">
                    « {item.evidenceQuotes[0]} »
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {item.score}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
