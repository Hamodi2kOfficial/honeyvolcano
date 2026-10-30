/**
 * One motion system for the whole site.
 *
 * Everything that moves takes its easing, duration and stagger from here, so
 * the site reads as one piece rather than a pile of separate animations.
 *
 * The hierarchy, loudest last:
 *   BACKGROUND  slow, low contrast, ignorable — falling icons, side rails
 *   CONTENT     clear and purposeful — text, cards, images arriving
 *   ACTION      the most noticeable thing on screen — Call to taste
 *
 * Rules that go with it: transform and opacity only, never width/height/top;
 * nothing animates layout; anything off screen is paused; and every one of
 * these has a still, readable end state for `prefers-reduced-motion`.
 */

/** The house easing — a firm start that settles rather than bounces. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** For something leaving. Exits are quicker than entrances. */
export const EASE_OUT = [0.4, 0, 1, 1] as const;

/** For a press or a stamp landing: a little overshoot, once. */
export const EASE_PRESS = [0.34, 1.4, 0.4, 1] as const;

/**
 * Durations in seconds. Bigger things take longer — a card is not a tooltip.
 */
export const DUR = {
  /** Hover, press, colour change. Feedback, not motion. */
  instant: 0.18,
  /** A control changing state: a label expanding, an icon swapping. */
  quick: 0.3,
  /** The default: text and cards arriving. */
  base: 0.6,
  /** A section or an image revealing itself. */
  slow: 0.9,
  /** A hero entrance, once per visit. */
  grand: 1.3,
} as const;

/** Gaps between items in a run. Longer lists need a tighter gap. */
export const STAGGER = {
  tight: 0.04,
  base: 0.07,
  loose: 0.11,
} as const;

/** How far something travels as it arrives. Small: this is a fade with intent. */
export const TRAVEL = {
  text: 14,
  card: 22,
  section: 32,
} as const;

/** Where a reveal fires: a quarter of the element visible, once. */
export const IN_VIEW = { once: true, amount: 0.25 } as const;

/** The transition most things use. */
export const transition = (duration: number = DUR.base, delay = 0) => ({
  duration,
  delay,
  ease: EASE,
});

/** Arriving from below. `reduced` returns the end state and nothing else. */
export const riseIn = (reduced: boolean, distance: number = TRAVEL.card) => ({
  initial: reduced ? false : { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: IN_VIEW,
});
