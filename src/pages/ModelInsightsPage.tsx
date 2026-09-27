import {
  Database,
  Sparkles,
  Cpu,
  Brain,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  Crown,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FeatureImportanceChart } from '@/components/charts/ChartComponents';
import { modelMetrics, featureImportanceData, radarData } from '@/data/mockData';

const pipelineSteps = [
  { icon: Database, title: 'Historical Data', description: 'Collect service performance records' },
  { icon: Sparkles, title: 'Data Cleaning', description: 'Handle missing values and outliers' },
  { icon: Cpu, title: 'Feature Engineering', description: 'Transform and select key features' },
  { icon: Brain, title: 'Model Training', description: 'Train ML models on the dataset' },
  { icon: TrendingUp, title: 'Efficiency Prediction', description: 'Predict efficiency scores' },
  { icon: Lightbulb, title: 'Insights & Recommendations', description: 'Generate actionable insights' },
];

const inputFeatures = [
  { name: 'Service Sector', type: 'Categorical', description: 'Type of public service' },
  { name: 'Citizen Satisfaction', type: 'Numerical (0-100)', description: 'Percentage of satisfied citizens' },
  { name: 'Average Response Time', type: 'Numerical (hours)', description: 'Time to respond to service requests' },
  { name: 'Resource Utilization', type: 'Numerical (0-100)', description: 'Effectiveness of resource usage' },
  { name: 'Budget Utilization', type: 'Numerical (0-100)', description: 'Percentage of budget used' },
  { name: 'Staff Availability', type: 'Numerical (0-100)', description: 'Available staff percentage' },
  { name: 'Service Accessibility', type: 'Numerical (0-100)', description: 'Ease of service access' },
  { name: 'Number of Complaints', type: 'Numerical', description: 'Total complaints received' },
  { name: 'Digital Service Availability', type: 'Numerical (0-100)', description: 'Digital service adoption' },
];

const tooltipStyle = {
  borderRadius: '0.5rem',
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
  fontSize: '12px',
};

const modelComparisonData = modelMetrics.map((m) => ({
  model: m.model === 'Linear Regression' ? 'Linear Reg.' : m.model === 'Neural Network' ? 'Neural Net' : m.model,
  R2: m.r2 * 100,
  Accuracy: m.accuracy,
}));

const modelRadarData = [
  { metric: 'R2 Score', 'Linear Regression': 74, 'Decision Tree': 89, 'Neural Network': 87 },
  { metric: 'Accuracy', 'Linear Regression': 76, 'Decision Tree': 91, 'Neural Network': 89 },
  { metric: 'Speed', 'Linear Regression': 95, 'Decision Tree': 78, 'Neural Network': 72 },
  { metric: 'Stability', 'Linear Regression': 70, 'Decision Tree': 88, 'Neural Network': 85 },
  { metric: 'Interpretability', 'Linear Regression': 92, 'Decision Tree': 65, 'Neural Network': 60 },
];

const COLORS = ['hsl(221 83% 53%)', 'hsl(142 71% 45%)', 'hsl(38 92% 50%)'];

export default function ModelInsightsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Model Insights</h1>
        <p className="mt-2 text-muted-foreground">Understanding the Machine Learning component of the prediction system.</p>
      </div>

      {/* ML Pipeline */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ML Pipeline</CardTitle>
          <CardDescription>From raw data to actionable predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {pipelineSteps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white mx-auto mb-3">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                {i < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block text-muted-foreground/30 text-xl mt-2">{'->'}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Input Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input Features</CardTitle>
          <CardDescription>All features used for efficiency prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputFeatures.map((f) => (
                <TableRow key={f.name}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell><Badge variant="secondary">{f.type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{f.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Model Comparison Cards */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {modelMetrics.map((model, i) => (
          <Card key={model.model} className={i === 1 ? 'border-green-500/40 ring-1 ring-green-500/20' : ''}>
            <CardContent className="pt-6">
              {i === 1 && (
                <Badge className="mb-3 bg-green-500/10 text-green-600 dark:text-green-400" variant="secondary">
                  <Crown className="h-3 w-3 mr-1" />
                  Best Performing
                </Badge>
              )}
              <h3 className="text-lg font-bold mb-3">{model.model}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">MAE</span>
                  <span className="font-semibold">{model.mae}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">RMSE</span>
                  <span className="font-semibold">{model.rmse}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">R2 Score</span>
                  <span className="font-semibold">{model.r2}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-semibold">{model.accuracy}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Model Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Model Performance Comparison</CardTitle>
                <CardDescription>R2 Score and Accuracy by model</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">Demo Metrics</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelComparisonData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="model" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="R2" fill={COLORS[0]} radius={[6, 6, 0, 0]} barSize={28} />
                <Bar dataKey="Accuracy" fill={COLORS[1]} radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Strengths Comparison</CardTitle>
            <CardDescription>Multi-dimensional model evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={modelRadarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Radar name="Linear Regression" dataKey="Linear Regression" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.1} />
                <Radar name="Decision Tree" dataKey="Decision Tree" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.1} />
                <Radar name="Neural Network" dataKey="Neural Network" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Best Model Highlight */}
      <Card className="mb-8 border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <Crown className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Decision Tree - Best Performing Model</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The Decision Tree model achieves the highest R2 score (0.89) and accuracy (91%) among the evaluated models.
                It handles non-linear relationships well and is robust to overfitting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>Ranking of factors influencing efficiency (demo model)</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">Demo Data</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <FeatureImportanceChart data={featureImportanceData} height={350} />
        </CardContent>
      </Card>
    </div>
  );
}
