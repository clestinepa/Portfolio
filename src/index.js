import { displayBg } from "./modules/common/bg.js";
import { initCursor } from "./modules/common/cursor.js";
import { initConstrainedScroll } from "./modules/common/scroll.js";
import { typeEffect } from "./modules/presentation/typing.js";
import { displayAbout } from "./modules/about/about.js";
import { displayCarousel } from "./modules/design/carousel.js";
import { displayGrid } from "./modules/dev/grid.js";

//presentation section
typeEffect();
//about section
displayAbout();
//design section
displayCarousel();
//dev section
displayGrid();
//global scripts, wait that everything else is setup
displayBg();
initCursor();
initConstrainedScroll();

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
