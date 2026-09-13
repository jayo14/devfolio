import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useAdminStore } from "../lib/adminStore.js";
import { resolveImageUrl } from "../lib/imageUrl.js";

export function normalizeWebsiteUrl(val) {
  if (!val) return "";
  let clean = val.trim();
  if (clean && !clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = `https://${clean}`;
  }
  return clean;
}

export function isValidUrl(val) {
  if (!val) return false;
  try {
    const clean = normalizeWebsiteUrl(val);
    const u = new URL(clean);
    return (u.protocol === "http:" || u.protocol === "https:") && Boolean(u.hostname);
  } catch {
    return false;
  }
}

export function extractGithubRepo(val) {
  if (!val) return "";
  let clean = val.trim();
  // Strip git@ or http/https protocol
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\/?/i, "");
  clean = clean.replace(/^git@github\.com:/i, "");
  clean = clean.replace(/\.git\/?$/i, "");
  clean = clean.replace(/^\/+|\/+$/g, "");
  return clean;
}

export function isValidGithubRepo(val) {
  const repo = extractGithubRepo(val);
  const pattern = /^[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+$/;
  return pattern.test(repo);
}

export function toFullGithubUrl(val) {
  const repo = extractGithubRepo(val);
  return repo ? `https://github.com/${repo}` : "";
}

export default function MagicWizard({ isOpen, onClose, onProjectCreated }) {
  const { startMagicJob, fetchMagicJob, publishMagicJob, magicLoading, magicError } = useAdminStore();

  // Wizard state: 'welcome' | 'sources' | 'pipeline' | 'review' | 'completed'
  const [phase, setPhase] = useState("welcome");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [pollError, setPollError] = useState(null);

  // Review editable form fields
  const [reviewForm, setReviewForm] = useState({
    title: "",
    description: "",
    summary: "",
    problem: "",
    targetAudience: "",
    solution: "",
    whyNow: "",
    client: "",
    field: "",
    role: "",
    completedDate: "",
    liveUrl: "",
    imageUrl: "",
    sliderImage: "",
    technologies: [],
  });

  const [publishedProject, setPublishedProject] = useState(null);
  const pollTimerRef = useRef(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setPhase("welcome");
      setJobId(null);
      setJob(null);
      setPollError(null);
    } else {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }
  }, [isOpen]);

  // Polling mechanism during pipeline phase
  useEffect(() => {
    if (phase === "pipeline" && jobId) {
      const poll = async () => {
        try {
          const current = await fetchMagicJob(jobId);
          setJob(current);

          if (current.status === "ready_for_review") {
            clearInterval(pollTimerRef.current);
            const r = current.review || {};
            setReviewForm({
              title: r.name || "",
              description: r.description || "",
              summary: r.summary || "",
              problem: r.problem || "",
              targetAudience: r.targetAudience || r.who || "",
              solution: r.solution || "",
              whyNow: r.whyNow || "",
              client: r.client || "",
              field: r.field || "",
              role: r.role || "",
              completedDate: r.completedDate || new Date().toISOString().slice(0, 10),
              liveUrl: r.liveUrl || current.websiteUrl || "",
              imageUrl: r.mockupUrl || r.desktopScreenshot || "",
              sliderImage: r.mockupUrl || "",
              technologies: r.technologies || [],
            });
            setPhase("review");
          } else if (current.status === "failed") {
            clearInterval(pollTimerRef.current);
            setPollError(current.errorMessage || "Analysis pipeline encountered an error.");
          }
        } catch (err) {
          setPollError(err.message || "Failed to poll job status.");
        }
      };

      poll();
      pollTimerRef.current = setInterval(poll, 1800);
      return () => clearInterval(pollTimerRef.current);
    }
  }, [phase, jobId, fetchMagicJob]);

  if (!isOpen) return null;

  // Validation
  const webValid = isValidUrl(websiteUrl);
  const ghValid = isValidGithubRepo(githubUrl);
  const sourcesValid = webValid && ghValid;

  const handleStartMagic = async (e) => {
    e.preventDefault();
    if (!sourcesValid) return;
    setPollError(null);
    try {
      const fullWeb = normalizeWebsiteUrl(websiteUrl);
      const fullGh = toFullGithubUrl(githubUrl);
      const id = await startMagicJob(fullWeb, fullGh);
      setJobId(id);
      setPhase("pipeline");
    } catch (err) {
      setPollError(err.message || "Could not launch Magic job.");
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!reviewForm.title.trim()) return;
    try {
      const created = await publishMagicJob(jobId, reviewForm);
      setPublishedProject(created);
      setPhase("completed");
      if (onProjectCreated) onProjectCreated(created);
    } catch (err) {
      setPollError(err.message || "Publishing failed.");
    }
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal magic-wizard-modal" onClick={(e) => e.stopPropagation()}>
        {/* Wizard Header */}
        <div className="admin-modal-header">
          <div className="magic-wizard-brand">
            <span className="magic-wizard-badge">
              <Sparkles size={15} /> MAGIC IMPORT
            </span>
            <span className="magic-step-indicator">Phase: {phase.toUpperCase()}</span>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn" aria-label="Close wizard">
            <X size={20} />
          </button>
        </div>

        {/* ── PHASE 1: WELCOME ── */}
        {phase === "welcome" && (
          <div className="magic-phase-welcome">
            <div className="magic-welcome-icon">
              <Sparkles size={40} />
            </div>
            <h2>Turn a deployed project into a portfolio entry automatically.</h2>
            <p className="magic-welcome-desc">
              Magic will inspect your website and GitHub repository, extract the important details,
              capture responsive screenshots, identify the technology stack and branding, and prepare
              a polished project card for you.
            </p>
            <div className="magic-welcome-features">
              <div className="magic-feature-item">
                <Check size={16} className="text-accent" />
                <span>Zero configuration required</span>
              </div>
              <div className="magic-feature-item">
                <Check size={16} className="text-accent" />
                <span>Photorealistic dual-device mockup creation</span>
              </div>
              <div className="magic-feature-item">
                <Check size={16} className="text-accent" />
                <span>Full preview &amp; editing control before publishing</span>
              </div>
            </div>
            <div className="admin-modal-actions pt-4">
              <button type="button" onClick={onClose} className="outline-button">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setPhase("sources")}
                className="admin-primary-btn"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 2: PROJECT SOURCES ── */}
        {phase === "sources" && (
          <form onSubmit={handleStartMagic} className="magic-phase-sources">
            <div className="magic-sources-intro">
              <h3>Connect Project Sources</h3>
              <p>Enter the deployed web URL and the public GitHub repository.</p>
            </div>

            {pollError && (
              <div className="admin-error-banner">
                <AlertCircle size={16} />
                <span>{pollError}</span>
              </div>
            )}

            <div className="magic-form-group">
              <label className="admin-field">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-neutral-400">public</span>
                    Website URL <b>*</b>
                  </span>
                  {websiteUrl && webValid && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                      <Check size={14} /> Valid URL
                    </span>
                  )}
                </span>
                <div className="magic-input-group">
                  <span className="magic-input-prefix">https://</span>
                  <input
                    type="text"
                    value={websiteUrl.replace(/^https?:\/\//i, "")}
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setWebsiteUrl(raw);
                    }}
                    placeholder="my-app.vercel.app"
                    required
                    className={`admin-input magic-grouped-input ${websiteUrl && !webValid ? "border-red-500" : ""}`}
                  />
                </div>
              </label>
              {websiteUrl && !webValid && (
                <p className="magic-field-error">Please enter a valid website hostname or URL.</p>
              )}
            </div>

            <div className="magic-form-group">
              <label className="admin-field">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-neutral-400">code</span>
                    GitHub Repository <b>*</b>
                  </span>
                  {githubUrl && ghValid && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                      <Check size={14} /> Valid Repo
                    </span>
                  )}
                </span>
                <div className="magic-input-group">
                  <span className="magic-input-prefix">github.com/</span>
                  <input
                    type="text"
                    value={extractGithubRepo(githubUrl)}
                    onChange={(e) => {
                      const extracted = extractGithubRepo(e.target.value);
                      setGithubUrl(extracted);
                    }}
                    placeholder="jayo14/devfolio"
                    required
                    className={`admin-input magic-grouped-input ${githubUrl && !ghValid ? "border-red-500" : ""}`}
                  />
                </div>
              </label>
              {githubUrl && !ghValid && (
                <p className="magic-field-error">
                  Enter repository as: username/repository (e.g. jayo14/devfolio)
                </p>
              )}
            </div>

            <div className="admin-modal-actions pt-4">
              <button
                type="button"
                onClick={() => setPhase("welcome")}
                className="outline-button"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={!sourcesValid || magicLoading}
                className="admin-primary-btn"
              >
                {magicLoading ? "Initializing…" : "Start Magic"} <Sparkles size={16} />
              </button>
            </div>
          </form>
        )}

        {/* ── PHASE 3: ANALYSIS PIPELINE ── */}
        {phase === "pipeline" && (
          <div className="magic-phase-pipeline">
            <div className="magic-pipeline-header">
              <div className="magic-pulse-badge">
                <Loader2 size={18} className="animate-spin text-accent" />
                <span>Analyzing &amp; generating project…</span>
              </div>
              <p>Magic is extracting facts, capturing screenshots, and assembling your card.</p>
            </div>

            {pollError && (
              <div className="admin-error-banner">
                <AlertCircle size={16} />
                <span>{pollError}</span>
                <button
                  type="button"
                  onClick={() => setPhase("sources")}
                  className="admin-icon-btn ml-auto"
                  title="Try again"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            )}

            <div className="magic-step-list">
              {(job?.steps || [
                { id: "1", label: "Inspecting live website", status: "processing" },
                { id: "2", label: "Analyzing GitHub repository", status: "pending" },
                { id: "3", label: "Extracting brand assets & logo", status: "pending" },
                { id: "4", label: "Capturing multi-device screenshots", status: "pending" },
                { id: "5", label: "Synthesizing project intelligence", status: "pending" },
                { id: "6", label: "Compositing portfolio mockup", status: "pending" },
              ]).map((step) => {
                const isDone = step.status === "completed";
                const isDoing = step.status === "processing";
                const isWarn = step.status === "warning";
                const isFail = step.status === "failed";

                return (
                  <div key={step.id} className={`magic-step-row is-${step.status}`}>
                    <div className="magic-step-icon">
                      {isDone && <Check size={16} className="text-green-400" />}
                      {isDoing && <Loader2 size={16} className="animate-spin text-accent" />}
                      {isWarn && <AlertCircle size={16} className="text-yellow-400" />}
                      {isFail && <X size={16} className="text-red-400" />}
                      {!isDone && !isDoing && !isWarn && !isFail && <span className="magic-step-dot" />}
                    </div>
                    <div className="magic-step-details">
                      <strong className="magic-step-label">{step.label}</strong>
                      {step.message && <p className="magic-step-msg">{step.message}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PHASE 4: REVIEW ── */}
        {phase === "review" && (
          <form onSubmit={handlePublish} className="magic-phase-review">
            <div className="magic-review-header">
              <h3>Review Project Card</h3>
              <p>Review the extracted intelligence, customize details, and publish.</p>
            </div>

            {pollError && (
              <div className="admin-error-banner">
                <AlertCircle size={16} />
                <span>{pollError}</span>
              </div>
            )}

            {/* Live Portfolio Card Preview */}
            <div className="magic-card-preview-wrap">
              <span className="magic-preview-badge">
                <Eye size={14} /> LIVE PREVIEW
              </span>
              <article className="magic-showcase-preview">
                {reviewForm.imageUrl && (
                  <div className="magic-preview-hero-wrap">
                    <img src={resolveImageUrl(reviewForm.imageUrl)} alt={reviewForm.title} className="magic-preview-hero-img" />
                  </div>
                )}
                <div className="magic-preview-details">
                  <h2 className="magic-preview-title">{reviewForm.title || "Project Title"}</h2>
                  <div className="work-meta-grid">
                    <p>
                      <span>Client</span>
                      {reviewForm.client || "Personal"}
                    </p>
                    <p>
                      <span>Field</span>
                      {reviewForm.field || "Development"}
                    </p>
                    <p>
                      <span>Role</span>
                      {reviewForm.role || "Developer"}
                    </p>
                    <p>
                      <span>Completed</span>
                      {reviewForm.completedDate || "Recent"}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Editable Fields */}
            <div className="admin-form-grid">
              <label className="admin-field">
                <span>
                  Project Title <b>*</b>
                </span>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  required
                  className="admin-input"
                />
              </label>

              <label className="admin-field">
                <span>Client Name</span>
                <input
                  type="text"
                  value={reviewForm.client}
                  onChange={(e) => setReviewForm({ ...reviewForm, client: e.target.value })}
                  className="admin-input"
                />
              </label>

              <label className="admin-field">
                <span>Field / Domain</span>
                <input
                  type="text"
                  value={reviewForm.field}
                  onChange={(e) => setReviewForm({ ...reviewForm, field: e.target.value })}
                  className="admin-input"
                />
              </label>

              <label className="admin-field">
                <span>Your Role</span>
                <input
                  type="text"
                  value={reviewForm.role}
                  onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                  className="admin-input"
                />
              </label>

              <label className="admin-field">
                <span>Live URL</span>
                <input
                  type="url"
                  value={reviewForm.liveUrl}
                  onChange={(e) => setReviewForm({ ...reviewForm, liveUrl: e.target.value })}
                  className="admin-input"
                />
              </label>

              <label className="admin-field">
                <span>Completed Date</span>
                <input
                  type="date"
                  value={reviewForm.completedDate}
                  onChange={(e) => setReviewForm({ ...reviewForm, completedDate: e.target.value })}
                  className="admin-input"
                />
              </label>
            </div>

            <label className="admin-field">
              <span>Cover / Mockup Image URL</span>
              <input
                type="text"
                value={reviewForm.imageUrl}
                onChange={(e) => setReviewForm({ ...reviewForm, imageUrl: e.target.value })}
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Short Summary / Elevator Pitch</span>
              <input
                type="text"
                value={reviewForm.summary}
                onChange={(e) => setReviewForm({ ...reviewForm, summary: e.target.value })}
                placeholder="1-2 sentence high-impact summary"
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Description</span>
              <textarea
                value={reviewForm.description}
                onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
                rows={3}
                placeholder="Detailed project overview"
                className="admin-textarea"
              />
            </label>

            <div className="admin-form-grid">
              <label className="admin-field">
                <span>The Problem (Core Friction / Pain Point)</span>
                <textarea
                  value={reviewForm.problem}
                  onChange={(e) => setReviewForm({ ...reviewForm, problem: e.target.value })}
                  rows={2}
                  placeholder="What friction or challenge does this solve?"
                  className="admin-textarea"
                />
              </label>

              <label className="admin-field">
                <span>The Who (Target Audience &amp; Customers)</span>
                <textarea
                  value={reviewForm.targetAudience}
                  onChange={(e) => setReviewForm({ ...reviewForm, targetAudience: e.target.value })}
                  rows={2}
                  placeholder="Who experiences this problem and would pay for it?"
                  className="admin-textarea"
                />
              </label>

              <label className="admin-field">
                <span>The Solution &amp; Unique Approach</span>
                <textarea
                  value={reviewForm.solution}
                  onChange={(e) => setReviewForm({ ...reviewForm, solution: e.target.value })}
                  rows={2}
                  placeholder="How does this solve it uniquely?"
                  className="admin-textarea"
                />
              </label>

              <label className="admin-field">
                <span>Why Now? (Inflection Point / Market Timing)</span>
                <textarea
                  value={reviewForm.whyNow}
                  onChange={(e) => setReviewForm({ ...reviewForm, whyNow: e.target.value })}
                  rows={2}
                  placeholder="Why is now the best time for this solution?"
                  className="admin-textarea"
                />
              </label>
            </div>

            {reviewForm.technologies?.length > 0 && (
              <div className="magic-tech-tags">
                <span className="text-xs uppercase font-mono text-neutral-400">
                  Detected Technologies:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {reviewForm.technologies.map((t) => (
                    <span key={t} className="text-xs font-mono bg-neutral-900 border border-neutral-700 px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="admin-modal-actions pt-4">
              <button
                type="button"
                onClick={() => setPhase("sources")}
                className="outline-button"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={magicLoading}
                className="admin-primary-btn"
              >
                {magicLoading ? "Publishing…" : "Publish Project"} <Check size={16} />
              </button>
            </div>
          </form>
        )}

        {/* ── PHASE 5: COMPLETED ── */}
        {phase === "completed" && (
          <div className="magic-phase-completed">
            <div className="magic-success-icon">
              <Check size={40} />
            </div>
            <h2>Magic complete</h2>
            <p>Your project has been generated and published to your portfolio.</p>

            <div className="admin-modal-actions justify-center gap-4 pt-6">
              {publishedProject?.slug && (
                <a
                  href={`/work/${publishedProject.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-primary-btn inline-flex items-center gap-2"
                >
                  <ExternalLink size={16} /> View Project Page
                </a>
              )}
              <button type="button" onClick={onClose} className="outline-button">
                Back to Projects
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
