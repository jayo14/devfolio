import { create } from "zustand";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ── helpers ──────────────────────────────────────────────── */

async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  if (opts.method === "DELETE" && res.status === 204) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error ${res.status}`);
  }
  return res.json();
}

export const useAdminStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  projects: [],
  blogLinks: [],
  loading: false,
  error: null,

  // ── Projects ──────────────────────────────────────────────

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await api("/api/projects/");
      set({ projects, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addProject: async (project) => {
    set({ loading: true, error: null });
    try {
      const created = await api("/api/projects/", {
        method: "POST",
        body: JSON.stringify(project),
      });
      set((s) => ({ projects: [created, ...s.projects], loading: false }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await api(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? updated : p)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await api(`/api/projects/${id}`, { method: "DELETE" });
      set((s) => ({
        projects: s.projects.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getProjectBySlug: (slug) => get().projects.find((p) => p.slug === slug),

  // ── Blog Links ────────────────────────────────────────────

  fetchBlogLinks: async () => {
    set({ loading: true, error: null });
    try {
      const blogLinks = await api("/api/blogs/");
      set({ blogLinks, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addBlogLink: async (link) => {
    set({ loading: true, error: null });
    try {
      const created = await api("/api/blogs/", {
        method: "POST",
        body: JSON.stringify(link),
      });
      set((s) => ({ blogLinks: [created, ...s.blogLinks], loading: false }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateBlogLink: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await api(`/api/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      set((s) => ({
        blogLinks: s.blogLinks.map((b) => (b.id === id ? updated : b)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteBlogLink: async (id) => {
    set({ loading: true, error: null });
    try {
      await api(`/api/blogs/${id}`, { method: "DELETE" });
      set((s) => ({
        blogLinks: s.blogLinks.filter((b) => b.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
