import React, { useState } from 'react';
import { X, UserCheck, Shield, CheckCircle2 } from 'lucide-react';

interface ConnectCounsellorModalProps {
  isOpen: boolean;
  caseId: string;
  currentCounsellor?: string;
  onClose: () => void;
  onAssign: (counsellorName: string) => Promise<void>;
}

export const ConnectCounsellorModal: React.FC<ConnectCounsellorModalProps> = ({
  isOpen,
  caseId,
  currentCounsellor,
  onClose,
  onAssign,
}) => {
  const [selectedCounsellor, setSelectedCounsellor] = useState(
    currentCounsellor || 'Dr. Anita Sharma (Senior Clinical Lead)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const counsellors = [
    'Dr. Anita Sharma (Senior Clinical Lead)',
    'Vikram Mehta (Legal & Safety Specialist)',
    'Pooja Deshmukh (Licensed Crisis Counsellor)',
    'Suresh Patil (Community Outreach Coordinator)',
    'Kavita Nair (Trauma Recovery Specialist)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAssign(selectedCounsellor);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Assign / Transfer Counsellor
              </h3>
              <p className="text-xs text-slate-500 font-mono">Case: {caseId}</p>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Duty Officer
            </label>
            <div className="space-y-2">
              {counsellors.map((c) => (
                <label
                  key={c}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedCounsellor === c
                      ? 'bg-brand-50 border-brand-600 font-bold text-brand-900 ring-1 ring-brand-600/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>{c}</span>
                  <input
                    type="radio"
                    name="counsellor"
                    value={c}
                    checked={selectedCounsellor === c}
                    onChange={(e) => setSelectedCounsellor(e.target.value)}
                    className="text-brand-600 focus:ring-brand-500 h-4 w-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
