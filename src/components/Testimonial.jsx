import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const testimonials = [
  { name: "Emma Thompson", role: "Marketing Director", quote: "Emma Thompson, Marketing Director\n\"Transformed our website with stunning visuals and smooth functionality, doubling user engagement.\"", avatar: originalAssets.clientImages[0], thumbAvatar: originalAssets.clientImages[0] },
  { name: "Michael Chen", role: "Chief Technology Officer", quote: "\"Delivered a scalable backend with flawless execution, streamlining our operations significantly.\"", avatar: originalAssets.clientImages[1], thumbAvatar: originalAssets.clientImages[1] },
  { name: "Conor Bradley", role: "Senior Marketing, Spotify", quote: "“Hubfolio studio ability to create a high quality UI is stands out. It’s somethingwe placed a premium on. A studio with passionate, professional, fun and full creativity. Recommend!.”", avatar: originalAssets.clientImages[2], thumbAvatar: originalAssets.clientImages[2] },
  { name: "Conor Bradley", role: "Senior Marketing, Spotify", quote: "\"Created a responsive site that tripled our traffic with outstanding professionalism.\"", avatar: originalAssets.clientImages[3], thumbAvatar: originalAssets.clientImages[3] },
  { name: "David Nguyen", role: "Product Manager", quote: "\"Crafted a user-friendly app with exceptional code quality, exceeding all expectations.\"", avatar: originalAssets.clientImages[4], thumbAvatar: originalAssets.clientImages[4] },
  { name: "James Carter", role: "Senior Marketing, Spotify", quote: "\"Developed a robust API that enhanced our system’s performance and reliability.\"", avatar: originalAssets.clientImages[2], thumbAvatar: originalAssets.clientImages[5] },
];

function TestimonialThumb({ testimonial, isActive, onClick, index }) {
  return (
    <button
      type="button"
      className={`testimonial-thumb ${isActive ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Testimonial ${index + 1} of ${testimonials.length}: ${testimonial.name}, ${testimonial.role}`}
    >
      <span className="testimonial-thumb-image-wrap"><img src={testimonial.thumbAvatar} alt="" className="testimonial-thumb-image" loading="lazy" /></span>
      {isActive && <div className="testimonial-thumb-active-bg" aria-hidden="true"><PlusCorner corner="top-left" color="accent" /><PlusCorner corner="top-right" color="accent" /><PlusCorner corner="bottom-right" color="accent" /><PlusCorner corner="bottom-left" color="accent" /></div>}
      <span className="sr-only">Testimonial {index + 1}</span>
    </button>
  );
}

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 100 : -100,
    opacity: 0.15,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 32 },
      opacity: { duration: 0.28 },
      scale: { duration: 0.28 },
    },
  },
  exit: (dir) => ({
    x: dir > 0 ? -100 : 100,
    opacity: 0.15,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 32 },
      opacity: { duration: 0.22 },
      scale: { duration: 0.22 },
    },
  }),
};

