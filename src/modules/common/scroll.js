import { Colibri, myColibri } from "./colibri.js";
import { FrameLoop } from "../../shared/utils.js";

/** Constants **/
const SCROLL = {
  ANIMATION: {
    DURATION: 1500, //(in ms) duration of the animation scroll
    TIMEOUT: 1000, //(in ms) timeout of no scroll needed before start the animation scroll
  },
};
/** ********* **/

let scrollTimeout;
let startY;
let distance;
let startTime;

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

function smoothScrollTo() {
  const elapsedTime = performance.now() - startTime;
  const progress = Math.min(elapsedTime / SCROLL.ANIMATION.DURATION, 1);
  const easedProgress = 1 - (1 - progress) * (1 - progress);

  if (progress >= 1 || distance === 0) return false;

  window.scrollTo(0, startY + distance * easedProgress);
}

function defineParameters() {
  const closest = getClosestSection();

  if (closest.section) {
    if (
      (closest.section.id == Colibri.sectionVisibleId && !myColibri.isVisible) ||
      (closest.section.id != Colibri.sectionVisibleId && myColibri.isVisible)
    )
      myColibri.changeVisibility();

    startY = window.scrollY;
    distance = closest.visibleSections.length <= 1 ? 0 : closest.edge - startY; // Don't scroll if only one section is visible
    startTime = performance.now();
  }
}

function snapToClosestSection() {
  defineParameters();
  scrollFrameLoop.start();
}

function constrainedScrolling() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(snapToClosestSection, SCROLL.ANIMATION.TIMEOUT);
  handleProgressBar();
}

function handleProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  document.getElementById("progress-bar").style.height = scrollPercent + "%";
}

/** RequestAnimationFrame **/
const scrollFrameLoop = new FrameLoop(smoothScrollTo);
/** ********************* **/

export function initConstrainedScroll() {
  window.addEventListener("scroll", constrainedScrolling);
  snapToClosestSection();
  handleProgressBar();
}
