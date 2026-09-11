"""Utility script to transfer all records from SQLite to PostgreSQL.

Usage:
    python app/migrate_to_postgres.py postgresql://user:password@localhost:5432/devfolio
or set POSTGRES_URL in server/.env and run:
    python app/migrate_to_postgres.py
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SERVER_DIR = Path(__file__).resolve().parent.parent
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

load_dotenv(SERVER_DIR / ".env")

from app.database import Base, DEFAULT_DB_URL
from app.models import Project, BlogLink


def migrate_data(target_url: str):
    source_url = os.getenv("SQLITE_SOURCE_URL", DEFAULT_DB_URL)
    print(f"Source database: {source_url}")
    print(f"Target database: {target_url}")

    # Source session (SQLite)
    source_engine = create_engine(source_url, connect_args={"check_same_thread": False})
    SourceSession = sessionmaker(bind=source_engine)
    source_db = SourceSession()

    # Target session (PostgreSQL)
    target_engine = create_engine(target_url)
    Base.metadata.create_all(bind=target_engine)
    TargetSession = sessionmaker(bind=target_engine)
    target_db = TargetSession()

    try:
        # Transfer Projects
        projects = source_db.query(Project).all()
        print(f"Transferring {len(projects)} projects...")
        for p in projects:
            existing = target_db.query(Project).filter(Project.id == p.id).first()
            if not existing:
                new_p = Project(
                    id=p.id,
                    title=p.title,
                    slug=p.slug,
                    description=p.description,
                    image_url=p.image_url,
                    slider_image=p.slider_image,
                    client=p.client,
                    field=p.field,
                    role=p.role,
                    completed_date=p.completed_date,
                    live_url=p.live_url,
                    created_at=p.created_at,
                )
                target_db.add(new_p)
        target_db.commit()

        # Transfer BlogLinks
        blogs = source_db.query(BlogLink).all()
        print(f"Transferring {len(blogs)} blog links...")
        for b in blogs:
            existing = target_db.query(BlogLink).filter(BlogLink.id == b.id).first()
            if not existing:
                new_b = BlogLink(
                    id=b.id,
                    title=b.title,
                    url=b.url,
                    platform=b.platform,
                    cover_image=b.cover_image,
                    date=b.date,
                    created_at=b.created_at,
                )
                target_db.add(new_b)
        target_db.commit()

        print("Data migration from SQLite to PostgreSQL completed successfully!")
    finally:
        source_db.close()
        target_db.close()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        dest_url = sys.argv[1]
    else:
        dest_url = os.getenv("POSTGRES_URL")

    if not dest_url:
        print("Error: Target PostgreSQL URL not provided.")
        print("Usage: python app/migrate_to_postgres.py postgresql://user:pass@host:5432/dbname")
        print("Or define POSTGRES_URL in server/.env")
        sys.exit(1)

    migrate_data(dest_url)
