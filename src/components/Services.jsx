import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EASE, DUR } from "../lib/easing.js";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const services = [
  {
    title: "Web Dev",
    titleAccent: "Dev",
    tag: "#Developer",
    subTags: ["React", "Next.js"],
    desc: "Fast, modern, and scalable websites.",
    col: 1,
    row: 1,
  },
  {
    title: "UI/UX Design",
    titleAccent: "Design",
    tag: "#Developer",
    subTags: ["UserExperience", "Design"],
    desc: "Clean and user-friendly design.",
    col: 2,
    row: 1,
  },
  {
    title: "API Sync",
    titleAccent: "Sync",
    tag: "#Developer",
    subTags: ["REST API", "Database", "Integration"],
    desc: "Connect apps with third-party services.",
    col: 3,
    row: 2,
  },
  {
    title: "Mobile Dev",
    titleAccent: "Dev",
    tag: "#Developer",
    subTags: ["ReactNative", "Expo", "Flutter"],
    desc: "Build smooth cross-platform mobile experiences.",
    col: 4,
    row: 2,
  },
  {
    title: "Speed Up",
    titleAccent: "Up",
    tag: "#Developer",
    subTags: ["#SEO", "WebSpeed"],
    desc: "Optimize sites for better performance.",
    col: 2,
    row: 3,
  },
  {
    title: "AI & Agentic",
    titleAccent: "AI",
    tag: "#Developer",
    subTags: ["Python", "LLM", "Agents"],
    desc: "Build intelligent workflows and practical AI agents.",
    col: 3,
    row: 3,
  },
];

function ServiceCard({ title, titleAccent, tag, subTags, desc }) {
  const [hovered, setHovered] = useState(false);
  const titleParts = title.split(titleAccent);
  const before = titleParts[0] ?? "";
  const after = titleParts[1] ?? "";

  return (
    <a
      href="/contact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block h-[324px] w-full border border-line p-8"
      style={{
        backgroundColor: hovered ? "#000000" : "#080808",
      }}
    >
      <PlusCorner corner="top-left" animated />
      <PlusCorner corner="top-right" animated />
      <PlusCorner corner="bottom-right" animated />
      <PlusCorner corner="bottom-left" animated />

      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[48px] font-medium capitalize leading-[48px] tracking-[-1.92px]">
            <span
              className="transition-colors duration-300"
              style={{
                color: hovered ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
              }}
            >
              {before}
            </span>
            <span
              className="transition-colors duration-300"
              style={{
                color: hovered ? "#ff4f22" : "rgba(255, 255, 255, 0.6)",
              }}
            >
              {titleAccent}
            </span>
            <span
              className="transition-colors duration-300"
              style={{
                color: hovered ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
              }}
            >
              {after}
            </span>
          </h3>

          <span className="mt-2 font-inconsolata text-sm text-white/60">
            {tag}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {subTags.map((item) => (
            <span
              key={item}
              className="border border-line px-[14px] py-[10px] font-sans text-sm text-white/70"
            >
              {item}
            </span>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: DUR.hover, ease: EASE }}
          className="mt-auto"
        >
          <p className="font-inconsolata text-base text-muted">{desc}</p>
        </motion.div>
      </div>
    </a>
  );
}

const Services = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="work" ref={sectionRef} className="mt-[324px] relative overflow-hidden bg-black text-white">
      <motion.div
        aria-hidden="true"
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-cover bg-center"
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${originalAssets.servicesBackground})` }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      <Container className="relative z-10 py-40">
        <div className="mb-12 text-right">
          <p className="mb-3 font-inconsolata text-base text-white">// Services</p>
          <h2 className="font-sans text-[64px] font-medium capitalize leading-[76.8px] tracking-[-1.92px] text-white">
            Web development <span className="text-accent">expertise</span>
          </h2>
        </div>

        <div className="relative">
          <div className="services-grid">
            {Array.from({ length: 12 }).map((_, index) => {
              const col = (index % 4) + 1;
              const row = Math.floor(index / 4) + 1;
              const service = services.find(
                (item) => item.col === col && item.row === row
              );

              return service ? (
                <div
                  key={`${col}-${row}`}
                  className="flex items-start justify-start"
                >
                  <ServiceCard {...service} />
                </div>
              ) : (
                <div key={`${col}-${row}`} className="h-[324px] w-[322px]" />
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Services;
