# 🌌 Nexora

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-emerald.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/PRs-welcome-emerald.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white" alt="Tailwind">
</div>

<p align="center">
  <b>A state-of-the-art predictive analytics platform</b> designed to profile datasets, build fully-optimized preprocessing pipelines, train highly reproducible model registries, run batch predictions, monitor feature drift, and provide grounded AI educational interactive chats.
</p>

---

## 🔗 Live Deployments

| Component | Target URL | Status |
| :--- | :--- | :--- |
| **Frontend Web App** | [nexoraprediction.netlify.app](https://nexoraprediction.netlify.app/) | Live (Netlify) ⚡ |
| **Backend API Gateway** | [nexora-360r.onrender.com](https://nexora-360r.onrender.com/) | Live (Render) 🟢 |
| **Interactive API Documentation** | [nexora-360r.onrender.com/docs](https://nexora-360r.onrender.com/docs) | Operational 📖 |

> 💡 **Render Free-Tier Notice:** The backend API service automatically spins down due to inactivity. Please allow **30–60 seconds** for the initial server spin-up when first visiting or uploading.

---

## ✨ Features

### 📊 1. Dataset Intelligence Engine
- **Automated CSV Validation:** Smart checks for formatting, size limits, and file integrity.
- **Advanced Health Profiling:** Generates comprehensive structural, statistical, and column-level quality scores.
- **Preview & Distributions:** Real-time descriptive previews and data balance diagnostics.

### ⚙️ 2. Dynamic Preprocessing Pipelines
- **Automated Type Parsing:** Seamlessly distinguishes numeric, categorical, datetime, and ID columns.
- **Intelligent Preprocessing:** Handles missing values, scaling, standard encoding, outlier detection, and duplicate removal.
- **Interactive Configurations:** Flexible controls to change prediction targets and override pipeline steps.

### 🔮 3. Prediction Studio & Benchmarking
- **256+ Multi-Model Registry:** Broad ensemble suite powered by Scikit-Learn, CatBoost, LightGBM, and XGBoost.
- **Robust Training Pipeline:** Advanced cross-validation, train-test splitting, and hyperparameter scoring.
- **WebSocket Training Leaderboard:** Real-time progress updates with interactive model comparison matrix.
- **Comparison Arena:** Champion dashboards featuring live metrics, visual charts, and latency stats.

### 🚀 4. Enterprise Production Suite
- **API Endpoints:** Instantiate production-grade endpoints with API key authentication immediately.
- **Batch Processing:** Upload a file and download fully-enriched datasets containing targeted predictions.
- **Drift & Drift-Scores:** Automatic detection of feature and target distribution changes over time.
- **Local LLM Educational Chat:** Powered by Ollama & Phi-3 Mini to answer facts directly from the dataset.

---

## 🛠️ Tech Stack

| Layer | Tools |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, Lucide Icons |
| **Backend Gateway** | Python, FastAPI, Uvicorn, Pydantic, Pandas, NumPy, Scikit-learn, CatBoost |
| **Database & Auth** | MongoDB Atlas, Firebase Security Suite ready |
| **Local LLM Core** | Ollama Engine (Phi-3 Mini Integration) |
| **Infrastructure** | Netlify Build Engine, Render Deployment Pipelines |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.ai/) *(Optional, for educational Q&A chat)*

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend locally
python run.py
```
The local API will start at `http://127.0.0.1:8000` with documentation available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install package dependencies
npm install

# Start local Vite development server
npm run dev
```
The React frontend dashboard will spin up at `http://localhost:5173`.

---

## ⚙️ Production Setup & Configuration

### Netlify Frontend Build Environment
Configure your build environment in the Netlify Dashboard or committed in `netlify.toml`:
```ini
VITE_API_BASE_URL=https://nexora-360r.onrender.com/api
```

### Render Backend Service Configuration
Specify these environment variables in your Render Web Service configurations:
```ini
PUBLIC_API_URL=https://nexora-360r.onrender.com
PUBLIC_APP_URL=https://nexoraprediction.netlify.app
CORS_ORIGINS=["https://nexoraprediction.netlify.app","https://6a1627fbd02fd35ab9341469--nexoraprediction.netlify.app"]
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=phi3:mini
PERSISTENCE_BACKEND=mongodb
MONGODB_URI=your_mongodb_connection_string
```

---

## 📂 Project Architecture

```text
nexora/
├── backend/                  # FastAPI Application Code
│   ├── app/
│   │   ├── models/           # DB schema modeling & ML pipelines
│   │   ├── routers/          # API Route controllers
│   │   ├── services/         # ML Engine logic & data parsing
│   │   ├── config.py         # App configuration settings
│   │   └── main.py           # Application Entrypoint
│   ├── requirements.txt      # PyPI dependencies list
│   └── run.py                # Server execution script
├── frontend/                 # React UI Dashboard Application
│   ├── src/
│   │   ├── api/              # Axios API clients & WebSocket handlers
│   │   ├── components/       # Premium glassmorphic interface elements
│   │   ├── pages/            # View managers
│   │   └── index.css         # Custom typography & styles
│   ├── netlify.toml          # Netlify build properties
│   └── package.json          # Node dependencies & tasks
├── sample-data/              # Churn & Regression practice CSV datasets
└── LICENSE                   # MIT License Open Source agreement
```

---

## 📜 Open Source License

This project is licensed under the terms of the **MIT License** and is fully open-source and free for all. Feel free to clone, modify, distribute, or use it for personal and enterprise applications. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 💚 by <a href="https://github.com/jeet2005">Jeet Patel</a> and open-source contributors.
</p>
