import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, TrendingUp, BarChart3, Radar as RadarIcon, ScatterChart, Brain, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendLineChart,
  SectorBarChart,
  PerformanceRadarChart,
  SatisfactionScatterChart,
  FeatureImportanceChart,
} from '@/components/charts/ChartComponents';
import { monthlyTrends, featureImportanceData, aiInsights } from '@/data/mockData';

const insightTypeStyles = {
  positive: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', icon: TrendingUp },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: Info },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', icon: Brain },
};

export default function AnalyticsPage() {
  const [searchParams] = useSearchParams();
  const initialSector = searchParams.get('sector') || 'all';

  const [sector, setSector] = useState<string>(initialSector);
  const [dateRange, setDateRange] = useState('12m');
  const [level, setLevel] = useState('all');

  useEffect(() => {
    if (initialSector !== 'all') setSector(initialSector);
  }, [initialSector]);

  const filteredTrends = useMemo(() => {
    if (dateRange === '6m') return monthlyTrends.slice(-6);
    if (dateRange === '3m') return monthlyTrends.slice(-3);
    return monthlyTrends;
  }, [dateRange]);

  const filteredInsights = useMemo(() => {
    if (sector === 'all') return aiInsights;
    return aiInsights.filter((i) => i.description.toLowerCase().includes(sector.toLowerCase()) || true);
  }, [sector]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-2 text-muted-foreground">Advanced analytics and insights across public service sectors.</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters:
            </div>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Service Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Government Administration">Government Administration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="12m">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Efficiency Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Trend
            </CardTitle>
            <CardDescription>Interactive efficiency trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={filteredTrends} height={320} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Sector Comparison
            </CardTitle>
            <CardDescription>Efficiency and satisfaction by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <SectorBarChart height={320} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RadarIcon className="h-5 w-5 text-primary" />
              Service Performance Comparison
            </CardTitle>
            <CardDescription>Radar chart of performance factors by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceRadarChart height={320} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScatterChart className="h-5 w-5 text-primary" />
              Satisfaction vs Efficiency
            </CardTitle>
            <CardDescription>Relationship between citizen satisfaction and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <SatisfactionScatterChart height={320} />
          </CardContent>
        </Card>
      </div>

      {/* Feature Importance */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Factor Importance</CardTitle>
              <CardDescription>Demo Model Insights - importance of each factor in predicting efficiency</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Demo Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <FeatureImportanceChart data={featureImportanceData} height={320} />
        </CardContent>
      </Card>

      {/* AI Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
          <CardDescription>Data-driven insights based on current analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredInsights.map((insight, i) => {
              const style = insightTypeStyles[insight.type];
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
    </div>
  );
}
