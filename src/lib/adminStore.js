import { create } from "zustand";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "devfolio_admin_token";
const USER_KEY = "devfolio_admin_user";

function getSavedToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

function getSavedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ── helpers ──────────────────────────────────────────────── */

async function api(path, opts = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...opts.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  if (opts.method === "DELETE" && res.status === 204) return null;

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.detail || `API error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const useAdminStore = create((set, get) => ({
  // ── Auth State ────────────────────────────────────────────
  token: getSavedToken(),
  user: getSavedUser(),
  authLoading: false,
  authError: null,

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      set({
        token: data.accessToken,
        user: data.user,
        authLoading: false,
        authError: null,
      });
      return true;
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
    set({ token: null, user: null, authError: null });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const user = await api("/api/auth/me", {}, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user });
    } catch (err) {
      if (err.status === 401) {
        get().logout();
      }
    }
  },

  // ── Data State ────────────────────────────────────────────
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
      const created = await api(
        "/api/projects/",
        {
          method: "POST",
          body: JSON.stringify(project),
        },
        get().token
      );
      set((s) => ({ projects: [created, ...s.projects], loading: false }));
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ error: err.message, loading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await api(
        `/api/projects/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        },
        get().token
      );
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? updated : p)),
        loading: false,
      }));
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ error: err.message, loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await api(`/api/projects/${id}`, { method: "DELETE" }, get().token);
      set((s) => ({
        projects: s.projects.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err) {
      if (err.status === 401) get().logout();
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
      const created = await api(
        "/api/blogs/",
        {
          method: "POST",
          body: JSON.stringify(link),
        },
        get().token
      );
      set((s) => ({ blogLinks: [created, ...s.blogLinks], loading: false }));
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ error: err.message, loading: false });
    }
  },

  updateBlogLink: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await api(
        `/api/blogs/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        },
        get().token
      );
      set((s) => ({
        blogLinks: s.blogLinks.map((b) => (b.id === id ? updated : b)),
        loading: false,
      }));
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ error: err.message, loading: false });
    }
  },

  deleteBlogLink: async (id) => {
    set({ loading: true, error: null });
    try {
      await api(`/api/blogs/${id}`, { method: "DELETE" }, get().token);
      set((s) => ({
        blogLinks: s.blogLinks.filter((b) => b.id !== id),
        loading: false,
      }));
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ error: err.message, loading: false });
    }
  },

  // ── Magic State ───────────────────────────────────────────
  currentMagicJob: null,
  magicLoading: false,
  magicError: null,

  startMagicJob: async (websiteUrl, githubUrl) => {
    set({ magicLoading: true, magicError: null });
    try {
      const data = await api(
        "/api/magic/projects",
        {
          method: "POST",
          body: JSON.stringify({ websiteUrl, githubUrl }),
        },
        get().token
      );
      set({ magicLoading: false });
      return data.jobId;
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ magicError: err.message, magicLoading: false });
      throw err;
    }
  },

  fetchMagicJob: async (jobId) => {
    try {
      const job = await api(`/api/magic/jobs/${jobId}`, {}, get().token);
      set({ currentMagicJob: job });
      return job;
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ magicError: err.message });
      throw err;
    }
  },

  publishMagicJob: async (jobId, projectData) => {
    set({ magicLoading: true, magicError: null });
    try {
      const createdProject = await api(
        `/api/magic/jobs/${jobId}/publish`,
        {
          method: "POST",
          body: JSON.stringify(projectData),
        },
        get().token
      );
      set((s) => ({
        projects: [createdProject, ...s.projects],
        magicLoading: false,
      }));
      return createdProject;
    } catch (err) {
      if (err.status === 401) get().logout();
      set({ magicError: err.message, magicLoading: false });
      throw err;
    }
  },

  clearMagicJob: () => set({ currentMagicJob: null, magicError: null, magicLoading: false }),

  clearError: () => set({ error: null, authError: null, magicError: null }),
}));
