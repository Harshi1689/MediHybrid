import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '';
const cleanBaseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

const api = axios.create({
  baseURL: cleanBaseURL,
  timeout: 30000,
});

export const healthCheck = () => api.get('/api/health');

// Predictions
export const predictDiabetes = (data) => api.post('/api/predict/diabetes', data);
export const predictHeart = (data) => api.post('/api/predict/heart', data);
export const simulateCounterfactual = (data) => api.post('/api/predict/simulate', data);

// Retinopathy
export const analyzeRetinaImage = (formData) => api.post('/api/retina/predict', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getRetinaMetrics = () => api.get('/api/retina/metrics');

// Fuzzy System
export const evalFuzzyDiabetes = (data) => api.post('/api/fuzzy/diabetes', data);
export const evalFuzzyHeart = (data) => api.post('/api/fuzzy/heart', data);

// Reports & OCR
export const extractMedicalReport = (formData) => api.post('/api/reports/extract', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Chatbot
export const sendChatMessage = (message, session_id = 'default', context_data = null) =>
  api.post('/api/chat', { message, session_id, context_data });
export const getChatHistory = (session_id) => api.get(`/api/chat/history/${session_id}`);

// Dashboard & History
export const getDashboardData = () => api.get('/api/dashboard');
export const getAssessmentHistory = () => api.get('/api/history');
export const getAssessmentDetail = (id) => api.get(`/api/history/${id}`);
export const deleteAssessment = (id) => api.delete(`/api/history/${id}`);

// Algorithm Laboratory
export const getGALabData = () => api.get('/api/algorithms/ga');
export const getANNLabData = () => api.get('/api/algorithms/ann');
export const getFuzzyLabData = () => api.get('/api/algorithms/fuzzy');
export const getCNNLabData = () => api.get('/api/algorithms/cnn');
export const getAllMetrics = () => api.get('/api/models/metrics');

export default api;
