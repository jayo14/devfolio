import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const posts = [
  { title: "UI/UX for Developers: The Power of Simplicity", image: originalAssets.blogImages[0], href: "/blog/ui-ux-for-developers-the-power-of-simplicity" },
  { title: "Hubfolio agency revolutionizes work with the power of AI-Driven", image: originalAssets.blogImages[1], href: "/blog/hubfolio-agency-revolutionizes-work-with-the-power-of-ai-driven" },
];

function BlogCard({ title, image, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article className="blog-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <a data-cursor-arrow href={href} className="blog-image-wrap">
        <img src={image} alt={title} className="blog-image" loading="lazy" />
        <motion.span className="blog-overlay-arrow" animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.95 }} transition={{ duration: 0.3 }}><img src={originalAssets.arrow} alt="" /></motion.span>
      </a>
      <a href={href} className="blog-info">
        <h3>{title}</h3>
        <div className="blog-meta"><span>Insurance</span><i>/</i><time dateTime="2025-04-22">Apr 22, 2025</time></div>
      </a>
    </article>
  );
}

const HomeBlog = () => (
  <section id="blog" className="original-home-blog bg-black text-white">
    <Container>
      <div className="section-heading centered"><p className="eyebrow">// Blogs</p><h2>Our <span>blogs</span></h2></div>
      <div className="blog-grid">{posts.map((post) => <BlogCard key={post.href} {...post} />)}</div>
      <div className="blog-button-wrap"><a href="/blog" className="outline-button">NixtNocode <img src={originalAssets.arrow} alt="" /></a></div>
    </Container>
  </section>
);

export default HomeBlog;
