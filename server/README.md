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

By default, the server uses a local SQLite database (`devfolio.db`).
Tables are automatically created on startup.

To populate initial sample projects and blog links for testing:
```bash
python app/seed.py
```

### 3. Run Migrations (Alembic)

```bash
alembic upgrade head
```

### 4. Run Development Server

```bash
uvicorn main:app --reload --port 8000
```

The API docs are available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 5. Run Tests

```bash
PYTHONPATH=. pytest tests/
```

## Migrating to PostgreSQL

When you are ready to switch from SQLite to PostgreSQL:

1. Create your PostgreSQL database.
2. Update `server/.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/devfolio
   ```
3. Run Alembic migrations against PostgreSQL:
   ```bash
   alembic upgrade head
   ```
4. Transfer all existing records from your SQLite database to PostgreSQL:
   ```bash
   python app/migrate_to_postgres.py postgresql://user:password@localhost:5432/devfolio
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
