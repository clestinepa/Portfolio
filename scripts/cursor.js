import { getRandomInt, getRandomVariableCSSColor } from "./global.js";

/** Constants **/
const DEFAULT_SIZE = 15; //(in px) size of the cursor in default state
const PRESS_SIZE = 20; //(in px) size of the cursor in press state
const MAX_SIZE_SPARKLE = 6; //(in px) maximum size of a sparkle
const MIN_SIZE_SPARKLE = 3; //(in px) minimum size of a sparkle
const MAX_DELAY_ANIMATION_SPARKLE = 100; //(in ms) maximum delay for the sparkle animation
const DURATION_ANIMATION_SPARKLE = 1000; //(in ms) duration of the sparkle animation
const SIZE_SQUARE_APPARITION_SPARKLE = 10; //(in px) size of the square where the sparkles randomly appear
/** ********* **/

const cursor = document.getElementById("cursor");
const cursorForm = document.getElementById("cursor-form");

cursorForm.style.width = `${DEFAULT_SIZE}px`;
cursorForm.style.height = `${DEFAULT_SIZE}px`;

var sparklesArr = [];

function trailAnimation(e) {
  let elem = document.createElement("div");
  elem.classList.add("sparkle");
  elem = styleSparkle(elem, e);
  elem = addAnimationProperties(elem);

  cursor.appendChild(elem);
  sparklesArr.push(elem);
}

function styleSparkle(elem, e) {
  const midSquare = SIZE_SQUARE_APPARITION_SPARKLE / 2;
  elem.style.top = e.pageY - window.scrollY + getRandomInt(-midSquare, midSquare) + "px";
  elem.style.left = e.pageX + getRandomInt(-midSquare, midSquare) + "px";

  let size = getRandomInt(MIN_SIZE_SPARKLE, MAX_SIZE_SPARKLE) + "px";
  elem.style.width = size;
  elem.style.height = size;
  elem.style.background = getRandomVariableCSSColor();

  return elem;
}

function addAnimationProperties(elem) {
  let lifeExpectancy = getRandomInt(0, DURATION_ANIMATION_SPARKLE);
  elem.created = Date.now();
  elem.diesAt = elem.created + lifeExpectancy;
  elem.style.animation = `fall ${DURATION_ANIMATION_SPARKLE}ms ease-in ${getRandomInt(
    0,
    MAX_DELAY_ANIMATION_SPARKLE
  )}ms forwards`;
  return elem;
}

function removeSparkles() {
  let moveIndex = 0;
  let sparkle;

  for (let i = 0; i < sparklesArr.length; i++) {
    sparkle = sparklesArr[i];
    if (sparkle.diesAt <= Date.now()) cursor.removeChild(sparkle);
    else sparklesArr[moveIndex++] = sparkle; // faster than array.splice()
  }

  sparklesArr.length = moveIndex;
  requestAnimationFrame(removeSparkles);
}

removeSparkles(); // starts the recursive loop

export function initCursor() {
  window.onmousemove = (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
    trailAnimation(e);
  };

  window.onmousedown = () => {
    cursorForm.style.animation = "";
    cursorForm.style.width = `${PRESS_SIZE}px`;
    cursorForm.style.height = `${PRESS_SIZE}px`;
  };

  window.onmouseup = () => {
    cursorForm.style.animation = "rotate 0.5s ease-out both";
    cursorForm.style.width = `${DEFAULT_SIZE}px`;
    cursorForm.style.height = `${DEFAULT_SIZE}px`;
  };
}
