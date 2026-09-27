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

function WorkCardSkeleton() {
  return (
    <article className="work-card work-card-skeleton animate-pulse" aria-hidden="true">
      <div className="work-card-image-wrap relative bg-[#0b0b0d] border border-neutral-800/80 overflow-hidden flex items-center justify-center">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-accent/10 to-transparent animate-slider-scanline pointer-events-none" />
        <div className="relative flex flex-col items-center gap-2 select-none text-neutral-600">
          <div className="w-12 h-12 rounded border border-neutral-800 bg-neutral-900/90 flex items-center justify-center">
            <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: 24 }}>
              image
            </span>
          </div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
            Loading Project Preview…
          </span>
        </div>
      </div>

      <div className="work-card-details">
        <div>
          <div className="h-10 sm:h-12 bg-neutral-800/80 rounded-sm w-4/5 max-w-sm mb-3" />
          <div className="h-4 bg-neutral-900/90 rounded-sm w-2/5 max-w-[140px]" />
        </div>

        <div>
          <div className="work-meta-grid">
            <div>
              <div className="h-3 w-14 bg-neutral-800/60 rounded-sm mb-2.5" />
              <div className="h-4 w-28 bg-neutral-800/90 rounded-sm" />
            </div>
            <div>
              <div className="h-3 w-14 bg-neutral-800/60 rounded-sm mb-2.5" />
              <div className="h-4 w-24 bg-neutral-800/90 rounded-sm" />
            </div>
            <div>
              <div className="h-3 w-14 bg-neutral-800/60 rounded-sm mb-2.5" />
              <div className="h-4 w-32 bg-neutral-800/90 rounded-sm" />
            </div>
            <div>
              <div className="h-3 w-16 bg-neutral-800/60 rounded-sm mb-2.5" />
              <div className="h-4 w-28 bg-neutral-800/90 rounded-sm" />
            </div>
          </div>

          <div className="work-card-tech-section mt-5 pt-4 border-t border-neutral-800/80">
            <div className="h-3 w-20 bg-neutral-800/60 rounded-sm mb-3" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-20 bg-neutral-900 border border-neutral-800 rounded-sm" />
              <div className="h-7 w-24 bg-neutral-900 border border-neutral-800 rounded-sm" />
              <div className="h-7 w-16 bg-neutral-900 border border-neutral-800 rounded-sm" />
              <div className="h-7 w-20 bg-neutral-900 border border-neutral-800 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WorkPage() {
  const projects = useAdminStore((s) => s.projects);
  const projectsLoading = useAdminStore((s) => s.projectsLoading);
  const projectsLoaded = useAdminStore((s) => s.projectsLoaded);
  const projectsError = useAdminStore((s) => s.projectsError);
  const fetchProjects = useAdminStore((s) => s.fetchProjects);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  const isLoading = projects.length === 0 && (projectsLoading || !projectsLoaded);

  return (
    <main>
      <section className="inner-banner">
        <Container><div className="section-heading"><p className="eyebrow">// Work</p><h1>Showcasing design thinking and user experience</h1></div></Container>
      </section>
      <section className="work-list">
        <Container>
          <div className="section-heading"><p className="eyebrow">Selected work</p></div>
          <div className="work-card-list">
            {isLoading ? (
              <>
                <div className="flex items-center justify-between mb-10 pb-4 border-b border-neutral-800/80 font-mono text-xs text-neutral-400">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    <span className="text-neutral-300">Fetching projects from server…</span>
                  </span>
                  <span className="text-neutral-500">Live sync</span>
                </div>
                <WorkCardSkeleton />
                <WorkCardSkeleton />
                <WorkCardSkeleton />
              </>
            ) : projectsError && projects.length === 0 ? (
              <div className="p-8 border border-red-900/40 bg-red-950/20 text-center font-mono text-sm my-12">
                <p className="text-red-400 mb-4">Could not load projects from server ({projectsError}).</p>
                <button
                  type="button"
                  onClick={() => fetchProjects()}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-accent font-mono text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="admin-empty my-12">
                <p>No projects available yet.</p>
              </div>
            ) : (
              projects.map((p) => {
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
              })
            )}
          </div>
        </Container>
      </section>

      <SelectedWork />
      <Contact />
      <Footer />
    </main>
  );
}
