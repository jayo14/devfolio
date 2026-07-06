import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";

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
      "Hubfolio studio ability to create a high quality UI is stands out. It's something we placed a premium on. A studio with passionate, professional, fun and full creativity. Recommend!",
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
      className="bg-black px-6 py-32 text-white lg:px-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          tag="// Testimonial"
          title="Client Feedback"
          highlight="Matters"
          align="center"
        />

        <div className="mb-16 flex flex-wrap justify-center gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => {
            const isActive = index === active;

            return (
              <motion.button
                key={testimonial.name}
                type="button"
                onClick={() => setActive(index)}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`relative h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-white/5 transition-all duration-300 ${
                  isActive
                    ? "ring-2 ring-accent ring-offset-4 ring-offset-black"
                    : "hover:opacity-80"
                }`}
                aria-label={`Select testimonial from ${testimonial.name}`}
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-8 text-[4rem] leading-none text-accent/90">
              &ldquo;
            </div>

            <p className="text-[clamp(1.6rem,3vw,2.75rem)] font-medium leading-[1.45] tracking-[-0.03em] text-white">
              {activeTestimonial.quote}
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <img
                src={activeTestimonial.avatar}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
              />
              <div className="text-left">
                <p className="text-lg font-semibold text-white">
                  {activeTestimonial.name}
                </p>
                <p className="font-inconsolata text-sm text-white/60">
                  {activeTestimonial.role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Testimonial;
