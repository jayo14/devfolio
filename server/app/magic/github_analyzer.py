import asyncio
import json
import os
import re
import httpx

# Comprehensive mapping categorized by architectural domain
DOMAIN_FRAMEWORKS = {
    "frontend": {
        "react": "React",
        "react-dom": "React",
        "next": "Next.js",
        "@next": "Next.js",
        "vue": "Vue.js",
        "nuxt": "Nuxt",
        "svelte": "Svelte",
        "@sveltejs/kit": "SvelteKit",
        "astro": "Astro",
        "@remix-run": "Remix",
        "angular": "Angular",
        "@angular/core": "Angular",
        "solid-js": "Solid.js",
        "qwik": "Qwik",
        "tailwindcss": "Tailwind CSS",
        "@tailwindcss": "Tailwind CSS",
        "three": "Three.js",
        "@types/three": "Three.js",
        "@react-three/fiber": "React Three Fiber (R3F)",
        "framer-motion": "Framer Motion",
        "motion": "Framer Motion",
        "gsap": "GSAP",
        "zustand": "Zustand",
        "redux": "Redux",
        "@reduxjs/toolkit": "Redux Toolkit",
        "jotai": "Jotai",
        "recoil": "Recoil",
        "@tanstack/react-query": "TanStack Query",
        "radix-ui": "Radix UI",
        "@radix-ui": "Radix UI",
        "shadcn": "Shadcn UI",
        "@chakra-ui": "Chakra UI",
        "@mui/material": "Material UI",
        "vite": "Vite",
        "webpack": "Webpack",
        "electron": "Electron",
        "tauri": "Tauri",
    },
    "mobile": {
        "react-native": "React Native",
        "expo": "Expo",
        "@react-navigation": "React Navigation",
        "react-native-reanimated": "React Native Reanimated",
        "flutter": "Flutter",
        "capacitor": "Capacitor",
        "@capacitor/core": "Capacitor",
        "ionic": "Ionic",
        "@ionic/react": "Ionic",
        "nativewind": "NativeWind",
    },
    "backend": {
        "fastapi": "FastAPI",
        "flask": "Flask",
        "django": "Django",
        "express": "Express",
        "@nestjs/core": "NestJS",
        "nest": "NestJS",
        "hono": "Hono",
        "fastify": "Fastify",
        "koa": "Koa",
        "@trpc/server": "tRPC",
        "trpc": "tRPC",
        "prisma": "Prisma",
        "@prisma/client": "Prisma",
        "drizzle-orm": "Drizzle ORM",
        "typeorm": "TypeORM",
        "sqlalchemy": "SQLAlchemy",
        "alembic": "Alembic",
        "celery": "Celery",
        "spring": "Spring Boot",
        "actix-web": "Actix Web",
        "axum": "Axum",
        "gin-gonic": "Gin",
        "fiber": "Fiber",
        "rails": "Ruby on Rails",
    },
    "ai_ml": {
        "torch": "PyTorch",
        "pytorch": "PyTorch",
        "torchvision": "PyTorch Vision",
        "tensorflow": "TensorFlow",
        "keras": "Keras",
        "jax": "JAX",
        "scikit-learn": "Scikit-Learn",
        "transformers": "Hugging Face Transformers",
        "diffusers": "Hugging Face Diffusers",
        "datasets": "Hugging Face Datasets",
        "huggingface": "Hugging Face",
        "langchain": "LangChain",
        "langchain-core": "LangChain",
        "llamaindex": "LlamaIndex",
        "llama-index": "LlamaIndex",
        "openai": "OpenAI",
        "anthropic": "Anthropic",
        "google-generativeai": "Google Gemini",
        "google-genai": "Google Gemini",
        "chromadb": "ChromaDB",
        "pinecone": "Pinecone",
        "weaviate": "Weaviate",
        "qdrant-client": "Qdrant",
        "qdrant": "Qdrant",
        "pgvector": "pgvector",
        "vllm": "vLLM",
        "ollama": "Ollama",
        "crewai": "CrewAI",
        "autogen": "AutoGen",
        "pandas": "Pandas",
        "numpy": "NumPy",
    },
    "database": {
        "postgres": "PostgreSQL",
        "postgresql": "PostgreSQL",
        "psycopg": "PostgreSQL (psycopg)",
        "psycopg2": "PostgreSQL",
        "mysql": "MySQL",
        "sqlite": "SQLite",
        "sqlite3": "SQLite",
        "mongodb": "MongoDB",
        "mongoose": "MongoDB (Mongoose)",
        "redis": "Redis",
        "ioredis": "Redis",
        "supabase": "Supabase",
        "@supabase/supabase-js": "Supabase",
        "neon": "Neon",
        "@neondatabase/serverless": "Neon",
        "firebase": "Firebase",
        "firebase-admin": "Firebase",
    },
    "devops": {
        "docker": "Docker",
        "docker-compose": "Docker Compose",
        "kubernetes": "Kubernetes",
        "helm": "Helm",
        "terraform": "Terraform",
        "github-actions": "GitHub Actions",
        "aws": "AWS",
        "boto3": "AWS S3 / SDK",
        "@aws-sdk/client-s3": "AWS S3",
    },
}

