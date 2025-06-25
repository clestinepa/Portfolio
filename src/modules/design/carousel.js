import { dataDesign } from "../../shared/assets.js";
import { CarouselClass } from "./CarouselClass.js";
import { showDetails } from "./design.js";

/** NEXT STEPS
 * - fix when first move during mousedown, the carousel move more than needed
 *   (because of getRealPos... but if real only for other than first, first isn't placed right)
 * - handle the power of the movement : if the mouse is fast, go in further standard position (and even do complete circle)
 * - add a slow infinite automatic rotation, stop it when the mouse hover a photo
 * - maybe when the animation is running but mouse down, save the fact that we try to move and when the animation is done, if mouse still down and moving, then apply usual change of mouse move
 * - find an way to go to more detail (affiche, dossier, ...)
 */

/** Description of the logic :
 * Each image is placed based on a % along an ellipsis.
 * This ellipsis is recalculated at each resize of the window.
 * 0 and 1 is equivalent and correspond to the front.
 * 0.25, 0.5 and 0.75 correspond to the right, back and left.
 * For esthetics, NB_IMG and standard position are defined.
 */

/* Handle resize of the window : recalculate path of the images */
function updatePathCarousel() {
  const carousel = document.getElementById("carousel");
  let x = carousel.clientWidth;
  let y = carousel.clientHeight;
  carousel.style.setProperty(
    "--path",
    `path("M ${x * 0.5} ${y} A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} 0 A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} ${y}")`
  );
}

export const myCarousel = {
  /** @type {CarouselClass|null} */
  instance: null,
  init: () => {
    CarouselClass.DATA = dataDesign;
    myCarousel.instance = new CarouselClass();
    showDetails();
    updatePathCarousel();
    /** EventListener **/
    window.addEventListener("resize", updatePathCarousel);
    /** ************* **/
  },
};
