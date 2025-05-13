import { displayBg } from "./modules/common/bg.js";
import { initCursor } from "./modules/common/cursor.js";
import { initConstrainedScroll } from "./modules/common/scroll.js";
import { typeEffect } from "./modules/presentation/typing.js";
import { displayAbout } from "./modules/about/about.js";
import { displayCarousel } from "./modules/crea/carousel.js";
import { displayGrid } from "./modules/dev/grid.js";

import { scrambleEffect } from "../modules/crea/scramble.js";

//presentation section
typeEffect();
//about section
displayAbout();
//design section
displayCarousel();
scrambleEffect();
//dev section
displayGrid();
//global scripts, wait that everything else is setup
displayBg();
initCursor();
initConstrainedScroll();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img, a, p, span, h1, h2").forEach((el) => {
    el.setAttribute("draggable", "false");
  });
});

async function addHighlightStroke() {
  const response = await fetch("public/img/highlightStroke.svg");
  const svg = await response.text();
  const containers = document.getElementsByClassName("highlight-container");
  for (const container of containers) {
    container.innerHTML += svg;
    container.getElementsByTagName("svg").item(0).setAttribute("preserveAspectRatio", "none");
    container.getElementsByTagName("svg").item(0).setAttribute("class", "highlight-stroke");
  }
}
addHighlightStroke();
