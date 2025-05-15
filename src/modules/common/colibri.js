import { FrameLoop, getRandomInt } from "../../shared/utils.js";

/** NEXT STEPS
 * - determine randomScared based of the mousePosition: closer => jump higher
 * - recreate goAway effect (determine where the colibri will go away)
 * - if mouse come closer to colibri during scared, keep a distance min between them
 *   (distance min = initial scared distance calculated)
 */

/** Constants **/
const COLIBRI = {
  SECTION_VISIBLE: 3, //rank of the section where the colibri is visible
  //appearance
  SIZE: 70, //(in px) size of the colibri
  MARGIN_MOUSE: 10, //(in px) margin x between mouse and colibri
  RATIO_HEAD_POSITION: 3, //head position relative to the colibri top
  //scared
  SCARED: {
    NB_FRAME: 30, //frame before come back
    JUMP: {
      MAX: 100, //(in px) distance max of a scared jump
      MIN: 70, //(in px) distance min of a scared jump
    },
  },
  //hide
  HIDE: {
    TIMEOUT: 1000, //(in ms) timeout before stop animation frame
  },
  //movement
  T_INTERPOLATION: {
    follow: 0.2,
    dodge: 0.35,
    scared: 0.35,
    hide: 0.15,
  },
  PRECISION_ACHIEVED: 10, //(in px) distance between colibri and mouse needed to considered goal achieved
};
/** ********* **/

/** Class **/
export class Colibri {
  constructor() {}

  //static attributes
  static sectionVisibleId = document.getElementsByClassName("section").item(COLIBRI.SECTION_VISIBLE).id;
  static #deltaYHead = COLIBRI.SIZE / COLIBRI.RATIO_HEAD_POSITION;

  //public attributes
  isVisible = false;
  goal = { x: null, y: null };
  action = "follow";
  position = {
    x: 0,
    y: window.innerHeight * COLIBRI.SECTION_VISIBLE, //is not perfect because section can be higher then 100vh but it's enough
    angle: 0,
  };

  //private attributes
  #counterFrameScared = 0;

