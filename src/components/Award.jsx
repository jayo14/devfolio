import { useState } from "react";
import { Container } from "./Container.jsx";

const awards = [
  {
    title: "Best Web Developer Award",
    tags: ["Web Development", "Frontend", "Innovation"],
    number: "01",
    year: "2022 - Present",
  },
  {
    title: "Hackathon Champion",
    tags: ["Web Development", "Frontend", "Innovation"],
    number: "02",
    year: "2022 - Present",
  },
  {
    title: "Outstanding Contribution to Open Source",
    tags: ["Web Development", "Frontend", "Innovation"],
    number: "03",
    year: "2022 - Present",
  },
  {
    title: "Best Web Developer Award",
    tags: ["Web Development", "Frontend", "Innovation"],
    number: "04",
    year: "2022 - Present",
  },
];

function AwardCard({ title, tags, number, year, isLast }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-[141px]"
      style={{
        borderTop: "1px solid #262626",
        borderBottom: isLast ? "1px solid #262626" : "none",
      }}
    >
      {/* Animated top border line — scaleX 0 -> 1 on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-line"
        style={{
          transformOrigin: "left center",
          transform: `scaleX(${hovered ? 1 : 0})`,
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1,
        }}
      />

      {/* Grid: 105px / 683px / 210px */}
      <div
        className="grid h-full items-center"
        style={{ gridTemplateColumns: "105px 683px 210px" }}
      >
        {/* Col 1: Award logo — scale 0 -> 1 on hover */}
        <div className="flex items-center justify-center">
          <img
            src="/img/award-logo.jpg"
            alt=""
            className="object-contain"
            style={{
              width: 64,
              height: 64,
              transform: `scale(${hovered ? 1 : 0})`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Col 2: Title + tags */}
        <div>
          <h3
            className="capitalize font-medium"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "40px",
              lineHeight: "48px",
              letterSpacing: "-1.2px",
              color: hovered ? "#FFFFFF" : "rgb(128, 128, 128)",
              transition: "color 0.3s ease",
            }}
          >
            {title}
          </h3>

          {/* Tags with DOT separators (not pills) */}
          <div className="flex items-center gap-3 mt-2">
            {tags.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted">{t}</span>
                {i < tags.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-muted" />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Col 3: Number + year */}
        <div className="text-right">
          <div
            className="font-sans font-medium"
            style={{
              fontSize: "80px",
              lineHeight: "80px",
              letterSpacing: "-2.4px",
              color: hovered ? "#FFFFFF" : "rgb(128, 128, 128)",
              transition: "color 0.3s ease",
            }}
          >
            {number}
          </div>
          <p className="font-mono text-sm text-muted mt-2">{year}</p>
        </div>
      </div>
    </div>
  );
}

const Award = () => {
  return (
    <section id="award" className="mt-[324px] bg-black text-white">
      <Container>
        {/* Section title — LEFT-aligned */}
        <div className="mb-12">
          <p
            style={{
              fontFamily: "Inconsolata, monospace",
              fontSize: 16,
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            // Awards
          </p>
          <h2
            className="font-medium capitalize"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 64,
              lineHeight: "76.8px",
              letterSpacing: "-1.92px",
              color: "#ffffff",
            }}
          >
            Awards and <span style={{ color: "#FF4F22" }}>honors</span>
          </h2>
        </div>

        {/* Vertical list — no gap, each card 141px tall */}
        <div>
          {awards.map((award, i) => (
            <AwardCard
              key={`${award.title}-${i}`}
              {...award}
              isLast={i === awards.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Award;
