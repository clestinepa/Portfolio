import { myColibri } from "./colibri.js";
import { disableScroll, enableScroll, handleProgressBar, snapToDesignDetail } from "../common/scroll.js";
import { myCarousel } from "./carousel.js";

const detail = document.getElementById("design-detail");
const overlay = document.getElementById("overlay");
const main = document.getElementById("main");
const header = document.getElementById("header");

function showDetails() {
  const itemInFront = myCarousel.instance.itemInFront;
  detail.classList.remove("hide");
  detail.style.setProperty("--detail-url", `url("/public/img/${itemInFront.detailImg ?? "profile.jpg"}")`);
  if (itemInFront.more) {
    document.getElementById("detail-more").style.display = "inline-grid";
    document.getElementById("detail-more-text").innerHTML = itemInFront.moreText;
    const src = `/public/img/${itemInFront.more}`;
    overlay.style.setProperty("--more-url", `url("${src}")`);
    document.getElementById("overlay-download").href = src;
  }
  snapToDesignDetail();
}

export function hideDetails() {
  detail.classList.add("hide");
  document.getElementById("detail-more").style.display = "none";
  handleProgressBar();
}

function openOverlay() {
  overlay.style.display = "flex";
  main.classList.add("overlay-open");
  header.classList.add("overlay-open");
  disableScroll();
  myColibri.instance.hide();
}

function closeOverlay() {
  console.log("close");
  overlay.style.display = "none";
  main.classList.remove("overlay-open");
  header.classList.remove("overlay-open");
  enableScroll();
  myColibri.instance.show();
}

export const myDesignSection = {
  init: () => {
    myColibri.init();
    myCarousel.init();
    /** EventListener **/
    document.getElementById("carousel-button").addEventListener("click", showDetails);
    document.getElementById("detail-more").addEventListener("click", openOverlay);
    document.getElementById("overlay-close").addEventListener("click", closeOverlay);
    /** ************* **/
  },
};
