import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { CaseRecord } from '../types/case';
import { SVIGauge } from '../components/dashboard/SVIGauge';
import { WhyThisScore } from '../components/dashboard/WhyThisScore';
import { IndicatorList } from '../components/dashboard/IndicatorList';
import { RecommendationPanel } from '../components/dashboard/RecommendationPanel';
import { ActionButtons } from '../components/dashboard/ActionButtons';
import { SOSAlert } from '../components/dashboard/SOSAlert';
import { AuditLog } from '../components/dashboard/AuditLog';
import { PrivacyPanel } from '../components/dashboard/PrivacyPanel';
import { ConfidenceMeter } from '../components/dashboard/ConfidenceMeter';
import { DisclaimerBanner } from '../components/shared/DisclaimerBanner';
import {
  ArrowLeft,
  Printer,
  Download,
  ShieldAlert,
  UserCheck,
  Clock,
  Mic,
  MessageSquare,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases, loadCases, updateStatus, overrideRisk, assignCounsellor } = useCaseStore();
  const [currentCase, setCurrentCase] = useState<CaseRecord | null>(null);

  useEffect(() => {
    if (cases.length === 0) {
      loadCases();
    }
  }, [cases.length, loadCases]);

  useEffect(() => {
    if (id && cases.length > 0) {
      const found = cases.find((c) => c.id === id);
      if (found) setCurrentCase(found);
    }
  }, [id, cases]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!currentCase) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentCase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentCase.id}_assessment_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!currentCase) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Case Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested case reference "{id}" could not be located.</p>
        <Link
          to="/counsellor"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Counsellor Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-brand-600 font-bold text-slate-700">
              ← Home
            </Link>
            <span>/</span>
            <Link to="/counsellor" className="hover:text-brand-600 font-medium">
              Counsellor Dashboard
            </Link>
            <span>/</span>
            <Link to="/history" className="hover:text-brand-600 font-medium">
              Case History
            </Link>
            <span>/</span>
            <span className="font-mono font-bold text-slate-900">{currentCase.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Dossier</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3.5 py-1.5 rounded-xl bg-brand-50 border border-brand-200 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-brand-600" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        <DisclaimerBanner variant="counsellor" />

        {/* SOS Alert if triggered */}
        {currentCase.isSOS && (
          <SOSAlert
            caseId={currentCase.id}
            timestamp={currentCase.sosTimestamp}
            onAcknowledge={async () => {
              await updateStatus(
                currentCase.id,
                'Under Review',
                'Dr. Anita Sharma',
                'SOS acknowledged in deep-dive dossier.'
              );
            }}
          />
        )}

        {/* Case Dossier Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                  {currentCase.id}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                  {currentCase.status}
                </span>
                {currentCase.isDemo && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold uppercase px-2 py-0.5 rounded border border-slate-200">
                    Judge Demo Case
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Intake Timestamp: <strong>{new Date(currentCase.timestamp).toLocaleString()}</strong> • Intake Mode:{' '}
                <strong>{currentCase.channel}</strong> ({currentCase.language.toUpperCase()})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Informed Consent Logged</span>
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-tealbrand-50 text-tealbrand-700 border border-tealbrand-200">
                PII Anonymized
              </span>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Assigned Counsellor</span>
              <span className="font-bold text-slate-800">{currentCase.counsellorAssigned || 'Pending Officer'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Calculated SVI</span>
              <span className="font-mono font-bold text-slate-900 text-base">{currentCase.sviScore} / 100</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Risk Tier</span>
              <span className="font-bold text-slate-800">{currentCase.riskLevel}</span>
            </div>
          </div>
        </div>

        {/* SVI Gauge and Why This Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SVIGauge
              score={currentCase.sviScore}
              riskLevel={currentCase.riskLevel}
              confidence={currentCase.confidence}
            />
          </div>
          <div>
            <ConfidenceMeter confidence={currentCase.confidence} />
          </div>
        </div>

        <WhyThisScore
          dimensions={currentCase.sviDetails.dimensions}
          topFactors={currentCase.sviDetails.topContributingFactors}
        />

        <IndicatorList indicators={currentCase.indicators} />

        {/* Complete Transcript Dossier */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
            Complete Citizen Spoken & Written Intake Record
          </h3>
          <p className="text-sm sm:text-base text-slate-800 bg-slate-50 p-5 rounded-2xl border border-slate-200 leading-relaxed italic">
            "{currentCase.transcript}"
          </p>
        </div>

        <RecommendationPanel recommendations={currentCase.recommendations} />

        <ActionButtons
          caseRecord={currentCase}
          onUpdateStatus={updateStatus}
          onOverrideRisk={overrideRisk}
          onAssignCounsellor={assignCounsellor}
        />

        <PrivacyPanel
          consentGiven={currentCase.consentGiven}
          piiRedacted={currentCase.piiRedacted}
        />

        <AuditLog auditTrail={currentCase.auditTrail} />
      </div>
    </div>
  );
};
