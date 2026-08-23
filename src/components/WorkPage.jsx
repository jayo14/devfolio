import { Container } from "./Container.jsx";
import SelectedWork from "./SelectedWork.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";
import { originalAssets } from "../lib/siteData.js";

const workCards = originalAssets.workImages.map((image, index) => ({ image, key: `myth-${index}` }));
const mythFans = "https://stephaniebruce.co/?ref=lapaninja#myth-fans";

export default function WorkPage() {
  return (
    <main>
      <section className="inner-banner">
        <Container><div className="section-heading"><p className="eyebrow">// Work</p><h1>Showcasing design thinking and user experience</h1></div></Container>
      </section>
      <section className="work-list">
        <Container>
          <div className="section-heading"><p className="eyebrow">Selected work</p></div>
          <div className="work-card-list">
            {workCards.map(({ image, key }) => (
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
