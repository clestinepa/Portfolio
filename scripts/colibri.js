import { getRandomInt } from "./global.js";

/** NEXT STEPS
 * - determine randomScared based of the mousePosition: closer => jump higher
 * - add flower around text
 * - recreate goAway effect
 * - if mouse come closer to colibri during scared, keep a distance min between them
 *   (distance min=initial scared distance calculated)
 */

/** Constants **/
//appearance
const COLIBRI_SIZE = 70; //(in px) size of the colibri
const MARGIN_MOUSE = 10; //(in px) margin x between mouse and colibri
const RATIO_HEAD_POSITION = 3; //head position relative to the colibri top
//scared
const NB_FRAME_MAX_SCARED = 50; //frame before come back
const MAX_SCARED_JUMP = 100; //(in px) distance max of a scared jump
const MIN_SCARED_JUMP = COLIBRI_SIZE; //(in px) distance min of a scared jump
//movement
const T_INTERPOLATION = {
  follow: 0.1,
  dodge: 0.25,
  goAway: 0.05,
  scared: 0.25,
};
const PRECISION_ACHIEVED = 10; //(in px) distance between colibri and mouse needed to considered goal achieved
/** ********* **/

/** Class **/
class Colibri {
  isVisible = false;
  goal = { x: null, y: null };
  action = "follow";
  position = {
    flip: false,
    x: 0,
    y: 0,
    angle: 0,
  };
  counterFrameScared = 0;
  animationFrame = null;
  constructor() {}

  set animationFrame(value) {
    this.animationFrame = value;
  }

