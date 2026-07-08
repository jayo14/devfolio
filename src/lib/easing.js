/**
 * Shared animation constants — mirrors the Webflow IX2 easing curves exactly.
 *
 * Usage:
 *   import { EASE, EASE_OUT_EXPO, EASE_IN_OUT, DUR } from "../lib/easing.js";
 *   transition={{ duration: DUR.hover, ease: EASE }}
 */

/** Standard ease-out — default for all hover transitions */
export const EASE = [0.4, 0, 0.2, 1];

/** Exponential ease-out — slot machine counters, snappy entrances */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/** Symmetrical ease-in-out — slide/carousel transitions */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

/** Canonical durations (seconds) */
export const DUR = {
  /** Hover state transitions: opacity, color, scale, border */
  hover: 0.3,

  /** Hover border draw or fill sweep (slightly longer for motion weight) */
  hoverBorder: 0.4,

  /** Scroll-reveal entrance animations */
  reveal: 0.6,

  /** SectionFrame 4-line border draw, staggered by DUR.borderStagger per line */
  border: 0.6,

  /** Per-line stagger delay for SectionFrame border draw */
  borderStagger: 0.15,

  /** Slot machine digit spring: total 1.5s, staggered by DUR.digitStagger */
  digit: 1.5,

  /** Per-digit stagger offset for slot machine counters */
  digitStagger: 0.2,

  /** Slide / carousel cross-fade */
  slide: 0.5,
};
