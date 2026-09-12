import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

SERVER_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DB_URL = f"sqlite:///{SERVER_DIR / 'devfolio.db'}"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

# SQLite needs check_same_thread=False; other backends ignore it
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def run_auto_migrations(eng):
    """Ensures existing tables have all required columns added dynamically."""
    with eng.connect() as conn:
        try:
            result = conn.execute(text("PRAGMA table_info(projects)"))
            existing_cols = {row[1] for row in result.fetchall()}
            needed_cols = [
                ("summary", "TEXT DEFAULT ''"),
                ("problem", "TEXT DEFAULT ''"),
                ("target_audience", "TEXT DEFAULT ''"),
                ("solution", "TEXT DEFAULT ''"),
                ("why_now", "TEXT DEFAULT ''"),
            ]
            for col_name, col_type in needed_cols:
                if col_name not in existing_cols:
                    conn.execute(text(f"ALTER TABLE projects ADD COLUMN {col_name} {col_type}"))
            conn.commit()
        except Exception:
            pass


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
