import React from "react";
import { motion } from "framer-motion";

const Testimonial = () => {
  return (
    <section id="testimonial" className="bg-black px-6 py-40 text-white lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <p className="font-inconsolata text-sm text-white/60">// Testimonial</p>
            <h2 className="mt-3 text-[40px] font-semibold leading-[0.95] tracking-[-2px] md:text-[64px]">
              What <span className="text-accent">clients</span> say
            </h2>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative border border-white/10 bg-[#0a0a0a] p-10 lg:col-span-8 lg:p-14"
          >
            <p className="max-w-4xl text-2xl leading-[1.5] tracking-[-0.02em] text-white md:text-3xl">
              “The team shipped a design system and product experience that felt
              intentional from the first screen. The motion, hierarchy, and details
              all worked together.”
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 font-semibold">
                A
              </div>
              <div>
                <p className="font-medium text-white">Amina Bello</p>
                <p className="font-inconsolata text-sm text-white/60">
                  Product Lead, Northstar Studio
                </p>
              </div>
            </div>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
