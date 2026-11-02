"""
database.py
===========
SQLAlchemy database setup for MediHybrid.
Configured for local SQLite development with seamless PostgreSQL compatibility.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# In serverless environments like Vercel or AWS Lambda, the local root is read-only.
# Redirect SQLite file to /tmp/ if running on Vercel or if standard path is read-only.
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    DB_PATH = "/tmp/medihybrid.db"
else:
    DB_PATH = os.path.join(BASE_DIR, "..", "medihybrid.db")

raw_db_url = os.environ.get("DATABASE_URL")
if not raw_db_url or not raw_db_url.strip():
    DATABASE_URL = f"sqlite:///{DB_PATH}"
elif raw_db_url.startswith("postgres://"):
    DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = raw_db_url

is_sqlite = DATABASE_URL.startswith("sqlite")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if is_sqlite else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Auto-create tables if database does not exist yet (essential for serverless cold-starts)
def init_db():
    from app.models import db_models  # noqa
    Base.metadata.create_all(bind=engine)

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
