export function SectionHeader({ tag, title, highlight, align = "left" }) {
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : ""}`}>
      <p className="font-inconsolata text-base text-white">{tag}</p>
      <h2 className="mt-3 text-[64px] font-medium capitalize leading-[76.8px] tracking-[-1.92px]">
        {title} {highlight && <span className="text-accent">{highlight}</span>}
      </h2>
    </div>
  );
}

export default SectionHeader;
