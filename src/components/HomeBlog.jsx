import React from "react";
import { motion } from "framer-motion";
import GhostButton from "./GhostButton.jsx";

const posts = [
  {
    title: "Designing for a motion-first product narrative",
    date: "Jul 02, 2026",
  },
  {
    title: "How to balance brutalism and usability",
    date: "Jun 18, 2026",
  },
  {
    title: "A practical stack for fast portfolio builds",
    date: "May 11, 2026",
  },
];

const HomeBlog = () => {
  return (
    <section id="blog" className="bg-black px-6 py-40 text-white lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="font-inconsolata text-sm text-white/60">// Home Blog</p>
            <h2 className="mt-3 text-[40px] font-semibold tracking-[-2px] md:text-[64px]">
              Notes on <span className="text-accent">craft</span>
            </h2>
          </div>

          <GhostButton href="#contact">Read More</GhostButton>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-white/10 bg-[#0a0a0a] p-8 transition-colors hover:border-accent"
            >
              <p className="font-inconsolata text-xs uppercase tracking-[0.14em] text-white/50">
                {post.date}
              </p>
              <h3 className="mt-4 text-3xl font-semibold leading-[1.1]">{post.title}</h3>
              <p className="mt-6 max-w-md font-inconsolata text-base leading-7 text-white/60">
                Short editorial thoughts on process, interface structure, and shipping
                digital products with clarity.
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlog;
