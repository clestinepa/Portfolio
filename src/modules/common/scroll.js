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
const SCROLL = {};
/** ********* **/

const sections = document.getElementsByClassName("section");
const progressBar = document.getElementById("progress-bar");

function getClosestSection() {
  let closestSection = null;
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
      const edge = CenterToTop < CenterToBottom ? sectionTop : sectionBottom - window.innerHeight;
      const distance = Math.abs(viewportTop - edge);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    }
  }
  return closestSection;
}

function changeVisibilityColibri(section) {
  const colibri = myColibri.instance;
  if (section.id == Colibri.sectionVisibleId && !section.classList.contains("hide") && !colibri.isVisible) {
    colibri.show();
  } else if ((section.id != Colibri.sectionVisibleId || section.classList.contains("hide")) && colibri.isVisible) {
    colibri.hide(section);
  }
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

function handleScroll() {
  myCursor.position.x = myCursor.position.fixedX + window.scrollX;
  myCursor.position.y = myCursor.position.fixedY + window.scrollY;
  changeVisibilityColibri(getClosestSection());
  handleProgressBar();
}

export const myScroll = {
  init: () => {
    handleProgressBar();
    /** EventListener **/
    document.addEventListener("scroll", handleScroll);
    progressBar.addEventListener("click", clickProgressBar);
    /** ************* **/
  },
};
