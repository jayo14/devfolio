import { create } from "zustand";

const PROJECTS_KEY = "devfolio_projects";
const BLOGS_KEY = "devfolio_blogs";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useAdminStore = create((set, get) => ({
  // ── Projects ──────────────────────────────────────────────
  projects: load(PROJECTS_KEY, []),

  addProject: (project) => {
    const id = generateId();
    const slug = slugify(project.title) || id;
    const entry = { ...project, id, slug, createdAt: new Date().toISOString() };
    const next = [entry, ...get().projects];
    save(PROJECTS_KEY, next);
    set({ projects: next });
  },

  updateProject: (id, updates) => {
    const next = get().projects.map((p) =>
      p.id === id
        ? {
            ...p,
            ...updates,
            slug: updates.title ? slugify(updates.title) || p.slug : p.slug,
          }
        : p
    );
    save(PROJECTS_KEY, next);
    set({ projects: next });
  },

  deleteProject: (id) => {
    const next = get().projects.filter((p) => p.id !== id);
    save(PROJECTS_KEY, next);
    set({ projects: next });
  },

  getProjectBySlug: (slug) => get().projects.find((p) => p.slug === slug),

  // ── Blog Links ────────────────────────────────────────────
  blogLinks: load(BLOGS_KEY, []),

  addBlogLink: (link) => {
    const id = generateId();
    const entry = { ...link, id, createdAt: new Date().toISOString() };
    const next = [entry, ...get().blogLinks];
    save(BLOGS_KEY, next);
    set({ blogLinks: next });
  },

  updateBlogLink: (id, updates) => {
    const next = get().blogLinks.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    save(BLOGS_KEY, next);
    set({ blogLinks: next });
  },

  deleteBlogLink: (id) => {
    const next = get().blogLinks.filter((b) => b.id !== id);
    save(BLOGS_KEY, next);
    set({ blogLinks: next });
  },
}));
