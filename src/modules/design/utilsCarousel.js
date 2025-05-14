import { CarouselClass } from "./CarouselClass.js";

/** Constants **/
export const CAROUSEL = {
  STANDARD_POS: [0, 0.135, 0.25, 0.35, 0.455, 0.545, 0.65, 0.75, 0.865, 1], //standard positions of the image for esthetic
  //appearance
  BLUR: {
    MAX: 0, //(in px) blur for position 0% and 100%
    MIN: 5, //(in px) blur for position 50%
  },
  OPACITY: {
    MAX: 1, //opacity for position 0% and 100%
    MIN: 0.5, //opacity for position 50%
  },
  SCALE: {
    MAX: 1, //scale for position 0% and 100%
    MIN: 0.4, //scale for position 50%
  },
  Z_INDEX: {
    MAX: 50, //z-index for position 0% and 100%
    MIN: 0, //z-index for position 50%
  },
  //animation
  ANIMATION: {
    DURATION: 1000, //(in ms) duration of the animation carousel
  },
  MAX_TIME_OF_PRESSURE: 300, //(in ms) time maximum for the mouse to be down to be considered as a click when up
};
/** ********* **/

/**
 * Get the value for a position with an ease-in-out interpolation
 * from 0% to 50% and then from 50% to 100%.
 * @param {number} max the value expected for the position 0% and 100%
 * @param {number} min the value expected for the position 50%
 * @param {number} pos the position of the image
 * @returns the value associated to the position
 */
function specificEaseInOutInterpolation(max, min, pos) {
  let value;
  let t;
  if (pos <= 0.5) {
    t = pos / 0.5;
    const valueFactor = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    value = max - (max - min) * valueFactor;
  } else {
    t = (pos - 0.5) / 0.5;
    const valueFactor = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    value = min + (max - min) * valueFactor;
  }
  return value.toFixed(2);
}
/**
 * Get the value for a position with an linear interpolation
 * from 0% to 50% and then from 50% to 100%.
 * @param {number} max the value expected for the position 0% and 100%
 * @param {number} min the value expected for the position 50%
 * @param {number} pos the position of the image
 * @returns the value associated to the position
 */
function specificLinearInterpolation(max, min, pos) {
  return pos <= 0.5 ? max - ((max - min) * pos) / 0.5 : min + ((max - min) * (pos - 0.5)) / 0.5;
}

/**
 * Get blur of an image depending of its position (ie its percentage).
 * 0 for 0%, 10 for 50%, 0 for 100% with ease-in-out interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated blur
 */
export function getBlur(pos) {
  return specificEaseInOutInterpolation(CAROUSEL.BLUR.MAX, CAROUSEL.BLUR.MIN, pos);
}

/**
 * Get opacity of an image depending of its position (ie its percentage).
 * 1 for 0%, 0.3 for 50%, 1 for 100% with ease-in-out interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated blur
 */
export function getOpacity(pos) {
  return specificEaseInOutInterpolation(CAROUSEL.OPACITY.MAX, CAROUSEL.OPACITY.MIN, pos);
}

/**
 * Get scale of an image size depending of its position (ie its percentage).
 * 1 for 0%, 0.4 for 50%, 1 for 100% with linear interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated scale
 */
export function getScale(pos) {
  return specificLinearInterpolation(CAROUSEL.SCALE.MAX, CAROUSEL.SCALE.MIN, pos);
}

/**
 * Get proper z-index of an image depending of its position (ie its percentage).
 * 50 for 0%, 0 for 50%, 50 for 100% with linear interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated z-index
 */
export function getZIndex(pos) {
  return Math.floor(specificLinearInterpolation(CAROUSEL.Z_INDEX.MAX, CAROUSEL.Z_INDEX.MIN, pos));
}

/**
 * Get the index of the closest value in the standard position
 * @param {number} pos the position of the carousel, in 0 and 1
 * @returns {number} the id of the image in front of the carousel
 */
export function getItemIdInFront(pos) {
  const positions = CAROUSEL.STANDARD_POS.slice(0, -1);
  const ids = Array.from({ length: CarouselClass.DATA.length }, (_, i) => i + 1);

  const index = positions.findIndex((p) => p === pos);
  const rotatedIds = [...ids.slice(-index), ...ids.slice(0, -index)];
  return rotatedIds[0];
}

