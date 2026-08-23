import { originalAssets } from "../lib/siteData.js";

export default function BrandLogo({ className = "" }) {
  return (
    <span className={`brand-logo ${className}`}>
      <span className="brand-logo-mark" aria-hidden="true"><img src={originalAssets.logo} alt="" /></span>
      <span className="brand-logo-name">CodeGallantX</span>
    </span>
  );
}
