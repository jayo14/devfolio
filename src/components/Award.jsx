import React from "react";
import { motion } from "framer-motion";

const awards = [
  { label: "Awwwards", value: "Site of the Day", year: "2025" },
  { label: "FWA", value: "Honorable Mention", year: "2025" },
  { label: "CSSDA", value: "Best UI", year: "2024" },
];

const Award = () => {
  return (
    <section id="award" className="bg-black px-6 py-40 text-white lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex justify-end">
          <p className="font-inconsolata text-sm text-white/60">// Award</p>
        </div>

        <h2 className="mt-8 text-[40px] font-semibold leading-[0.95] tracking-[-2px] md:text-[64px]">
          Recognition with <span className="text-accent">impact</span>
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {awards.map((award, index) => (
            <motion.div
              key={award.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-white/10 bg-[#0a0a0a] p-8"
            >
              <p className="font-inconsolata text-xs uppercase tracking-[0.14em] text-white/50">
                {award.label}
              </p>
              <p className="mt-4 text-3xl font-semibold">{award.value}</p>
              <p className="mt-8 font-inconsolata text-sm text-white/60">
                {award.year}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Award;
