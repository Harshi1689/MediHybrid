import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DiabetesAssessment from './pages/DiabetesAssessment';
import HeartAssessment from './pages/HeartAssessment';
import PredictionResults from './pages/PredictionResults';
import AssessmentHistory from './pages/AssessmentHistory';

export default function App() {
  const [activeContext, setActiveContext] = useState(null);

  const handleAssessmentCompleted = (resultData) => {
    setActiveContext(resultData);
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/diabetes"
              element={<DiabetesAssessment onAssessmentCompleted={handleAssessmentCompleted} />}
            />
            <Route
              path="/heart"
              element={<HeartAssessment onAssessmentCompleted={handleAssessmentCompleted} />}
            />
            <Route
              path="/results"
              element={<PredictionResults />}
            />
            <Route
              path="/history"
              element={<AssessmentHistory />}
            />
          </Routes>
        </main>

        {/* Site Footer */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}
