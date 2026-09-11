import { useEffect } from "react";
import { Container } from "./Container.jsx";
import Footer from "./Footer.jsx";
import { originalAssets } from "../lib/siteData.js";
import { useAdminStore } from "../lib/adminStore.js";
import { ExternalLink } from "lucide-react";

export default function BlogPage() {
  const blogLinks = useAdminStore((s) => s.blogLinks);
  const fetchBlogLinks = useAdminStore((s) => s.fetchBlogLinks);

  useEffect(() => {
    if (blogLinks.length === 0) fetchBlogLinks();
  }, [blogLinks.length, fetchBlogLinks]);

  return (
    <main>
      <section className="blog-banner">
        <Container>
          <div className="section-heading"><p className="eyebrow">//Featured Works</p><h1>creative work</h1></div>
          <article className="featured-blog-card">
            <a href="/blog/boost-productivity-with-smart-tools" className="featured-blog-image"><img src={originalAssets.blogImages[0]} alt="Boost Productivity with Smart Tools" /></a>
            <div className="featured-blog-copy"><p className="eyebrow">JohnSmith</p><h2>Boost Productivity with Smart Tools</h2><p>Learn how technology simplifies workflows and enhances team collaboration effectively.</p><time dateTime="2024-09-05">Sep 05, 2024</time></div>
          </article>

          {blogLinks.length > 0 && (
            <div className="mt-16 pt-12 border-t border-line">
              <div className="section-heading mb-10"><p className="eyebrow">// Articles &amp; Insights</p><h2>Publications &amp; <span>Articles</span></h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogLinks.map((blog) => (
                  <article key={blog.id} className="border border-line bg-[#080808] flex flex-col justify-between overflow-hidden group">
                    <div>
                      {blog.coverImage && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6">
                        <span className="inline-block uppercase tracking-wider text-xs font-mono font-bold px-2.5 py-1 mb-3 bg-accent text-black">{blog.platform || "Post"}</span>
                        <h3 className="text-xl font-medium mb-3 text-white group-hover:text-accent transition-colors">{blog.title}</h3>
                        {blog.date && <p className="font-mono text-xs text-neutral-400 mb-4">{blog.date}</p>}
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <a href={blog.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-white transition-colors">
                        Read on {blog.platform || "platform"} <ExternalLink size={14} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
      <Footer />
    </main>
  );
}
