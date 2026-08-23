import { Suspense, useEffect, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import gsap from "gsap";
import Navbar from "./Navbar.jsx";
import SplineScene from "./SplineScene.jsx";
import GhostButton from "./GhostButton.jsx";
import { Container } from "./Container.jsx";
import { CounterCard } from "./CounterCard.jsx";

const Hero = ({ showCounters = true }) => {
  const splineTrackRef = useRef(null);
  const splineWrapRef = useRef(null);
  const { scrollY } = useScroll();
  const scrollBarScale = useTransform(scrollY, [0, 600], [0, 1]);

  useEffect(() => {
    const track = splineTrackRef.current;
    const scene = splineWrapRef.current;
    if (!track || !scene) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(track, { opacity: 1 });
      return undefined;
    }

    gsap.fromTo(track, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.1, delay: 0.35, ease: "power3.out" });
    const updateScroll = () => {
      const progress = Math.min(window.scrollY / 900, 1);
      gsap.to(scene, { y: -progress * 90, duration: 0.55, ease: "power2.out", overwrite: true });
    };
    const updatePointer = (event) => {
      const bounds = track.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5;
      const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5;
      gsap.to(scene, { rotationY: x * 5, rotationX: y * -4, duration: 0.5, ease: "power3.out", overwrite: true });
    };
    const resetPointer = () => gsap.to(scene, { rotationY: 0, rotationX: 0, duration: 0.65, ease: "power3.out", overwrite: true });

    window.addEventListener("scroll", updateScroll, { passive: true });
    track.addEventListener("pointermove", updatePointer);
    track.addEventListener("pointerleave", resetPointer);
    updateScroll();
    return () => {
      window.removeEventListener("scroll", updateScroll);
      track.removeEventListener("pointermove", updatePointer);
      track.removeEventListener("pointerleave", resetPointer);
      gsap.killTweensOf([track, scene]);
    };
  }, []);

  return (
    <section id="home" className="hero-section relative overflow-hidden bg-black pt-[185px] pb-[200px] text-white">
      <Navbar />
      <motion.div aria-hidden="true" style={{ scaleX: scrollBarScale }} className="fixed left-0 top-[77px] z-50 h-px w-full origin-left bg-accent" />
      <Container>
        <div className="hero-content-grid grid grid-cols-1 gap-x-16 lg:grid-cols-[3fr_1fr]">
          <div className="hero-content-left">
            <div className="hero-details-wrap">
              <div className="hero-sub-title-wrap"><p className="hero-sub-title mb-6 font-inconsolata text-base text-white">// Hello, World!</p></div>
              <div className="hero-title-wrap"><h1 className="hero-title font-sans text-[120px] font-medium leading-[120px] tracking-[-4.8px] text-white">John <span className="text-accent">Samuel</span></h1></div>
              <p className="hero-position mt-4 font-sans text-[40px] font-normal text-[rgba(255,255,255,0.6)]">&quot; Fullstack Developer &quot;</p>
            </div>
            <div className="hero-content-flex">
              <div className="hero-flex-left">
                <div className="hero-desc-wrap mt-12 lg:mt-[110px]">
                  <div className="hero-button-wrap mb-[150px] max-w-[324px]"><GhostButton href="/about-us">NixtNocode</GhostButton></div>
                  <p className="hero-desc-text max-w-[324px] font-inconsolata text-base text-[rgba(255,255,255,0.6)]">We&apos;re a digital products design and development agency that passionate with the digital experiences.</p>
                </div>
              </div>
              <div ref={splineTrackRef} className="hero-3d-track" aria-label="Interactive 3D keyboard">
                <div ref={splineWrapRef} className="hero-3d-wrap" aria-hidden="true"><Suspense fallback={<div className="h-full w-full bg-black" />}><SplineScene /></Suspense></div>
              </div>
            </div>
          </div>
          {showCounters && <div className="hero-content-right flex flex-col items-start"><CounterCard label="Clients satisfied and repeating" targetNumber="95" hasBottomBorder={false} /><CounterCard label="projects completed in 24 countries" targetNumber="86" suffix="+" hasBottomBorder /></div>}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
