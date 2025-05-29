import { myColibri } from "../common/colibri.js";
import { handleProgressBar } from "../common/progressBar.js";
import { disableScroll, enableScroll, snapToDesignDetail } from "../common/scroll.js";
import { myCarousel } from "./carousel.js";

const detail = document.getElementById("design-detail");
const overlay = document.getElementById("overlay");
const main = document.getElementById("main");
const header = document.getElementById("header");

function showDetails() {
  detail.classList.remove("hide");
  detail.style.setProperty("--detail-url", `url("/public/img/${myCarousel.itemInFront.detailImg ?? "profile.jpg"}")`);
  if (myCarousel.itemInFront.more) {
    document.getElementById("detail-more").style.display = "inline-grid";
    document.getElementById("detail-more-text").innerHTML = myCarousel.itemInFront.moreText;
    const src = `/public/img/${myCarousel.itemInFront.more}`;
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

document.getElementById("carousel-button").addEventListener("click", showDetails);

function openOverlay() {
  overlay.style.display = "flex";
  main.classList.add("overlay-open");
  header.classList.add("overlay-open");
  disableScroll();
  myColibri.hide();
}

function closeOverlay() {
  console.log("close");
  overlay.style.display = "none";
  main.classList.remove("overlay-open");
  header.classList.remove("overlay-open");
  enableScroll();
  myColibri.show();
}

document.getElementById("detail-more").addEventListener("click", openOverlay);
document.getElementById("overlay-close").addEventListener("click", closeOverlay);
