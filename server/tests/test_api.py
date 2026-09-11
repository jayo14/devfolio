import sys
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent.parent
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal, engine, Base
from app.models import User, _generate_id
from app.auth import hash_password

client = TestClient(app)

TEST_ADMIN_EMAIL = "testadmin@devfolio.com"
TEST_ADMIN_PASSWORD = "testpassword123"


def ensure_test_admin():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == TEST_ADMIN_EMAIL).first()
        if not user:
            user = User(
                id=_generate_id(),
                email=TEST_ADMIN_EMAIL,
                hashed_password=hash_password(TEST_ADMIN_PASSWORD),
            )
            db.add(user)
            db.commit()
    finally:
        db.close()


def get_auth_headers():
    ensure_test_admin()
    res = client.post(
        "/api/auth/login",
        json={"email": TEST_ADMIN_EMAIL, "password": TEST_ADMIN_PASSWORD},
    )
    assert res.status_code == 200, res.text
    token = res.json()["accessToken"]
    return {"Authorization": f"Bearer {token}"}


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_auth_flow():
    ensure_test_admin()

    # 1. Invalid credentials
    bad_res = client.post(
        "/api/auth/login",
        json={"email": TEST_ADMIN_EMAIL, "password": "wrongpassword"},
    )
    assert bad_res.status_code == 401

    # 2. Valid credentials
    good_res = client.post(
        "/api/auth/login",
        json={"email": TEST_ADMIN_EMAIL, "password": TEST_ADMIN_PASSWORD},
    )
    assert good_res.status_code == 200
    data = good_res.json()
    assert "accessToken" in data
    assert data["user"]["email"] == TEST_ADMIN_EMAIL

    # 3. Verify /me endpoint
    token = data["accessToken"]
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == TEST_ADMIN_EMAIL


def test_protected_routes_require_auth():
    # Attempt create project without auth
    res = client.post("/api/projects/", json={"title": "Unauthorized Proj"})
    assert res.status_code == 401

    # Attempt create blog without auth
    res = client.post("/api/blogs/", json={"title": "Unauthorized Blog", "url": "https://example.com"})
    assert res.status_code == 401


def test_project_lifecycle():
    headers = get_auth_headers()

    # 1. Create project with auth
    payload = {
        "title": "Portfolio Redesign",
        "description": "Redesigned digital presence",
        "imageUrl": "https://example.com/img.jpg",
        "sliderImage": "https://example.com/slider.jpg",
        "client": "Acme",
        "field": "Design",
        "role": "Frontend",
        "completedDate": "2026-01-10",
        "liveUrl": "https://example.com",
    }
    create_res = client.post("/api/projects/", json=payload, headers=headers)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["title"] == "Portfolio Redesign"
    proj_id = data["id"]

    # 2. Public get by slug
    slug_res = client.get(f"/api/projects/slug/{data['slug']}")
    assert slug_res.status_code == 200
    assert slug_res.json()["id"] == proj_id

    # 3. Update project with auth
    update_res = client.put(f"/api/projects/{proj_id}", json={"client": "Acme Global"}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["client"] == "Acme Global"

    # 4. Delete project with auth
    del_res = client.delete(f"/api/projects/{proj_id}", headers=headers)
    assert del_res.status_code == 204


def test_blog_lifecycle():
    headers = get_auth_headers()

    # 1. Create blog link with auth
    payload = {
        "title": "Mastering React 19 and FastAPI",
        "url": "https://hashnode.com/@dev/mastering-react-fastapi",
        "platform": "hashnode",
        "coverImage": "https://example.com/cover.jpg",
        "date": "2026-03-15",
    }
    create_res = client.post("/api/blogs/", json=payload, headers=headers)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["platform"] == "hashnode"
    blog_id = data["id"]

    # 2. Public list blogs
    list_res = client.get("/api/blogs/")
    assert list_res.status_code == 200
    ids = [b["id"] for b in list_res.json()]
    assert blog_id in ids

    # 3. Update blog with auth
    update_res = client.put(f"/api/blogs/{blog_id}", json={"platform": "dev.to"}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["platform"] == "dev.to"

    # 4. Delete blog with auth
    del_res = client.delete(f"/api/blogs/{blog_id}", headers=headers)
    assert del_res.status_code == 204
