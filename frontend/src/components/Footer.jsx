import React from 'react';
import { Activity, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-800 pb-6 mb-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">MediHybrid System</p>
              <p className="text-slate-400">Intelligent Disease Diagnosis (Diabetes & Heart Disease)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <Award className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Genetic Algorithm (GA) • Neural Network (ANN) • Mamdani Fuzzy Inference</span>
          </div>

          <div className="flex md:justify-end gap-3">
            <Link to="/diabetes" className="hover:text-teal-300 transition-colors">Diabetes Diagnosis</Link>
            <span className="text-slate-600">•</span>
            <Link to="/heart" className="hover:text-teal-300 transition-colors">Heart Disease</Link>
            <span className="text-slate-600">•</span>
            <Link to="/dashboard" className="hover:text-teal-300 transition-colors">Dashboard</Link>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Intelligent Disease Diagnosis System. Soft Computing Architecture.</p>
          <p>UCI Benchmark Datasets • DEAP Feature Optimization • Fuzzy Reasoning</p>
        </div>
      </div>
    </footer>
  );
}
