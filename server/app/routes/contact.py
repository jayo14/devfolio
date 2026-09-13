from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ContactMessage, User, _generate_id
from app.schemas import ContactMessageCreate, ContactMessageOut
from app.auth import get_current_user
from app.email_service import send_contact_email

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("/", status_code=201)
def submit_contact_form(
    data: ContactMessageCreate,
    db: Session = Depends(get_db),
):
    # 1. Save message to database so no inquiry is ever lost
    msg_id = _generate_id()
    contact_entry = ContactMessage(
        id=msg_id,
        first_name=data.firstName.strip(),
        last_name=data.lastName.strip(),
        email=data.email.strip().lower(),
        phone=data.phone.strip(),
        message=(data.message or "").strip(),
    )
    db.add(contact_entry)
    db.commit()
    db.refresh(contact_entry)

    # 2. Dispatch email notification to johnayobami77@proton.me
    email_result = send_contact_email(
        first_name=contact_entry.first_name,
        last_name=contact_entry.last_name,
        email=contact_entry.email,
        phone=contact_entry.phone,
        message=contact_entry.message,
    )

    return {
        "success": True,
        "message": "Thank you! Your message has been received and forwarded to John Ayobami.",
        "id": contact_entry.id,
        "delivery": email_result,
    }


@router.get("/", response_model=list[ContactMessageOut])
def list_contact_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [ContactMessageOut.from_orm_model(r) for r in rows]
