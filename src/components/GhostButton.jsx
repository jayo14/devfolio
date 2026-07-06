import React from "react";
import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

const GhostButton = ({ href = "#contact", children, className = "" }) => {
  return (
    <motion.a
      href={href}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border border-white/70 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:text-black ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <HiArrowUpRight className="relative z-10 text-lg" aria-hidden="true" />
      <motion.span
        className="absolute inset-0 origin-left bg-accent"
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.a>
  );
};

export default GhostButton;
