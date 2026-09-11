from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BlogLink, User, _generate_id
from app.schemas import BlogLinkCreate, BlogLinkUpdate, BlogLinkOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/blogs", tags=["blogs"])


@router.get("/", response_model=list[BlogLinkOut])
def list_blog_links(db: Session = Depends(get_db)):
    rows = db.query(BlogLink).order_by(BlogLink.created_at.desc()).all()
    return [BlogLinkOut.from_orm_model(r) for r in rows]


@router.get("/{blog_id}", response_model=BlogLinkOut)
def get_blog_link(blog_id: str, db: Session = Depends(get_db)):
    row = db.query(BlogLink).filter(BlogLink.id == blog_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Blog link not found")
    return BlogLinkOut.from_orm_model(row)


@router.post("/", response_model=BlogLinkOut, status_code=201)
def create_blog_link(
    data: BlogLinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    link = BlogLink(
        id=_generate_id(),
        title=data.title,
        url=data.url,
        platform=data.platform,
        cover_image=data.coverImage,
        date=data.date,
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return BlogLinkOut.from_orm_model(link)


@router.put("/{blog_id}", response_model=BlogLinkOut)
def update_blog_link(
    blog_id: str,
    data: BlogLinkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    link = db.query(BlogLink).filter(BlogLink.id == blog_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Blog link not found")

    updates = data.model_dump(exclude_unset=True)
    field_map = {"coverImage": "cover_image"}

    for key, value in updates.items():
        col = field_map.get(key, key)
        setattr(link, col, value)

    db.commit()
    db.refresh(link)
    return BlogLinkOut.from_orm_model(link)


@router.delete("/{blog_id}", status_code=204)
def delete_blog_link(
    blog_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    link = db.query(BlogLink).filter(BlogLink.id == blog_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Blog link not found")
    db.delete(link)
    db.commit()
