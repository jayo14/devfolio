import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, EASE_IN_OUT, DUR } from "../lib/easing.js";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";

const testimonials = [
  {
    name: "Emma Thompson",
    role: "Marketing Director",
    avatar: "https://i.pravatar.cc/120?img=1",
    quote:
      "Transformed our website with stunning visuals and smooth functionality, doubling user engagement.",
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    avatar: "https://i.pravatar.cc/120?img=12",
    quote:
      "Delivered a scalable backend with flawless execution, streamlining our operations significantly.",
  },
  {
    name: "Sarah Williams",
    role: "Product Lead",
    avatar: "https://i.pravatar.cc/120?img=5",
    quote:
      "Their ability to create high quality UI stands out — passionate, professional, and full of creativity. Highly recommend!",
  },
  {
    name: "Daniel Okafor",
    role: "Founder, Northstar",
    avatar: "https://i.pravatar.cc/120?img=32",
    quote:
      "The collaboration felt precise from kickoff to launch. Every interaction reinforced trust in the process and the final result.",
  },
  {
    name: "Aisha Bello",
    role: "Growth Lead",
    avatar: "https://i.pravatar.cc/120?img=47",
    quote:
      "They brought polish and speed together. The final product looked premium and also moved the business metrics we cared about.",
  },
  {
    name: "Owen Carter",
    role: "Chief Executive Officer",
    avatar: "https://i.pravatar.cc/120?img=59",
    quote:
      "The studio delivered with calm confidence, sharp communication, and a finish that made our brand feel meaningfully elevated.",
  },
];

/** 8×8px L-shaped corner marks — accent color, -1px offset from each corner */
function LCorners({ visible }) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: DUR.hover }}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Top-left */}
      <div className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-accent" />
      {/* Top-right */}
      <div className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-accent" />
      {/* Bottom-right */}
      <div className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-accent" />
      {/* Bottom-left */}
      <div className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-accent" />
    </motion.div>
  );
}

function TestimonialThumb({ avatar, name, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Select testimonial from ${name}`}
      className="relative block"
      style={{
        width: 108,
        height: 108,
        opacity: isActive ? 1 : 0.5,
        transition: "opacity 0.3s ease",
      }}
    >
      <img
        src={avatar}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <LCorners visible={isActive} />
    </button>
  );
}

const Testimonial = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const activeTestimonial = testimonials[active];

  return (
    <section
      id="testimonial"
      className="mt-[324px] bg-black pt-[324px] pb-[80px] text-white"
    >
      <Container>
        {/* Center-aligned section title */}
        <div className="text-center mb-16">
          <p className="font-inconsolata text-base text-white mb-3">
            // Testimonial
          </p>
          <h2
            className="text-[64px] font-medium capitalize text-white"
            style={{ lineHeight: "76.8px", letterSpacing: "-1.92px" }}
          >
            Client feedback{" "}
            <span className="text-accent">matters</span>
          </h2>
        </div>

        {/* Avatar row — 6 thumbs × 108px, gap-0, total 648px */}
        <div className="flex justify-center mb-12">
          <div
            className="grid grid-cols-6"
            style={{ width: 648, gap: 0 }}
          >
            {testimonials.map((t, i) => (
              <TestimonialThumb
                key={t.name}
                avatar={t.avatar}
                name={t.name}
                isActive={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>

        {/* Active testimonial card — 1294px wide, accent PlusCorner marks */}
        <div
          className="relative mx-auto border border-line"
          style={{ width: "min(1294px, 100%)" }}
        >
          {/* 4 PlusCorner marks in ACCENT color */}
          <PlusCorner corner="top-left" color="accent" />
          <PlusCorner corner="top-right" color="accent" />
          <PlusCorner corner="bottom-right" color="accent" />
          <PlusCorner corner="bottom-left" color="accent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: DUR.slide, ease: EASE_IN_OUT }}
              className="px-12 py-16"
            >
              <div className="grid grid-cols-2 gap-12 items-center">
                {/* LEFT — quote text */}
                <div>
                  <p
                    className="text-white"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 24,
                      fontWeight: 400,
                      lineHeight: "33.6px",
                    }}
                  >
                    &ldquo;{activeTestimonial.quote}&rdquo;
                  </p>
                </div>

                {/* RIGHT — avatar + name + role */}
                <div className="flex items-center gap-6">
                  <img
                    src={activeTestimonial.avatar}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <div
                      className="text-white"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 24,
                        fontWeight: 500,
                      }}
                    >
                      {activeTestimonial.name}
                    </div>
                    <p
                      className="mt-1"
                      style={{
                        fontFamily: "Inconsolata, monospace",
                        fontSize: 16,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};

export default Testimonial;
