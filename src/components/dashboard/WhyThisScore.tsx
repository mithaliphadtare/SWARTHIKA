import React, { useState } from 'react';
import { SVIDimensions } from '../../types/svi';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Activity,
  MessageSquare,
  HeartCrack,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface WhyThisScoreProps {
  dimensions: SVIDimensions;
  topFactors: string[];
}

export const WhyThisScore: React.FC<WhyThisScoreProps> = ({
  dimensions,
  topFactors,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getDimensionBarColor = (score: number) => {
    if (score >= 70) return 'bg-rose-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Why This Score? — Explainable AI Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Weighted multi-modal contribution breakdown
            </p>
          </div>
        </div>
        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-5 space-y-6 pt-4 border-t border-slate-100 animate-fadeIn">
          {/* 4 Dimension Weights & Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Acoustic */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Activity className="w-4 h-4 text-tealbrand-600" />
                  <span>Acoustic Signals</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-normal">
                    {(dimensions.acousticWeight * 100)}% Weight
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {dimensions.acousticScore} / 100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getDimensionBarColor(
                    dimensions.acousticScore
                  )}`}
                  style={{ width: `${dimensions.acousticScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Pitch stability, tremor & hesitation pauses
              </p>
            </div>

            {/* Linguistic */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  <span>Linguistic Analysis</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-normal">
                    {(dimensions.linguisticWeight * 100)}% Weight
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {dimensions.linguisticScore} / 100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getDimensionBarColor(
                    dimensions.linguisticScore
                  )}`}
                  style={{ width: `${dimensions.linguisticScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Distress semantics, syntax urgency & explicit threat terms
              </p>
            </div>

            {/* Emotion / Trauma */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <HeartCrack className="w-4 h-4 text-rose-600" />
                  <span>Emotional Indicators</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-normal">
                    {(dimensions.emotionWeight * 100)}% Weight
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {dimensions.emotionScore} / 100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getDimensionBarColor(
                    dimensions.emotionScore
                  )}`}
                  style={{ width: `${dimensions.emotionScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Trauma load, perceived fear & helplessness index
              </p>
            </div>

            {/* Vulnerability */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Context & Situation</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-normal">
                    {(dimensions.vulnerabilityWeight * 100)}% Weight
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {dimensions.vulnerabilityScore} / 100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getDimensionBarColor(
                    dimensions.vulnerabilityScore
                  )}`}
                  style={{ width: `${dimensions.vulnerabilityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Social isolation, systemic vulnerability & coercion threats
              </p>
            </div>
          </div>

          {/* Top Contributing Signals */}
          <div className="bg-brand-50/60 border border-brand-100 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Top Contributing Assessment Signals</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {topFactors && topFactors.length > 0 ? (
                topFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-600 font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No elevated anomaly signals detected.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