/**
 * Get the index of the closest value in the standard position
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the index of the closest value in standard position
 */
export function getClosestIndexStandardPos(pos) {
  let closestIndex = CAROUSEL.STANDARD_POS.reduce(
    (closestIdx, current, idx) =>
      Math.abs(current - pos) < Math.abs(CAROUSEL.STANDARD_POS[closestIdx] - pos) ? idx : closestIdx,
    0
  );
  return closestIndex == CAROUSEL.STANDARD_POS.length - 1 ? 0 : closestIndex;
}

/**
 * Get the index of the closest value in the standard position without
 * going backwards, referring to isClockwiseRotation
 * @param {number} pos the position of the carousel, in 0 and 1
 * @param {boolean} isClockwiseRotation the current rotation of the carousel
 * @returns the index of the next closest value in standard position depending of the rotation
 */
export function getNextClosestIndexStandardPos(pos, isClockwiseRotation) {
  const closestIndex = getClosestIndexStandardPos(pos);
  let closestWithoutBackwards = closestIndex;
  //we change index to avoid going backwards
  if (isClockwiseRotation) {
    //closestIndex is always != 0 here because 0 <= pos <= 1 and STANDARD_POS[0] = 0, no need to check
    if (pos < CAROUSEL.STANDARD_POS[closestIndex]) closestWithoutBackwards--;
    if (closestIndex == 0) closestWithoutBackwards = CAROUSEL.STANDARD_POS.length - 2;
  } else {
    //closestIndex is always != STANDARD_POS.length - 1 here because 0 <= pos <= 1 and STANDARD_POS[STANDARD_POS.length - 1] = 1, no need to check
    if (CAROUSEL.STANDARD_POS[closestIndex] < pos) closestWithoutBackwards++;
  }

  return closestWithoutBackwards;
}

/**
 * Constrain the position in 0 and 1, circularly.
 * @param {number} pos the position of the image or the carousel, in 0 and 1
 * @returns {number} the constrained position
 */
export function getConstrainedPos(pos) {
  return ((pos % 1) + 1) % 1;
}

/**
 * Because the standard position aren't linear, we need to remapping it to
 * ensure that the visual remains consistent with the established standard.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the real nonlinear remapped position
 */
export function getRealPos(pos) {
  const sizeLinearInterval = 1 / CarouselClass.DATA.length;
  const ratio = pos / sizeLinearInterval;
  const x1 = ratio - (ratio % 1);
  const x2 = x1 + 1;
  return CAROUSEL.STANDARD_POS[x1] + (CAROUSEL.STANDARD_POS[x2] - CAROUSEL.STANDARD_POS[x1]) * (ratio % 1);
}

/**
 * Get the angle between the center of the container and the mouse
 * @param {MouseEvent} ev the event of the mouse
 * @returns {number} the angle between the center of the container  and the mouse
 */
export function getAngleOfMouse(ev) {
  const rect = CarouselClass.container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const startX = ev.clientX - centerX;
  const startY = ev.clientY - centerY;
  return Math.atan2(startY, startX);
}

/**
 * Get the KeyFrames for the animation depending of the start and the end of the animation
 * @param {{blur: number; opacity: number; scale: number; zIndex: number; pos: number;}} start the properties value of the start of the animation
 * @param {{blur: number; opacity: number; scale: number; zIndex: number; pos: number;}} end the properties value of the end of the animation
 * @returns {PropertyIndexedKeyframes}
 */
export function getAnimateKeyFrames(start, end) {
  return {
    filter: [`blur(${start.blur}px)`, `blur(${end.blur}px)`],
    opacity: [`${start.opacity}`, `${end.opacity}`],
    transform: [`scale(${start.scale})`, `scale(${end.scale})`],
    zIndex: [`${start.zIndex}`, `${end.zIndex}`],
    offsetDistance: [`${start.pos * 100}%`, `${end.pos * 100}%`],
  };
}

/**
 * Get the options of the animation
 * @param {number} duration the duration of the animation
 * @returns {KeyframeAnimationOptions} the options of the animation
 */
export function getAnimateOptions(duration) {
  return { duration: duration, fill: "forwards", easing: "linear" };
}
