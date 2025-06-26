import { svgHighlightStroke } from "../../shared/assets.js";
import { myBg } from "./bg.js";
import { myCursor } from "./cursor.js";
import { myScroll } from "./scroll.js";

function addHighlightStroke() {
  const containers = document.getElementsByClassName("highlight-container");
  for (const container of containers) {
    container.innerHTML += svgHighlightStroke;
    container.getElementsByTagName("svg").item(0).setAttribute("preserveAspectRatio", "none");
    container.getElementsByTagName("svg").item(0).setAttribute("class", "highlight-stroke");
  }
}
function disableDrag() {
  document.querySelectorAll("img, div, a, p, span, h1, h2").forEach((el) => {
    el.setAttribute("draggable", "false");
  });
}

export const myCommonElements = {
  init: () => {
    //only if we are on desktop mode
    if (window.innerWidth > 768) {
      myCursor.init();
      myBg.init();
      myScroll.init();
    }
    addHighlightStroke();
    disableDrag();
  },
};
