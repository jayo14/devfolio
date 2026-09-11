import sys
from pathlib import Path

# Add server directory to path if run directly
SERVER_DIR = Path(__file__).resolve().parent.parent
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

import os
from app.database import SessionLocal, engine, Base
from app.models import Project, BlogLink, User, _generate_id, _slugify
from app.auth import hash_password

DEFAULT_ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@devfolio.com")
DEFAULT_ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin12345")

INITIAL_PROJECTS = [
    {
        "title": "MYTH FANS Web3 Platform",
        "description": "A cutting-edge NFT community platform designed for digital artists and collectors. Features real-time minting, responsive 3D card displays, and wallet integration.",
        "imageUrl": "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/680849e92439612a4ca4f910_work-1.webp",
        "sliderImage": "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/68085b22466db18e813b8cc3_slider-1.webp",
        "client": "MYTH FANS",
        "field": "NFT / Web3",
        "role": "Design & Full-Stack Development",
        "completedDate": "2024-07-06",
        "liveUrl": "https://stephaniebruce.co/?ref=lapaninja#myth-fans",
    },
    {
        "title": "Apex Analytics Dashboard",
        "description": "High-performance enterprise analytics suite with real-time financial data visualization, customizable widgets, and responsive dark-mode UI.",
        "imageUrl": "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/68084f6f02bdaa2eb3410d79_work-2.webp",
        "sliderImage": "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/68085b7be651d5d5715ed6f5_slider-2.webp",
        "client": "Apex Financial",
        "field": "FinTech / SaaS",
        "role": "Lead Frontend Engineer",
        "completedDate": "2024-11-15",
        "liveUrl": "https://example.com/apex",
    },
    {
        "title": "Lumina Creative Studio",
        "description": "A minimal, typography-driven editorial website for an award-winning brand agency. Built with smooth page transitions and interactive WebGL elements.",
        "imageUrl": "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/68084f6ec956309220421f7b_work-3.webp",
        "sliderImage": "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/68085b7baa15b491c6e13c07_slider-3.webp",
        "client": "Lumina Studio",
        "field": "Brand Design",
        "role": "Creative Developer",
        "completedDate": "2025-01-20",
        "liveUrl": "https://example.com/lumina",
    },
]

INITIAL_BLOGS = [
    {
        "title": "UI/UX for Developers: The Power of Simplicity",
        "url": "https://hashnode.com/@codegallantx/ui-ux-for-developers",
        "platform": "hashnode",
        "coverImage": "https://cdn.prod.website-files.com/6805fdc8c6445252640face7/6806f932a884f2c259689af6_post-5.jpg",
        "date": "2025-04-22",
    },
    {
        "title": "Building Modern Web Applications with React 19 and FastAPI",
        "url": "https://dev.to/codegallantx/react-19-fastapi-fullstack-guide",
        "platform": "dev.to",
        "coverImage": "https://cdn.prod.website-files.com/6805fdc8c6445252640face7/6806f8f929e73c3d65221aff_post-4.jpg",
        "date": "2025-05-10",
    },
    {
        "title": "Microservices and Database Migrations: SQLite to PostgreSQL",
        "url": "https://medium.com/@codegallantx/sqlite-to-postgresql-migration",
        "platform": "medium",
        "coverImage": "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/68084f70e5d66cddaf7b4bb7_work-4.webp",
        "date": "2025-06-01",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed projects if empty
        if db.query(Project).count() == 0:
            for item in INITIAL_PROJECTS:
                pid = _generate_id()
                slug = _slugify(item["title"]) or pid
                proj = Project(
                    id=pid,
                    title=item["title"],
                    slug=slug,
                    description=item["description"],
                    image_url=item["imageUrl"],
                    slider_image=item["sliderImage"],
                    client=item["client"],
                    field=item["field"],
                    role=item["role"],
                    completed_date=item["completedDate"],
                    live_url=item["liveUrl"],
                )
                db.add(proj)
            db.commit()
            print(f"Seeded {len(INITIAL_PROJECTS)} projects.")
        else:
            print(f"Projects table already contains {db.query(Project).count()} entries.")

        # Seed blog links if empty
        if db.query(BlogLink).count() == 0:
            for item in INITIAL_BLOGS:
                link = BlogLink(
                    id=_generate_id(),
                    title=item["title"],
                    url=item["url"],
                    platform=item["platform"],
                    cover_image=item["coverImage"],
                    date=item["date"],
                )
                db.add(link)
            db.commit()
            print(f"Seeded {len(INITIAL_BLOGS)} blog links.")
        else:
            print(f"BlogLink table already contains {db.query(BlogLink).count()} entries.")

        # Seed default admin user if none exists
        if db.query(User).count() == 0:
            admin_user = User(
                id=_generate_id(),
                email=DEFAULT_ADMIN_EMAIL.lower(),
                hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
            )
            db.add(admin_user)
            db.commit()
            print(f"Seeded default admin user: {DEFAULT_ADMIN_EMAIL} (password: {DEFAULT_ADMIN_PASSWORD})")
        else:
            print(f"Users table already contains {db.query(User).count()} entries.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
