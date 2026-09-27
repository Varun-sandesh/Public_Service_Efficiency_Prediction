/**
 * API Request/Response Types
 * ------------------------------------------------------------------
 * These interfaces define the contract between the frontend and
 * your Python FastAPI backend. When you build your backend, ensure
 * your API endpoints return JSON matching these shapes.
 *
 * The frontend services already return the app-level types from
 * src/types/index.ts. These API types represent the raw HTTP
 * response shapes — services handle the mapping.
 */

import type {
  PredictionInput,
  PredictionResult,
  ColumnMapping,
  DatasetAnalysis,
  DatasetPredictionResult,
  ModelMetric,
} from '@/types';

// POST /api/predict
export interface PredictRequest {
  input: PredictionInput;
}

export interface PredictResponse extends PredictionResult {}

// POST /api/upload
export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

// POST /api/analyze-file
export interface AnalyzeFileRequest {
  fileId: string;
  mapping: ColumnMapping;
}

export interface AnalyzeFileResponse extends DatasetAnalysis {}

// POST /api/predict (dataset variant)
export interface DatasetPredictRequest {
  fileId: string;
  mapping: ColumnMapping;
  analysis: DatasetAnalysis;
}

export interface DatasetPredictResponse extends DatasetPredictionResult {}

// GET /api/dataset/{id}
export interface DatasetResponse {
  analysis: DatasetAnalysis;
  prediction: DatasetPredictionResult | null;
}

// GET /api/model/metrics
export interface ModelMetricsResponse {
  metrics: ModelMetric[];
}

// GET /api/model/info
export interface ModelInfoResponse {
  name: string;
  version: string;
  description: string;
  features: string[];
  trainingDataSize: number;
  lastTrainedAt: string;
}
