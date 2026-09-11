import { useEffect } from "react";
import { Container } from "./Container.jsx";
import SelectedWork from "./SelectedWork.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";
import { originalAssets } from "../lib/siteData.js";
import { useAdminStore } from "../lib/adminStore.js";

const staticCards = originalAssets.workImages.map((image, index) => ({ image, key: `myth-${index}` }));
const mythFans = "https://stephaniebruce.co/?ref=lapaninja#myth-fans";

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
            {projects.map((p) => (
              <article className="work-card" key={p.id}>
                <a href={`/work/${p.slug}`} className="work-card-image-wrap"><img src={p.imageUrl} alt={p.title} loading="lazy" /></a>
                <div className="work-card-details">
                  <a href={`/work/${p.slug}`}><h2>{p.title}</h2></a>
                  <div className="work-meta-grid">
                    {p.client && <p><span>Client</span>{p.client}</p>}
                    {p.field && <p><span>Field</span>{p.field}</p>}
                    {p.role && <p><span>Role</span>{p.role}</p>}
                    {p.completedDate && <p><span>Completed</span>{formatDate(p.completedDate)}</p>}
                  </div>
                </div>
              </article>
            ))}
            {/* Original static cards */}
            {staticCards.map(({ image, key }) => (
              <article className="work-card" key={key}>
                <a href={mythFans} target="_blank" rel="noreferrer" className="work-card-image-wrap"><img src={image} alt="MYTH FANS" loading="lazy" /></a>
                <div className="work-card-details">
                  <a href={mythFans} target="_blank" rel="noreferrer"><h2>MYTH FANS</h2></a>
                  <div className="work-meta-grid"><p><span>Client</span>MYTH FANS</p><p><span>Field</span>NFT</p><p><span>Role</span>Design &amp; Framer Development</p><p><span>Completed</span>July 6, 2024</p></div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <SelectedWork />
      <Contact />
      <Footer />
    </main>
  );
}
