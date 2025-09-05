import { myFrameLoop, getRandomInt } from "../../shared/utils.js";

/** Constants **/
const SCRAMBLE = {
  CHARACTERS: "!<>-_\\/[]{}—=+*^?#________", //possible characters to scramble
  TIME: 15, //(in ms) time maximum of a change
  PROB_CHANGE: 0.5, //probability of changing the scrambling character at each frame
};
/** ********* **/

class Scramble {
  /** @type {{ from: string, to: string, start: number, end: number, char: string }[]} */
  queue = [];
  counterFrame = 0;
  element;

  /**F
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
  }

  updateScramble() {
    let output = "";
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.counterFrame >= end) {
        output += to;
        complete++;
      } else if (this.counterFrame >= start) {
        if (!char || Math.random() < SCRAMBLE.PROB_CHANGE) {
          char = SCRAMBLE.CHARACTERS[getRandomInt(0, SCRAMBLE.CHARACTERS.length - 1)];
          this.queue[i].char = char;
        }
        output += `<span style="opacity:0.5; color: inherit; font-family: inherit;">${char}</span>`;
      } else output += from;
    }

    this.element.innerHTML = output;

    if (complete >= this.queue.length) return false;
    else this.counterFrame++;

    return true;
  }

  scrambleText(newText) {
    this.queue = [];
    this.counterFrame = 0;

    const oldText = this.element.textContent;
    const length = Math.max(oldText.length, newText.length);

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = getRandomInt(0, SCRAMBLE.TIME / 2);
      const end = start + getRandomInt(0, SCRAMBLE.TIME / 2);
      this.queue.push({ from, to, start, end, char: "" });
    }

    myFrameLoop.start(this.updateScramble.bind(this));
  }
}

const button = document.getElementById("scramble-button");
const description = document.getElementById("scramble");

/**
 * Scramble the current carousel description with the description of the new item in front
 * @param {HTMLElement} el the HTMLElement of the image in front of the carousel
 */
export function scramble(img) {
  scrambleButton.scrambleText(img.dataset.title);
  scrambleDescription.scrambleText(img.dataset.description);
}

const scrambleButton = new Scramble(button);
const scrambleDescription = new Scramble(description);
