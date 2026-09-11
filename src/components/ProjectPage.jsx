import { useEffect } from "react";
import { Container } from "./Container.jsx";
import Navbar from "./Navbar.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";
import { useAdminStore } from "../lib/adminStore.js";
import { originalAssets } from "../lib/siteData.js";

export default function ProjectPage({ slug }) {
  const project = useAdminStore((s) => s.getProjectBySlug(slug));
  const fetchProjects = useAdminStore((s) => s.fetchProjects);
  const projects = useAdminStore((s) => s.projects);
  const loading = useAdminStore((s) => s.loading);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  if (loading && !project) {
    return (
      <>
        <Navbar />
        <main>
          <section className="inner-banner">
            <Container>
              <div className="admin-loading" style={{ paddingTop: "200px" }}>Loading project…</div>
            </Container>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main>
          <section className="not-found">
            <Container>
              <div className="not-found-code">
                <span>4</span>
                <span style={{ color: "var(--accent)" }}>0</span>
                <span>4</span>
              </div>
              <p>Project not found</p>
              <a href="/work" className="outline-button">
                Back to Work <img src={originalAssets.arrow} alt="" />
              </a>
            </Container>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="blog-detail">
          <Container>
            <div className="blog-detail-heading">
              <p className="eyebrow">// Project</p>
              {project.completedDate && (
                <time dateTime={project.completedDate}>
                  {formatDate(project.completedDate)}
                </time>
              )}
              <h1>{project.title}</h1>
            </div>

            {project.imageUrl && (
              <img
                className="blog-detail-image"
                src={project.imageUrl}
                alt={project.title}
              />
            )}

            {/* Project meta */}
            <div className="project-meta-bar">
              {project.client && (
                <div className="project-meta-item">
                  <span>Client</span>
                  <strong>{project.client}</strong>
                </div>
              )}
              {project.field && (
                <div className="project-meta-item">
                  <span>Field</span>
                  <strong>{project.field}</strong>
                </div>
              )}
              {project.role && (
                <div className="project-meta-item">
                  <span>Role</span>
                  <strong>{project.role}</strong>
                </div>
              )}
              {project.liveUrl && (
                <div className="project-meta-item">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="outline-button"
                  >
                    View Live Site{" "}
                    <img src={originalAssets.arrow} alt="" />
                  </a>
                </div>
              )}
            </div>

            {project.description && (
              <div className="blog-detail-copy">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </Container>
        </section>
        <Contact />
        <Footer />
      </main>
    </>
  );
}
