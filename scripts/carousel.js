/** NEXT STEPS
 * - fix when first move during mousedown, the carousel move more than needed
 *   (because of getRealPos... but if real only for other than first, first isn't placed right)
 * - handle the power of the movement : if the mouse is fast, go in further standard position (and even do complete circle)
 * - add a slow infinite automatic rotation, stop it when the mouse hover a photo
 * - maybe when the animation is running but mouse down, save the fact that we try to move and when the animation is done, if mouse still down and moving, then apply usual change of mouse move
 */

/** Description of the logic :
 * Each image is placed based on a % along an ellipsis.
 * This ellipsis is recalculated at each resize of the window.
 * 0 and 1 is equivalent and correspond to the front.
 * 0.25, 0.5 and 0.75 correspond to the right, back and left.
 * For esthetics, NB_IMG and standard position are defined.
 */

/** Constants **/
const CAROUSEL = {
  NB_IMG: 9, //nb of images in the carousel
  STANDARD_POS: [0, 0.135, 0.25, 0.35, 0.455, 0.545, 0.65, 0.75, 0.865, 1], //standard positions of the image for esthetic
  //appearance
  BLUR: {
    MAX: 0, //(in px) blur for position 0% and 100%
    MIN: 2, //(in px) blur for position 50%
  },
  OPACITY: {
    MAX: 1, //opacity for position 0% and 100%
    MIN: 0.5, //opacity for position 50%
  },
  SCALE: {
    MAX: 1, //scale for position 0% and 100%
    MIN: 0.4, //scale for position 50%
  },
  Z_INDEX: {
    MAX: 50, //z-index for position 0% and 100%
    MIN: 0, //z-index for position 50%
  },
  //animation
  ANIMATION: {
    DURATION: 1000, //(in ms) duration of the animation carousel
  },
  MAX_TIME_OF_PRESSURE: 300, //(in ms) time maximum for the mouse to be down to be considered as a click when up
};
/** ********* **/

const carouselContainer = document.getElementById("carousel-container");

/**
 * Get the value for a position with an ease-in-out interpolation
 * from 0% to 50% and then from 50% to 100%.
 * @param {number} max the value expected for the position 0% and 100%
 * @param {number} min the value expected for the position 50%
 * @param {number} pos the position of the image
 * @returns the value associated to the position
 */
function specificEaseInOutInterpolation(max, min, pos) {
  let value;
  let t;
  if (pos <= 0.5) {
    t = pos / 0.5;
    const valueFactor = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    value = max - (max - min) * valueFactor;
  } else {
    t = (pos - 0.5) / 0.5;
    const valueFactor = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    value = min + (max - min) * valueFactor;
  }
  return value.toFixed(2);
}
/**
 * Get the value for a position with an linear interpolation
 * from 0% to 50% and then from 50% to 100%.
 * @param {number} max the value expected for the position 0% and 100%
 * @param {number} min the value expected for the position 50%
 * @param {number} pos the position of the image
 * @returns the value associated to the position
 */
function specificLinearInterpolation(max, min, pos) {
  return pos <= 0.5 ? max - ((max - min) * pos) / 0.5 : min + ((max - min) * (pos - 0.5)) / 0.5;
}

/**
 * Get blur of an image depending of its position (ie its percentage).
 * 0 for 0%, 10 for 50%, 0 for 100% with ease-in-out interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated blur
 */
function getBlur(pos) {
  return specificEaseInOutInterpolation(CAROUSEL.BLUR.MAX, CAROUSEL.BLUR.MIN, pos);
}

/**
 * Get opacity of an image depending of its position (ie its percentage).
 * 1 for 0%, 0.3 for 50%, 1 for 100% with ease-in-out interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated blur
 */
function getOpacity(pos) {
  return specificEaseInOutInterpolation(CAROUSEL.OPACITY.MAX, CAROUSEL.OPACITY.MIN, pos);
}

/**
 * Get scale of an image size depending of its position (ie its percentage).
 * 1 for 0%, 0.4 for 50%, 1 for 100% with linear interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated scale
 */
function getScale(pos) {
  return specificLinearInterpolation(CAROUSEL.SCALE.MAX, CAROUSEL.SCALE.MIN, pos);
}

/**
 * Get proper z-index of an image depending of its position (ie its percentage).
 * 50 for 0%, 0 for 50%, 50 for 100% with linear interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated z-index
 */
function getZIndex(pos) {
  return Math.floor(specificLinearInterpolation(CAROUSEL.Z_INDEX.MAX, CAROUSEL.Z_INDEX.MIN, pos));
}

/**
 * Get the angle between the center of the container and the mouse
 * @param {MouseEvent} e the event of the mouse
 * @returns the angle between the center of the container  and the mouse
 */
