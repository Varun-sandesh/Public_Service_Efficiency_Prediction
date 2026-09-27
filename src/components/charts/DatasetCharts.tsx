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
import { SECTOR_COLORS, LEVEL_COLORS } from '@/services/dataAnalysisService';

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

const SECTOR_LIST = ['Healthcare', 'Education', 'Transportation', 'Government Administration'];

export function DatasetSectorBarChart({
  data,
  height = 300,
}: {
  data: { sector: string; efficiency: number; count: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="sector" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="efficiency" name="Efficiency %" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DatasetDistributionPieChart({
  data,
  height = 300,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DatasetTrendLineChart({
  data,
  height = 300,
}: {
  data: { period: string; efficiency: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="efficiency" name="Efficiency" stroke={CHART_COLORS.primary} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DatasetFactorRadarChart({
  data,
  height = 300,
}: {
  data: { factor: string; value: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <Radar name="Performance" dataKey="value" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.3} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function DatasetResponseTimeScatter({
  data,
  height = 300,
}: {
  data: { responseTime: number; efficiency: number; sector: string }[];
  height?: number;
}) {
  const colors = [CHART_COLORS.green, CHART_COLORS.cyan, CHART_COLORS.amber, CHART_COLORS.purple];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis type="number" dataKey="responseTime" name="Response Time (hrs)" domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Response Time (hrs)', position: 'insideBottom', offset: -5, fontSize: 12 }} />
        <YAxis type="number" dataKey="efficiency" name="Efficiency" domain={[40, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Efficiency', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12 }} />
        <ZAxis range={[60, 60]} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {SECTOR_LIST.map((sector, i) => (
          <Scatter key={sector} name={sector} data={data.filter((d) => d.sector === sector)} fill={colors[i]} />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function DatasetComplaintsScatter({
  data,
  height = 300,
}: {
  data: { complaints: number; efficiency: number; sector: string }[];
  height?: number;
}) {
  const colors = [CHART_COLORS.green, CHART_COLORS.cyan, CHART_COLORS.amber, CHART_COLORS.purple];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis type="number" dataKey="complaints" name="Complaints" domain={[0, 350]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Complaints', position: 'insideBottom', offset: -5, fontSize: 12 }} />
        <YAxis type="number" dataKey="efficiency" name="Efficiency" domain={[40, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Efficiency', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12 }} />
        <ZAxis range={[60, 60]} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {SECTOR_LIST.map((sector, i) => (
          <Scatter key={sector} name={sector} data={data.filter((d) => d.sector === sector)} fill={colors[i]} />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function FeatureDistributionChart({
  data,
  height = 250,
}: {
  data: { bin: string; count: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
        <Bar dataKey="count" name="Frequency" fill={CHART_COLORS.cyan} radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export { SECTOR_COLORS, LEVEL_COLORS };
