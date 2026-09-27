import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from '@/components/layouts/Layout';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import PredictPage from '@/pages/PredictPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ServicesPage from '@/pages/ServicesPage';
import ModelInsightsPage from '@/pages/ModelInsightsPage';
import AboutPage from '@/pages/AboutPage';
import ComingSoonPage from '@/pages/ComingSoonPage';

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/model-insights" element={<ModelInsightsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<ComingSoonPage />} />
            <Route path="/terms" element={<ComingSoonPage />} />
            <Route path="/contact" element={<ComingSoonPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
