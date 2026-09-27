import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Activity,
  Database,
  LineChart,
  Lightbulb,
  Heart,
  GraduationCap,
  Bus,
  Building2,
  Zap,
  Target,
  TrendingUp,
  Gauge,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCountUp, useInView } from '@/hooks/useCountUp';

const stats = [
  { label: 'Prediction Accuracy', value: 95, suffix: '%' },
  { label: 'Records Analyzed', value: 10000, suffix: '+' },
  { label: 'Service Sectors', value: 4, suffix: '' },
  { label: 'Real-Time Insights', value: 24, suffix: '/7' },
];

const steps = [
  { icon: Database, title: 'Collect Data', description: 'Gather historical public service performance data across sectors.' },
  { icon: Activity, title: 'Analyze Factors', description: 'Identify and analyze key performance factors influencing efficiency.' },
  { icon: Cpu, title: 'AI/ML Prediction', description: 'Machine learning models predict efficiency scores from input features.' },
  { icon: Lightbulb, title: 'Generate Insights', description: 'Produce actionable recommendations and data-driven insights.' },
];

const sectors = [
  {
    icon: Heart,
    name: 'Healthcare',
    color: 'from-rose-500 to-red-500',
    description: 'Patient satisfaction, waiting times, staff availability, and resource utilization.',
    metrics: ['Patient Satisfaction: 84%', 'Avg Waiting Time: 3.2 hrs', 'Staff Availability: 76%'],
  },
  {
    icon: GraduationCap,
    name: 'Education',
    color: 'from-blue-500 to-cyan-500',
    description: 'Student satisfaction, teacher availability, infrastructure, and digital access.',
    metrics: ['Student Satisfaction: 88%', 'Teacher Availability: 82%', 'Digital Access: 80%'],
  },
  {
    icon: Bus,
    name: 'Transportation',
    color: 'from-amber-500 to-orange-500',
    description: 'On-time performance, passenger satisfaction, coverage, and resource use.',
    metrics: ['On-Time Performance: 74%', 'Passenger Satisfaction: 71%', 'Service Coverage: 69%'],
  },
  {
    icon: Building2,
    name: 'Government Administration',
    color: 'from-violet-500 to-purple-500',
    description: 'Complaint resolution, citizen satisfaction, digital services, and staff efficiency.',
    metrics: ['Complaint Resolution: 4.1 hrs', 'Citizen Satisfaction: 76%', 'Digital Services: 85%'],
  },
];

const features = [
  { icon: Zap, title: 'Faster Analysis', description: 'Process thousands of records in seconds with AI-powered analysis.' },
  { icon: Target, title: 'Better Predictions', description: 'ML models achieve up to 95% accuracy in efficiency prediction.' },
  { icon: TrendingUp, title: 'Resource Optimization', description: 'Identify underutilized resources and optimize allocation strategies.' },
  { icon: Gauge, title: 'Data-Driven Decisions', description: 'Support policy decisions with predictive insights and evidence.' },
];

