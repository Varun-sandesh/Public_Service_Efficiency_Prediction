import type {
  EfficiencyLevel,
  FactorDetail,
  PredictionInput,
  PredictionResult,
  Recommendation,
} from '@/types';
import { apiClient, API_ENDPOINTS, API_CONFIG } from '@/lib/api';
import type { PredictResponse } from '@/lib/api';

// ============================================================
// PREDICTION SERVICE
// ------------------------------------------------------------
// This service works in two modes:
//
// 1. MOCK MODE (default): Generates predictions using built-in
//    logic. No backend required. Perfect for frontend development.
//
// 2. API MODE: When VITE_USE_MOCK_API=false is set in .env, this
//    service calls your Python FastAPI backend at POST /api/predict.
//    Your backend should return JSON matching the PredictResponse
//    type (see src/lib/api/types.ts).
//
// To switch modes, set VITE_USE_MOCK_API=false in your .env file
// and configure VITE_API_BASE_URL to point to your FastAPI server.
// ============================================================

const FEATURE_WEIGHTS = {
  citizenSatisfaction: 0.24,
  resourceUtilization: 0.18,
  staffAvailability: 0.15,
  responseTime: 0.13,
  budgetUtilization: 0.11,
  digitalAvailability: 0.09,
  serviceAccessibility: 0.07,
  complaints: 0.03,
};

const SECTOR_ADJUSTMENTS: Record<string, number> = {
  Healthcare: 2,
  Education: 4,
  Transportation: -3,
  'Government Administration': 0,
};

function classifyLevel(score: number): EfficiencyLevel {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Moderate';
  return 'Low';
}

function normalizeResponseTime(hours: number): number {
  // 0 hours = 100, 10+ hours = 0
  return Math.max(0, Math.min(100, 100 - hours * 10));
}

