import { useState } from "react";
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
import { Container } from "./Container.jsx";

const tools = [
  SiHtml5,
  SiGithub,
  SiJavascript,
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiFigma,
  SiVite,
  SiGreensock,
  SiThreedotjs,
];

function ToolboxCell({ Icon }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex h-[160px] w-[162px] items-center justify-center border-r border-b border-line bg-card-bg"
      style={{
        backgroundColor: hovered ? "#000000" : "#080808",
        borderTop: hovered ? "1px solid white" : "1px solid transparent",
        borderLeft: hovered ? "1px solid white" : "1px solid transparent",
      }}
    >
      <Icon
        className={`h-10 w-10 transition-colors duration-300 ${
          hovered ? "text-accent" : "text-white"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

const Tools = () => {
  return (
    <section id="about" className="mt-0 bg-black text-white">
      <Container>
        <div className="grid grid-cols-[646px_646px]">
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
            <div className="grid grid-cols-4 grid-rows-3">
              {tools.map((Icon, index) => (
                <ToolboxCell key={index} Icon={Icon} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Tools;