function StatCard({ stat, start }: { stat: (typeof stats)[number]; start: boolean }) {
  const count = useCountUp(stat.value, 2000, start);
  const display = stat.value >= 1000 ? `${Math.floor(count).toLocaleString()}` : `${Math.floor(count)}`;
  return (
    <div className="text-center">
      <div className="text-3xl font-bold gradient-text sm:text-4xl">
        {display}{stat.suffix}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}

export default function HomePage() {
  const [statsRef, statsInView] = useInView<HTMLDivElement>();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse-glow" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-5 gap-1.5 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Analytics Platform
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Predict. Analyze. <span className="gradient-text">Improve Public Services</span> with AI.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-balance max-w-xl mx-auto lg:mx-0">
                Use Artificial Intelligence and Machine Learning to analyze public service
                performance, predict efficiency, identify critical factors, and support smarter
                data-driven decision-making.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center lg:justify-start">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link to="/predict">
                    <Brain className="mr-2 h-5 w-5" />
                    Predict Efficiency
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                  <Link to="/dashboard">
                    <LineChart className="mr-2 h-5 w-5" />
                    Explore Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: visual */}
            <div className="relative hidden lg:block">
              <div className="relative h-[420px]">
                {/* Floating cards */}
                <Card className="absolute top-0 left-0 w-56 animate-float glass shadow-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                        <Activity className="h-4 w-4" />
                      </div>
                      Efficiency Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold gradient-text">82.5</div>
                    <p className="text-xs text-muted-foreground mt-1">High efficiency level</p>
                  </CardContent>
                </Card>

                <Card className="absolute top-32 right-0 w-52 animate-float-delayed glass shadow-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-1 h-16">
                      {[40, 55, 48, 65, 72, 80, 85].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-blue-500 to-cyan-400"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute bottom-0 left-8 w-60 animate-float glass shadow-xl" style={{ animationDelay: '1s' }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                        <Cpu className="h-4 w-4" />
                      </div>
                      AI Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-semibold">91%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '91%' }} />
                      </div>
                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-semibold">Decision Tree</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Neural network pattern */}
                <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 400">
                  <g stroke="currentColor" strokeWidth="1" fill="none" className="text-blue-500">
                    <circle cx="50" cy="100" r="6" fill="currentColor" />
                    <circle cx="50" cy="200" r="6" fill="currentColor" />
                    <circle cx="50" cy="300" r="6" fill="currentColor" />
                    <circle cx="200" cy="80" r="6" fill="currentColor" />
                    <circle cx="200" cy="200" r="6" fill="currentColor" />
                    <circle cx="200" cy="320" r="6" fill="currentColor" />
                    <circle cx="350" cy="150" r="6" fill="currentColor" />
                    <circle cx="350" cy="250" r="6" fill="currentColor" />
                    <line x1="56" y1="100" x2="194" y2="80" />
                    <line x1="56" y1="100" x2="194" y2="200" />
                    <line x1="56" y1="200" x2="194" y2="80" />
                    <line x1="56" y1="200" x2="194" y2="200" />
                    <line x1="56" y1="200" x2="194" y2="320" />
                    <line x1="56" y1="300" x2="194" y2="200" />
                    <line x1="56" y1="300" x2="194" y2="320" />
                    <line x1="206" y1="80" x2="344" y2="150" />
                    <line x1="206" y1="200" x2="344" y2="150" />
                    <line x1="206" y1="200" x2="344" y2="250" />
                    <line x1="206" y1="320" x2="344" y2="250" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="border-y bg-card/50">
        <div ref={statsRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} start={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-3">Process</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            From raw data to actionable insights in four steps.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground mb-2">STEP {i + 1}</div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Service Sectors */}
      <section className="bg-card/50 border-y">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">Sectors</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Supported Service Sectors</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Analyzing efficiency across four critical public service domains.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector) => (
              <Card key={sector.name} className="h-full transition-all hover:shadow-lg hover:-translate-y-1 group">
                <CardContent className="pt-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${sector.color} text-white mb-4`}>
                    <sector.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{sector.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sector.description}</p>
                  <div className="space-y-1.5 mb-4">
                    {sector.metrics.map((m) => (
                      <div key={m} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        {m}
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full group-hover:border-primary/40">
                    <Link to={`/analytics?sector=${encodeURIComponent(sector.name)}`}>
                      View Analytics
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use AI */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-3">Benefits</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Use AI?</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Transform public service management with artificial intelligence.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Make Public Services More Efficient?
          </h2>
          <p className="mt-4 text-blue-50 text-lg max-w-2xl mx-auto">
            Start predicting service efficiency with AI and unlock data-driven insights today.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
            <Link to="/predict">
              <Brain className="mr-2 h-5 w-5" />
              Start Predicting
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
