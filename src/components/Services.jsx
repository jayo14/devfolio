import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";

const services = [
  {
    title: "Web Dev",
    tag: "#Developer",
    subTags: ["UserExperience", "Design"],
    desc: "Fast, modern, and scalable websites.",
  },
  {
    title: "UI/UX Design",
    tag: "#Developer",
    subTags: ["UserExperience", "Design"],
    desc: "Clean and user-friendly design.",
  },
  {
    title: "API Sync",
    tag: "#Developer",
    subTags: ["RESTAPI", "Integration"],
    desc: "Connect apps with third-party services.",
  },
  {
    title: "E-Shop",
    tag: "#Developer",
    subTags: ["Shopify", "WooCommerce"],
    desc: "Build smooth online shopping experiences.",
  },
  {
    title: "Speed Up",
    tag: "#Developer",
    subTags: ["#SEO", "WebSpeed"],
    desc: "Optimize sites for better performance.",
  },
];

const Services = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-6 py-40 text-white lg:px-20"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-cover bg-center"
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/681041be80af3b5ad83190e6_e17493dd07376337091a4af886d66994_services-bg.webp')",
          }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <SectionHeader tag="// Services" title="Web Development" highlight="Expertise" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4 }}
              className={`group border border-white/10 bg-black/30 p-10 backdrop-blur-[2px] transition-colors duration-300 hover:border-accent hover:bg-black/45 ${
                index === services.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-semibold tracking-[-0.03em]">
                  {service.title}
                </h3>
                <span className="font-inconsolata text-sm text-white/40">
                  {service.tag}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {service.subTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-inconsolata text-xs text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-8 max-w-md font-inconsolata text-base leading-7 text-white/60">
                {service.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
