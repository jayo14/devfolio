import { Suspense } from "react";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Navbar from "./Navbar.jsx";
import SplineScene from "./SplineScene.jsx";
import GhostButton from "./GhostButton.jsx";
import { Container } from "./Container.jsx";
import { CounterCard } from "./CounterCard.jsx";

const Hero = () => {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  const y3d = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity3d = useTransform(scrollY, [0, 800], [1, 0]);
  const scrollBarScale = useTransform(scrollY, [0, 600], [0, 1]);
  const rotateX = useSpring(useMotionValue(0), {
    stiffness: 140,
    damping: 18,
    mass: 0.8,
  });
  const rotateY = useSpring(useMotionValue(0), {
    stiffness: 140,
    damping: 18,
    mass: 0.8,
  });

  const handlePointerMove = (event) => {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    rotateY.set((x - 0.5) * 18);
    rotateX.set((0.5 - y) * 14);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden bg-black pt-[185px] pb-[200px] text-white"
    >
      <Navbar />

      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollBarScale }}
        className="fixed left-0 top-[77px] z-50 h-px w-full origin-left bg-accent"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[970.5px_323.5px]">
          <div className="relative min-h-[860px] overflow-visible">
            <div className="relative z-10">
              <p className="mb-6 font-inconsolata text-base text-white">
                // Hello, World!
              </p>

              <h1 className="font-sans text-[120px] font-medium leading-[120px] tracking-[-4.8px] text-white">
                John <span className="text-accent">Lennon</span>
              </h1>

              <p className="mt-4 font-sans text-[40px] font-normal text-[rgba(255,255,255,0.6)]">
                &quot; Fullstack Developer &quot;
              </p>
            </div>

            <div className="mt-12 flex items-start gap-12">
              <GhostButton href="/about-us">NixtNocode</GhostButton>
              <p className="max-w-[324px] font-inconsolata text-base text-[rgba(255,255,255,0.6)]">
                We&apos;re a digital products design and development agency that
                passionate with the digital experiences.
              </p>
            </div>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-[396px] top-[401px] z-0 h-[630px] w-[647px]"
              style={{
                y: y3d,
                opacity: opacity3d,
                rotateX,
                rotateY,
                perspective: 1200,
                transformStyle: "preserve-3d",
              }}
            >
              <Suspense fallback={<div className="h-full w-full bg-black" />}>
                <SplineScene />
              </Suspense>
            </motion.div>
          </div>

          <div className="flex flex-col items-start">
            <CounterCard
              label="Clients satisfied and repeating"
              targetNumber="95"
              hasBottomBorder={false}
            />
            <CounterCard
              label="projects completed in 24 countries"
              targetNumber="86"
              suffix="+"
              hasBottomBorder
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
