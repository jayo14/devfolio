import { useState, useEffect } from "react";
import { Container } from "./Container.jsx";
import { useAdminStore } from "../lib/adminStore.js";
import { Pencil, Trash2, Plus, ExternalLink, X, Lock, LogOut, User as UserIcon, Eye, EyeOff } from "lucide-react";
import MagicButton from "./MagicButton.jsx";
import MagicWizard from "./MagicWizard.jsx";
import ImageUploadField from "./ImageUploadField.jsx";
import { resolveImageUrl } from "../lib/imageUrl.js";

/* ─── Platform badge colours & recognition ─────────────────── */
const platformColors = {
  hashnode: "#2962FF",
  medium: "#00ab6c",
  "dev.to": "#18181b",
  devto: "#18181b",
  substack: "#FF6719",
  github: "#24292e",
  linkedin: "#0A66C2",
  x: "#111111",
  twitter: "#1DA1F2",
  youtube: "#e11d48",
  freecodecamp: "#0a0a23",
  other: "#4b5563",
};

export function detectPlatformInfo(url) {
  if (!url || typeof url !== "string") {
    return { id: "article", name: "Article", color: "#64748b", icon: "generic" };
  }
  const raw = url.trim().toLowerCase();
  let hostname = "";
  try {
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    hostname = parsed.hostname;
  } catch {
    hostname = raw;
  }

  if (hostname.includes("hashnode")) {
    return { id: "hashnode", name: "Hashnode", color: platformColors.hashnode, icon: "hashnode" };
  }
  if (hostname.includes("medium.com")) {
    return { id: "medium", name: "Medium", color: platformColors.medium, icon: "medium" };
  }
  if (hostname.includes("dev.to")) {
    return { id: "dev.to", name: "Dev.to", color: platformColors["dev.to"], icon: "devto" };
  }
  if (hostname.includes("substack.com")) {
    return { id: "substack", name: "Substack", color: platformColors.substack, icon: "substack" };
  }
  if (hostname.includes("github.com")) {
    return { id: "github", name: "GitHub", color: platformColors.github, icon: "github" };
  }
  if (hostname.includes("linkedin.com")) {
    return { id: "linkedin", name: "LinkedIn", color: platformColors.linkedin, icon: "linkedin" };
  }
  if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
    return { id: "x", name: "X (Twitter)", color: platformColors.x, icon: "x" };
  }
  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
    return { id: "youtube", name: "YouTube", color: platformColors.youtube, icon: "youtube" };
  }
  if (hostname.includes("freecodecamp.org")) {
    return { id: "freecodecamp", name: "freeCodeCamp", color: platformColors.freecodecamp, icon: "freecodecamp" };
  }

  const cleanHost = hostname.replace(/^www\./, "");
  if (cleanHost && cleanHost.includes(".")) {
    const parts = cleanHost.split(".");
    const main = parts[0] === "blog" && parts.length > 2 ? parts[1] : parts[0];
    const capitalized = main.charAt(0).toUpperCase() + main.slice(1);
    return { id: main, name: capitalized, color: "#3b82f6", icon: "generic", host: cleanHost };
  }

  return { id: "article", name: "Article", color: platformColors.other, icon: "generic" };
}

function platformColor(platform) {
  if (!platform) return platformColors.other;
  const p = platform.toLowerCase();
  for (const [key, color] of Object.entries(platformColors)) {
    if (p.includes(key)) return color;
  }
  return platformColors.other;
}

