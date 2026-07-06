import React from "react";
import { motion } from "framer-motion";

const partners = [
  "Northstar",
  "Venture Lab",
  "Monument",
  "Studio 54",
  "Cloud Forge",
  "Kinetic",
];

const Partner = () => {
  return (
    <section id="partner" className="bg-black px-6 py-32 text-white lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-inconsolata text-sm text-white/60">// Partner</p>
            <h2 className="mt-3 text-[40px] font-semibold tracking-[-2px] md:text-[64px]">
              Trusted by <span className="text-accent">teams</span>
            </h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-3 lg:grid-cols-6"
        >
          {partners.map((partner) => (
            <div
              key={partner}
              className="flex min-h-32 items-center justify-center bg-black px-6 text-center font-medium text-white/80 transition-colors hover:text-accent"
            >
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partner;
