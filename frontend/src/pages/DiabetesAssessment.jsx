import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { predictDiabetes } from '../services/api';

export default function DiabetesAssessment({ onAssessmentCompleted }) {
  const navigate = useNavigate();

  // Clinical parameters matching Pima Indians benchmark
  const [formData, setFormData] = useState({
    Glucose: 110,
    BMI: 24.5,
    BloodPressure: 72,
    Age: 32,
    Pregnancies: 1,
    Insulin: 85,
    SkinThickness: 23,
    DiabetesPedigreeFunction: 0.38,
    ann_weight: 0.70,
    fuzzy_weight: 0.30
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleQuickFill = (type) => {
    if (type === 'normal') {
      setFormData((prev) => ({
        ...prev,
        Glucose: 92,
        BMI: 22.0,
        BloodPressure: 70,
        Age: 28,
        Pregnancies: 0,
        Insulin: 65,
        SkinThickness: 19,
        DiabetesPedigreeFunction: 0.25
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        Glucose: 165,
        BMI: 34.2,
        BloodPressure: 86,
        Age: 52,
        Pregnancies: 4,
        Insulin: 190,
        SkinThickness: 34,
        DiabetesPedigreeFunction: 0.75
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await predictDiabetes(formData);
      if (onAssessmentCompleted) onAssessmentCompleted(res.data);
      navigate('/results', { state: { result: res.data } });
    } catch (err) {
      const msg = err.response?.data?.detail 
        || (err.response?.status === 404 ? "Backend API route not found (404). Check backend connection." : null)
        || "Assessment request failed. Please check backend server status.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          Diabetes Diagnosis
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Diabetes Risk Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Enter patient clinical metrics below. The system utilizes <strong className="text-slate-800">Genetic Algorithm (GA)</strong> for optimal feature selection, 
          <strong className="text-slate-800"> Artificial Neural Network (ANN)</strong> trained on UCI benchmarks, and 
          <strong className="text-slate-800"> Mamdani Fuzzy Logic</strong> to assess vague symptoms.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Assessment Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-sm font-bold text-slate-800">Patient Clinical Parameters</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('normal')}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium transition-colors"
            >
              Fill Normal Example
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('high')}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium transition-colors"
            >
              Fill High Risk Example
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Glucose */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Fasting Glucose Level (Sugar)</span>
              <span className="text-teal-700 font-mono font-medium">{formData.Glucose} mg/dL</span>
            </label>
            <input
              type="number"
              name="Glucose"
              min="40"
              max="300"
              step="1"
              value={formData.Glucose}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Normal fasting: 70–99 mg/dL | Pre-diabetes: 100–125 mg/dL</span>
          </div>

          {/* BMI */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Body Mass Index (BMI)</span>
              <span className="text-teal-700 font-mono font-medium">{formData.BMI} kg/m²</span>
            </label>
            <input
              type="number"
              name="BMI"
              min="12.0"
              max="70.0"
              step="0.1"
              value={formData.BMI}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Healthy: 18.5–24.9 | Overweight: 25.0–29.9 | Obese: ≥30.0</span>
          </div>

          {/* Blood Pressure */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Diastolic Blood Pressure</span>
              <span className="text-teal-700 font-mono font-medium">{formData.BloodPressure} mm Hg</span>
            </label>
            <input
              type="number"
              name="BloodPressure"
              min="40"
              max="200"
              step="1"
              value={formData.BloodPressure}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Normal diastolic pressure: 60–80 mm Hg</span>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Patient Age</span>
              <span className="text-teal-700 font-mono font-medium">{formData.Age} years</span>
            </label>
            <input
              type="number"
              name="Age"
              min="18"
              max="110"
              step="1"
              value={formData.Age}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Adult age cohort range: 18–100 years</span>
          </div>

          {/* Pregnancies */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Number of Pregnancies</span>
              <span className="text-teal-700 font-mono font-medium">{formData.Pregnancies}</span>
            </label>
            <input
              type="number"
              name="Pregnancies"
              min="0"
              max="20"
              step="1"
              value={formData.Pregnancies}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Relevant for gestational diabetes screening history</span>
          </div>

          {/* Insulin */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Serum Insulin Level</span>
              <span className="text-teal-700 font-mono font-medium">{formData.Insulin} μU/mL</span>
            </label>
            <input
              type="number"
              name="Insulin"
              min="10"
              max="900"
              step="1"
              value={formData.Insulin}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Normal 2-hour fasting range: 16–166 μU/mL</span>
          </div>

          {/* Skin Thickness */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Skin Fold Thickness</span>
              <span className="text-teal-700 font-mono font-medium">{formData.SkinThickness} mm</span>
            </label>
            <input
              type="number"
              name="SkinThickness"
              min="5"
              max="99"
              step="1"
              value={formData.SkinThickness}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Triceps skinfold measurement (body fat indicator)</span>
          </div>

          {/* Diabetes Pedigree Function */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Diabetes Pedigree Function (Genetic Risk)</span>
              <span className="text-teal-700 font-mono font-medium">{formData.DiabetesPedigreeFunction}</span>
            </label>
            <input
              type="number"
              name="DiabetesPedigreeFunction"
              min="0.05"
              max="2.8"
              step="0.01"
              value={formData.DiabetesPedigreeFunction}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 outline-none transition-all"
            />
            <span className="text-[11px] text-slate-500">Hereditary family score (typical range: 0.05 – 2.50)</span>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Diagnosis Models...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Run Diabetes Diagnosis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
