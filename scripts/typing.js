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
const DURATION_ANIMATION_WORD = 0.5; //(in s) duration of an animation word
/** ********* **/

const typingElement = document.getElementById("typing");

let wordIndex = 0;
let letterIndex = words[wordIndex].length;
let isDeleting = false;

export function typeEffect() {
  const currentWord = words[wordIndex];

  if (letterIndex == currentWord.length) {
    let profile = document.getElementById("profile-picture");
    switch (currentWord) {
      case "énergique":
        profile.style.animation = "";
        void profile.offsetWidth; // Force reflow to restart the animation
        profile.style.animation = `shake ${DURATION_ANIMATION_WORD}s`;
        profile.style.transform = "rotate(var(--deg-after-shake))";
        break;
      case "exigeante":
        profile.style.transform = "rotate(0deg)";
        break;
      default:
    }
  }

  let time = isDeleting ? TIME_DELETING : TIME_TYPING;
  if (!isDeleting && letterIndex == currentWord.length) {
    time = wordIndex == 0 ? TIME_DONE_TYPING_FIRST : TIME_DONE_TYPING;
    isDeleting = true;
  } else if (isDeleting && letterIndex == 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    time = TIME_DONE_DELETING;
  }

  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, letterIndex--);
  } else {
    typingElement.textContent = currentWord.substring(0, letterIndex++);
  }

  setTimeout(typeEffect, time);
}
