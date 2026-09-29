import React, { useEffect, useState } from 'react';
import { useCaseStore } from '../store/caseStore';
import { CaseRecord, RiskLevel, CaseStatus } from '../types/case';
import { CaseCard } from '../components/dashboard/CaseCard';
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
  Activity,
  Filter,
  Search,
  ArrowUpDown,
  Mic,
  MessageSquare,
  Shield,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  Eye,
  FileDown,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CounsellorDashboard: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    isLoading,
    filterRisk,
    filterStatus,
    filterSOSOnly,
    searchQuery,
    sortBy,
    loadCases,
    selectCase,
    updateStatus,
    overrideRisk,
    assignCounsellor,
    setFilterStatus,
    setFilterRisk,
    setFilterSOSOnly,
    setSearchQuery,
    setSortBy,
  } = useCaseStore();

  const [transcriptOpen, setTranscriptOpen] = useState(true);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  // Filter & Sort Cases
  const filteredCases = cases
    .filter((c) => {
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
      if (filterRisk !== 'ALL' && c.riskLevel !== filterRisk) return false;
      if (filterSOSOnly && !c.isSOS) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = c.id.toLowerCase().includes(q);
        const matchText = c.transcript.toLowerCase().includes(q);
        if (!matchId && !matchText) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Prioritize SOS always at the very top
      if (a.isSOS && !b.isSOS) return -1;
      if (!a.isSOS && b.isSOS) return 1;

      if (sortBy === 'risk') {
        const riskWeights: Record<RiskLevel, number> = {
          CRITICAL: 4,
          HIGH: 3,
          MODERATE: 2,
          LOW: 1,
          INCONCLUSIVE: 0,
        };
        return (riskWeights[b.riskLevel] || 0) - (riskWeights[a.riskLevel] || 0);
      } else if (sortBy === 'svi') {
        return b.sviScore - a.sviScore;
      } else {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || filteredCases[0] || null;

  const statusTabs: (CaseStatus | 'ALL')[] = [
    'ALL',
    'New',
    'Under Review',
    'Escalated',
    'Resolved',
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="mb-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <span>← Back to SWARTHIKA Home</span>
          </Link>
          <span className="text-xs font-bold text-slate-400 font-mono">
            Module 02: Counsellor Dashboard & Manual Review
          </span>
        </div>

        <DisclaimerBanner variant="counsellor" className="mb-4" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    SWARTHIKA — Counsellor Assessment Dashboard
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase bg-tealbrand-50 text-tealbrand-800 border border-tealbrand-200 px-2 py-0.5 rounded-md">
                    Human Review Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time Multi-Modal Stress & Vulnerability Intake Decision Support Console
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Active Clinician</span>
              <span className="font-bold text-slate-800">Dr. Anita Sharma (Senior Clinical Lead)</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">System Time</span>
              <span className="font-mono font-bold text-slate-800">
                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout (30% Left Queue / 70% Right Case Detail) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Case Queue (30% ~ 4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Incoming Intake Queue
              </h2>
              <span className="text-xs font-mono font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                {filteredCases.length} Cases
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID or narrative..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterStatus(tab)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    filterStatus === tab
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sort & Quick Filter Row */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-[11px] font-bold bg-transparent text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="risk">Highest Risk</option>
                  <option value="svi">SVI Score</option>
                  <option value="time">Latest Time</option>
                </select>
              </div>

              <label className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterSOSOnly}
                  onChange={(e) => setFilterSOSOnly(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>SOS Only</span>
              </label>
            </div>
          </div>

          {/* Scrollable Case Cards List */}
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredCases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                caseRecord={caseItem}
                isSelected={selectedCase?.id === caseItem.id}
                onSelect={(id) => selectCase(id)}
              />
            ))}

            {filteredCases.length === 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                No cases match the selected filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Case Deep-Dive (70% ~ 8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCase ? (
            <>
              {/* SOS Priority Alert if triggered */}
              {selectedCase.isSOS && (
                <SOSAlert
                  caseId={selectedCase.id}
                  timestamp={selectedCase.sosTimestamp}
                  onAcknowledge={async () => {
                    await updateStatus(
                      selectedCase.id,
                      'Under Review',
                      'Dr. Anita Sharma',
                      'SOS alert acknowledged and assigned to priority response desk.'
                    );
                  }}
                />
              )}

              {/* Case Header Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black font-mono text-slate-900">
                        CASE: {selectedCase.id}
                      </h2>
                      {selectedCase.isOverridden && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                          Risk Overridden by Clinician
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Received:{' '}
                      <strong>{new Date(selectedCase.timestamp).toLocaleString()}</strong> • Channel:{' '}
                      <strong className="text-slate-800">{selectedCase.channel}</strong> ({selectedCase.language.toUpperCase()})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Status: {selectedCase.status}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Consent: Given
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-tealbrand-50 text-tealbrand-700 border border-tealbrand-200">
                      PII: Redacted
                    </span>
                    <Link
                      to={`/case/${selectedCase.id}`}
                      className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Deep-Dive</span>
                    </Link>
                  </div>
                </div>

                {/* Counsellor Assigned Info */}
                <div className="pt-3 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-brand-600" />
                    <span>Assigned Clinician: <strong>{selectedCase.counsellorAssigned || 'Pending Reviewer'}</strong></span>
                  </div>
                  {selectedCase.overrideReason && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      Override Reason: <em>"{selectedCase.overrideReason}"</em>
                    </div>
                  )}
                </div>
              </div>

              {/* SVI Gauge & Diagnostic Confidence Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <SVIGauge
                    score={selectedCase.sviScore}
                    riskLevel={selectedCase.riskLevel}
                    confidence={selectedCase.confidence}
                  />
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <ConfidenceMeter confidence={selectedCase.confidence} />
                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex-1 flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Acoustic Health Indices
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pitch Dynamism:</span>
                        <span className="font-mono font-bold text-slate-800">{selectedCase.acousticMetrics?.pitch || 42}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vocal Energy:</span>
                        <span className="font-mono font-bold text-slate-800">{selectedCase.acousticMetrics?.energy || 50}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Speech Rate:</span>
                        <span className="font-mono font-bold text-slate-800">{selectedCase.acousticMetrics?.speechRate || 55}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hesitation Pauses:</span>
                        <span className="font-mono font-bold text-slate-800">{selectedCase.acousticMetrics?.pauses || 30}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why This Score (Explainable Breakdown) */}
              <WhyThisScore
                dimensions={selectedCase.sviDetails.dimensions}
                topFactors={selectedCase.sviDetails.topContributingFactors}
              />

              {/* Detected Clinical Indicators Grid */}
              <IndicatorList indicators={selectedCase.indicators} />

              {/* Interaction Transcript (Collapsible) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
                <button
                  type="button"
                  onClick={() => setTranscriptOpen(!transcriptOpen)}
                  className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote className="w-5 h-5 text-brand-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Interaction Narrative & Spoken Transcript
                    </h3>
                  </div>
                  {transcriptOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {transcriptOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-fadeIn">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-sans italic">
                      "{selectedCase.transcript}"
                    </div>

                    {selectedCase.transcriptEntries && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Time-Stamped Turns
                        </span>
                        {selectedCase.transcriptEntries.map((turn, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs p-2 rounded-xl bg-slate-50 border border-slate-150"
                          >
                            <span className="font-bold text-brand-700 min-w-[55px]">
                              {turn.speaker}:
                            </span>
                            <span className="text-slate-700 flex-1">{turn.text}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {turn.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recommended Interventions Panel */}
              <RecommendationPanel
                recommendations={selectedCase.recommendations}
                onActionClick={(item) => {
                  alert(`Action Initiated: "${item.title}". Logged to Case Audit Trail.`);
                }}
              />

              {/* Action Buttons Console */}
              <ActionButtons
                caseRecord={selectedCase}
                onUpdateStatus={updateStatus}
                onOverrideRisk={overrideRisk}
                onAssignCounsellor={assignCounsellor}
              />

              {/* Privacy & Compliance Panel */}
              <PrivacyPanel
                consentGiven={selectedCase.consentGiven}
                piiRedacted={selectedCase.piiRedacted}
              />

              {/* Audit Log */}
              <AuditLog auditTrail={selectedCase.auditTrail} />
            </>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Case Selected</h3>
              <p className="text-xs text-slate-500 mt-1">
                Select a case from the incoming intake queue on the left to inspect multi-modal assessment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
