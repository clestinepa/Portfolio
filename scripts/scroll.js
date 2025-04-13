import { colibri } from "./colibri.js";

/** Constants **/
const SCROLL = {
  ANIMATION: {
    DURATION: 1500, //(in ms) duration of the animation scroll
    TIMEOUT: 1000, //(in ms) timeout of no scroll needed before start the animation scroll
  },
};
/** ********* **/

let scrollTimeout;
let userScrolling = false;
let isAnimating = false;

function getClosestSection() {
  const sections = document.getElementsByClassName("section");

  let closest = null;
  let minDistance = Infinity;
  const scrollPosition = window.scrollY;

  for (let section of sections) {
    const offset = section.offsetTop;
    const distance = Math.abs(scrollPosition - offset);
    if (distance < minDistance) {
      minDistance = distance;
      closest = section;
    }
  }
  return closest;
}

function smoothScrollTo(targetY) {
  isAnimating = true;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animationStep(currentTime) {
    if (!isAnimating) return;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / SCROLL.ANIMATION.DURATION, 1);
    const easedProgress = 1 - (1 - progress) * (1 - progress);
    userScrolling = false;
    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) requestAnimationFrame(animationStep);
    else isAnimating = false;
  }

  requestAnimationFrame(animationStep);
}

function snapToClosestSection() {
  const closestSection = getClosestSection();
  if (closestSection) {
    if ((closestSection.id == "about" && !colibri.isVisible) || (closestSection.id != "about" && colibri.isVisible))
      colibri.changeVisibility();
    smoothScrollTo(closestSection.offsetTop);
  }
}

function userIsScrolling() {
  userScrolling = true;
}
function constrainedScrolling() {
  clearTimeout(scrollTimeout);
  if (userScrolling && isAnimating) isAnimating = false;
  scrollTimeout = setTimeout(snapToClosestSection, SCROLL.ANIMATION.TIMEOUT);
}

export function initConstrainedScroll() {
  window.addEventListener("wheel", userIsScrolling);
  window.addEventListener("touchmove", userIsScrolling);
  window.addEventListener("scroll", constrainedScrolling);
  snapToClosestSection();
}
