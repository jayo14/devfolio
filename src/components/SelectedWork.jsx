import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import GhostButton from "./GhostButton.jsx";
import PlusCorner from "./PlusCorner.jsx";

const projects = [
  {
    title: "Newz Magazine Site",
    tags: ["#Magazine", "#Editorial"],
    glyph: "N",
    summary:
      "An editorial system with sharp typography, layered cards, and a fast reading experience tuned for long-form content.",
    tone: "from-white/18 via-white/5 to-transparent",
    glyphClass: "text-white/85 drop-shadow-[0_0_30px_rgba(255,255,255,0.18)]",
  },
  {
    title: "Roller-Coat",
    tags: ["#Branding", "#Logo"],
    glyph: "R",
    summary:
      "A brand slide built around a warm orange monogram with enough contrast to read like a hero mark at any size.",
    tone: "from-[#ff5722]/35 via-[#ff5722]/10 to-transparent",
    glyphClass:
      "text-[#ff5722] drop-shadow-[0_0_42px_rgba(255,87,34,0.72)]",
  },
  {
    title: "Fintech App",
    tags: ["#Fintech", "#Mobile"],
    glyph: "F",
    summary:
      "A finance product layout that balances trust, speed, and clarity with a dense but controlled interface system.",
    tone: "from-cyan-400/25 via-white/5 to-transparent",
    glyphClass: "text-cyan-100 drop-shadow-[0_0_30px_rgba(103,232,249,0.2)]",
  },
  {
    title: "Eco Store",
    tags: ["#Ecommerce", "#Shopify"],
    glyph: "E",
    summary:
      "A commerce presentation with sustainable cues, soft depth, and a stronger focus on product confidence.",
    tone: "from-emerald-400/25 via-white/5 to-transparent",
    glyphClass: "text-emerald-100 drop-shadow-[0_0_30px_rgba(110,231,183,0.2)]",
  },
];

const SelectedWork = () => {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
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
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work showcase"
      className="bg-black px-6 py-40 text-white lg:px-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-20 flex items-end justify-between gap-8">
          <div>
            <p className="font-inconsolata text-sm text-white/60">// Selected Work</p>
            <h2 className="mt-3 text-[clamp(3.5rem,7vw,5rem)] font-semibold tracking-[-2px]">
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

        <div className="relative border border-white/10 bg-white/[0.02] p-4 sm:p-8">
          <PlusCorner key={`corner-tl-${selectedIndex}`} className="left-2 top-2" />
          <PlusCorner key={`corner-tr-${selectedIndex}`} className="right-2 top-2" />
          <PlusCorner key={`corner-bl-${selectedIndex}`} className="bottom-2 left-2" />
          <PlusCorner key={`corner-br-${selectedIndex}`} className="bottom-2 right-2" />

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {projects.map((project, index) => {
                const isActive = index === selectedIndex;

                return (
                  <div key={project.title} className="min-w-0 flex-[0_0_100%]">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                      <motion.div
                        animate={{
                          y: isActive ? 0 : 10,
                          scale: isActive ? 1 : 0.985,
                        }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#090909]"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${project.tone}`}
                        />
                        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_top_left,_rgba(255,255,255,0.45),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.16),_transparent_18%),linear-gradient(135deg,_rgba(255,255,255,0.06)_0,_transparent_20%,_transparent_80%,_rgba(255,255,255,0.05)_100%)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.65))]" />

                        <div className="absolute left-6 top-6 z-10">
                          <p className="font-inconsolata text-xs uppercase tracking-[0.18em] text-white/50">
                            Project {String(index + 1).padStart(2, "0")}
                          </p>
                        </div>

                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                          <div
                            className={`text-[clamp(8rem,18vw,14rem)] font-semibold leading-none tracking-[-0.1em] ${project.glyphClass}`}
                          >
                            {project.glyph}
                          </div>
                        </div>

                        <div className="absolute bottom-6 right-6 z-10 text-right">
                          <p className="font-inconsolata text-xs uppercase tracking-[0.18em] text-white/50">
                            {project.tags[0]}
                          </p>
                        </div>
                      </motion.div>

                      <div className="max-w-xl">
                        <p className="font-inconsolata text-sm text-white/50">
                          // Case Study
                        </p>
                        <h3 className="mt-4 text-[clamp(2.75rem,4vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
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
                          {project.summary}
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
