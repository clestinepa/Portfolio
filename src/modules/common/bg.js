import { getRandom, getRandomInt, getRandomVariableCSSColor } from "../../shared/utils.js";

/** Constants **/
const BG = {
  NB_SPHERES: 8, //nb of random spheres in the bg
  SPHERE: {
    R_ELLIPSE: {
      MIN: 40, //(in px) minimum size of ellipse radius
    },
    SIZE: {
      MAX: 140, //(in vmin) maximum size of a sphere
      MIN: 100, //(in vmin) minimum size of a sphere
    },
    BLUR: {
      MAX: 14, //(in vmin) maximum blur of a sphere
      MIN: 12, //(in vmin) minimum blur of a sphere
    },
    ANIMATION: {
      DURATION: {
        MAX: 50, //(in s) maximum duration of an animation sphere
        MIN: 15, //(in s) minimum duration of an animation sphere
      },
    },
  },
};
/** ********* **/

const bgContainer = document.getElementById("background");

/**
 * Get the pixel value associated to a vmin value
 * @param {number} vminValue the value in vmin
 * @returns the value associated in pixel
 */
function vminToPx(vminValue) {
  const vmin = Math.min(window.innerWidth, window.innerHeight);
  return (vminValue / 100) * vmin;
}

/**
 * Generate a random ellipse path for a specific sphere
 * @param {number} offsetX the offset of the shadow and the sphere
 * @returns the path of a random ellipse with format "M 0 0 A 0 0 0 0 0 0 0 A 0 0 0 0 0 0 0"
 */
function generateRandomEllipsePath(offsetX) {
  //center everywhere in the container with an offsetX to make like
  //the shadow is following the path and not the transparent element
  const centerX = Math.random() * bgContainer.clientWidth - offsetX;
  const centerY = Math.random() * bgContainer.clientHeight;
  const rx = getRandomInt(BG.SPHERE.R_ELLIPSE.MIN, bgContainer.clientWidth);
  const ry = getRandomInt(BG.SPHERE.R_ELLIPSE.MIN, bgContainer.clientHeight);
  const direction = Math.random() < 0.5 ? 0 : 1;
  const large = Math.random() < 0.5 ? 0 : 1;
  return `M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 ${large} ${direction} ${
    centerX + rx
  } ${centerY} A ${rx} ${ry} 0 ${large} ${direction} ${centerX - rx} ${centerY}`;
}

function displayBg() {
  for (let i = 0; i < BG.NB_SPHERES; i++) {
    const span = document.createElement("span");
    const size = getRandom(BG.SPHERE.SIZE.MIN, BG.SPHERE.SIZE.MAX);
    const blur = getRandom(BG.SPHERE.BLUR.MIN, BG.SPHERE.BLUR.MAX);
    const offsetShadow = size + blur; //shadow has to be away from the actual element to be seen completely
    const path = generateRandomEllipsePath(vminToPx(offsetShadow));
    const duration = getRandomInt(BG.SPHERE.ANIMATION.DURATION.MIN, BG.SPHERE.ANIMATION.DURATION.MAX);
    span.style.width = `${size}vmin`;
    span.style.height = `${size}vmin`;
    span.style.offsetPath = `path("${path}")`;
    span.style.animationDuration = `${duration}s`;
    //shadow is always same y and x + offsetShadow of the element
    span.style.boxShadow = `${offsetShadow}vmin 0 ${blur}vmin ${getRandomVariableCSSColor()}`;
    bgContainer.appendChild(span);
  }
}

export const myBg = {
  init: () => {
    displayBg();
  },
};
