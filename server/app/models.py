import re
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, DateTime

from app.database import Base


def _generate_id():
    return uuid.uuid4().hex[:12]


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(12), primary_key=True, default=_generate_id)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, default="")
    summary = Column(Text, default="")
    problem = Column(Text, default="")
    target_audience = Column(Text, default="")
    solution = Column(Text, default="")
    why_now = Column(Text, default="")
    image_url = Column(Text, default="")
    slider_image = Column(Text, default="")
    client = Column(String(255), default="")
    field = Column(String(255), default="")
    role = Column(String(255), default="")
    completed_date = Column(String(32), default="")
    live_url = Column(Text, default="")
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def __repr__(self):
        return f"<Project {self.slug}>"


class BlogLink(Base):
    __tablename__ = "blog_links"

    id = Column(String(12), primary_key=True, default=_generate_id)
    title = Column(String(255), nullable=False)
    url = Column(Text, nullable=False)
    platform = Column(String(50), default="other")
    cover_image = Column(Text, default="")
    date = Column(String(32), default="")
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def __repr__(self):
        return f"<BlogLink {self.title[:30]}>"


class User(Base):
    __tablename__ = "users"

    id = Column(String(12), primary_key=True, default=_generate_id)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def __repr__(self):
        return f"<User {self.email}>"


class MagicJob(Base):
    __tablename__ = "magic_jobs"

    id = Column(String(24), primary_key=True, default=lambda: uuid.uuid4().hex[:16])
    website_url = Column(Text, nullable=False)
    github_url = Column(Text, nullable=False)
    status = Column(String(50), default="queued", index=True)
    current_step = Column(String(100), default="queued")
    steps_json = Column(Text, default="[]")
    website_data_json = Column(Text, default="{}")
    repo_data_json = Column(Text, default="{}")
    ai_analysis_json = Column(Text, default="{}")
    desktop_screenshot = Column(Text, default="")
    mobile_screenshot = Column(Text, default="")
    mockup_url = Column(Text, default="")
    logo_url = Column(Text, default="")
    created_project_id = Column(String(12), default="")
    error_message = Column(Text, default="")
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self):
        return f"<MagicJob {self.id} ({self.status})>"


