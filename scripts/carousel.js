/** NEXT STEPS
 * - handle when up mouse, go in a standard position with a smooth animation
 * - after this ↑, handle the power of the movement : if the mouse is fast, go in further standard position (and even do complete circle)
 * - add a slow infinite automatic rotation, stop it when the mouse hover a photo
 * - maybe when the animation is running but mouse down, save the fact that we try to move and when the animation is done, if mouse still down and moving, then apply usual change of mouse move
 */

const imgProjects = document.getElementById("imgProjects");

// each image is placed based on au %.
// 0 and 1 is equivalent and correspond to the front.
// 0.25, 0.5 and 0.75 correspond to the right, back and left
// for esthetics, NB_IMG and standard position are defined
const NB_IMG = 9;
const standardPosImgs = [0, 0.135, 0.25, 0.35, 0.455, 0.545, 0.65, 0.75, 0.865, 1];

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
/**
 * Get brightness of an image depending of its position (ie its percentage).
 * 100 for 0%, 20 for 50%, 100 for 100% with easeInOut interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated brightness
 */
function getBrightness(pos) {
  let max = 100;
  let min = 20;
  let opacity;
  if (pos <= 0.5) {
    const opacityFactor = easeInOutQuad(pos / 0.5);
    opacity = max - (max - min) * opacityFactor;
  } else {
    const opacityFactor = easeInOutQuad((pos - 0.5) / 0.5);
    opacity = min + (max - min) * opacityFactor;
  }
  return opacity.toFixed(2);
}
/**
 * Get scale of an image size depending of its position (ie its percentage).
 * 1 for 0%, 0.4 for 50%, 1 for 100% with linear interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated scale
 */
function getScale(pos) {
  let max = 1;
  let min = 0.4;
  return pos <= 0.5 ? max - ((max - min) * pos) / 0.5 : min + ((max - min) * (pos - 0.5)) / 0.5;
}
/**
 * Get proper z-index of an image depending of its position (ie its percentage).
 * when on the back (ie around pos = 0.5) z-index has to be lesser than on the front (ie around pos = 0 or 1)
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated z-index
 */
function getZIndex(pos) {
  return Math.abs(parseInt((pos - 0.5) * 100));
}
/**
 * Apply right style to the image depending of its position.
 * Modify z-index, filter, transform and offset-distance.
 * @param {Element} img the image that we apply style
 * @param {number} nextPos the next position of the image, in 0 and 1
 */
function applyStyleWithoutAnimation(img, nextPos) {
  img.style.zIndex = getZIndex(nextPos);
  img.style.filter = `brightness(${getBrightness(nextPos)}%)`;
  img.style.transform = `scale(${getScale(nextPos)})`;
  img.style.offsetDistance = `${nextPos * 100}%`;
  img.dataset.position = nextPos;
}
/**
 * Create and display all the image in the initial position
 */
function displayImgs() {
  const div = document.createElement("div");
  div.id = "carousel";

  //initial state of dataset
  div.dataset.mouseDownAt = "0";
  div.dataset.prevPosition = "0";

  for (let i = 1; i < NB_IMG + 1; i++) {
    // if (i != 1) continue;
    const img = document.createElement("img");
    img.src = `static/img/${i}.jpg`;
    img.className = "img-carousel";
    img.id = `img-carousel-${i}`;

    //initial style
    let pos = standardPosImgs[i - 1];
    applyStyleWithoutAnimation(img, pos);
    img.dataset.position = pos;
    img.draggable = false;

    div.appendChild(img);
  }
  imgProjects.appendChild(div);
}

/**
 * Constrain the position in 0 and 1, circularly.
 * @param {number} pos the position of the image, in 0 and 1
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
  const sizeLinearInterval = 1 / NB_IMG;
  const ratio = pos / sizeLinearInterval;
  const x1 = ratio - (ratio % 1);
  const x2 = x1 + 1;
  return standardPosImgs[x1] + (standardPosImgs[x2] - standardPosImgs[x1]) * (ratio % 1);
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
 * Get the angle between the center of imgProjects and the mouse
 * @param {MouseEvent} e the event of the mouse
 * @returns the angle between the center of imgProjects and the mouse
 */
function getAngleOfMouse(e) {
  const rect = imgProjects.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const startX = e.clientX - centerX;
  const startY = e.clientY - centerY;
  return Math.atan2(startY, startX);
}
/**
 * Get the  index of the closest value in the standard position
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the index of the closest value in standard position
 */
