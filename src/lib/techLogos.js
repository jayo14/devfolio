/**
 * Tech Logo Service & Registry
 * Maps technologies across all domains (frontend, mobile, backend, AI/ML, database, devops)
 * to 3rd-party vector SVG logo endpoints matching Devfolio's dark brutalist theme.
 */

// Custom high-contrast SVG for technologies without standard SimpleIcons slugs
const JAX_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="16" fill="%23111111"/><path d="M26 28h12v30c0 5-3 9-9 9-4 0-7-2-8-5l6-4c1 1 2 2 4 2 2 0 3-1 3-3V28z" fill="%23ffffff"/><path d="M46 67V28h11l10 17 10-17h11v39H77V46L68 62h-3L56 46v21H46z" fill="%23ffffff"/></svg>`;
const NEON_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"><path d="M12 2L2 19.5h7.5L12 14.5l2.5 5H22L12 2z"/></svg>`;
const AWS_SVG = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg`;

export const TECH_SLUG_MAP = {
  // ── AI & ML ───────────────────────────────────────────────
  anthropic: { name: "Anthropic", slug: "anthropic", domain: "ai_ml" },
  "claude": { name: "Anthropic", slug: "anthropic", domain: "ai_ml" },
  "google gemini": { name: "Google Gemini", slug: "googlegemini", domain: "ai_ml" },
  gemini: { name: "Google Gemini", slug: "googlegemini", domain: "ai_ml" },
  langchain: { name: "LangChain", slug: "langchain", domain: "ai_ml" },
  "langchain-core": { name: "LangChain", slug: "langchain", domain: "ai_ml" },
  llamaindex: { name: "LlamaIndex", slug: "llamaindex", domain: "ai_ml" },
  "llama-index": { name: "LlamaIndex", slug: "llamaindex", domain: "ai_ml" },
  pytorch: { name: "PyTorch", slug: "pytorch", domain: "ai_ml" },
  torch: { name: "PyTorch", slug: "pytorch", domain: "ai_ml" },
  tensorflow: { name: "TensorFlow", slug: "tensorflow", domain: "ai_ml" },
  keras: { name: "Keras", slug: "keras", domain: "ai_ml" },
  jax: { name: "JAX", customUrl: JAX_SVG, domain: "ai_ml" },
  "google jax": { name: "JAX", customUrl: JAX_SVG, domain: "ai_ml" },
  huggingface: { name: "Hugging Face", slug: "huggingface", domain: "ai_ml" },
  "hugging face": { name: "Hugging Face", slug: "huggingface", domain: "ai_ml" },
  "transformers": { name: "Hugging Face", slug: "huggingface", domain: "ai_ml" },
  pandas: { name: "Pandas", slug: "pandas", domain: "ai_ml" },
  numpy: { name: "NumPy", slug: "numpy", domain: "ai_ml" },
  scikitlearn: { name: "Scikit-Learn", slug: "scikitlearn", domain: "ai_ml" },
  "scikit-learn": { name: "Scikit-Learn", slug: "scikitlearn", domain: "ai_ml" },
  ollama: { name: "Ollama", slug: "ollama", domain: "ai_ml" },
  chromadb: { name: "ChromaDB", slug: "chroma", domain: "ai_ml" },
  chroma: { name: "ChromaDB", slug: "chroma", domain: "ai_ml" },
  qdrant: { name: "Qdrant", slug: "qdrant", domain: "ai_ml" },
  pinecone: { name: "Pinecone", slug: "pinecone", domain: "ai_ml" },

  // ── Frontend ──────────────────────────────────────────────
  css: { name: "CSS", slug: "css", domain: "frontend" },
  css3: { name: "CSS3", slug: "css", domain: "frontend" },
  html: { name: "HTML", slug: "html5", domain: "frontend" },
  html5: { name: "HTML5", slug: "html5", domain: "frontend" },
  javascript: { name: "JavaScript", slug: "javascript", domain: "frontend" },
  js: { name: "JavaScript", slug: "javascript", domain: "frontend" },
  typescript: { name: "TypeScript", slug: "typescript", domain: "frontend" },
  ts: { name: "TypeScript", slug: "typescript", domain: "frontend" },
  react: { name: "React", slug: "react", domain: "frontend" },
  "framer motion": { name: "Framer Motion", slug: "framer", domain: "frontend" },
  framer: { name: "Framer", slug: "framer", domain: "frontend" },
  "next.js": { name: "Next.js", slug: "nextdotjs", domain: "frontend" },
  nextjs: { name: "Next.js", slug: "nextdotjs", domain: "frontend" },
  next: { name: "Next.js", slug: "nextdotjs", domain: "frontend" },
  "tailwind css": { name: "Tailwind CSS", slug: "tailwindcss", domain: "frontend" },
  tailwindcss: { name: "Tailwind CSS", slug: "tailwindcss", domain: "frontend" },
  tailwind: { name: "Tailwind CSS", slug: "tailwindcss", domain: "frontend" },
  "three.js": { name: "Three.js", slug: "threedotjs", domain: "frontend" },
  threejs: { name: "Three.js", slug: "threedotjs", domain: "frontend" },
  three: { name: "Three.js", slug: "threedotjs", domain: "frontend" },
  r3f: { name: "Three.js", slug: "threedotjs", domain: "frontend" },
  vite: { name: "Vite", slug: "vite", domain: "frontend" },
  webpack: { name: "Webpack", slug: "webpack", domain: "frontend" },
  vue: { name: "Vue.js", slug: "vuedotjs", domain: "frontend" },
  "vue.js": { name: "Vue.js", slug: "vuedotjs", domain: "frontend" },
  svelte: { name: "Svelte", slug: "svelte", domain: "frontend" },
  angular: { name: "Angular", slug: "angular", domain: "frontend" },
  redux: { name: "Redux", slug: "redux", domain: "frontend" },
  gsap: { name: "GSAP", slug: "greensock", domain: "frontend" },
  electron: { name: "Electron", slug: "electron", domain: "frontend" },
  tauri: { name: "Tauri", slug: "tauri", domain: "frontend" },

  // ── Mobile ────────────────────────────────────────────────
  expo: { name: "Expo", slug: "expo", domain: "mobile" },
  "react native": { name: "React Native", slug: "react", domain: "mobile" },
  "react-native": { name: "React Native", slug: "react", domain: "mobile" },
  flutter: { name: "Flutter", slug: "flutter", domain: "mobile" },
  ionic: { name: "Ionic", slug: "ionic", domain: "mobile" },
  capacitor: { name: "Capacitor", slug: "capacitor", domain: "mobile" },
  swift: { name: "Swift", slug: "swift", domain: "mobile" },
  kotlin: { name: "Kotlin", slug: "kotlin", domain: "mobile" },

  // ── Backend ───────────────────────────────────────────────
  python: { name: "Python", slug: "python", domain: "backend" },
  fastapi: { name: "FastAPI", slug: "fastapi", domain: "backend" },
  django: { name: "Django", slug: "django", domain: "backend" },
  flask: { name: "Flask", slug: "flask", domain: "backend" },
  celery: { name: "Celery", slug: "celery", domain: "backend" },
  "node.js": { name: "Node.js", slug: "nodedotjs", domain: "backend" },
  nodejs: { name: "Node.js", slug: "nodedotjs", domain: "backend" },
  node: { name: "Node.js", slug: "nodedotjs", domain: "backend" },
  express: { name: "Express", slug: "express", domain: "backend" },
  nestjs: { name: "NestJS", slug: "nestjs", domain: "backend" },
  "spring boot": { name: "Spring Boot", slug: "springboot", domain: "backend" },
  spring: { name: "Spring Boot", slug: "springboot", domain: "backend" },
  graphql: { name: "GraphQL", slug: "graphql", domain: "backend" },
  trpc: { name: "tRPC", slug: "trpc", domain: "backend" },
  prisma: { name: "Prisma", slug: "prisma", domain: "backend" },
  go: { name: "Go", slug: "go", domain: "backend" },
  golang: { name: "Go", slug: "go", domain: "backend" },
  rust: { name: "Rust", slug: "rust", domain: "backend" },
  php: { name: "PHP", slug: "php", domain: "backend" },
  laravel: { name: "Laravel", slug: "laravel", domain: "backend" },
  "ruby on rails": { name: "Ruby on Rails", slug: "rubyonrails", domain: "backend" },
  rails: { name: "Ruby on Rails", slug: "rubyonrails", domain: "backend" },

  // ── Database ──────────────────────────────────────────────
  postgresql: { name: "PostgreSQL", slug: "postgresql", domain: "database" },
  postgres: { name: "PostgreSQL", slug: "postgresql", domain: "database" },
  mysql: { name: "MySQL", slug: "mysql", domain: "database" },
  sqlite: { name: "SQLite", slug: "sqlite", domain: "database" },
  mongodb: { name: "MongoDB", slug: "mongodb", domain: "database" },
  redis: { name: "Redis", slug: "redis", domain: "database" },
  supabase: { name: "Supabase", slug: "supabase", domain: "database" },
  firebase: { name: "Firebase", slug: "firebase", domain: "database" },
  neon: { name: "Neon", customUrl: NEON_SVG, domain: "database" },

  // ── DevOps & Infrastructure ───────────────────────────────
  docker: { name: "Docker", slug: "docker", domain: "devops" },
  dockerfile: { name: "Dockerfile", slug: "docker", domain: "devops" },
  "docker-compose": { name: "Docker Compose", slug: "docker", domain: "devops" },
  "github actions": { name: "GitHub Actions", slug: "githubactions", domain: "devops" },
  "github-actions": { name: "GitHub Actions", slug: "githubactions", domain: "devops" },
  helm: { name: "Helm", slug: "helm", domain: "devops" },
  kubernetes: { name: "Kubernetes", slug: "kubernetes", domain: "devops" },
  k8s: { name: "Kubernetes", slug: "kubernetes", domain: "devops" },
  terraform: { name: "Terraform", slug: "terraform", domain: "devops" },
  git: { name: "Git", slug: "git", domain: "devops" },
  github: { name: "GitHub", slug: "github", domain: "devops" },
  vercel: { name: "Vercel", slug: "vercel", domain: "devops" },
  aws: { name: "AWS", customUrl: AWS_SVG, domain: "devops" },
};

/**
 * Normalizes raw tech names and constructs the CDN SVG URL matching the dark theme.
 * @param {string} raw - Raw technology name, e.g. "Django", "dockerfile", "Framer Motion"
 * @param {object} [options]
 * @param {string} [options.color="white"] - Theme color for the SVG ("white", "ff4f22", or official brand)
 */
export function getTechLogoInfo(raw, options = {}) {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim();
  const lower = cleaned.toLowerCase().replace(/[^a-z0-9\s.-]/g, "").trim();

  // Direct lookup or fuzzy match
  const match = TECH_SLUG_MAP[lower] ||
    TECH_SLUG_MAP[lower.replace(/\s+/g, "")] ||
    TECH_SLUG_MAP[lower.replace(/[^a-z0-9]/g, "")];

  const displayName = match?.name || cleaned;
  const color = options.color || "white";

  if (match?.customUrl) {
    return {
      name: displayName,
      url: match.customUrl,
      slug: match.slug || lower,
      domain: match.domain || "other",
    };
  }

  const slug = match?.slug || lower.replace(/[^a-z0-9]/g, "");
  // Simple Icons CDN provides theme color support directly in the path (e.g. /white)
  const url = color === "brand"
    ? `https://cdn.simpleicons.org/${slug}`
    : `https://cdn.simpleicons.org/${slug}/${color}`;

  return {
    name: displayName,
    url,
    slug,
    domain: match?.domain || "other",
  };
}

