import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Sliders,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Activity
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

  const presets = [
    {
      name: "Athletic Young Profile (Low Risk)",
      desc: "Young adult, low resting BP, desirable lipid panel, optimal exercise tolerance",
      values: { age: 34, sex: 0, cp: 1, trestbps: 112, chol: 175, fbs: 0, restecg: 0, thalach: 178, exang: 0, oldpeak: 0.0, slope: 1, ca: 0, thal: 3 }
    },
    {
      name: "Borderline Cardiac Strain",
      desc: "Middle age, mildly elevated blood pressure and serum cholesterol, flat ST slope",
      values: { age: 52, sex: 1, cp: 2, trestbps: 136, chol: 238, fbs: 0, restecg: 1, thalach: 142, exang: 0, oldpeak: 1.2, slope: 2, ca: 0, thal: 3 }
    },
    {
      name: "Exercise-Induced Ischemia",
      desc: "Exertional chest discomfort, positive exercise angina, marked ST depression",
      values: { age: 58, sex: 1, cp: 4, trestbps: 146, chol: 268, fbs: 1, restecg: 2, thalach: 124, exang: 1, oldpeak: 2.6, slope: 2, ca: 2, thal: 7 }
    },
    {
      name: "Advanced Multi-Vessel Disease",
      desc: "Senior patient with 3 colored major vessels and reversible perfusion defect",
      values: { age: 67, sex: 1, cp: 4, trestbps: 160, chol: 295, fbs: 1, restecg: 2, thalach: 108, exang: 1, oldpeak: 3.4, slope: 3, ca: 3, thal: 7 }
    }
  ];

  const handleApplyPreset = (pVals) => {
    setFormData((prev) => ({ ...prev, ...pVals }));
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow clearing the field completely without snapping back to 0
    if (value === '') {
      setFormData((prev) => ({ ...prev, [name]: '' }));
      return;
    }
    // Remove accidental leading zeros (e.g., "0750" -> "750", "08" -> "8") while keeping decimals like "0.5"
    let cleanVal = value;
    if (/^0[0-9]+/.test(cleanVal)) {
      cleanVal = cleanVal.replace(/^0+/, '');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: cleanVal
    }));
  };

  const handleSliderChange = (e) => {
    const annW = parseFloat(e.target.value);
    const fuzW = parseFloat((1.0 - annW).toFixed(2));
    setFormData((prev) => ({
      ...prev,
      ann_weight: annW,
      fuzzy_weight: fuzW
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Convert values to float for API request
    const cleanPayload = {};
    Object.keys(formData).forEach((k) => {
      cleanPayload[k] = formData[k] === '' ? 0 : parseFloat(formData[k]) || 0;
    });

    try {
      const res = await predictHeart(cleanPayload);
      onAssessmentCompleted(res.data);
      navigate('/results', { state: { result: res.data } });
    } catch (err) {
      const msg = err.response?.data?.detail 
        || (err.response?.status === 404 ? "Backend API route not found (404). Verify your Python backend is deployed or check VITE_API_BASE_URL." : null)
        || "Heart disease assessment failed. Verify backend services are active and reachable.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-rose-600" />
          Module 1 • Soft Computing Cardiovascular Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
          Heart Disease Risk Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Evaluated via <strong className="text-navy-900">DEAP Genetic Algorithm</strong> feature selection, 
          an <strong className="text-navy-900">Artificial Neural Network (ANN)</strong> classifier, and an independent 
          <strong className="text-navy-900"> Mamdani Fuzzy Inference System</strong>.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Quick Clinical Cardiac Profiles
          </span>
          <span className="text-[11px] text-slate-400">Click to load benchmark clinical cases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p.values)}
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 transition-all group"
            >
              <div className="font-bold text-xs text-navy-900 group-hover:text-rose-700">{p.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Assessment Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Patient Age</span>
              <span className="text-rose-600 font-mono font-medium">{formData.age} yrs</span>
            </label>
            <input
              type="number"
              name="age"
              min="20"
              max="95"
              value={formData.age ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Sex */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900">Biological Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="1">1 — Male</option>
              <option value="0">0 — Female</option>
            </select>
          </div>

          {/* Chest Pain Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900">Chest Pain Type (cp)</label>
            <select
              name="cp"
              value={formData.cp}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="1">1 — Typical Angina</option>
              <option value="2">2 — Atypical Angina</option>
              <option value="3">3 — Non-anginal Pain</option>
              <option value="4">4 — Asymptomatic / Silent</option>
            </select>
          </div>

          {/* Resting BP */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Resting Blood Pressure</span>
              <span className="text-rose-600 font-mono font-medium">{formData.trestbps} mm Hg</span>
            </label>
            <input
              type="number"
              name="trestbps"
              min="80"
              max="220"
              value={formData.trestbps ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Serum Cholesterol */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Serum Cholesterol</span>
              <span className="text-rose-600 font-mono font-medium">{formData.chol} mg/dL</span>
            </label>
            <input
              type="number"
              name="chol"
              min="100"
              max="550"
              value={formData.chol ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Max Heart Rate */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Max Heart Rate (thalach)</span>
              <span className="text-rose-600 font-mono font-medium">{formData.thalach} bpm</span>
            </label>
            <input
              type="number"
              name="thalach"
              min="60"
              max="220"
              value={formData.thalach ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Exercise Angina */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900">Exercise-Induced Angina</label>
            <select
              name="exang"
              value={formData.exang}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="0">0 — No Angina on Exertion</option>
              <option value="1">1 — Yes (Exertional Angina)</option>
            </select>
          </div>

          {/* ST Depression */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>ST Depression (oldpeak)</span>
              <span className="text-rose-600 font-mono font-medium">{formData.oldpeak} mm</span>
            </label>
            <input
              type="number"
              name="oldpeak"
              min="0.0"
              max="6.5"
              step="0.1"
              value={formData.oldpeak ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Slope */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900">Peak Exercise ST Slope</label>
            <select
              name="slope"
              value={formData.slope}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="1">1 — Upsloping (Healthy)</option>
              <option value="2">2 — Flat (Borderline)</option>
              <option value="3">3 — Downsloping (Ischemia)</option>
            </select>
          </div>

          {/* Major Vessels */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900">Major Vessels Colored (ca)</label>
            <select
              name="ca"
              value={formData.ca}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="0">0 — None Colored</option>
              <option value="1">1 — One Vessel</option>
              <option value="2">2 — Two Vessels</option>
              <option value="3">3 — Three Vessels</option>
            </select>
          </div>

          {/* Thalassemia */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900">Thalassemia Perfusion (thal)</label>
            <select
              name="thal"
              value={formData.thal}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="3">3 — Normal Perfusion</option>
              <option value="6">6 — Fixed Perfusion Defect</option>
              <option value="7">7 — Reversible Perfusion Defect</option>
            </select>
          </div>

          {/* Fasting Blood Sugar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900">Fasting Blood Sugar &gt; 120</label>
            <select
              name="fbs"
              value={formData.fbs}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
            >
              <option value="0">0 — False (FBS ≤ 120 mg/dL)</option>
              <option value="1">1 — True (FBS &gt; 120 mg/dL)</option>
            </select>
          </div>

        </div>

        {/* Fusion Weight Calibration */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-navy-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-500" />
              Cardiovascular Hybrid Fusion Weights
            </span>
            <span className="font-mono text-rose-700 font-bold">
              ANN: {Math.round(formData.ann_weight * 100)}% | Fuzzy: {Math.round(formData.fuzzy_weight * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={formData.ann_weight}
            onChange={handleSliderChange}
            className="w-full accent-rose-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>More Mamdani Fuzzy Rules</span>
            <span className="font-semibold text-slate-600">Standard Calibration: 70% ANN / 30% Fuzzy</span>
            <span>More Neural Network (MLP)</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating GA, ANN & Cardiac Fuzzy Systems...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Execute Cardiac Assessment →</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
