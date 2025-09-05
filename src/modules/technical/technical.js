import { svgLogos } from "../../shared/assets.js";
import { shuffle } from "../../shared/utils.js";

/** Constants **/
const TECHNICAL = {
  DEV: [
    { name: "react", level: 0 },
    { name: "redux", level: 0 },
    { name: "web-suite", level: 0 },
    { name: "github", level: 0 },
    { name: "material-ui", level: 0 },
    { name: "angular", level: 1 },
    { name: "tailwind", level: 1 },
    { name: "android-studio", level: 1 },
    { name: "chart-js", level: 2 },
    { name: "openlayers", level: 2 },
    { name: "mapbox", level: 2 },
  ],
  DESIGN: [
    { name: "figma", level: 0 },
    { name: "lightroom", level: 0 },
    { name: "miro", level: 1 },
    { name: "filmora", level: 1 },
    { name: "canva", level: 2 },
  ],
  opacity_level: [1, 0.7, 0.4],
  scale_level: [1, 0.8, 0.6],
  SPEED_ANIMATION: 30, //(px/s) speed of the slide animation
};
/** ********* **/

/** @type {HTMLElement[]} */
const slideContainers = Array.from(document.getElementsByClassName("slide-container"));

function displaySlide() {
  for (let slide of slideContainers) {
    /** @type {{name:string; level: number}[]} */
    let logos = TECHNICAL[slide.dataset.name] ?? TECHNICAL.DEV;
    shuffle(logos);

    for (let j = 0; j < 2; j++) {
      let infiniteSide = document.createElement("div");
      infiniteSide.className = "infinite-slide";
      for (let logo of logos) {
        const wrapperSvg = document.createElement("div");
        wrapperSvg.innerHTML = svgLogos[logo.name];
        wrapperSvg.classList = "technical-logo tooltip center";
        wrapperSvg.firstChild.style.opacity = TECHNICAL.opacity_level[logo.level];
        wrapperSvg.firstChild.style.transform = `scale(${TECHNICAL.scale_level[logo.level]})`;
        wrapperSvg.setAttribute("data-tooltip", logo.name.replace("-", " "));
        infiniteSide.appendChild(wrapperSvg);
      }
      slide.appendChild(infiniteSide);
    }
    slide.style.setProperty("--durationH", `${slide.firstChild.scrollWidth / TECHNICAL.SPEED_ANIMATION}s`);
  }
}

export const myTechnicalSection = {
  init: () => {
    displaySlide();
  },
};
