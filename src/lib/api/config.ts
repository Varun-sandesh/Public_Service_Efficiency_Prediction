/**
 * Backend API Configuration
 * ------------------------------------------------------------------
 * This file is the single place to configure your backend connection.
 *
 * When you are ready to connect your Python FastAPI backend:
 *   1. Set VITE_API_BASE_URL in your .env file
 *      Example: VITE_API_BASE_URL=http://localhost:8000
 *   2. Set VITE_USE_MOCK_API=false in your .env file
 *   3. Start your FastAPI server
 *
 * The frontend will automatically switch from mock data to real API calls.
 * No other code changes are needed — all services already route through
 * the API client defined in src/lib/api/client.ts.
 */

export const API_CONFIG = {
  /**
   * Base URL for the backend API.
   * Set via VITE_API_BASE_URL env var, or defaults to empty string
   * (meaning same-origin requests, useful if you proxy through Vite).
   */
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',

  /**
   * When true, the app uses built-in mock data instead of calling the backend.
   * Set VITE_USE_MOCK_API=false in .env to use real API endpoints.
   */
  useMock: (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false',

  /**
   * Default request timeout in milliseconds.
   */
  timeout: 30000,

  /**
   * API version prefix for all endpoints.
   */
  apiPrefix: '/api',
} as const;

/**
 * Backend API endpoints.
 * Update these paths to match your FastAPI route definitions.
 */
export const API_ENDPOINTS = {
  // Prediction endpoints
  predict: '/predict',
  predictBatch: '/predict/batch',

  // Dataset endpoints
  upload: '/upload',
  analyzeFile: '/analyze-file',
  datasetById: (id: string) => `/dataset/${id}`,
  datasetHistory: '/dataset/history',

  // Model endpoints
  modelInfo: '/model/info',
  modelMetrics: '/model/metrics',
  modelTrain: '/model/train',

  // Analytics endpoints
  analyticsSummary: '/analytics/summary',
  analyticsBySector: (sector: string) => `/analytics/sector/${encodeURIComponent(sector)}`,

  // Auth endpoints (if needed later)
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
} as const;

/**
 * Full URL builder for API endpoints.
 */
export function apiUrl(path: string): string {
  return `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}${path}`;
}