function normalizeComplaints(complaints: number): number {
  // 0 complaints = 100, 500+ = 0
  return Math.max(0, Math.min(100, 100 - complaints / 5));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function predictEfficiency(
  input: PredictionInput
): Promise<PredictionResult> {
  // If backend is configured, call the real API
  if (!API_CONFIG.useMock) {
    return apiClient.post<PredictResponse>(API_ENDPOINTS.predict, { input });
  }

  // --- Mock implementation (used when VITE_USE_MOCK_API is true) ---
  // Simulate ML inference latency
  await delay(1500);

  const normResponseTime = normalizeResponseTime(input.averageResponseTime);
  const normComplaints = normalizeComplaints(input.numberOfComplaints);

  const metrics = {
    citizenSatisfaction: input.citizenSatisfaction,
    resourceUtilization: input.resourceUtilization,
    staffAvailability: input.staffAvailability,
    responseTime: normResponseTime,
    budgetUtilization: input.budgetUtilization,
    digitalAvailability: input.digitalServiceAvailability,
    serviceAccessibility: input.serviceAccessibility,
    complaints: normComplaints,
  };

  let score =
    metrics.citizenSatisfaction * FEATURE_WEIGHTS.citizenSatisfaction +
    metrics.resourceUtilization * FEATURE_WEIGHTS.resourceUtilization +
    metrics.staffAvailability * FEATURE_WEIGHTS.staffAvailability +
    metrics.responseTime * FEATURE_WEIGHTS.responseTime +
    metrics.budgetUtilization * FEATURE_WEIGHTS.budgetUtilization +
    metrics.digitalAvailability * FEATURE_WEIGHTS.digitalAvailability +
    metrics.serviceAccessibility * FEATURE_WEIGHTS.serviceAccessibility +
    metrics.complaints * FEATURE_WEIGHTS.complaints;

  score += SECTOR_ADJUSTMENTS[input.serviceSector] ?? 0;
  score = Math.max(0, Math.min(100, score));

  // Confidence: higher when metrics are balanced
  const values = Object.values(metrics);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  const confidence = Math.max(70, Math.min(98, 98 - variance / 12));

  const inputMetrics = [
    { label: 'Citizen Satisfaction', value: input.citizenSatisfaction, normalized: input.citizenSatisfaction },
    { label: 'Resource Utilization', value: input.resourceUtilization, normalized: input.resourceUtilization },
    { label: 'Staff Availability', value: input.staffAvailability, normalized: input.staffAvailability },
    { label: 'Response Time (norm)', value: input.averageResponseTime, normalized: normResponseTime },
    { label: 'Budget Utilization', value: input.budgetUtilization, normalized: input.budgetUtilization },
    { label: 'Digital Availability', value: input.digitalServiceAvailability, normalized: input.digitalServiceAvailability },
    { label: 'Accessibility', value: input.serviceAccessibility, normalized: input.serviceAccessibility },
    { label: 'Complaints (norm)', value: input.numberOfComplaints, normalized: normComplaints },
  ];

  const allFactors: FactorDetail[] = [
    { label: 'Citizen Satisfaction', value: input.citizenSatisfaction, impact: input.citizenSatisfaction >= 75 ? 'positive' : input.citizenSatisfaction < 50 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.citizenSatisfaction },
    { label: 'Resource Utilization', value: input.resourceUtilization, impact: input.resourceUtilization >= 75 ? 'positive' : input.resourceUtilization < 50 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.resourceUtilization },
    { label: 'Staff Availability', value: input.staffAvailability, impact: input.staffAvailability >= 75 ? 'positive' : input.staffAvailability < 50 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.staffAvailability },
    { label: 'Response Time', value: input.averageResponseTime, impact: input.averageResponseTime <= 3 ? 'positive' : input.averageResponseTime > 6 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.responseTime },
    { label: 'Budget Utilization', value: input.budgetUtilization, impact: input.budgetUtilization >= 75 ? 'positive' : input.budgetUtilization < 50 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.budgetUtilization },
    { label: 'Digital Availability', value: input.digitalServiceAvailability, impact: input.digitalServiceAvailability >= 75 ? 'positive' : input.digitalServiceAvailability < 50 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.digitalAvailability },
    { label: 'Accessibility', value: input.serviceAccessibility, impact: input.serviceAccessibility >= 75 ? 'positive' : input.serviceAccessibility < 50 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.serviceAccessibility },
    { label: 'Complaints', value: input.numberOfComplaints, impact: input.numberOfComplaints <= 100 ? 'positive' : input.numberOfComplaints > 250 ? 'negative' : 'neutral', weight: FEATURE_WEIGHTS.complaints },
  ];

  const positiveFactors = allFactors.filter((f) => f.impact === 'positive');
  const improvementAreas = allFactors.filter((f) => f.impact === 'negative');

  const recommendations = generateRecommendations(input, improvementAreas);

  const featureImportance = Object.entries(FEATURE_WEIGHTS)
    .map(([feature, importance]) => ({ feature: formatFeatureName(feature), importance }))
    .sort((a, b) => b.importance - a.importance);

  return {
    id: `PRD-${Date.now()}`,
    efficiencyScore: Math.round(score * 10) / 10,
    efficiencyLevel: classifyLevel(score),
    confidence: Math.round(confidence),
    inputMetrics,
    positiveFactors,
    improvementAreas,
    featureImportance,
    recommendations,
    createdAt: new Date().toISOString(),
    input,
  };
}

function formatFeatureName(key: string): string {
  const map: Record<string, string> = {
    citizenSatisfaction: 'Citizen Satisfaction',
    resourceUtilization: 'Resource Utilization',
    staffAvailability: 'Staff Availability',
    responseTime: 'Response Time',
    budgetUtilization: 'Budget Utilization',
    digitalAvailability: 'Digital Availability',
    serviceAccessibility: 'Accessibility',
    complaints: 'Complaints',
  };
  return map[key] ?? key;
}

function generateRecommendations(
  input: PredictionInput,
  weakAreas: FactorDetail[]
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (input.averageResponseTime > 4) {
    recs.push({
      title: 'Reduce average response time',
      description: 'Improve workflow automation and streamline service request processing to cut response time.',
      priority: 'High',
    });
  }
  if (input.numberOfComplaints > 150) {
    recs.push({
      title: 'Investigate complaint causes',
      description: 'Analyze complaint patterns to identify root causes and implement targeted corrective measures.',
      priority: 'High',
    });
  }
  if (input.digitalServiceAvailability < 70) {
    recs.push({
      title: 'Expand digital service availability',
      description: 'Increase digital accessibility for citizens by deploying online service portals and mobile apps.',
      priority: 'Medium',
    });
  }
  if (input.staffAvailability < 70) {
    recs.push({
      title: 'Improve staff availability',
      description: 'Optimize staffing schedules during high-demand periods and consider cross-training programs.',
      priority: 'Medium',
    });
  }
  if (input.resourceUtilization < 70) {
    recs.push({
      title: 'Optimize resource utilization',
      description: 'Use predictive analytics to allocate resources more efficiently across service points.',
      priority: 'Medium',
    });
  }
  if (input.budgetUtilization < 70) {
    recs.push({
      title: 'Improve budget utilization',
      description: 'Review budget allocation strategies and redirect funds to high-impact service areas.',
      priority: 'Low',
    });
  }
  if (input.serviceAccessibility < 70) {
    recs.push({
      title: 'Enhance service accessibility',
      description: 'Expand service coverage to underserved areas and improve physical/digital access points.',
      priority: 'Medium',
    });
  }

  // Fallback if all metrics are good
  if (recs.length === 0) {
    recs.push({
      title: 'Maintain current performance',
      description: 'All metrics are performing well. Continue monitoring and focus on continuous improvement.',
      priority: 'Low',
    });
  }

  // Ensure at least 3 recommendations
  if (recs.length < 3) {
    recs.push({
      title: 'Monitor performance trends',
      description: 'Set up automated monitoring dashboards to track efficiency trends over time and catch declines early.',
      priority: 'Low',
    });
  }

  return recs.slice(0, 5);
}

// ============================================================
// LOCAL STORAGE PERSISTENCE
// ============================================================

const STORAGE_KEY = 'psai_predictions';

export function savePrediction(prediction: PredictionResult): void {
  const saved = getSavedPredictions();
  const entry = { ...prediction, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...saved]));
}

export function getSavedPredictions(): PredictionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PredictionResult[];
  } catch {
    return [];
  }
}

export function deletePrediction(id: string): void {
  const saved = getSavedPredictions().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

export function clearAllPredictions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
