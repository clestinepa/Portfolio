import { ItemCarousel } from "./ItemCarousel.js";
import { scramble } from "./scramble.js";
import {
  CAROUSEL,
  getAngleOfMouse,
  getClosestIndexStandardPos,
  getConstrainedPos,
  getItemIdInFront,
  getNextClosestIndexStandardPos,
  getRealPos,
} from "./utilsCarousel.js";

export class CarouselClass {
  static container = document.getElementById("carousel-container");
  static DATA = [];

  /** @type {Element} */
  element;

  /** @type {number} */
  position = 0;
  /** @type {number} */
  prevPosition = 0;
  /** @type {ItemCarousel[]} */
  items = [];

  /** @type {number} */
  mouseDownAt = 0;
  /** @type {Boolean} */
  isClicked = false;
  /** @type {Boolean} */
  isClockwiseRotation = false;

  constructor() {
    this.element = document.createElement("div");
    this.element.id = "carousel";
    for (const item of CarouselClass.DATA) this.items.push(new ItemCarousel(item.id, this));

    CarouselClass.container.appendChild(this.element);

    CarouselClass.container.addEventListener("mousedown", this.handleMouseDown.bind(this));
    CarouselClass.container.addEventListener("mousemove", this.handleMouseMove.bind(this));
    CarouselClass.container.addEventListener("mouseup", this.handleMouseUpOrLeaving.bind(this));
    CarouselClass.container.addEventListener("mouseleave", this.handleMouseUpOrLeaving.bind(this));

    scramble(CarouselClass.DATA[0]);
  }

  /**
   * Apply the right value of isClockwiseRotation depending of the difference
   * between nextPos and the current position
   * @param {number} nextPos the position of the carousel, in 0 and 1
   */
  setIsClockwiseRotation(nextPos) {
    let diffAngleBetweenCurrentAndNext = nextPos - this.position;
    //keep previous isClockwiseRotation
    if (diffAngleBetweenCurrentAndNext == 0) null;
    //handle crossing 0
    else if (diffAngleBetweenCurrentAndNext > 0.5) this.isClockwiseRotation = true;
    //handle crossing 1
    else if (diffAngleBetweenCurrentAndNext < -0.5) this.isClockwiseRotation = false;
    //usual movement
    else this.isClockwiseRotation = diffAngleBetweenCurrentAndNext > 0 ? false : true;
  }

  /**
   * Add an animation to move the carousel up to the next position
   * @param {number} deltaIndex the delta to add to the current index position in STANDARD_POS
   */
  moveToPos(deltaIndex) {
    this.isClockwiseRotation = deltaIndex < 0;

    //we animate style of each item depending of their next position
    for (let item of this.items) {
      const indexOfNextPos =
        (CarouselClass.DATA.length + getClosestIndexStandardPos(item.position) + deltaIndex) %
        CarouselClass.DATA.length;
      const nextPos = CAROUSEL.STANDARD_POS[indexOfNextPos];
      item.animeTo(nextPos);
      //we apply the next position of the carousel ie next position of the first image
      if (item.id - 1 == 0) this.position = nextPos;
    }
  }

  /**
   * Apply all the right style to move the carousel up to the next position
   * @param {number} delta the delta to add to the current position
   */
  applyPos(delta) {
    //we calculate next position of the carousel
    let nextPosCarousel = getConstrainedPos(this.prevPosition + delta);

    //we change style of each image depending of their next position
    for (let item of this.items) {
      let nextLinearPosUnconstrained = nextPosCarousel + (1 / CarouselClass.DATA.length) * (item.id - 1);
      let nextLinearPos = getConstrainedPos(nextLinearPosUnconstrained);
      let nextPos = getRealPos(nextLinearPos);
      item.changeTo(nextPos);
      if (item.id - 1 == 0) {
        //we define the direction of the rotation
        this.setIsClockwiseRotation(nextPos);
        //we apply the next position of the carousel ie next position of the first image
        this.position = nextPos;
      }
    }
  }

  /**
   * Save the start of the movement
   * @param {MouseEvent} ev the event of the mouse
   */
  handleMouseDown(ev) {
    //Move the carousel only with left click and when no animation are running
    if (ev.button == 0 && this.items[0].element.getAnimations().length == 0) this.mouseDownAt = getAngleOfMouse(ev);
  }

  /**
   * Move to a standard pos and save change
   */
  handleMouseUpOrLeaving() {
    //if we don't try to move the carousel, do nothing
    if (this.mouseDownAt === 0) return;

    //move carousel to a standard position if it isn't a click
    if (!this.isClicked) {
      let standardNextIndex = getNextClosestIndexStandardPos(this.position, this.isClockwiseRotation);
      if (CAROUSEL.STANDARD_POS[standardNextIndex] != this.position) {
        for (let item of this.items) {
          const index = (item.id - 1 + standardNextIndex) % CarouselClass.DATA.length;
          const nextPos = CAROUSEL.STANDARD_POS[index];
          item.animeTo(nextPos);
          if (item.id - 1 == 0) this.position = nextPos;
        }
      }
    }
    this.isClicked = false;
    this.mouseDownAt = 0;
    if (this.position !== this.prevPosition) scramble(CarouselClass.DATA[getItemIdInFront(this.position) - 1]);
    this.prevPosition = this.position;
  }

  /**
   * Apply position depending of the movement of the mouse
   * @param {MouseEvent} ev the event of the mouse
   */
  handleMouseMove(ev) {
    //if we don't try to move the carousel, do nothing
    if (this.mouseDownAt === 0) return;

    //we calculate the delta to add to the current position of the carousel
    let angleDiff = this.mouseDownAt - getAngleOfMouse(ev);
    let deltaPercentage = angleDiff / (2 * Math.PI);
    this.applyPos(deltaPercentage);
  }
}
