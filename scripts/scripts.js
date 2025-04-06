import { displayBg } from "./bg.js";
import { initCursor } from "./cursor.js";
import { initConstrainedScroll } from "./scroll.js";
import { typeEffect } from "./typing.js";
import { refColibri } from "./colibri.js";
import { initCarousel } from "./carousel.js";
import { displaySlide } from "./slide.js";

//global scripts
displayBg();
initCursor();
initConstrainedScroll();
//presentation section
typeEffect();
//about section
refColibri();
//design section
initCarousel();
//dev section
displaySlide();
