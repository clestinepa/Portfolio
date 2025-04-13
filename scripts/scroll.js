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

  const visibleSections = [];
  let closestSection = null;
  let closestEdge = null;
  let closestDistance = Infinity;

  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  const viewportCenter = viewportTop + window.innerHeight / 2;

  for (let section of sections) {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const CenterToTop = Math.abs(viewportCenter - sectionTop);
    const CenterToBottom = Math.abs(viewportCenter - sectionBottom);

    // Check if section is at least partially visible
    if (sectionBottom > viewportTop && sectionTop < viewportBottom) {
      visibleSections.push(section);
      const edge = CenterToTop < CenterToBottom ? sectionTop : sectionBottom - window.innerHeight;
      const distance = Math.abs(viewportTop - edge);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEdge = edge;
        closestSection = section;
      }
    }
  }
  return { visibleSections, section: closestSection, edge: closestEdge };
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
  const closest = getClosestSection();

  if (closest.visibleSections.length <= 1) return; // Don't scroll if only one section is visible

  if (closest.section) {
    if ((closest.section == "about" && !colibri.isVisible) || (closest.section.id != "about" && colibri.isVisible))
      colibri.changeVisibility();
    smoothScrollTo(closest.edge);
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
