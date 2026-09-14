import { useEffect } from "react";
import { Container } from "./Container.jsx";
import SelectedWork from "./SelectedWork.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";
import { useAdminStore } from "../lib/adminStore.js";
import { resolveImageUrl } from "../lib/imageUrl.js";
import TechStackList from "./TechStackList.jsx";
import { extractProjectTechnologies } from "../lib/techLogos.js";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function WorkPage() {
  const projects = useAdminStore((s) => s.projects);
  const fetchProjects = useAdminStore((s) => s.fetchProjects);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  return (
    <main>
      <section className="inner-banner">
        <Container><div className="section-heading"><p className="eyebrow">// Work</p><h1>Showcasing design thinking and user experience</h1></div></Container>
      </section>
      <section className="work-list">
        <Container>
          <div className="section-heading"><p className="eyebrow">Selected work</p></div>
          <div className="work-card-list">
            {/* Dynamic projects from admin store */}
            {projects.map((p) => {
              const techs = extractProjectTechnologies(p);
              return (
                <article className="work-card" key={p.id}>
                  <a href={`/work/${p.slug}`} className="work-card-image-wrap"><img src={resolveImageUrl(p.imageUrl)} alt={p.title} loading="lazy" /></a>
                  <div className="work-card-details">
                    <a href={`/work/${p.slug}`}><h2>{p.title}</h2></a>
                    <div className="work-meta-grid">
                      {p.client && <p><span>Client</span>{p.client}</p>}
                      {p.field && <p><span>Field</span>{p.field}</p>}
                      {p.role && <p><span>Role</span>{p.role}</p>}
                      {p.completedDate && <p><span>Completed</span>{formatDate(p.completedDate)}</p>}
                    </div>
                    {techs.length > 0 && (
                      <div className="work-card-tech-section mt-5 pt-4 border-t border-neutral-800/80">
                        <span className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                          Technologies
                        </span>
                        <TechStackList technologies={techs} showLabel size="sm" />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <SelectedWork />
      <Contact />
      <Footer />
    </main>
  );
}
