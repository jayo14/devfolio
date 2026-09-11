from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import projects, blogs, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Devfolio Admin API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(blogs.router)


@app.get("/health")
def health():
    return {"status": "ok"}
