import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { predictDiabetes } from '../services/api';

export default function DiabetesAssessment({ onAssessmentCompleted }) {
  const navigate = useNavigate();

  // 8 clinical parameters matching Pima Indians benchmark
  const [formData, setFormData] = useState({
    Pregnancies: 1,
    Glucose: 110,
    BloodPressure: 72,
    SkinThickness: 23,
    Insulin: 85,
    BMI: 24.5,
    DiabetesPedigreeFunction: 0.38,
    Age: 32,
    ann_weight: 0.70,
    fuzzy_weight: 0.30
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 4 clinical presets for testing
  const presets = [
    {
      name: "Healthy Baseline",
      desc: "Optimal fasting glucose, normal BMI, young metabolic profile",
      values: { Pregnancies: 0, Glucose: 88, BloodPressure: 68, SkinThickness: 18, Insulin: 64, BMI: 21.8, DiabetesPedigreeFunction: 0.18, Age: 23 }
    },
    {
      name: "Pre-Diabetes Borderline",
      desc: "Impaired fasting glucose, overweight BMI, middle age",
      values: { Pregnancies: 2, Glucose: 124, BloodPressure: 78, SkinThickness: 28, Insulin: 120, BMI: 28.6, DiabetesPedigreeFunction: 0.44, Age: 42 }
    },
    {
      name: "Metabolic Syndrome (High Risk)",
      desc: "Elevated glycemia (>160), obesity (BMI 36+), multiple risk factors",
      values: { Pregnancies: 5, Glucose: 168, BloodPressure: 86, SkinThickness: 36, Insulin: 215, BMI: 35.8, DiabetesPedigreeFunction: 0.82, Age: 52 }
    },
    {
      name: "Post-Gestational Screening",
      desc: "Multiple pregnancies with intermediate glycemic markers",
      values: { Pregnancies: 6, Glucose: 138, BloodPressure: 76, SkinThickness: 30, Insulin: 135, BMI: 31.2, DiabetesPedigreeFunction: 0.55, Age: 44 }
    }
  ];

  const handleApplyPreset = (presetVals) => {
    setFormData((prev) => ({ ...prev, ...presetVals }));
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
      const res = await predictDiabetes(cleanPayload);
      onAssessmentCompleted(res.data);
      // Navigate to results page with prediction payload
      navigate('/results', { state: { result: res.data } });
    } catch (err) {
      const msg = err.response?.data?.detail 
        || (err.response?.status === 404 ? "Backend API route not found (404). Verify your Python backend is deployed or check VITE_API_BASE_URL." : null)
        || "Prediction request could not be processed. Verify backend services are active and reachable.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          Module 1 • Soft Computing Diagnostic Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
          Diabetes Risk Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Evaluated via <strong className="text-navy-900">DEAP Genetic Algorithm</strong> feature selection, 
          a <strong className="text-navy-900">Multi-Layer Neural Network</strong>, and a standalone 
          <strong className="text-navy-900"> Mamdani Fuzzy Inference System</strong>.
        </p>
      </div>

      {/* Preset Quick Loader */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Quick Clinical Profiles
          </span>
          <span className="text-[11px] text-slate-400">Select to auto-fill verified case data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p.values)}
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all group"
            >
              <div className="font-bold text-xs text-navy-900 group-hover:text-teal-700">{p.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Clinical Input Form */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Glucose */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Fasting Glucose (mg/dL)</span>
              <span className="text-teal-600 font-mono font-medium">{formData.Glucose}</span>
            </label>
            <input
              type="number"
              name="Glucose"
              min="40"
              max="300"
              step="1"
              value={formData.Glucose ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Normal fasting: 70–99 mg/dL | Pre-diabetes: 100–125 mg/dL</span>
          </div>

          {/* BMI */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Body Mass Index (BMI in kg/m²)</span>
              <span className="text-teal-600 font-mono font-medium">{formData.BMI}</span>
            </label>
            <input
              type="number"
              name="BMI"
              min="12.0"
              max="70.0"
              step="0.1"
              value={formData.BMI ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Normal: 18.5–24.9 | Overweight: 25.0–29.9 | Obese: ≥30.0</span>
          </div>

          {/* Blood Pressure */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Diastolic Blood Pressure (mm Hg)</span>
              <span className="text-teal-600 font-mono font-medium">{formData.BloodPressure}</span>
            </label>
            <input
              type="number"
              name="BloodPressure"
              min="40"
              max="200"
              step="1"
              value={formData.BloodPressure ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Normal diastolic: 60–80 mm Hg</span>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Age (Years)</span>
              <span className="text-teal-600 font-mono font-medium">{formData.Age}</span>
            </label>
            <input
              type="number"
              name="Age"
              min="18"
              max="110"
              step="1"
              value={formData.Age ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Clinical adult cohort range: 18–100</span>
          </div>

          {/* Pregnancies */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Pregnancies Count</span>
              <span className="text-teal-600 font-mono font-medium">{formData.Pregnancies}</span>
            </label>
            <input
              type="number"
              name="Pregnancies"
              min="0"
              max="20"
              step="1"
              value={formData.Pregnancies ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Gestational diabetes metabolic history factor</span>
          </div>

          {/* Insulin */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>2-Hour Serum Insulin (μU/mL)</span>
              <span className="text-teal-600 font-mono font-medium">{formData.Insulin}</span>
            </label>
            <input
              type="number"
              name="Insulin"
              min="10"
              max="900"
              step="1"
              value={formData.Insulin ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Reference fasting: 16–166 μU/mL</span>
          </div>

          {/* Skin Thickness */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Triceps Skin Fold Thickness (mm)</span>
              <span className="text-teal-600 font-mono font-medium">{formData.SkinThickness}</span>
            </label>
            <input
              type="number"
              name="SkinThickness"
              min="5"
              max="99"
              step="1"
              value={formData.SkinThickness ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Subcutaneous adipose tissue caliper marker</span>
          </div>

          {/* Diabetes Pedigree Function */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex justify-between">
              <span>Diabetes Pedigree Function</span>
              <span className="text-teal-600 font-mono font-medium">{formData.DiabetesPedigreeFunction}</span>
            </label>
            <input
              type="number"
              name="DiabetesPedigreeFunction"
              min="0.05"
              max="2.8"
              step="0.01"
              value={formData.DiabetesPedigreeFunction ?? ''}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none"
            />
            <span className="text-[10px] text-slate-400">Hereditary genetic history coefficient (0.05 – 2.50)</span>
          </div>

        </div>

        {/* Configurable Hybrid Fusion Weight Slider */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-navy-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              Hybrid Fusion Weight Calibration
            </span>
            <span className="font-mono text-teal-700 font-bold">
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
            className="w-full accent-teal-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>More Fuzzy Symbolic Logic (Mamdani)</span>
            <span className="font-semibold text-slate-600">Academic Standard: 70% ANN / 30% Fuzzy</span>
            <span>More Neural Network (MLP)</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-navy-900 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating GA, ANN & Fuzzy Systems...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Execute Hybrid Assessment →</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
