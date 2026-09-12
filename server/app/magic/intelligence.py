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

    # 7. Strategic Pillars (Summary, Problem, Who/Audience, Solution, Why Now)
    summary = web_desc or repo_desc or f"{name} is an innovative solution built to streamline digital workflows and deliver high-performance user experiences."
    if len(summary) > 220:
        summary = summary[:217].rsplit(" ", 1)[0] + "..."

    if "ai" in text_corpus or "agent" in text_corpus or "model" in text_corpus or "llm" in text_corpus:
        problem = "Navigating complex workflows and synthesizing disparate data streams currently requires tedious manual effort, slowing down decision-making and operational throughput."
        target_audience = "Fast-moving product teams, analysts, and knowledge workers seeking automated, intelligent tooling to eliminate repetitive cognitive labor."
        solution = f"{name} leverages intelligent automation and a modular architecture to streamline complex tasks with instant, contextual execution."
        why_now = "Rapid advances in open AI foundation models and developer tooling make intelligent agentic orchestration practical, reliable, and cost-effective today."
    elif "fintech" in text_corpus or "crypto" in text_corpus or "finance" in text_corpus:
        problem = "Fragmented financial systems and legacy interfaces lead to transaction latency, opacity, and excessive overhead for modern digital users."
        target_audience = "Digital-first consumers, financial institutions, and modern businesses demanding secure, real-time transaction rails and clear accounting."
        solution = f"{name} introduces a unified, transparent transaction architecture that guarantees security, speed, and real-time reconciliation."
        why_now = "Global regulatory clarity and the mainstream adoption of instant payment protocols make this the ideal inflection point for modern financial tooling."
    elif "e-commerce" in text_corpus or "shop" in text_corpus or "store" in text_corpus:
        problem = "Traditional online storefronts suffer from slow load times, high bounce rates, and cumbersome checkout flows that reduce buyer conversion."
        target_audience = "Direct-to-consumer merchants and online retail businesses looking to maximize customer conversion, retention, and average order value."
        solution = f"{name} delivers a blazing-fast, headless shopping experience with optimized friction-free conversion paths."
        why_now = "Modern consumers demand sub-second mobile page loads and edge computing now enables global personalization at zero latency penalty."
    else:
        problem = "Legacy architectures and fragmented tools create excessive complexity, high maintenance overhead, and subpar user experiences."
        target_audience = "Modern engineering teams, business operators, and digital users who need reliable, intuitive tools to accomplish daily objectives."
        solution = f"{name} solves this through a clean, unified system with a responsive user interface and robust backend integration."
        why_now = "The confluence of modern cloud primitives, lightning-fast frontend frameworks, and distributed APIs makes unified architectures faster to build and scale than ever."

    return {
        "name": name,
        "description": description,
        "summary": summary,
        "problem": problem,
        "targetAudience": target_audience,
        "target_audience": target_audience,
        "solution": solution,
        "whyNow": why_now,
        "why_now": why_now,
        "category": category,
        "client": client,
        "field": field,
        "role": role,
        "completedDate": completed_date,
        "technologies": all_techs[:12],
        "theme": website_data.get("theme", {}),
    }


def _parse_llm_json(text: str) -> dict | None:
    """Robustly extracts and parses a JSON dictionary from LLM responses."""
    if not text:
        return None
    # Strip markdown code blocks if present
    cleaned = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"\s*```$", "", cleaned.strip(), flags=re.MULTILINE)

    # 1. Try direct parse
    try:
        data = json.loads(cleaned.strip())
        if isinstance(data, dict):
            return data
    except Exception:
        pass

    # 2. Extract substring between first { and last }
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(0))
            if isinstance(data, dict):
                return data
        except Exception:
            pass

    return None


async def generate_project_intelligence(website_data: dict, repo_data: dict) -> dict:
    """Generates project intelligence with strategic pillars (problem, who, solution, why now, summary).

    If an AI API key (GEMINI_API_KEY) is available, calls Gemini for deep synthesis;
    otherwise gracefully uses the deterministic strategic analyzer.
    """
    base_intelligence = synthesize_project_intelligence(website_data, repo_data)

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            readme_snippet = (repo_data.get("readmeSnippet") or "")[:1200]
            prompt = f"""You are an elite technology venture strategist and portfolio copywriter.
Analyze the following verified facts from a deployed project's website and GitHub repository:

Website Title: {website_data.get('title')}
Website Description: {website_data.get('description')}
Website Headings: {website_data.get('headings')}
Repository Name: {repo_data.get('fullName')}
Repository Description: {repo_data.get('description')}
Repository README snippet: {readme_snippet}
Technologies: {repo_data.get('technologies')}
Languages: {repo_data.get('languages')}

Produce a thorough, deeply compelling project analysis in JSON format with exactly these keys:
- "name": Clean, punchy project title
- "summary": A crisp 1-2 sentence executive summary of what the project is and why it matters
- "description": A thorough, engaging description explaining what the product does, its architecture, and real-world value
- "problem": The concrete problem, inefficiency, or pain point currently facing users or the industry
- "targetAudience": The "who" — the specific people, professions, or customer segments facing this problem that would pay for or adopt this solution
- "solution": The solution and its unique approach — what makes this specific implementation, architecture, or product strategy distinct and effective
- "whyNow": "Why now?" — why this is the ideal inflection point for this product to succeed (e.g. recent technological advancements, market shifts, adoption dynamics)
- "category": Primary category (e.g. AI Workflow Platform, FinTech Engine, Developer Infrastructure)
- "client": Creator or organization
- "field": Primary technical discipline
- "role": Creator role (e.g. Lead Architect & Full-Stack Engineer)

Output ONLY valid JSON. Do not include markdown preamble or trailing commentary."""

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.post(
                    url,
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                )
                if res.status_code == 200:
                    candidates = res.json().get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            text_resp = parts[0].get("text", "")
                            ai_data = _parse_llm_json(text_resp)
                            if ai_data:
                                target_aud = ai_data.get("targetAudience") or ai_data.get("who") or ai_data.get("target_audience") or base_intelligence["targetAudience"]
                                why_now_val = ai_data.get("whyNow") or ai_data.get("why_now") or base_intelligence["whyNow"]

                                base_intelligence.update({
                                    "name": ai_data.get("name") or base_intelligence["name"],
                                    "summary": ai_data.get("summary") or base_intelligence["summary"],
                                    "description": ai_data.get("description") or base_intelligence["description"],
                                    "problem": ai_data.get("problem") or base_intelligence["problem"],
                                    "targetAudience": target_aud,
                                    "target_audience": target_aud,
                                    "solution": ai_data.get("solution") or base_intelligence["solution"],
                                    "whyNow": why_now_val,
                                    "why_now": why_now_val,
                                    "category": ai_data.get("category") or base_intelligence["category"],
                                    "client": ai_data.get("client") or base_intelligence["client"],
                                    "field": ai_data.get("field") or base_intelligence["field"],
                                    "role": ai_data.get("role") or base_intelligence["role"],
                                })
        except Exception:
            pass

    return base_intelligence
