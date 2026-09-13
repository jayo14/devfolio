import { useState } from "react";
import { getTechLogoInfo } from "../lib/techLogos.js";

/**
 * TechLogoBadge
 * Displays 3rd-party vector SVG logo for a technology matching Devfolio's dark brutalist theme.
 */
export default function TechLogoBadge({
  tech,
  showLabel = false,
  size = "md", // "sm" | "md" | "lg"
  className = "",
}) {
  const [imgError, setImgError] = useState(false);
  const info = getTechLogoInfo(tech);

  if (!info) return null;

  const sizeClasses = {
    sm: "h-7 px-2 text-xs gap-1.5",
    md: "h-8 px-2.5 text-xs gap-2",
    lg: "h-9 px-3 text-sm gap-2.5",
  }[size] || "h-8 px-2.5 text-xs gap-2";

  const imgSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size] || "w-4 h-4";

  return (
    <div
      className={`group relative inline-flex items-center rounded border border-neutral-800 bg-neutral-900/80 transition-all duration-200 hover:border-[var(--accent)] hover:bg-neutral-900 hover:shadow-[0_0_12px_rgba(255,79,34,0.15)] ${sizeClasses} ${className}`}
      title={info.name}
      aria-label={info.name}
    >
      {!imgError ? (
        <img
          src={info.url}
          alt={info.name}
          loading="lazy"
          className={`${imgSizes} shrink-0 object-contain transition-transform duration-200 group-hover:scale-110`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-mono text-[10px] font-bold text-[var(--accent)]">
          {info.name.slice(0, 2).toUpperCase()}
        </span>
      )}

      {showLabel && (
        <span className="font-mono tracking-tight text-neutral-300 transition-colors duration-200 group-hover:text-white">
          {info.name}
        </span>
      )}

      {/* Subtle hover tooltip if label is hidden */}
      {!showLabel && (
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-[rgba(255,79,34,0.4)] bg-black/95 px-2 py-0.5 font-mono text-[10px] text-[var(--accent)] opacity-0 shadow-lg transition-all duration-150 group-hover:-top-9 group-hover:opacity-100 z-20">
          {info.name}
        </span>
      )}
    </div>
  );
}
