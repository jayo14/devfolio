import TechLogoBadge from "./TechLogoBadge.jsx";

/**
 * TechStackList
 * Renders a row or grid of technology logos consumed via 3rd party SVG API.
 */
export default function TechStackList({
  technologies = [],
  showLabel = true,
  size = "sm",
  max = 12,
  className = "",
}) {
  if (!technologies || technologies.length === 0) return null;
  const list = technologies.slice(0, max);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {list.map((tech) => (
        <TechLogoBadge
          key={tech}
          tech={tech}
          showLabel={showLabel}
          size={size}
        />
      ))}
    </div>
  );
}
