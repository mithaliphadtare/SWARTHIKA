import React from 'react';
import { useAcousticAnalysis } from '../../hooks/useAcousticAnalysis';
import { useTranslation } from '../../hooks/useTranslation';
import { Activity, Waves, Gauge, Clock } from 'lucide-react';

interface AcousticVisualizerProps {
  isRecording?: boolean;
}

export const AcousticVisualizer: React.FC<AcousticVisualizerProps> = ({ isRecording = false }) => {
  const metrics = useAcousticAnalysis(isRecording);
  const { t } = useTranslation();

  const getMeterColor = (val: number) => {
    if (val < 40) return 'bg-emerald-500';
    if (val < 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-tealbrand-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Real-Time Acoustic Feature Extraction
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          {isRecording ? 'STREAMING 24kHz' : 'STANDBY'}
        </span>
      </div>

      {/* Simulated Live Audio Waveform Bars */}
      <div className="h-12 flex items-center justify-between gap-1 mb-6 px-2 bg-slate-950/70 rounded-xl border border-slate-800/80 overflow-hidden">
        {Array.from({ length: 32 }).map((_, i) => {
          const heightPct = isRecording
            ? Math.min(
                Math.max(
                  15 +
                    Math.sin(i * 0.4 + Date.now() / 200) * 35 +
                    ((metrics.energy / 100) * 45) +
                    (Math.random() * 20),
                  10
                ),
                95
              )
            : 15;

          return (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-tealbrand-500 to-brand-400 rounded-full transition-all duration-100"
              style={{
                height: `${heightPct}%`,
                opacity: isRecording ? 0.9 : 0.25,
              }}
            />
          );
        })}
      </div>

      {/* 4 Core Acoustic Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Pitch */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-tealbrand-400" />
              <span>{t('acoustic_pitch')}</span>
            </div>
            <span className="font-mono text-xs font-semibold text-white">
              {metrics.pitch}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${getMeterColor(metrics.pitch)}`}
              style={{ width: `${metrics.pitch}%` }}
            />
          </div>
        </div>

        {/* Energy */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-brand-400" />
              <span>{t('acoustic_energy')}</span>
            </div>
            <span className="font-mono text-xs font-semibold text-white">
              {metrics.energy}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${getMeterColor(metrics.energy)}`}
              style={{ width: `${metrics.energy}%` }}
            />
          </div>
        </div>

        {/* Speech Rate */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('acoustic_rate')}</span>
            </div>
            <span className="font-mono text-xs font-semibold text-white">
              {metrics.speechRate}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${getMeterColor(metrics.speechRate)}`}
              style={{ width: `${metrics.speechRate}%` }}
            />
          </div>
        </div>

        {/* Pauses */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('acoustic_pauses')}</span>
            </div>
            <span className="font-mono text-xs font-semibold text-white">
              {metrics.pauses}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${getMeterColor(metrics.pauses)}`}
              style={{ width: `${metrics.pauses}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center font-medium italic">
        « {t('voice_signals_notice')} »
      </p>
    </div>
  );
};
