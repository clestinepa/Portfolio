/** NEXT STEPS
 * - recreate dodge effect
 * - determine randomScared based of the mousePosition: closer => jump higher
 * - make it disappear if not in about section
 * - add flower around text
 * - recreate goAway effect
 */

/** Params **/
const defaultColibriSize = 50; //(in px) size of the colibri
const marginMouse = 10; //(in px) margin x between mouse and colibri
const ratioHeadPosition = 3.5; //head position relative to the colibri top
const precisionGoalAchieved = 10; //(in px) distance between colibri and mouse needed to considered goal achieved

//scared params
const waitBack = 50; //frame before come back
const scaredJumpMax = 100; //(in px) distance max of a scared jump

//movement params
const t_interpolation = {
  follow: 0.1,
  dodge: 0.25,
  goAway: 0.05,
  scared: 0.25,
};
/** ****** **/

/** Init **/
const colibriElement = document.getElementById("colibri");
colibriElement.style.width = `${defaultColibriSize}px`;
colibriElement.style.height = `${defaultColibriSize}px`;
colibriElement.style.position = "fixed";
colibriElement.style.zIndex = "999";
const mousePosition = {
  x: 0,
  y: 0,
  lastMove: null,
};
/** **** **/

class Colibri {
  size = defaultColibriSize;

  constructor() {
    this.goal = { x: null, y: null };
    this.action = "follow";
    this.position = {
      flip: false,
      x: 0,
      y: 0,
      angle: 0,
    };
    this.counterBeforeBack = 0;
  }

  get #t() {
    switch (this.action) {
      case "goAway":
        return t_interpolation.goAway;
      case "dodge":
        return t_interpolation.dodge;
      case "scared":
        return t_interpolation.scared;
      case "follow":
      default:
        return t_interpolation.follow;
    }
  }

  get #deltaYHead() {
    return this.size / ratioHeadPosition;
  }

  get center() {
    return { x: this.position.x + this.size / 2, y: this.position.y + this.size / 2 };
  }

  get head() {
    return { x: this.position.x + this.size / 2, y: this.position.y + this.#deltaYHead };
  }

  /** do the distance head-goal is close enough ? */
  get #isGoalAchieved() {
    //precisionGoalAchieved is necessary because the interpolation makes
    //the movement very slow near the goal
    return this.getDistanceTo(this.goal) < this.size / 2 + marginMouse + precisionGoalAchieved;
  }

  get focus() {
    return mousePosition;
  }

  #setFlip() {
    this.position.flip = this.center.x > this.focus.x;
  }

  #setAngle() {
    this.position.angle = Math.atan2(this.focus.y - this.head.y, this.focus.x - this.head.x);
  }

  /**marginMouse or -marginMouse depending of the flip*/
  get #mouseGap() {
    return marginMouse * (this.position.flip ? -1 : 1);
  }

  getDistanceTo(pos) {
    return Math.sqrt(Math.pow(pos.x - this.head.x, 2) + Math.pow(pos.y - this.head.y, 2));
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
    if (this.getDistanceTo(mousePosition) < this.size / 2) this.action = "dodge";
    else if (this.#isGoalAchieved) {
      switch (this.action) {
        case "dodge":
          this.action = "follow";
          break;
        case "scared":
          this.counterBeforeBack++;
          if (this.counterBeforeBack >= waitBack) this.action = "follow";
          break;
        case "follow":
          this.counterBeforeBack = 0;
      }
    }
  }

  get #estheticGoal() {
    //because we want the head of the colibri to be in the same x than the goal
    //and we don't want to be to close from the cursor
    return {
      x: this.goal.x - this.size * (this.position.flip ? 0 : 1) - this.#mouseGap,
      y: this.goal.y - this.#deltaYHead,
    };
  }

  #setPosition() {
    //we are in "back" situation => exponential interpolation
    if (this.action == "follow" && this.counterBeforeBack != 0) {
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
  }

  handleMouseDown() {
    this.action = "scared";
    const randomY = Math.floor(Math.random() * scaredJumpMax);
    const randomX = Math.floor(Math.random() * scaredJumpMax) + this.size;
    this.goal = {
      x: this.head.x - randomX * (this.position.flip ? -1 : 1),
      y: this.head.y - randomY,
    };
    this.counterBeforeBack = 0;
  }

  handleFrame() {
    this.#setAction();
    this.#setGoal();
    this.#setPosition();
    this.#setFlip();
    this.#setAngle();
  }
}
let colibri = new Colibri();

/** EventListener **/
document.addEventListener("mousemove", (e) => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
  mousePosition.lastMove = Date.now();
});
document.addEventListener("mousedown", () => {
  colibri.handleMouseDown();
  mousePosition.lastMove = Date.now();
});
/** ************* **/

/** RequestAnimationFrame **/
const refColibri = () => {
  colibri.handleFrame();

  colibriElement.dataset.action = colibri.action;
  colibriElement.style.top = `${colibri.position.y}px`;
  colibriElement.style.left = `${colibri.position.x}px`;
  colibriElement.style.transform = `rotate(${colibri.position.angle}rad) scaleY(${colibri.position.flip ? "-1" : "1"})`;

  requestAnimationFrame(refColibri);
};

refColibri();
/** ********************* **/
