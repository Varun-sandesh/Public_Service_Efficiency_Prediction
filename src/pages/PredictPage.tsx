import { useState } from 'react';
import { Sliders, Upload, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import ManualPredictionForm from '@/components/predictions/ManualPredictionForm';
import UploadDatasetPage from '@/pages/UploadDatasetPage';

type Method = 'manual' | 'upload';

export default function PredictPage() {
  const [method, setMethod] = useState<Method>('manual');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Efficiency Prediction</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Choose a prediction method to analyze public service efficiency using AI and Machine Learning.
        </p>
      </div>

      {/* Method Selection Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setMethod('manual')}
          className={cn(
            'group flex flex-col items-start rounded-xl border-2 p-5 text-left transition-all hover:shadow-lg',
            method === 'manual'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/40'
          )}
        >
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            method === 'manual' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
          )}>
            <Sliders className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-semibold text-lg">Manual Input</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Enter public service performance metrics manually to generate an AI-based efficiency prediction.
          </p>
          <span className={cn(
            'mt-3 text-sm font-medium transition-colors',
            method === 'manual' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          )}>
            Enter Metrics Manually →
          </span>
        </button>

        <button
          onClick={() => setMethod('upload')}
          className={cn(
            'group flex flex-col items-start rounded-xl border-2 p-5 text-left transition-all hover:shadow-lg',
            method === 'upload'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/40'
          )}
        >
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            method === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
          )}>
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-semibold text-lg">Upload Dataset</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your public service dataset and let the system automatically analyze the data, generate insights,
            visualize trends, and prepare it for AI-based efficiency prediction.
          </p>
          <span className={cn(
            'mt-3 text-sm font-medium transition-colors',
            method === 'upload' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          )}>
            Upload Dataset →
          </span>
        </button>
      </div>

      {/* Method Content */}
      {method === 'manual' ? <ManualPredictionForm /> : <UploadDatasetPage />}
    </div>
  );
}
