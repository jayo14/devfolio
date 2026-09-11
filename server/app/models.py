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