  get #t() {
    switch (this.action) {
      case "dodge":
        return COLIBRI.T_INTERPOLATION.dodge;
      case "scared":
        return COLIBRI.T_INTERPOLATION.scared;
      case "hide":
        return COLIBRI.T_INTERPOLATION.hide;
      case "follow":
      default:
        return COLIBRI.T_INTERPOLATION.follow;
    }
  }

  get #positionGoal() {
    //because we want the head of the colibri to be in the same x than the goal
    //and we don't want to be to close from the cursor
    return {
      x: this.goal.x - COLIBRI.SIZE * (this.#isFlipped ? 0 : 1) - this.#marginMouse,
      y: this.goal.y - Colibri.#deltaYHead,
    };
  }

  get #center() {
    return { x: this.position.x + COLIBRI.SIZE / 2, y: this.position.y + COLIBRI.SIZE / 2 };
  }

  get #head() {
    return { x: this.position.x + COLIBRI.SIZE / 2, y: this.position.y + Colibri.#deltaYHead };
  }

  /** do the distance head-goal is close enough ? */
  get #isGoalAchieved() {
    //PRECISION_ACHIEVED is necessary because the interpolation makes the movement very slow near the goal
    return this.#getDistanceTo(this.goal) < COLIBRI.SIZE / 2 + COLIBRI.MARGIN_MOUSE + COLIBRI.PRECISION_ACHIEVED;
  }

  /** the point that the colibri is looking at */
  get #focus() {
    switch (this.action) {
      case "hide":
        return this.goal;
      case "dodge":
      case "scared":
      case "follow":
      default:
        return mousePosition;
    }
  }

  get #isFlipped() {
    return this.#center.x > this.#focus.x;
  }

  /**MARGIN_MOUSE or -MARGIN_MOUSE depending of the flip*/
  get #marginMouse() {
    return COLIBRI.MARGIN_MOUSE * (this.#isFlipped ? -1 : 1);
  }

  #getDistanceTo(pos) {
    return Math.sqrt(Math.pow(pos.x - this.#head.x, 2) + Math.pow(pos.y - this.#head.y, 2));
  }

  #setGoal() {
    switch (this.action) {
      case "dodge":
        this.goal = { x: mousePosition.x - this.#marginMouse * 2, y: mousePosition.y };
        break;
      case "scared":
        //already define
        break;
      case "hide":
        break;
      case "follow":
      default:
        this.goal = mousePosition;
    }
  }

  #setAction() {
    if (this.isVisible == false) this.action = "hide";
    else if (this.action == "hide") this.action = "follow";

    if (this.#getDistanceTo(mousePosition) < COLIBRI.SIZE / 2) this.action = "dodge";
    else if (this.#isGoalAchieved) {
      switch (this.action) {
        case "dodge":
          this.action = "follow";
          break;
        case "scared":
          this.#counterFrameScared++;
          if (this.#counterFrameScared >= COLIBRI.SCARED.NB_FRAME) this.action = "follow";
          break;
        case "follow":
          this.#counterFrameScared = 0;
      }
    }
  }

  #setPosition(t, positionGoal) {
    //we are in "back" situation => exponential interpolation
    if (this.action == "follow" && this.#counterFrameScared != 0) {
      this.position.x = this.position.x + (positionGoal.x - this.position.x) * Math.pow(t, 2);
      this.position.y = this.position.y + (positionGoal.y - this.position.y) * Math.pow(t, 2);
    }
    //sinusoidal interpolation
    else {
      this.position.x = this.position.x + (positionGoal.x - this.position.x) * (0.5 - 0.5 * Math.cos(Math.PI * t));
      this.position.y = this.position.y + (positionGoal.y - this.position.y) * (0.5 - 0.5 * Math.cos(Math.PI * t));
    }

    this.position.angle = Math.atan2(this.#focus.y - this.#head.y, this.#focus.x - this.#head.x);
  }

  handleMouseDown() {
    this.action = "scared";
    //define goal once and not each frame to conserve bev=cause of the random
    this.goal = {
      x: this.#head.x - getRandomInt(COLIBRI.SCARED.JUMP.MIN, COLIBRI.SCARED.JUMP.MAX) * (this.#isFlipped ? -1 : 1),
      y: this.#head.y - getRandomInt(COLIBRI.SCARED.JUMP.MIN, COLIBRI.SCARED.JUMP.MAX),
    };
    this.#counterFrameScared = 0;
  }

  handleFrame() {
    this.#setAction();
    this.#setGoal();
    const t = this.#t;
    const positionGoal = this.#positionGoal;
    this.#setPosition(t, positionGoal);

    colibriElement.style.top = `${this.position.y}px`;
    colibriElement.style.left = `${this.position.x}px`;
    colibriElement.style.transform = `rotate(${this.position.angle}rad) scaleY(${this.#isFlipped ? "-1" : "1"})`;
  }

  changeVisibility() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      colibriElement.style.opacity = "1";
      myColibriFrameLoop.start();
    } else {
      colibriElement.style.opacity = "0";
      //define goal once and not each frame to conserve bev=cause of the random
      this.goal = { x: window.innerWidth * Math.random(), y: window.scrollY };
      myColibriFrameLoop.stop(COLIBRI.HIDE.TIMEOUT);
    }
  }
}
/** ***** **/

/** Init **/
const colibriElement = document.getElementById("colibri");
export const myColibri = new Colibri();
colibriElement.style.width = `${COLIBRI.SIZE}px`;
colibriElement.style.height = `${COLIBRI.SIZE}px`;
colibriElement.style.position = "absolute";
colibriElement.style.top = `${myColibri.position.y}px`;
colibriElement.style.left = `${myColibri.position.x}px`;
colibriElement.style.zIndex = "999";
colibriElement.style.opacity = "0";
colibriElement.style.transition = `opacity ${COLIBRI.HIDE.TIMEOUT}ms ease-in-out`;
const mousePosition = {
  x: 0,
  y: 0,
  fixedX: 0,
  fixedY: 0,
};
/** **** **/

/** EventListener **/
document.addEventListener("scroll", () => {
  mousePosition.x = mousePosition.fixedX + window.scrollX;
  mousePosition.y = mousePosition.fixedY + window.scrollY;
});
document.addEventListener("mousemove", (e) => {
  mousePosition.fixedX = e.clientX;
  mousePosition.fixedY = e.clientY;
  mousePosition.x = mousePosition.fixedX + window.scrollX;
  mousePosition.y = mousePosition.fixedY + window.scrollY;
});
document.addEventListener("mousedown", () => myColibri.handleMouseDown());
/** ************* **/

/** RequestAnimationFrame **/
const myColibriFrameLoop = new FrameLoop(myColibri.handleFrame.bind(myColibri));
/** ********************* **/
