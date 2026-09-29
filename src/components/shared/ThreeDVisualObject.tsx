import React from 'react';

interface ThreeDVisualObjectProps {
  type: 'victim' | 'counsellor' | 'history' | 'demo';
}

export const ThreeDVisualObject: React.FC<ThreeDVisualObjectProps> = ({ type }) => {
  switch (type) {
    case 'victim':
      // 3D Glass Sphere inside translucent protective Saturn-style ring (inspired by ref 2)
      return (
        <div className="relative w-24 h-24 flex items-center justify-center pointer-events-none select-none">
          {/* Outer glowing orbital ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 border-t-cyan-300/90 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-spin-slow transform rotate-45" />

          {/* Secondary tilted ring */}
          <div className="absolute w-20 h-20 rounded-full border border-teal-300/30 border-b-teal-200/80 transform -rotate-45 scale-90" />

          {/* Central 3D metallic/glass glowing orb */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-400 to-indigo-200 shadow-[0_10px_25px_rgba(14,165,233,0.6)] flex items-center justify-center transform translate-z-10 border border-white/40">
            <div className="w-4 h-4 rounded-full bg-white/80 blur-[1px] transform -translate-x-1 -translate-y-1" />
          </div>
        </div>
      );

    case 'counsellor':
      // Stacked 3D Translucent Glass Plates & Core Orb (inspired by ref 2 top middle)
      return (
        <div className="relative w-24 h-24 flex items-center justify-center pointer-events-none select-none">
          {/* Layered translucent glass plates */}
          <div className="absolute w-16 h-12 bg-indigo-500/20 backdrop-blur-md rounded-xl border border-indigo-300/40 shadow-lg transform -translate-y-3 translate-x-2 rotate-12" />
          <div className="absolute w-16 h-12 bg-teal-500/25 backdrop-blur-md rounded-xl border border-teal-300/50 shadow-md transform translate-y-1 -translate-x-2 -rotate-6" />
          <div className="absolute w-16 h-12 bg-cyan-400/30 backdrop-blur-lg rounded-xl border border-cyan-200/60 shadow-[0_12px_30px_rgba(99,102,241,0.4)] transform translate-y-3 rotate-3" />

          {/* Central glowing indicator orb */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10 border border-white/60 animate-pulse" />
        </div>
      );

    case 'history':
      // 3D Glass Pyramid & Layered Crystals (inspired by ref 2 top right)
      return (
        <div className="relative w-24 h-24 flex items-center justify-center pointer-events-none select-none">
          {/* Stacked glass steps */}
          <div className="absolute w-18 h-4 bg-slate-600/30 rounded-lg border border-slate-400/30 transform translate-y-6" />
          <div className="absolute w-14 h-4 bg-indigo-500/30 rounded-lg border border-indigo-300/40 transform translate-y-2" />
          <div className="absolute w-10 h-4 bg-cyan-400/40 rounded-lg border border-cyan-200/50 transform -translate-y-2" />

          {/* Top floating crystal gem */}
          <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 via-sky-300 to-white rounded-md transform -translate-y-6 rotate-45 border border-white/80 shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
        </div>
      );

    case 'demo':
      // 3D Saturn Dual Ring & Iridescent Glass Cube (inspired by ref 2 bottom right)
      return (
        <div className="relative w-24 h-24 flex items-center justify-center pointer-events-none select-none">
          {/* Glass cube frame */}
          <div className="absolute w-14 h-14 bg-gradient-to-br from-amber-400/20 via-purple-500/20 to-indigo-600/30 backdrop-blur-md rounded-2xl border border-amber-300/40 shadow-[0_10px_30px_rgba(245,158,11,0.3)] transform rotate-45" />

          {/* Central glowing core sphere */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 shadow-[0_0_20px_rgba(251,191,36,0.7)] z-10 border border-white/70" />

          {/* Orbital ring */}
          <div className="absolute w-22 h-8 rounded-full border-2 border-amber-300/60 border-t-white/90 transform -rotate-30 scale-105 z-20 shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
        </div>
      );

    default:
      return null;
  }
};
