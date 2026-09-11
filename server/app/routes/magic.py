import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MagicJob, Project, User, _generate_id, _slugify
from app.schemas import (
    MagicCreateRequest,
    MagicJobOut,
    MagicStep,
    MagicReviewData,
    MagicPublishRequest,
    ProjectOut,
)
from app.auth import get_current_user
from app.magic.security import (
    validate_public_website_url,
    validate_and_normalize_github_url,
    ValidationError,
)
from app.magic.pipeline import execute_magic_pipeline, PIPELINE_STEPS

router = APIRouter(prefix="/api/magic", tags=["magic"])


def format_job_out(job: MagicJob) -> MagicJobOut:
    try:
        steps_raw = json.loads(job.steps_json) if job.steps_json else []
        steps = [MagicStep(**s) for s in steps_raw]
    except Exception:
        steps = [MagicStep(**s) for s in PIPELINE_STEPS]

    review = None
    if job.ai_analysis_json:
        try:
            ai_data = json.loads(job.ai_analysis_json)
            review = MagicReviewData(
                name=ai_data.get("name", ""),
                description=ai_data.get("description", ""),
                client=ai_data.get("client", ""),
                field=ai_data.get("field", ""),
                role=ai_data.get("role", ""),
                completedDate=ai_data.get("completedDate", ""),
                liveUrl=job.website_url,
                githubUrl=job.github_url,
                technologies=ai_data.get("technologies", []),
                category=ai_data.get("category", ""),
                theme=ai_data.get("theme", {}),
                logoUrl=job.logo_url or "",
                mockupUrl=job.mockup_url or "",
                desktopScreenshot=job.desktop_screenshot or "",
                mobileScreenshot=job.mobile_screenshot or "",
            )
        except Exception:
            pass

    return MagicJobOut(
        id=job.id,
        websiteUrl=job.website_url,
        githubUrl=job.github_url,
        status=job.status,
        currentStep=job.current_step,
        steps=steps,
        review=review,
        createdProjectId=job.created_project_id or None,
        errorMessage=job.error_message or None,
        createdAt=job.created_at,
        updatedAt=job.updated_at,
    )


@router.post("/projects", status_code=202)
def start_magic_project(
    data: MagicCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Starts an asynchronous Magic project generation job after validating sources."""
    try:
        norm_web = validate_public_website_url(data.websiteUrl)
        norm_gh, _, _ = validate_and_normalize_github_url(data.githubUrl)
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    job = MagicJob(
        website_url=norm_web,
        github_url=norm_gh,
        status="queued",
        current_step="queued",
        steps_json=json.dumps(PIPELINE_STEPS),
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Queue background task
    background_tasks.add_task(asyncio.run, execute_magic_pipeline(job.id))

    return {"jobId": job.id, "status": "queued"}


@router.get("/jobs/{job_id}", response_model=MagicJobOut)
def get_magic_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves current pipeline state, step progress, and review data for a job."""
    job = db.query(MagicJob).filter(MagicJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Magic job not found.")
    return format_job_out(job)


@router.post("/jobs/{job_id}/publish", response_model=ProjectOut, status_code=201)
def publish_magic_project(
    job_id: str,
    data: MagicPublishRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Transforms the reviewed Magic job into a standard Project entity in the database."""
    job = db.query(MagicJob).filter(MagicJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Magic job not found.")

    if not data.title.strip():
        raise HTTPException(status_code=400, detail="Project title is required.")

    pid = _generate_id()
    slug = _slugify(data.title) or pid
    base_slug = slug
    counter = 1
    while db.query(Project).filter(Project.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Image priority: provided imageUrl -> job mockup -> static fallback
    cover_image = data.imageUrl or job.mockup_url or job.desktop_screenshot
    slider_image = data.sliderImage or cover_image

    project = Project(
        id=pid,
        title=data.title.strip(),
        slug=slug,
        description=data.description.strip(),
        image_url=cover_image,
        slider_image=slider_image,
        client=data.client.strip(),
        field=data.field.strip(),
        role=data.role.strip(),
        completed_date=data.completedDate.strip(),
        live_url=data.liveUrl.strip(),
    )
    db.add(project)

    job.status = "completed"
    job.created_project_id = project.id
    db.commit()
    db.refresh(project)

    return ProjectOut.from_orm_model(project)
