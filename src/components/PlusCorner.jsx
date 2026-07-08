import { motion } from "framer-motion";
import { EASE, DUR } from "../lib/easing.js";

export function PlusCorner({
  className = "",
  color = "white",
  animated = false,
  delay = 0,
  corner = "top-left",
}) {
  const borderColorClass = color === "accent" ? "border-accent" : "border-white";
  const Wrapper = animated ? motion.div : "div";
  const positionStyle = {
    "top-left": { top: "-7px", left: "-7px" },
    "top-right": { top: "-7px", right: "-7px" },
    "bottom-right": { bottom: "-7px", right: "-7px" },
    "bottom-left": { bottom: "-7px", left: "-7px" },
  }[corner];

  return (
    <Wrapper
      className={`absolute h-3.5 w-3.5 pointer-events-none ${className}`}
      style={positionStyle}
      initial={
        animated
          ? { opacity: 0, y: 32, rotate: 225 }
          : undefined
      }
      whileInView={
        animated
          ? { opacity: 1, y: 0, rotate: 0 }
          : undefined
      }
      viewport={animated ? { once: true } : undefined}
      transition={
        animated
          ? { duration: DUR.reveal, delay, ease: EASE }
          : undefined
      }
      aria-hidden="true"
    >
      <div className={`absolute left-0 top-1/2 h-px w-full border-t ${borderColorClass}`} />
      <div
        className={`absolute left-1/2 top-0 h-full w-px border-l ${borderColorClass}`}
        style={{ transform: "translate(-0.5px, -7px)" }}
      />
    </Wrapper>
  );
}

export default PlusCorner;
