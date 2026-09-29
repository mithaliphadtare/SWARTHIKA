import React from 'react';
import { RiskLevel } from '../../types/svi';
import { getRiskColorClass } from '../../lib/sviConfig';
import { RiskBadge } from './RiskBadge';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface SVIGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number;
  size?: number; // width/height in px
  showDisclaimer?: boolean;
}

export const SVIGauge: React.FC<SVIGaugeProps> = ({
  score,
  riskLevel,
  confidence,
  size = 220,
  showDisclaimer = true,
}) => {
  const riskInfo = getRiskColorClass(riskLevel);

  // SVG Gauge calculations (semi-circle / 260 deg arc)
  const strokeWidth = 16;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const strokeDashoffset = arcLength - (arcLength * Math.min(Math.max(score, 0), 100)) / 100;

  return (
    <div className="flex flex-col items-center bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center">
      <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-100">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Stress Vulnerability Index (SVI)
        </span>
        <span className="text-[11px] font-mono text-slate-400 font-semibold">
          Scale: 0 — 100
        </span>
      </div>

      {/* Circular SVG Gauge */}
      <div className="relative my-2" style={{ width: size, height: size * 0.85 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-135 origin-center"
        >
          {/* Background Track Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={riskInfo.hex}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text Metrics */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <span className="text-5xl font-extrabold tracking-tighter text-slate-900 font-sans transition-all">
            {score}
          </span>
          <div className="mt-1">
            <RiskBadge level={riskLevel} size="md" />
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1">
            Confidence: <strong className="text-slate-700">{confidence}%</strong>
          </span>
        </div>
      </div>

      {/* Scale Bands Indicator */}
      <div className="w-full grid grid-cols-4 gap-1 text-[10px] font-bold text-center mt-3 pt-3 border-t border-slate-100">
        <div className="p-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          LOW 0-24
        </div>
        <div className="p-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
          MOD 25-49
        </div>
        <div className="p-1 rounded bg-orange-50 text-orange-700 border border-orange-200">
          HIGH 50-74
        </div>
        <div className="p-1 rounded bg-rose-50 text-rose-700 border border-rose-200">
          CRIT 75-100
        </div>
      </div>

      {showDisclaimer && (
        <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-1.5 text-left">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
          <p>
            « AI-assisted assessment — for decision support only. Human review required before any action. »
          </p>
        </div>
      )}
    </div>
  );
};
