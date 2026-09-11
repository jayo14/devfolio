from datetime import datetime
import json
import os
import re
import httpx


def synthesize_project_intelligence(website_data: dict, repo_data: dict) -> dict:
    """Combines verified website facts and repository analysis into structured project intelligence."""
    # 1. Determine clean Project Name
    name = ""
    # Priority: repo name formatted, or website title cleaned
    repo_name = repo_data.get("name", "")
    if repo_name:
        clean_repo_name = re.sub(r"[-_]+", " ", repo_name).title()
        name = clean_repo_name
    elif website_data.get("title"):
        # Strip generic suffixes like " | Home", " - Welcome", " Official Website"
        web_title = website_data.get("title", "")
        clean_title = re.split(r"\s+[\|\-\–\—]\s+", web_title)[0].strip()
        name = clean_title or web_title

    if not name:
        name = "Featured Project"

    # 2. Determine Description
    description = ""
    repo_desc = repo_data.get("description", "").strip()
    web_desc = website_data.get("description", "").strip()

    if repo_desc and len(repo_desc) > 20:
        description = repo_desc
    elif web_desc and len(web_desc) > 20:
        description = web_desc
    elif repo_data.get("readmeSnippet"):
        lines = [line.strip("#* \t") for line in repo_data.get("readmeSnippet", "").split("\n") if line.strip()]
        for line in lines[1:5]:
            if len(line) > 30:
                description = line
                break

    if not description:
        description = f"{name} is a modern digital application designed with a focus on seamless user experience and robust architecture."

    # 3. Determine Field & Category
    technologies = repo_data.get("technologies", [])
    languages = repo_data.get("languages", [])
    all_techs = sorted(list(set(technologies + languages)))

    field = "Full-Stack Development"
    category = "Web Application"

    tech_str = " ".join(all_techs).lower()
    text_corpus = (name + " " + description + " " + tech_str).lower()

    if any(k in text_corpus for k in ["fintech", "finance", "crypto", "banking", "payment"]):
        field = "FinTech"
        category = "Financial Platform"
    elif any(k in text_corpus for k in ["nft", "web3", "blockchain", "solana", "ethereum"]):
        field = "Web3 / Blockchain"
        category = "Decentralized Application"
    elif any(k in text_corpus for k in ["ai", "machine learning", "llm", "gpt", "model"]):
        field = "Artificial Intelligence"
        category = "AI Application"
    elif any(k in text_corpus for k in ["e-commerce", "shop", "store", "cart", "commerce"]):
        field = "E-Commerce"
        category = "Digital Storefront"
    elif any(k in text_corpus for k in ["design", "studio", "portfolio", "creative", "agency"]):
        field = "Product Design & Development"
        category = "Creative Showcase"
    elif "react" in tech_str or "next" in tech_str or "vue" in tech_str:
        field = "Frontend & UI Architecture"
        category = "Web Application"

    # 4. Inferred Client
    client = name
    if repo_data.get("fullName"):
        owner = repo_data["fullName"].split("/")[0]
        if owner and len(owner) < 30:
            client = owner

    # 5. Role
    role = "Design & Full-Stack Development"

    # 6. Completed Date
    completed_date = datetime.now().strftime("%Y-%m-%d")

    return {
        "name": name,
        "description": description,
        "category": category,
        "client": client,
        "field": field,
        "role": role,
        "completedDate": completed_date,
        "technologies": all_techs[:12],
        "theme": website_data.get("theme", {}),
    }


async def generate_project_intelligence(website_data: dict, repo_data: dict) -> dict:
    """Generates project intelligence.

    If an AI API key (GEMINI_API_KEY / OPENAI_API_KEY) is available, calls the LLM
    for synthesis; otherwise uses the deterministic analyzer.
    """
    base_intelligence = synthesize_project_intelligence(website_data, repo_data)

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            prompt = f"""
You are a portfolio copywriter. Given the following facts about a project, provide a JSON object with:
- "name": clean, punchy project title
- "description": 2-3 concise, professional sentences highlighting its purpose and strengths
- "category": primary category
- "client": client or creator name
- "field": primary field
- "role": creator role

Facts:
- Website Title: {website_data.get('title')}
- Website Description: {website_data.get('description')}
- Headings: {website_data.get('headings')}
- Repository: {repo_data.get('fullName')}
- Technologies: {repo_data.get('technologies')}
- Repo Description: {repo_data.get('description')}

Respond ONLY with valid JSON.
"""
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    url,
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                )
                if res.status_code == 200:
                    text_resp = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                    clean_json = re.search(r"\{.*\}", text_resp, re.DOTALL)
                    if clean_json:
                        ai_data = json.loads(clean_json.group(0))
                        base_intelligence.update({
                            "name": ai_data.get("name", base_intelligence["name"]),
                            "description": ai_data.get("description", base_intelligence["description"]),
                            "category": ai_data.get("category", base_intelligence["category"]),
                            "client": ai_data.get("client", base_intelligence["client"]),
                            "field": ai_data.get("field", base_intelligence["field"]),
                            "role": ai_data.get("role", base_intelligence["role"]),
                        })
        except Exception:
            pass

    return base_intelligence