function getClosestIndexStandardPos(pos) {
  let closestIndex = standardPosImgs.reduce(
    (closestIdx, current, idx) =>
      Math.abs(current - pos) < Math.abs(standardPosImgs[closestIdx] - pos) ? idx : closestIdx,
    0
  );
  return closestIndex == standardPosImgs.length - 1 ? 0 : closestIndex;
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
 * Animate to the right style to the image depending of its position.
 * Modify z-index, filter, transform and offset-distance.
 * @param {Element} img the image that we apply style
 * @param {number} nextPos the next position of the image, in 0 and 1
 * @param {boolean} isClockwiseRotation the rotation of the animation
 */
function applyStyleWithAnimation(img, nextPos, isClockwiseRotation) {
  let duration = 1000;
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
    //we need to force img to cross 0%
    let sizeAllSteps = sizeStep1 + sizeStep2;
    let step1Duration = (sizeStep1 / sizeAllSteps) * duration;
    let step2Duration = (sizeStep2 / sizeAllSteps) * duration;

    // 1. Animate to 0% or 100%
    img.animate(
      {
        zIndex: [`${getZIndex(img.dataset.position)}`, `${getZIndex(step1To)}`],
        filter: [`brightness(${getBrightness(img.dataset.position)}%)`, `brightness(${getBrightness(step1To)}%)`],
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
          filter: [`brightness(${getBrightness(afterCrossing)}%)`, `brightness(${getBrightness(nextPos)}%)`],
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
        filter: [`brightness(${getBrightness(img.dataset.position)}%)`, `brightness(${getBrightness(nextPos)}%)`],
        transform: [`scale(${getScale(img.dataset.position)})`, `scale(${getScale(nextPos)})`],
        offsetDistance: [`${img.dataset.position * 100}%`, `${nextPos * 100}%`],
      },
      { duration: duration, fill: "forwards", easing: "linear" }
    ).onfinish = () => {
      removeAllAnimations(img);
    };
  }
  img.dataset.position = nextPos;
}

/**
 * Apply all the right style to move the carousel up to the next position
 * @param {number} delta the delta to add to the current position, is percentage without animation and index from standardPosImgs with
 * @param {boolean} needAnimation the boolean that say if we animate or not
 */
function moveCarousel(delta, needAnimation) {
  if (!needAnimation) {
    //we calculate next position of the carousel ie next position of the first image
    let nextPosUnconstrainedCarousel = parseFloat(carousel.dataset.prevPosition) + delta;
    let nextPosCarousel = getConstrainedPos(nextPosUnconstrainedCarousel);
    carousel.dataset.position = nextPosCarousel;

    //we change style of each image depending of their next position
    for (let img of listImgCarousel) {
      let nextLinearPosUnconstrained = nextPosCarousel + (1 / NB_IMG) * getRankImg(img);
      let nextLinearPos = getConstrainedPos(nextLinearPosUnconstrained);
      let nextPos = getRealPos(nextLinearPos);
      applyStyleWithoutAnimation(img, nextPos);
    }
  } else {
    //we animate style of each image depending of their next position
    for (let img of listImgCarousel) {
      const indexOfNextPos = (NB_IMG + getClosestIndexStandardPos(img.dataset.position) + delta) % NB_IMG;
      const nextPos = standardPosImgs[indexOfNextPos];
      applyStyleWithAnimation(img, nextPos, delta < 0);
      //we apply the next position of the carousel ie next position of the first image
      if (getRankImg(img) == 0) carousel.dataset.position = nextPos;
    }
  }
}

displayImgs();
const carousel = document.getElementById("carousel");
const listImgCarousel = document.getElementsByClassName("img-carousel");
imgProjects.onmousedown = (e) => {
  //Move the carousel only with left click and when no animation are running
  if (e.button == 0 && listImgCarousel[0].getAnimations().length == 0)
    carousel.dataset.mouseDownAt = getAngleOfMouse(e);
};
function finishMoving() {
  //if we don't try to move the carousel, do nothing
  if (carousel.dataset.mouseDownAt == "0") return;
  carousel.dataset.mouseDownAt = "0";
  carousel.dataset.prevPosition = carousel.dataset.position;
}
imgProjects.addEventListener("mouseup", finishMoving);
imgProjects.addEventListener("mouseleave", finishMoving);
imgProjects.onmousemove = (e) => {
  //if we don't try to move the carousel, do nothing
  if (carousel.dataset.mouseDownAt == "0") return;

  //we calculate the delta to add to the current position of the carousel
  let angleDiff = carousel.dataset.mouseDownAt - getAngleOfMouse(e);
  let deltaPercentage = angleDiff / (2 * Math.PI);
  moveCarousel(deltaPercentage, false);
};

for (let img of listImgCarousel) {
  let downDate = undefined;
  img.addEventListener("mousedown", (e) => {
    downDate = new Date();
  });
  img.addEventListener("mouseup", (e) => {
    //if there's no click or it's longer than 300ms or the image is still moving from previous animation, do nothing
    if (downDate == undefined || new Date() - downDate > 300 || img.getAnimations().length != 0) return;
    let deltaIndexStandardPos =
      img.dataset.position < 0.5
        ? getClosestIndexStandardPos(img.dataset.position) * -1
        : NB_IMG - getClosestIndexStandardPos(img.dataset.position);
    moveCarousel(deltaIndexStandardPos, true);
  });
}

function updateOffsetPath() {
  let x = carousel.clientWidth;
  let y = carousel.clientHeight;
  carousel.style.setProperty(
    "--path",
    `path("M ${x * 0.5} ${y} A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} 0 A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} ${y}")`
  );
}
window.addEventListener("resize", updateOffsetPath);
updateOffsetPath();
