import { svgLogos } from "../../shared/assets.js";
import { getRandom, getRandomInt, getRandomVariableCSSColor } from "../../shared/utils.js";

/** NEXT STEPS
 * - add other particles
 */

/** Constants **/
const CONTACT = {
  POWER_ROTATION: 20, //multiplier for the rotation of the card
  PARTICLES: {
    SIZE: {
      MAX: 50, //(in px) maximum size of a particle
      MIN: 20, //(in px) minimum size of a particle
    },
    ANIMATION: {
      DELAY: {
        MAX: 4, //(in s) maximum delay for the particle animation
        MIN: 0, //(in s) minimum delay for the particle animation
      },
      DURATION: 4, //(in s) duration of the particle animation
    },
  },
};
/** ********* **/

const contact = document.getElementById("contact");
const cardWrapper = document.getElementById("contact-card-wrapper");
const card = document.getElementById("contact-card");

function rotateContactCard(event) {
  const middleX = cardWrapper.offsetLeft + cardWrapper.offsetWidth / 2 - contact.offsetLeft;
  const middleY = cardWrapper.offsetTop + cardWrapper.offsetHeight / 2 - contact.offsetTop;
  const offsetX = ((event.clientX - middleX) / middleX) * CONTACT.POWER_ROTATION;
  const offsetY = ((event.clientY - middleY) / middleY) * CONTACT.POWER_ROTATION;
  card.style.setProperty("--rotateX", offsetX + "deg");
  card.style.setProperty("--rotateY", -1 * offsetY + "deg");
}

function initParticles() {
  for (let _ of [0, 1, 2]) {
    for (const logoName in svgLogos) {
      const wrapperSvg = document.createElement("div");
      wrapperSvg.innerHTML = svgLogos[logoName];
      wrapperSvg.classList = "contact-particles";
      //size and color
      wrapperSvg.style.setProperty(
        "--size",
        getRandomInt(CONTACT.PARTICLES.SIZE.MIN, CONTACT.PARTICLES.SIZE.MAX) + "px"
      );
      wrapperSvg.style.fill = getRandomVariableCSSColor();
      //goal position
      const minRadius = Math.max(card.offsetWidth, card.offsetHeight);
      const maxRadius = Math.min(cardWrapper.offsetWidth, cardWrapper.offsetHeight) / 2;
      const radius = getRandom(minRadius, maxRadius);
      const angle = Math.random() * 2 * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      wrapperSvg.style.setProperty("--x", `calc(-50% + ${x}px)`);
      wrapperSvg.style.setProperty("--y", `calc(-50% + ${y}px)`);
      //animation
      const randomDelay = getRandom(CONTACT.PARTICLES.ANIMATION.DELAY.MIN, CONTACT.PARTICLES.ANIMATION.DELAY.MAX);
      wrapperSvg.style.animation = `moveParticle ${CONTACT.PARTICLES.ANIMATION.DURATION}s ${randomDelay}s ease-in infinite`;

      cardWrapper.appendChild(wrapperSvg);
    }
  }
}

export const myContactSection = {
  init: () => {
    initParticles();
    //only if we are on desktop mode
    if (window.innerWidth > 768) {
      /** EventListener **/
      contact.addEventListener("mousemove", rotateContactCard);
      /** ************* **/
    }
  },
};
