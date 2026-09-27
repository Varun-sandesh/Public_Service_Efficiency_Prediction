import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Database,
  Brain,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Wand2,
  Save,
  Download,
  RotateCcw,
  History,
  Trash2,
  Eye,
  Search,
  CheckCircle,
  FileSpreadsheet,
  FileIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FeatureImportanceChart } from '@/components/charts/ChartComponents';
import {
  DatasetSectorBarChart,
  DatasetDistributionPieChart,
  DatasetTrendLineChart,
  DatasetFactorRadarChart,
  DatasetResponseTimeScatter,
  DatasetComplaintsScatter,
  FeatureDistributionChart,
} from '@/components/charts/DatasetCharts';
import {
  validateFile,
  createUploadedFile,
  autoDetectColumns,
  analyzeDataset,
  runDatasetPrediction,
  saveDatasetAnalysisSession,
  getDatasetHistory,
  deleteDatasetSession,
  clearDatasetHistory,
} from '@/services/dataAnalysisService';
import type {
  UploadedFile,
  ColumnMapping,
  DatasetAnalysis,
  DatasetPredictionResult,
  EfficiencyLevel,
  SavedDatasetAnalysis,
} from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ML_FEATURES: { key: string; label: string; required: boolean }[] = [
  { key: 'citizenSatisfaction', label: 'Citizen Satisfaction', required: true },
  { key: 'averageResponseTime', label: 'Average Response Time', required: true },
  { key: 'resourceUtilization', label: 'Resource Utilization', required: true },
  { key: 'budgetUtilization', label: 'Budget Utilization', required: true },
  { key: 'staffAvailability', label: 'Staff Availability', required: true },
  { key: 'serviceAccessibility', label: 'Service Accessibility', required: true },
  { key: 'numberOfComplaints', label: 'Number of Complaints', required: true },
  { key: 'digitalServiceAvailability', label: 'Digital Service Availability', required: true },
  { key: 'serviceSector', label: 'Service Sector', required: true },
  { key: 'serviceName', label: 'Service Name', required: false },
  { key: 'efficiencyScore', label: 'Efficiency Score / Target Column', required: true },
];

const PROCESSING_STEPS = [
  'Reading uploaded file...',
  'Detecting columns...',
  'Analyzing data structure...',
  'Checking missing values...',
  'Preparing data for AI analysis...',
];

const levelColors: Record<EfficiencyLevel, { bg: string; text: string }> = {
  Excellent: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
  High: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  Moderate: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  Low: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
};

const qualityLevelColors: Record<string, string> = {
  Excellent: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Good: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'Needs Cleaning': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const fileTypeIcons: Record<string, typeof FileText> = {
  csv: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  pdf: FileIcon,
};

function GaugeChart({ score, level }: { score: number; level: EfficiencyLevel }) {
  const colors = levelColors[level];
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" className="-rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className={colors.text + ' transition-all duration-1000 ease-out'} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-sm text-muted-foreground">out of 100</span>
        <Badge className={`mt-2 ${colors.bg} ${colors.text}`} variant="secondary">{level}</Badge>
      </div>
    </div>
  );
}

type Step = 'upload' | 'processing' | 'preview' | 'mapping' | 'analysis' | 'prediction-loading' | 'prediction-results';

