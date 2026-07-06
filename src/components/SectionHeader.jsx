export function SectionHeader({ tag, title, highlight, align = "left" }) {
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : ""}`}>
      <p className="font-mono text-sm text-white/60">{tag}</p>
      <h2 className="mt-3 text-[80px] font-semibold tracking-[-2px]">
        {title} {highlight && <span className="text-accent">{highlight}</span>}
      </h2>
    </div>
  );
}

export default SectionHeader;
