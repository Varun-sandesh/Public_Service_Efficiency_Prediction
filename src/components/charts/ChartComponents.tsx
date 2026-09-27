import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import type { MonthlyTrend } from '@/types';
import { sectorData, radarData, efficiencyDistribution, scatterData } from '@/data/mockData';

const CHART_COLORS = {
  primary: 'hsl(221 83% 53%)',
  blue: 'hsl(217 91% 60%)',
  green: 'hsl(142 71% 45%)',
  amber: 'hsl(38 92% 50%)',
  purple: 'hsl(280 65% 60%)',
  red: 'hsl(0 84% 60%)',
  cyan: 'hsl(190 90% 45%)',
};

const tooltipStyle = {
  borderRadius: '0.5rem',
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

export function TrendLineChart({ data, height = 300 }: { data: MonthlyTrend[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Overall" stroke={CHART_COLORS.primary} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Healthcare" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Education" stroke={CHART_COLORS.cyan} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Transportation" stroke={CHART_COLORS.amber} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Administration" stroke={CHART_COLORS.purple} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SectorBarChart({ height = 300 }: { height?: number }) {
  const data = sectorData.map((s) => ({
    name: s.sector === 'Government Administration' ? 'Admin' : s.sector,
    Efficiency: s.efficiencyScore,
    Satisfaction: s.satisfaction,
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Efficiency" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} barSize={28} />
        <Bar dataKey="Satisfaction" fill={CHART_COLORS.cyan} radius={[6, 6, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DistributionPieChart({ height = 300 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={efficiencyDistribution}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
        >
          {efficiencyDistribution.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PerformanceRadarChart({ height = 300 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={radarData}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <Radar name="Healthcare" dataKey="Healthcare" stroke={CHART_COLORS.green} fill={CHART_COLORS.green} fillOpacity={0.15} />
        <Radar name="Education" dataKey="Education" stroke={CHART_COLORS.cyan} fill={CHART_COLORS.cyan} fillOpacity={0.15} />
        <Radar name="Transportation" dataKey="Transportation" stroke={CHART_COLORS.amber} fill={CHART_COLORS.amber} fillOpacity={0.15} />
        <Radar name="Administration" dataKey="Administration" stroke={CHART_COLORS.purple} fill={CHART_COLORS.purple} fillOpacity={0.15} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function SatisfactionScatterChart({ height = 300 }: { height?: number }) {
  const colors = [CHART_COLORS.green, CHART_COLORS.cyan, CHART_COLORS.amber, CHART_COLORS.purple];
  const sectors = ['Healthcare', 'Education', 'Transportation', 'Government Administration'];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis type="number" dataKey="satisfaction" name="Satisfaction" domain={[40, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Satisfaction', position: 'insideBottom', offset: -5, fontSize: 12 }} />
        <YAxis type="number" dataKey="efficiency" name="Efficiency" domain={[40, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Efficiency', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12 }} />
        <ZAxis range={[60, 60]} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {sectors.map((sector, i) => (
          <Scatter
            key={sector}
            name={sector}
            data={scatterData.filter((d) => d.sector === sector)}
            fill={colors[i]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function FeatureImportanceChart({
  data,
  height = 300,
}: {
  data: { feature: string; importance: number }[];
  height?: number;
}) {
  const chartData = [...data].sort((a, b) => a.importance - b.importance);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
        <XAxis type="number" domain={[0, 0.3]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={130} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
        <Bar dataKey="importance" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function InputMetricsBarChart({
  data,
  height = 250,
}: {
  data: { label: string; value: number; normalized: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="label" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval={0} angle={-35} textAnchor="end" height={60} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
        <Bar dataKey="normalized" name="Score" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
