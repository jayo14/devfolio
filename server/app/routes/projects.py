from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, User, _slugify, _generate_id
from app.schemas import ProjectCreate, ProjectUpdate, ProjectOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    rows = db.query(Project).order_by(Project.created_at.desc()).all()
    return [ProjectOut.from_orm_model(r) for r in rows]


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: str, db: Session = Depends(get_db)):
    row = db.query(Project).filter(Project.id == project_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut.from_orm_model(row)


@router.get("/slug/{slug}", response_model=ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    row = db.query(Project).filter(Project.slug == slug).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut.from_orm_model(row)


@router.post("/", response_model=ProjectOut, status_code=201)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pid = _generate_id()
    slug = _slugify(data.title) or pid
    # Ensure slug uniqueness
    base_slug = slug
    counter = 1
    while db.query(Project).filter(Project.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    project = Project(
        id=pid,
        title=data.title,
        slug=slug,
        description=data.description,
        summary=data.summary,
        problem=data.problem,
        target_audience=data.targetAudience,
        solution=data.solution,
        why_now=data.whyNow,
        image_url=data.imageUrl,
        slider_image=data.sliderImage,
        client=data.client,
        field=data.field,
        role=data.role,
        completed_date=data.completedDate,
        live_url=data.liveUrl,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectOut.from_orm_model(project)


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: str,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    updates = data.model_dump(exclude_unset=True)

    # Map camelCase fields to snake_case columns
    field_map = {
        "imageUrl": "image_url",
        "sliderImage": "slider_image",
        "completedDate": "completed_date",
        "liveUrl": "live_url",
        "targetAudience": "target_audience",
        "whyNow": "why_now",
    }

    for key, value in updates.items():
        col = field_map.get(key, key)
        setattr(project, col, value)

    # Re-derive slug if title changed
    if "title" in updates:
        new_slug = _slugify(updates["title"]) or project.id
        if new_slug != project.slug:
            base_slug = new_slug
            counter = 1
            while (
                db.query(Project)
                .filter(Project.slug == new_slug, Project.id != project_id)
                .first()
            ):
                new_slug = f"{base_slug}-{counter}"
                counter += 1
            project.slug = new_slug

    db.commit()
    db.refresh(project)
    return ProjectOut.from_orm_model(project)


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()

