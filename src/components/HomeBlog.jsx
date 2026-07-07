import { motion } from "framer-motion";
import { HiArrowUpRight, HiCalendarDays } from "react-icons/hi2";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";

const posts = [
  {
    title: "UI/UX for Developers: The Power of Simplicity",
    category: "Insurance",
    date: "May 12, 2024",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Hubfolio agency revolutionizes work with the power of AI-Driven",
    category: "Insurance",
    date: "Apr 28, 2024",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Why Performance Matters More Than Ever in 2024",
    category: "Performance",
    date: "Apr 10, 2024",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  },
];

const HomeBlog = () => {
  return (
    <section id="blog" className="mt-[324px] bg-black py-32 text-white">
      <Container>
        <p className="font-inconsolata text-base text-white">// Blog</p>
        <h2 className="mt-3 text-[64px] font-medium capitalize leading-[76.8px] tracking-[-1.92px]">
          Our <span className="text-accent">blogs</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border border-white/10 transition-colors hover:border-accent"
            >
              <motion.div
                initial={{ opacity: 0, y: 32, rotate: 225 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                {[0, 1, 2, 3].map((cornerIndex) => (
                  <PlusCorner
                    key={`${post.title}-corner-${cornerIndex}`}
                    corner={
                      cornerIndex === 0
                        ? "top-left"
                        : cornerIndex === 1
                          ? "top-right"
                          : cornerIndex === 2
                            ? "bottom-right"
                            : "bottom-left"
                    }
                    animated
                    delay={0.15 + cornerIndex * 0.08 + index * 0.05}
                  />
                ))}

                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              <div className="p-8">
                <div className="mb-4 flex items-center gap-4 font-inconsolata text-xs text-white/60">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-2">
                    <HiCalendarDays className="h-4 w-4" aria-hidden="true" />
                    {post.date}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold leading-snug transition-colors group-hover:text-[rgb(161,170,170)]">
                  {post.title}
                </h3>

                <div className="mt-6 inline-flex items-center gap-2 font-inconsolata text-sm text-white/80">
                  Read More
                  <HiArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HomeBlog;
