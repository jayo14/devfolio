import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";
import { useAdminStore } from "../lib/adminStore.js";
import { resolveImageUrl } from "../lib/imageUrl.js";

const staticSlides = originalAssets.sliderImages.map((image) => ({
  image,
  title: "Newz Magazine Site",
  href: "https://stephaniebruce.co/?ref=lapaninja#myth-fans",
}));

const SelectedWork = () => {
  const projects = useAdminStore((s) => s.projects);
  const fetchProjects = useAdminStore((s) => s.fetchProjects);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  const slides = useMemo(() => {
    const dynamic = projects
      .filter((p) => p.sliderImage || p.imageUrl)
      .map((p) => ({
        image: resolveImageUrl(p.sliderImage || p.imageUrl),
        title: p.title,
        href: `/work/${p.slug}`,
      }));
    return [...dynamic, ...staticSlides];
  }, [projects]);

  const autoplay = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }), []);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="selected-work" className="original-slider-work bg-black text-white" aria-label="Selected Projects">
      <Container>
        <div
          className="original-work-slider"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured projects showcase"
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {slides.map((slide, index) => (
                <div
                  key={`${slide.image}-${index}`}
                  className="min-w-0 flex-[0_0_100%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Project ${index + 1} of ${slides.length}: ${slide.title}`}
                >
                  <div className="original-work-slide-top">
                    <a data-cursor-arrow className="original-work-image-link" href={slide.href} target={slide.href.startsWith("/") ? undefined : "_blank"} rel={slide.href.startsWith("/") ? undefined : "noreferrer"}>
                      <img src={slide.image} alt={slide.title} className="original-work-image" />
                    </a>
                    <a className="original-work-arrow" href={slide.href} target={slide.href.startsWith("/") ? undefined : "_blank"} rel={slide.href.startsWith("/") ? undefined : "noreferrer"} aria-label={`Open details for ${slide.title}`}>
                      <img src={originalAssets.arrow} alt="" />
                    </a>
                  </div>
                  <div className="original-work-slide-bottom">
                    <a className="original-work-title" href={slide.href} target={slide.href.startsWith("/") ? undefined : "_blank"} rel={slide.href.startsWith("/") ? undefined : "noreferrer"}>{slide.title}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="original-work-arrow-control original-work-arrow-left" aria-label="Previous project" onClick={() => emblaApi?.scrollPrev()}>
            <HiChevronLeft aria-hidden="true" />
          </button>
          <button type="button" className="original-work-arrow-control original-work-arrow-right" aria-label="Next project" onClick={() => emblaApi?.scrollNext()}>
            <HiChevronRight aria-hidden="true" />
          </button>
          <div className="original-work-counter" aria-live="polite" aria-atomic="true">{selectedIndex + 1} / {slides.length}</div>
        </div>
      </Container>
    </section>
  );
};

export default SelectedWork;
