import { originalAssets } from "../lib/siteData.js";

export default function BrandLogo({ className = "" }) {
  return (
    <span className={`brand-logo ${className}`}>
      <span className="brand-logo-mark" aria-hidden="true">
        <img
          src={originalAssets.logo}
          alt=""
          width="251"
          height="42"
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="brand-logo-name">CodeGallantX</span>
    </span>
  );
}