/**
 * Extracts a list of technologies used for a project.
 * Supports:
 *  1. Direct project.technologies array/string
 *  2. Embedded <!--technologies:[...]--> comment in project.description
 *  3. Automatic inference from field, role, title, and description keywords
 *  4. Fallback defaults for static showcase items
 */
export function extractProjectTechnologies(project) {
  if (!project) return [];

  // 1. Direct field (if populated by API or store)
  if (Array.isArray(project.technologies) && project.technologies.length > 0) {
    return project.technologies;
  }
  if (typeof project.technologies === "string" && project.technologies.trim()) {
    try {
      const parsed = JSON.parse(project.technologies);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      return project.technologies.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  // 2. Embedded comment in description
  const desc = project.description || "";
  const commentMatch = desc.match(/<!--technologies:\s*(\[.*?\])\s*-->/s);
  if (commentMatch) {
    try {
      const parsed = JSON.parse(commentMatch[1]);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // Ignore parse failure and fall through
    }
  }

  // 3. Fallback inference based on project text content
  const searchable = `${project.title || ""} ${project.field || ""} ${project.role || ""} ${project.summary || ""} ${project.solution || ""} ${desc}`.toLowerCase();
  const detected = new Set();

  const INFERENCE_RULES = [
    { key: "react", name: "React" },
    { key: "react-native", name: "React Native" },
    { key: "react native", name: "React Native" },
    { key: "next.js", name: "Next.js" },
    { key: "nextjs", name: "Next.js" },
    { key: "vue", name: "Vue.js" },
    { key: "svelte", name: "Svelte" },
    { key: "angular", name: "Angular" },
    { key: "typescript", name: "TypeScript" },
    { key: "javascript", name: "JavaScript" },
    { key: "python", name: "Python" },
    { key: "fastapi", name: "FastAPI" },
    { key: "django", name: "Django" },
    { key: "flask", name: "Flask" },
    { key: "celery", name: "Celery" },
    { key: "docker", name: "Docker" },
    { key: "dockerfile", name: "Dockerfile" },
    { key: "helm", name: "Helm" },
    { key: "kubernetes", name: "Kubernetes" },
    { key: "github actions", name: "GitHub Actions" },
    { key: "html", name: "HTML" },
    { key: "css", name: "CSS" },
    { key: "framer", name: "Framer Motion" },
    { key: "framer motion", name: "Framer Motion" },
    { key: "three.js", name: "Three.js" },
    { key: "r3f", name: "Three.js" },
    { key: "tailwind", name: "Tailwind CSS" },
    { key: "postgresql", name: "PostgreSQL" },
    { key: "postgres", name: "PostgreSQL" },
    { key: "sqlite", name: "SQLite" },
    { key: "mysql", name: "MySQL" },
    { key: "mongodb", name: "MongoDB" },
    { key: "redis", name: "Redis" },
    { key: "supabase", name: "Supabase" },
    { key: "langchain", name: "LangChain" },
    { key: "llamaindex", name: "LlamaIndex" },
    { key: "anthropic", name: "Anthropic" },
    { key: "claude", name: "Anthropic" },
    { key: "gemini", name: "Google Gemini" },
    { key: "pytorch", name: "PyTorch" },
    { key: "tensorflow", name: "TensorFlow" },
    { key: "jax", name: "JAX" },
    { key: "huggingface", name: "Hugging Face" },
    { key: "hugging face", name: "Hugging Face" },
    { key: "expo", name: "Expo" },
  ];

  for (const rule of INFERENCE_RULES) {
    if (searchable.includes(rule.key)) {
      detected.add(rule.name);
    }
  }

  if (detected.size > 0) {
    return Array.from(detected).slice(0, 10);
  }

  // 4. Default for static showcase cards
  return ["Framer Motion", "React", "TypeScript", "Tailwind CSS"];
}

/**
 * Strips hidden metadata comment from description for clean user rendering
 */
export function cleanDescription(desc) {
  if (!desc) return "";
  return desc.replace(/<!--technologies:\s*\[.*?\]\s*-->/gs, "").trim();
}

/**
 * Injects technologies into description string as a non-rendering HTML comment
 */
export function injectTechnologiesIntoDescription(desc, technologies = []) {
  const base = cleanDescription(desc);
  if (!technologies || technologies.length === 0) return base;
  return `${base}\n\n<!--technologies:${JSON.stringify(technologies)}-->`;
}
