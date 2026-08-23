import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
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
    <button type="button" className={`testimonial-thumb ${isActive ? "is-active" : ""}`} onClick={onClick} aria-label={`Select testimonial from ${testimonial.name}`}>
      <span className="testimonial-thumb-image-wrap"><img src={testimonial.thumbAvatar} alt="" className="testimonial-thumb-image" loading="lazy" /></span>
      {isActive && <div className="testimonial-thumb-active-bg" aria-hidden="true"><PlusCorner corner="top-left" color="accent" /><PlusCorner corner="top-right" color="accent" /><PlusCorner corner="bottom-right" color="accent" /><PlusCorner corner="bottom-left" color="accent" /></div>}
      <span className="sr-only">Testimonial {index + 1}</span>
    </button>
  );
}

const Testimonial = () => {
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (window.innerWidth <= 991) return;
    const section = document.getElementById("testimonial");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const viewportProgress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / Math.max(section.offsetHeight, 1)));
    const next = Math.min(testimonials.length - 1, Math.floor(viewportProgress * testimonials.length));
    if (latest > 0 && next !== active) setActive(next);
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") setActive((current) => (current - 1 + testimonials.length) % testimonials.length);
      if (event.key === "ArrowRight") setActive((current) => (current + 1) % testimonials.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeTestimonial = testimonials[active];
  const selectPrevious = () => setActive((current) => Math.max(0, current - 1));
  const selectNext = () => setActive((current) => Math.min(testimonials.length - 1, current + 1));

  return (
    <section id="testimonial" className="original-testimonial bg-black text-white">
      <Container>
        <div className="section-heading centered"><p className="eyebrow">// Testimonial</p><h2>Client feedback <span>matters</span></h2></div>
        <div className="testimonial-vh-wrap">
          <div className="testimonial-sticky-wrap">
            <div className="testimonial-content-wrap">
              <div className="testimonial-thumbs-wrap">
                <div className="testimonial-thumbs-grid">
                  {testimonials.map((testimonial, index) => <TestimonialThumb key={`${testimonial.name}-${index}`} testimonial={testimonial} index={index} isActive={index === active} onClick={() => setActive(index)} />)}
                </div>
              </div>
              <div className="testimonial-slider">
                <div className="testimonial-stage">
                  <AnimatePresence mode="wait">
                    <motion.article key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="testimonial-card">
                      <PlusCorner corner="top-left" color="accent" /><PlusCorner corner="top-right" color="accent" /><PlusCorner corner="bottom-right" color="accent" /><PlusCorner corner="bottom-left" color="accent" />
                      <p className="testimonial-quote">{activeTestimonial.quote.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}{index === 0 && active === 0 ? <br /> : null}</span>)}</p>
                      <div className="testimonial-client"><img src={activeTestimonial.avatar} alt="" className="testimonial-client-image" /><div><p className="testimonial-client-name">{activeTestimonial.name}</p><p className="testimonial-client-role">{activeTestimonial.role}</p></div></div>
                    </motion.article>
                  </AnimatePresence>
                  <button type="button" className="testimonial-arrow testimonial-arrow-left" aria-label="Previous testimonial" disabled={active === 0} onClick={selectPrevious}><HiChevronLeft aria-hidden="true" /></button>
                  <button type="button" className="testimonial-arrow testimonial-arrow-right" aria-label="Next testimonial" disabled={active === testimonials.length - 1} onClick={selectNext}><HiChevronRight aria-hidden="true" /></button>
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
