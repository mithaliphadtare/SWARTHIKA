import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { ThreeDVisualObject } from './ThreeDVisualObject';

export interface ModuleBlockData {
  id: '01' | '02' | '03' | '04';
  type: 'victim' | 'counsellor' | 'history' | 'demo';
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  callout?: string;
  indicators: string[];
  link: string;
  ctaText: string;
  accentColor: 'teal' | 'brand' | 'indigo' | 'amber';
}

interface ThreeDModuleBlockProps {
  data: ModuleBlockData;
  index: number;
}

export const ThreeDModuleBlock: React.FC<ThreeDModuleBlockProps> = ({ data }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 10 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt X axis
    const rotateY = ((x - centerX) / centerX) * 12; // tilt Y axis
    const shadowX = (x - centerX) * -0.15;
    const shadowY = (y - centerY) * -0.15 + 20;

    setTilt({ rotateX, rotateY, shadowX, shadowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 10 });
  };

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => {
      navigate(data.link);
    }, 180);
  };

  const getAccentStyles = (color: ModuleBlockData['accentColor']) => {
    switch (color) {
      case 'teal':
        return {
          glow: 'from-teal-500/20 via-cyan-500/10 to-transparent',
          badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          border: isHovered ? 'border-teal-400/80' : 'border-slate-700/80',
          cta: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white shadow-teal-500/20',
          accentText: 'text-teal-400',
        };
      case 'brand':
        return {
          glow: 'from-indigo-500/20 via-brand-500/10 to-transparent',
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          border: isHovered ? 'border-indigo-400/80' : 'border-slate-700/80',
          cta: 'bg-gradient-to-r from-indigo-600 to-brand-500 hover:from-indigo-500 hover:to-brand-400 text-white shadow-indigo-500/20',
          accentText: 'text-indigo-400',
        };
      case 'indigo':
        return {
          glow: 'from-blue-500/20 via-indigo-500/10 to-transparent',
          badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          border: isHovered ? 'border-blue-400/80' : 'border-slate-700/80',
          cta: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20',
          accentText: 'text-blue-400',
        };
      case 'amber':
      default:
        return {
          glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          border: isHovered ? 'border-amber-400/80' : 'border-slate-700/80',
          cta: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-500/20',
          accentText: 'text-amber-400',
        };
    }
  };

  const accent = getAccentStyles(data.accentColor);

  return (
    <div className="perspective-1000 w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          transform: isPressed
            ? 'scale(0.96) translateZ(5px)'
            : isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(28px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          boxShadow: isHovered
            ? `${tilt.shadowX}px ${tilt.shadowY}px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(56, 189, 248, 0.15)`
            : '0 10px 30px rgba(0, 0, 0, 0.4)',
          transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.1s ease-out' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative rounded-3xl bg-slate-900/85 backdrop-blur-xl border-2 ${accent.border} p-6 sm:p-7 flex flex-col justify-between cursor-pointer overflow-hidden transform-gpu select-none group`}
      >
        {/* Ambient Top Glow Layer */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl ${accent.glow} rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${
            isHovered ? 'opacity-100 scale-125' : 'opacity-40'
          }`}
        />

        {/* 3D Glass Layer Highlight Rim */}
        <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

        {/* Top Header Row */}
        <div className="transform-gpu translate-z-20 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-black tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
              BLOCK {data.id}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${accent.badge}`}
            >
              {data.badge}
            </span>
          </div>

          {/* Title & 3D Abstract Geometry Art */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                {data.title}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {data.subtitle}
              </p>
            </div>

            {/* 3D Visual Art Component */}
            <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <ThreeDVisualObject type={data.type} />
            </div>
          </div>

          <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
            {data.description}
          </p>

          {/* Optional Callout (e.g. for Counsellor Dashboard) */}
          {data.callout && (
            <div className="mb-4 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] font-bold text-amber-300 text-center backdrop-blur-md">
              « {data.callout} »
            </div>
          )}

          {/* Indicators List */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800/80 mb-6">
            {data.indicators.map((ind, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <CheckCircle2 className={`w-3.5 h-3.5 ${accent.accentText} flex-shrink-0`} />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="transform-gpu translate-z-30 pt-2">
          <div
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${accent.cta}`}
          >
            <span>{data.ctaText}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
