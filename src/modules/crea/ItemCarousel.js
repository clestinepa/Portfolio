import { CarouselClass } from "./CarouselClass.js";
import {
  CAROUSEL,
  getAnimateKeyFrames,
  getAnimateOptions,
  getBlur,
  getClosestIndexStandardPos,
  getOpacity,
  getScale,
  getZIndex,
} from "./utilsCarousel.js";

export class ItemCarousel {
  /** @type {CarouselClass} */
  carousel;
  /** @type {number} */
  id;
  /** @type {HTMLImageElement} */
  element = document.createElement("img");

  /** @type {number} */
  blur;
  /** @type {number} */
  opacity;
  /** @type {number} */
  scale;
  /** @type {number} */
  zIndex;
  /** @type {number} */
  position;

  /** @type {Date | undefined} */
  downDate;

  /**
   * @param {number} id
   * @param {CarouselClass} carousel
   */
  constructor(id, carousel) {
    this.id = id;
    this.carousel = carousel;

    const item = CarouselClass.DATA[this.id - 1];
    this.element.src = `public/img/${item.img ?? "profile.jpg"}`;
    this.element.className = "img-carousel";
    this.element.id = `img-carousel-${item.id}`;
    this.element.draggable = false;

    const initialPos = CAROUSEL.STANDARD_POS[this.id - 1];
    this.changeTo(initialPos);

    this.carousel.element.appendChild(this.element);

    this.element.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.element.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  removeAllAnimations() {
    this.element.getAnimations().forEach((anim) => {
      anim.commitStyles();
      anim.cancel();
    });
  }

  /**
   * Apply right style depending of its position.
   * Modify z-index, filter, transform and offset-distance.
   * @param {number} nextPos the next position of the image, in 0 and 1
   */
  changeTo(nextPos) {
    this.blur = getBlur(nextPos);
    this.opacity = getOpacity(nextPos);
    this.scale = getScale(nextPos);
    this.zIndex = getZIndex(nextPos);
    this.position = nextPos;
    this.element.style.filter = `blur(${this.blur}px)`;
    this.element.style.opacity = `${this.opacity}`;
    this.element.style.transform = `scale(${this.scale})`;
    this.element.style.zIndex = this.zIndex;
    this.element.style.offsetDistance = `${this.position * 100}%`;
  }

  /**
   * Animate to the right style to the image depending of its next position.
   * Modify z-index, filter, transform and offset-distance.
   * @param {number} nextPos the next position of the image, in 0 and 1
   */
  animeTo(nextPos) {
    const isClockwiseRotation = this.carousel.isClockwiseRotation;

    const start = {
      blur: this.blur,
      opacity: this.opacity,
      scale: this.scale,
      zIndex: this.zIndex,
      pos: this.position,
    };
    const end = {
      blur: getBlur(nextPos),
      opacity: getOpacity(nextPos),
      scale: getScale(nextPos),
      zIndex: getZIndex(nextPos),
      pos: nextPos,
    };

    if ((nextPos < this.position && !isClockwiseRotation) || (nextPos > this.position && isClockwiseRotation)) {
      const sizeStep1 = isClockwiseRotation ? this.position : 1 - this.position;
      const sizeStep2 = isClockwiseRotation ? 1 - nextPos : nextPos;
      const posStep1 = isClockwiseRotation ? 0 : 1;

      const step1Duration = (sizeStep1 / (sizeStep1 + sizeStep2)) * CAROUSEL.ANIMATION.DURATION;
      const step2Duration = CAROUSEL.ANIMATION.DURATION - step1Duration;

      // 1. Animate to 0% or 100%
      const step1 = {
        blur: getBlur(posStep1),
        opacity: getOpacity(posStep1),
        scale: getScale(posStep1),
        zIndex: getZIndex(posStep1),
        pos: posStep1,
      };
      this.element.animate(getAnimateKeyFrames(start, step1), getAnimateOptions(step1Duration)).onfinish = () => {
        // 2. Cross 0% or 100% without visual change
        let posAfterCrossing = isClockwiseRotation ? 1 : 0;
        const afterCrossing = {
          blur: getBlur(posAfterCrossing),
          opacity: getOpacity(posAfterCrossing),
          scale: getScale(posAfterCrossing),
          zIndex: getZIndex(posAfterCrossing),
          pos: posAfterCrossing,
        };
        // 3. Animate from 0% or 100% to real position
        this.element.animate(getAnimateKeyFrames(afterCrossing, end), getAnimateOptions(step2Duration)).onfinish =
          this.removeAllAnimations.bind(this);
      };
    } else {
      //usual animation
      this.element.animate(getAnimateKeyFrames(start, end), getAnimateOptions(CAROUSEL.ANIMATION.DURATION)).onfinish =
        this.removeAllAnimations.bind(this);
    }

    this.blur = end.blur;
    this.opacity = end.opacity;
    this.scale = end.scale;
    this.zIndex = end.zIndex;
    this.position = end.pos;
  }

  handleMouseDown() {
    this.downDate = new Date();
  }

  handleMouseUp() {
    //if there's no click or it's longer than 300ms or the image is still moving from previous animation, do nothing
    if (
      this.downDate == undefined ||
      new Date() - this.downDate > CAROUSEL.MAX_TIME_OF_PRESSURE ||
      this.element.getAnimations().length != 0
    ) {
      return;
    }

    this.carousel.isClicked = true;
    let deltaIndexStandardPos =
      this.position < 0.5
        ? getClosestIndexStandardPos(this.position) * -1
        : CarouselClass.DATA.length - getClosestIndexStandardPos(this.position);
    if (deltaIndexStandardPos != 0) this.carousel.moveToPos(deltaIndexStandardPos);
  }
}
