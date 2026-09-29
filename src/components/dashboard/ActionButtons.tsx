import React, { useState } from 'react';
import { CaseRecord, RiskLevel, CaseStatus } from '../../types/case';
import {
  CheckCircle2,
  SlidersHorizontal,
  Users2,
  AlertTriangle,
  UserPlus,
  CheckCheck,
  ShieldAlert,
} from 'lucide-react';
import { OverrideModal } from './OverrideModal';
import { ConnectCounsellorModal } from './ConnectCounsellorModal';

interface ActionButtonsProps {
  caseRecord: CaseRecord;
  onUpdateStatus: (id: string, status: CaseStatus, performedBy?: string, notes?: string) => Promise<void>;
  onOverrideRisk: (id: string, newRisk: RiskLevel, reason: string, performedBy?: string) => Promise<void>;
  onAssignCounsellor: (id: string, name: string) => Promise<void>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  caseRecord,
  onUpdateStatus,
  onOverrideRisk,
  onAssignCounsellor,
}) => {
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const handleAccept = async () => {
    await onUpdateStatus(
      caseRecord.id,
      'Under Review',
      'Dr. Anita Sharma',
      'Assessment metrics accepted by reviewing clinician.'
    );
  };

  const handleEscalate = async () => {
    await onUpdateStatus(
      caseRecord.id,
      'Escalated',
      'Dr. Anita Sharma',
      'Case escalated to Tier-1 Rapid Response Desk for immediate protection measures.'
    );
  };

  const handlePeerReview = async () => {
    await onUpdateStatus(
      caseRecord.id,
      'Under Review',
      'Dr. Anita Sharma',
      'Second-opinion peer review requested with Senior Trauma Panel.'
    );
  };

  const handleResolve = async () => {
    await onUpdateStatus(
      caseRecord.id,
      'Resolved',
      'Dr. Anita Sharma',
      'Case resolved. Follow-up plan established and acknowledged by citizen.'
    );
  };

  return (
    <div className="bg-white border-2 border-brand-200 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-tealbrand-500 to-indigo-600" />

      {/* Prominent Human Review Requirement Callout */}
      <div className="bg-amber-50/90 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-2xl mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wide">
            Human Review Required Before Action
          </span>
        </div>
        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300">
          « AI-Assisted Assessment • Manual Clinician Sign-Off »
        </span>
      </div>

      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Authorized Clinician Action Console
          </h3>
          <p className="text-xs text-slate-500">
            Select an action to execute manual approval with timestamped audit logging
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Reviewer: Dr. Anita Sharma
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Accept Assessment */}
        <button
          type="button"
          onClick={handleAccept}
          className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Accept Assessment</span>
        </button>

        {/* Override Risk Level */}
        <button
          type="button"
          onClick={() => setOverrideModalOpen(true)}
          className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <SlidersHorizontal className="w-5 h-5 text-amber-600" />
          <span>Override Risk</span>
        </button>

        {/* Request Peer Review */}
        <button
          type="button"
          onClick={handlePeerReview}
          className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <Users2 className="w-5 h-5 text-indigo-600" />
          <span>Peer Review</span>
        </button>

        {/* Escalate Case */}
        <button
          type="button"
          onClick={handleEscalate}
          className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Escalate Case</span>
        </button>

        {/* Connect / Reassign Counsellor */}
        <button
          type="button"
          onClick={() => setAssignModalOpen(true)}
          className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <UserPlus className="w-5 h-5 text-blue-600" />
          <span>Assign Counsellor</span>
        </button>

        {/* Mark Resolved */}
        <button
          type="button"
          onClick={handleResolve}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <CheckCheck className="w-5 h-5 text-slate-600" />
          <span>Mark Resolved</span>
        </button>
      </div>

      {/* Override Modal */}
      <OverrideModal
        isOpen={overrideModalOpen}
        caseId={caseRecord.id}
        currentRisk={caseRecord.riskLevel}
        onClose={() => setOverrideModalOpen(false)}
        onSave={async (newRisk, reason) => {
          await onOverrideRisk(caseRecord.id, newRisk, reason, 'Dr. Anita Sharma');
        }}
      />

      {/* Connect Counsellor Modal */}
      <ConnectCounsellorModal
        isOpen={assignModalOpen}
        caseId={caseRecord.id}
        currentCounsellor={caseRecord.counsellorAssigned}
        onClose={() => setAssignModalOpen(false)}
        onAssign={async (name) => {
          await onAssignCounsellor(caseRecord.id, name);
        }}
      />
    </div>
  );
};