function getAngleOfMouse(e) {
  const rect = carouselContainer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const startX = e.clientX - centerX;
  const startY = e.clientY - centerY;
  return Math.atan2(startY, startX);
}

/**
 * Constrain the position in 0 and 1, circularly.
 * @param {number} pos the position of the image or the carousel, in 0 and 1
 * @returns {number} the constrained position
 */
function getConstrainedPos(pos) {
  return ((pos % 1) + 1) % 1;
}

/**
 * Because the standard position aren't linear, we need to remapping it to
 * ensure that the visual remains consistent with the established standard.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the real nonlinear remapped position
 */
function getRealPos(pos) {
  const sizeLinearInterval = 1 / CAROUSEL.NB_IMG;
  const ratio = pos / sizeLinearInterval;
  const x1 = ratio - (ratio % 1);
  const x2 = x1 + 1;
  return CAROUSEL.STANDARD_POS[x1] + (CAROUSEL.STANDARD_POS[x2] - CAROUSEL.STANDARD_POS[x1]) * (ratio % 1);
}

/**
 * Get static rank of the image (the initial first image is always rank 0)
 * @param {Element} img the image
 * @returns {number} the static rank of the image
 */
function getRankImg(img) {
  return parseInt(img.id.replace("img-carousel-", "")) - 1;
}

/**
 * Get the index of the closest value in the standard position
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the index of the closest value in standard position
 */
function getClosestIndexStandardPos(pos) {
  let closestIndex = CAROUSEL.STANDARD_POS.reduce(
    (closestIdx, current, idx) =>
      Math.abs(current - pos) < Math.abs(CAROUSEL.STANDARD_POS[closestIdx] - pos) ? idx : closestIdx,
    0
  );
  return closestIndex == CAROUSEL.STANDARD_POS.length - 1 ? 0 : closestIndex;
}

/**
 * Get the index of the closest value in the standard position without
 * going backwards, referring to isClockwiseRotation
 * @param {number} pos the position of the carousel, in 0 and 1
 * @returns the index of the next closest value in standard position depending of the rotation
 */
function getNextClosestIndexStandardPos(pos) {
  const isClockwiseRotation = carousel.dataset.isClockwiseRotation == "true";
  const closestIndex = getClosestIndexStandardPos(pos);
  let closestWithoutBackwards = closestIndex;
  //we change index to avoid going backwards
  if (isClockwiseRotation) {
    //closestIndex is always != 0 here because 0 <= pos <= 1 and STANDARD_POS[0] = 0, no need to check
    if (pos < CAROUSEL.STANDARD_POS[closestIndex]) closestWithoutBackwards--;
    if (closestIndex == 0) closestWithoutBackwards = CAROUSEL.STANDARD_POS.length - 2;
  } else {
    //closestIndex is always != STANDARD_POS.length - 1 here because 0 <= pos <= 1 and STANDARD_POS[STANDARD_POS.length - 1] = 1, no need to check
    if (CAROUSEL.STANDARD_POS[closestIndex] < pos) closestWithoutBackwards++;
  }

  return closestWithoutBackwards;
}

/**
 * Apply the right value of isClockwiseRotation depending of the difference
 * between nextPos and the current position
 * @param {number} nextPos the position of the carousel, in 0 and 1
 */
function applyIsClockwiseRotation(nextPos) {
  let diffAngleBetweenCurrentAndNext = nextPos - carousel.dataset.position;
  //keep previous isClockwiseRotation
  if (diffAngleBetweenCurrentAndNext == 0) null;
  //handle crossing 0
  else if (diffAngleBetweenCurrentAndNext > 0.5) carousel.dataset.isClockwiseRotation = "true";
  //handle crossing 1
  else if (diffAngleBetweenCurrentAndNext < -0.5) carousel.dataset.isClockwiseRotation = "false";
  //usual movement
  else carousel.dataset.isClockwiseRotation = diffAngleBetweenCurrentAndNext > 0 ? "false" : "true";
}

/**
 * Remove each animation style of the image to ensure that element style aren't ignored
 * @param {Element} img the image
 */
function removeAllAnimations(img) {
  img.getAnimations().forEach((anim) => {
    anim.commitStyles();
    anim.cancel();
  });
}

/**
 * Apply right style to the image depending of its position.
 * Modify z-index, filter, transform and offset-distance.
 * @param {Element} img the image that we apply style
 * @param {number} nextPos the next position of the image, in 0 and 1
 */
function applyStyleWithoutAnimation(img, nextPos) {
  img.style.zIndex = getZIndex(nextPos);
  img.style.filter = `blur(${getBlur(nextPos)}px)`;
  img.style.opacity = `${getOpacity(nextPos)}`;
  img.style.transform = `scale(${getScale(nextPos)})`;
  img.style.offsetDistance = `${nextPos * 100}%`;
  img.dataset.position = nextPos;
}

