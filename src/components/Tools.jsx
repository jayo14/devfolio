import { useState } from "react";
import { motion } from "framer-motion";
import { FaAws } from "react-icons/fa6";
import { SiDjango, SiExpo, SiFastapi, SiFigma, SiFlutter, SiGit, SiGithub, SiHtml5, SiHuggingface, SiLangchain, SiNextdotjs, SiPython, SiReact, SiTailwindcss } from "react-icons/si";
import GhostButton from "./GhostButton.jsx";
import PlusCorner from "./PlusCorner.jsx";
import { DUR } from "../lib/easing.js";
import { Container } from "./Container.jsx";
import EveLogo from "./EveLogo.jsx";

const tools = [
  { Icon: SiReact, label: "React" }, null, { Icon: SiHtml5, label: "HTML5" }, { Icon: SiGithub, label: "GitHub" }, null,
  { Icon: SiFigma, label: "Figma" }, { Icon: SiNextdotjs, label: "Next.js" }, null, { Icon: SiPython, label: "Python" }, { Icon: SiDjango, label: "Django" },
  null, { Icon: EveLogo, label: "Eve by Vercel" }, { Icon: SiFastapi, label: "FastAPI" }, null, { Icon: SiTailwindcss, label: "Tailwind CSS" },
  { Icon: SiExpo, label: "Expo" }, null, { Icon: SiFlutter, label: "Flutter" }, { Icon: SiGit, label: "Git" }, { Icon: SiReact, label: "React Native" },
  { Icon: SiLangchain, label: "LangChain" }, { Icon: FaAws, label: "AWS" }, null, { Icon: SiHuggingface, label: "Hugging Face" }, null,
];

function ToolboxCell({ Icon, label, index }) {
  const [hovered, setHovered] = useState(false);
  if (!Icon) return <div className="toolbox-cell toolbox-cell-empty" aria-hidden="true" />;
  return (
    <a
      data-cursor-arrow
      href="#"
      aria-label={label}
      className="toolbox-cell"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {[0, 6, 12, 18].includes(index) && <PlusCorner corner="top-right" />}
      <motion.span animate={{ color: hovered ? "#ff4f22" : "#ffffff" }} transition={{ duration: DUR.hover }}>
        <Icon className={label === "Eve by Vercel" ? "h-auto w-14" : "h-14 w-14"} aria-hidden="true" />
      </motion.span>
    </a>
  );
}

const Tools = () => {
  return (
    <section id="about" className="mt-0 bg-black text-white">
      <Container>
        <div className="tools-layout grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-between py-12">
            <div>
              <p className="mb-3 font-inconsolata text-base text-white">// Tools</p>
              <h2 className="font-sans text-[64px] font-medium capitalize leading-[76.8px] tracking-[-1.92px] text-white">
                <span className="text-accent">Key</span> Dev Tools
              </h2>
            </div>

            <GhostButton href="/work">NixtNocode</GhostButton>
          </div>

          <div className="border-t border-line">
            <div className="toolbox-grid">
              {tools.map((tool, index) => (
                <ToolboxCell key={index} {...(tool || {})} index={index} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Tools;
