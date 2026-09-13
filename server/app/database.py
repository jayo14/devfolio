import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

SERVER_DIR = Path(__file__).resolve().parent.parent
load_dotenv(SERVER_DIR / ".env")
load_dotenv()

DEFAULT_DB_URL = f"sqlite:///{SERVER_DIR / 'devfolio.db'}"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

# SQLite needs check_same_thread=False; other backends ignore it
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def run_auto_migrations(eng):
    """Ensures existing tables have all required columns added dynamically."""
    is_sqlite = eng.url.get_backend_name() == "sqlite"
    needed_cols = [
        ("summary", "TEXT DEFAULT ''"),
        ("problem", "TEXT DEFAULT ''"),
        ("target_audience", "TEXT DEFAULT ''"),
        ("solution", "TEXT DEFAULT ''"),
        ("why_now", "TEXT DEFAULT ''"),
    ]
    with eng.connect() as conn:
        try:
            if is_sqlite:
                result = conn.execute(text("PRAGMA table_info(projects)"))
                existing_cols = {row[1] for row in result.fetchall()}
            else:
                result = conn.execute(
                    text("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'")
                )
                existing_cols = {row[0] for row in result.fetchall()}
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
