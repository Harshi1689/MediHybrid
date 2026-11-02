"""
run_server.py
=============
MediHybrid Enterprise Production Launcher
Starts the FastAPI application serving both the REST API and the compiled React SPA.
Configured for local execution and cloud platforms (Render, Railway, Fly.io).
"""

import os
import sys
import traceback

# Force unbuffered output so all logs appear immediately in Render / cloud dashboards
os.environ["PYTHONUNBUFFERED"] = "1"

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "backend")

# Suppress matplotlib temp cache notices
cache_dir = os.path.join(backend_dir, ".matplotlib_cache")
try:
    os.makedirs(cache_dir, exist_ok=True)
    os.environ["MPLCONFIGDIR"] = cache_dir
except Exception:
    os.environ["MPLCONFIGDIR"] = "/tmp/.matplotlib"

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app
    import uvicorn
except Exception as e:
    print(f"CRITICAL INITIALIZATION ERROR: {e}", flush=True)
    traceback.print_exc()
    sys.exit(1)

def main():
    try:
        port = int(os.environ.get("PORT", 8000))
        host = os.environ.get("HOST", "0.0.0.0")

        print("=" * 68, flush=True)
        print("  MEDIHYBRID — INTELLIGENT CLINICAL HEALTHCARE SYSTEM", flush=True)
        print("  Soft Computing & Deep Vision Decision Support Platform", flush=True)
        print("=" * 68, flush=True)
        print(f"  * Backend Framework : FastAPI / Python", flush=True)
        print(f"  * Module 1 (Hybrid) : DEAP Genetic Algorithm + ANN + Mamdani Fuzzy", flush=True)
        print(f"  * Module 2 (Vision) : Diabetic Retinopathy CNN (APTOS 2019) + Grad-CAM", flush=True)
        print(f"  * Module 3 (AI Bot) : MediBot AI Conversational Health Assistant", flush=True)
        print(f"  * Listening on      : http://{host}:{port}", flush=True)
        print(f"  * Swagger API Docs  : http://{host}:{port}/docs", flush=True)
        print("=" * 68, flush=True)

        # Use import string "app.main:app" for full compatibility with Render's WEB_CONCURRENCY
        uvicorn.run("app.main:app", host=host, port=port, log_level="info", reload=False)
    except Exception as e:
        print(f"SERVER START ERROR: {e}", flush=True)
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
