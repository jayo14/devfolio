from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base, run_auto_migrations
from app.routes import projects, blogs, auth, magic

Base.metadata.create_all(bind=engine)
run_auto_migrations(engine)

STATIC_DIR = Path(__file__).resolve().parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Devfolio Admin API", version="1.0.0")

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(magic.router)
app.include_router(projects.router)
app.include_router(blogs.router)


@app.get("/health")
def health():
    return {"status": "ok"}
