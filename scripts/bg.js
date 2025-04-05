import { getRandom, getRandomInt } from "./global.js";

const bgContainer = document.getElementById("background");
const NB_SPHERES_BG = 8; //nb of random spheres in the bg

const MIN_R_ELLIPSE = 40; //(in px) minimum size of ellipse radius

const MAX_SIZE_SPHERE = 80; //(in vmin) maximum size of a sphere
const MIN_SIZE_SPHERE = 40; //(in vmin) minimum size of a sphere
const MAX_BLUR_SPHERE = 14; //(in vmin) maximum blur of a sphere
const MIN_BLUR_SPHERE = 12; //(in vmin) minimum blur of a sphere
const MAX_DURATION_ANIMATION_SPHERE = 50; //(in s) maximum duration of an animation sphere
const MIN_DURATION_ANIMATION_SPHERE = 15; //(in s) minimum duration of an animation sphere

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
  const rx = getRandomInt(MIN_R_ELLIPSE, bgContainer.clientWidth);
  const ry = getRandomInt(MIN_R_ELLIPSE, bgContainer.clientHeight);
  const direction = Math.random() < 0.5 ? 0 : 1;
  const large = Math.random() < 0.5 ? 0 : 1;
  return `M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 ${large} ${direction} ${
    centerX + rx
  } ${centerY} A ${rx} ${ry} 0 ${large} ${direction} ${centerX - rx} ${centerY}`;
}

/**
 * Get random variable color
 * @returns the random variable color with format "var(--name-variable)"
 */
function getRandomVariableColor() {
  const randomIndex = getRandomInt(1, 4);
  let theme;
  switch (randomIndex) {
    case 1:
      theme = "design";
      break;
    case 2:
      theme = "dev";
      break;
    case 3:
      theme = "photo";
      break;
    default:
    case 4:
      theme = "montage";
  }
  return `var(--main-${theme})`;
}

export function displayBg() {
  for (let i = 0; i < NB_SPHERES_BG; i++) {
    const span = document.createElement("span");
    const size = getRandom(MIN_SIZE_SPHERE, MAX_SIZE_SPHERE);
    const blur = getRandom(MIN_BLUR_SPHERE, MAX_BLUR_SPHERE);
    const offsetShadow = size + blur;
    const path = generateRandomEllipsePath(vminToPx(offsetShadow));
    const duration = getRandomInt(MIN_DURATION_ANIMATION_SPHERE, MAX_DURATION_ANIMATION_SPHERE);
    span.style.width = `${size}vmin`;
    span.style.height = `${size}vmin`;
    span.style.offsetPath = `path("${path}")`;
    span.style.animationDuration = `${duration}s`;
    //shadow is always same y and x + offsetShadow of the element
    span.style.boxShadow = `${offsetShadow}vmin 0 ${blur}vmin ${getRandomVariableColor()}`;
    bgContainer.appendChild(span);
  }
}
