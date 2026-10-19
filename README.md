# Tidewise — Executive Maritime Intelligence & Charter Forecasting AI

Enterprise-grade dry-bulk voyage planning, fleet optimization, and forward freight rate forecasting platform.

![Tidewise Platform](public/favicon.ico)

## Overview

Tidewise provides port authorities, dry-bulk charterers, and commodity trading desks with real-time route optimization, hydrodynamic clearance verification, and 4-month forward freight rate forecasting powered by multi-horizon XGBoost regressors.

### Core Architecture

- **Frontend Console**: Built with React 19, TanStack Start / Vite, and Tailwind CSS.
- **Tactical Navigation Engine**: Real-time hydrodynamic vessel morphing slider, interactive port terminal selector across 20 international dry-bulk hubs, and live cargo hold volumetric visualizers.
- **Backend Inference Server**: High-performance FastAPI server running on `http://localhost:8000`.
- **Pre-trained ML Models**: Pre-loaded multi-horizon XGBoost models evaluating charter yields and order allocation matrices in ~5ms without re-training.

## Getting Started

### 1. Launch the Backend Inference Engine

Ensure the Python virtual environment is activated and start the FastAPI service:

```bash
cd freight-rate-app
source venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Verify backend health:
```bash
curl http://localhost:8000/api/health
```

### 2. Launch the Frontend Console

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000` or `http://localhost:5173` to access the Bridge Console.

## Input Manifest Parameters

- **Route Corridor**: Origin Port, Destination Port, Route Code, Nautical Distance (100–20,000 NM), Departure Month.
- **Vessel Manifest**: Class (Capesize, Panamax, Supramax, Handysize), Deadweight Tonnage (DWT), Cruising Speed (knots), Daily Idle Demurrage Rate, Repositioning Surcharge.
- **Bulk Commodity**: Cargo Classification (Coal, Iron Ore, Wheat, Bauxite), Cargo Quantity (Metric Tonnes / KG), Travel Window.
- **Macroeconomic Indicators**: Bunker Fuel futures, Brent Crude, Commodity Price Indices, USD/INR FX, Baltic Shipping Indices, and Port Congestion Factors.

## License

Proprietary — Internal Maritime Logistics & Intelligence.
