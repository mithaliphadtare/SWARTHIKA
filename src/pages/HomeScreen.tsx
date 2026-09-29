import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Database, Lock, Globe, UserCheck } from 'lucide-react';
import { CinematicBackground } from '../components/shared/CinematicBackground';
import { ThreeDModuleBlock, ModuleBlockData } from '../components/shared/ThreeDModuleBlock';
import { ThreeDLanguageSelector } from '../components/shared/ThreeDLanguageSelector';
import { DisclaimerBanner } from '../components/shared/DisclaimerBanner';

export const HomeScreen: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const moduleBlocks: ModuleBlockData[] = [
    {
      id: '01',
      type: 'victim',
      title: 'VICTIM PORTAL',
      subtitle: 'Citizen Distress & Intake Portal',
      description: 'For the person seeking support. Provides a confidential multi-lingual environment for voice or text interaction.',
      badge: 'Citizen Intake',
      accentColor: 'teal',
      indicators: [
        'Language Selection (EN, HI, MR)',
        'Informed Ethical Consent',
        'Voice / Text Interaction',
        'Real-Time Acoustic Assessment',
        'Discreet Silent SOS Trigger',
      ],
      link: '/victim',
      ctaText: 'ENTER →',
    },
    {
      id: '02',
      type: 'counsellor',
      title: 'COUNSELLOR DASHBOARD',
      subtitle: 'Decision Support & Triage Console',
      description: 'For counsellors and human reviewers managing incoming intake queues and taking authorized interventions.',
      badge: 'Clinician Console',
      accentColor: 'brand',
      callout: 'AI-assisted assessment. Human review required before action.',
      indicators: [
        'Priority SOS Case Queue',
        'Stress Vulnerability Index (SVI)',
        'Multi-Vector Risk Assessment',
        'Human Review Protocol',
        'Manual Risk Override & Escalation',
      ],
      link: '/counsellor',
      ctaText: 'OPEN →',
    },
    {
      id: '03',
      type: 'history',
      title: 'CASE HISTORY / ADMIN',
      subtitle: 'Case Review & Administration',
      description: 'For case management, retrospective auditing, compliance tracking, and dataset administrative exports.',
      badge: 'Admin Archive',
      accentColor: 'indigo',
      indicators: [
        'Comprehensive Case Archive',
        'Multi-Tier Search & Filters',
        'Full Case Dossier Details',
        'Timestamped Audit Trail',
        'Client-Side CSV Export',
      ],
      link: '/history',
      ctaText: 'VIEW →',
    },
    {
      id: '04',
      type: 'demo',
      title: 'DEMO SIMULATION',
      subtitle: 'Judge Demonstration Console',
      description: 'For SIH judges to evaluate the multi-modal pipeline across 4 calibrated risk tiers in real-time.',
      badge: 'SIH Evaluation',
      accentColor: 'amber',
      indicators: [
        'LOW (SVI ~20)',
        'MODERATE (SVI ~42)',
        'HIGH (SVI ~68)',
        'CRITICAL + SOS (SVI ~88)',
      ],
      link: '/demo',
      ctaText: 'START DEMO →',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Living 3D Animated Background with Camera Parallax */}
      <CinematicBackground mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Minimal Header (Logo, SIH Indicator & 3D Language Selector) */}
      <header className="relative z-30 px-6 py-5 border-b border-slate-800/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & SIH Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] border border-white/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-sans">
                  SWARTHIKA
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-extrabold px-2 py-0.5 rounded-full border border-cyan-500/40">
                  SIH 2026 • SIH26093
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                AI-Assisted Real-Time Assessment
              </p>
            </div>
          </div>

          {/* Right Header Action: 3D Language Selector */}
          <div className="flex items-center gap-3">
            <ThreeDLanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Hero & 4 Major Interactive 3D Blocks */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center space-y-10">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-300 text-xs font-bold shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>SIH 2026 PROBLEM STATEMENT SIH26093</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
            AI-Assisted Real-Time Stress & Vulnerability Assessment
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-medium">
            Select a module to continue
          </p>
        </div>

        {/* 4 Large Major Interactive 3D Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moduleBlocks.map((block, idx) => (
            <ThreeDModuleBlock key={block.id} data={block} index={idx} />
          ))}
        </div>

        {/* Architecture & Ethical Framing Banner */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-5 border border-slate-800 shadow-xl max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">
                  Unified Frontend State & Local Storage Sync
                </h4>
                <p className="text-[11px] text-slate-400">
                  Cases generated in Victim Intake or Demo Simulation automatically flow to the Counsellor Queue and Admin Archive.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                🔒 DPDP Act 2023 Compliant
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                🌐 Multilingual Speech
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                👤 Human-in-the-Loop Review
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-20 py-4 px-4 text-center border-t border-slate-800/40 backdrop-blur-md">
        <div className="max-w-2xl mx-auto">
          <DisclaimerBanner variant="dark" />
        </div>
      </footer>
    </div>
  );
};
