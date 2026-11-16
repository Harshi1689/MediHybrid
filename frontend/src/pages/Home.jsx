import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  Dna,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Award
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      
      {/* Clean Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-700/60 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold tracking-wide">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            Soft Computing Disease Diagnosis Platform
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Intelligent Disease Diagnosis System
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            A soft-computing clinical decision platform designed for early assessment of 
            <strong className="text-white font-semibold"> Diabetes</strong> and 
            <strong className="text-white font-semibold"> Heart Disease</strong>. 
            Combining <span className="text-teal-300 font-semibold">Genetic Algorithm (GA)</span> feature optimization, 
            <span className="text-teal-300 font-semibold"> Artificial Neural Networks (ANN)</span> trained on UCI datasets, and 
            <span className="text-teal-300 font-semibold"> Mamdani Fuzzy Inference</span> to evaluate vague patient symptoms.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/diabetes"
              className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Activity className="w-4 h-4" />
              <span>Diabetes Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/heart"
              className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4" />
              <span>Heart Disease Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 font-semibold text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>View System Dashboard</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-700/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> UCI Benchmark Datasets
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> DEAP Genetic Feature Selection
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Mamdani Fuzzy Linguistic Rules
            </span>
          </div>
        </div>
      </section>

      {/* Disease Diagnosis Modules Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Diagnostic Disease Modules
          </h2>
          <p className="text-slate-600 text-sm">
            Trained and verified using standardized benchmark medical datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Diabetes Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Activity className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900">Diabetes Mellitus Diagnosis</h3>
              <p className="text-xs text-teal-700 font-semibold mt-0.5">Pima Indians Diabetes Benchmark (UCI)</p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              Assesses glycemic levels, BMI, diastolic blood pressure, and hereditary insulin markers. 
              The Genetic Algorithm selects the top 4 critical features to eliminate dataset noise and prevent overfitting.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>GA Optimized Features:</span>
                <span className="font-semibold text-slate-800">Glucose, BMI, Blood Pressure, Age</span>
              </div>
              <div className="flex justify-between">
                <span>Holdout Test Accuracy:</span>
                <span className="font-bold text-teal-700">78.5% (ROC-AUC: 0.786)</span>
              </div>
            </div>

            <Link
              to="/diabetes"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 pt-2"
            >
              Start Diabetes Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Heart Disease Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Heart className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900">Cardiovascular Disease Diagnosis</h3>
              <p className="text-xs text-rose-700 font-semibold mt-0.5">Cleveland Heart Disease Benchmark (UCI)</p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              Analyzes resting blood pressure, chest pain symptom types, serum cholesterol, exercise heart rate, and ST depression. 
              Mamdani fuzzy rules capture non-linear symptom ambiguity.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>GA Selected Biomarkers:</span>
                <span className="font-semibold text-slate-800">10 Optimized Parameters</span>
              </div>
              <div className="flex justify-between">
                <span>Holdout Test Accuracy:</span>
                <span className="font-bold text-rose-700">90.2% (ROC-AUC: 0.980)</span>
              </div>
            </div>

            <Link
              to="/heart"
              className="inline-flex items-center gap-2 text-sm font-bold text-rose-700 hover:text-rose-800 pt-2"
            >
              Start Heart Disease Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3 Pillars of the Soft Computing Topic */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">
          How the Hybrid Soft Computing Architecture Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              GA
            </div>
            <h4 className="font-bold text-sm text-slate-800">1. Feature Selection (GA)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Genetic Algorithm optimizes feature subsets, eliminating noisy parameters to reduce dataset dimensionality and maximize classification accuracy.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              ANN
            </div>
            <h4 className="font-bold text-sm text-slate-800">2. Neural Network Classification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-Layer Artificial Neural Network trained on standardized UCI benchmark data to learn complex nonlinear patterns between clinical metrics.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              Fuzzy
            </div>
            <h4 className="font-bold text-sm text-slate-800">3. Fuzzy Inference System</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mamdani fuzzy logic evaluates vague clinical symptoms (mild, borderline, high risk) with interpretable linguistic IF-THEN rules.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
