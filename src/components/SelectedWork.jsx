import { useEffect, useMemo, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";
import { useAdminStore } from "../lib/adminStore.js";
import { resolveImageUrl } from "../lib/imageUrl.js";
import SelectedWorkLoading from "./SelectedWorkLoading.jsx";

const SelectedWork = () => {
  const projects = useAdminStore((s) => s.projects);
  const projectsLoading = useAdminStore((s) => s.projectsLoading);
  const projectsLoaded = useAdminStore((s) => s.projectsLoaded);
  const projectsError = useAdminStore((s) => s.projectsError);
  const fetchProjects = useAdminStore((s) => s.fetchProjects);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  const slides = useMemo(() => {
    return projects
      .filter((p) => p.sliderImage || p.imageUrl)
      .map((p) => ({
        id: p.id,
        image: resolveImageUrl(p.sliderImage || p.imageUrl),
        title: p.title,
        href: `/work/${p.slug}`,
      }));
  }, [projects]);

  // Track elapsed time while server boots / loads projects
  useEffect(() => {
    if (slides.length > 0) return;
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Auto-retry fetch if error occurred during cold start spin up
  useEffect(() => {
    if (slides.length > 0) return;
    if (projectsError) {
      const retryTimer = setTimeout(() => {
        fetchProjects();
      }, 4000);
      return () => clearTimeout(retryTimer);
    }
  }, [projectsError, slides.length, fetchProjects]);

  const handleManualRetry = useCallback(async () => {
    setIsRetrying(true);
    await fetchProjects();
    setIsRetrying(false);
  }, [fetchProjects]);

  const canScroll = slides.length > 1;
  const autoplay = useMemo(
    () => (canScroll ? Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }) : null),
    [canScroll]
  );
  const plugins = useMemo(() => (autoplay ? [autoplay] : []), [autoplay]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: canScroll }, plugins);
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

  // If projects finished loading and array is truly empty with no errors
  if (projectsLoaded && !projectsLoading && projects.length === 0 && !projectsError) {
    return (
      <section id="selected-work" className="original-slider-work bg-black text-white" aria-label="Selected Projects">
        <Container>
          <div className="original-work-slider">
            <div className="original-work-slide-top flex flex-col items-center justify-center min-h-[320px] text-center p-8">
              <p className="font-mono text-sm md:text-base text-neutral-400">
                No featured projects published yet.
              </p>
            </div>
            <div className="original-work-slide-bottom">
              <span className="font-inconsolata text-sm text-neutral-500">// End of list</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // Loading state when projects haven't been loaded yet (server still booting)
  if (slides.length === 0) {
    return (
      <SelectedWorkLoading
        elapsedSeconds={elapsedSeconds}
        projectsError={projectsError}
        isRetrying={isRetrying}
        onRetry={handleManualRetry}
      />
    );
  }

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
                  key={slide.id || `proj-slide-${index}`}
                  className="min-w-0 flex-[0_0_100%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Project ${index + 1} of ${slides.length}: ${slide.title}`}
                >
                  <div className="original-work-slide-top">
                    <a
                      data-cursor-arrow
                      className="original-work-image-link"
                      href={slide.href}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img
                        src={slide.image}
                        alt=""
                        width="1200"
                        height="750"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="original-work-image"
                      />
                    </a>
                    <a
                      className="original-work-arrow"
                      href={slide.href}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img src={originalAssets.arrow} alt="" width="24" height="24" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="original-work-slide-bottom">
                    <a className="original-work-title" href={slide.href}>
                      {slide.title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {canScroll && (
            <>
              <button
                type="button"
                className="original-work-arrow-control original-work-arrow-left"
                aria-label="Previous project"
                onClick={() => emblaApi?.scrollPrev()}
              >
                <HiChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="original-work-arrow-control original-work-arrow-right"
                aria-label="Next project"
                onClick={() => emblaApi?.scrollNext()}
              >
                <HiChevronRight aria-hidden="true" />
              </button>
              <div className="original-work-counter" aria-live="polite" aria-atomic="true">
                {selectedIndex + 1} / {slides.length}
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default SelectedWork;
