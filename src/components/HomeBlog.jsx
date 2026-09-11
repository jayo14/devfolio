import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";
import { useAdminStore } from "../lib/adminStore.js";

const staticPosts = [
  { title: "UI/UX for Developers: The Power of Simplicity", image: originalAssets.blogImages[0], href: "/blog/ui-ux-for-developers-the-power-of-simplicity", platform: "Featured", date: "Apr 22, 2025" },
  { title: "Hubfolio agency revolutionizes work with the power of AI-Driven", image: originalAssets.blogImages[1], href: "/blog/hubfolio-agency-revolutionizes-work-with-the-power-of-ai-driven", platform: "AI", date: "Apr 22, 2025" },
];

function BlogCard({ title, image, href, platform, date, isExternal }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article className="blog-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <a data-cursor-arrow href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} className="blog-image-wrap">
        <img src={image || originalAssets.blogImages[0]} alt={title} className="blog-image" loading="lazy" />
        <motion.span className="blog-overlay-arrow" animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.95 }} transition={{ duration: 0.3 }}><img src={originalAssets.arrow} alt="" /></motion.span>
      </a>
      <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} className="blog-info">
        <h3>{title}</h3>
        <div className="blog-meta"><span className="capitalize">{platform || "Article"}</span><i>/</i><time>{date || "Recent"}</time></div>
      </a>
    </article>
  );
}

const HomeBlog = () => {
  const blogLinks = useAdminStore((s) => s.blogLinks);
  const fetchBlogLinks = useAdminStore((s) => s.fetchBlogLinks);

  useEffect(() => {
    if (blogLinks.length === 0) fetchBlogLinks();
  }, [blogLinks.length, fetchBlogLinks]);

  const displayPosts = blogLinks.length > 0
    ? blogLinks.map((b) => ({
        title: b.title,
        image: b.coverImage || originalAssets.blogImages[0],
        href: b.url,
        platform: b.platform,
        date: b.date,
        isExternal: true,
      }))
    : staticPosts;

  return (
    <section id="blog" className="original-home-blog bg-black text-white">
      <Container>
        <div className="section-heading centered"><p className="eyebrow">// Blogs</p><h2>Our <span>blogs</span></h2></div>
        <div className="blog-grid">{displayPosts.slice(0, 4).map((post, idx) => <BlogCard key={post.href || idx} {...post} />)}</div>
        <div className="blog-button-wrap"><a href="/blog" className="outline-button">View All Posts <img src={originalAssets.arrow} alt="" /></a></div>
      </Container>
    </section>
  );
};

export default HomeBlog;
