import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Predict', path: '/predict' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Services', path: '/services' },
  { label: 'Model Insights', path: '/model-insights' },
  { label: 'About', path: '/about' },
];

const additionalLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms and Conditions', path: '/terms' },
  { label: 'Contact Us', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Public Service AI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              AI-Powered Public Service Efficiency Prediction and Analytics Platform.
              Analyzing performance, predicting efficiency, and supporting smarter
              data-driven decision-making.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
                >
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">More</h4>
            <ul className="space-y-2">
              {additionalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Public Service AI. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
