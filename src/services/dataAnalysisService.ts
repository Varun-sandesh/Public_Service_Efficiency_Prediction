import type {
  ColumnMapping,
  DatasetAnalysis,
  DatasetPredictionResult,
  DataQualitySummary,
  DataQualityLevel,
  EfficiencyLevel,
  FileType,
  UploadedFile,
  SavedDatasetAnalysis,
} from '@/types';
import { apiClient, API_ENDPOINTS, API_CONFIG } from '@/lib/api';
import type {
  AnalyzeFileResponse,
  DatasetPredictResponse,
  UploadResponse,
} from '@/lib/api';

// ============================================================
// DATA ANALYSIS SERVICE
// ------------------------------------------------------------
// This service works in two modes:
//
// 1. MOCK MODE (default): Simulates file processing and ML analysis
//    using built-in demo data. No backend required.
//
// 2. API MODE: When VITE_USE_MOCK_API=false is set in .env, this
//    service calls your Python FastAPI backend:
//      POST /api/upload         → upload file
//      POST /api/analyze-file   → analyze dataset + column mapping
//      POST /api/predict        → run ML prediction on dataset
//      GET  /api/dataset/{id}   → retrieve dataset results
//
// Your backend should return JSON matching the types in
// src/lib/api/types.ts (AnalyzeFileResponse, DatasetPredictResponse).
//
// To switch modes, set VITE_USE_MOCK_API=false in .env and
// configure VITE_API_BASE_URL to your FastAPI server.
// ============================================================

const STORAGE_KEY = 'psai_dataset_history';

const MOCK_COLUMNS = [
  { name: 'service_sector', dataType: 'categorical' as const, missingValues: 0, uniqueValues: 4, sampleValues: ['Healthcare', 'Education', 'Transportation', 'Government Administration'] },
  { name: 'service_name', dataType: 'categorical' as const, missingValues: 2, uniqueValues: 45, sampleValues: ['City Hospital', 'Central School', 'Bus Route 12', 'Tax Office'] },
  { name: 'citizen_satisfaction', dataType: 'numeric' as const, missingValues: 0, uniqueValues: 78, sampleValues: ['84', '76', '91', '68'] },
  { name: 'average_response_time', dataType: 'numeric' as const, missingValues: 3, uniqueValues: 52, sampleValues: ['3.2', '1.8', '5.6', '4.1'] },
  { name: 'resource_utilization', dataType: 'numeric' as const, missingValues: 1, uniqueValues: 89, sampleValues: ['79', '85', '68', '82'] },
  { name: 'budget_utilization', dataType: 'numeric' as const, missingValues: 0, uniqueValues: 92, sampleValues: ['88', '91', '73', '86'] },
  { name: 'staff_availability', dataType: 'numeric' as const, missingValues: 5, uniqueValues: 71, sampleValues: ['76', '82', '74', '78'] },
  { name: 'service_accessibility', dataType: 'numeric' as const, missingValues: 2, uniqueValues: 65, sampleValues: ['81', '86', '69', '75'] },
  { name: 'number_of_complaints', dataType: 'numeric' as const, missingValues: 0, uniqueValues: 210, sampleValues: ['142', '78', '256', '198'] },
  { name: 'digital_service_availability', dataType: 'numeric' as const, missingValues: 4, uniqueValues: 58, sampleValues: ['72', '80', '64', '85'] },
  { name: 'efficiency_score', dataType: 'numeric' as const, missingValues: 0, uniqueValues: 95, sampleValues: ['82', '87', '74', '79'] },
  { name: 'date_recorded', dataType: 'datetime' as const, missingValues: 0, uniqueValues: 12, sampleValues: ['2026-01-15', '2026-02-20', '2026-03-10', '2026-04-05'] },
];

const SECTORS = ['Healthcare', 'Education', 'Transportation', 'Government Administration'];

const SECTOR_COLORS: Record<string, string> = {
  Healthcare: 'hsl(142 71% 45%)',
  Education: 'hsl(217 91% 60%)',
  Transportation: 'hsl(38 92% 50%)',
  'Government Administration': 'hsl(280 65% 60%)',
};

const LEVEL_COLORS = {
  Excellent: 'hsl(142 71% 45%)',
  High: 'hsl(217 91% 60%)',
  Moderate: 'hsl(38 92% 50%)',
  Low: 'hsl(0 84% 60%)',
};

