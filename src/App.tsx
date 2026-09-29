import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/shared/Navbar';
import { AppRouter } from './router';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
