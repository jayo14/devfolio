import { useState } from "react";
import { motion } from "framer-motion";
import { EASE, DUR } from "../lib/easing.js";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";

const posts = [
  {
    title: "UI/UX for Developers: The Power of Simplicity",
    category: "Design",
    image: "/img/post-5.jpg",
  },
  {
    title: "Hubfolio agency revolutionizes work with the power of AI-Driven",
    category: "Technology",
    image: "/img/post-2.jpg",
  },
  {
    title: "Why Performance Matters More Than Ever in 2024",
    category: "Engineering",
    image: "/img/post-3.jpg",
  },
  {
    title: "Building Scalable Design Systems for Modern Teams",
    category: "Systems",
    image: "/img/post-4.jpg",
  },
];

function BlogCard({ title, category, image }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block group cursor-pointer"
      style={{ width: 647 }}
    >
      {/* ── Image area: 647×470px, overflow hidden ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 470 }}>
        {/* 4 PlusCorner marks — each animated individually on scroll-in */}
        {[
          { corner: "top-left",     delay: 0.15 },
          { corner: "top-right",    delay: 0.20 },
          { corner: "bottom-right", delay: 0.25 },
          { corner: "bottom-left",  delay: 0.30 },
        ].map(({ corner, delay }) => (
          <PlusCorner
            key={corner}
            corner={corner}
            color="white"
            animated
            delay={delay}
          />
        ))}

        {/* Blog post image — scale-105 on hover */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay circle button — 104×104px, top:90px right:20px, fade in on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: DUR.hover, ease: EASE }}
          className="absolute rounded-full backdrop-blur-sm flex items-center justify-center pointer-events-none"
          style={{
            top: 90,
            right: 20,
            width: 104,
            height: 104,
            background: "rgba(255, 255, 255, 0.20)",
          }}
          aria-hidden="true"
        >
          <img
            src="/arrow-top-right.svg"
            alt=""
            style={{ width: 32, height: 32 }}
          />
        </motion.div>
      </div>

      {/* ── Below image: category tag + title ── */}
      <div className="mt-6">
        <span
          style={{
            fontFamily: "Inconsolata, monospace",
            fontSize: 14,
            fontWeight: 400,
            color: "#FF4F22",
          }}
        >
          {category}
        </span>
        <h3
          className="mt-2 capitalize"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 32,
            fontWeight: 500,
            lineHeight: "38px",
            color: hovered ? "#FF4F22" : "#FFFFFF",
            transition: "color 0.3s ease",
          }}
        >
          {title}
        </h3>
      </div>
    </article>
  );
}

const HomeBlog = () => {
  return (
    <section id="blog" className="mt-[324px] bg-black text-white">
      <Container>
        {/* Center-aligned section title */}
        <div className="text-center mb-12">
          <p
            style={{
              fontFamily: "Inconsolata, monospace",
              fontSize: 16,
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            // Blogs
          </p>
          <h2
            className="font-medium capitalize"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 64,
              lineHeight: "76.8px",
              letterSpacing: "-1.92px",
              color: "#ffffff",
            }}
          >
            Our <span style={{ color: "#FF4F22" }}>blogs</span>
          </h2>
        </div>

        {/* 2×2 grid — no gap between cards */}
        <div className="grid grid-cols-2">
          {posts.map((post, i) => (
            <BlogCard key={i} {...post} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HomeBlog;
