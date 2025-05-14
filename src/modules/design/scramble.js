import { FrameLoop, getRandomInt } from "../../shared/utils.js";

/** Constants **/
const SCRAMBLE = {
  CHARACTERS: "!<>-_\\/[]{}—=+*^?#________", //possible characters to scramble
  TIME: 15, //(in ms) time maximum of a change
  PROB_CHANGE: 0.5, //probability of changing the scrambling character at each frame
};
/** ********* **/

let counterFrame = 0;
let queue = [];
const element = document.getElementById("scramble");

export function scrambleText(newText) {
  queue = [];
  counterFrame = 0;

  const oldText = element.textContent;
  const length = Math.max(oldText.length, newText.length);

  for (let i = 0; i < length; i++) {
    const from = oldText[i] || "";
    const to = newText[i] || "";
    const start = getRandomInt(0, SCRAMBLE.TIME / 2);
    const end = start + getRandomInt(0, SCRAMBLE.TIME / 2);
    queue.push({ from, to, start, end, char: "" });
  }

  scrambleFrameLoop.start();
}

function update() {
  let output = "";
  let complete = 0;

  for (let i = 0; i < queue.length; i++) {
    let { from, to, start, end, char } = queue[i];

    if (counterFrame >= end) {
      output += to;
      complete++;
    } else if (counterFrame >= start) {
      if (!char || Math.random() < SCRAMBLE.PROB_CHANGE) {
        char = SCRAMBLE.CHARACTERS[getRandomInt(0, SCRAMBLE.CHARACTERS.length - 1)];
        queue[i].char = char;
      }
      output += `<span style="opacity:0.5">${char}</span>`;
    } else output += from;
  }

  element.innerHTML = output;

  if (complete >= queue.length) return false;
  else counterFrame++;
}

/** RequestAnimationFrame **/
export const scrambleFrameLoop = new FrameLoop(update);
/** ********************* **/
