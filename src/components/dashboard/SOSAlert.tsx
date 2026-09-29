import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface SOSAlertProps {
  caseId: string;
  timestamp?: string;
  onAcknowledge?: () => void;
}

export const SOSAlert: React.FC<SOSAlertProps> = ({
  caseId,
  timestamp,
  onAcknowledge,
}) => {
  return (
    <div className="bg-rose-600 text-white rounded-2xl p-4 shadow-lg border-2 border-rose-400 animate-pulse-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <ShieldAlert className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black tracking-widest uppercase bg-rose-800 px-2 py-0.5 rounded">
              PRIORITY — SOS ACTIVATED
            </span>
            <span className="text-xs font-mono font-bold text-rose-100">
              CASE: {caseId}
            </span>
            {timestamp && (
              <span className="text-[10px] text-rose-200">
                • {new Date(timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-rose-100 font-medium mt-1">
            Emergency escalation flag generated. Citizen requested immediate safety intervention. Awaiting authorized action.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button
          type="button"
          onClick={onAcknowledge}
          className="px-4 py-2 rounded-xl bg-white text-rose-700 hover:bg-rose-50 text-xs font-extrabold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <span>Acknowledge & Assign</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
