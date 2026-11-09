import { Variants } from 'framer-motion';

/**
 * Comic Pop Page Transition Variant
 * Exaggerated cartoon bouncy entrance when switching between views
 */
export const comicPageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.88,
    rotate: -2,
    y: 15,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: {
      type: 'spring',
      damping: 14,
      stiffness: 280,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    rotate: 2,
    y: -10,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/**
 * Dubey Rage Violent Shake Animation
 * Triggers when attendance falls below 75%
 */
export const dubeyRageVariants: Variants = {
  initial: { scale: 1, x: 0, y: 0, rotate: 0 },
  raging: {
    scale: [1, 1.04, 0.98, 1.05, 0.99, 1],
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    y: [0, -4, 4, -5, 5, -2, 2, 0],
    rotate: [0, -3, 3, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  calm: {
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.3 },
  },
};

/**
 * Comic Card Hover & Tap Variants
 */
export const comicCardTap = {
  whileHover: { scale: 1.02, rotate: 0.5, transition: { duration: 0.15 } },
  whileTap: { scale: 0.94, rotate: -1, transition: { duration: 0.1 } },
};

/**
 * Comic Button Bounce Variants
 */
export const comicButtonBounce = {
  whileHover: { scale: 1.06, y: -2, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  whileTap: { scale: 0.92, y: 2, transition: { duration: 0.1 } },
};

/**
 * Rubber Band Pop Effect
 */
export const rubberBandVariants: Variants = {
  animate: {
    scale: [1, 1.15, 0.85, 1.08, 0.96, 1],
    transition: {
      duration: 0.7,
      ease: 'easeInOut',
    },
  },
};

/**
 * Floating Cartoon Idle
 */
export const floatingIdleVariants = (delay = 0, yDistance = 6) => ({
  animate: {
    y: [0, -yDistance, 0],
    rotate: [0, 1.5, 0],
    transition: {
      repeat: Infinity,
      duration: 2.8,
      delay,
      ease: 'easeInOut',
    },
  },
});
