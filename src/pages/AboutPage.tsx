import { Link } from 'react-router-dom';
import {
  Brain,
  Target,
  Cpu,
  Code2,
  BarChart3,
  Users,
  Globe2,
  Building2,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { teamMembers } from '@/data/mockData';

const objectives = [
  'Develop an AI-based efficiency prediction model for public services.',
  'Analyze factors affecting service performance across different sectors.',
  'Improve prediction accuracy using Machine Learning algorithms.',
  'Support better decision-making through predictive insights and recommendations.',
];

const sdgs = [
  {
    number: 9,
    title: 'Industry, Innovation and Infrastructure',
    description: 'The project promotes innovation in public service delivery through AI-driven analytics and modern infrastructure for data-driven governance.',
    icon: Building2,
    color: 'from-orange-500 to-amber-500',
  },
  {
    number: 11,
    title: 'Sustainable Cities and Communities',
    description: 'By improving public service efficiency, the platform contributes to building more sustainable and responsive urban communities.',
    icon: Globe2,
    color: 'from-green-500 to-emerald-500',
  },
  {
    number: 16,
    title: 'Peace, Justice and Strong Institutions',
    description: 'AI-powered efficiency prediction strengthens public institutions by enabling transparent, accountable, and effective service delivery.',
    icon: Scale,
    color: 'from-blue-500 to-indigo-500',
  },
];

const frontendTech = [
  { name: 'React', icon: Code2 },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Tailwind CSS', icon: BarChart3 },
  { name: 'Recharts', icon: BarChart3 },
];

const backendTech = [
  { name: 'Python', icon: Cpu },
  { name: 'FastAPI / Flask', icon: Cpu },
  { name: 'Scikit-learn', icon: Brain },
  { name: 'Pandas', icon: BarChart3 },
  { name: 'NumPy', icon: BarChart3 },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          About the Project
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Public Service AI</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-balance">
          AI-Powered Public Service Efficiency Prediction and Analytics Platform
        </p>
      </div>

      {/* Project Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            This project uses Artificial Intelligence and Machine Learning to analyze historical
            public service performance data and predict the efficiency of public services. By
            examining key performance factors such as citizen satisfaction, response time, resource
            utilization, and staff availability, the system can estimate how efficiently a public
            service is operating and provide actionable recommendations for improvement.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            The platform is designed as a B.Tech capstone project that demonstrates the practical
            application of AI/ML in the public sector, bridging the gap between data science and
            governance to support smarter, data-driven decision-making.
          </p>
        </CardContent>
      </Card>

      {/* Objectives */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Project Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm">{obj}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SDGs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">SDGs Covered</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {sdgs.map((sdg) => (
            <Card key={sdg.number} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className={`h-2 bg-gradient-to-r ${sdg.color}`} />
              <CardContent className="pt-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${sdg.color} text-white mb-4`}>
                  <sdg.icon className="h-7 w-7" />
                </div>
                <Badge variant="secondary" className="mb-2">SDG {sdg.number}</Badge>
                <h3 className="font-semibold text-lg mb-2">{sdg.title}</h3>
                <p className="text-sm text-muted-foreground">{sdg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
          <CardDescription>Frontend (implemented) and backend/ML (planned)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Currently Implemented (Frontend)
              </h3>
              <div className="flex flex-wrap gap-2">
                {frontendTech.map((tech) => (
                  <Badge key={tech.name} variant="secondary" className="gap-1.5 py-1.5 px-3">
                    <tech.icon className="h-3.5 w-3.5" />
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Planned for Backend / ML Integration
              </h3>
              <div className="flex flex-wrap gap-2">
                {backendTech.map((tech) => (
                  <Badge key={tech.name} variant="outline" className="gap-1.5 py-1.5 px-3">
                    <tech.icon className="h-3.5 w-3.5" />
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team
          </CardTitle>
          <CardDescription>Meet the team behind the project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <div key={i} className="rounded-lg border p-5 text-center transition-all hover:shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xl font-bold mx-auto mb-3">
                  {member.name.charAt(member.name.length - 1)}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary font-medium mt-0.5">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.contribution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="overflow-hidden border-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <CardContent className="relative pt-10 pb-10 text-center">
            <h2 className="text-2xl font-bold text-white">Explore the Platform</h2>
            <p className="mt-2 text-blue-50">Start predicting public service efficiency with AI.</p>
            <Button asChild variant="secondary" size="lg" className="mt-6">
              <Link to="/predict">
                <Brain className="mr-2 h-5 w-5" />
                Start Predicting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
