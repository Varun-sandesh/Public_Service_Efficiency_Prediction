# Backend Integration Guide

This document explains how to connect a Python FastAPI backend and database
to the Public Service AI frontend.

---

## Architecture Overview

```
Frontend (React + Vite)
    │
    ├── src/lib/api/config.ts    ← API base URL, mock toggle, endpoint paths
    ├── src/lib/api/client.ts   ← fetch() wrapper with auth, timeout, error handling
    ├── src/lib/api/types.ts     ← Request/response TypeScript interfaces
    ├── src/lib/api/index.ts     ← Re-exports for clean imports
    │
    ├── src/services/predictionService.ts   ← Manual prediction (uses API client)
    └── src/services/dataAnalysisService.ts  ← Dataset upload/analysis (uses API client)
    │
    ↓
Python FastAPI Backend
    │
    ├── /api/predict          ← POST: manual prediction
    ├── /api/upload           ← POST: file upload (multipart/form-data)
    ├── /api/analyze-file     ← POST: analyze uploaded dataset
    ├── /api/dataset/{id}     ← GET:  retrieve dataset + results
    ├── /api/model/metrics    ← GET:  model performance metrics
    └── /api/model/info       ← GET:  model metadata
```

---

## How the Frontend Decides: Mock vs Real API

The frontend reads two environment variables:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `""` (empty) | Base URL of your backend, e.g. `http://localhost:8000` |
| `VITE_USE_MOCK_API` | `"true"` | When `"false"`, the app calls your real backend |

**While developing the frontend only**, the app uses built-in mock data.
No backend is needed. All mock logic is clearly marked inside the service files.

When you set `VITE_USE_MOCK_API=false`, the service files automatically
route requests through `apiClient` to your FastAPI backend. No component
or page changes are needed.

---

## Step-by-Step: Connecting Your FastAPI Backend

### 1. Create a `.env` file in the project root

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_API=false
```

### 2. Create your FastAPI backend

Here is a minimal example structure:

```
backend/
├── main.py              ← FastAPI app entry point
├── requirements.txt     ← Python dependencies
├── routers/
│   ├── predict.py       ← /api/predict
│   ├── upload.py        ← /api/upload
│   ├── analyze.py       ← /api/analyze-file
│   └── model.py         ← /api/model/*
├── services/
│   ├── ml_model.py       ← Your AI/ML model logic
│   ├── file_parser.py   ← CSV/Excel/PDF parsing
│   └── data_cleaner.py  ← Data cleaning + quality analysis
└── database/
    └── db.py            ← Database connection (PostgreSQL, etc.)
```

### 3. Minimal FastAPI example (`main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Public Service AI Backend")

# CORS — allow the frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from routers import predict, upload, analyze, model
app.include_router(predict.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(model.router, prefix="/api")
```

### 4. Prediction endpoint example (`routers/predict.py`)

```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PredictInput(BaseModel):
    serviceSector: str
    serviceName: str
    citizenSatisfaction: float
    averageResponseTime: float
    resourceUtilization: float
    budgetUtilization: float
    staffAvailability: float
    serviceAccessibility: float
    numberOfComplaints: int
    digitalServiceAvailability: float
    serviceCoverageArea: str | None = None
    populationServed: int | None = None

class PredictRequest(BaseModel):
    input: PredictInput

@router.post("/predict")
async def predict(request: PredictRequest):
    # Call your ML model here
    result = run_model(request.input)
    return result  # Must match PredictResponse type
```

### 5. File upload endpoint example (`routers/upload.py`)

```python
from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save file, return file ID
    file_id = save_uploaded_file(file)
    return {
        "fileId": file_id,
        "fileName": file.filename,
        "fileType": file.filename.split(".")[-1],
        "fileSize": 0,  # calculate from saved file
        "uploadedAt": "2026-01-01T00:00:00Z"
    }
```

### 6. Analyze endpoint example (`routers/analyze.py`)

```python
@router.post("/analyze-file")
async def analyze_file(request: AnalyzeFileRequest):
    # Parse file, detect columns, run quality analysis
    analysis = parse_and_analyze(request.fileId, request.mapping)
    return analysis  # Must match AnalyzeFileResponse type
```

---

## API Response Types

The frontend expects responses matching the TypeScript interfaces in
`src/lib/api/types.ts`. Key types:

### PredictResponse → `POST /api/predict`
Returns a `PredictionResult` object with:
- `id`, `efficiencyScore`, `efficiencyLevel`, `confidence`
- `inputMetrics`, `positiveFactors`, `improvementAreas`
- `featureImportance`, `recommendations`, `createdAt`, `input`

### AnalyzeFileResponse → `POST /api/analyze-file`
Returns a `DatasetAnalysis` object with:
- `metadata` (fileName, fileType, rowCount, columnCount, columns)
- `quality` (totalRecords, missingValues, qualityLevel, columnSummaries)
- `previewRows` (array of row objects)
- `sectorComparison`, `efficiencyDistribution`, `performanceTrend`
- `factorRadar`, `responseTimeScatter`, `complaintsScatter`
- `numericFeatures`, `insights`

### DatasetPredictResponse → `POST /api/predict` (dataset variant)
Returns a `DatasetPredictionResult` object with:
- `efficiencyScore`, `efficiencyLevel`, `confidence`
- `recordsAnalyzed`, `averageEfficiency`
- `bestSector`, `lowestSector`, `featureImportance`
- `strengths`, `improvementAreas`, `recommendations`

---

## Adding AI/ML Models

Your Python backend can use any ML library. The frontend does not
dictate which models to use — it simply sends data and displays results.

Recommended Python libraries:
- **scikit-learn** — classical ML models (regression, decision trees, etc.)
- **TensorFlow / PyTorch** — deep learning models
- **pandas** — data manipulation and analysis
- **openpyxl / python-docx** — Excel/PDF file parsing

Your model training and inference code lives entirely in the backend.
The frontend only sends input data and receives prediction results.

---

## Adding a Database

The frontend currently uses `localStorage` for prediction history and
dataset session history. To add a real database:

1. Set up PostgreSQL (or any database) in your FastAPI backend
2. Create tables for predictions, datasets, and users
3. Add API endpoints for CRUD operations
4. Update the frontend service files to call these endpoints
   instead of using `localStorage`

The service files already have clearly marked sections:
- `predictionService.ts` → `LOCAL STORAGE PERSISTENCE` section
- `dataAnalysisService.ts` → `LOCAL STORAGE - DATASET HISTORY` section

Replace the `localStorage` calls in those sections with `apiClient` calls.

---

## CORS Configuration

Your FastAPI backend must allow requests from the frontend origin.
In development, the Vite dev server runs on `http://localhost:5173`.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## File Structure Summary

```
src/
├── lib/api/
│   ├── config.ts        ← API URL, mock toggle, endpoint paths
│   ├── client.ts        ← fetch() wrapper (GET, POST, PUT, DELETE, upload)
│   ├── types.ts         ← API request/response TypeScript interfaces
│   └── index.ts         ← Re-exports everything
├── services/
│   ├── predictionService.ts     ← Manual prediction logic + API calls
│   └── dataAnalysisService.ts   ← Dataset analysis logic + API calls
├── types/
│   └── index.ts                ← App-level TypeScript types
└── pages/
    ├── PredictPage.tsx          ← Method selection (manual vs upload)
    ├── UploadDatasetPage.tsx    ← Full dataset upload workflow
    └── ...
```
