import { myFrameLoop } from "../../shared/utils.js";
import { Colibri, myColibri } from "./colibri.js";

/** NEXT STEPS
 * - improve UI : add assets that appears and/or move with scroll
 * - do I show each element with an animation scroll ?
 */

/** Constants **/
const SCROLL = {
  ANIMATION: {
    DURATION: 1000, //(in ms) duration of the animation scroll
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

  if (progress >= 1 || distance === 0) return { shouldContinue: false };

  window.scrollTo(0, startY + distance * easedProgress);
  return { shouldContinue: true };
}

function defineParameters() {
  const closest = getClosestSection();

  if (closest.section) {
    if (
      closest.section.id == Colibri.sectionVisibleId &&
      !closest.section.classList.contains("hide") &&
      !myColibri.isVisible
    )
      myColibri.show();
    else if (
      (closest.section.id != Colibri.sectionVisibleId || closest.section.classList.contains("hide")) &&
      myColibri.isVisible
    )
      myColibri.hide();

    startY = window.scrollY;
    distance = closest.visibleSections.length <= 1 ? 0 : closest.edge - startY; // Don't scroll if only one section is visible
    startTime = performance.now();
  }
}

function snapToClosestSection() {
  defineParameters();
  myFrameLoop.start(smoothScrollTo);
}

function constrainedScrolling() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(snapToClosestSection, SCROLL.ANIMATION.TIMEOUT);
}

export function snapToDesignDetail() {
  startY = window.scrollY;
  const detail = document.getElementById("design-detail");
  const edge = detail.offsetTop + detail.offsetHeight - window.innerHeight;
  distance = edge - startY;
  startTime = performance.now();
  myColibri.show(); //to trigger now and not after constrainedScrolling automatically lunch because we scrolled
  myFrameLoop.start(smoothScrollTo);
}

/**
 * Stop the scroll animation when the user is scrolling
 * to ensure that the user actions are priority
 */
function userIsScrolling() {
  myFrameLoop.stop(smoothScrollTo);
  // myFrameLoop.stop(smoothScrollToDesign);
}

export function initConstrainedScroll() {
  window.addEventListener("wheel", userIsScrolling);
  window.addEventListener("touchmove", userIsScrolling);
  window.addEventListener("scroll", constrainedScrolling);
  snapToClosestSection();
}
