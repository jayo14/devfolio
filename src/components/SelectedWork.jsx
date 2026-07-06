import React, { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import GhostButton from "./GhostButton.jsx";

const projects = [
  {
    title: "Newz Magazine Site",
    tags: ["#Magazine", "#Editorial"],
    accent: "from-white/20 via-white/5 to-transparent",
    mark: "N",
  },
  {
    title: "Roller-Coat",
    tags: ["#Branding", "#Logo"],
    accent: "from-[#ff5722]/30 via-[#ff5722]/10 to-transparent",
    mark: "R",
  },
  {
    title: "Fintech App",
    tags: ["#Fintech", "#Mobile"],
    accent: "from-cyan-400/20 via-white/5 to-transparent",
    mark: "F",
  },
  {
    title: "Eco Store",
    tags: ["#Ecommerce", "#Shopify"],
    accent: "from-emerald-400/20 via-white/5 to-transparent",
    mark: "E",
  },
];

const PlusCorner = ({ className = "" }) => (
  <div className={`absolute h-4 w-4 ${className}`}>
    <div
      className="absolute left-1/2 top-1/2 h-px w-3 bg-white/40"
      style={{ transform: "translate(-50%, -50%)" }}
    />
    <div
      className="absolute left-1/2 top-1/2 h-3 w-px bg-white/40"
      style={{ transform: "translate(-50%, -50%)" }}
    />
  </div>
);

const SelectedWork = () => {
  const autoplay = useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: false }),
    []
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      id="selected-work"
      aria-roledescription="carousel"
      className="bg-black py-40 px-6 text-white lg:px-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-20 flex items-end justify-between gap-8">
          <div>
            <p className="font-inconsolata text-sm text-white/60">// Selected Work</p>
            <h2 className="mt-3 text-[40px] font-semibold tracking-[-2px] md:text-[64px] lg:text-[80px]">
              <span className="text-accent">Featured</span> Projects
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 transition hover:border-accent hover:bg-accent hover:text-black"
              aria-label="Previous slide"
            >
              <HiChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 transition hover:border-accent hover:bg-accent hover:text-black"
              aria-label="Next slide"
            >
              <HiChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative border border-white/10 p-8">
          <PlusCorner className="left-2 top-2" />
          <PlusCorner className="right-2 top-2" />
          <PlusCorner className="bottom-2 left-2" />
          <PlusCorner className="bottom-2 right-2" />

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {projects.map((project, index) => {
                const isActive = index === selectedIndex;

                return (
                  <div key={project.title} className="min-w-0 flex-[0_0_100%]">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                      <motion.div
                        animate={{ y: isActive ? -10 : 10, scale: isActive ? 1 : 0.98 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#090909]"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
                        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_top_left,_rgba(255,255,255,0.45),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_18%)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-[180px] font-semibold leading-none tracking-[-0.08em] text-white/90">
                            {project.mark}
                          </div>
                        </div>
                        <div className="absolute left-6 top-6">
                          <p className="font-inconsolata text-xs uppercase tracking-[0.14em] text-white/50">
                            Project
                          </p>
                        </div>
                      </motion.div>

                      <div className="max-w-xl">
                        <h3 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
                          {project.title}
                        </h3>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-inconsolata text-xs text-white/80"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="mt-8 max-w-md font-inconsolata text-base leading-7 text-white/60">
                          A bold showcase slide built as a brutalist carousel frame with
                          layered depth, hover metadata, and motion-led transitions.
                        </p>

                        <div className="mt-8">
                          <GhostButton href="#contact">View Case Study</GhostButton>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
