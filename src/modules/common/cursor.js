import { myFrameLoop, getRandomInt, getRandomVariableCSSColor } from "../../shared/utils.js";

/** Constants **/
const CURSOR = {
  SPARKLE: {
    SIZE: {
      MAX: 6, //(in px) maximum size of a sparkle
      MIN: 3, //(in px) minimum size of a sparkle
    },
    SIZE_SQUARE_APPARITION: 10, //(in px) size of the square where the sparkles randomly appear
    ANIMATION: {
      DELAY: {
        MAX: 100, //(in ms) maximum delay for the sparkle animation
        MIN: 0, //(in ms) minimum delay for the sparkle animation
      },
      DURATION: 1000, //(in ms) duration of the sparkle animation
    },
  },
  ANIMATION: {
    DURATION: 0.5, //(in s) duration of the mouseup animation
  },
};
/** ********* **/

const cursor = document.getElementById("cursor");
const cursorForm = document.getElementById("cursor-form");

var sparklesArr = [];

function trailAnimation(e) {
  let elem = document.createElement("div");
  elem.classList.add("sparkle");
  elem = styleSparkle(elem, e);
  elem = addAnimationProperties(elem);

  cursor.appendChild(elem);
  myFrameLoop.start(removeSparkles); // starts the recursive loop if needed
  sparklesArr.push(elem);
}

function styleSparkle(elem, e) {
  const midSquare = CURSOR.SPARKLE.SIZE_SQUARE_APPARITION / 2;
  elem.style.top = e.pageY - window.scrollY + getRandomInt(-midSquare, midSquare) + "px";
  elem.style.left = e.pageX + getRandomInt(-midSquare, midSquare) + "px";

  let size = getRandomInt(CURSOR.SPARKLE.SIZE.MIN, CURSOR.SPARKLE.SIZE.MAX) + "px";
  elem.style.width = size;
  elem.style.height = size;
  elem.style.background = getRandomVariableCSSColor();

  return elem;
}

function addAnimationProperties(elem) {
  let lifeExpectancy = getRandomInt(0, CURSOR.SPARKLE.ANIMATION.DURATION);
  elem.created = Date.now();
  elem.diesAt = elem.created + lifeExpectancy;
  elem.style.animation = `fall ${CURSOR.SPARKLE.ANIMATION.DURATION}ms ease-in ${getRandomInt(
    CURSOR.SPARKLE.ANIMATION.DELAY.MIN,
    CURSOR.SPARKLE.ANIMATION.DELAY.MAX
  )}ms forwards`;
  return elem;
}

function removeSparkles() {
  let moveIndex = 0;
  let sparkle;

  if (sparklesArr.length === 0) return { shouldContinue: false };

  for (let i = 0; i < sparklesArr.length; i++) {
    sparkle = sparklesArr[i];
    if (sparkle.diesAt <= Date.now()) cursor.removeChild(sparkle);
    else sparklesArr[moveIndex++] = sparkle; // faster than array.splice()
  }

  sparklesArr.length = moveIndex;
  return { shouldContinue: true };
}

function handleCursorMoving(e) {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
  trailAnimation(e);
}

function handleCursorDown() {
  cursorForm.style.animation = "";
  cursor.style.setProperty("--cursor-size", "var(--press-size)");
}

function handleCursorUp() {
  cursorForm.style.animation = `rotate ${CURSOR.ANIMATION.DURATION}s ease-out both`;
  cursor.style.setProperty("--cursor-size", "var(--default-size)");
}

function initCursorHover() {
  const clickMeElements = document.getElementsByClassName("click-me");
  for (let element of clickMeElements) {
    element.addEventListener("mouseenter", () => {
      cursorForm.style.setProperty("--cursor-size", "var(--press-size)");
      cursorForm.style.setProperty("--cursor-rotation", "var(--hover-rotation)");
    });
    element.addEventListener("mousedown", () => cursorForm.style.setProperty("--cursor-color", "var(--main-photo)"));
    element.addEventListener("mouseleave", () => {
      cursorForm.style.removeProperty("--cursor-size");
      cursorForm.style.removeProperty("--cursor-color");
      cursorForm.style.removeProperty("--cursor-rotation");
    });
    element.addEventListener("mouseup", () => {
      cursorForm.style.removeProperty("--cursor-color");
    });
  }
}

export const myCursor = {
  init: () => {
    initCursorHover();
    /** EventListener **/
    document.addEventListener("mousedown", handleCursorDown);
    document.addEventListener("mousemove", handleCursorMoving);
    document.addEventListener("mouseup", handleCursorUp);
    /** ************* **/
  },
};
