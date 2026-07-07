import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function GhostButton({ children, href = "#", className = "" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex h-[58px] w-[324px] items-center gap-3 overflow-hidden border border-line px-8 font-sans text-base text-white ${className}`}
    >
      <span className="relative z-10 transition-colors duration-300">{children}</span>

      <motion.span
        className="relative z-10"
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </motion.span>

      <motion.span
        aria-hidden="true"
        className="absolute inset-2 z-0 origin-left bg-accent"
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0, scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "left center" }}
      />
    </motion.a>
  );
}

export default GhostButton;
