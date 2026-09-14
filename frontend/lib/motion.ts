import type { Transition, Variants } from "motion/react";
export { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Portfolia Motion System
 * Standardized timing, easing, and variants across the application.
 * Follows a calm, productive, and focused aesthetic (no over-animation).
 */

export const TRANSITION_FAST: Transition = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1],
};

export const TRANSITION_NORMAL: Transition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1],
};

export const TRANSITION_SLOW: Transition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};

export const SPRING_GENTLE: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const SPRING_RESPONSIVE: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITION_NORMAL },
  exit: { opacity: 0, transition: TRANSITION_FAST },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: TRANSITION_NORMAL },
  exit: { opacity: 0, y: -6, transition: TRANSITION_FAST },
};

export const panelTransition: Variants = {
  initial: { opacity: 0, x: 6 },
  animate: { opacity: 1, x: 0, transition: TRANSITION_NORMAL },
  exit: { opacity: 0, x: -6, transition: TRANSITION_FAST },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const cardHoverMotion = {
  whileHover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  whileTap: {
    y: 0,
    scale: 0.99,
  },
};