export function PlatformLogo({ icon, className = "", size = 16 }) {
  switch (icon) {
    case "hashnode":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M22.351 8.019l-6.37-6.37a5.632 5.632 0 0 0-7.962 0l-6.37 6.37a5.632 5.632 0 0 0 0 7.962l6.37 6.37a5.632 5.632 0 0 0 7.962 0l6.37-6.37a5.632 5.632 0 0 0 0-7.962zM12 15.6a3.6 3.6 0 1 1 3.6-3.6 3.6 3.6 0 0 1-3.6 3.6z" />
        </svg>
      );
    case "medium":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      );
    case "devto":
    case "dev.to":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M7.42 10.05c-.18-.1-.4-.14-.66-.14H5.45v4.18h1.31c.26 0 .48-.05.66-.14.18-.1.32-.24.42-.43.1-.19.15-.43.15-.72v-2.03c0-.29-.05-.53-.15-.72a1.07 1.07 0 0 0-.42-.43v.43zm-.79 2.91h-.37v-1.63h.37c.22 0 .38.05.47.16.09.1.14.28.14.53v.25c0 .25-.05.43-.14.53-.09.11-.25.16-.47.16zm5.82-2.77H10.8v4.18h1.65v-.74h-.83v-.98h.74v-.74h-.74v-.98h.83v-.74zm3.93 0l-1.07 4.18h.84l.65-2.67.65 2.67h.84l-1.07-4.18h-.84zM3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        </svg>
      );
    case "substack":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
      );
    case "github":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74V9.89H5.06v8.61h2.8z" />
        </svg>
      );
    case "x":
    case "twitter":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "freecodecamp":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ flexShrink: 0 }}>
          <path d="M7.746 11.233c.094-.658.267-1.3.508-1.928.324-.843.83-1.579 1.488-2.164.654-.582 1.439-.982 2.302-1.168.86-.184 1.761-.137 2.617.139.855.278 1.614.774 2.196 1.438.583.666.973 1.479 1.13 2.361.157.88.082 1.792-.222 2.646a7.172 7.172 0 0 1-1.346 2.215l-3.327 3.655a.82.82 0 0 1-1.22 0l-3.328-3.655a7.174 7.174 0 0 1-1.346-2.215 5.926 5.926 0 0 1-.222-2.646c.157-.882.547-1.695 1.13-2.361.582-.664 1.341-1.16 2.196-1.438a5.86 5.86 0 0 1 2.617-.139c.863.186 1.648.586 2.302 1.168.658.585 1.164 1.321 1.488 2.164.241.628.414 1.27.508 1.928h-9.988z" />
        </svg>
      );
    default:
      return (
        <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, flexShrink: 0 }}>
          language
        </span>
      );
  }
}

/* ─── Reusable input ─────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <label className="admin-field">
      <span>
        {label}
        {required && <b>*</b>}
      </span>
      {children}
    </label>
  );
}

function Input({ ...props }) {
  return <input className="admin-input" {...props} />;
}

function TextArea({ ...props }) {
  return <textarea className="admin-textarea" {...props} />;
}

/* ─── Project form (modal) ───────────────────────────────── */
const emptyProject = {
  title: "",
  summary: "",
  description: "",
  problem: "",
  targetAudience: "",
  solution: "",
  whyNow: "",
  imageUrl: "",
  client: "",
  field: "",
  role: "",
  completedDate: "",
  liveUrl: "",
  sliderImage: "",
};

function ProjectModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptyProject);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{initial ? "Edit Project" : "New Project"}</h3>
          <button type="button" onClick={onClose} className="admin-icon-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="admin-modal-body">
          <div className="admin-form-grid">
            <Field label="Title" required>
              <Input value={form.title} onChange={set("title")} placeholder="Project title" required />
            </Field>
            <Field label="Client">
              <Input value={form.client} onChange={set("client")} placeholder="Client name" />
            </Field>
            <Field label="Field">
              <Input value={form.field} onChange={set("field")} placeholder="e.g. Web App, FinTech" />
            </Field>
            <Field label="Role">
              <Input value={form.role} onChange={set("role")} placeholder="e.g. Full-Stack Dev" />
            </Field>
            <Field label="Completed Date">
              <Input type="date" value={form.completedDate} onChange={set("completedDate")} />
            </Field>
            <Field label="Live URL">
              <Input type="url" value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Short Summary / Elevator Pitch">
            <Input value={form.summary || ""} onChange={set("summary")} placeholder="1-2 sentence high-impact summary" />
          </Field>
          <ImageUploadField
            label="Cover Image URL"
            value={form.imageUrl}
            onChange={(val) => set("imageUrl")({ target: { value: val } })}
            placeholder="https://... (or drag & drop / click upload)"
            required
          />
          <ImageUploadField
            label="Slider Image URL"
            value={form.sliderImage}
            onChange={(val) => set("sliderImage")({ target: { value: val } })}
            placeholder="https://... (for homepage slider)"
            description="Displayed in the homepage slider"
          />
          <Field label="Detailed Description">
            <TextArea value={form.description} onChange={set("description")} placeholder="Comprehensive project description..." rows={3} />
          </Field>
          <div className="admin-form-grid">
            <Field label="The Problem">
              <TextArea value={form.problem || ""} onChange={set("problem")} placeholder="Core friction or unmet market challenge..." rows={2} />
            </Field>
            <Field label="The Who (Target Audience)">
              <TextArea value={form.targetAudience || ""} onChange={set("targetAudience")} placeholder="Specific customers or people facing this problem..." rows={2} />
            </Field>
            <Field label="The Solution & Unique Approach">
              <TextArea value={form.solution || ""} onChange={set("solution")} placeholder="Unique architectural or technological approach..." rows={2} />
            </Field>
            <Field label="Why Now?">
              <TextArea value={form.whyNow || ""} onChange={set("whyNow")} placeholder="Why now is the inflection point for this product..." rows={2} />
            </Field>
          </div>
          <div className="admin-modal-actions">
            <button type="button" onClick={onClose} className="outline-button">
              Cancel
            </button>
            <button type="submit" className="admin-primary-btn">
              {initial ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Blog link form (modal) ─────────────────────────────── */
const emptyBlog = { title: "", url: "", platform: "Hashnode", coverImage: "", date: "" };

function BlogModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    if (initial) {
      return {
        ...initial,
        platform: initial.platform || (initial.url ? detectPlatformInfo(initial.url).name : "Article"),
      };
    }
    return emptyBlog;
  });

  const handleUrlChange = (e) => {
    const val = e.target.value;
    const detected = detectPlatformInfo(val);
    setForm((f) => ({
      ...f,
      url: val,
      platform: val.trim() ? detected.name : f.platform,
    }));
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    const finalPlatform = form.platform || detectPlatformInfo(form.url).name || "Article";
    onSave({ ...form, platform: finalPlatform });
  };

  const detectedInfo = detectPlatformInfo(form.url);
  const hasUrl = Boolean(form.url && form.url.trim());

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{initial ? "Edit Blog Link" : "New Blog Link"}</h3>
          <button type="button" onClick={onClose} className="admin-icon-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="admin-modal-body">
          <Field label="Title" required>
            <Input value={form.title} onChange={set("title")} placeholder="Blog post title" required />
          </Field>
          <Field label="URL" required>
            <Input
              type="url"
              value={form.url}
              onChange={handleUrlChange}
              placeholder="https://hashnode.com/..., medium.com, dev.to, substack.com..."
              required
            />
            {hasUrl && (
              <div className="admin-platform-recognition">
                <span className="admin-platform-recognition-title">Detected Platform</span>
                <div
                  className="admin-platform-badge"
                  style={{
                    borderColor: detectedInfo.color,
                    background: `${detectedInfo.color}18`,
                    color: "#ffffff",
                  }}
                >
                  <PlatformLogo icon={detectedInfo.icon} size={16} />
                  <span className="admin-platform-badge-name">{detectedInfo.name}</span>
                  <span className="admin-platform-badge-tag">
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#10b981" }}>
                      check_circle
                    </span>
                    Verified
                  </span>
                </div>
              </div>
            )}
          </Field>
          <Field label="Date">
            <Input type="date" value={form.date} onChange={set("date")} />
          </Field>
          <ImageUploadField
            label="Cover Image URL"
            value={form.coverImage}
            onChange={(val) => set("coverImage")({ target: { value: val } })}
            placeholder="https://... (or drag & drop / click upload)"
          />
          <div className="admin-modal-actions">
            <button type="button" onClick={onClose} className="outline-button">
              Cancel
            </button>
            <button type="submit" className="admin-primary-btn">
              {initial ? "Save Changes" : "Add Blog Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Login Form Component ───────────────────────────────── */
function LoginForm() {
  const { login, authLoading, authError, clearError } = useAdminStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await login(email, password);
  };

  return (
    <section className="admin-login-section">
      <Container>
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <Lock size={28} />
            </div>
            <h2>Admin Portal</h2>
            <p>Sign in with your email and password to manage portfolio projects and publications.</p>
          </div>

          {authError && (
            <div className="admin-error-banner">
              <span>{authError}</span>
              <button type="button" onClick={clearError} className="admin-icon-btn">
                <X size={14} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <Field label="Email Address" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@devfolio.com"
                required
                autoComplete="email"
              />
            </Field>

            <Field label="Password" required>
              <div className="admin-password-field-wrapper">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="admin-password-toggle-btn"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={authLoading}
              className="admin-primary-btn admin-login-btn"
            >
              {authLoading ? "Authenticating…" : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

/* ─── Main Admin Page ────────────────────────────────────── */
export default function AdminPage() {
  const {
    token,
    user,
    logout,
    checkAuth,
    projects,
    addProject,
    updateProject,
    deleteProject,
    blogLinks,
    addBlogLink,
    updateBlogLink,
    deleteBlogLink,
    fetchProjects,
    fetchBlogLinks,
    loading,
    error,
    clearError,
  } = useAdminStore();

  const [projectModal, setProjectModal] = useState(null); // null | "new" | project obj
  const [blogModal, setBlogModal] = useState(null);
  const [tab, setTab] = useState("projects"); // "projects" | "blogs"
  const [magicOpen, setMagicOpen] = useState(false);

  useEffect(() => {
    if (token) {
      checkAuth();
      fetchProjects();
      fetchBlogLinks();
    }
  }, [token, checkAuth, fetchProjects, fetchBlogLinks]);

  /* Project handlers */
  const handleProjectSave = async (data) => {
    if (typeof projectModal === "object" && projectModal?.id) {
      await updateProject(projectModal.id, data);
    } else {
      await addProject(data);
    }
    setProjectModal(null);
  };

  /* Blog handlers */
  const handleBlogSave = async (data) => {
    if (typeof blogModal === "object" && blogModal?.id) {
      await updateBlogLink(blogModal.id, data);
    } else {
      await addBlogLink(data);
    }
    setBlogModal(null);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  if (!token) {
    return (
      <main className="min-h-screen flex flex-col justify-between">
        <section className="inner-banner admin-banner">
          <Container>
            <div className="flex items-center justify-between">
              <div className="section-heading mb-0">
                <p className="eyebrow">// Authentication</p>
                <h1>
                  Admin <span>Access</span>
                </h1>
              </div>
              <a
                href="/"
                className="admin-logout-btn"
                style={{ textDecoration: "none" }}
                title="Return to portfolio site"
              >
                <ExternalLink size={14} /> Back to Site
              </a>
            </div>
          </Container>
        </section>
        <LoginForm />
        <div className="py-8 text-center text-xs text-neutral-600 font-mono">
          Devfolio Admin Portal
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <section className="inner-banner admin-banner">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="section-heading mb-0">
                <p className="eyebrow">// Admin</p>
                <h1>
                  Dashboard <span>Panel</span>
                </h1>
              </div>
              <div className="admin-user-bar">
                <a
                  href="/"
                  className="admin-logout-btn"
                  style={{ textDecoration: "none" }}
                  title="Return to portfolio site"
                >
                  <ExternalLink size={14} /> View Site
                </a>
                <div className="admin-user-info">
                  <UserIcon size={16} />
                  <span>{user?.email || "Admin"}</span>
                </div>
                <button type="button" onClick={logout} className="admin-logout-btn" title="Sign out">
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>
          </Container>
        </section>

        <section className="admin-section">
          <Container>
            {/* Error banner */}
            {error && (
              <div className="admin-error-banner">
                <span>{error}</span>
                <button type="button" onClick={clearError} className="admin-icon-btn"><X size={16} /></button>
              </div>
            )}

            {/* Loading indicator */}
            {loading && <div className="admin-loading">Loading…</div>}

            {/* Tab bar */}
            <div className="admin-tabs">
              <button type="button" className={`admin-tab ${tab === "projects" ? "is-active" : ""}`} onClick={() => setTab("projects")}>
                Projects ({projects.length})
              </button>
              <button type="button" className={`admin-tab ${tab === "blogs" ? "is-active" : ""}`} onClick={() => setTab("blogs")}>
                Blog Links ({blogLinks.length})
              </button>
            </div>

            {/* ── Projects tab ── */}
            {tab === "projects" && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>Your Projects</h2>
                  <div className="flex items-center gap-3">
                    <button type="button" className="admin-primary-btn" onClick={() => setProjectModal("new")}>
                      <Plus size={16} /> Add Project
                    </button>
                    <MagicButton onClick={() => setMagicOpen(true)} />
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="admin-empty">
                    <p>No projects yet. Add your first project to get started.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Client</th>
                          <th>Field</th>
                          <th>Completed</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="admin-project-cell">
                                {p.imageUrl && <img src={resolveImageUrl(p.imageUrl)} alt="" className="admin-thumb" />}
                                <div>
                                  <strong>{p.title}</strong>
                                  <span className="admin-slug">/work/{p.slug}</span>
                                </div>
                              </div>
                            </td>
                            <td>{p.client || "—"}</td>
                            <td>{p.field || "—"}</td>
                            <td>{formatDate(p.completedDate)}</td>
                            <td>
                              <div className="admin-actions">
                                <button type="button" className="admin-icon-btn" onClick={() => setProjectModal(p)} title="Edit">
                                  <Pencil size={16} />
                                </button>
                                <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => deleteProject(p.id)} title="Delete">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Blog Links tab ── */}
            {tab === "blogs" && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>Blog Post Links</h2>
                  <button type="button" className="admin-primary-btn" onClick={() => setBlogModal("new")}>
                    <Plus size={16} /> Add Blog Link
                  </button>
                </div>

                {blogLinks.length === 0 ? (
                  <div className="admin-empty">
                    <p>No blog links yet. Add links to your Hashnode, Medium, or Dev.to posts.</p>
                  </div>
                ) : (
                  <div className="admin-card-grid">
                    {blogLinks.map((b) => (
                      <div key={b.id} className="admin-blog-card">
                        {b.coverImage && <img src={resolveImageUrl(b.coverImage)} alt="" className="admin-blog-cover" />}
                        <div className="admin-blog-card-body">
                          <div className="admin-blog-platform" style={{ background: platformColor(b.platform) }}>
                            <PlatformLogo icon={detectPlatformInfo(b.url || b.platform).icon} size={14} />
                            <span>{b.platform}</span>
                          </div>
                          <h4>{b.title}</h4>
                          {b.date && <time className="admin-blog-date">{formatDate(b.date)}</time>}
                          <a href={b.url} target="_blank" rel="noreferrer" className="admin-blog-link">
                            <ExternalLink size={14} /> Open post
                          </a>
                        </div>
                        <div className="admin-blog-card-footer">
                          <button type="button" className="admin-icon-btn" onClick={() => setBlogModal(b)} title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => deleteBlogLink(b.id)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Container>
        </section>
      </main>

      {/* Modals */}
      {magicOpen && (
        <MagicWizard
          isOpen={magicOpen}
          onClose={() => setMagicOpen(false)}
          onProjectCreated={() => {
            fetchProjects();
          }}
        />
      )}
      {projectModal && (
        <ProjectModal
          initial={typeof projectModal === "object" ? projectModal : null}
          onSave={handleProjectSave}
          onClose={() => setProjectModal(null)}
        />
      )}
      {blogModal && (
        <BlogModal
          initial={typeof blogModal === "object" ? blogModal : null}
          onSave={handleBlogSave}
          onClose={() => setBlogModal(null)}
        />
      )}
    </>
  );
}
