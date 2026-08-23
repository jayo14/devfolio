import { useState } from "react";
import { motion } from "framer-motion";
import { FaDev, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { EASE, DUR } from "../lib/easing.js";
import SectionFrame from "./SectionFrame.jsx";
import { Container } from "./Container.jsx";
import BrandLogo from "./BrandLogo.jsx";

/* ─────────────────────────────────────────────
   FOOTER LINK COLUMN
   title: "MORE" | "CONTACT"
   links: [{ label, href }]
───────────────────────────────────────────── */
function FooterLinkCol({ title, links }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "Inconsolata, monospace",
          fontSize: 14,
          color: "#ffffff",
          marginBottom: 24,
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {links.map((l) => (
          <li key={l.label} style={{ marginBottom: 12 }}>
            <a
              href={l.href}
              style={{
                fontFamily: "Inconsolata, monospace",
                fontSize: 16,
                color: "#ffffff",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FF4F22")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL CELL — 80×80px
   filled=false : pure black bg-black cell
   filled=true + link=null : dark #151515 cell (no icon)
   filled=true + link      : dark cell with icon, hover effect
───────────────────────────────────────────── */
function SocialCell({ filled, link = null }) {
  const [hovered, setHovered] = useState(false);

  // Empty black cell
  if (!filled) {
    return (
      <div style={{ width: 80, height: 80, background: "#000000" }} />
    );
  }

  // Filled dark cell — no link, no icon
  if (!link) {
    return (
      <div style={{ width: 80, height: 80, background: "#151515" }} />
    );
  }

  const Icon = link.icon;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 80,
        background: "#151515",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      {/* Hover bg layer — scales from 0 → 1 */}
      <motion.div
        animate={{ scale: hovered ? 1 : 0 }}
        transition={{ duration: DUR.hover, ease: EASE }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#494949",
          zIndex: 0,
        }}
      />
      <Icon
        style={{
          position: "relative",
          zIndex: 1,
          width: 20,
          height: 20,
          color: hovered ? "#FF4F22" : "#ffffff",
          transition: "color 0.3s ease",
        }}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL GRID  — 4 cols × 3 rows = 12 cells
   Diagonal checkerboard pattern:

   Row 1:  [_]  [X]  [_]  [GH]
   Row 2:  [X]  [_]  [DR] [_]
   Row 3:  [_]  [IG] [_]  [_]

   _ = empty black   X = filled dark (no link)
───────────────────────────────────────────── */
const socialGrid = [
  // Row 1
  { filled: false },
  { filled: true, link: { icon: FaXTwitter, href: "https://x.com/JohnASamue24013", label: "X / Twitter" } },
  { filled: false },
  { filled: true, link: { icon: FaLinkedinIn, href: "https://linkedin.com/in/john-samuel-cgx", label: "LinkedIn" } },
  // Row 2
  { filled: true, link: { icon: FaGithub, href: "https://github.com/jayo14/", label: "GitHub" } },
  { filled: false },
  { filled: true, link: { icon: FaDev, href: "http://dev.to/codegallantx", label: "dev.to" } },
  { filled: false },
  // Row 3
  { filled: false },
  { filled: true, link: null },
  { filled: false },
  { filled: false },
];

/* ─────────────────────────────────────────────
   FOOTER ROW — 2-col layout wrapped in SectionFrame
   Each row gets 4 animated border lines from SectionFrame
───────────────────────────────────────────── */
function FooterRow({ left, right, rowHeight }) {
  return (
    <SectionFrame>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: rowHeight,
          alignItems: "center",
          padding: "32px 0",
        }}
      >
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </SectionFrame>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => {
  return (
    <footer id="footer" className="mt-[324px] bg-black text-white">
      <Container>

        {/* ── ROW 1: Logo (left) + MORE links (right) ── */}
        <FooterRow
          rowHeight={204}
          left={
            <BrandLogo />
          }
          right={
            <FooterLinkCol
              title="MORE"
              links={[
                { label: "ABOUT",   href: "/about-us" },
                { label: "WORK",    href: "/work" },
                { label: "BLOG",    href: "/blog" },
                { label: "CONTACT", href: "/contact" },
              ]}
            />
          }
        />

        {/* ── ROW 2: Empty (left) + CONTACT links (right) ── */}
        <FooterRow
          rowHeight={124}
          left={<span />}
          right={
            <FooterLinkCol
              title="CONTACT"
              links={[
                { label: "LGC.studio@gmail.com", href: "mailto:LGC.studio@gmail.com" },
                { label: "+34 123456789",         href: "tel:+34123456789" },
              ]}
            />
          }
        />

        {/* ── ROW 3: Name (left, 120px) + Social grid (right) ── */}
        <FooterRow
          rowHeight={244}
          left={
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 120,
                lineHeight: "120px",
                fontWeight: 500,
                letterSpacing: "-4.8px",
                color: "#ffffff",
                margin: 0,
              }}
            >
              John{" "}
              <span style={{ color: "#FF4F22" }}>Samuel</span>
            </h2>
          }
          right={
            <div>
              <p
                style={{
                  fontFamily: "Inconsolata, monospace",
                  fontSize: 14,
                  color: "#ffffff",
                  marginBottom: 24,
                  letterSpacing: "0.08em",
                }}
              >
                SOCIAL MEDIA
              </p>
              {/*
                4-col × 3-row grid.
                gap-px + bg-line creates 1px grid lines between cells.
                Total width: 4×80 + 3×1 = 323px.
              */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 80px)",
                  gap: 1,
                  background: "#262626", // gap color = border-line
                  width: 323,
                }}
              >
                {socialGrid.map((cell, i) => (
                  <SocialCell key={i} {...cell} />
                ))}
              </div>
            </div>
          }
        />

        {/* ── COPYRIGHT BAR ── */}
        <div className="footer-copyright">
          <p>© 2026 CodeGallantX Inspired by UIXFlow</p>
          <a href="#root" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>BACK TO TOP</a>
        </div>

      </Container>
    </footer>
  );
};

export default Footer;
