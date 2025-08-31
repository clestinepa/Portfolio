import { dataDev, svgLogos } from "../../shared/assets.js";
/** NEXT STEPS
 * - do I put a infinite slide in the img to show severals pictures of each picture ?
 * - find an way to go to detail : github/website/explanation/...
 */

/** Constants **/
const GRID = {};
/** ********* **/

const gridContainer = document.getElementById("grid-container");

function displayGrid() {
  for (const item of dataDev) {
    //img
    let imgContainer = document.createElement("div");
    imgContainer.className = "img-container";
    let img = document.createElement("img");
    img.src = `/public/img/${item.img ?? "profile.jpg"}`;
    imgContainer.appendChild(img);
    let buttons = document.createElement("div");
    buttons.className = "buttons-dev";
    for (const button of item.buttons) {
      buttons.innerHTML += `<a class="button click-me" id="carousel-button" target="_blank" href="${button.link}"><span class="button-content"><span class="button-default">${button.text}</span><span class="button-hover">Découvrir</span></span></a>`;
    }
    imgContainer.appendChild(buttons);

    //text
    let textContainer = document.createElement("div");
    textContainer.className = "text-container";

    let title = document.createElement("h2");
    title.innerHTML = item.title;
    textContainer.appendChild(title);

    let text = document.createElement("p");
    text.innerHTML = item.text;
    textContainer.appendChild(text);

    let logos = document.createElement("div");
    logos.className = "logos";
    for (const logoName of item.logos) {
      const wrapperSvg = document.createElement("div");
      wrapperSvg.innerHTML = svgLogos[logoName];
      wrapperSvg.setAttribute("data-tooltip", logoName.replace("-", " "));
      wrapperSvg.classList = "tech-logo tooltip";
      logos.appendChild(wrapperSvg);
    }
    textContainer.appendChild(logos);

    //wrapper
    let wrapper = document.createElement("div");
    wrapper.className = "img-text-wrapper";
    wrapper.appendChild(imgContainer);
    wrapper.appendChild(textContainer);
    gridContainer.appendChild(wrapper);
  }
}

export const myDevSection = {
  init: () => {
    displayGrid();
  },
};
