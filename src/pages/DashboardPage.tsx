import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Gauge,
  Smile,
  Clock,
  Server,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  History,
  Trash2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  TrendLineChart,
  SectorBarChart,
  DistributionPieChart,
  SatisfactionScatterChart,
} from '@/components/charts/ChartComponents';
import { monthlyTrends, recentPredictions } from '@/data/mockData';
import { getSavedPredictions, deletePrediction, clearAllPredictions } from '@/services/predictionService';
import type { PredictionResult, EfficiencyLevel } from '@/types';

const summaryCards = [
  { title: 'Overall Efficiency Score', value: '80.5', change: '+4.2%', positive: true, icon: Gauge, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { title: 'Average Citizen Satisfaction', value: '79.8%', change: '+2.8%', positive: true, icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10' },
  { title: 'Average Response Time', value: '3.7 hrs', change: '-0.3 hrs', positive: true, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { title: 'Resource Utilization', value: '78.5%', change: '-1.2%', positive: false, icon: Server, color: 'text-violet-500', bg: 'bg-violet-500/10' },
];

const levelColors: Record<EfficiencyLevel, string> = {
  Excellent: 'bg-green-500/10 text-green-600 dark:text-green-400',
  High: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Moderate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Low: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export default function DashboardPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);
  const [savedPredictions, setSavedPredictions] = useState<PredictionResult[]>(getSavedPredictions());
  const [showHistory, setShowHistory] = useState(false);

  const filteredPredictions = useMemo(() => {
    return recentPredictions.filter((p) => {
      const matchesSearch = p.id.toLowerCase().includes(search.toLowerCase()) || p.sector.toLowerCase().includes(search.toLowerCase());
      const matchesSector = sectorFilter === 'all' || p.sector === sectorFilter;
      const matchesLevel = levelFilter === 'all' || p.level === levelFilter;
      return matchesSearch && matchesSector && matchesLevel;
    });
  }, [search, sectorFilter, levelFilter]);

  const handleDelete = (id: string) => {
    deletePrediction(id);
    setSavedPredictions(getSavedPredictions());
    toast({ title: 'Prediction deleted', description: 'The saved prediction has been removed.' });
  };

  const handleClearAll = () => {
    clearAllPredictions();
    setSavedPredictions([]);
    toast({ title: 'All predictions cleared', description: 'Prediction history has been reset.' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Public Service Efficiency Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Real-time overview of service performance and AI-generated insights.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {summaryCards.map((card) => (
          <Card key={card.title} className="transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {card.positive ? (
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {card.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Service Efficiency Trend</CardTitle>
            <CardDescription>Monthly efficiency scores across all sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={monthlyTrends} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency by Service Sector</CardTitle>
            <CardDescription>Current efficiency and satisfaction comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <SectorBarChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Level Distribution</CardTitle>
            <CardDescription>Distribution of efficiency classifications</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionPieChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citizen Satisfaction vs Efficiency</CardTitle>
            <CardDescription>Relationship between satisfaction and efficiency scores</CardDescription>
          </CardHeader>
          <CardContent>
            <SatisfactionScatterChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Predictions + History */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>Latest AI-generated efficiency predictions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
                <History className="mr-1.5 h-4 w-4" />
                History ({savedPredictions.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or sector..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Government Administration">Administration</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Level" />
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prediction ID</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPredictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No predictions match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPredictions.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.id}</TableCell>
                      <TableCell className="font-medium">{p.sector}</TableCell>
                      <TableCell className="font-semibold">{p.score}</TableCell>
                      <TableCell>
                        <Badge className={levelColors[p.level as EfficiencyLevel]} variant="secondary">
                          {p.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with AI prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" size="lg">
              <Link to="/predict">
                <Plus className="mr-2 h-5 w-5" />
                New Prediction
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start" size="lg">
              <Link to="/analytics">
                <ArrowRight className="mr-2 h-5 w-5" />
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start" size="lg">
              <Link to="/model-insights">
                <ArrowRight className="mr-2 h-5 w-5" />
                Model Insights
              </Link>
            </Button>
            <div className="pt-3 border-t mt-3">
              <p className="text-sm text-muted-foreground mb-2">Saved Predictions</p>
              <p className="text-2xl font-bold">{savedPredictions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Prediction History</DialogTitle>
            <DialogDescription>View and manage your previously saved predictions.</DialogDescription>
          </DialogHeader>
          {savedPredictions.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No predictions yet. Create your first AI efficiency prediction.</p>
              <Button asChild onClick={() => setShowHistory(false)}>
                <Link to="/predict">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Prediction
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-3">
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Clear All
                </Button>
              </div>
              <div className="space-y-3">
                {savedPredictions.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                        <Badge className={levelColors[p.efficiencyLevel]} variant="secondary">
                          {p.efficiencyLevel}
                        </Badge>
                      </div>
                      <p className="font-semibold">{p.input.serviceSector} - {p.input.serviceName || 'Unnamed Service'}</p>
                      <p className="text-sm text-muted-foreground">Score: {p.efficiencyScore}/100 | Confidence: {p.confidence}%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedPrediction(p); setShowHistory(false); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
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

      {/* Prediction Details Dialog */}
      <Dialog open={!!selectedPrediction} onOpenChange={(open) => !open && setSelectedPrediction(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prediction Details</DialogTitle>
            <DialogDescription>{selectedPrediction?.id}</DialogDescription>
          </DialogHeader>
          {selectedPrediction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Efficiency Score</p>
                  <p className="text-2xl font-bold gradient-text">{selectedPrediction.efficiencyScore}/100</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Efficiency Level</p>
                  <Badge className={levelColors[selectedPrediction.efficiencyLevel]} variant="secondary">
                    {selectedPrediction.efficiencyLevel}
                  </Badge>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-bold">{selectedPrediction.confidence}%</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="text-lg font-semibold">{selectedPrediction.input.serviceSector}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Positive Factors</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPrediction.positiveFactors.map((f) => (
                    <Badge key={f.label} variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                      {f.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Improvement Areas</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPrediction.improvementAreas.length > 0 ? (
                    selectedPrediction.improvementAreas.map((f) => (
                      <Badge key={f.label} variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400">
                        {f.label}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No significant improvement areas detected.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Recommendations</p>
                <ul className="space-y-2">
                  {selectedPrediction.recommendations.map((r, i) => (
                    <li key={i} className="text-sm rounded-lg border p-3">
                      <span className="font-medium">{r.title}</span>
                      <span className="text-muted-foreground"> - {r.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
