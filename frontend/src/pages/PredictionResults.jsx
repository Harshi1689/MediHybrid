import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  FileDown,
  CheckCircle,
  AlertTriangle,
  Dna,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function PredictionResults() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <Activity className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Assessment Loaded</h2>
        <p className="text-xs text-slate-500">
          Run an evaluation from the Diabetes or Heart Disease page to view the diagnosis report.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/diabetes" className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors">
            Diabetes Test
          </Link>
          <Link to="/heart" className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors">
            Heart Disease Test
          </Link>
        </div>
      </div>
    );
  }

  const hybrid = result.hybrid || {};
  const ann = result.ann || {};
  const fuzzy = result.fuzzy || {};
  const explain = result.explainability || [];
  const score = hybrid.score || 0;
  const category = hybrid.category || "Evaluated";

  // Plain language translation of categories
  const getReadableRisk = (cat, s) => {
    if (s < 35.0) {
      return {
        label: "Low Risk (Healthy)",
        summary: "Patient metrics fall largely within healthy benchmark boundaries. Routine periodic monitoring is recommended.",
        color: "text-emerald-700",
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-300"
      };
    }
    if (s < 65.0) {
      return {
        label: "Moderate Risk (Warning / Borderline)",
        summary: "Certain clinical indicators are outside optimal thresholds. Lifestyle adjustments and follow-up medical consultation are suggested.",
        color: "text-amber-700",
        border: "border-amber-200",
        bg: "bg-amber-50",
        badge: "bg-amber-100 text-amber-800 border-amber-300"
      };
    }
    return {
      label: "High Risk (Medical Attention Advised)",
      summary: "Significant risk indicators detected across both neural network and fuzzy rule models. Clinical diagnostic checkup with a physician is strongly advised.",
      color: "text-rose-700",
      border: "border-rose-200",
      bg: "bg-rose-50",
      badge: "bg-rose-100 text-rose-800 border-rose-300"
    };
  };

  const riskInfo = getReadableRisk(category, score);

  const handleDownloadPDF = () => {
    if (result.record_id) {
      window.open(`/api/reports/download/${result.record_id}`, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-teal-600" /> Diagnosis Report Ready
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {result.disease || "Clinical Diagnosis Results"}
          </h1>
        </div>

        <div className="flex gap-2.5">
          {result.record_id && (
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <FileDown className="w-4 h-4 text-teal-400" />
              <span>Download PDF Summary</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Diagnosis Result Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${riskInfo.border} ${riskInfo.bg} shadow-sm space-y-5`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-600">
              Overall Disease Probability Score
            </span>
            <div className={`text-5xl sm:text-6xl font-black ${riskInfo.color} tracking-tight font-mono`}>
              {score}%
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${riskInfo.badge}`}>
                {riskInfo.label}
              </span>
              {result.record_id && (
                <span className="text-xs text-slate-500 font-mono">
                  Record #{result.record_id}
                </span>
              )}
            </div>
          </div>

          {/* Model Combination Breakdown */}
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 space-y-2.5 min-w-[280px]">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-600" /> How This Score Is Calculated
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Neural Network (ANN):</span>
              <span className="font-mono font-bold text-slate-800">{ann.score}% likelihood</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Fuzzy Logic Symptoms:</span>
              <span className="font-mono font-bold text-slate-800">{fuzzy.fuzzy_score}% risk degree</span>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 leading-tight">
              Combines neural classification (70%) with transparent fuzzy reasoning (30%) for reliable diagnosis.
            </div>
          </div>

        </div>

        {/* Clear Doctor / User Interpretation */}
        <div className="bg-white/95 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
          <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">
            Plain-English Diagnosis Summary:
          </strong>
          <p>{riskInfo.summary}</p>
          {hybrid.recommendation && (
            <p className="text-slate-600 text-xs pt-1 border-t border-slate-100 mt-2">
              <span className="font-semibold text-slate-800">Clinical Advice:</span> {hybrid.recommendation}
            </p>
          )}
        </div>
      </div>

      {/* Model Explanations: GA Selected Features & Fuzzy Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Genetic Algorithm (GA) Features */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Dna className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Key Diagnostic Features (Genetic Algorithm)
              </h3>
              <p className="text-[11px] text-slate-500">Most informative parameters selected by GA optimization</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {result.ga_selected_features?.map((feat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-semibold text-xs flex items-center gap-1"
              >
                ✓ {feat}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            GA eliminated non-essential variables to reduce data noise and increase model accuracy.
          </p>
        </div>

        {/* Fuzzy Logic Active Rules */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Fuzzy Inference Reasoning
              </h3>
              <p className="text-[11px] text-slate-500">How symptom vagueness was evaluated</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {fuzzy.active_rules && fuzzy.active_rules.length > 0 ? (
              fuzzy.active_rules.map((rule, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 leading-snug">
                  {rule}
                </div>
              ))
            ) : (
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                Patient metrics fall inside baseline tolerance limits.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Biomarker Status Table */}
      {explain.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Patient Biomarker Analysis & Risk Indicators
            </h3>
            <p className="text-[11px] text-slate-500">
              Comparison between entered patient measurements and healthy baseline clinical values.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Test / Biomarker</th>
                  <th className="py-2.5 px-3 font-semibold">Patient Value</th>
                  <th className="py-2.5 px-3 font-semibold">Healthy Baseline</th>
                  <th className="py-2.5 px-3 font-semibold">Diagnostic Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {explain.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{f.label}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {f.value} {f.unit}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{f.reference} {f.unit}</td>
                    <td className="py-2.5 px-3">
                      {f.is_risk_factor ? (
                        <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px] inline-flex items-center gap-1">
                          ↑ Elevated Risk
                        </span>
                      ) : f.is_protective ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] inline-flex items-center gap-1">
                          ✓ Normal / Healthy
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">Acceptable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
        <Link
          to="/dashboard"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          ← Return to Dashboard
        </Link>

        <div className="flex gap-2">
          <Link
            to="/diabetes"
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            New Diabetes Test
          </Link>
          <Link
            to="/heart"
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            New Heart Test
          </Link>
        </div>
      </div>

    </div>
  );
}
