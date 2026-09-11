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


## Authentication

The admin API uses email + password authentication with JWT Bearer tokens:

- **Default Admin Account** (seeded via `npm run seed`):
  - Email: `admin@devfolio.com`
  - Password: `admin12345`
- Configurable in `server/.env`:
  ```env
  JWT_SECRET_KEY=your-custom-secret-key
  ADMIN_EMAIL=admin@devfolio.com
  ADMIN_PASSWORD=your-secure-password
  ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate with email + password, returns JWT access token
- `GET /api/auth/me` - Retrieve current authenticated user profile
- `POST /api/auth/setup` - Initial admin registration if database has 0 users

### Magic Automated Project Import
- `POST /api/magic/projects` - Start asynchronous project generation pipeline (Requires Auth, Protected against SSRF)
- `GET /api/magic/jobs/{job_id}` - Poll pipeline status, step progress, and synthesized review card (Requires Auth)
- `POST /api/magic/jobs/{job_id}/publish` - Publish generated project directly into the portfolio database (Requires Auth)

### Static Media Assets
- `GET /static/magic/{job_id}/mockup.jpg` - Multi-device composite presentation cover
- `GET /static/magic/{job_id}/desktop.png` - Captured desktop screenshot (1440x900)
- `GET /static/magic/{job_id}/mobile.png` - Captured mobile screenshot (390x844)

### Health
- `GET /health` - Service health status

### Projects
- `GET /api/projects/` - List all projects (Public)
- `GET /api/projects/{id}` - Get project by ID (Public)
- `GET /api/projects/slug/{slug}` - Get project by URL slug (Public)
- `POST /api/projects/` - Create a new project (Requires Auth)
- `PUT /api/projects/{id}` - Update an existing project (Requires Auth)
- `DELETE /api/projects/{id}` - Delete a project (Requires Auth)

### Blog Links
- `GET /api/blogs/` - List all external blog links (Public)
- `GET /api/blogs/{id}` - Get blog link by ID (Public)
- `POST /api/blogs/` - Create a blog link (Requires Auth)
- `PUT /api/blogs/{id}` - Update a blog link (Requires Auth)
- `DELETE /api/blogs/{id}` - Delete a blog link (Requires Auth)


