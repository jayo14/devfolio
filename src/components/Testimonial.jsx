import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";
import { originalAssets } from "../lib/siteData.js";

const testimonials = [
  {
    name: "Emma Thompson",
    role: "Marketing Director",
    quote: "Emma Thompson, Marketing Director\n\"Transformed our website with stunning visuals and smooth functionality, doubling user engagement.\"",
    avatar: originalAssets.clientImages[0],
    thumbAvatar: originalAssets.clientImages[0],
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    quote: "\"Delivered a scalable backend with flawless execution, streamlining our operations significantly.\"",
    avatar: originalAssets.clientImages[1],
    thumbAvatar: originalAssets.clientImages[1],
  },
  {
    name: "Conor Bradley",
    role: "Senior Marketing, Spotify",
    quote: "“Hubfolio studio ability to create a high quality UI is stands out. It’s somethingwe placed a premium on. A studio with passionate, professional, fun and full creativity. Recommend!.”",
    avatar: originalAssets.clientImages[2],
    thumbAvatar: originalAssets.clientImages[2],
  },
  {
    name: "Conor Bradley",
    role: "Senior Marketing, Spotify",
    quote: "\"Created a responsive site that tripled our traffic with outstanding professionalism.\"",
    avatar: originalAssets.clientImages[3],
    thumbAvatar: originalAssets.clientImages[3],
  },
  {
    name: "David Nguyen",
    role: "Product Manager",
    quote: "\"Crafted a user-friendly app with exceptional code quality, exceeding all expectations.\"",
    avatar: originalAssets.clientImages[4],
    thumbAvatar: originalAssets.clientImages[4],
  },
  {
    name: "James Carter",
    role: "Senior Marketing, Spotify",
    quote: "\"Developed a robust API that enhanced our system’s performance and reliability.\"",
    avatar: originalAssets.clientImages[2],
    thumbAvatar: originalAssets.clientImages[5],
  },
];

function formatQuote(quote) {
  if (quote.includes("\n")) {
    return quote.split("\n")[1];
  }
  return quote;
}

function TestimonialThumb({ testimonial, isActive, onClick, index }) {
  return (
    <button
      type="button"
      className={`testimonial-thumb ${isActive ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Testimonial ${index + 1} of ${testimonials.length}: ${testimonial.name}, ${testimonial.role}`}
    >
      <span className="testimonial-thumb-image-wrap">
        <img
          src={testimonial.thumbAvatar}
          alt=""
          className="testimonial-thumb-image"
          loading="lazy"
        />
      </span>
      {isActive && (
        <div className="testimonial-thumb-active-bg" aria-hidden="true">
          <PlusCorner corner="top-left" color="accent" />
          <PlusCorner corner="top-right" color="accent" />
          <PlusCorner corner="bottom-right" color="accent" />
          <PlusCorner corner="bottom-left" color="accent" />
        </div>
      )}
      <span className="sr-only">Testimonial {index + 1}</span>
    </button>
  );
}

const Testimonial = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    startIndex: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(1);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (event.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [emblaApi]);

  return (
    <section
      id="testimonial"
      className="original-testimonial bg-black text-white"
      aria-label="Client Testimonials"
    >
      <Container>
        <div className="section-heading centered">
          <p className="eyebrow">// Testimonial</p>
          <h2>
            Client feedback <span>matters</span>
          </h2>
        </div>

        <div className="testimonial-vh-wrap">
          <div className="testimonial-sticky-wrap">
            <div className="testimonial-content-wrap">
              {/* Top Avatar Thumbnails Selector */}
              <div className="testimonial-thumbs-wrap">
                <div className="testimonial-thumbs-grid">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialThumb
                      key={`${testimonial.name}-${index}`}
                      testimonial={testimonial}
                      index={index}
                      isActive={index === selectedIndex}
                      onClick={() => emblaApi?.scrollTo(index)}
                    />
                  ))}
                </div>
              </div>

              {/* 3-Column Contiguous Card Slider matching design */}
              <div className="testimonial-slider relative">
                <div className="testimonial-stage" aria-live="polite" aria-atomic="true">
                  <div
                    ref={emblaRef}
                    className="overflow-hidden border-l border-[#2e2c2b] cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex">
                      {testimonials.map((testimonial, index) => {
                        const isActive = index === selectedIndex;
                        return (
                          <div
                            key={`${testimonial.name}-${index}`}
                            className={`min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333333%] relative select-none border-r border-[#2e2c2b] bg-[#090909] transition-opacity duration-300 ${
                              isActive
                                ? "opacity-100 text-white z-10"
                                : "opacity-35 hover:opacity-75 text-white/70 cursor-pointer"
                            }`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Testimonial ${index + 1} of ${testimonials.length}: ${testimonial.name}`}
                            aria-current={isActive ? "true" : undefined}
                            onClick={() => {
                              if (!isActive && emblaApi) {
                                emblaApi.scrollTo(index);
                              }
                            }}
                          >
                            <PlusCorner corner="bottom-right" color="accent" />
                            <div className="flex flex-col justify-between h-full min-h-[380px] lg:min-h-[420px] p-8 sm:p-10 lg:p-12">
                              <p className="testimonial-quote">
                                {formatQuote(testimonial.quote)}
                              </p>
                              <div className="testimonial-client">
                                <img
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                  className={`testimonial-client-image transition-all duration-300 ${
                                    isActive
                                      ? "grayscale-0 ring-1 ring-white/20"
                                      : "grayscale-[30%] opacity-80"
                                  }`}
                                  loading="lazy"
                                />
                                <div>
                                  <p className="testimonial-client-name">
                                    {testimonial.name}
                                  </p>
                                  <p className="testimonial-client-role">
                                    {testimonial.role}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Control Bar with Arrows and Counter */}
              <div className="testimonial-controls flex items-center justify-center gap-6 mt-8">
                <button
                  type="button"
                  className="testimonial-arrow-btn"
                  aria-label="Previous testimonial"
                  onClick={() => emblaApi?.scrollPrev()}
                >
                  <HiChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <div className="testimonial-counter font-mono text-sm tracking-widest text-white/50">
                  <strong className="text-white">
                    {String(selectedIndex + 1).padStart(2, "0")}
                  </strong>
                  <span className="mx-2 text-white/30">/</span>
                  <span>{String(testimonials.length).padStart(2, "0")}</span>
                </div>
                <button
                  type="button"
                  className="testimonial-arrow-btn"
                  aria-label="Next testimonial"
                  onClick={() => emblaApi?.scrollNext()}
                >
                  <HiChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Testimonial;