// Column name matching patterns for auto-detection
const COLUMN_PATTERNS: { mlKey: string; patterns: RegExp[] }[] = [
  { mlKey: 'citizenSatisfaction', patterns: [/satisfaction/i, /citizen.*satisf/i, /satisf.*score/i] },
  { mlKey: 'averageResponseTime', patterns: [/response.*time/i, /avg.*response/i, /response_time/i] },
  { mlKey: 'resourceUtilization', patterns: [/resource.*util/i, /resource.*usage/i] },
  { mlKey: 'budgetUtilization', patterns: [/budget.*util/i, /budget/i] },
  { mlKey: 'staffAvailability', patterns: [/staff.*avail/i, /staff.*percentage/i, /teacher.*avail/i] },
  { mlKey: 'serviceAccessibility', patterns: [/accessibility/i, /access/i] },
  { mlKey: 'numberOfComplaints', patterns: [/complaint/i, /complaint.*count/i] },
  { mlKey: 'digitalServiceAvailability', patterns: [/digital.*avail/i, /digital.*service/i] },
  { mlKey: 'serviceSector', patterns: [/sector/i, /service.*type/i, /department/i] },
  { mlKey: 'serviceName', patterns: [/service.*name/i, /name/i] },
  { mlKey: 'efficiencyScore', patterns: [/efficiency/i, /target/i, /score/i] },
];

export function detectFileType(fileName: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'csv') return 'csv';
  if (ext === 'xlsx') return 'xlsx';
  if (ext === 'xls') return 'xls';
  if (ext === 'pdf') return 'pdf';
  return 'csv';
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const type = detectFileType(file.name);
  const validTypes: FileType[] = ['csv', 'xlsx', 'xls', 'pdf'];
  if (!validTypes.includes(type)) {
    return { valid: false, error: 'Unsupported file type. Please upload CSV, XLSX, XLS, or PDF files.' };
  }
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10 MB limit.' };
  }
  return { valid: true };
}

