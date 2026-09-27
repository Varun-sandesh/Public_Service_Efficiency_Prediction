/**
 * API Layer — Single import point for backend integration.
 * ------------------------------------------------------------------
 * Import from this file in your services:
 *   import { apiClient, API_ENDPOINTS, API_CONFIG } from '@/lib/api';
 *
 * When the backend is ready, set in .env:
 *   VITE_API_BASE_URL=http://localhost:8000
 *   VITE_USE_MOCK_API=false
 */

export { apiClient, ApiError } from './client';
export { API_CONFIG, API_ENDPOINTS, apiUrl } from './config';
export type {
  PredictRequest,
  PredictResponse,
  UploadResponse,
  AnalyzeFileRequest,
  AnalyzeFileResponse,
  DatasetPredictRequest,
  DatasetPredictResponse,
  DatasetResponse,
  ModelMetricsResponse,
  ModelInfoResponse,
} from './types';
