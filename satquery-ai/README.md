# SatQuery AI

**Ask Questions. Understand Earth.**  
*An Interactive Vision-Language Assistant for Multimodal Remote-Sensing Image Analysis through Text Queries.*

SatQuery AI is a production-grade, agentic Earth observation platform that empowers users to upload remote-sensing imagery and ask natural-language questions. The system autonomously interprets queries, validates sensor configurations, selects specialist computer vision and deep learning models, executes analysis pipelines, and synthesizes evidence-grounded, confidence-scored, auditable answers with pixel-level overlays and complete execution traces.

---

## 1. Project Overview

Traditional remote-sensing workflows are fragmented across isolated tools for land-cover classification, change detection, VQA, captioning, and SAR processing — each requiring GIS expertise, band knowledge, and complex manual orchestration. 

**SatQuery AI** unifies these capabilities into an agentic natural-language interface:
* **Natural-Language Understanding:** Ask questions in plain English without knowing spectral bands or GIS commands.
* **Autonomous Task Routing:** Intelligent classification routes requests to dedicated specialist models (VQA, Grounding, Captioning, Change Detection, Optical-SAR Fusion).
* **Cross-Modal Sensor Fusion:** Pairs optical multispectral imagery with cloud-penetrating Synthetic Aperture Radar (SAR).
* **Transparent & Auditable:** Every insight includes mathematically grounded confidence scores, pixel heatmaps/bounding masks, and an inspectable execution trace.

---

## 2. Problem Statement & Solution

* **The Problem:** Non-expert users (disaster response teams, urban planners, environmental monitors, agricultural analysts) struggle with complex GIS software, sensor calibration, band combinations, and domain-specific AI models.
* **The Solution:** An agentic assistant where users provide imagery and questions in natural language. SatQuery AI inspects input data, executes validated specialist models, and produces explanations backed by verifiable visual evidence.

---

## 3. Core Architecture

```
User Query + Satellite Imagery
              |
    Query Understanding Agent
              |
       Input Validator  (CRS, metadata, spectral bands)
              |
        Task Router  ───────────────► Specialist Model Registry
              |                                    |
              ├───────────┬───────────┬────────────┴───────────┬──────────────┐
             VQA      Grounding   Captioning             Bi-Temporal     Optical-SAR
          Specialist   Engine       Module                 Change          Fusion
              └───────────┴───────────┴────────────┬───────────┴──────────────┘
                                                   |
                                           Evidence Validator
                                                   |
                                         Response Synthesizer
                                                   |
              Text Answer + Visual Evidence Overlays + Confidence Score + Execution Trace + PDF Report
```

---

## 4. Key Capabilities & Application Modules

SatQuery AI features a streamlined, modular navigation structure:

1. **Dashboard (`/dashboard`)**
   * Overview of platform analytics, scene ingestion metrics, latency benchmarks, and recent analysis history.
   * Quick access to start new investigations and inspect previous agent traces.

2. **Analyze (`/analyze`)**
   * Single-scene remote sensing intelligence.
   * Visual Question Answering (VQA), scene captioning, text-guided bounding box grounding, and zero-shot feature detection.

3. **Change Detection (`/change-detection`)**
   * Bi-temporal remote sensing analysis between two acquisition dates.
   * Segment and quantify surface divergence, urban expansion, deforestation, and water body shrinkage.

4. **Optical + SAR (`/optical-sar`)**
   * Cross-modal fusion combining optical multispectral data with all-weather C-band Synthetic Aperture Radar.
   * Pierces cloud cover, smoke, and nocturnal darkness to detect flood extents, ships, and structural features.

5. **Mission Mode (`/missions`)**
   * Autonomous, multi-phase investigation pipelines for real-world scenarios (flood assessment, wildfire tracking, urban growth).
   * Generates downloadable, publication-ready PDF intelligence reports.

6. **History (`/history`)**
   * Full session archive with SQLite persistence.
   * Re-examine past queries, inspect confidence breakdowns, download visual overlays, and review auditable decision logs.

---

## 5. Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, React Router.
* **Backend:** Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy, SQLite, Uvicorn.
* **Geospatial & Vision:** OpenCV (`cv2`), NumPy, Pillow, Rasterio (GDAL-backed GeoTIFF I/O), Scikit-Learn.
* **Deep Learning & Training:** PyTorch training harness with BigEarthNet domain adaptation pipelines.
* **Reporting:** ReportLab (automated PDF report generation).

---

## 6. Getting Started

### Prerequisites

* Python 3.10 or higher
* Node.js 18+ and npm
* (Optional) Docker & Docker Compose

### 1. Clone & Setup Environment

```bash
git clone <repository-url>
cd satquery-ai
cp .env.example .env
```

### 2. Backend Setup & Run

Open a terminal:

```bash
cd backend

# Create and activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server with live reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

* **API Server:** `http://localhost:8000`
* **Interactive OpenAPI Docs:** `http://localhost:8000/docs`
* **Health Check:** `http://localhost:8000/api/health`

### 3. Frontend Setup & Run

Open a second terminal:

```bash
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

* **Web UI:** `http://localhost:5173`
* The frontend automatically proxies API requests (`/api/*`) to `http://localhost:8000`.

