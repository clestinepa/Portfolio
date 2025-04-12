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
//time
const TIME_DELETING = 30; //(in ms) time before deleting next letter
const TIME_TYPING = 50; //(in ms) time before typing next letter
const TIME_DONE_TYPING = 2000; //(in ms) time before starting deleting word
const TIME_DONE_TYPING_FIRST = 3000; //(in ms) time before starting deleting word
const TIME_DONE_DELETING = 500; //(in ms) time before starting typing new word
//animation
const DURATION_ANIMATION_WORD = 0.5; //(in s) duration of an word animation
const DURATION_ANIMATION_WORD_CREATIVE = 1; //(in s) duration of the creative word animation
const DURATION_ANIMATION_BLINK_CARET = 1000; //(in ms) duration of the caret animation
const DURATION_ANIMATION_BLINK_LIGHT = 300; //(in ms) duration of the blink animation of the light bulb
const NB_BLINK_LIGHT = 1.5;
//calculated
const nb_blink_caret = TIME_DONE_TYPING / DURATION_ANIMATION_BLINK_CARET;
const timeRemoveBulb = DURATION_ANIMATION_WORD_CREATIVE / 2;
const delayBeforeDeleteAnimationBulb = TIME_TYPING * "créative".length + TIME_DONE_TYPING - 150; //150 for esthetic
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
      restartAnimation(caretAndBulb, `blink ${DURATION_ANIMATION_BLINK_CARET}ms step-end ${nb_blink_caret}`);
  } else {
    caretAndBulb.style.opacity = "1";
  }
}

function handleWordsAnimation() {
  const currentWord = words[wordIndex];
  if (currentWord == "créative" && !isDeleting && letterIndex == 1) {
    restartAnimation(
      caretAndBulb,
      `drawBulb ${DURATION_ANIMATION_WORD_CREATIVE}s ease-out 100ms both, drawBulb ${timeRemoveBulb}s linear ${delayBeforeDeleteAnimationBulb}ms reverse forwards`
    );
    restartAnimation(
      light,
      `blink ${DURATION_ANIMATION_BLINK_LIGHT}ms ${DURATION_ANIMATION_WORD_CREATIVE}s step-end ${NB_BLINK_LIGHT}`
    );
  } else if (letterIndex == currentWord.length) {
    switch (currentWord) {
      case "énergique":
        restartAnimation(profile, `shake ${DURATION_ANIMATION_WORD}s`);
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

  let time = isDeleting ? TIME_DELETING : TIME_TYPING;
  if (!isDeleting && letterIndex == currentWord.length) {
    time = wordIndex == 0 ? TIME_DONE_TYPING_FIRST : TIME_DONE_TYPING;
    isDeleting = true;
  } else if (isDeleting && letterIndex == 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    time = TIME_DONE_DELETING;
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
