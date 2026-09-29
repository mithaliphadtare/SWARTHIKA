import React from 'react';
import { useDemoStore } from '../store/demoStore';
import { DEMO_SCENARIOS } from '../mock/demoScenarios';
import { SVIGauge } from '../components/dashboard/SVIGauge';
import { AcousticVisualizer } from '../components/victim/AcousticVisualizer';
import { RiskBadge } from '../components/dashboard/RiskBadge';
import { DisclaimerBanner } from '../components/shared/DisclaimerBanner';
import {
  PlayCircle,
  Square,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowLeft,
  FileSpreadsheet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoMode: React.FC = () => {
  const {
    activeScenario,
    isRunning,
    isComplete,
    progress,
    currentWord,
    displayedTranscript,
    liveSVI,
    runScenario,
    stopScenario,
  } = useDemoStore();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Back to Home and SIH Badge Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to SWARTHIKA Home</span>
          </Link>

          <span className="text-xs font-bold text-amber-400 font-mono">
            Module 04: SIH 2026 Judge Demonstration Panel
          </span>
        </div>

        {/* Judge Demo Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <Zap className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              DEMO MODE — All data is simulated for demonstration purposes only.
            </span>
          </div>
          <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
            SIH 2026 Evaluation Panel
          </span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/30 border border-brand-500/40 text-brand-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Multi-Modal Simulation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            SWARTHIKA — Judge Demonstration Panel
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Test and evaluate real-time multi-modal stress classification across all 4 calibrated test cases with progressive speech streaming and automated case intake.
          </p>
        </div>

        {/* 4 Judge Scenario Launch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_SCENARIOS.map((sc) => {
            const isActive = activeScenario?.id === sc.id;
            return (
              <div
                key={sc.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-800 border-brand-500 shadow-lg ring-2 ring-brand-500/30'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <RiskBadge level={sc.expectedRisk} size="sm" showPulse={false} />
                    <span className="text-xs font-mono font-bold text-slate-400">
                      SVI ~{sc.targetSVI}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {sc.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 italic">
                    "{sc.transcript}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => runScenario(sc.id)}
                  disabled={isRunning && isActive}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isActive && isRunning
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-xs hover:shadow-md'
                  }`}
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{isActive && isRunning ? 'Simulating...' : 'Run Simulation'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Simulation Progress Monitor */}
        {activeScenario && (
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-400">
                    Active Scenario
                  </span>
                  <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                    {activeScenario.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {activeScenario.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {isRunning && (
                  <button
                    type="button"
                    onClick={stopScenario}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop Stream</span>
                  </button>
                )}

                {isComplete && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to="/counsellor"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>View in Counsellor Dashboard →</span>
                    </Link>
                    <Link
                      to="/history"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-tealbrand-400" />
                      <span>View in Case History →</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Live Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Multi-Modal Pipeline Progress</span>
                <span className="font-mono font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-tealbrand-500 to-brand-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Split Screen: Live Acoustic & Spoken Transcript vs Live SVI Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Spoken Word Stream & Acoustic Signals (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Spoken Transcript Stream (Word-by-Word WebSocket)
                  </span>
                  <p className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed min-h-[70px]">
                    {displayedTranscript || 'Initializing voice stream...'}
                    {isRunning && (
                      <span className="inline-block w-2.5 h-4 bg-tealbrand-400 ml-1.5 animate-pulse rounded-xs" />
                    )}
                  </p>
                </div>

                <AcousticVisualizer isRecording={isRunning} />
              </div>

              {/* Dynamic SVI Gauge & Classification (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-center flex flex-col items-center justify-center flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Live Stress Vulnerability Score
                  </span>
                  <div className="my-2">
                    <span className="text-6xl font-black text-white font-sans">
                      {liveSVI}
                    </span>
                    <span className="text-xl text-slate-500 font-mono"> / 100</span>
                  </div>
                  <div className="mt-2">
                    <RiskBadge
                      level={
                        liveSVI >= 75
                          ? 'CRITICAL'
                          : liveSVI >= 50
                          ? 'HIGH'
                          : liveSVI >= 25
                          ? 'MODERATE'
                          : 'LOW'
                      }
                      size="lg"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-4 italic max-w-xs">
                    {activeScenario.explanation}
                  </p>
                </div>

                {activeScenario.isSOS && (
                  <div className="bg-rose-950/80 border border-rose-600/80 p-4 rounded-2xl flex items-center gap-3 text-rose-200 animate-pulse">
                    <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0" />
                    <div className="text-xs">
                      <strong className="block text-white font-bold">Simulated SOS Triggered</strong>
                      Auto-promoted to Top Priority in Counsellor Queue.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Post-Completion Quick Routing Footer */}
            {isComplete && (
              <div className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulation Complete! Case Record generated and synchronized across all modules.</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/counsellor"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Open in Counsellor Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/history"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Open in Case History / Admin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <DisclaimerBanner variant="dark" />
      </div>
    </div>
  );
};
