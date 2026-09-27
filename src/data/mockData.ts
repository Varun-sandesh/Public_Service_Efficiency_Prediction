import type {
  MonthlyTrend,
  ModelMetric,
  SectorData,
  ServiceSector,
} from '@/types';

export const SERVICE_SECTORS: ServiceSector[] = [
  'Healthcare',
  'Education',
  'Transportation',
  'Government Administration',
];

export const monthlyTrends: MonthlyTrend[] = [
  { month: 'Jan', Healthcare: 72, Education: 78, Transportation: 65, Administration: 70, Overall: 71 },
  { month: 'Feb', Healthcare: 74, Education: 79, Transportation: 67, Administration: 71, Overall: 73 },
  { month: 'Mar', Healthcare: 73, Education: 81, Transportation: 66, Administration: 72, Overall: 73 },
  { month: 'Apr', Healthcare: 76, Education: 80, Transportation: 69, Administration: 73, Overall: 75 },
  { month: 'May', Healthcare: 78, Education: 82, Transportation: 71, Administration: 74, Overall: 76 },
  { month: 'Jun', Healthcare: 80, Education: 83, Transportation: 70, Administration: 75, Overall: 77 },
  { month: 'Jul', Healthcare: 79, Education: 84, Transportation: 72, Administration: 76, Overall: 78 },
  { month: 'Aug', Healthcare: 81, Education: 85, Transportation: 73, Administration: 77, Overall: 79 },
  { month: 'Sep', Healthcare: 83, Education: 86, Transportation: 74, Administration: 78, Overall: 80 },
  { month: 'Oct', Healthcare: 82, Education: 87, Transportation: 75, Administration: 79, Overall: 81 },
  { month: 'Nov', Healthcare: 84, Education: 88, Transportation: 77, Administration: 80, Overall: 82 },
  { month: 'Dec', Healthcare: 85, Education: 89, Transportation: 78, Administration: 81, Overall: 83 },
];

export const sectorData: SectorData[] = [
  {
    sector: 'Healthcare',
    efficiencyScore: 82,
    trend: 5.2,
    satisfaction: 84,
    responseTime: 3.2,
    resourceUtilization: 79,
    budgetUtilization: 88,
    staffAvailability: 76,
    accessibility: 81,
    complaints: 142,
    digitalAvailability: 72,
    challenges: [
      'High patient wait times during peak hours',
      'Shortage of specialized medical staff',
      'Increasing patient-to-doctor ratio',
    ],
    improvements: [
      'Implement AI-driven appointment scheduling',
      'Expand telemedicine services for remote areas',
      'Optimize staff shift allocation using predictive models',
    ],
    metrics: [
      { label: 'Patient Satisfaction', value: '84%', sub: '+3.2% vs last quarter' },
      { label: 'Avg Waiting Time', value: '3.2 hrs', sub: '-0.4 hrs improved' },
      { label: 'Staff Availability', value: '76%', sub: '-2% vs target' },
      { label: 'Resource Utilization', value: '79%', sub: '+5% vs last quarter' },
    ],
  },
  {
    sector: 'Education',
    efficiencyScore: 87,
    trend: 4.1,
    satisfaction: 88,
    responseTime: 1.8,
    resourceUtilization: 85,
    budgetUtilization: 91,
    staffAvailability: 82,
    accessibility: 86,
    complaints: 78,
    digitalAvailability: 80,
    challenges: [
      'Uneven distribution of teaching resources',
      'Limited digital infrastructure in rural schools',
      'High student-to-teacher ratio in urban areas',
    ],
    improvements: [
      'Deploy digital learning platforms across all districts',
      'Use predictive analytics for resource allocation',
      'Enhance teacher training programs with AI-assisted tools',
    ],
    metrics: [
      { label: 'Student Satisfaction', value: '88%', sub: '+2.1% vs last quarter' },
      { label: 'Teacher Availability', value: '82%', sub: '+1% vs last quarter' },
      { label: 'Infrastructure Utilization', value: '85%', sub: '+4% vs last quarter' },
      { label: 'Digital Access', value: '80%', sub: '+8% vs last quarter' },
    ],
  },
  {
    sector: 'Transportation',
    efficiencyScore: 74,
    trend: -1.3,
    satisfaction: 71,
    responseTime: 5.6,
    resourceUtilization: 68,
    budgetUtilization: 73,
    staffAvailability: 74,
    accessibility: 69,
    complaints: 256,
    digitalAvailability: 64,
    challenges: [
      'Frequent delays during peak commute hours',
      'Aging fleet infrastructure',
      'Limited route coverage in suburban areas',
    ],
    improvements: [
      'Implement real-time route optimization with AI',
      'Modernize fleet with predictive maintenance scheduling',
      'Expand digital ticketing and tracking systems',
    ],
    metrics: [
      { label: 'On-Time Performance', value: '74%', sub: '-1.3% vs last quarter' },
      { label: 'Passenger Satisfaction', value: '71%', sub: '-0.8% vs last quarter' },
      { label: 'Service Coverage', value: '69%', sub: '+2% vs last quarter' },
      { label: 'Resource Utilization', value: '68%', sub: '-3% vs last quarter' },
    ],
  },
  {
    sector: 'Government Administration',
    efficiencyScore: 79,
    trend: 3.5,
    satisfaction: 76,
    responseTime: 4.1,
    resourceUtilization: 82,
    budgetUtilization: 86,
    staffAvailability: 78,
    accessibility: 75,
    complaints: 198,
    digitalAvailability: 85,
    challenges: [
      'Lengthy document processing times',
      'High volume of citizen complaints',
      'Fragmented digital service portals',
    ],
    improvements: [
      'Deploy AI chatbots for citizen query resolution',
      'Centralize digital services into a unified portal',
      'Automate document verification workflows',
    ],
    metrics: [
      { label: 'Complaint Resolution Time', value: '4.1 hrs', sub: '-0.6 hrs improved' },
      { label: 'Citizen Satisfaction', value: '76%', sub: '+3.5% vs last quarter' },
      { label: 'Digital Service Availability', value: '85%', sub: '+6% vs last quarter' },
      { label: 'Staff Efficiency', value: '78%', sub: '+2% vs last quarter' },
    ],
  },
];

