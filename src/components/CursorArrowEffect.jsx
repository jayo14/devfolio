import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";

export default function CursorArrowEffect() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    const targets = Array.from(document.querySelectorAll("[data-cursor-arrow]"));
    const cleanups = [];
    const show = (event) => {
      document.body.classList.add("cursor-arrow-active");
      gsap.set(cursor, { autoAlpha: 1, scale: 1, x: event.clientX, y: event.clientY });
      gsap.to(cursor, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: true });
    };
    const hide = () => {
      document.body.classList.remove("cursor-arrow-active");
      gsap.to(cursor, { autoAlpha: 0, scale: 0.86, duration: 0.18, ease: "power2.out", overwrite: true });
    };
    const move = (event) => {
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.22, ease: "power3.out", overwrite: true });
    };

    targets.forEach((target) => {
      target.addEventListener("pointerenter", show);
      target.addEventListener("pointerleave", hide);
      target.addEventListener("pointermove", move);
      cleanups.push(() => {
        target.removeEventListener("pointerenter", show);
        target.removeEventListener("pointerleave", hide);
        target.removeEventListener("pointermove", move);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      document.body.classList.remove("cursor-arrow-active");
      gsap.killTweensOf(cursor);
    };
  }, []);

  return (
    <span ref={cursorRef} className="cursor-arrow-follower" aria-hidden="true">
      <ArrowUpRight />
    </span>
  );
}
