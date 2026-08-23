import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const partners = [
  { text: "4.8/5 Star Rating on Goodfirms", images: originalAssets.partnerImages[0] },
  { text: "Top 50 Global Companies on Clutch", images: originalAssets.partnerImages[1] },
  { text: "95% Job Success on Upwork", images: originalAssets.partnerImages[2] },
  { text: "Top 20 Global Team on Behance", images: originalAssets.partnerImages[3] },
];

function PartnerCard({ text, images }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article className="partner-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="partner-image-wrap" aria-hidden="true">
        <motion.img src={images[0]} alt="" className="partner-image" animate={{ y: hovered ? -62 : 0 }} transition={{ duration: 0.4 }} />
        <motion.img src={images[1]} alt="" className="partner-image partner-image-hover" animate={{ y: hovered ? -62 : 0 }} transition={{ duration: 0.4 }} />
      </div>
      <p>{text}</p>
    </article>
  );
}

const Partner = () => (
  <section id="partner" className="original-partner bg-black text-white">
    <Container>
      <div className="partner-intro eyebrow">PARTNER WITH +150 BRANDS</div>
      <div className="partner-grid">
        {partners.map((partner) => <PartnerCard key={partner.text} {...partner} />)}
      </div>
    </Container>
  </section>
);

export default Partner;
