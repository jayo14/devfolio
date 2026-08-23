import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "./Container.jsx";
import { EASE, DUR } from "../lib/easing.js";
import { siteRoutes } from "../lib/siteData.js";
import BrandLogo from "./BrandLogo.jsx";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 100));

  return (
    <motion.header
      animate={{ backgroundColor: scrolled || menuOpen ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0)" }}
      transition={{ duration: DUR.hover, ease: EASE }}
      className="site-navbar fixed inset-x-0 top-0 z-[1000]"
    >
      <Container>
        <div className="flex min-h-[77px] items-center justify-between gap-8">
          <a href="/" aria-label="CodeGallantX home" className="shrink-0"><BrandLogo /></a>

          <button
            type="button"
            className="mobile-menu-button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <nav id="primary-navigation" aria-label="Primary" className={menuOpen ? "primary-navigation is-open" : "primary-navigation"}>
            <ul>
              {siteRoutes.map((route) => (
                <li key={route.href}>
                  <a href={route.href} onClick={() => setMenuOpen(false)}>{route.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </motion.header>
  );
}

export default Navbar;
