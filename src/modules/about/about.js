import { dataAbout } from "../../shared/assets.js";

/** NEXT STEPS
 * - improve UI : add assets for each p
 * - do I add infinite animation in the assets ?
 */

/** Constants **/
const ABOUT = {};
/** ********* **/

function displayText() {
  for (const item of dataAbout) {
    let textContainer = document.createElement("div");
    textContainer.className = `text-container ${item.id == dataAbout.length ? "end" : item.id % 2 ? "odd" : "even"}`;

    let text = document.createElement("p");
    text.classList.add("justify");
    for (const part of item.text) {
      if (typeof part === "string") {
        text.appendChild(document.createTextNode(part));
      } else if (part.highlight) {
        const span = document.createElement("span");
        span.className = `highlight-container ${part.color}`;
        span.textContent = part.highlight;
        text.appendChild(span);
      }
    }
    textContainer.appendChild(text);

    if (item.img) {
      let illustration = document.createElement("img");
      illustration.className = "text-illustration";
      illustration.id = `text-illustration-${item.id}`;
      illustration.src = `public/img/${item.img}`;
      textContainer.appendChild(illustration);
    }

    document.getElementById("about-text").appendChild(textContainer);
  }
}

export const myAboutSection = {
  init: () => {
    displayText();
  },
};
