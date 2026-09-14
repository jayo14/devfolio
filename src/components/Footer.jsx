import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaXTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { Container } from "./Container.jsx";
import BrandLogo from "./BrandLogo.jsx";
import PlusCorner from "./PlusCorner.jsx";
import { EASE, DUR } from "../lib/easing.js";

const navLinks = [
  { label: "ABOUT", href: "/about-us" },
  { label: "WORK", href: "/work" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT", href: "/contact" },
];

/* ─────────────────────────────────────────────
   SOCIAL CELL — 80×80px
   filled=false : pure black #000000 cell
   filled=true + link=null : dark #151515 cell
   filled=true + link      : dark cell with icon & hover
───────────────────────────────────────────── */
function SocialCell({ filled, link = null, plusTopLeft = false, plusTopRight = false }) {
  const [hovered, setHovered] = useState(false);

  if (!filled) {
    return <div className="w-[80px] h-[80px] bg-black" />;
  }

  if (!link) {
    return <div className="w-[80px] h-[80px] bg-[#151515]" />;
  }

  const Icon = link.icon;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      title={link.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center w-[80px] h-[80px] bg-[#151515] overflow-hidden text-white no-underline select-none"
    >
      {plusTopLeft && <PlusCorner corner="top-left" color="white" />}
      {plusTopRight && <PlusCorner corner="top-right" color="white" />}

      {/* Hover background layer */}
      <motion.div
        animate={{ scale: hovered ? 1 : 0 }}
        transition={{ duration: DUR.hover, ease: EASE }}
        className="absolute inset-0 bg-[#383838] pointer-events-none"
      />

      <Icon
        className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
          hovered ? "text-accent" : "text-white"
        }`}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────
   4×3 SOCIAL CHECKERBOARD GRID (matching screenshot)
   Row 1: [empty]  [dark]   [empty]  [GitHub]
   Row 2: [X (+)]  [empty]  [LinkedIn] [empty]
   Row 3: [empty]  [WhatsApp (+)] [empty] [empty]
───────────────────────────────────────────── */
const socialCells = [
  // Row 1
  { filled: false },
  { filled: true },
  { filled: false },
  { filled: true, link: { icon: FaGithub, href: "https://github.com/jayo14/", label: "GitHub" } },
  // Row 2
  { filled: true, plusTopLeft: true, link: { icon: FaXTwitter, href: "https://x.com/JohnASamue24013", label: "X / Twitter" } },
  { filled: false },
  { filled: true, link: { icon: FaLinkedinIn, href: "https://linkedin.com/in/john-samuel-cgx", label: "LinkedIn" } },
  { filled: false },
  // Row 3
  { filled: false },
  { filled: true, plusTopRight: true, link: { icon: FaWhatsapp, href: "https://wa.me/2348096044860", label: "WhatsApp" } },
  { filled: false },
  { filled: false },
];

const Footer = () => {
  return (
    <footer id="footer" className="mt-[240px] md:mt-[324px] bg-black text-white">
      <Container>
        {/* ── ROW 1: Logo | MORE | Links ── */}
        <div className="border-t border-b border-[#222222] min-h-[190px] md:min-h-[204px] py-8 md:py-9">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px_324px] gap-6 md:gap-0 items-start">
            {/* Col 1: Logo */}
            <div className="flex items-center">
              <BrandLogo />
            </div>

            {/* Col 2: Section Label */}
            <div>
              <p className="font-mono text-sm tracking-widest text-white/50 uppercase pt-1 m-0">
                MORE
              </p>
            </div>

            {/* Col 3: Navigation Links */}
            <div>
              <ul className="space-y-3.5 m-0 p-0 list-none pt-1">
                {navLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="font-mono text-base uppercase text-white hover:text-accent transition-colors block"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Empty | CONTACT | Contact Details ── */}
        <div className="border-b border-[#222222] min-h-[120px] md:min-h-[124px] py-8 md:py-9">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px_324px] gap-6 md:gap-0 items-start">
            {/* Col 1: Empty */}
            <div className="hidden md:block" />

            {/* Col 2: Section Label */}
            <div>
              <p className="font-mono text-sm tracking-widest text-white/50 uppercase pt-1 m-0">
                CONTACT
              </p>
            </div>

            {/* Col 3: Contact Details */}
            <div className="space-y-2 pt-1">
              <a
                href="mailto:johnayobami77@proton.me"
                className="block font-mono text-base text-white/90 hover:text-accent transition-colors"
              >
                johnayobami77@proton.me
              </a>
              <a
                href="tel:+2348067954912"
                className="block font-mono text-base text-white/90 hover:text-accent transition-colors"
              >
                +2348067954912
              </a>
            </div>
          </div>
        </div>

        {/* ── ROW 3: Big Name & SOCIAL MEDIA | Social Grid ── */}
        <div className="border-b border-[#222222] min-h-[243px]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_324px]">
            {/* Left Area: SOCIAL MEDIA label + Giant Name */}
            <div className="flex flex-col justify-between py-8 md:py-9 md:pr-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] w-full">
                <div className="hidden md:block" />
                <p className="font-mono text-sm tracking-widest text-white/50 uppercase m-0 pt-1">
                  SOCIAL MEDIA
                </p>
              </div>

              <h2 className="text-[54px] sm:text-[76px] md:text-[96px] lg:text-[116px] xl:text-[132px] font-medium font-poppins text-white leading-none tracking-[-0.035em] m-0 mt-6 md:mt-4">
                John <span className="text-accent">Samuel</span>
              </h2>
            </div>

            {/* Right Area: 4×3 Social Grid (324px × 243px) */}
            <div className="flex justify-start md:justify-end">
              <div
                className="grid grid-cols-4 grid-rows-3 w-[324px] h-[243px] bg-[#222222] md:border-l border-[#222222]"
                style={{ gap: "1px" }}
              >
                {socialCells.map((cell, i) => (
                  <SocialCell key={i} {...cell} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── COPYRIGHT BAR ── */}
        <div className="footer-copyright flex items-center justify-between py-8 text-xs font-mono text-white/50">
          <p className="m-0">© {new Date().getFullYear()} CodeGallantX Inspired by UIXFlow</p>
          <a
            href="#root"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="hover:text-white transition-colors"
          >
            BACK TO TOP
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
