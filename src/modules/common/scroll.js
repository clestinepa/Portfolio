import { myFrameLoop } from "../../shared/utils.js";
import { Colibri, myColibri } from "../design/colibri.js";
import { myCursor } from "./cursor.js";

/** NEXT STEPS
 * - improve UI : add assets that appears and/or move with scroll
 * - improve Progress Bar: can drag and drop with effective scroll applicable
 * - do I show each element with an animation scroll ?
 * - menu to scroll to section
 * - section save pour que quand je recharge la page, je suis au bon endroit (pcq là vu que les scripts ajoutent des éléments, la taille augmente)
 */

/** Constants **/
const SCROLL = {
  ANIMATION: {
    DURATION: 1000, //(in ms) duration of the animation scroll
    TIMEOUT: 1000, //(in ms) timeout of no scroll needed before start the animation scroll
  },
};
/** ********* **/

const progressBar = document.getElementById("progress-bar");

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
  const colibri = myColibri.instance;
  if (section.id == Colibri.sectionVisibleId && !section.classList.contains("hide") && !colibri.isVisible) {
    colibri.show();
  } else if ((section.id != Colibri.sectionVisibleId || section.classList.contains("hide")) && colibri.isVisible) {
    colibri.hide(section);
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

export function snapToDesignDetail() {
  const detail = document.getElementById("design-detail");
  const edge = detail.offsetTop + detail.offsetHeight - window.innerHeight;
  window.scrollTo({
    top: edge,
    left: 0,
    behavior: "smooth",
  });
  if (myColibri.instance) myColibri.instance.show();
}

function handleProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  progressBar.style.setProperty("--scroll-percent", `${scrollPercent}%`);
}

/**
 * @param {MouseEvent} e
 */
function clickProgressBar(e) {
  const scrollPercent = e.clientX / window.innerWidth;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = docHeight * scrollPercent;
  window.scrollTo({
    top: scrollTop,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * Stop the scroll animation when the user is scrolling
 * to ensure that the user actions are priority
 */
function userIsScrolling() {
  myFrameLoop.stop(smoothScrollTo);
}

function handleScroll() {
  myCursor.position.x = myCursor.position.fixedX + window.scrollX;
  myCursor.position.y = myCursor.position.fixedY + window.scrollY;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(snapToClosestSection, SCROLL.ANIMATION.TIMEOUT);
  handleProgressBar();
}

export const myScroll = {
  init: () => {
    snapToClosestSection();
    handleProgressBar();
    /** EventListener **/
    document.addEventListener("wheel", userIsScrolling);
    document.addEventListener("touchmove", userIsScrolling);
    document.addEventListener("scroll", handleScroll);
    progressBar.addEventListener("click", clickProgressBar);
    /** ************* **/
  },
};
