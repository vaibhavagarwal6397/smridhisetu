import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/ui/NavBar';
import SceneContainer from './components/3d/SceneContainer';
import ParticleField from './components/3d/ParticleField';

// Lazy load pages for performance
const LandingPage = React.lazy(() => import('./pages/LandingPage').catch(() => ({ default: () => <div className="p-20 text-center">Landing Page Placeholder</div> })));
const VoiceIntakePage = React.lazy(() => import('./pages/VoiceIntakePage').catch(() => ({ default: () => <div className="p-20 text-center">Voice Intake Placeholder</div> })));
const SchemeResultsPage = React.lazy(() => import('./pages/SchemeResultsPage').catch(() => ({ default: () => <div className="p-20 text-center">Scheme Results Placeholder</div> })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').catch(() => ({ default: () => <div className="p-20 text-center">Dashboard Placeholder</div> })));

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
        {/* Global 3D Background */}
        <SceneContainer>
          <ParticleField />
        </SceneContainer>

        {/* UI Overlay */}
        <div className="relative z-10 flex flex-col h-screen pointer-events-none">
          <div className="pointer-events-auto">
            <NavBar />
          </div>
          
          <main className="flex-1 mt-16 overflow-y-auto pointer-events-auto">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/voice" element={<VoiceIntakePage />} />
                <Route path="/schemes" element={<SchemeResultsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
