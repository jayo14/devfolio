import asyncio
import json
import logging
from pathlib import Path

from app.database import SessionLocal
from app.models import MagicJob
from app.magic.security import validate_and_normalize_github_url, validate_public_website_url
from app.magic.website_inspector import inspect_website
from app.magic.github_analyzer import inspect_github_repo
from app.magic.asset_detector import detect_logo
from app.magic.screenshot_mockup import capture_web_screenshots, create_mockup_composition, STATIC_MAGIC_DIR
from app.magic.intelligence import generate_project_intelligence

logger = logging.getLogger("magic_pipeline")

PIPELINE_STEPS = [
    {"id": "inspecting_website", "label": "Inspecting live website", "status": "pending", "message": ""},
    {"id": "inspecting_repository", "label": "Analyzing GitHub repository", "status": "pending", "message": ""},
    {"id": "extracting_assets", "label": "Extracting brand assets & logo", "status": "pending", "message": ""},
    {"id": "capturing_screenshots", "label": "Capturing multi-device screenshots", "status": "pending", "message": ""},
    {"id": "analyzing_project", "label": "Synthesizing project intelligence", "status": "pending", "message": ""},
    {"id": "generating_mockup", "label": "Compositing portfolio mockup", "status": "pending", "message": ""},
]


def update_job_step(db, job_id: str, step_id: str, step_status: str, message: str = ""):
    job = db.query(MagicJob).filter(MagicJob.id == job_id).first()
    if not job:
        return
    try:
        steps = json.loads(job.steps_json)
    except Exception:
        steps = [dict(s) for s in PIPELINE_STEPS]

    for s in steps:
        if s["id"] == step_id:
            s["status"] = step_status
            s["message"] = message

    job.steps_json = json.dumps(steps)
    job.current_step = step_id
    db.commit()


async def execute_magic_pipeline(job_id: str):
    """Executes the full automated analysis and generation pipeline asynchronously."""
    db = SessionLocal()
    try:
        job = db.query(MagicJob).filter(MagicJob.id == job_id).first()
        if not job:
            return

        website_url = job.website_url
        github_url = job.github_url

        # Initialize steps if empty
        steps = [dict(s) for s in PIPELINE_STEPS]
        job.steps_json = json.dumps(steps)
        job.status = "processing"
        db.commit()

        # Step 1: Website Inspection
        update_job_step(db, job_id, "inspecting_website", "processing", "Connecting to live site...")
        try:
            valid_web_url = validate_public_website_url(website_url)
            website_data = await inspect_website(valid_web_url)
            job.website_data_json = json.dumps(website_data)
            db.commit()
            update_job_step(db, job_id, "inspecting_website", "completed", f"Found '{website_data.get('title', 'Website')}'")
        except Exception as e:
            update_job_step(db, job_id, "inspecting_website", "failed", str(e))
            job.status = "failed"
            job.error_message = f"Website inspection failed: {e}"
            db.commit()
            return

        # Step 2: GitHub Repository Inspection
        update_job_step(db, job_id, "inspecting_repository", "processing", "Querying repository manifest & code...")
        try:
            norm_gh, owner, repo = validate_and_normalize_github_url(github_url)
            repo_data = await inspect_github_repo(owner, repo)
            job.repo_data_json = json.dumps(repo_data)
            db.commit()
            tech_summary = ", ".join(repo_data.get("technologies", [])[:4]) or "Repository metadata"
            update_job_step(db, job_id, "inspecting_repository", "completed", f"Detected {tech_summary}")
        except Exception as e:
            update_job_step(db, job_id, "inspecting_repository", "warning", f"Repo details limited: {e}")
            repo_data = {"name": github_url.split("/")[-1], "technologies": [], "languages": []}
            job.repo_data_json = json.dumps(repo_data)
            db.commit()

        # Step 3: Logo & Brand Asset Extraction
        update_job_step(db, job_id, "extracting_assets", "processing", "Detecting logo candidates...")
        try:
            proj_title = website_data.get("title") or repo_data.get("name") or "Project"
            logo_url = await detect_logo(website_data, proj_title)
            job.logo_url = logo_url
            db.commit()
            update_job_step(db, job_id, "extracting_assets", "completed", "Brand assets identified")
        except Exception as e:
            update_job_step(db, job_id, "extracting_assets", "warning", f"Using placeholder logo: {e}")

        # Step 4: Screenshot Capture
        update_job_step(db, job_id, "capturing_screenshots", "processing", "Rendering desktop & mobile viewports...")
        job_dir = STATIC_MAGIC_DIR / job_id
        try:
            desktop_path, mobile_path = await capture_web_screenshots(valid_web_url, job_dir)
            job.desktop_screenshot = f"/static/magic/{job_id}/desktop.png"
            job.mobile_screenshot = f"/static/magic/{job_id}/mobile.png"
            db.commit()
            update_job_step(db, job_id, "capturing_screenshots", "completed", "Captured 1440x900 & 390x844 viewports")
        except Exception as e:
            update_job_step(db, job_id, "capturing_screenshots", "warning", f"Using fallback capture: {e}")

        # Step 5: Synthesize Project Intelligence
        update_job_step(db, job_id, "analyzing_project", "processing", "Generating structured project metadata...")
        try:
            intelligence = await generate_project_intelligence(website_data, repo_data)
            job.ai_analysis_json = json.dumps(intelligence)
            db.commit()
            update_job_step(db, job_id, "analyzing_project", "completed", f"Structured {len(intelligence.get('technologies', []))} technologies")
        except Exception as e:
            update_job_step(db, job_id, "analyzing_project", "warning", f"Using rule-based intelligence: {e}")

        # Step 6: Mockup Composition
        update_job_step(db, job_id, "generating_mockup", "processing", "Compositing multi-device presentation frame...")
        try:
            mockup_path = job_dir / "mockup.jpg"
            create_mockup_composition(desktop_path, mobile_path, mockup_path)
            job.mockup_url = f"/static/magic/{job_id}/mockup.jpg"
            db.commit()
            update_job_step(db, job_id, "generating_mockup", "completed", "Generated high-resolution portfolio cover")
        except Exception as e:
            # If composition fails, fallback to desktop screenshot
            job.mockup_url = job.desktop_screenshot or website_data.get("ogImage", "")
            update_job_step(db, job_id, "generating_mockup", "warning", f"Used screenshot fallback: {e}")
            db.commit()

        # Mark ready for review
        job.status = "ready_for_review"
        db.commit()

    except Exception as e:
        logger.exception("Unexpected pipeline failure")
        if job:
            job.status = "failed"
            job.error_message = str(e)
            db.commit()
    finally:
        db.close()
