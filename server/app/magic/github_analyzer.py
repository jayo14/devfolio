import json
import os
import re
import httpx

KNOWN_FRAMEWORKS = {
    "react": "React",
    "next": "Next.js",
    "vue": "Vue.js",
    "nuxt": "Nuxt",
    "svelte": "Svelte",
    "astro": "Astro",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "django": "Django",
    "express": "Express",
    "nest": "NestJS",
    "remix": "Remix",
    "tailwind": "Tailwind CSS",
    "three": "Three.js",
    "framer-motion": "Framer Motion",
    "gsap": "GSAP",
    "zustand": "Zustand",
    "redux": "Redux",
    "prisma": "Prisma",
    "drizzle": "Drizzle ORM",
    "sqlalchemy": "SQLAlchemy",
    "mongodb": "MongoDB",
    "postgres": "PostgreSQL",
    "sqlite": "SQLite",
    "redis": "Redis",
    "docker": "Docker",
    "vite": "Vite",
    "webpack": "Webpack",
}


async def inspect_github_repo(owner: str, repo: str, timeout: float = 15.0) -> dict:
    """Inspects a GitHub repository to discover technologies, frameworks, and architecture."""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Devfolio-Magic-Importer/1.0",
    }
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token:
        headers["Authorization"] = f"token {github_token}"

    api_url = f"https://api.github.com/repos/{owner}/{repo}"
    repo_data = {}
    languages_data = {}

    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        # Fetch repository metadata
        resp = await client.get(api_url, headers=headers)
        if resp.status_code == 200:
            repo_data = resp.json()
        elif resp.status_code == 404:
            raise ValueError(f"GitHub repository '{owner}/{repo}' was not found or is private.")
        else:
            repo_data = {"name": repo, "description": "", "topics": []}

        # Fetch repository languages
        lang_resp = await client.get(f"{api_url}/languages", headers=headers)
        if lang_resp.status_code == 200:
            languages_data = lang_resp.json()

        default_branch = repo_data.get("default_branch", "main")

        # Check key configuration/manifest files via raw content
        manifest_files = [
            "package.json",
            "requirements.txt",
            "pyproject.toml",
            "Dockerfile",
            "docker-compose.yml",
            "README.md",
        ]
        manifest_contents = {}

        for filename in manifest_files:
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{filename}"
            try:
                raw_resp = await client.get(raw_url, headers=headers)
                if raw_resp.status_code == 200:
                    manifest_contents[filename] = raw_resp.text
            except Exception:
                pass

    # Extract detected technologies from manifests
    technologies = set()
    for lang in languages_data.keys():
        technologies.add(lang)

    # Inspect package.json
    if "package.json" in manifest_contents:
        try:
            pkg = json.loads(manifest_contents["package.json"])
            deps = {
                **pkg.get("dependencies", {}),
                **pkg.get("devDependencies", {}),
            }
            for dep_name in deps.keys():
                lower_dep = dep_name.lower()
                for key, label in KNOWN_FRAMEWORKS.items():
                    if key in lower_dep:
                        technologies.add(label)
        except Exception:
            pass

    # Inspect requirements.txt / pyproject.toml
    python_manifests = [
        manifest_contents.get("requirements.txt", ""),
        manifest_contents.get("pyproject.toml", ""),
    ]
    for py_text in python_manifests:
        lower_text = py_text.lower()
        for key, label in KNOWN_FRAMEWORKS.items():
            if re.search(rf"\b{re.escape(key)}\b", lower_text):
                technologies.add(label)

    # Check Docker
    if "Dockerfile" in manifest_contents or "docker-compose.yml" in manifest_contents:
        technologies.add("Docker")

    # Add topics from repo
    for topic in repo_data.get("topics", []):
        topic_title = topic.replace("-", " ").title()
        if len(topic_title) < 20:
            technologies.add(topic_title)

    readme_snippet = manifest_contents.get("README.md", "")[:1200]

    return {
        "name": repo_data.get("name", repo),
        "fullName": f"{owner}/{repo}",
        "description": repo_data.get("description") or "",
        "languages": list(languages_data.keys()),
        "technologies": sorted(list(technologies)),
        "stars": repo_data.get("stargazers_count", 0),
        "license": repo_data.get("license", {}).get("spdx_id") if repo_data.get("license") else None,
        "readmeSnippet": readme_snippet,
        "defaultBranch": default_branch,
    }
