import { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import SectionFrame from "./SectionFrame.jsx";
import { Container } from "./Container.jsx";

const awards = [
  {
    title: "Best Web Developer Award",
    tags: ["Web Development", "Frontend", "Innovation"],
    year: "2022 - Present",
  },
  {
    title: "Hackathon Champion",
    tags: ["Web Development", "Frontend", "Innovation"],
    year: "2022 - Present",
  },
  {
    title: "Outstanding Contribution to Open Source",
    tags: ["Web Development", "Frontend", "Innovation"],
    year: "2022 - Present",
  },
  {
    title: "Best Web Developer Award",
    tags: ["Web Development", "Frontend", "Innovation"],
    year: "2022 - Present",
  },
  {
    title: "Hackathon Champion",
    tags: ["Web Development", "Frontend", "Innovation"],
    year: "2022 - Present",
  },
  {
    title: "Outstanding Contribution to Open Source",
    tags: ["Web Development", "Frontend", "Innovation"],
    year: "2022 - Present",
  },
];

const Award = () => {
  const autoplay = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  );

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [autoplay]
  );

  return (
    <section id="award" className="mt-[324px] overflow-hidden bg-black py-32 text-white">
      <Container>
        <SectionFrame>
          <p className="font-inconsolata text-base text-white">// Awards</p>
          <h2 className="mt-3 text-[64px] font-medium capitalize leading-[76.8px] tracking-[-1.92px]">
            Awards and <span className="text-accent">honors</span>
          </h2>

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {awards.map((award, index) => (
                <motion.article
                  key={`${award.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="min-w-0 flex-[0_0_88%] border border-white/10 p-12 transition-colors hover:border-accent md:flex-[0_0_48%] lg:flex-[0_0_48%]"
                >
                  <div className="mb-12 flex items-start justify-between gap-6">
                    <span className="text-[clamp(5rem,10vw,7.5rem)] font-bold leading-none text-white/10">
                      {String((index % 3) + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-4 font-inconsolata text-sm text-white/60">
                      {award.year}
                    </span>
                  </div>

                  <h3 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
                    {award.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {award.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-inconsolata text-xs text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionFrame>
      </Container>
    </section>
  );
};

export default Award;
