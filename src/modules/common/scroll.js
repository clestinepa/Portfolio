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

function changeVisibilityColibri(section) {
  if (section.id == Colibri.sectionVisibleId && !section.classList.contains("hide") && !myColibri.isVisible) {
    myColibri.show();
  } else if ((section.id != Colibri.sectionVisibleId || section.classList.contains("hide")) && myColibri.isVisible) {
    myColibri.hide();
  }
}

function snapToClosestSection() {
  const closest = getClosestSection();

  if (closest.section) {
    changeVisibilityColibri(closest.section);
    startY = window.scrollY;
    distance = closest.visibleSections.length <= 1 ? 0 : closest.edge - startY; // Don't scroll if only one section is visible
    startTime = performance.now();
  }

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
  myColibri.show(); //to trigger now and not after constrainedScrolling
  myFrameLoop.start(smoothScrollTo);
}

/**
 * Stop the scroll animation when the user is scrolling
 * to ensure that the user actions are priority
 */
function userIsScrolling() {
  myFrameLoop.stop(smoothScrollTo);
}

export function initConstrainedScroll() {
  window.addEventListener("wheel", userIsScrolling);
  window.addEventListener("touchmove", userIsScrolling);
  window.addEventListener("scroll", constrainedScrolling);
  snapToClosestSection();
}

export function disableScroll() {
  window.addEventListener("wheel", preventDefault, { passive: false });
  window.addEventListener("touchmove", preventDefault, { passive: false });
  window.addEventListener("scroll", preventDefault, { passive: false });
  window.addEventListener("keydown", preventScrollKeys);
}

export function enableScroll() {
  window.removeEventListener("wheel", preventDefault);
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("scroll", preventDefault);
  window.removeEventListener("keydown", preventScrollKeys);
}

function preventDefault(e) {
  e.preventDefault();
}

function preventScrollKeys(e) {
  //Arrows, space, PageUp/Down
  const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
  }
}
