import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-10 text-white lg:px-20">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a href="#home" className="text-2xl font-bold tracking-tight">
          DevMastery
        </a>
        <p className="font-inconsolata text-sm text-white/60">
          React 18, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, Lenis, Embla
        </p>
        <p className="font-inconsolata text-sm text-white/60">
          © 2026 DevMastery
        </p>
      </div>
    </footer>
  );
};

export default Footer;
