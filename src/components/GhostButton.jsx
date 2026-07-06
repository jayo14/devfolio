import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function GhostButton({ children, className = "", href = "#" }) {
  return (
    <motion.a
      href={href}
      whileHover="hover"
      className={`group relative inline-flex items-center gap-2 overflow-hidden border border-white/20 px-6 py-3 font-mono text-sm uppercase tracking-widest hover:border-accent ${className}`}
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
        {children}
      </span>
      <ArrowUpRight className="relative z-10 h-4 w-4 transition-colors duration-300 group-hover:text-black" />
      <motion.span
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 origin-left bg-accent"
      />
    </motion.a>
  );
}

export default GhostButton;
