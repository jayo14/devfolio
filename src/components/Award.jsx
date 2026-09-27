import { useState } from "react";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const awardsData = [
  {
    title: "Best Web Developer Award",
    image: originalAssets.awardImages[0],
    number: "01",
    year: "2024 - PRESENT",
    tags: ["WEB DEVELOPMENT", "FRONTEND", "INNOVATION"],
  },
  {
    title: "Hackathon Champion",
    image: originalAssets.awardImages[1],
    number: "02",
    year: "2023 - 2024",
    tags: ["FULL STACK", "FASTAPI", "REACT"],
  },
  {
    title: "Outstanding Contribution to Open Source",
    image: originalAssets.awardImages[2],
    number: "03",
    year: "2023 - PRESENT",
    tags: ["OPEN SOURCE", "COMMUNITY", "GITHUB"],
  },
  {
    title: "Excellence in UI/UX Engineering",
    image: originalAssets.awardImages[3],
    number: "04",
    year: "2022 - 2023",
    tags: ["PRODUCT DESIGN", "DESIGN SYSTEMS", "ACCESSIBILITY"],
  },
];

function AwardRow({ title, image, number, year, tags }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="award-row cursor-default"
      tabIndex={0}
      role="article"
      aria-label={`${number}: ${title} (${year})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="award-image-wrap">
        <img
          src={image}
          alt=""
          width="180"
          height="120"
          loading="lazy"
          className={hovered ? "award-image is-visible" : "award-image"}
        />
      </div>
      <div>
        <h3 className={hovered ? "is-active" : ""}>{title}</h3>
        <div className="award-tags">
          {tags.map((tag, idx) => (
            <span key={tag}>
              {idx > 0 && <i aria-hidden="true" />}
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="award-meta">
        <strong className={hovered ? "is-active" : ""}>{number}</strong>
        <span>{year}</span>
      </div>
    </div>
  );
}

const Award = () => (
  <section id="award" className="original-award bg-black text-white">
    <Container>
      <div className="section-heading">
        <p className="eyebrow">// Awards</p>
        <h2>
          Awards and <span>honors</span>
        </h2>
      </div>
      <div className="award-list">
        {awardsData.map((award) => (
          <AwardRow key={award.number} {...award} />
        ))}
      </div>
    </Container>
  </section>
);

export default Award;
