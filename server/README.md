# Devfolio Admin API Server

FastAPI backend providing REST APIs for managing portfolio projects and external blog links.

## Quick Start

### 1. Set up Virtual Environment & Install Dependencies

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Database

By default, the server uses SQLite (`sqlite:///./devfolio.db`).
To connect PostgreSQL, MySQL, or another database, update `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devfolio
```

### 3. Run Development Server

```bash
uvicorn main:app --reload --port 8000
```

The API docs are available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 4. Run Tests

```bash
pip install pytest
PYTHONPATH=. pytest tests/
```

## API Endpoints

### Health
- `GET /health` - Service health status

### Projects
- `GET /api/projects/` - List all projects
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects/slug/{slug}` - Get project by URL slug
- `POST /api/projects/` - Create a new project
- `PUT /api/projects/{id}` - Update an existing project
- `DELETE /api/projects/{id}` - Delete a project

### Blog Links
- `GET /api/blogs/` - List all external blog links (Hashnode, Medium, Dev.to, etc.)
- `GET /api/blogs/{id}` - Get blog link by ID
- `POST /api/blogs/` - Create a blog link
- `PUT /api/blogs/{id}` - Update a blog link
- `DELETE /api/blogs/{id}` - Delete a blog link
