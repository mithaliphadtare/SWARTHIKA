import React from 'react';
import { CaseRecord } from '../../types/case';
import { RiskBadge } from './RiskBadge';
import {
  Mic,
  MessageSquare,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface CaseCardProps {
  caseRecord: CaseRecord;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caseRecord,
  isSelected,
  onSelect,
}) => {
  const isSOS = caseRecord.isSOS;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Escalated':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      onClick={() => onSelect(caseRecord.id)}
      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group ${
        isSelected
          ? 'bg-brand-50/60 border-brand-600 shadow-sm ring-1 ring-brand-600/20'
          : isSOS
          ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400 shadow-2xs'
          : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50/80 shadow-2xs'
      }`}
    >
      {/* SOS Marker at top corner if active */}
      {isSOS && (
        <div className="absolute -top-2.5 right-3 bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
          <ShieldAlert className="w-3 h-3" />
          <span>SOS ALERT</span>
        </div>
      )}

      {/* Header with Case ID and Risk */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-extrabold text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
            {caseRecord.id}
          </span>
          {caseRecord.isDemo && (
            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold uppercase px-1.5 py-0.5 rounded border border-slate-200">
              Demo
            </span>
          )}
        </div>
        <RiskBadge level={caseRecord.riskLevel} size="sm" showPulse={false} />
      </div>

      {/* SVI and Channel indicators */}
      <div className="flex items-center justify-between text-xs text-slate-600 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">
            SVI: <strong className="text-brand-700 font-extrabold text-sm">{caseRecord.sviScore}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-500">Conf: {caseRecord.confidence}%</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          {caseRecord.channel === 'Voice' ? (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 px-1.5 py-0.5 rounded">
              <Mic className="w-3 h-3 text-brand-600" />
              <span>Voice ({caseRecord.language.toUpperCase()})</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 px-1.5 py-0.5 rounded">
              <MessageSquare className="w-3 h-3 text-tealbrand-600" />
              <span>Text ({caseRecord.language.toUpperCase()})</span>
            </span>
          )}
        </div>
      </div>

      {/* Transcript snippet */}
      <p className="text-xs text-slate-600 line-clamp-2 italic mb-3">
        "{caseRecord.transcript}"
      </p>

      {/* Footer info: Status + Time */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
        <span className={`px-2 py-0.5 rounded-full border font-medium ${getStatusStyle(caseRecord.status)}`}>
          {caseRecord.status}
        </span>

        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{new Date(caseRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};
