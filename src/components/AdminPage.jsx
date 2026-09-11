import { useState } from "react";
import { Container } from "./Container.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useAdminStore } from "../lib/adminStore.js";
import { Pencil, Trash2, Plus, ExternalLink, X } from "lucide-react";

/* ─── Platform badge colours ─────────────────────────────── */
const platformColors = {
  hashnode: "#2962FF",
  medium: "#00ab6c",
  "dev.to": "#0a0a0a",
  other: "#808080",
};

function platformColor(platform) {
  return platformColors[platform?.toLowerCase()] || platformColors.other;
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

function Select({ children, ...props }) {
  return (
    <select className="admin-input" {...props}>
      {children}
    </select>
  );
}

/* ─── Project form (modal) ───────────────────────────────── */
const emptyProject = {
  title: "",
  description: "",
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
              <Input value={form.field} onChange={set("field")} placeholder="e.g. Web App, NFT" />
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
          <Field label="Cover Image URL" required>
            <Input type="url" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." required />
          </Field>
          <Field label="Slider Image URL">
            <Input type="url" value={form.sliderImage} onChange={set("sliderImage")} placeholder="https://... (for homepage slider)" />
          </Field>
          <Field label="Description">
            <TextArea value={form.description} onChange={set("description")} placeholder="Project description..." rows={4} />
          </Field>
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
const emptyBlog = { title: "", url: "", platform: "hashnode", coverImage: "", date: "" };

function BlogModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptyBlog);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    onSave(form);
  };

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
            <Input type="url" value={form.url} onChange={set("url")} placeholder="https://hashnode.com/post/..." required />
          </Field>
          <div className="admin-form-grid">
            <Field label="Platform">
              <Select value={form.platform} onChange={set("platform")}>
                <option value="hashnode">Hashnode</option>
                <option value="medium">Medium</option>
                <option value="dev.to">Dev.to</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field label="Date">
              <Input type="date" value={form.date} onChange={set("date")} />
            </Field>
          </div>
          <Field label="Cover Image URL">
            <Input type="url" value={form.coverImage} onChange={set("coverImage")} placeholder="https://..." />
          </Field>
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

/* ─── Main Admin Page ────────────────────────────────────── */
export default function AdminPage() {
  const { projects, addProject, updateProject, deleteProject, blogLinks, addBlogLink, updateBlogLink, deleteBlogLink } = useAdminStore();

  const [projectModal, setProjectModal] = useState(null); // null | "new" | project obj
  const [blogModal, setBlogModal] = useState(null);
  const [tab, setTab] = useState("projects"); // "projects" | "blogs"

  /* Project handlers */
  const handleProjectSave = (data) => {
    if (typeof projectModal === "object" && projectModal?.id) {
      updateProject(projectModal.id, data);
    } else {
      addProject(data);
    }
    setProjectModal(null);
  };

  /* Blog handlers */
  const handleBlogSave = (data) => {
    if (typeof blogModal === "object" && blogModal?.id) {
      updateBlogLink(blogModal.id, data);
    } else {
      addBlogLink(data);
    }
    setBlogModal(null);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="inner-banner">
          <Container>
            <div className="section-heading">
              <p className="eyebrow">// Admin</p>
              <h1>
                Dashboard <span>Panel</span>
              </h1>
            </div>
          </Container>
        </section>

        <section className="admin-section">
          <Container>
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
                  <button type="button" className="admin-primary-btn" onClick={() => setProjectModal("new")}>
                    <Plus size={16} /> Add Project
                  </button>
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
                                {p.imageUrl && <img src={p.imageUrl} alt="" className="admin-thumb" />}
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
                        {b.coverImage && <img src={b.coverImage} alt="" className="admin-blog-cover" />}
                        <div className="admin-blog-card-body">
                          <div className="admin-blog-platform" style={{ background: platformColor(b.platform) }}>
                            {b.platform}
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

        <Footer />
      </main>

      {/* Modals */}
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
