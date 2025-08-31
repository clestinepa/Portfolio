import { myColibri } from "./colibri.js";
import { snapToDesignDetail } from "../common/scroll.js";
import { myCarousel } from "./carousel.js";

const detail = document.getElementById("design-detail");
const detailMore = document.getElementById("detail-more");

export function showDetails() {
  const itemInFront = myCarousel.instance.itemInFront;
  detail.style.setProperty(
    "--detail-url",
    `url("/public/img/${itemInFront.element.dataset.detailImg ?? "profile.jpg"}")`
  );
  if (itemInFront.element.dataset.moreText) {
    detailMore.style.display = "inline-grid";
    detailMore.href = itemInFront.element.dataset.moreLink;
    document.getElementById("detail-more-text").innerHTML = itemInFront.element.dataset.moreText;
  } else {
    detailMore.style.display = "none";
  }
}

export const myDesignSection = {
  init: () => {
    //only if we are on desktop mode
    if (window.innerWidth > 768) {
      myColibri.init();
    }
    myCarousel.init();
    /** EventListener **/
    document.getElementById("carousel-button").addEventListener("click", snapToDesignDetail);
    /** ************* **/
  },
};
