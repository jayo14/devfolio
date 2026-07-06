import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./Navbar.jsx";
import SplineScene from "./SplineScene.jsx";
import GhostButton from "./GhostButton.jsx";

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const statsVariants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const CornerMarks = () => (
  <>
    <span className="absolute left-4 top-4 h-3 w-3 border-l border-t border-white/40" />
    <span className="absolute right-4 top-4 h-3 w-3 border-r border-t border-white/40" />
    <span className="absolute left-4 bottom-4 h-3 w-3 border-b border-l border-white/40" />
    <span className="absolute right-4 bottom-4 h-3 w-3 border-b border-r border-white/40" />
  </>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 800], [0, 200]);
  const y3d = useTransform(scrollY, [0, 800], [0, -120]);
  const scrollBarScale = useTransform(scrollY, [0, 600], [0, 1]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollBarScale }}
        className="fixed left-0 top-[69px] z-50 h-px w-full origin-left bg-accent"
      />

      <motion.div
        style={{ y: yText }}
        className="relative z-10 mx-auto max-w-[1440px] px-6 pb-[120px] pt-[185px] lg:px-20 lg:pb-[200px]"
      >
        <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="relative z-10 lg:col-span-7"
          >
            <motion.p
              variants={revealVariants}
              className="font-inconsolata text-sm text-white/60"
            >
              // Hello, World!
            </motion.p>

            <motion.h1 className="mt-6 text-[72px] font-medium leading-[0.96] tracking-[-2px] md:text-[96px] lg:text-[120px] lg:tracking-[-4.8px]">
              <motion.span custom={0.1} variants={lineVariants} className="block text-white">
                John
              </motion.span>
              <motion.span custom={0.2} variants={lineVariants} className="block text-accent">
                Lennon
              </motion.span>
            </motion.h1>

            <motion.p
              custom={0.3}
              variants={lineVariants}
              className="mt-6 text-2xl font-medium text-white"
            >
              Fullstack Developer
            </motion.p>

            <div className="mt-8">
              <GhostButton href="#contact">NixtNocode</GhostButton>
            </div>

            <motion.p
              custom={0.5}
              variants={lineVariants}
              className="mt-8 max-w-[440px] font-inconsolata text-base leading-7 text-white/60"
            >
              We're a digital products design and development agency that
              passionate with the digital experiences.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.6,
                },
              },
            }}
            className="relative z-10 flex flex-col items-end gap-10 pt-14 text-right lg:col-span-5"
          >
            <motion.div variants={statsVariants} className="max-w-[300px]">
              <p className="font-inconsolata text-xs uppercase tracking-[0.12em] text-white/60">
                Clients satisfied and repeating
              </p>
              <p className="mt-2 text-[72px] font-bold leading-none tracking-[-0.04em] md:text-[86px] lg:text-[96px]">
                95%
              </p>
            </motion.div>

            <motion.div variants={statsVariants} className="max-w-[300px]">
              <p className="font-inconsolata text-xs uppercase tracking-[0.12em] text-white/60">
                Projects completed in 24 countries
              </p>
              <p className="mt-2 text-[72px] font-bold leading-none tracking-[-0.04em] md:text-[86px] lg:text-[96px]">
                86+
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            style={{ y: y3d }}
            className="pointer-events-auto absolute left-1/2 top-[300px] z-0 h-[630px] w-[min(656px,calc(100vw-2rem))] -translate-x-1/2 lg:top-[240px] lg:w-[656px]"
          >
            <div className="relative h-full w-full border border-white/10 bg-[#050505]">
              <CornerMarks />
              <React.Suspense
                fallback={<div className="h-full w-full bg-black" />}
              >
                <SplineScene />
              </React.Suspense>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
