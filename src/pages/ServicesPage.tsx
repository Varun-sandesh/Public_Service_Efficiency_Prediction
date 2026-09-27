import { Link } from 'react-router-dom';
import {
  Heart,
  GraduationCap,
  Bus,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Gauge,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sectorData } from '@/data/mockData';

const sectorIcons: Record<string, typeof Heart> = {
  Healthcare: Heart,
  Education: GraduationCap,
  Transportation: Bus,
  'Government Administration': Building2,
};

const sectorColors: Record<string, string> = {
  Healthcare: 'from-rose-500 to-red-500',
  Education: 'from-blue-500 to-cyan-500',
  Transportation: 'from-amber-500 to-orange-500',
  'Government Administration': 'from-violet-500 to-purple-500',
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Public Service Sectors</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Detailed analysis of efficiency across four critical public service domains.
        </p>
      </div>

      <div className="space-y-8">
        {sectorData.map((sector, index) => {
          const Icon = sectorIcons[sector.sector];
          const colorClass = sectorColors[sector.sector];
          const isPositive = sector.trend >= 0;

          return (
            <Card key={sector.sector} className="overflow-hidden transition-all hover:shadow-xl">
              <div className={`h-1.5 bg-gradient-to-r ${colorClass}`} />
              <CardContent className="pt-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Left: sector info */}
                  <div className="lg:col-span-1">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} text-white mb-4`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-bold">{sector.sector}</h2>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{sector.efficiencyScore}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      <Badge className={isPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'} variant="secondary">
                        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {isPositive ? '+' : ''}{sector.trend}%
                      </Badge>
                    </div>
                    <Button asChild className="mt-5 w-full" variant="default">
                      <Link to={`/analytics?sector=${encodeURIComponent(sector.sector)}`}>
                        Analyze Sector
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Middle: metrics */}
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-semibold mb-3">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {sector.metrics.map((metric) => (
                        <div key={metric.label} className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <p className="text-lg font-bold mt-0.5">{metric.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{metric.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: challenges + improvements */}
                  <div className="lg:col-span-1 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Key Challenges
                      </h3>
                      <ul className="space-y-1.5">
                        {sector.challenges.map((c, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 text-green-500" />
                        Suggested Improvements
                      </h3>
                      <ul className="space-y-1.5">
                        {sector.improvements.map((c, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
