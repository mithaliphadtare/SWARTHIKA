import React from 'react';
import { AuditLogEntry } from '../../types/case';
import { History, UserCheck, Shield, Clock, FileText } from 'lucide-react';

interface AuditLogProps {
  auditTrail: AuditLogEntry[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ auditTrail }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand-600" />
          <h3 className="text-base font-bold text-slate-900">
            Case Audit Trail & Human Decision Log
          </h3>
        </div>
        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          Immutable Log
        </span>
      </div>

      <div className="space-y-4">
        {auditTrail && auditTrail.length > 0 ? (
          auditTrail.map((entry, idx) => (
            <div key={entry.id || idx} className="relative pl-6 pb-4 last:pb-0">
              {/* Timeline vertical bar */}
              {idx < auditTrail.length - 1 && (
                <div className="absolute left-2.5 top-3 bottom-0 w-0.5 bg-slate-200" />
              )}

              {/* Timeline node */}
              <div className="absolute left-1 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-600 ring-4 ring-brand-100 flex items-center justify-center" />

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    {entry.action}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span className="font-medium">Performed by: {entry.performedBy}</span>
                </div>

                {entry.notes && (
                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded-xl border border-slate-200 mt-1.5">
                    "{entry.notes}"
                  </p>
                )}

                {entry.previousValue && entry.newValue && (
                  <div className="mt-2 text-[11px] text-slate-700 font-mono bg-amber-50 border border-amber-200 p-1.5 rounded-lg flex items-center gap-2">
                    <span className="line-through text-slate-400">{entry.previousValue}</span>
                    <span>➔</span>
                    <span className="font-bold text-amber-900">{entry.newValue}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">No audit records found.</p>
        )}
      </div>
    </div>
  );
};
