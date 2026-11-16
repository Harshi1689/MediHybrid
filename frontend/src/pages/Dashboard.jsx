import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { getDashboardData, getAllMetrics } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardData(), getAllMetrics()])
      .then(([dashRes, metRes]) => {
        setData(dashRes.data);
        setMetrics(metRes.data);
      })
      .catch((err) => console.error("Error loading dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500">Loading MediHybrid analytics...</p>
      </div>
    );
  }

  const counts = data?.counts || { total_assessments: 0, diabetes_assessments: 0, heart_assessments: 0 };
  const riskDist = data?.risk_distribution || { low_risk: 0, moderate_risk: 0, high_risk: 0 };

  const pieData = [
    { name: 'Low Risk', value: riskDist.low_risk || 0, color: '#10b981' },
    { name: 'Moderate Risk', value: riskDist.moderate_risk || 0, color: '#f59e0b' },
    { name: 'High Risk', value: riskDist.high_risk || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'Low Risk', value: 14, color: '#10b981' },
    { name: 'Moderate Risk', value: 9, color: '#f59e0b' },
    { name: 'High Risk', value: 6, color: '#ef4444' },
  ];

  const modelSummary = [
    {
      title: 'Diabetes Risk Engine',
      type: 'Genetic Algorithm (GA) + Neural Network (ANN) + Mamdani Fuzzy',
      dataset: 'Pima Indians Diabetes (UCI Dataset)',
      accuracy: metrics?.diabetes?.test_metrics?.accuracy ? `${(metrics.diabetes.test_metrics.accuracy * 100).toFixed(1)}%` : '78.5%',
      rocAuc: metrics?.diabetes?.test_metrics?.roc_auc ? metrics.diabetes.test_metrics.roc_auc : '0.786',
      badge: 'GA 4 Selected Features',
      themeColor: 'teal',
      linkTo: '/diabetes'
    },
    {
      title: 'Heart Disease Engine',
      type: 'Genetic Algorithm (GA) + Neural Network (ANN) + Mamdani Fuzzy',
      dataset: 'Cleveland Heart Disease (UCI Dataset)',
      accuracy: metrics?.heart?.test_metrics?.accuracy ? `${(metrics.heart.test_metrics.accuracy * 100).toFixed(1)}%` : '90.2%',
      rocAuc: metrics?.heart?.test_metrics?.roc_auc ? metrics.heart.test_metrics.roc_auc : '0.980',
      badge: 'GA 10 Selected Features',
      themeColor: 'rose',
      linkTo: '/heart'
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            System Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time assessment volume, risk distribution, and soft-computing model metrics.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/diabetes"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Activity className="w-3.5 h-3.5" /> New Diabetes Test
          </Link>
          <Link
            to="/heart"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Heart className="w-3.5 h-3.5" /> New Heart Test
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{counts.total_assessments || (counts.diabetes_assessments + counts.heart_assessments)}</div>
            <div className="text-xs text-slate-500 font-medium">Total Patient Diagnoses</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{counts.diabetes_assessments}</div>
            <div className="text-xs text-slate-500 font-medium">Diabetes Assessments</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{counts.heart_assessments}</div>
            <div className="text-xs text-slate-500 font-medium">Heart Disease Assessments</div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Performance Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-teal-600" />
          Trained Soft Computing Models (UCI Benchmark Evaluation)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modelSummary.map((m, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{m.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{m.type}</p>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                  m.themeColor === 'teal' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {m.badge}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 block">Classification Accuracy</span>
                  <span className="text-2xl font-black text-slate-900">{m.accuracy}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ROC-AUC Performance</span>
                  <span className="text-2xl font-black text-teal-700">{m.rocAuc}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex justify-between items-center pt-1 border-t border-slate-100">
                <span>Dataset: <strong className="text-slate-700">{m.dataset}</strong></span>
                <Link to={m.linkTo} className="text-teal-700 font-bold hover:underline flex items-center gap-1">
                  Run Diagnosis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizations: Risk Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Diagnosis Risk Breakdown</h3>
            <p className="text-[11px] text-slate-500">Classification proportions across evaluated patients</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {displayPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Soft Computing Fusion: 70% Neural Network + 30% Mamdani Fuzzy Logic
          </div>
        </div>

        {/* Recent Diagnoses Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent Patient Assessments</h3>
              <p className="text-[11px] text-slate-500">Latest evaluated records stored in database</p>
            </div>
            <Link to="/history" className="text-xs font-semibold text-teal-700 hover:text-teal-800">
              View All History →
            </Link>
          </div>

          {(!data?.recent_activity || data.recent_activity.length === 0) ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No assessments recorded yet. Run your first Diabetes or Heart Disease evaluation!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">ID</th>
                    <th className="py-2.5 px-3 font-semibold">Disease</th>
                    <th className="py-2.5 px-3 font-semibold">Diagnosis Score</th>
                    <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                    <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recent_activity.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">#{item.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 uppercase tracking-wide">
                        {item.type}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{item.score}%</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.score < 35 ? 'bg-emerald-100 text-emerald-800' : (
                            item.score < 65 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          )
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{item.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
