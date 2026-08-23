import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const slides = originalAssets.sliderImages.map((image) => ({
  image,
  title: "Newz Magazine Site",
  href: "https://stephaniebruce.co/?ref=lapaninja#myth-fans",
}));

const SelectedWork = () => {
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
    <section id="selected-work" className="original-slider-work bg-black text-white">
      <Container>
        <div className="original-work-slider">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {slides.map((slide, index) => (
                <div key={`${slide.image}-${index}`} className="min-w-0 flex-[0_0_100%]">
                  <div className="original-work-slide-top">
                    <a data-cursor-arrow className="original-work-image-link" href={slide.href} target="_blank" rel="noreferrer">
                      <img src={slide.image} alt={slide.title} className="original-work-image" />
                    </a>
                    <a className="original-work-arrow" href={slide.href} target="_blank" rel="noreferrer" aria-label={`Open ${slide.title}`}>
                      <img src={originalAssets.arrow} alt="" />
                    </a>
                  </div>
                  <div className="original-work-slide-bottom">
                    <a className="original-work-title" href={slide.href} target="_blank" rel="noreferrer">{slide.title}</a>
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
          <div className="original-work-counter" aria-live="polite">{selectedIndex + 1} / {slides.length}</div>
        </div>
      </Container>
    </section>
  );
};

export default SelectedWork;
