import React, { useState } from 'react';
import { RiskLevel } from '../../types/svi';
import { RiskBadge } from './RiskBadge';
import { X, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

interface OverrideModalProps {
  isOpen: boolean;
  currentRisk: RiskLevel;
  caseId: string;
  onClose: () => void;
  onSave: (newRisk: RiskLevel, reason: string) => Promise<void>;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  isOpen,
  currentRisk,
  caseId,
  onClose,
  onSave,
}) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>(currentRisk);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a detailed clinical / situational reason for this override.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(selectedRisk, reason.trim());
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setError('Failed to save override.');
      setIsSubmitting(false);
    }
  };

  const riskOptions: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'INCONCLUSIVE'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Override Risk Classification
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Case ID: {caseId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Current vs New Risk */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                AI Assessed Risk
              </span>
              <RiskBadge level={currentRisk} size="md" showPulse={false} />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                New Target Risk *
              </label>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value as RiskLevel)}
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {riskOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinical / Situational Rationale (Required) *
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Counsellor identified acute threat not fully captured in acoustic score; elevating for direct safe shelter review."
              className="w-full text-sm text-slate-800 p-3 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Save & Log Override'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
