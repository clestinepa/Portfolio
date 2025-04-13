/** Constants **/
const words = [
  "développeuse web",
  "UX/UI designeuse",
  "curieuse",
  "énergique",
  "créative",
  "positive",
  "exigeante",
  "pédagogue",
];
const TYPING = {
  TIME: {
    DELETING: {
      DEFAULT: 30, //(in ms) time before deleting next letter
      DONE: 500, //(in ms) time before starting typing new word
    },
    TYPING: {
      DEFAULT: 50, //(in ms) time before typing next letter
      DONE: 2000, //(in ms) time before starting deleting word
      DONE_FIRST: 3000, //(in ms) time before starting deleting word
    },
  },
  ANIMATION: {
    WORD: {
      DURATION: {
        DEFAULT: 0.5, //(in s) duration of an word animation
        LONG: 1, //(in s) duration of the creative word animation
      },
    },
    BLINK_CARET: {
      DURATION: 1000, //(in ms) duration of the caret animation
    },
    BLINK_LIGHT: {
      DURATION: 300, //(in ms) duration of the blink animation of the light bulb
      ITERATION: 1.5, //iteration of the blink animation
    },
  },
};
//calculated
const iteration_blink_caret = TYPING.TIME.TYPING.DONE / TYPING.ANIMATION.BLINK_CARET.DURATION;
const timeRemoveBulb = TYPING.ANIMATION.WORD.DURATION.LONG / 2;
const delayBeforeDeleteAnimationBulb = TYPING.TIME.TYPING.DEFAULT * "créative".length + TYPING.TIME.TYPING.DONE - 150; //150 for esthetic
/** ********* **/

const typingElement = document.getElementById("typing");
const profile = document.getElementById("profile-picture");
const caretAndBulb = document.getElementById("caret-and-bulb");
const light = document.getElementById("ampoule-light");

let wordIndex = 0;
let letterIndex = words[wordIndex].length;
let isDeleting = false;

/**
 * Restart an specific animation of an element
 * @param {HTMLElement} element
 * @param {String} animation
 */
function restartAnimation(element, animation) {
  element.style.animation = "";
  void element.clientLeft; // Force reflow to restart the animation
  element.style.animation = animation;
}

function handleCaretAnimation() {
  const currentWord = words[wordIndex];
  if (letterIndex == currentWord.length) {
    if (wordIndex == 0) caretAndBulb.style.opacity = "0";
    else if (currentWord != "créative")
      restartAnimation(
        caretAndBulb,
        `blink ${TYPING.ANIMATION.BLINK_CARET.DURATION}ms step-end ${iteration_blink_caret}`
      );
  } else {
    caretAndBulb.style.opacity = "1";
  }
}

function handleWordsAnimation() {
  const currentWord = words[wordIndex];
  if (currentWord == "créative" && !isDeleting && letterIndex == 1) {
    restartAnimation(
      caretAndBulb,
      `drawBulb ${TYPING.ANIMATION.WORD.DURATION.LONG}s ease-out 100ms both, drawBulb ${timeRemoveBulb}s linear ${delayBeforeDeleteAnimationBulb}ms reverse forwards`
    );
    restartAnimation(
      light,
      `blink ${TYPING.ANIMATION.BLINK_LIGHT.DURATION}ms ${TYPING.ANIMATION.WORD.DURATION.LONG}s step-end ${TYPING.ANIMATION.BLINK_LIGHT.ITERATION}`
    );
  } else if (letterIndex == currentWord.length) {
    switch (currentWord) {
      case "énergique":
        restartAnimation(profile, `shake ${TYPING.ANIMATION.WORD.DURATION.DEFAULT}s`);
        profile.style.transform = "rotate(var(--deg-after-shake))";
        break;
      case "exigeante":
        profile.style.transform = "rotate(0deg)";
        break;
      default:
    }
  }
}

function getTimeBeforeNextEffect() {
  const currentWord = words[wordIndex];

  let time = isDeleting ? TYPING.TIME.DELETING.DEFAULT : TYPING.TIME.TYPING.DEFAULT;
  if (!isDeleting && letterIndex == currentWord.length) {
    time = wordIndex == 0 ? TYPING.TIME.TYPING.DONE_FIRST : TYPING.TIME.TYPING.DONE;
    isDeleting = true;
  } else if (isDeleting && letterIndex == 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    time = TYPING.TIME.DELETING.DONE;
  }
  return time;
}

export function typeEffect() {
  const currentWord = words[wordIndex];

  handleCaretAnimation();
  handleWordsAnimation();
  const time = getTimeBeforeNextEffect();

  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, letterIndex--);
  } else {
    typingElement.textContent = currentWord.substring(0, letterIndex++);
  }

  setTimeout(typeEffect, time);
}
