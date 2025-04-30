import { displayBg } from "./bg.js";
import { initCursor } from "./cursor.js";
import { initConstrainedScroll } from "./scroll.js";
import { typeEffect } from "./typing.js";
import { displayAbout } from "./about.js";
import { displayCarousel } from "./carousel.js";
import { displaySlide } from "./slide.js";
import { displayGrid } from "./grid.js";

//presentation section
typeEffect();
//about section
displayAbout();
//design section
displayCarousel();
//dev section
// displaySlide();
displayGrid();
//global scripts, wait that everything else is setup
displayBg();
initCursor();
initConstrainedScroll();
