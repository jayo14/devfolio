import React from "react";
import { motion, useScroll } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[70px] bg-black">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-20">
        <a
          href="#home"
          className="text-2xl font-bold tracking-tight text-white transition-colors hover:text-accent"
        >
          DevMastery
        </a>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium uppercase tracking-[0.05em] text-white transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="h-px origin-left bg-accent"
      />
    </header>
  );
};

export default Navbar;
