import { useState } from "react";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const awards = [
  "Best Web Developer Award",
  "Hackathon Champion",
  "Outstanding Contribution to Open Source",
  "Best Web Developer Award",
].map((title, index) => ({ title, image: originalAssets.awardImages[index], number: "01", year: "2022 - PRESENT" }));

function AwardRow({ title, image, number, year }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="#" className="award-row" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="award-image-wrap"><img src={image} alt="" className={hovered ? "award-image is-visible" : "award-image"} /></div>
      <div>
        <h3 className={hovered ? "is-active" : ""}>{title}</h3>
        <div className="award-tags"><span>WEB DEVELOPMENT</span><i /><span>FRONTEND</span><i /><span>INNOVATION</span></div>
      </div>
      <div className="award-meta"><strong className={hovered ? "is-active" : ""}>{number}</strong><span>{year}</span></div>
    </a>
  );
}

const Award = () => (
  <section id="award" className="original-award bg-black text-white">
    <Container>
      <div className="section-heading"><p className="eyebrow">// Awards</p><h2>Awards and <span>honors</span></h2></div>
      <div className="award-list">{awards.map((award, index) => <AwardRow key={`${award.title}-${index}`} {...award} />)}</div>
    </Container>
  </section>
);

export default Award;