# Flat lookup for backwards compatibility
FLAT_FRAMEWORKS = {}
for domain, mapping in DOMAIN_FRAMEWORKS.items():
    for key, val in mapping.items():
        FLAT_FRAMEWORKS[key] = val

IGNORED_PATH_SEGMENTS = {
    ".git", "node_modules", "dist", "build", ".next", ".nuxt", ".svelte-kit",
    ".output", "target", ".venv", "venv", "env", "__pycache__", ".turbo",
    ".gradle", "Pods", ".cache", "vendor"
}


def should_skip_path(path: str) -> bool:
    parts = path.split("/")
    return any(p in IGNORED_PATH_SEGMENTS for p in parts)


async def inspect_github_repo(owner: str, repo: str, timeout: float = 15.0) -> dict:
    """Inspects a GitHub repository including Monorepos (frontend, backend, mobile/expo, ai/ml)."""
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
        # 1. Fetch repository metadata
        resp = await client.get(api_url, headers=headers)
        if resp.status_code == 200:
            repo_data = resp.json()
        elif resp.status_code == 404:
            raise ValueError(f"GitHub repository '{owner}/{repo}' was not found or is private.")
        else:
            repo_data = {"name": repo, "description": "", "topics": []}

        # 2. Fetch repository languages
        lang_resp = await client.get(f"{api_url}/languages", headers=headers)
        if lang_resp.status_code == 200:
            languages_data = lang_resp.json()

        default_branch = repo_data.get("default_branch", "main")

        # 3. Discover file tree (Monorepo & multi-package discovery)
        tree_paths = []
        tree_url = f"{api_url}/git/trees/{default_branch}?recursive=1"
        try:
            tree_resp = await client.get(tree_url, headers=headers)
            if tree_resp.status_code == 200:
                raw_tree = tree_resp.json().get("tree", [])
                tree_paths = [item["path"] for item in raw_tree if not should_skip_path(item.get("path", ""))]
        except Exception:
            pass

        # Fallback if tree was unavailable or rate-limited
        if not tree_paths:
            tree_paths = [
                "package.json", "requirements.txt", "pyproject.toml", "Dockerfile", "docker-compose.yml",
                "README.md", "turbo.json", "pnpm-workspace.yaml",
                "frontend/package.json", "client/package.json", "web/package.json",
                "backend/requirements.txt", "backend/pyproject.toml", "backend/package.json",
                "server/requirements.txt", "server/package.json", "server/Dockerfile",
                "apps/web/package.json", "apps/client/package.json", "apps/api/package.json",
                "mobile/package.json", "mobile/app.json", "apps/mobile/package.json",
                "ai/requirements.txt", "ml/requirements.txt",
            ]

        # 4. Identify monorepo markers & relevant manifests across directories
        is_monorepo = False
        monorepo_type = None

        if any(p == "turbo.json" for p in tree_paths):
            is_monorepo = True
            monorepo_type = "Turborepo"
        elif any(p == "pnpm-workspace.yaml" for p in tree_paths):
            is_monorepo = True
            monorepo_type = "pnpm Workspaces"
        elif any(p in ("lerna.json", "nx.json") for p in tree_paths):
            is_monorepo = True
            monorepo_type = "Lerna / Nx Monorepo"

        manifest_targets = []
        seen_targets = set()

        def add_target(p):
            if p in tree_paths and p not in seen_targets:
                seen_targets.add(p)
                manifest_targets.append(p)

        # Always check README and root files
        for root_file in ["README.md", "package.json", "requirements.txt", "pyproject.toml", "Dockerfile", "docker-compose.yml"]:
            add_target(root_file)

        # Scan for all subproject manifests in monorepos
        for p in tree_paths:
            base = p.split("/")[-1]
            if base in ("package.json", "requirements.txt", "pyproject.toml", "app.json", "Dockerfile"):
                add_target(p)
            if len(manifest_targets) >= 12:  # Cap at 12 key manifests to preserve performance
                break

        # If more than 1 package.json or multi-directory structure detected
        package_json_count = sum(1 for p in tree_paths if p.endswith("package.json"))
        has_server_and_client = (
            any(p.startswith(("frontend/", "client/", "web/", "apps/web", "apps/client")) for p in tree_paths)
            and any(p.startswith(("backend/", "server/", "api/", "apps/api", "apps/server")) for p in tree_paths)
        )
        if package_json_count > 1 or has_server_and_client:
            is_monorepo = True
            if not monorepo_type:
                monorepo_type = "Full-Stack Monorepo"

        # 5. Concurrently fetch manifests via raw content
        manifest_contents = {}

        async def fetch_manifest(filename):
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{filename}"
            try:
                raw_resp = await client.get(raw_url, headers=headers)
                if raw_resp.status_code == 200:
                    return filename, raw_resp.text
            except Exception:
                pass
            return filename, ""

        fetch_results = await asyncio.gather(*(fetch_manifest(p) for p in manifest_targets))
        for filename, content in fetch_results:
            if content:
                manifest_contents[filename] = content

    # 6. Analyze Stack by Architectural Domains
    categorized_stack = {
        "frontend": set(),
        "mobile": set(),
        "backend": set(),
        "ai_ml": set(),
        "database": set(),
        "devops": set(),
    }
    all_technologies = set()
    subprojects = []

    # Add GitHub detected languages
    for lang in languages_data.keys():
        all_technologies.add(lang)
        if lang in ("JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Svelte"):
            categorized_stack["frontend"].add(lang)
        elif lang in ("Python", "Go", "Rust", "Java", "Kotlin", "PHP", "Ruby", "C#"):
            categorized_stack["backend"].add(lang)

    # Check for Docker presence in file tree
    if any("dockerfile" in p.lower() or "docker-compose" in p.lower() for p in tree_paths):
        categorized_stack["devops"].add("Docker")
        all_technologies.add("Docker")

    # Check for GitHub Actions in file tree
    if any(p.startswith(".github/workflows/") for p in tree_paths):
        categorized_stack["devops"].add("GitHub Actions")
        all_technologies.add("GitHub Actions")

    # Inspect each manifest file
    for filename, content in manifest_contents.items():
        sub_folder = filename.rsplit("/", 1)[0] if "/" in filename else "root"
        sub_techs = set()

        if filename.endswith("package.json"):
            try:
                pkg = json.loads(content)
                # Check root workspaces
                if "workspaces" in pkg:
                    is_monorepo = True
                    if not monorepo_type:
                        monorepo_type = "NPM/Yarn Workspaces"

                deps = {
                    **pkg.get("dependencies", {}),
                    **pkg.get("devDependencies", {}),
                    **pkg.get("peerDependencies", {}),
                }

                for dep_name in deps.keys():
                    lower_dep = dep_name.lower()
                    for domain, mapping in DOMAIN_FRAMEWORKS.items():
                        for pattern, label in mapping.items():
                            if pattern in lower_dep:
                                categorized_stack[domain].add(label)
                                all_technologies.add(label)
                                sub_techs.add(label)

                # Special React Native / Expo detection
                if "react-native" in deps or "expo" in deps:
                    categorized_stack["mobile"].add("React Native")
                    all_technologies.add("React Native")
                    if "expo" in deps:
                        categorized_stack["mobile"].add("Expo")
                        all_technologies.add("Expo")

                if sub_techs:
                    subprojects.append({
                        "path": sub_folder,
                        "manifest": filename,
                        "technologies": sorted(list(sub_techs)),
                    })
            except Exception:
                pass

        elif filename.endswith("app.json"):
            # Expo configuration file
            if "expo" in content.lower():
                categorized_stack["mobile"].add("Expo")
                categorized_stack["mobile"].add("React Native")
                all_technologies.add("Expo")
                all_technologies.add("React Native")
                subprojects.append({
                    "path": sub_folder,
                    "manifest": filename,
                    "technologies": ["Expo", "React Native"],
                })

        elif filename.endswith(("requirements.txt", "pyproject.toml", "Pipfile")):
            lower_text = content.lower()
            for domain, mapping in DOMAIN_FRAMEWORKS.items():
                for pattern, label in mapping.items():
                    if re.search(rf"\b{re.escape(pattern)}\b", lower_text):
                        categorized_stack[domain].add(label)
                        all_technologies.add(label)
                        sub_techs.add(label)
            if sub_techs:
                subprojects.append({
                    "path": sub_folder,
                    "manifest": filename,
                    "technologies": sorted(list(sub_techs)),
                })

    # Add GitHub repository topics
    for topic in repo_data.get("topics", []):
        topic_title = topic.replace("-", " ").title()
        if len(topic_title) < 22:
            all_technologies.add(topic_title)

    # Infer Architecture Summary
    if is_monorepo:
        if categorized_stack["mobile"] and categorized_stack["frontend"] and categorized_stack["backend"]:
            architecture = "Multi-Platform Monorepo (Web, Mobile & API)"
        elif categorized_stack["mobile"]:
            architecture = "Mobile & Backend Monorepo"
        elif categorized_stack["ai_ml"]:
            architecture = "AI / ML Full-Stack Monorepo"
        elif monorepo_type:
            architecture = f"{monorepo_type} (Full-Stack)"
        else:
            architecture = "Full-Stack Monorepo"
    elif categorized_stack["mobile"]:
        architecture = "Mobile Application (React Native / Expo)"
    elif categorized_stack["ai_ml"]:
        architecture = "AI / Machine Learning Platform"
    elif categorized_stack["frontend"] and categorized_stack["backend"]:
        architecture = "Full-Stack Web Application"
    elif categorized_stack["frontend"]:
        architecture = "Frontend Web Application"
    elif categorized_stack["backend"]:
        architecture = "Backend Service & API"
    else:
        architecture = "Software Application"

    readme_snippet = manifest_contents.get("README.md", "")[:1500]

    return {
        "name": repo_data.get("name", repo),
        "fullName": f"{owner}/{repo}",
        "description": repo_data.get("description") or "",
        "languages": list(languages_data.keys()),
        "technologies": sorted(list(all_technologies)),
        "isMonorepo": is_monorepo,
        "monorepoType": monorepo_type,
        "architecture": architecture,
        "stack": {k: sorted(list(v)) for k, v in categorized_stack.items()},
        "subprojects": subprojects,
        "stars": repo_data.get("stargazers_count", 0),
        "license": repo_data.get("license", {}).get("spdx_id") if repo_data.get("license") else None,
        "readmeSnippet": readme_snippet,
        "defaultBranch": default_branch,
    }
