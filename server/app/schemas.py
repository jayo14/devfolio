from datetime import datetime
from pydantic import BaseModel, HttpUrl


# ── Projects ─────────────────────────────────────────────────


class ProjectCreate(BaseModel):
    title: str
    description: str = ""
    imageUrl: str = ""
    sliderImage: str = ""
    client: str = ""
    field: str = ""
    role: str = ""
    completedDate: str = ""
    liveUrl: str = ""


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    imageUrl: str | None = None
    sliderImage: str | None = None
    client: str | None = None
    field: str | None = None
    role: str | None = None
    completedDate: str | None = None
    liveUrl: str | None = None


class ProjectOut(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    imageUrl: str
    sliderImage: str
    client: str
    field: str
    role: str
    completedDate: str
    liveUrl: str
    createdAt: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(
            id=obj.id,
            title=obj.title,
            slug=obj.slug,
            description=obj.description or "",
            imageUrl=obj.image_url or "",
            sliderImage=obj.slider_image or "",
            client=obj.client or "",
            field=obj.field or "",
            role=obj.role or "",
            completedDate=obj.completed_date or "",
            liveUrl=obj.live_url or "",
            createdAt=obj.created_at,
        )


# ── Blog Links ───────────────────────────────────────────────


class BlogLinkCreate(BaseModel):
    title: str
    url: str
    platform: str = "other"
    coverImage: str = ""
    date: str = ""


class BlogLinkUpdate(BaseModel):
    title: str | None = None
    url: str | None = None
    platform: str | None = None
    coverImage: str | None = None
    date: str | None = None


class BlogLinkOut(BaseModel):
    id: str
    title: str
    url: str
    platform: str
    coverImage: str
    date: str
    createdAt: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(
            id=obj.id,
            title=obj.title,
            url=obj.url,
            platform=obj.platform or "other",
            coverImage=obj.cover_image or "",
            date=obj.date or "",
            createdAt=obj.created_at,
        )
