import { useState, useCallback } from 'react';
import {
  Brain,
  Loader2,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { predictEfficiency, savePrediction } from '@/services/predictionService';
import { InputMetricsBarChart, FeatureImportanceChart } from '@/components/charts/ChartComponents';
import type { PredictionInput, PredictionResult, EfficiencyLevel } from '@/types';

const levelColors: Record<EfficiencyLevel, { bg: string; text: string; ring: string }> = {
  Excellent: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', ring: 'stroke-green-500' },
  High: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', ring: 'stroke-blue-500' },
  Moderate: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', ring: 'stroke-amber-500' },
  Low: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', ring: 'stroke-red-500' },
};

const sliderFields: { key: keyof PredictionInput; label: string; tooltip: string }[] = [
  { key: 'citizenSatisfaction', label: 'Citizen Satisfaction', tooltip: 'Percentage of citizens satisfied with the service (0-100%)' },
  { key: 'resourceUtilization', label: 'Resource Utilization', tooltip: 'How effectively resources are being used (0-100%)' },
  { key: 'budgetUtilization', label: 'Budget Utilization', tooltip: 'Percentage of allocated budget that has been utilized (0-100%)' },
  { key: 'staffAvailability', label: 'Staff Availability', tooltip: 'Percentage of required staff currently available (0-100%)' },
  { key: 'serviceAccessibility', label: 'Service Accessibility', tooltip: 'How easily citizens can access the service (0-100%)' },
];

const defaultInput: PredictionInput = {
  serviceSector: 'Healthcare',
  serviceName: '',
  citizenSatisfaction: 75,
  averageResponseTime: 3,
  resourceUtilization: 70,
  budgetUtilization: 75,
  staffAvailability: 70,
  serviceAccessibility: 75,
  numberOfComplaints: 100,
  digitalServiceAvailability: 70,
  serviceCoverageArea: '',
  populationServed: undefined,
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

export default function ManualPredictionForm() {
  const { toast } = useToast();
  const [input, setInput] = useState<PredictionInput>(defaultInput);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PredictionInput, string>>>({});

  const validate = useCallback((): boolean => {
    const errs: Partial<Record<keyof PredictionInput, string>> = {};
    if (!input.serviceName.trim()) errs.serviceName = 'Service name is required';
    if (input.averageResponseTime < 0) errs.averageResponseTime = 'Cannot be negative';
    if (input.averageResponseTime > 48) errs.averageResponseTime = 'Must be 48 hours or less';
    if (input.numberOfComplaints < 0) errs.numberOfComplaints = 'Cannot be negative';
    if (input.numberOfComplaints > 10000) errs.numberOfComplaints = 'Must be 10,000 or less';
    if (input.populationServed !== undefined && input.populationServed < 0) errs.populationServed = 'Cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [input]);

  const handleSlider = (key: keyof PredictionInput, value: number[]) => {
    setInput((prev) => ({ ...prev, [key]: value[0] }));
  };

  const handlePredict = async () => {
    if (!validate()) {
      toast({ title: 'Form validation error', description: 'Please correct the highlighted fields before generating a prediction.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const prediction = await predictEfficiency(input);
      setResult(prediction);
      toast({ title: 'Prediction generated', description: `Efficiency score: ${prediction.efficiencyScore}/100 (${prediction.efficiencyLevel})` });
    } catch {
      toast({ title: 'Prediction failed', description: 'An error occurred while generating the prediction. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    savePrediction(result);
    toast({ title: 'Prediction saved', description: 'The prediction has been saved to your history.' });
  };

  const handleDownload = () => {
    if (!result) return;
    const report = generateReport(result);
    const blob = new Blob([report], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction-report-${result.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Report downloaded', description: 'The prediction report has been downloaded.' });
  };

  const handleNew = () => {
    setInput(defaultInput);
    setResult(null);
    setErrors({});
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Inputs</CardTitle>
          <CardDescription>Provide service metrics for AI prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Service Sector</Label>
              <Select value={input.serviceSector} onValueChange={(v) => setInput((p) => ({ ...p, serviceSector: v as PredictionInput['serviceSector'] }))}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Government Administration">Government Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Service Name</Label>
              <Input className="mt-1.5" placeholder="e.g., City Hospital, Public School" value={input.serviceName} onChange={(e) => setInput((p) => ({ ...p, serviceName: e.target.value }))} />
              {errors.serviceName && <p className="text-xs text-red-500 mt-1">{errors.serviceName}</p>}
            </div>
          </div>

          <TooltipProvider>
            {sliderFields.map((field) => (
              <div key={field.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Label>{field.label}</Label>
                    <Tooltip>
                      <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                      <TooltipContent>{field.tooltip}</TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-semibold">{input[field.key] as number}%</span>
                </div>
                <Slider value={[input[field.key] as number]} onValueChange={(v) => handleSlider(field.key, v)} max={100} step={1} />
              </div>
            ))}
          </TooltipProvider>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Label>Average Response Time (hours)</Label></div>
              <Input type="number" min={0} max={48} step={0.1} value={input.averageResponseTime} onChange={(e) => setInput((p) => ({ ...p, averageResponseTime: parseFloat(e.target.value) || 0 }))} />
              {errors.averageResponseTime && <p className="text-xs text-red-500 mt-1">{errors.averageResponseTime}</p>}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Label>Number of Complaints</Label></div>
              <Input type="number" min={0} max={10000} value={input.numberOfComplaints} onChange={(e) => setInput((p) => ({ ...p, numberOfComplaints: parseInt(e.target.value) || 0 }))} />
              {errors.numberOfComplaints && <p className="text-xs text-red-500 mt-1">{errors.numberOfComplaints}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Digital Service Availability</Label>
              <p className="text-sm text-muted-foreground mt-1">Toggle if digital services are available, or set a percentage below</p>
            </div>
            <Switch checked={input.digitalServiceAvailability >= 50} onCheckedChange={(checked) => setInput((p) => ({ ...p, digitalServiceAvailability: checked ? 80 : 20 }))} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Digital Service Availability (%)</Label>
              <span className="text-sm font-semibold">{input.digitalServiceAvailability}%</span>
            </div>
            <Slider value={[input.digitalServiceAvailability]} onValueChange={(v) => handleSlider('digitalServiceAvailability', v)} max={100} step={5} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Service Coverage Area (optional)</Label>
              <Input className="mt-1.5" placeholder="e.g., Downtown, North District" value={input.serviceCoverageArea} onChange={(e) => setInput((p) => ({ ...p, serviceCoverageArea: e.target.value }))} />
            </div>
            <div>
              <Label>Population Served (optional)</Label>
              <Input className="mt-1.5" type="number" min={0} placeholder="e.g., 50000" value={input.populationServed ?? ''} onChange={(e) => setInput((p) => ({ ...p, populationServed: e.target.value ? parseInt(e.target.value) : undefined }))} />
              {errors.populationServed && <p className="text-xs text-red-500 mt-1">{errors.populationServed}</p>}
            </div>
          </div>

          <Button onClick={handlePredict} disabled={loading} size="lg" className="w-full">
            {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Generating AI Prediction...</>) : (<><Brain className="mr-2 h-5 w-5" />Generate AI Prediction</>)}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        {loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <Brain className="h-7 w-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <p className="mt-6 text-lg font-semibold">AI Model Processing...</p>
              <p className="text-sm text-muted-foreground mt-1">Analyzing performance factors and generating prediction</p>
            </CardContent>
          </Card>
        )}

        {!loading && !result && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold">No prediction yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">Fill in the performance metrics and click "Generate AI Prediction" to see results.</p>
            </CardContent>
          </Card>
        )}

        {!loading && result && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
                <CardDescription>{result.id} - {result.input.serviceName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid items-center gap-6 sm:grid-cols-2">
                  <GaugeChart score={result.efficiencyScore} level={result.efficiencyLevel} />
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">AI Confidence</p>
                      <p className="text-2xl font-bold">{result.confidence}%</p>
                      <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Service Sector</p>
                      <p className="text-lg font-semibold">{result.input.serviceSector}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input Performance Metrics</CardTitle>
                <CardDescription>Normalized scores for each input factor</CardDescription>
              </CardHeader>
              <CardContent>
                <InputMetricsBarChart data={result.inputMetrics} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Positive Factors vs Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" />Positive Factors</p>
                    <div className="space-y-2">
                      {result.positiveFactors.length > 0 ? result.positiveFactors.map((f) => (
                        <div key={f.label} className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">
                          <span className="text-sm">{f.label}</span>
                          <div className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-green-500" /><span className="text-sm font-semibold">{f.value}{f.label.includes('Complaints') ? '' : '%'}</span></div>
                        </div>
                      )) : <p className="text-sm text-muted-foreground">No strong positive factors detected.</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" />Improvement Areas</p>
                    <div className="space-y-2">
                      {result.improvementAreas.length > 0 ? result.improvementAreas.map((f) => (
                        <div key={f.label} className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                          <span className="text-sm">{f.label}</span>
                          <div className="flex items-center gap-1.5"><TrendingDown className="h-3.5 w-3.5 text-red-500" /><span className="text-sm font-semibold">{f.value}{f.label.includes('Complaints') ? '' : f.label.includes('Response') ? ' hrs' : '%'}</span></div>
                        </div>
                      )) : <p className="text-sm text-muted-foreground">No significant improvement areas.</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Importance</CardTitle>
                <CardDescription>Demo model - factor weights influencing efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureImportanceChart data={result.featureImportance} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" />AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((r, i) => {
                    const priorityClass =
                      r.priority === 'High'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : r.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
                    return (
                      <div key={i} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div><p className="font-semibold">{r.title}</p><p className="text-sm text-muted-foreground mt-1">{r.description}</p></div>
                          <Badge variant="secondary" className={priorityClass}>{r.priority}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleSave} className="flex-1"><Save className="mr-2 h-4 w-4" />Save Prediction</Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1"><Download className="mr-2 h-4 w-4" />Download Report</Button>
              <Button onClick={handleNew} variant="outline" className="flex-1"><RotateCcw className="mr-2 h-4 w-4" />New Prediction</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function generateReport(result: PredictionResult): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Prediction Report - ${result.id}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; }
    h1 { color: #2563eb; }
    .score { font-size: 48px; font-weight: bold; color: #2563eb; }
    .section { margin: 20px 0; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; background: #dbeafe; color: #2563eb; font-size: 14px; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .metric { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
    .label { color: #6b7280; font-size: 14px; }
    .value { font-size: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>AI Efficiency Prediction Report</h1>
  <p>Prediction ID: ${result.id}</p>
  <p>Generated: ${new Date(result.createdAt).toLocaleString()}</p>
  <div class="section"><h2>Summary</h2><div class="grid">
    <div class="metric"><p class="label">Efficiency Score</p><p class="score">${result.efficiencyScore}/100</p></div>
    <div class="metric"><p class="label">Efficiency Level</p><p class="badge">${result.efficiencyLevel}</p></div>
    <div class="metric"><p class="label">AI Confidence</p><p class="value">${result.confidence}%</p></div>
    <div class="metric"><p class="label">Service Sector</p><p class="value">${result.input.serviceSector}</p></div>
  </div></div>
  <div class="section"><h2>Input Metrics</h2><ul>${result.inputMetrics.map((m) => `<li>${m.label}: ${m.value} (normalized: ${m.normalized.toFixed(1)})</li>`).join('')}</ul></div>
  <div class="section"><h2>Positive Factors</h2><ul>${result.positiveFactors.map((f) => `<li>${f.label}: ${f.value}</li>`).join('')}</ul></div>
  <div class="section"><h2>Improvement Areas</h2><ul>${result.improvementAreas.map((f) => `<li>${f.label}: ${f.value}</li>`).join('')}</ul></div>
  <div class="section"><h2>AI Recommendations</h2><ul>${result.recommendations.map((r) => `<li><strong>${r.title}</strong> (${r.priority} priority): ${r.description}</li>`).join('')}</ul></div>
  <div class="section"><h2>Feature Importance</h2><ul>${result.featureImportance.map((f) => `<li>${f.feature}: ${(f.importance * 100).toFixed(1)}%</li>`).join('')}</ul></div>
  <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">Generated by Public Service AI<br>© 2026 Public Service AI. All Rights Reserved.</p>
</body>
</html>`;
}
