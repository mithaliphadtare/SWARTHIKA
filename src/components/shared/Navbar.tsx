import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Activity,
  FileSpreadsheet,
  PlayCircle,
  Menu,
  X,
  PhoneCall,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useCaseStore } from '../../store/caseStore';
import { useSessionStore } from '../../store/sessionStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resetToDefaults = useCaseStore((s) => s.resetToDefaults);
  const resetSession = useSessionStore((s) => s.resetSession);

  const isHome = location.pathname === '/';

  // On the Home Screen, the 3D blocks ARE the primary navigation.
  // The HomeScreen component renders its own minimal header.
  if (isHome) {
    return null;
  }

  const handleResetData = async () => {
    if (window.confirm('Reset all demo case records and session state to initial defaults?')) {
      await resetToDefaults();
      resetSession();
    }
  };

  const navLinks = [
    { path: '/victim', label: 'Victim Portal', icon: Shield },
    { path: '/counsellor', label: 'Counsellor Dashboard', icon: Activity },
    { path: '/history', label: 'Case History / Admin', icon: FileSpreadsheet },
    { path: '/demo', label: 'Demo Simulation', icon: PlayCircle, highlight: true },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top emergency & prototype ribbon */}
      <div className="bg-slate-950 text-slate-300 text-xs px-4 py-1 flex justify-between items-center flex-wrap gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 bg-brand-600 text-white px-2 py-0.5 rounded font-bold text-[10px] tracking-wider uppercase">
            SIH 2026 • SIH26093
          </span>
          <span className="hidden sm:inline text-slate-400">
            SWARTHIKA AI-Assisted Assessment Platform
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Client Stream: Active</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>Tele-MANAS: <strong>14416</strong></span>
          </div>
          <button
            onClick={handleResetData}
            title="Reset Mock Cases to Initial Seed"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors underline cursor-pointer ml-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar for Internal Pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Left: Prominent Back to Home Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 border border-cyan-400/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to SWARTHIKA Home</span>
            </Link>

            <Link to="/" className="flex items-center gap-2 group hidden sm:flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-tealbrand-500 flex items-center justify-center text-white shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                SWARTHIKA
              </span>
            </Link>
          </div>

          {/* Right: Quick Module Switcher & Language Switcher */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : link.highlight
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="ml-2 pl-2 border-l border-slate-800">
              <LanguageSwitcher compact />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher compact />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1.5 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to SWARTHIKA Home</span>
          </Link>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  active
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
