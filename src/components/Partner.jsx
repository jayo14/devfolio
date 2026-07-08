import { useState } from "react";
import { motion } from "framer-motion";
import { EASE, DUR } from "../lib/easing.js";
import { Container } from "./Container.jsx";

/**
 * Inline SVG logos — two versions each:
 *   "normal"  = white fill/stroke
 *   "hover"   = accent orange (#FF4F22) fill/stroke
 *
 * Each SVG is sized to fit within a 160×62 viewport.
 */

const GoodfirmsLogo = ({ color }) => (
  <svg viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="44">
    <text
      x="0" y="32"
      fontFamily="'Poppins', sans-serif"
      fontSize="28"
      fontWeight="600"
      fill={color}
      letterSpacing="-0.5"
    >
      GoodFirms
    </text>
  </svg>
);

const ClutchLogo = ({ color }) => (
  <svg viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="44">
    <text
      x="0" y="32"
      fontFamily="'Poppins', sans-serif"
      fontSize="32"
      fontWeight="700"
      fill={color}
      letterSpacing="-0.5"
    >
      Clutch
    </text>
  </svg>
);

const UpworkLogo = ({ color }) => (
  <svg viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="44">
    <text
      x="0" y="32"
      fontFamily="'Poppins', sans-serif"
      fontSize="30"
      fontWeight="700"
      fill={color}
      letterSpacing="-0.5"
    >
      Upwork
    </text>
  </svg>
);

const BehanceLogo = ({ color }) => (
  <svg viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="44">
    <text
      x="0" y="32"
      fontFamily="'Poppins', sans-serif"
      fontSize="30"
      fontWeight="700"
      fill={color}
      letterSpacing="-0.5"
    >
      Behance
    </text>
  </svg>
);

const partners = [
  {
    LogoNormal: (props) => <GoodfirmsLogo color="#ffffff" {...props} />,
    LogoHover:  (props) => <GoodfirmsLogo color="#FF4F22" {...props} />,
    text: "4.8/5 Star Rating on Goodfirms",
  },
  {
    LogoNormal: (props) => <ClutchLogo color="#ffffff" {...props} />,
    LogoHover:  (props) => <ClutchLogo color="#FF4F22" {...props} />,
    text: "Top 50 Global Companies on Clutch",
  },
  {
    LogoNormal: (props) => <UpworkLogo color="#ffffff" {...props} />,
    LogoHover:  (props) => <UpworkLogo color="#FF4F22" {...props} />,
    text: "95% Job Success on Upwork",
  },
  {
    LogoNormal: (props) => <BehanceLogo color="#ffffff" {...props} />,
    LogoHover:  (props) => <BehanceLogo color="#FF4F22" {...props} />,
    text: "Top 20 Global Team on Behance",
  },
];

/** Single partner card — vertical image-swap hover + 0.8→1.0 opacity */
function PartnerCard({ LogoNormal, LogoHover, text }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative border-r border-b border-line flex flex-col items-center justify-center p-12 cursor-default"
      style={{
        width: 323,
        height: 324,
        opacity: hovered ? 1 : 0.8,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Logo wrap — 160×62px, overflow hidden, two logos stacked vertically */}
      <div
        className="relative overflow-hidden mb-8"
        style={{ width: 160, height: 62 }}
        aria-hidden="true"
      >
        {/* Normal (white) logo — sits at y:0, slides to y:-62 on hover */}
        <motion.div
          className="absolute left-0 top-0 w-full"
          style={{ height: 62 }}
          animate={{ y: hovered ? -62 : 0 }}
          transition={{ duration: DUR.hoverBorder, ease: EASE }}
        >
          <LogoNormal />
        </motion.div>

        {/* Hover (orange) logo — sits at y:62, slides to y:0 on hover */}
        <motion.div
          className="absolute left-0 w-full"
          style={{ top: 62, height: 62 }}
          animate={{ y: hovered ? -62 : 0 }}
          transition={{ duration: DUR.hoverBorder, ease: EASE }}
        >
          <LogoHover />
        </motion.div>
      </div>

      {/* Info text — 16px Inconsolata 400, muted-2 gray (rgb(128,128,128)) */}
      <p
        className="text-center"
        style={{
          fontFamily: "Inconsolata, monospace",
          fontSize: 16,
          fontWeight: 400,
          color: "rgb(128, 128, 128)",
          lineHeight: "1.5",
        }}
      >
        {text}
      </p>
    </div>
  );
}

const Partner = () => {
  return (
    <section id="partner" className="mt-[80px] bg-black text-white">
      <Container>
        {/* 4-col grid; border-t + border-l on parent creates the outer top/left lines.
            Each card adds border-r + border-b to complete the inner grid lines. */}
        <div className="grid grid-cols-4 border-t border-l border-line">
          {partners.map((p, i) => (
            <PartnerCard key={i} {...p} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Partner;