/**
 * Animate to the right style to the image depending of its position.
 * Modify z-index, filter, transform and offset-distance.
 * @param {Element} img the image that we apply style
 * @param {number} nextPos the next position of the image, in 0 and 1
 */
function applyStyleWithAnimation(img, nextPos) {
  const isClockwiseRotation = carousel.dataset.isClockwiseRotation == "true";
  if (
    (nextPos < img.dataset.position && !isClockwiseRotation) ||
    (nextPos > img.dataset.position && isClockwiseRotation)
  ) {
    let sizeStep1;
    let sizeStep2;
    let step1To;
    if (isClockwiseRotation) {
      sizeStep1 = parseFloat(img.dataset.position);
      sizeStep2 = 1 - nextPos;
      step1To = 0;
    } else {
      sizeStep1 = 1 - img.dataset.position;
      sizeStep2 = nextPos;
      step1To = 1;
    }
    let sizeAllSteps = sizeStep1 + sizeStep2;
    let step1Duration = (sizeStep1 / sizeAllSteps) * CAROUSEL.ANIMATION.DURATION;
    let step2Duration = (sizeStep2 / sizeAllSteps) * CAROUSEL.ANIMATION.DURATION;

    // 1. Animate to 0% or 100%
    img.animate(
      {
        zIndex: [`${getZIndex(img.dataset.position)}`, `${getZIndex(step1To)}`],
        filter: [`blur(${getBlur(img.dataset.position)}px)`, `blur(${getBlur(step1To)}px)`],
        opacity: [`${getOpacity(img.dataset.position)}`, `${getOpacity(step1To)}`],
        transform: [`scale(${getScale(img.dataset.position)})`, `scale(${getScale(step1To)})`],
        offsetDistance: [`${img.dataset.position * 100}%`, `${step1To * 100}%`],
      },
      { duration: step1Duration, fill: "forwards", easing: "linear" }
    ).onfinish = () => {
      // 2. Cross 0% or 100% without visual change
      let afterCrossing = isClockwiseRotation ? 1 : 0;
      // 3. Animate from 0% or 100% to real position
      img.animate(
        {
          zIndex: [`${getZIndex(afterCrossing)}`, `${getZIndex(nextPos)}`],
          filter: [`blur(${getBlur(afterCrossing)}px)`, `blur(${getBlur(nextPos)}px)`],
          opacity: [`${getOpacity(afterCrossing)}`, `${getOpacity(nextPos)}`],
          transform: [`scale(${getScale(afterCrossing)})`, `scale(${getScale(nextPos)})`],
          offsetDistance: [`${afterCrossing * 100}%`, `${nextPos * 100}%`],
        },
        { duration: step2Duration, fill: "forwards", easing: "linear" }
      ).onfinish = () => {
        removeAllAnimations(img);
      };
    };
  } else {
    //usual animation
    img.animate(
      {
        zIndex: [`${getZIndex(img.dataset.position)}`, `${getZIndex(nextPos)}`],
        filter: [`blur(${getBlur(img.dataset.position)}px)`, `blur(${getBlur(nextPos)}px)`],
        opacity: [`${getOpacity(img.dataset.position)}`, `${getOpacity(nextPos)}`],
        transform: [`scale(${getScale(img.dataset.position)})`, `scale(${getScale(nextPos)})`],
        offsetDistance: [`${img.dataset.position * 100}%`, `${nextPos * 100}%`],
      },
      { duration: CAROUSEL.ANIMATION.DURATION, fill: "forwards", easing: "linear" }
    ).onfinish = () => {
      removeAllAnimations(img);
    };
  }
  img.dataset.position = nextPos;
}

/**
 * Apply all the right style to move the carousel up to the next position
 * @param {number} delta the delta to add to the current position, is percentage without animation and index from STANDARD_POS with
 * @param {boolean} needAnimation the boolean that say if we animate or not
 */
function moveCarousel(delta, needAnimation) {
  if (!needAnimation) {
    //we calculate next position of the carousel
    let nextPosUnconstrainedCarousel = parseFloat(carousel.dataset.prevPosition) + delta;
    let nextPosCarousel = getConstrainedPos(nextPosUnconstrainedCarousel);

    //we change style of each image depending of their next position
    for (let img of listImgCarousel) {
      let nextLinearPosUnconstrained = nextPosCarousel + (1 / CAROUSEL.NB_IMG) * getRankImg(img);
      let nextLinearPos = getConstrainedPos(nextLinearPosUnconstrained);
      let nextPos = getRealPos(nextLinearPos);
      applyStyleWithoutAnimation(img, nextPos);
      if (getRankImg(img) == 0) {
        //we define the direction of the rotation
        applyIsClockwiseRotation(nextPos);
        //we apply the next position of the carousel ie next position of the first image
        carousel.dataset.position = nextPos;
      }
    }
  } else {
    carousel.dataset.isClockwiseRotation = delta < 0;
    //we animate style of each image depending of their next position
    for (let img of listImgCarousel) {
      const indexOfNextPos =
        (CAROUSEL.NB_IMG + getClosestIndexStandardPos(img.dataset.position) + delta) % CAROUSEL.NB_IMG;
      const nextPos = CAROUSEL.STANDARD_POS[indexOfNextPos];
      applyStyleWithAnimation(img, nextPos);
      //we apply the next position of the carousel ie next position of the first image
      if (getRankImg(img) == 0) carousel.dataset.position = nextPos;
    }
  }
}

