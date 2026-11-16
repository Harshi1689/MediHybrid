import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Trash2,
  Filter,
  Activity,
  Heart,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { getAssessmentHistory, deleteAssessment } from '../services/api';

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    getAssessmentHistory()
      .then((res) => setRecords(res.data || []))
      .catch((err) => console.error("Error loading history:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete assessment record #${id}?`)) return;
    try {
      await deleteAssessment(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const filteredRecords = records.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'diabetes') return r.type === 'diabetes';
    if (filter === 'heart') return r.type === 'heart';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Diagnosis Assessment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and review past patient diagnoses recorded by the system.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setFilter('diabetes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'diabetes' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diabetes
          </button>
          <button
            onClick={() => setFilter('heart')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'heart' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Heart Disease
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500">Loading historical assessment records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No Assessment Records Found</h3>
          <p className="text-xs text-slate-500">
            Run an assessment in the Diabetes or Heart Disease section to record your first diagnostic evaluation.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Diagnosis Type</th>
                  <th className="py-3 px-4 font-semibold">Diagnosis Score</th>
                  <th className="py-3 px-4 font-semibold">Risk Category</th>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">#{item.id}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 font-bold uppercase text-[11px] ${
                        item.type === 'diabetes' ? 'text-teal-700' : 'text-rose-700'
                      }`}>
                        {item.type === 'diabetes' ? <Activity className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.hybrid_score}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.hybrid_score < 35 ? 'bg-emerald-100 text-emerald-800' : (
                          item.hybrid_score < 65 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        )
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete assessment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
