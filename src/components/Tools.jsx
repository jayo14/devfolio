import React from "react";
import { motion } from "framer-motion";
import {
  SiFigma,
  SiGithub,
  SiGreensock,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import GhostButton from "./GhostButton.jsx";

const tools = [
  { name: "HTML5", Icon: SiHtml5 },
  { name: "GitHub", Icon: SiGithub },
  { name: "JavaScript", Icon: SiJavascript },
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Tailwind", Icon: SiTailwindcss },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Figma", Icon: SiFigma },
  { name: "Vite", Icon: SiVite },
  { name: "GSAP", Icon: SiGreensock },
  { name: "Three.js", Icon: SiThreedotjs },
];

const Tools = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-black py-32 px-6 text-white lg:px-20"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-inconsolata text-sm text-white/60">// Tools</p>
            <h2 className="mt-3 text-[40px] font-semibold leading-[0.96] tracking-[-2px] md:text-[56px] lg:text-[64px]">
              <span className="text-accent">Key</span> Dev Tools
            </h2>
          </div>

          <GhostButton href="#contact" className="shrink-0">
            NixtNocode
          </GhostButton>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 gap-px bg-white/10 md:grid-cols-3 lg:grid-cols-6">
            {tools.map(({ name, Icon }) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.3 }}
                className="flex aspect-square items-center justify-center bg-black"
                aria-label={name}
                title={name}
              >
                <Icon className="h-12 w-12 text-white" aria-hidden="true" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Tools;
