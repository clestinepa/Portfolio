import { displayBg } from "./bg.js";
import { initCursor } from "./cursor.js";
import { initConstrainedScroll } from "./scroll.js";
import { initCarousel } from "./carousel.js";
import { refColibri } from "./colibri.js";
import { displaySlide } from "./slide.js";

//global scripts
displayBg();
initCursor();
initConstrainedScroll();
//about section
refColibri();
//design section
initCarousel();
//dev section
displaySlide();
