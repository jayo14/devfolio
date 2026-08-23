import { Container } from "./Container.jsx";
import Footer from "./Footer.jsx";
import { originalAssets } from "../lib/siteData.js";

export default function BlogPage() {
  return (
    <main>
      <section className="blog-banner">
        <Container>
          <div className="section-heading"><p className="eyebrow">//Featured Works</p><h1>creative work</h1></div>
          <article className="featured-blog-card">
            <a href="/blog/boost-productivity-with-smart-tools" className="featured-blog-image"><img src={originalAssets.blogImages[0]} alt="Boost Productivity with Smart Tools" /></a>
            <div className="featured-blog-copy"><p className="eyebrow">JohnSmith</p><h2>Boost Productivity with Smart Tools</h2><p>Learn how technology simplifies workflows and enhances team collaboration effectively.</p><time dateTime="2024-09-05">Sep 05, 2024</time></div>
          </article>
        </Container>
      </section>
      <Footer />
    </main>
  );
}