const Testimonial = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  const prevIndex = (active - 1 + testimonials.length) % testimonials.length;
  const nextIndex = (active + 1) % testimonials.length;

  const selectPrevious = useCallback(() => {
    setDirection(-1);
    setActive((current) => (current - 1 + testimonials.length) % testimonials.length);
  }, []);

  const selectNext = useCallback(() => {
    setDirection(1);
    setActive((current) => (current + 1) % testimonials.length);
  }, []);

  const selectIndex = useCallback((target) => {
    if (target === active) return;
    setDirection(target > active ? 1 : -1);
    setActive(target);
  }, [active]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") selectPrevious();
      if (event.key === "ArrowRight") selectNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectPrevious, selectNext]);

  const activeTestimonial = testimonials[active];
  const prevTestimonial = testimonials[prevIndex];
  const nextTestimonial = testimonials[nextIndex];

  return (
    <section id="testimonial" className="original-testimonial bg-black text-white" aria-label="Client Testimonials">
      <Container>
        <div className="section-heading centered">
          <p className="eyebrow">// Testimonial</p>
          <h2>Client feedback <span>matters</span></h2>
        </div>

        <div className="testimonial-vh-wrap">
          <div className="testimonial-sticky-wrap">
            <div className="testimonial-content-wrap">
              {/* Top Avatar Thumbnails Selector */}
              <div className="testimonial-thumbs-wrap">
                <div className="testimonial-thumbs-grid">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialThumb
                      key={`${testimonial.name}-${index}`}
                      testimonial={testimonial}
                      index={index}
                      isActive={index === active}
                      onClick={() => selectIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* 3-Card Interactive Slider Stage */}
              <div className="testimonial-slider">
                <div className="testimonial-stage" aria-live="polite" aria-atomic="true">
                  <div className="testimonial-track-wrap flex items-center justify-center gap-3 sm:gap-5 md:gap-8 w-full overflow-hidden py-4">
                    {/* Previous Testimonial (Left / Front of Card) */}
                    <button
                      type="button"
                      onClick={selectPrevious}
                      className="group relative flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center border border-[#232221] bg-[#0c0c0c] w-[58px] sm:w-[84px] md:w-[210px] lg:w-[250px] shrink-0 min-h-[290px] sm:min-h-[330px] md:min-h-[360px] opacity-40 hover:opacity-85 scale-95 hover:scale-[0.98] transition-all duration-300 cursor-pointer text-white select-none overflow-hidden"
                      aria-label={`Slide to previous testimonial: ${prevTestimonial.name}`}
                    >
                      <PlusCorner corner="top-left" color="white" />
                      <PlusCorner corner="top-right" color="white" />
                      <PlusCorner corner="bottom-right" color="white" />
                      <PlusCorner corner="bottom-left" color="white" />

                      <span className="hidden md:inline-flex mb-4 items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-accent group-hover:underline">
                        <HiChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        <span>Previous</span>
                      </span>

                      <div className="relative mb-2 md:mb-3.5 group-hover:scale-105 transition-transform duration-300">
                        <div className="h-11 w-11 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-accent transition-colors duration-300 p-0.5 bg-black">
                          <img
                            src={prevTestimonial.avatar}
                            alt={prevTestimonial.name}
                            className="h-full w-full object-cover rounded-full filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="hidden md:block w-full">
                        <p className="font-bold text-sm lg:text-base text-white/90 truncate max-w-full">
                          {prevTestimonial.name}
                        </p>
                        <p className="font-mono text-xs text-white/50 truncate mt-0.5 max-w-full">
                          {prevTestimonial.role}
                        </p>
                        <p className="mt-3.5 text-xs text-white/40 italic line-clamp-2 text-center max-w-full px-2">
                          {prevTestimonial.quote.replace(/^[^"]*"/, '"')}
                        </p>
                      </div>
                    </button>

                    {/* Active Testimonial (Center Card) */}
                    <div className="relative w-full max-w-[560px] lg:max-w-[620px] min-h-[360px] shrink-0 flex items-center justify-center">
                      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                        <motion.article
                          key={active}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.2}
                          onDragEnd={(_, info) => {
                            if (info.offset.x > 40 || info.velocity.x > 300) {
                              selectPrevious();
                            } else if (info.offset.x < -40 || info.velocity.x < -300) {
                              selectNext();
                            }
                          }}
                          style={{ touchAction: "pan-y" }}
                          className="testimonial-card w-full shadow-2xl z-10 cursor-grab active:cursor-grabbing border border-[#2e2c2b]"
                        >
                          <PlusCorner corner="top-left" color="accent" />
                          <PlusCorner corner="top-right" color="accent" />
                          <PlusCorner corner="bottom-right" color="accent" />
                          <PlusCorner corner="bottom-left" color="accent" />
                          <p className="testimonial-quote">
                            {activeTestimonial.quote.split("\n").map((line, index) => (
                              <span key={`${line}-${index}`}>
                                {line}
                                {index === 0 && active === 0 ? <br /> : null}
                              </span>
                            ))}
                          </p>
                          <div className="testimonial-client">
                            <img
                              src={activeTestimonial.avatar}
                              alt={activeTestimonial.name}
                              className="testimonial-client-image"
                            />
                            <div>
                              <p className="testimonial-client-name">{activeTestimonial.name}</p>
                              <p className="testimonial-client-role">{activeTestimonial.role}</p>
                            </div>
                          </div>
                        </motion.article>
                      </AnimatePresence>
                    </div>

                    {/* Next Testimonial (Right / Behind-End of Card) */}
                    <button
                      type="button"
                      onClick={selectNext}
                      className="group relative flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center border border-[#232221] bg-[#0c0c0c] w-[58px] sm:w-[84px] md:w-[210px] lg:w-[250px] shrink-0 min-h-[290px] sm:min-h-[330px] md:min-h-[360px] opacity-40 hover:opacity-85 scale-95 hover:scale-[0.98] transition-all duration-300 cursor-pointer text-white select-none overflow-hidden"
                      aria-label={`Slide to next testimonial: ${nextTestimonial.name}`}
                    >
                      <PlusCorner corner="top-left" color="white" />
                      <PlusCorner corner="top-right" color="white" />
                      <PlusCorner corner="bottom-right" color="white" />
                      <PlusCorner corner="bottom-left" color="white" />

                      <span className="hidden md:inline-flex mb-4 items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-accent group-hover:underline">
                        <span>Next</span>
                        <HiChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>

                      <div className="relative mb-2 md:mb-3.5 group-hover:scale-105 transition-transform duration-300">
                        <div className="h-11 w-11 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-accent transition-colors duration-300 p-0.5 bg-black">
                          <img
                            src={nextTestimonial.avatar}
                            alt={nextTestimonial.name}
                            className="h-full w-full object-cover rounded-full filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="hidden md:block w-full">
                        <p className="font-bold text-sm lg:text-base text-white/90 truncate max-w-full">
                          {nextTestimonial.name}
                        </p>
                        <p className="font-mono text-xs text-white/50 truncate mt-0.5 max-w-full">
                          {nextTestimonial.role}
                        </p>
                        <p className="mt-3.5 text-xs text-white/40 italic line-clamp-2 text-center max-w-full px-2">
                          {nextTestimonial.quote.replace(/^[^"]*"/, '"')}
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Carousel Control Bar with Arrows and Counter */}
                  <div className="testimonial-controls flex items-center justify-center gap-6 mt-8">
                    <button
                      type="button"
                      className="testimonial-arrow-btn"
                      aria-label="Previous testimonial"
                      onClick={selectPrevious}
                    >
                      <HiChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <div className="testimonial-counter font-mono text-sm tracking-widest text-white/50">
                      <strong className="text-white">{String(active + 1).padStart(2, "0")}</strong>
                      <span className="mx-2 text-white/30">/</span>
                      <span>{String(testimonials.length).padStart(2, "0")}</span>
                    </div>
                    <button
                      type="button"
                      className="testimonial-arrow-btn"
                      aria-label="Next testimonial"
                      onClick={selectNext}
                    >
                      <HiChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Testimonial;
