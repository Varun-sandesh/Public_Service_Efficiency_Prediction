import { Link, useLocation } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const pageTitles: Record<string, string> = {
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms and Conditions',
  '/contact': 'Contact Us',
};

export default function ComingSoonPage() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Coming Soon';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-12 pb-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-6">
              <Construction className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-3 text-muted-foreground">
              Content will be added soon. This page is under construction.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