  get #t() {
    switch (this.action) {
      case "goAway":
        return T_INTERPOLATION.goAway;
      case "dodge":
        return T_INTERPOLATION.dodge;
      case "scared":
        return T_INTERPOLATION.scared;
      case "follow":
      default:
        return T_INTERPOLATION.follow;
    }
  }

  get #deltaYHead() {
    return COLIBRI_SIZE / RATIO_HEAD_POSITION;
  }

  get #center() {
    return { x: this.position.x + COLIBRI_SIZE / 2, y: this.position.y + COLIBRI_SIZE / 2 };
  }

  get #head() {
    return { x: this.position.x + COLIBRI_SIZE / 2, y: this.position.y + this.#deltaYHead };
  }

  /** do the distance head-goal is close enough ? */
  get #isGoalAchieved() {
    //PRECISION_ACHIEVED is necessary because the interpolation makes
    //the movement very slow near the goal
    return this.#getDistanceTo(this.goal) < COLIBRI_SIZE / 2 + MARGIN_MOUSE + PRECISION_ACHIEVED;
  }

  get #focus() {
    switch (this.action) {
      case "goAway":
      case "hide":
        return this.goal;
      case "dodge":
      case "scared":
      case "follow":
      default:
        return mousePosition;
    }
  }

  #setFlip() {
    this.position.flip = this.#center.x > this.#focus.x;
  }

  #setAngle() {
    this.position.angle = Math.atan2(this.#focus.y - this.#head.y, this.#focus.x - this.#head.x);
    colibriElement.style.transform = `rotate(${colibri.position.angle}rad) scaleY(${
      colibri.position.flip ? "-1" : "1"
    })`;
  }

  /**MARGIN_MOUSE or -MARGIN_MOUSE depending of the flip*/
  get #mouseGap() {
    return MARGIN_MOUSE * (this.position.flip ? -1 : 1);
  }

  #getDistanceTo(pos) {
    return Math.sqrt(Math.pow(pos.x - this.#head.x, 2) + Math.pow(pos.y - this.#head.y, 2));
  }

  #setGoal() {
    switch (this.action) {
      case "dodge":
        this.goal = {
          x: mousePosition.x - this.#mouseGap * 2,
          y: mousePosition.y,
        };
        break;
      case "scared":
        //already define
        break;
      case "follow":
      default:
        this.goal = mousePosition;
    }
  }

  #setAction() {
    if (this.#getDistanceTo(mousePosition) < COLIBRI_SIZE / 2) this.action = "dodge";
    else if (this.#isGoalAchieved) {
      switch (this.action) {
        case "dodge":
          this.action = "follow";
          break;
        case "scared":
          this.counterFrameScared++;
          if (this.counterFrameScared >= NB_FRAME_MAX_SCARED) this.action = "follow";
          break;
        case "follow":
          this.counterFrameScared = 0;
      }
    }
    colibriElement.dataset.action = colibri.action;
  }

  get #estheticGoal() {
    //because we want the head of the colibri to be in the same x than the goal
    //and we don't want to be to close from the cursor
    return {
      x: this.goal.x - COLIBRI_SIZE * (this.position.flip ? 0 : 1) - this.#mouseGap,
      y: this.goal.y - this.#deltaYHead,
    };
  }

  #setPosition() {
    //we are in "back" situation => exponential interpolation
    if (this.action == "follow" && this.counterFrameScared != 0) {
      this.position.x = this.position.x + (this.#estheticGoal.x - this.position.x) * Math.pow(this.#t, 2);
      this.position.y = this.position.y + (this.#estheticGoal.y - this.position.y) * Math.pow(this.#t, 2);
    }
    //sinusoidal interpolation
    else {
      this.position.x =
        this.position.x + (this.#estheticGoal.x - this.position.x) * (0.5 - 0.5 * Math.cos(Math.PI * this.#t));
      this.position.y =
        this.position.y + (this.#estheticGoal.y - this.position.y) * (0.5 - 0.5 * Math.cos(Math.PI * this.#t));
    }
    colibriElement.style.top = `${colibri.position.y}px`;
    colibriElement.style.left = `${colibri.position.x}px`;
  }

  handleMouseDown() {
    this.action = "scared";
    const randomY = getRandomInt(MIN_SCARED_JUMP, MAX_SCARED_JUMP);
    const randomX = getRandomInt(MIN_SCARED_JUMP, MAX_SCARED_JUMP);
    this.goal = {
      x: this.#head.x - randomX * (this.position.flip ? -1 : 1),
      y: this.#head.y - randomY,
    };
    this.counterFrameScared = 0;
  }

  handleFrame() {
    this.#setAction();
    this.#setGoal();
    this.#setPosition();
    this.#setFlip();
    this.#setAngle();
  }

  changeVisibility() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      colibriElement.style.opacity = "1";
      refColibri();
    } else {
      colibriElement.style.opacity = "0";
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
/** ***** **/

/** Init **/
const colibriElement = document.getElementById("colibri");
colibriElement.style.width = `${COLIBRI_SIZE}px`;
colibriElement.style.height = `${COLIBRI_SIZE}px`;
colibriElement.style.position = "absolute";
colibriElement.style.zIndex = "999";
colibriElement.style.opacity = "0";
colibriElement.style.transition = "opacity 1s ease-in-out";
const mousePosition = {
  x: 0,
  y: 0,
  fixedX: 0,
  fixedY: 0,
  lastMove: null,
};
export const colibri = new Colibri();
/** **** **/

/** EventListener **/
document.addEventListener("scroll", () => {
  mousePosition.x = mousePosition.fixedX + window.scrollX;
  mousePosition.y = mousePosition.fixedY + window.scrollY;
  mousePosition.lastMove = Date.now();
});
document.addEventListener("mousemove", (e) => {
  mousePosition.fixedX = e.clientX;
  mousePosition.fixedY = e.clientY;
  mousePosition.x = mousePosition.fixedX + window.scrollX;
  mousePosition.y = mousePosition.fixedY + window.scrollY;
  mousePosition.lastMove = Date.now();
});
document.addEventListener("mousedown", () => {
  colibri.handleMouseDown();
  mousePosition.lastMove = Date.now();
});
/** ************* **/

/** RequestAnimationFrame **/
export const refColibri = () => {
  colibri.handleFrame();
  colibri.animationFrame = requestAnimationFrame(refColibri);
};
/** ********************* **/
