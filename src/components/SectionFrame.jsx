import { motion } from "framer-motion";
import PlusCorner from "./PlusCorner.jsx";
import { EASE, DUR } from "../lib/easing.js";

const lineVariants = {
  hidden: { scaleX: 0, scaleY: 0 },
  show: (i) => ({
    scaleX: 1,
    scaleY: 1,
    transition: {
      duration: DUR.border,
      delay: i * 0.15,
      ease: EASE,
    },
  }),
};

export function SectionFrame({ children, className = "", showCorners = false }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        custom={0}
        variants={lineVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        style={{ transformOrigin: "left center" }}
        className="pointer-events-none absolute left-0 top-0 z-10 h-px w-full bg-line"
        aria-hidden="true"
      />
      <motion.div
        custom={1}
        variants={lineVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        style={{ transformOrigin: "top center" }}
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-px bg-line"
        aria-hidden="true"
      />
      <motion.div
        custom={2}
        variants={lineVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        style={{ transformOrigin: "left center" }}
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-px w-full bg-line"
        aria-hidden="true"
      />
      <motion.div
        custom={3}
        variants={lineVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        style={{ transformOrigin: "top center" }}
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-px bg-line"
        aria-hidden="true"
      />
      {showCorners ? (
        <>
          <PlusCorner corner="top-left" />
          <PlusCorner corner="top-right" />
          <PlusCorner corner="bottom-right" />
          <PlusCorner corner="bottom-left" />
        </>
      ) : null}
      <div className="relative z-20">{children}</div>
    </div>
  );
}

export default SectionFrame;