export const modelMetrics: ModelMetric[] = [
  { model: 'Linear Regression', mae: 8.2, rmse: 10.4, r2: 0.74, accuracy: 76 },
  { model: 'Decision Tree', mae: 5.1, rmse: 7.3, r2: 0.89, accuracy: 91 },
  { model: 'Neural Network', mae: 5.4, rmse: 7.8, r2: 0.87, accuracy: 89 },
];

export const featureImportanceData = [
  { feature: 'Citizen Satisfaction', importance: 0.24 },
  { feature: 'Resource Utilization', importance: 0.18 },
  { feature: 'Staff Availability', importance: 0.15 },
  { feature: 'Response Time', importance: 0.13 },
  { feature: 'Budget Utilization', importance: 0.11 },
  { feature: 'Digital Availability', importance: 0.09 },
  { feature: 'Accessibility', importance: 0.07 },
  { feature: 'Complaints', importance: 0.03 },
];

export const efficiencyDistribution = [
  { name: 'Excellent', value: 22, color: 'hsl(142 71% 45%)' },
  { name: 'High', value: 38, color: 'hsl(217 91% 60%)' },
  { name: 'Moderate', value: 28, color: 'hsl(38 92% 50%)' },
  { name: 'Low', value: 12, color: 'hsl(0 84% 60%)' },
];

export const radarData = [
  { factor: 'Satisfaction', Healthcare: 84, Education: 88, Transportation: 71, Administration: 76 },
  { factor: 'Response Time', Healthcare: 68, Education: 82, Transportation: 44, Administration: 59 },
  { factor: 'Resources', Healthcare: 79, Education: 85, Transportation: 68, Administration: 82 },
  { factor: 'Budget', Healthcare: 88, Education: 91, Transportation: 73, Administration: 86 },
  { factor: 'Staff', Healthcare: 76, Education: 82, Transportation: 74, Administration: 78 },
  { factor: 'Accessibility', Healthcare: 81, Education: 86, Transportation: 69, Administration: 75 },
  { factor: 'Digital', Healthcare: 72, Education: 80, Transportation: 64, Administration: 85 },
];

export const scatterData = sectorData.flatMap((s) =>
  Array.from({ length: 8 }, (_, i) => ({
    satisfaction: s.satisfaction + (Math.sin(i * 1.3) * 8),
    efficiency: s.efficiencyScore + (Math.cos(i * 1.7) * 7),
    sector: s.sector,
  }))
);

export const recentPredictions = [
  { id: 'PRD-2026-001', sector: 'Healthcare', score: 82.5, level: 'High', date: '2026-08-18', status: 'Completed' },
  { id: 'PRD-2026-002', sector: 'Education', score: 88.1, level: 'Excellent', date: '2026-08-17', status: 'Completed' },
  { id: 'PRD-2026-003', sector: 'Transportation', score: 71.3, level: 'Moderate', date: '2026-08-16', status: 'Completed' },
  { id: 'PRD-2026-004', sector: 'Government Administration', score: 79.8, level: 'High', date: '2026-08-15', status: 'Completed' },
  { id: 'PRD-2026-005', sector: 'Healthcare', score: 67.2, level: 'Moderate', date: '2026-08-14', status: 'Completed' },
  { id: 'PRD-2026-006', sector: 'Education', score: 91.4, level: 'Excellent', date: '2026-08-13', status: 'Completed' },
  { id: 'PRD-2026-007', sector: 'Transportation', score: 58.6, level: 'Low', date: '2026-08-12', status: 'Completed' },
  { id: 'PRD-2026-008', sector: 'Government Administration', score: 73.5, level: 'High', date: '2026-08-11', status: 'Completed' },
];

export const aiInsights = [
  {
    title: 'Healthcare efficiency rising',
    description: 'Healthcare efficiency increased by 8% this quarter, driven by improved resource utilization and digital service adoption.',
    type: 'positive' as const,
  },
  {
    title: 'Response time impacts transportation',
    description: 'Response time is strongly affecting transportation efficiency. Reducing average response time by 1 hour could improve efficiency by 6%.',
    type: 'warning' as const,
  },
  {
    title: 'Digital availability correlates with accessibility',
    description: 'Higher digital availability is associated with better accessibility scores across all sectors (r = 0.82).',
    type: 'info' as const,
  },
  {
    title: 'Education leads all sectors',
    description: 'Education maintains the highest efficiency score at 87, with strong performance in budget utilization and student satisfaction.',
    type: 'positive' as const,
  },
];

export const teamMembers = [
  { name: 'Team Member 1', role: 'ML Engineer', contribution: 'Model development, training, and evaluation using scikit-learn.' },
  { name: 'Team Member 2', role: 'Backend Developer', contribution: 'FastAPI backend, data pipelines, and API design.' },
  { name: 'Team Member 3', role: 'Frontend Developer', contribution: 'React dashboard, data visualization, and UI/UX design.' },
  { name: 'Team Member 4', role: 'Data Analyst', contribution: 'Data collection, cleaning, and feature engineering.' },
];
