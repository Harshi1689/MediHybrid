"""
main.py
=======
MediHybrid — Intelligent Hybrid Healthcare System
Main FastAPI Application Entrypoint
- Serves API routes under /api/
- Mounts sample retinal fundus assets
- Serves the compiled React + Vite frontend SPA with client-side routing fallback
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import engine, Base
from app.api import (
    endpoints_prediction,
    endpoints_retina,
    endpoints_fuzzy,
    endpoints_chat,
    endpoints_reports,
    endpoints_dashboard,
    endpoints_algorithms
)

# Automatically create all SQLite / SQLAlchemy database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediHybrid API",
    description="Intelligent Hybrid Healthcare System powered by GA, ANN, Mamdani Fuzzy Inference, and CNN Retinal Analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(endpoints_prediction.router)
app.include_router(endpoints_retina.router)
app.include_router(endpoints_fuzzy.router)
app.include_router(endpoints_chat.router)
app.include_router(endpoints_reports.router)
app.include_router(endpoints_dashboard.router)
app.include_router(endpoints_algorithms.router)

# Mount sample retina images directory
SAMPLE_RETINA_DIR = os.path.join(os.path.dirname(__file__), "..", "ml_artifacts", "sample_retina")
if os.path.exists(SAMPLE_RETINA_DIR):
    app.mount("/sample_retina", StaticFiles(directory=SAMPLE_RETINA_DIR), name="sample_retina")

# Mount compiled production React frontend if present
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API docs and endpoints to bypass SPA fallback
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "ok", "message": "MediHybrid API active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
