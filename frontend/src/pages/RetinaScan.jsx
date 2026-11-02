import React, { useState } from 'react';
import {
  Eye,
  Upload,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  FileDown,
  Layers,
  Info,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { analyzeRetinaImage } from '../services/api';

export default function RetinaScan({ onRetinaCompleted }) {
  const [file, setFile] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side' or 'heatmap_only'

  const sampleImages = [
    { name: "Sample 0: Healthy", file: "fundus_class0_healthy.jpg", label: "No DR" },
    { name: "Sample 1: Mild", file: "fundus_class1_mild.jpg", label: "Mild NPDR" },
    { name: "Sample 2: Moderate", file: "fundus_class2_moderate.jpg", label: "Moderate NPDR" },
    { name: "Sample 3: Severe", file: "fundus_class3_severe.jpg", label: "Severe NPDR" },
    { name: "Sample 4: Proliferative", file: "fundus_class4_proliferative.jpg", label: "Proliferative DR" }
  ];

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      selectFile(e.target.files[0]);
    }
  };

  const selectFile = (selected) => {
    setFile(selected);
    setPreviewUri(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleSelectSample = async (sample) => {
    try {
      setLoading(true);
      setError(null);
      const apiBase = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '') : '';
      let res;
      try {
        res = await fetch(`/sample_retina/${sample.file}`);
        if (!res.ok) throw new Error('Local sample not found');
      } catch {
        res = await fetch(`${apiBase}/sample_retina/${sample.file}`);
      }
      const blob = await res.blob();
      const sampleFile = new File([blob], sample.file, { type: 'image/jpeg' });
      selectFile(sampleFile);
    } catch (err) {
      setError("Could not load sample file. You can upload any JPEG or PNG fundus photograph.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await analyzeRetinaImage(formData);
      setResult(res.data);
      if (onRetinaCompleted) {
        onRetinaCompleted(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Image analysis failed. Ensure image is a valid retinal photograph.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUri(null);
    setResult(null);
    setError(null);
  };

  // Severity color tags
  const getSeverityBadge = (classId) => {
    switch (classId) {
      case 0: return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: 'Class 0 — No DR' };
      case 1: return { bg: 'bg-teal-100 text-teal-800 border-teal-300', label: 'Class 1 — Mild NPDR' };
      case 2: return { bg: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Class 2 — Moderate NPDR' };
      case 3: return { bg: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Class 3 — Severe NPDR' };
      case 4: return { bg: 'bg-rose-100 text-rose-800 border-rose-300', label: 'Class 4 — Proliferative DR' };
      default: return { bg: 'bg-slate-100 text-slate-800 border-slate-300', label: 'Unknown' };
    }
  };

  const barColors = ['#10b981', '#14b8a6', '#f59e0b', '#f97316', '#ef4444'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold">
          <Eye className="w-3.5 h-3.5 text-cyan-600" />
          Module 2 • Deep Learning Ophthalmic Vision
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
          RetinaScan — Diabetic Retinopathy Detection
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Trained on the <strong className="text-navy-900">Kaggle APTOS 2019 Blindness Detection</strong> dataset with biometric fundus validation. 
          Classifies fundus photographs across five international clinical severity stages with 
          <strong className="text-navy-900"> Grad-CAM attention localization</strong>.
        </p>
      </div>

      {/* Quick Benchmark Samples Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-navy-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Benchmark Test Samples (APTOS 2019 Standard)
          </span>
          <span className="text-[11px] text-slate-400">Click to evaluate without uploading</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {sampleImages.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(s)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 text-xs font-medium text-slate-700 hover:text-blue-700 transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3 h-3 text-blue-500" />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload and Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Upload Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
            1. Fundus Image Upload
          </h2>

          {!previewUri ? (
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20"
              onClick={() => document.getElementById('retina-upload-input').click()}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-navy-900">Drag & drop retinal fundus image here</p>
                <p className="text-[11px] text-slate-500">Supports standard JPEG and PNG ophthalmic photographs</p>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors"
              >
                Browse Files
              </button>
              <input
                id="retina-upload-input"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-square max-h-72 mx-auto flex items-center justify-center">
                <img
                  src={previewUri}
                  alt="Fundus preview"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="truncate max-w-[200px]">{file?.name || 'fundus_sample.jpg'}</span>
                <span>{(file?.size ? (file.size / 1024).toFixed(1) : 48)} KB</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing CNN...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Analyze Retina</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs flex items-start gap-3 shadow-md animate-fade-in">
              <div className="p-2 bg-rose-100 rounded-xl text-rose-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-rose-950 flex items-center gap-1.5">
                  <span>Image Validation Error</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 font-bold uppercase tracking-wider">
                    Non-Eye Image Detected
                  </span>
                </p>
                <p className="text-rose-900 font-bold leading-relaxed text-sm">
                  {error}
                </p>
                <p className="text-[11px] text-rose-700">
                  The system requires an authentic retinal fundus photograph showing retinal vasculature. Non-eye images (faces, scenes, documents) are strictly rejected.
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-xl text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Quality Requirements:</span>
            <p>• Minimum 120x120 resolution with identifiable circular choroidal fundus color.</p>
            <p>• Automated preprocessing crops dark borders and applies Ben Graham local contrast normalization.</p>
          </div>
        </div>

        {/* Right: Results & Grad-CAM */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center justify-between">
            <span>2. Diagnostic Inference Output</span>
            {result && (
              <span className="text-[10px] font-mono text-slate-400 font-normal">
                {result.model_version}
              </span>
            )}
          </h2>

          {!result ? (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <Eye className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-medium">Upload or select a fundus image to view CNN inference.</p>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Primary Predicted Class Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Predicted Disease Severity
                    </span>
                    <h3 className="text-lg font-black text-navy-900">
                      {result.predicted_class_name}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(result.predicted_class_id).bg}`}>
                    {result.severity_level}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs">
                  <span className="text-slate-500">Model Confidence:</span>
                  <span className="font-black text-navy-900 font-mono text-sm">{result.model_confidence_percent}</span>
                  <span className="text-[10px] text-slate-400 italic">(Model probability, not diagnostic certainty)</span>
                </div>
              </div>

              {/* Grad-CAM Attention Heatmap Display */}
              {result.gradcam_heatmap_uri && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-navy-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      Grad-CAM Visual Attention Heatmap
                    </span>
                    <span className="text-[10px] text-slate-400">Warmer colors indicate lesion attention</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-black p-2.5 rounded-2xl">
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] text-slate-300">Normalized Fundus</span>
                      <img
                        src={previewUri}
                        alt="Original"
                        className="rounded-lg aspect-square object-contain mx-auto max-h-36"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] text-teal-300">Grad-CAM Overlay</span>
                      <img
                        src={result.gradcam_heatmap_uri}
                        alt="Grad-CAM"
                        className="rounded-lg aspect-square object-contain mx-auto max-h-36 border border-teal-500/40"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5-Class Probability Distribution */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-navy-900 block">
                  Five-Class Probability Distribution (APTOS 2019):
                </span>
                <div className="h-36 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={result.class_probabilities}
                      margin={{ top: 0, right: 20, left: 45, bottom: 0 }}
                    >
                      <XAxis type="number" domain={[0, 1]} hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 10, fill: '#475569' }}
                        width={65}
                      />
                      <Tooltip formatter={(val) => `${(val * 100).toFixed(1)}%`} />
                      <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                        {result.class_probabilities.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={barColors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Clinical Guidance */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                <p className="font-bold text-navy-900">Clinical Pathology:</p>
                <p className="text-slate-700 leading-relaxed">{result.clinical_interpretation}</p>
                <p className="text-blue-900 font-semibold pt-1">Action: {result.recommended_action}</p>
              </div>

            </div>
          )}

          {/* Academic Prototype Notice */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Academic Research Prototype
            </span>
            <span>APTOS 2019 Benchmark</span>
          </div>

        </div>

      </div>

    </div>
  );
}