export function createUploadedFile(file: File): UploadedFile {
  return {
    id: `FILE-${Date.now()}`,
    name: file.name,
    type: detectFileType(file.name),
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Upload a file to the backend when API mode is active.
 * In mock mode, this is a no-op — the file is handled locally.
 */
export async function uploadFileToBackend(file: File): Promise<string | null> {
  if (API_CONFIG.useMock) return null;
  const response = await apiClient.upload<UploadResponse>(
    API_ENDPOINTS.upload,
    file
  );
  return response.fileId;
}

export function autoDetectColumns(columnNames: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const mlKeys = COLUMN_PATTERNS.map((p) => p.mlKey);

  mlKeys.forEach((key) => {
    const patterns = COLUMN_PATTERNS.find((p) => p.mlKey === key)!.patterns;
    const match = columnNames.find((col) => patterns.some((p) => p.test(col)));
    mapping[key] = match ?? null;
  });

  return mapping;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO: Replace mock analysis with FastAPI API call
// POST /api/analyze-file with file + column mappings
export async function analyzeDataset(
  uploadedFile: UploadedFile,
  _mapping: ColumnMapping
): Promise<DatasetAnalysis> {
  // If backend is configured, call the real API
  if (!API_CONFIG.useMock) {
    return apiClient.post<AnalyzeFileResponse>(API_ENDPOINTS.analyzeFile, {
      fileId: uploadedFile.id,
      mapping: _mapping,
    });
  }

  // --- Mock implementation ---
  await delay(2500);

  const rowCount = 1247;
  const columns = MOCK_COLUMNS;
  const hasDateColumn = columns.some((c) => c.dataType === 'datetime');
  const dateColumnName = columns.find((c) => c.dataType === 'datetime')?.name;

  const totalMissing = columns.reduce((sum, c) => sum + c.missingValues, 0);
  const numericCount = columns.filter((c) => c.dataType === 'numeric').length;
  const categoricalCount = columns.filter((c) => c.dataType === 'categorical').length;

  let qualityLevel: DataQualityLevel = 'Excellent';
  if (totalMissing > 20) qualityLevel = 'Needs Cleaning';
  else if (totalMissing > 5) qualityLevel = 'Good';

  const quality: DataQualitySummary = {
    totalRecords: rowCount,
    totalFeatures: columns.length,
    missingValues: totalMissing,
    duplicateRecords: 3,
    numericColumns: numericCount,
    categoricalColumns: categoricalCount,
    qualityLevel,
    columnSummaries: columns.map((c) => ({
      column: c.name,
      dataType: c.dataType,
      missingValues: c.missingValues,
      status: c.missingValues === 0 ? 'Complete' as const : c.missingValues < 4 ? 'Partial' as const : 'Incomplete' as const,
    })),
  };

  // Generate preview rows
  const previewRows: Record<string, string | number>[] = [];
  for (let i = 0; i < 15; i++) {
    const row: Record<string, string | number> = {};
    columns.forEach((col) => {
      if (col.dataType === 'numeric') {
        row[col.name] = Math.round((Math.random() * 100 + 20) * 10) / 10;
      } else if (col.dataType === 'datetime') {
        const month = String((i % 12) + 1).padStart(2, '0');
        row[col.name] = `2026-${month}-${String((i % 28) + 1).padStart(2, '0')}`;
      } else if (col.name === 'service_sector') {
        row[col.name] = SECTORS[i % 4];
      } else {
        row[col.name] = col.sampleValues[i % col.sampleValues.length];
      }
    });
    previewRows.push(row);
  }

  // Sector comparison
  const sectorComparison = SECTORS.map((sector, i) => ({
    sector,
    efficiency: [82, 87, 74, 79][i] + Math.round((Math.random() - 0.5) * 4),
    count: Math.floor(rowCount / 4) + Math.round((Math.random() - 0.5) * 20),
  }));

  // Efficiency distribution
  const efficiencyDistribution = [
    { name: 'Excellent', value: 22, color: LEVEL_COLORS.Excellent },
    { name: 'High', value: 38, color: LEVEL_COLORS.High },
    { name: 'Moderate', value: 28, color: LEVEL_COLORS.Moderate },
    { name: 'Low', value: 12, color: LEVEL_COLORS.Low },
  ];

  // Performance trend
  const performanceTrend = [
    { period: 'Jan', efficiency: 71 },
    { period: 'Feb', efficiency: 73 },
    { period: 'Mar', efficiency: 73 },
    { period: 'Apr', efficiency: 75 },
    { period: 'May', efficiency: 76 },
    { period: 'Jun', efficiency: 77 },
    { period: 'Jul', efficiency: 78 },
    { period: 'Aug', efficiency: 79 },
    { period: 'Sep', efficiency: 80 },
    { period: 'Oct', efficiency: 81 },
    { period: 'Nov', efficiency: 82 },
    { period: 'Dec', efficiency: 83 },
  ];

  // Factor radar
  const factorRadar = [
    { factor: 'Satisfaction', value: 80 },
    { factor: 'Resources', value: 78 },
    { factor: 'Budget', value: 84 },
    { factor: 'Staff', value: 77 },
    { factor: 'Accessibility', value: 78 },
    { factor: 'Digital', value: 75 },
  ];

  // Scatter data
  const responseTimeScatter = SECTORS.flatMap((sector, si) =>
    Array.from({ length: 8 }, (_, i) => ({
      responseTime: [3.2, 1.8, 5.6, 4.1][si] + (Math.sin(i * 1.3) * 1.5),
      efficiency: [82, 87, 74, 79][si] + (Math.cos(i * 1.7) * 7),
      sector,
    }))
  );

  const complaintsScatter = SECTORS.flatMap((sector, si) =>
    Array.from({ length: 8 }, (_, i) => ({
      complaints: [142, 78, 256, 198][si] + Math.round(Math.sin(i * 1.3) * 30),
      efficiency: [82, 87, 74, 79][si] + (Math.cos(i * 1.7) * 7),
      sector,
    }))
  );

  // Numeric feature distributions
  const numericFeatures = columns
    .filter((c) => c.dataType === 'numeric')
    .slice(0, 6)
    .map((col) => ({
      name: col.name,
      data: Array.from({ length: 10 }, (_, i) => ({
        bin: `${i * 10}-${(i + 1) * 10}`,
        count: Math.floor(Math.random() * 150) + 20,
      })),
    }));

  // AI insights
  const insights = [
    { title: 'Education leads in efficiency', description: 'Education shows the highest average efficiency score of 87%, outperforming all other sectors.', type: 'positive' as const },
    { title: 'Response time negatively impacts efficiency', description: 'High response times appear to negatively affect overall service efficiency, especially in Transportation.', type: 'warning' as const },
    { title: 'Digital availability improves accessibility', description: 'Services with higher digital availability generally show better accessibility scores (r = 0.82).', type: 'info' as const },
    { title: 'Healthcare shows steady improvement', description: 'Healthcare efficiency has increased by 5.2% compared to the previous quarter.', type: 'positive' as const },
    { title: 'Transportation needs attention', description: 'Transportation has the lowest efficiency at 74% with increasing complaint volumes.', type: 'warning' as const },
  ];

  return {
    metadata: {
      fileName: uploadedFile.name,
      fileType: uploadedFile.type,
      fileSize: uploadedFile.size,
      rowCount,
      columnCount: columns.length,
      columns,
      hasDateColumn,
      dateColumnName,
    },
    quality,
    previewRows,
    sectorComparison,
    efficiencyDistribution,
    performanceTrend,
    factorRadar,
    responseTimeScatter,
    complaintsScatter,
    numericFeatures,
    insights,
  };
}

function classifyLevel(score: number): EfficiencyLevel {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Moderate';
  return 'Low';
}

// TODO: Replace mock prediction with FastAPI API call
// POST /api/predict with dataset + mappings
export async function runDatasetPrediction(
  analysis: DatasetAnalysis,
  _mapping: ColumnMapping
): Promise<DatasetPredictionResult> {
  // If backend is configured, call the real API
  if (!API_CONFIG.useMock) {
    return apiClient.post<DatasetPredictResponse>(API_ENDPOINTS.predict, {
      fileId: analysis.metadata.fileName,
      mapping: _mapping,
      analysis,
    });
  }

  // --- Mock implementation ---
  await delay(2000);

  const avgEfficiency =
    analysis.sectorComparison.reduce((sum, s) => sum + s.efficiency, 0) /
    analysis.sectorComparison.length;
  const bestSector = [...analysis.sectorComparison].sort((a, b) => b.efficiency - a.efficiency)[0];
  const lowestSector = [...analysis.sectorComparison].sort((a, b) => a.efficiency - b.efficiency)[0];

  const featureImportance = [
    { feature: 'Citizen Satisfaction', importance: 0.24 },
    { feature: 'Resource Utilization', importance: 0.18 },
    { feature: 'Staff Availability', importance: 0.15 },
    { feature: 'Response Time', importance: 0.13 },
    { feature: 'Budget Utilization', importance: 0.11 },
    { feature: 'Digital Availability', importance: 0.09 },
    { feature: 'Accessibility', importance: 0.07 },
    { feature: 'Complaints', importance: 0.03 },
  ];

  const strengths = [
    `${bestSector.sector} shows strong performance with ${bestSector.efficiency}% efficiency`,
    'Budget utilization is healthy across most sectors',
    'Citizen satisfaction scores are above 70% for 3 out of 4 sectors',
  ];

  const improvementAreas = [
    `${lowestSector.sector} has the lowest efficiency at ${lowestSector.efficiency}%`,
    'Response times in Transportation are significantly higher than other sectors',
    `${analysis.quality.missingValues} missing values detected across the dataset`,
  ];

  const recommendations = [
    { title: 'Prioritize Transportation improvements', description: 'Focus on reducing response times and modernizing fleet infrastructure in the Transportation sector.', priority: 'High' as const },
    { title: 'Address missing data', description: `${analysis.quality.missingValues} missing values were found. Implement data collection protocols to reduce gaps.`, priority: 'Medium' as const },
    { title: 'Expand digital services', description: 'Sectors with lower digital availability show weaker accessibility. Invest in digital service platforms.', priority: 'Medium' as const },
    { title: 'Monitor complaint trends', description: 'Transportation has the highest complaint volume. Establish a complaint tracking and resolution system.', priority: 'Medium' as const },
    { title: 'Replicate Education best practices', description: 'Education leads in efficiency. Document and share their resource allocation strategies with other sectors.', priority: 'Low' as const },
  ];

  return {
    id: `DSR-${Date.now()}`,
    efficiencyScore: Math.round(avgEfficiency * 10) / 10,
    efficiencyLevel: classifyLevel(avgEfficiency),
    confidence: 91,
    recordsAnalyzed: analysis.metadata.rowCount,
    averageEfficiency: Math.round(avgEfficiency * 10) / 10,
    bestSector: { sector: bestSector.sector, score: bestSector.efficiency },
    lowestSector: { sector: lowestSector.sector, score: lowestSector.efficiency },
    featureImportance,
    strengths,
    improvementAreas,
    recommendations,
    createdAt: new Date().toISOString(),
    fileName: analysis.metadata.fileName,
  };
}

// ============================================================
// LOCAL STORAGE - DATASET HISTORY
// ============================================================

export function saveDatasetAnalysisSession(session: SavedDatasetAnalysis): void {
  const sessions = getDatasetHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...sessions]));
}

export function getDatasetHistory(): SavedDatasetAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedDatasetAnalysis[];
  } catch {
    return [];
  }
}

export function deleteDatasetSession(id: string): void {
  const sessions = getDatasetHistory().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function clearDatasetHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export { SECTOR_COLORS, LEVEL_COLORS };
