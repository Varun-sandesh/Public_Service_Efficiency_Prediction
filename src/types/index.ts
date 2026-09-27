export type ServiceSector =
  | 'Healthcare'
  | 'Education'
  | 'Transportation'
  | 'Government Administration';

export type EfficiencyLevel = 'Excellent' | 'High' | 'Moderate' | 'Low';

export interface PredictionInput {
  serviceSector: ServiceSector;
  serviceName: string;
  citizenSatisfaction: number;
  averageResponseTime: number;
  resourceUtilization: number;
  budgetUtilization: number;
  staffAvailability: number;
  serviceAccessibility: number;
  numberOfComplaints: number;
  digitalServiceAvailability: number;
  serviceCoverageArea?: string;
  populationServed?: number;
}

export interface FactorDetail {
  label: string;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface PredictionResult {
  id: string;
  efficiencyScore: number;
  efficiencyLevel: EfficiencyLevel;
  confidence: number;
  inputMetrics: { label: string; value: number; normalized: number }[];
  positiveFactors: FactorDetail[];
  improvementAreas: FactorDetail[];
  featureImportance: { feature: string; importance: number }[];
  recommendations: Recommendation[];
  createdAt: string;
  input: PredictionInput;
}

export interface SavedPrediction extends PredictionResult {
  savedAt: string;
}

export interface SectorData {
  sector: ServiceSector;
  efficiencyScore: number;
  trend: number;
  satisfaction: number;
  responseTime: number;
  resourceUtilization: number;
  budgetUtilization: number;
  staffAvailability: number;
  accessibility: number;
  complaints: number;
  digitalAvailability: number;
  challenges: string[];
  improvements: string[];
  metrics: { label: string; value: string; sub: string }[];
}

export interface MonthlyTrend {
  month: string;
  Healthcare: number;
  Education: number;
  Transportation: number;
  Administration: number;
  Overall: number;
}

export interface ModelMetric {
  model: string;
  mae: number;
  rmse: number;
  r2: number;
  accuracy: number;
}

// ============================================================
// DATASET UPLOAD & ANALYSIS TYPES
// ============================================================

export type PredictionMethod = 'manual' | 'upload';

export type FileType = 'csv' | 'xlsx' | 'xls' | 'pdf';

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedAt: string;
}

export interface DatasetColumn {
  name: string;
  dataType: 'numeric' | 'categorical' | 'datetime' | 'unknown';
  missingValues: number;
  uniqueValues: number;
  sampleValues: string[];
}

export interface DatasetMetadata {
  fileName: string;
  fileType: FileType;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  columns: DatasetColumn[];
  hasDateColumn: boolean;
  dateColumnName?: string;
}

export type MLFeatureKey =
  | 'citizenSatisfaction'
  | 'averageResponseTime'
  | 'resourceUtilization'
  | 'budgetUtilization'
  | 'staffAvailability'
  | 'serviceAccessibility'
  | 'numberOfComplaints'
  | 'digitalServiceAvailability'
  | 'serviceSector'
  | 'serviceName'
  | 'efficiencyScore';

export interface ColumnMapping {
  [key: string]: string | null;
}

export type DataQualityLevel = 'Excellent' | 'Good' | 'Needs Cleaning';

export interface DataQualitySummary {
  totalRecords: number;
  totalFeatures: number;
  missingValues: number;
  duplicateRecords: number;
  numericColumns: number;
  categoricalColumns: number;
  qualityLevel: DataQualityLevel;
  columnSummaries: {
    column: string;
    dataType: string;
    missingValues: number;
    status: 'Complete' | 'Partial' | 'Incomplete';
  }[];
}

export interface DatasetAnalysis {
  metadata: DatasetMetadata;
  quality: DataQualitySummary;
  previewRows: Record<string, string | number>[];
  sectorComparison: { sector: string; efficiency: number; count: number }[];
  efficiencyDistribution: { name: string; value: number; color: string }[];
  performanceTrend: { period: string; efficiency: number }[];
  factorRadar: { factor: string; value: number }[];
  responseTimeScatter: { responseTime: number; efficiency: number; sector: string }[];
  complaintsScatter: { complaints: number; efficiency: number; sector: string }[];
  numericFeatures: { name: string; data: { bin: string; count: number }[] }[];
  insights: { title: string; description: string; type: 'positive' | 'warning' | 'info' }[];
}

export interface DatasetPredictionResult {
  id: string;
  efficiencyScore: number;
  efficiencyLevel: EfficiencyLevel;
  confidence: number;
  recordsAnalyzed: number;
  averageEfficiency: number;
  bestSector: { sector: string; score: number };
  lowestSector: { sector: string; score: number };
  featureImportance: { feature: string; importance: number }[];
  strengths: string[];
  improvementAreas: string[];
  recommendations: Recommendation[];
  createdAt: string;
  fileName: string;
}

export interface SavedDatasetAnalysis {
  id: string;
  fileName: string;
  fileType: FileType;
  uploadDate: string;
  records: number;
  status: 'Completed' | 'Analyzed' | 'Pending';
}
