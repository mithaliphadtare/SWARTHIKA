import React, { useEffect, useState } from 'react';
import { useCaseStore } from '../store/caseStore';
import { CaseRecord, RiskLevel, CaseStatus, SupportedLanguage } from '../types/case';
import { RiskBadge } from '../components/dashboard/RiskBadge';
import { DisclaimerBanner } from '../components/shared/DisclaimerBanner';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  Mic,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export const CaseHistory: React.FC = () => {
  const navigate = useNavigate();
  const { cases, loadCases } = useCaseStore();

  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'ALL'>('ALL');
  const [filterLang, setFilterLang] = useState<SupportedLanguage | 'ALL'>('ALL');
  const [filterSOSOnly, setFilterSOSOnly] = useState(false);
  const [filterDemoOnly, setFilterDemoOnly] = useState(false);
  const [sortField, setSortField] = useState<'id' | 'svi' | 'date' | 'risk'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const filteredCases = cases
    .filter((c) => {
      if (filterRisk !== 'ALL' && c.riskLevel !== filterRisk) return false;
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
      if (filterLang !== 'ALL' && c.language !== filterLang) return false;
      if (filterSOSOnly && !c.isSOS) return false;
      if (filterDemoOnly && !c.isDemo) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const m1 = c.id.toLowerCase().includes(q);
        const m2 = c.transcript.toLowerCase().includes(q);
        const m3 = (c.counsellorAssigned || '').toLowerCase().includes(q);
        if (!m1 && !m2 && !m3) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortField === 'id') diff = a.id.localeCompare(b.id);
      else if (sortField === 'svi') diff = a.sviScore - b.sviScore;
      else if (sortField === 'risk') {
        const riskOrder = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1, INCONCLUSIVE: 0 };
        diff = (riskOrder[a.riskLevel] || 0) - (riskOrder[b.riskLevel] || 0);
      } else {
        diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      return sortAsc ? diff : -diff;
    });

  // Client-Side CSV Export Generator
  const handleExportCSV = () => {
    const headers = [
      'Case ID',
      'Risk Level',
      'SVI Score',
      'Confidence',
      'Language',
      'Channel',
      'Status',
      'Counsellor Assigned',
      'SOS Flag',
      'Demo Flag',
      'Received Timestamp',
      'Transcript',
    ];

    const rows = filteredCases.map((c) => [
      `"${c.id}"`,
      `"${c.riskLevel}"`,
      c.sviScore,
      `${c.confidence}%`,
      `"${c.language.toUpperCase()}"`,
      `"${c.channel}"`,
      `"${c.status}"`,
      `"${c.counsellorAssigned || 'Unassigned'}"`,
      c.isSOS ? 'YES' : 'NO',
      c.isDemo ? 'YES' : 'NO',
      `"${new Date(c.timestamp).toISOString()}"`,
      `"${c.transcript.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `swarthika_case_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getStatusBadge = (status: CaseStatus) => {
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
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <span>← Back to SWARTHIKA Home</span>
          </Link>
          <span className="text-xs font-bold text-slate-400 font-mono">
            Module 03: Case Review & Administration
          </span>
        </div>

        <DisclaimerBanner variant="counsellor" />

        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Case History & Administration
                </h1>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md">
                  Case Review & Audit
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized case review, multi-parameter filtering, and client-side CSV dataset export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Filtered CSV ({filteredCases.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, transcript or officer..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Risk Filter */}
            <div>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as any)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="ALL">All Risk Tiers</option>
                <option value="LOW">LOW</option>
                <option value="MODERATE">MODERATE</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="INCONCLUSIVE">INCONCLUSIVE</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value as any)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="ALL">All Languages</option>
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi)</option>
                <option value="mr">Marathi (mr)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 font-semibold text-rose-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterSOSOnly}
                  onChange={(e) => setFilterSOSOnly(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>SOS Only</span>
              </label>

              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterDemoOnly}
                  onChange={(e) => setFilterDemoOnly(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Demo Only</span>
              </label>
            </div>

            <span className="font-mono text-slate-500 font-medium">
              Showing {filteredCases.length} of {cases.length} Records
            </span>
          </div>
        </div>

        {/* Interactive Case Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-extrabold text-[11px]">
                <tr>
                  <th
                    className="p-4 cursor-pointer hover:text-brand-600"
                    onClick={() => {
                      setSortField('id');
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Case ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="p-4 cursor-pointer hover:text-brand-600"
                    onClick={() => {
                      setSortField('risk');
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Risk</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="p-4 cursor-pointer hover:text-brand-600"
                    onClick={() => {
                      setSortField('svi');
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>SVI</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Counsellor</th>
                  <th
                    className="p-4 cursor-pointer hover:text-brand-600"
                    onClick={() => {
                      setSortField('date');
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Received</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4">SOS</th>
                  <th className="p-4">Demo</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/case/${c.id}`)}
                    className="hover:bg-brand-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-mono font-bold text-brand-700 group-hover:underline">
                      {c.id}
                    </td>
                    <td className="p-4">
                      <RiskBadge level={c.riskLevel} size="sm" showPulse={false} />
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800 text-sm">
                      {c.sviScore}
                    </td>
                    <td className="p-4 uppercase font-semibold text-slate-600">
                      {c.language}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-slate-700">
                        {c.channel === 'Voice' ? (
                          <Mic className="w-3.5 h-3.5 text-brand-600" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5 text-tealbrand-600" />
                        )}
                        <span>{c.channel}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {c.counsellorAssigned ? (
                        c.counsellorAssigned.split('(')[0].trim()
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-500">
                      {new Date(c.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      {c.isSOS ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                          <ShieldAlert className="w-3 h-3" />
                          <span>SOS</span>
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {c.isDemo ? (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          DEMO
                        </span>
                      ) : (
                        <span className="text-slate-400">Live</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-800">
                        <span>View</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCases.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No case history records match your search or filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
