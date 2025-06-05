import { myColibri } from "./colibri.js";
import { handleProgressBar, snapToDesignDetail } from "../common/scroll.js";
import { myCarousel } from "./carousel.js";

const detail = document.getElementById("design-detail");
const detailMore = document.getElementById("detail-more");

function showDetails() {
  const itemInFront = myCarousel.instance.itemInFront;
  detail.classList.remove("hide");
  detail.style.setProperty("--detail-url", `url("/public/img/${itemInFront.detailImg ?? "profile.jpg"}")`);
  if (itemInFront.more) {
    detailMore.style.display = "inline-grid";
    detailMore.href = itemInFront.more.link;
    document.getElementById("detail-more-text").innerHTML = itemInFront.more.text;
  }
  snapToDesignDetail();
}

export function hideDetails() {
  detail.classList.add("hide");
  detailMore.style.display = "none";
  handleProgressBar();
}

export const myDesignSection = {
  init: () => {
    //only if we are on desktop mode
    if (window.innerWidth > 768) {
      myColibri.init();
    }
    myCarousel.init();
    /** EventListener **/
    document.getElementById("carousel-button").addEventListener("click", showDetails);
    /** ************* **/
  },
};
