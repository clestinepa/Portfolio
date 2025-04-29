import { displayBg } from "./bg.js";
import { initCursor } from "./cursor.js";
import { initConstrainedScroll } from "./scroll.js";
import { typeEffect } from "./typing.js";
import { displayAbout } from "./about.js";
import { initCarousel } from "./carousel.js";
import { displaySlide } from "./slide.js";
import { displayGrid } from "./grid.js";

//global scripts
displayBg();
initCursor();
initConstrainedScroll();
//presentation section
typeEffect();
//about section
displayAbout();
//design section
initCarousel();
//dev section
// displaySlide();
displayGrid();