/* Initialization of the carousel  */
function displayImgs() {
  const div = document.createElement("div");
  div.id = "carousel";
  div.dataset.mouseDownAt = "0";
  div.dataset.prevPosition = "0";

  for (let i = 1; i < CAROUSEL.NB_IMG + 1; i++) {
    // if (i != 1) continue;
    const img = document.createElement("img");
    img.src = `static/img/${i}.jpg`;
    img.className = "img-carousel";
    img.id = `img-carousel-${i}`;

    //initial style
    let pos = CAROUSEL.STANDARD_POS[i - 1];
    applyStyleWithoutAnimation(img, pos);
    img.dataset.position = pos;
    img.draggable = false;

    div.appendChild(img);
  }
  carouselContainer.appendChild(div);
}
displayImgs();
const carousel = document.getElementById("carousel");
const listImgCarousel = document.getElementsByClassName("img-carousel");
let isClicked = false;

/* Handle mouse movement in the carousel : move the images according to the mouse movement */
function handleStartMoving(e) {
  //Move the carousel only with left click and when no animation are running
  if (e.button == 0 && listImgCarousel[0].getAnimations().length == 0)
    carousel.dataset.mouseDownAt = getAngleOfMouse(e);
}
function finishMoving() {
  //if we don't try to move the carousel, do nothing
  if (carousel.dataset.mouseDownAt == "0") return;

  //move carousel to a standard position if it isn't a click
  if (!isClicked) {
    let standardNextIndex = getNextClosestIndexStandardPos(carousel.dataset.position);
    if (CAROUSEL.STANDARD_POS[standardNextIndex] != carousel.dataset.position) {
      for (let img of listImgCarousel) {
        const index = (getRankImg(img) + standardNextIndex) % CAROUSEL.NB_IMG;
        const nextPos = CAROUSEL.STANDARD_POS[index];
        applyStyleWithAnimation(img, nextPos);
        if (getRankImg(img) == 0) carousel.dataset.position = nextPos;
      }
    }
  }
  isClicked = false;
  carousel.dataset.mouseDownAt = "0";
  carousel.dataset.prevPosition = carousel.dataset.position;
}
function handleMoving(e) {
  //if we don't try to move the carousel, do nothing
  if (carousel.dataset.mouseDownAt == "0") return;

  //we calculate the delta to add to the current position of the carousel
  let angleDiff = carousel.dataset.mouseDownAt - getAngleOfMouse(e);
  let deltaPercentage = angleDiff / (2 * Math.PI);
  moveCarousel(deltaPercentage, false);
}

/* Handle click in an image : move this image in front with an animation */
function handleClickImgCarousel() {
  for (let img of listImgCarousel) {
    let downDate = undefined;
    img.addEventListener("mousedown", (e) => {
      downDate = new Date();
    });
    img.addEventListener("mouseup", (e) => {
      //if there's no click or it's longer than 300ms or the image is still moving from previous animation, do nothing
      if (downDate == undefined || new Date() - downDate > MAX_TIME_OF_PRESSURE || img.getAnimations().length != 0)
        return;
      isClicked = true;
      let deltaIndexStandardPos =
        img.dataset.position < 0.5
          ? getClosestIndexStandardPos(img.dataset.position) * -1
          : CAROUSEL.NB_IMG - getClosestIndexStandardPos(img.dataset.position);
      if (deltaIndexStandardPos != 0) moveCarousel(deltaIndexStandardPos, true);
    });
  }
}
/* Handle resize of the window : recalculate path of the images */
function updatePathCarousel() {
  let x = carousel.clientWidth;
  let y = carousel.clientHeight;
  carousel.style.setProperty(
    "--path",
    `path("M ${x * 0.5} ${y} A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} 0 A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} ${y}")`
  );
}

export function initCarousel() {
  carouselContainer.addEventListener("mousedown", handleStartMoving);
  carouselContainer.addEventListener("mousemove", handleMoving);
  carouselContainer.addEventListener("mouseup", finishMoving);
  carouselContainer.addEventListener("mouseleave", finishMoving);
  handleClickImgCarousel();
  window.addEventListener("resize", updatePathCarousel);
  updatePathCarousel();
}
