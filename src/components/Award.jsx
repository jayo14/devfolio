import { useState } from "react";
import { motion } from "framer-motion";
import { EASE, DUR } from "../lib/easing.js";
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
      className="relative border-t border-line"
      style={{
        height: 141,
        borderBottom: isLast ? "1px solid #262626" : "none",
      }}
    >
      {/* Animated top border overlay — scaleX 0 → 1 from left on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "#262626",
          transformOrigin: "left center",
          zIndex: 1,
        }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: DUR.hoverBorder, ease: EASE }}
      />

      {/*
        3-column grid:
          Col 1 — 105px  : award logo (scale 0→1 on hover)
          Col 2 — 683px  : title + tag dots
          Col 3 — 210px  : number + year (right-aligned)
      */}
      <div
        className="grid h-full items-center"
        style={{ gridTemplateColumns: "105px 1fr 210px" }}
      >
        {/* ── Col 1: Logo (scale in on hover) ── */}
        <div className="flex items-center justify-center">
          <motion.img
            src="/img/award-logo.jpg"
            alt=""
            className="object-contain"
            style={{ width: 64, height: 64 }}
            animate={{ scale: hovered ? 1 : 0 }}
            initial={{ scale: 0 }}
            transition={{ duration: DUR.hoverBorder, ease: EASE }}
          />
        </div>

        {/* ── Col 2: Title + dot-separated tags ── */}
        <div>
          <h3
            className="capitalize font-medium"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 40,
              lineHeight: "48px",
              letterSpacing: "-1.2px",
              color: hovered ? "#FFFFFF" : "rgb(128, 128, 128)",
              transition: "color 0.3s ease",
            }}
          >
            {title}
          </h3>

          <div className="flex items-center gap-3 mt-2">
            {tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "Inconsolata, monospace",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {tag}
                </span>
                {i < tags.length - 1 && (
                  <span
                    className="rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      background: "rgba(255,255,255,0.6)",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* ── Col 3: Large number + year (right-aligned) ── */}
        <div className="text-right pr-0">
          <div
            className="font-medium"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 80,
              lineHeight: "80px",
              letterSpacing: "-2.4px",
              color: hovered ? "#FFFFFF" : "rgb(128, 128, 128)",
              transition: "color 0.3s ease",
            }}
          >
            {number}
          </div>
          <p
            className="mt-2"
            style={{
              fontFamily: "Inconsolata, monospace",
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {year}
          </p>
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
