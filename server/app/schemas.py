from datetime import datetime
from pydantic import BaseModel, HttpUrl


# ── Projects ─────────────────────────────────────────────────


class ProjectCreate(BaseModel):
    title: str
    description: str = ""
    summary: str = ""
    problem: str = ""
    targetAudience: str = ""
    solution: str = ""
    whyNow: str = ""
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
    summary: str | None = None
    problem: str | None = None
    targetAudience: str | None = None
    solution: str | None = None
    whyNow: str | None = None
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
    summary: str = ""
    problem: str = ""
    targetAudience: str = ""
    solution: str = ""
    whyNow: str = ""
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
            summary=getattr(obj, "summary", "") or "",
            problem=getattr(obj, "problem", "") or "",
            targetAudience=getattr(obj, "target_audience", "") or "",
            solution=getattr(obj, "solution", "") or "",
            whyNow=getattr(obj, "why_now", "") or "",
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


# ── Auth ─────────────────────────────────────────────────────


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    createdAt: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(id=obj.id, email=obj.email, createdAt=obj.created_at)


class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: UserOut


# ── Magic Automated Project Import ───────────────────────────


class MagicCreateRequest(BaseModel):
    websiteUrl: str
    githubUrl: str


class MagicStep(BaseModel):
    id: str
    label: str
    status: str  # pending | processing | completed | warning | failed
    message: str = ""


class MagicReviewData(BaseModel):
    name: str = ""
    description: str = ""
    summary: str = ""
    problem: str = ""
    targetAudience: str = ""
    solution: str = ""
    whyNow: str = ""
    client: str = ""
    field: str = ""
    role: str = ""
    completedDate: str = ""
    liveUrl: str = ""
    githubUrl: str = ""
    technologies: list[str] = []
    category: str = ""
    theme: dict = {}
    logoUrl: str = ""
    mockupUrl: str = ""
    desktopScreenshot: str = ""
    mobileScreenshot: str = ""


class MagicJobOut(BaseModel):
    id: str
    websiteUrl: str
    githubUrl: str
    status: str
    currentStep: str
    steps: list[MagicStep] = []
    review: MagicReviewData | None = None
    createdProjectId: str | None = None
    errorMessage: str | None = None
    createdAt: datetime
    updatedAt: datetime


class MagicPublishRequest(BaseModel):
    title: str
    description: str = ""
    summary: str = ""
    problem: str = ""
    targetAudience: str = ""
    solution: str = ""
    whyNow: str = ""
    imageUrl: str = ""
    sliderImage: str = ""
    client: str = ""
    field: str = ""
    role: str = ""
    completedDate: str = ""
    liveUrl: str = ""


# ── Contact Messages ─────────────────────────────────────────


class ContactMessageCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    message: str = ""


class ContactMessageOut(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    phone: str
    message: str
    createdAt: datetime

    @classmethod
    def from_orm_model(cls, row):
        return cls(
            id=row.id,
            firstName=row.first_name,
            lastName=row.last_name,
            email=row.email,
            phone=row.phone,
            message=row.message or "",
            createdAt=row.created_at,
        )


