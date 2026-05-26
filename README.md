# Nexora

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-emerald.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/PRs-welcome-emerald.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white" alt="Tailwind">
</div>

<br>

<p align="center">
  <b>An autonomous predictive analytics platform</b> that profiles datasets, builds optimized preprocessing pipelines, trains reproducible model registries, runs batch predictions, monitors feature drift, and provides grounded AI educational interactive chats — all from a single CSV upload.
</p>

---

## Live Deployments

| Component | URL | Host |
| :--- | :--- | :--- |
| **Frontend Web App** | [nexoraprediction.netlify.app](https://nexoraprediction.netlify.app/) | Netlify |
| **Backend API** | [nexora-360r.onrender.com](https://nexora-360r.onrender.com/) | Render |
| **API Documentation** | [nexora-360r.onrender.com/docs](https://nexora-360r.onrender.com/docs) | Render |

> **Note:** The backend API runs on Render's free tier and spins down after inactivity. Allow 30-60 seconds for the initial cold start when first loading or uploading data.

> **Note:** The Nexora-Helper (Ollama-powered learning assistant) requires a local Ollama instance and is only available when running the application locally. See [Local Development](#local-development) below for setup instructions.

---

## Features

### 1. Dataset Intelligence Engine
- **Automated CSV Validation** — Format checks, size limits, and file integrity verification.
- **Health Profiling** — Structural, statistical, and column-level quality scores generated automatically.
- **Preview and Distributions** — Real-time descriptive statistics and data balance diagnostics.

### 2. Dynamic Preprocessing Pipelines
- **Type Parsing** — Automatic distinction between numeric, categorical, datetime, and ID columns.
- **Intelligent Preprocessing** — Handles missing values, scaling, encoding, outlier detection, and duplicate removal.
- **Interactive Configuration** — Flexible controls to change prediction targets and override pipeline steps.

### 3. Prediction Studio and Benchmarking
- **256+ Model Registry** — Ensemble suite powered by Scikit-Learn, CatBoost, LightGBM, and XGBoost.
- **Training Pipeline** — Advanced cross-validation, train-test splitting, and hyperparameter scoring.
- **WebSocket Leaderboard** — Real-time training progress with interactive model comparison.
- **Comparison Arena** — Champion dashboards with live metrics, visual charts, and latency statistics.

### 4. Production Suite
- **API Endpoints** — Production-grade endpoints with API key authentication.
- **Batch Processing** — Upload a file and download enriched datasets with targeted predictions.
- **Drift Detection** — Automatic monitoring of feature and target distribution changes over time.
- **Local LLM Chat** — Educational assistant powered by Ollama and Phi-3 Mini, answering questions grounded in the dataset context.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, Axios, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic, Pandas, NumPy, Scikit-learn, CatBoost, LightGBM, XGBoost |
| **Database** | MongoDB Atlas |
| **Local LLM** | Ollama Engine (Phi-3 Mini) |
| **Infrastructure** | Netlify (Frontend), Render (Backend) |

---

## Local Development

### Prerequisites

| Requirement | Version |
| :--- | :--- |
| Python | 3.10 or higher |
| Node.js | 18 or higher |
| Ollama | Latest *(optional, for educational chat)* |

### 1. Clone the Repository

```bash
git clone https://github.com/jeet2005/Nexora.git
cd Nexora
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python run.py
```

The API will be available at `http://127.0.0.1:8000` with interactive documentation at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The React frontend will be available at `http://localhost:5173`.

### 4. Ollama Setup (Optional)

To enable the Nexora-Helper learning assistant:

```bash
# Install Ollama from https://ollama.ai/

# Pull the Phi-3 Mini model
ollama pull phi3:mini

# Ollama runs automatically on http://127.0.0.1:11434
```

When running locally, the chat assistant will use your local Ollama instance for advanced open-ended explanations. CSV fact queries and workflow guidance work without Ollama.

---

## Production Configuration

### Netlify (Frontend)

Set the following environment variable in the Netlify dashboard or in `netlify.toml`:

```ini
VITE_API_BASE_URL=https://nexora-360r.onrender.com/api
```

### Render (Backend)

Set the following environment variables in the Render Web Service configuration:

```ini
PUBLIC_API_URL=https://nexora-360r.onrender.com
PUBLIC_APP_URL=https://nexoraprediction.netlify.app
CORS_ORIGINS=["https://nexoraprediction.netlify.app"]
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=phi3:mini
PERSISTENCE_BACKEND=mongodb
MONGODB_URI=<your_mongodb_connection_string>
```

---

## Project Structure

```text
nexora/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── models/           # Database schemas and ML pipeline definitions
│   │   ├── routers/          # API route controllers
│   │   ├── services/         # ML engine logic and data processing
│   │   ├── config.py         # Application configuration
│   │   └── main.py           # Application entrypoint
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # Server launch script
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/              # Axios API clients and WebSocket handlers
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level view components
│   │   └── index.css         # Global styles and design tokens
│   ├── netlify.toml          # Netlify deployment configuration
│   └── package.json          # Node dependencies and scripts
├── sample-data/              # Example CSV datasets for testing
├── render.yaml               # Render deployment configuration
├── netlify.toml              # Root Netlify configuration
└── LICENSE                   # MIT License
```

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit changes with clear, descriptive messages.
4. Push to your fork and open a pull request.

Please ensure all changes pass the existing build process before submitting.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full license text.

---

<p align="center">
  Built by <a href="https://github.com/jeet2005">Jeet Patel</a> and open-source contributors.
</p>
