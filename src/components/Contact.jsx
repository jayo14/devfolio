import React from "react";
import { motion } from "framer-motion";
import GhostButton from "./GhostButton.jsx";

const Contact = () => {
  return (
    <section id="contact" className="bg-black px-6 py-40 text-white lg:px-20">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="font-inconsolata text-sm text-white/60">// Contact</p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[0.95] tracking-[-2px] md:text-[64px]">
            Let&apos;s build <span className="text-accent">something</span> useful
          </h2>
          <p className="mt-6 max-w-xl font-inconsolata text-base leading-7 text-white/60">
            Available for product design, front-end systems, and portfolio builds
            that need a strong visual point of view.
          </p>
          <div className="mt-10">
            <GhostButton href="mailto:hello@example.com">hello@example.com</GhostButton>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4 border border-white/10 bg-[#0a0a0a] p-8 lg:col-span-7 lg:p-10"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Your name"
              className="h-14 border border-white/10 bg-[#141414] px-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
            />
            <input
              type="email"
              placeholder="Email address"
              className="h-14 border border-white/10 bg-[#141414] px-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            className="h-14 w-full border border-white/10 bg-[#141414] px-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
          />
          <textarea
            rows={6}
            placeholder="Tell me about your project"
            className="w-full border border-white/10 bg-[#141414] px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
          />
          <div className="pt-2">
            <GhostButton href="#contact">Send Message</GhostButton>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
