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

    // Enable true 3D perspective and center origin on both track and scene
    gsap.set(track, {
      perspective: 1000,
      transformStyle: "preserve-3d",
    });
    gsap.set(scene, {
      transformPerspective: 1000,
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      force3D: true,
    });

    // Define interpolators using gsap.utils.interpolate() for full 3-axis rotation (X, Y, Z) and translation
    const interpRotX = gsap.utils.interpolate(28, -28); // Pitch: tilts up when mouse is above, down when below
    const interpRotY = gsap.utils.interpolate(-36, 36); // Yaw: turns left when mouse is left, right when mouse is right
    const interpRotZ = gsap.utils.interpolate(-14, 14); // Roll: dynamic 3D banking along Z axis
    const interpTransX = gsap.utils.interpolate(-28, 28); // Parallax translation X
    const interpTransY = gsap.utils.interpolate(-20, 20); // Parallax translation Y
    const interpTransZ = gsap.utils.interpolate(0, 42); // Parallax depth Z

    // High-performance GSAP quickTo() setters for smooth, cursor-driven 3D perspective tilt
    const rotateXTo = gsap.quickTo(scene, "rotationX", { duration: 0.6, ease: "power2.out" });
    const rotateYTo = gsap.quickTo(scene, "rotationY", { duration: 0.6, ease: "power2.out" });
    const rotateZTo = gsap.quickTo(scene, "rotationZ", { duration: 0.7, ease: "power2.out" });
    const xTo = gsap.quickTo(scene, "x", { duration: 0.6, ease: "power2.out" });
    const yTo = gsap.quickTo(scene, "y", { duration: 0.6, ease: "power2.out" });
    const zTo = gsap.quickTo(scene, "z", { duration: 0.6, ease: "power2.out" });

    const updateScroll = () => {
      const progress = Math.min(window.scrollY / 900, 1);
      gsap.to(track, { y: -progress * 90, duration: 0.55, ease: "power2.out", overwrite: "auto" });
    };

    const updatePointer = (event) => {
      const rect = track.getBoundingClientRect();

      // Only track when hero scene is roughly in view
      if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates [-1.2, 1.2] relative to the 3D keyboard center
      const normX = gsap.utils.clamp(-1.2, 1.2, (event.clientX - centerX) / (window.innerWidth * 0.5));
      const normY = gsap.utils.clamp(-1.2, 1.2, (event.clientY - centerY) / (window.innerHeight * 0.5));

      // Map normalized space to [0, 1] progress for gsap.utils.interpolate()
      const progressX = (normX + 1.2) / 2.4;
      const progressY = (normY + 1.2) / 2.4;
      const progressRoll = gsap.utils.clamp(0, 1, ((normX * -normY) + 1) / 2);
      const progressDist = gsap.utils.clamp(0, 1, (Math.abs(normX) + Math.abs(normY)) / 1.8);

      // Interpolate values across X, Y, and Z axes
      const targetRotX = interpRotX(progressY);
      const targetRotY = interpRotY(progressX);
      const targetRotZ = interpRotZ(progressRoll) + normX * -5;
      const targetX = interpTransX(progressX);
      const targetY = interpTransY(progressY);
      const targetZ = interpTransZ(progressDist);

      // Pipe to quickTo() setters
      rotateXTo(targetRotX);
      rotateYTo(targetRotY);
      rotateZTo(targetRotZ);
      xTo(targetX);
      yTo(targetY);
      zTo(targetZ);
    };

    const resetPointer = () => {
      rotateXTo(0);
      rotateYTo(0);
      rotateZTo(0);
      xTo(0);
      yTo(0);
      zTo(0);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.addEventListener("mouseleave", resetPointer);
    updateScroll();

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("mouseleave", resetPointer);
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
              <p className="hero-position mt-4 font-sans text-[40px] font-normal text-[rgba(255,255,255,0.6)]">&quot; Full-Stack Engineer &quot;</p>
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
