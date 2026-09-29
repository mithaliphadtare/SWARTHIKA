import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from './pages/HomeScreen';
import { VictimPortal } from './pages/VictimPortal';
import { CounsellorDashboard } from './pages/CounsellorDashboard';
import { CaseDetail } from './pages/CaseDetail';
import { CaseHistory } from './pages/CaseHistory';
import { DemoMode } from './pages/DemoMode';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/victim" element={<VictimPortal />} />
      <Route path="/counsellor" element={<CounsellorDashboard />} />
      <Route path="/case/:id" element={<CaseDetail />} />
      <Route path="/history" element={<CaseHistory />} />
      <Route path="/demo" element={<DemoMode />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
