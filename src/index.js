import { displayBg } from "./modules/common/bg.js";
import { initCursor } from "./modules/common/cursor.js";
import { initConstrainedScroll } from "./modules/common/scroll.js";
import { typeEffect } from "./modules/presentation/typing.js";
import { displayAbout } from "./modules/about/about.js";
import { displayCarousel } from "./modules/design/carousel.js";
import { displayGrid } from "./modules/dev/grid.js";
import { initProgressBar } from "./modules/common/progressBar.js";

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
function disableDrag() {
  document.querySelectorAll("img, a, p, span, h1, h2").forEach((el) => {
    el.setAttribute("draggable", "false");
  });
}

async function initializeSite() {
  //presentation section
  typeEffect();
  //about section
  await displayAbout();
  //design section
  displayCarousel();
  //dev section
  await displayGrid();
  //global scripts, wait that everything else is setup
  await addHighlightStroke();
  displayBg();
  initCursor();
  initConstrainedScroll();
  initProgressBar();
  disableDrag();
}

async function initWithLoader() {
  await initializeSite();

  document.querySelector("body").removeChild(document.getElementById("loader"));
  document.querySelector("main").style.opacity = "1";
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initWithLoader);
else initWithLoader();
