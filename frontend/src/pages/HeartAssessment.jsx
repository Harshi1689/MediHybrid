import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { predictHeart } from '../services/api';

export default function HeartAssessment({ onAssessmentCompleted }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: 54,
    sex: 1,
    cp: 3,
    trestbps: 130,
    chol: 240,
    fbs: 0,
    restecg: 1,
    thalach: 148,
    exang: 0,
    oldpeak: 1.2,
    slope: 2,
    ca: 1,
    thal: 3,
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
        age: 34,
        sex: 0,
        cp: 1,
        trestbps: 112,
        chol: 175,
        fbs: 0,
        restecg: 0,
        thalach: 172,
        exang: 0,
        oldpeak: 0.0,
        slope: 1,
        ca: 0,
        thal: 3
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        age: 62,
        sex: 1,
        cp: 4,
        trestbps: 155,
        chol: 280,
        fbs: 1,
        restecg: 2,
        thalach: 118,
        exang: 1,
        oldpeak: 2.8,
        slope: 2,
        ca: 2,
        thal: 7
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await predictHeart(formData);
      if (onAssessmentCompleted) onAssessmentCompleted(res.data);
      navigate('/results', { state: { result: res.data } });
    } catch (err) {
      const msg = err.response?.data?.detail 
        || (err.response?.status === 404 ? "Backend API route not found (404). Check backend connection." : null)
        || "Heart disease assessment failed. Please check backend server status.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Title */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-rose-600" />
          Cardiovascular Diagnosis
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Heart Disease Risk Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Evaluated via <strong className="text-slate-800">Genetic Algorithm (GA)</strong> feature selection, 
          an <strong className="text-slate-800">Artificial Neural Network (ANN)</strong> classifier, and an independent 
          <strong className="text-slate-800"> Mamdani Fuzzy Inference System</strong> for clinical ambiguity.
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
          <span className="text-sm font-bold text-slate-800">Cardiovascular Clinical Parameters</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Patient Age</span>
              <span className="text-rose-700 font-mono font-medium">{formData.age} yrs</span>
            </label>
            <input
              type="number"
              name="age"
              min="20"
              max="95"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
            <span className="text-[11px] text-slate-500">Patient age in years</span>
          </div>

          {/* Sex */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Gender / Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
            <span className="text-[11px] text-slate-500">Biological sex</span>
          </div>

          {/* Chest Pain Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Chest Pain Type</label>
            <select
              name="cp"
              value={formData.cp}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="1">Typical Angina</option>
              <option value="2">Atypical Angina</option>
              <option value="3">Non-anginal Pain</option>
              <option value="4">Asymptomatic (No symptoms)</option>
            </select>
            <span className="text-[11px] text-slate-500">Symptom severity category</span>
          </div>

          {/* Resting BP */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Resting Blood Pressure</span>
              <span className="text-rose-700 font-mono font-medium">{formData.trestbps} mm Hg</span>
            </label>
            <input
              type="number"
              name="trestbps"
              min="80"
              max="220"
              value={formData.trestbps}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
            <span className="text-[11px] text-slate-500">Normal resting: 90–120 mm Hg</span>
          </div>

          {/* Serum Cholesterol */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Serum Cholesterol</span>
              <span className="text-rose-700 font-mono font-medium">{formData.chol} mg/dL</span>
            </label>
            <input
              type="number"
              name="chol"
              min="100"
              max="550"
              value={formData.chol}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
            <span className="text-[11px] text-slate-500">Desirable: &lt;200 mg/dL, High: &gt;240 mg/dL</span>
          </div>

          {/* Max Heart Rate */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>Max Heart Rate</span>
              <span className="text-rose-700 font-mono font-medium">{formData.thalach} bpm</span>
            </label>
            <input
              type="number"
              name="thalach"
              min="60"
              max="220"
              value={formData.thalach}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
            <span className="text-[11px] text-slate-500">Maximum heart rate achieved during exercise</span>
          </div>

          {/* Exercise Angina */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Exercise Angina</label>
            <select
              name="exang"
              value={formData.exang}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="0">No (No pain during exercise)</option>
              <option value="1">Yes (Chest pain during exercise)</option>
            </select>
            <span className="text-[11px] text-slate-500">Chest discomfort induced by physical activity</span>
          </div>

          {/* ST Depression */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex justify-between">
              <span>ST Depression (ECG stress)</span>
              <span className="text-rose-700 font-mono font-medium">{formData.oldpeak} mm</span>
            </label>
            <input
              type="number"
              name="oldpeak"
              min="0.0"
              max="6.5"
              step="0.1"
              value={formData.oldpeak}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
            <span className="text-[11px] text-slate-500">ECG test change (0.0 mm is normal)</span>
          </div>

          {/* Slope */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">ECG Slope Pattern</label>
            <select
              name="slope"
              value={formData.slope}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="1">Upsloping (Healthy pattern)</option>
              <option value="2">Flat (Borderline concern)</option>
              <option value="3">Downsloping (Signs of heart strain)</option>
            </select>
            <span className="text-[11px] text-slate-500">Slope of peak exercise ST segment</span>
          </div>

          {/* Major Vessels */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Major Blood Vessels (Fluoroscopy)</label>
            <select
              name="ca"
              value={formData.ca}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="0">0 — None blocked / clear</option>
              <option value="1">1 — One vessel affected</option>
              <option value="2">2 — Two vessels affected</option>
              <option value="3">3 — Three vessels affected</option>
            </select>
            <span className="text-[11px] text-slate-500">Number of major blood vessels visible</span>
          </div>

          {/* Thalassemia */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Heart Blood Flow (Thalassemia Test)</label>
            <select
              name="thal"
              value={formData.thal}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="3">Normal Blood Flow</option>
              <option value="6">Fixed Defect (Past damage)</option>
              <option value="7">Reversible Defect (Temporary reduced flow)</option>
            </select>
            <span className="text-[11px] text-slate-500">Cardiovascular scan evaluation result</span>
          </div>

          {/* Fasting Blood Sugar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Fasting Blood Sugar &gt; 120 mg/dL</label>
            <select
              name="fbs"
              value={formData.fbs}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="0">Normal (FBS ≤ 120 mg/dL)</option>
              <option value="1">Elevated (FBS &gt; 120 mg/dL)</option>
            </select>
            <span className="text-[11px] text-slate-500">Blood sugar indicator</span>
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Diagnosis Models...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Run Heart Disease Diagnosis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
