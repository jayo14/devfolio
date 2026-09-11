import sys
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent.parent
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_project_lifecycle():
    # 1. Create project
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
    create_res = client.post("/api/projects/", json=payload)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["title"] == "Portfolio Redesign"
    assert data["slug"] == "portfolio-redesign"
    proj_id = data["id"]

    # 2. Get by slug
    slug_res = client.get(f"/api/projects/slug/{data['slug']}")
    assert slug_res.status_code == 200
    assert slug_res.json()["id"] == proj_id

    # 3. Update project
    update_res = client.put(f"/api/projects/{proj_id}", json={"client": "Acme Global"})
    assert update_res.status_code == 200
    assert update_res.json()["client"] == "Acme Global"

    # 4. Delete project
    del_res = client.delete(f"/api/projects/{proj_id}")
    assert del_res.status_code == 204


def test_blog_lifecycle():
    # 1. Create blog link
    payload = {
        "title": "Mastering React 19 and FastAPI",
        "url": "https://hashnode.com/@dev/mastering-react-fastapi",
        "platform": "hashnode",
        "coverImage": "https://example.com/cover.jpg",
        "date": "2026-03-15",
    }
    create_res = client.post("/api/blogs/", json=payload)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["platform"] == "hashnode"
    blog_id = data["id"]

    # 2. List blogs
    list_res = client.get("/api/blogs/")
    assert list_res.status_code == 200
    ids = [b["id"] for b in list_res.json()]
    assert blog_id in ids

    # 3. Update blog
    update_res = client.put(f"/api/blogs/{blog_id}", json={"platform": "dev.to"})
    assert update_res.status_code == 200
    assert update_res.json()["platform"] == "dev.to"

    # 4. Delete blog
    del_res = client.delete(f"/api/blogs/{blog_id}")
    assert del_res.status_code == 204
