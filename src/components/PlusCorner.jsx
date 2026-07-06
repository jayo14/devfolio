export function PlusCorner({ className = "" }) {
  return (
    <div className={`absolute h-3 w-3 ${className}`} aria-hidden="true">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/40" />
      <div className="absolute bottom-0 top-0 left-1/2 w-px bg-white/40" />
    </div>
  );
}

export default PlusCorner;
