import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Container } from "./Container.jsx";
import { EASE, DUR } from "../lib/easing.js";

const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 100);
  });

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? "rgb(21, 21, 21)" : "rgba(0, 0, 0, 0)",
      }}
      transition={{ duration: DUR.hover, ease: EASE }}
      className="fixed inset-x-0 top-0 z-[1000] h-[77px]"
    >
      <Container className="flex h-full items-center justify-between">
        <a href="#home" className="block">
          <img
            src="https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/67fcc14dad82dcc3c1e3c98f_fb7499b361b41cce0650881b6dc1f265_logo-2x.png"
            alt="CodeGallantX"
            width={251}
            height={42}
            className="h-[42px] w-auto"
          />
        </a>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-0">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-6 py-2 text-base font-normal text-white transition-colors duration-200 hover:text-[rgb(161,170,170)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </motion.header>
  );
}

export default Navbar;
