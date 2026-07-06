import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { SiBehance, SiUpwork } from "react-icons/si";
import SectionHeader from "./SectionHeader.jsx";

const stats = [
  {
    icon: ({ className = "" }) => (
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 font-semibold text-white/50 ${className}`}
      >
        G
      </div>
    ),
    value: 4.8,
    suffix: "/5",
    label: "Star Rating",
    source: "on Goodfirms",
  },
  {
    icon: ({ className = "" }) => (
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 font-semibold text-white/50 ${className}`}
      >
        C
      </div>
    ),
    value: 50,
    prefix: "Top ",
    suffix: " Global",
    label: "Companies",
    source: "on Clutch",
  },
  {
    icon: SiUpwork,
    value: 95,
    suffix: "%",
    label: "Job Success",
    source: "on Upwork",
  },
  {
    icon: SiBehance,
    value: 20,
    prefix: "Top ",
    suffix: " Global Team",
    label: "",
    source: "on Behance",
  },
];

function CountUp({ to, decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, to, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setValue(latest),
    });

    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
    </span>
  );
}

const Partner = () => {
  return (
    <section id="partner" className="bg-black px-6 py-32 text-white lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          tag="// Partner"
          title="PARTNER WITH"
          highlight="+150 BRANDS"
        />

        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.source}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-black p-12 transition-colors duration-300 hover:bg-[#0a0a0a]"
            >
              <div className="flex h-full flex-col gap-6">
                <stat.icon className="text-white/40" />
                <p className="text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]">
                  {stat.prefix ?? ""}
                  <CountUp to={stat.value} decimals={stat.value % 1 ? 1 : 0} />
                  {stat.suffix ?? ""} {stat.label}
                </p>
                <p className="font-inconsolata text-sm text-white/60">
                  {stat.source}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partner;