---

## 7. Vercel Deployment (Frontend)

The frontend is specifically configured for seamless deployment on Vercel:

1. **Import the repository into Vercel**.
2. **Project Settings**:
   * **Root Directory**: `satquery-ai/frontend` (or leave default `.` as the root `vercel.json` will automatically build the frontend).
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. **Environment Variables**:
   * Add `VITE_API_BASE_URL` pointing to your deployed FastAPI backend (e.g. `https://your-backend.railway.app` or `https://your-backend.onrender.com`).
   * For local development, leave this empty to use the Vite dev proxy.

Client-side SPA routes (e.g., `/analyze`, `/dashboard`, `/missions`) will automatically rewrite to `/index.html` via `vercel.json`.

---

## 8. Containerized Deployment (Docker)

To run the entire platform with Docker Compose:

```bash
docker compose up --build
```

* **Frontend UI:** `http://localhost:5173`
* **Backend API:** `http://localhost:8000`

---

## 9. Configuration (`.env`)

All platform parameters are configured via environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `SATQUERY_UPLOAD_DIR` | `./uploads` | Storage directory for uploaded images and generated overlays |
| `SATQUERY_REPORTS_DIR` | `./reports_out` | Storage directory for generated PDF mission reports |
| `SATQUERY_DB_PATH` | `./satquery.db` | SQLite database path for session history |
| `SATQUERY_INFERENCE_MODE` | `fallback` | Model mode: `fallback` (classical CV heuristics) or `checkpoint` (trained models) |
| `SATQUERY_CORS_ORIGINS` | `http://localhost:5173` | Allowed CORS origins for frontend access |

---

## 10. API Reference

Interactive Swagger documentation is available at `http://localhost:8000/docs`. Key REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload and validate single or multi-modal imagery, extract geospatial metadata |
| `POST` | `/api/analyze` | Core agentic analysis endpoint executing autonomous task routing and synthesis |
| `POST` | `/api/analyze/region-followup` | Interactive localized drill-down on result masks |
| `POST` | `/api/analyze/vqa` | Direct VQA specialist endpoint |
| `POST` | `/api/analyze/change` | Bi-temporal change detection and quantification |
| `POST` | `/api/analyze/optical-sar` | Optical-SAR cross-modal fusion pipeline |
| `GET` | `/api/history` | Retrieve historical analysis sessions |
| `GET` | `/api/history/{id}` | Retrieve individual session details with full execution trace |
| `POST` | `/api/reports/{id}` | Generate and download publication-ready PDF intelligence report |
| `GET` | `/api/models` | List active models and specialist tool registry |
| `GET` | `/api/health` | Service health and active configuration status |

---

## 11. Repository Structure

```
satquery-ai-final/
├── satquery-ai/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── main.py              # FastAPI application entry point
│   │   │   ├── core_config.py       # Configuration and environment variables
│   │   │   ├── agents/              # Orchestrator, task classifier, confidence engine
│   │   │   ├── api/                 # REST API route handlers
│   │   │   ├── db/                  # SQLAlchemy models and SQLite session setup
│   │   │   ├── evaluation/          # Benchmark evaluation runners
│   │   │   ├── models/              # Model registry and metadata
│   │   │   ├── schemas/             # Pydantic request and response schemas
│   │   │   ├── services/            # Upload, history, and report generation services
│   │   │   └── tools/               # Geospatial I/O, fallback CV engines, SAR processing
│   │   ├── requirements.txt         # Python dependencies
│   │   └── tests/                   # Backend unit and integration tests
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/          # Reusable UI cards, space visuals, and primitives
│   │   │   ├── layouts/             # AppLayout navigation and footer
│   │   │   ├── pages/               # Dashboard, Analyze, Missions, History, etc.
│   │   │   ├── services/            # API client with dynamic backend resolution
│   │   │   └── types/               # TypeScript data interfaces
│   │   ├── .env.example             # Frontend environment variable template
│   │   ├── package.json             # Frontend dependencies and scripts
│   │   ├── vercel.json              # Vercel SPA routing rewrites
│   │   └── vite.config.ts           # Vite build configuration and proxy rules
│   ├── training/                    # BigEarthNet dataset loader and training scripts
│   ├── data/                        # Benchmark documentation and sample datasets
│   ├── models/                      # Checkpoint directory for trained weights
│   ├── docker-compose.yml           # Multi-container orchestration
│   └── README.md                    # Project documentation
├── vercel.json                      # Root-level Vercel configuration fallback
└── .gitignore                       # Repository-wide ignore rules
```

---

## 12. Ethical AI & Transparency

* **Honest Attribution:** Specialist vision tasks run on verifiable fallback heuristic algorithms unless dedicated PyTorch checkpoints are explicitly provided, clearly labeled across UI badges, API responses, and generated PDF reports.
* **No Fabricated Benchmarks:** Evaluation modules clearly distinguish synthetic verification from benchmark dataset evaluations.
* **Auditable Insights:** Confidence scores are computed through calibrated mathematical weighting rather than arbitrary stochastic values, accompanied by full execution traces.
