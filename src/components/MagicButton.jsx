import { Sparkles } from "lucide-react";

export default function MagicButton({ onClick, disabled, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`admin-magic-btn group ${className}`}
      title="Automatically import a project using Magic"
    >
      <span className="admin-magic-glow" aria-hidden="true" />
      <span className="admin-magic-content">
        <Sparkles className="admin-magic-icon" size={16} />
        <span>Magic</span>
      </span>
    </button>
  );
}