export default function UploadDatasetPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [analysis, setAnalysis] = useState<DatasetAnalysis | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [previewSearch, setPreviewSearch] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<string>('');
  const [predictionResult, setPredictionResult] = useState<DatasetPredictionResult | null>(null);
  const [datasetHistory, setDatasetHistory] = useState<SavedDatasetAnalysis[]>(getDatasetHistory());
  const [showHistory, setShowHistory] = useState(false);

  const handleFile = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({ title: 'File validation error', description: validation.error, variant: 'destructive' });
      return;
    }
    const uploaded = createUploadedFile(file);
    setUploadedFile(uploaded);
    setStep('upload');
    toast({ title: 'File uploaded', description: `${file.name} is ready for analysis.` });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysis(null);
    setMapping({});
    setPredictionResult(null);
    setStep('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    setStep('processing');
    setProcessingProgress(0);
    setProcessingStepIndex(0);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProcessingProgress(((i + 1) / PROCESSING_STEPS.length) * 100);
    }

    try {
      const result = await analyzeDataset(uploadedFile, mapping);
      setAnalysis(result);
      const autoMapping = autoDetectColumns(result.metadata.columns.map((c) => c.name));
      setMapping(autoMapping);
      setStep('preview');
      toast({ title: 'Dataset analyzed', description: `${result.metadata.rowCount} records detected.` });
    } catch {
      toast({ title: 'Analysis failed', description: 'An error occurred during analysis.', variant: 'destructive' });
      setStep('upload');
    }
  };

  const handleAutoDetect = () => {
    if (!analysis) return;
    const autoMapping = autoDetectColumns(analysis.metadata.columns.map((c) => c.name));
    setMapping(autoMapping);
    toast({ title: 'Columns auto-detected', description: 'ML feature mapping has been updated based on column names.' });
  };

  const handleMappingChange = (mlKey: string, column: string) => {
    setMapping((prev) => ({ ...prev, [mlKey]: column === '__none__' ? null : column }));
  };

  const validateMapping = (): boolean => {
    const missing = ML_FEATURES.filter((f) => f.required && !mapping[f.key]);
    if (missing.length > 0) {
      toast({
        title: 'Column mapping incomplete',
        description: `Please map: ${missing.map((m) => m.label).join(', ')}`,
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleRunPrediction = async () => {
    if (!analysis || !validateMapping()) return;
    setStep('prediction-loading');
    try {
      const result = await runDatasetPrediction(analysis, mapping);
      setPredictionResult(result);
      setStep('prediction-results');
      const session: SavedDatasetAnalysis = {
        id: result.id,
        fileName: uploadedFile?.name ?? 'Unknown',
        fileType: uploadedFile?.type ?? 'csv',
        uploadDate: new Date().toISOString(),
        records: analysis.metadata.rowCount,
        status: 'Completed',
      };
      saveDatasetAnalysisSession(session);
      setDatasetHistory(getDatasetHistory());
      toast({ title: 'AI analysis complete', description: `Overall efficiency: ${result.efficiencyScore}/100 (${result.efficiencyLevel})` });
    } catch {
      toast({ title: 'Prediction failed', description: 'An error occurred during AI analysis.', variant: 'destructive' });
      setStep('analysis');
    }
  };

  const handleReset = () => {
    handleRemoveFile();
  };

  const handleDeleteSession = (id: string) => {
    deleteDatasetSession(id);
    setDatasetHistory(getDatasetHistory());
    toast({ title: 'Session deleted', description: 'Dataset analysis session removed.' });
  };

  const handleClearHistory = () => {
    clearDatasetHistory();
    setDatasetHistory([]);
    toast({ title: 'History cleared', description: 'All dataset analysis sessions removed.' });
  };

  const handleDownloadReport = () => {
    if (!predictionResult) return;
    const report = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Dataset Analysis Report - ${predictionResult.id}</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a1a}h1{color:#2563eb}.section{margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:8px}ul{padding-left:20px}li{margin:8px 0}</style>
</head><body>
<h1>Dataset Analysis Report</h1>
<p>Report ID: ${predictionResult.id}</p><p>File: ${predictionResult.fileName}</p><p>Generated: ${new Date(predictionResult.createdAt).toLocaleString()}</p>
<div class="section"><h2>Summary</h2><p>Overall Efficiency: ${predictionResult.efficiencyScore}/100 (${predictionResult.efficiencyLevel})</p><p>Confidence: ${predictionResult.confidence}%</p><p>Records Analyzed: ${predictionResult.recordsAnalyzed}</p><p>Average Efficiency: ${predictionResult.averageEfficiency}%</p><p>Best Sector: ${predictionResult.bestSector.sector} (${predictionResult.bestSector.score}%)</p><p>Lowest Sector: ${predictionResult.lowestSector.sector} (${predictionResult.lowestSector.score}%)</p></div>
<div class="section"><h2>Strengths</h2><ul>${predictionResult.strengths.map((s) => `<li>${s}</li>`).join('')}</ul></div>
<div class="section"><h2>Areas for Improvement</h2><ul>${predictionResult.improvementAreas.map((s) => `<li>${s}</li>`).join('')}</ul></div>
<div class="section"><h2>Recommendations</h2><ul>${predictionResult.recommendations.map((r) => `<li><strong>${r.title}</strong> (${r.priority}): ${r.description}</li>`).join('')}</ul></div>
<div class="section"><h2>Feature Importance</h2><ul>${predictionResult.featureImportance.map((f) => `<li>${f.feature}: ${(f.importance * 100).toFixed(1)}%</li>`).join('')}</ul></div>
<p style="color:#6b7280;font-size:12px;margin-top:40px">Generated by Public Service AI © 2026 Public Service AI. All Rights Reserved.</p>
</body></html>`;
    const blob = new Blob([report], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset-report-${predictionResult.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Report downloaded', description: 'Dataset analysis report has been downloaded.' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const FileIconComp = uploadedFile ? fileTypeIcons[uploadedFile.type] || FileText : FileText;
  const filteredPreviewRows = analysis
    ? analysis.previewRows.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(previewSearch.toLowerCase()))
      )
    : [];

  const stepNumber = { upload: 1, processing: 2, preview: 3, mapping: 4, analysis: 5, 'prediction-loading': 6, 'prediction-results': 7 };
  const currentStepNum = stepNumber[step] || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Upload and Analyze Public Service Data</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Upload your dataset to automatically analyze public service performance and generate AI-powered insights.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['Upload', 'Process', 'Preview', 'Map Columns', 'Analyze', 'AI Predict', 'Results'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                i + 1 <= currentStepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/20">{i + 1}</span>
                {label}
              </div>
              {i < 6 && <ArrowRight className="h-3 w-3 text-muted-foreground/40 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <Card>
          <CardContent className="pt-6">
            {!uploadedFile ? (
              <div
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="text-lg font-semibold">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                <Button className="mt-6" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.pdf"
                  onChange={handleFileSelect}
                />
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: CSV, XLSX, XLS, PDF • Maximum file size: 10 MB
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <FileIconComp className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFile.type.toUpperCase()} • {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                </div>

                {uploadedFile.type === 'pdf' && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">PDF file detected</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF data extraction will be handled by the backend. The system will attempt to extract tables
                        and text from the PDF and convert them into structured data. If the PDF does not contain
                        usable tabular data, an error will be shown.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleAnalyze} size="lg" className="flex-1">
                    <Brain className="mr-2 h-5 w-5" />
                    Analyze Dataset
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="lg">
                    Replace File
                  </Button>
                  <Button onClick={handleRemoveFile} variant="outline" size="lg">
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* History button */}
            {datasetHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowHistory(true)}>
                  <History className="mr-2 h-4 w-4" />
                  Upload History ({datasetHistory.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step: Processing */}
      {step === 'processing' && (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <Database className="h-7 w-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <p className="text-lg font-semibold mb-2">{PROCESSING_STEPS[processingStepIndex]}</p>
              <div className="w-full max-w-md mt-4">
                <Progress value={processingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center mt-2">{Math.round(processingProgress)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Preview + Quality + Mapping + Analysis */}
      {(step === 'preview' || step === 'mapping' || step === 'analysis') && analysis && (
        <div className="space-y-6">
          {/* File info bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileIconComp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{analysis.metadata.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {analysis.metadata.rowCount} rows • {analysis.metadata.columnCount} columns • {formatFileSize(analysis.metadata.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                    <X className="mr-1.5 h-3.5 w-3.5" /> Remove
                  </Button>
                  {step !== 'analysis' && (
                    <Button size="sm" onClick={() => setStep('analysis')}>
                      Skip to Analysis <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dataset Preview</CardTitle>
                  <CardDescription>First {analysis.previewRows.length} rows of the dataset</CardDescription>
                </div>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rows..."
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    className="pl-9 h-8 text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      {analysis.metadata.columns.map((col) => (
                        <TableHead key={col.name} className="whitespace-nowrap">{col.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPreviewRows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                        {analysis.metadata.columns.map((col) => (
                          <TableCell key={col.name} className="whitespace-nowrap text-sm">{String(row[col.name] ?? '')}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Data Quality */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Quality Summary</CardTitle>
                  <CardDescription>Quality analysis of the uploaded dataset</CardDescription>
                </div>
                <Badge className={qualityLevelColors[analysis.quality.qualityLevel]} variant="secondary">
                  {analysis.quality.qualityLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-6">
                {[
                  { label: 'Total Records', value: analysis.quality.totalRecords, icon: Database },
                  { label: 'Total Features', value: analysis.quality.totalFeatures, icon: Database },
                  { label: 'Missing Values', value: analysis.quality.missingValues, icon: AlertTriangle },
                  { label: 'Duplicate Records', value: analysis.quality.duplicateRecords, icon: AlertTriangle },
                  { label: 'Numeric Columns', value: analysis.quality.numericColumns, icon: TrendingUp },
                  { label: 'Categorical Columns', value: analysis.quality.categoricalColumns, icon: Database },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border p-3 text-center">
                    <stat.icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Missing Values</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.quality.columnSummaries.map((col) => (
                      <TableRow key={col.column}>
                        <TableCell className="font-medium">{col.column}</TableCell>
                        <TableCell><Badge variant="secondary">{col.dataType}</Badge></TableCell>
                        <TableCell>{col.missingValues}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={
                            col.status === 'Complete' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                            col.status === 'Partial' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                            'bg-red-500/10 text-red-600 dark:text-red-400'
                          }>
                            {col.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Column Mapping */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Map Your Dataset Columns</CardTitle>
                  <CardDescription>Map dataset columns to required ML features</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAutoDetect}>
                  <Wand2 className="mr-1.5 h-3.5 w-3.5" />
                  Auto Detect Columns
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {ML_FEATURES.map((feature) => {
                  const mapped = mapping[feature.key];
                  const isMissing = feature.required && !mapped;
                  return (
                    <div key={feature.key} className={`rounded-lg border p-3 ${isMissing ? 'border-amber-500/40 bg-amber-500/5' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">{feature.label}</Label>
                        {feature.required ? (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Optional</Badge>
                        )}
                      </div>
                      <Select
                        value={mapped ?? '__none__'}
                        onValueChange={(v) => handleMappingChange(feature.key, v)}
                      >
                        <SelectTrigger className={isMissing ? 'border-amber-500/40' : ''}>
                          <SelectValue placeholder="Select column..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">-- None --</SelectItem>
                          {analysis.metadata.columns.map((col) => (
                            <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isMissing && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {feature.label} column was not detected. Please map a column manually.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep('analysis')} size="lg">
                  Continue to Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dataset Analysis Dashboard */}
          {step === 'analysis' && analysis && (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Sector Comparison</CardTitle>
                    <CardDescription>Average efficiency by sector</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetSectorBarChart data={analysis.sectorComparison} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Efficiency Distribution</CardTitle>
                    <CardDescription>Distribution of efficiency levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetDistributionPieChart data={analysis.efficiencyDistribution} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Efficiency over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysis.metadata.hasDateColumn ? (
                      <DatasetTrendLineChart data={analysis.performanceTrend} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertTriangle className="h-10 w-10 text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          No time-based column detected. Upload a dataset containing a date or period column to view performance trends.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Factor Comparison</CardTitle>
                    <CardDescription>Average performance across key factors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetFactorRadarChart data={analysis.factorRadar} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time vs Efficiency</CardTitle>
                    <CardDescription>Relationship between response time and efficiency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetResponseTimeScatter data={analysis.responseTimeScatter} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Complaints vs Efficiency</CardTitle>
                    <CardDescription>Relationship between complaints and efficiency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetComplaintsScatter data={analysis.complaintsScatter} />
                  </CardContent>
                </Card>
              </div>

              {/* Feature Distribution */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Feature Distribution</CardTitle>
                      <CardDescription>Select a numeric feature to visualize its distribution</CardDescription>
                    </div>
                    <Select value={selectedFeature} onValueChange={setSelectedFeature}>
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder="Select feature..." />
                      </SelectTrigger>
                      <SelectContent>
                        {analysis.numericFeatures.map((f) => (
                          <SelectItem key={f.name} value={f.name}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedFeature ? (
                    <FeatureDistributionChart
                      data={analysis.numericFeatures.find((f) => f.name === selectedFeature)?.data ?? []}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <TrendingUp className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">Select a feature from the dropdown to view its distribution.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI-Generated Insights
                  </CardTitle>
                  <CardDescription>Insights derived from the uploaded dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {analysis.insights.map((insight, i) => {
                      const styles = {
                        positive: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', icon: TrendingUp },
                        warning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle },
                        info: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', icon: Brain },
                      };
                      const style = styles[insight.type];
                      const Icon = style.icon;
                      return (
                        <div key={i} className="rounded-lg border p-4 transition-all hover:shadow-md">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.bg} ${style.text} shrink-0`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{insight.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Run AI Analysis button */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Brain className="h-10 w-10 text-primary mb-3" />
                    <h3 className="text-xl font-bold">Run AI Efficiency Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      Send the dataset to the ML model for comprehensive efficiency prediction and recommendations.
                    </p>
                    <Button onClick={handleRunPrediction} size="lg" className="mt-5">
                      <Brain className="mr-2 h-5 w-5" />
                      Run AI Efficiency Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Step: Prediction Loading */}
      {step === 'prediction-loading' && (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <Brain className="h-7 w-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <p className="text-lg font-semibold">Running AI Efficiency Analysis...</p>
              <p className="text-sm text-muted-foreground mt-1">Preparing data and sending to ML model</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Prediction Results */}
      {step === 'prediction-results' && predictionResult && (
        <div className="space-y-6">
          {/* Score + Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Dataset Analysis Results</CardTitle>
              <CardDescription>{predictionResult.id} - {predictionResult.fileName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid items-center gap-6 sm:grid-cols-2">
                <GaugeChart score={predictionResult.efficiencyScore} level={predictionResult.efficiencyLevel} />
                <div className="space-y-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">AI Confidence</p>
                    <p className="text-2xl font-bold">{predictionResult.confidence}%</p>
                    <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${predictionResult.confidence}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Records Analyzed</p>
                      <p className="text-lg font-bold">{predictionResult.recordsAnalyzed}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Avg Efficiency</p>
                      <p className="text-lg font-bold">{predictionResult.averageEfficiency}%</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Best Sector</p>
                      <p className="text-sm font-bold">{predictionResult.bestSector.sector}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">{predictionResult.bestSector.score}%</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Lowest Sector</p>
                      <p className="text-sm font-bold">{predictionResult.lowestSector.sector}</p>
                      <p className="text-xs text-red-600 dark:text-red-400">{predictionResult.lowestSector.score}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Importance */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>Demo model - factor weights from dataset analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureImportanceChart data={predictionResult.featureImportance} />
            </CardContent>
          </Card>

          {/* Strengths + Improvement Areas */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {predictionResult.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {predictionResult.improvementAreas.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictionResult.recommendations.map((r, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{r.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                      </div>
                      <Badge variant="secondary" className={
                        r.priority === 'High' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                        r.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }>
                        {r.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleDownloadReport} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              New Dataset
            </Button>
          </div>
        </div>
      )}

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload History</DialogTitle>
            <DialogDescription>Recent dataset analysis sessions</DialogDescription>
          </DialogHeader>
          {datasetHistory.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No upload history yet.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-3">
                <Button variant="outline" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Clear All
                </Button>
              </div>
              <div className="space-y-3">
                {datasetHistory.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{session.id}</span>
                        <Badge variant="secondary" className="text-xs">{session.status}</Badge>
                      </div>
                      <p className="font-semibold truncate">{session.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.fileType.toUpperCase()} • {session.records} records • {new Date(session.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSession(session.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
