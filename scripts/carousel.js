/** NEXT STEPS
 * - handle if click on the upper half or the lower half to determine the direction of rotation
 * - fix if it's possible the fact that the pictures goes straight to there aim without following the ellipsis (visible when mouse move fast)
 * - if ↑ it's fixed, handle that the click on a picture move the carousel to bring it in front
 * - add a slow infinite automatic rotation, stop it when the mouse hover a photo
 */

const imgProjects = document.getElementById("imgProjects");

// each image is placed based on au %.
// 0 and 1 is equivalent and correspond to the front.
// 0.25, 0.5 and 0.75 correspond to the right, back and left
// for esthetics, NB_IMG and standard position are defined
const NB_IMG = 9;
const standardPosImgs = [0, 0.135, 0.25, 0.35, 0.455, 0.545, 0.65, 0.75, 0.865, 1];
// const standardPosImgs = [0, 0.1111, 0.2222, 0.3333, 0.4444, 0.5555, 0.6666, 0.7777, 0.8888, 1];

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
/**
 * Get coordinates of an image depending of its position (ie its percentage).
 * Coordinates are in an ellipsis.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {{x: number; y: number}} the associated coordinates
 */
function getCoordinates(pos) {
  const angle = Math.PI / 2 - pos * 2 * Math.PI;
  return { x: 50 + 50 * Math.cos(angle), y: 50 + 50 * Math.sin(angle) };
}
/**
 * Get brightness of an image depending of its position (ie its percentage).
 * 100 for 0%, 20 for 50%, 100 for 100% with easeInOut interpolation.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {number} the associated brightness
 */
function getBrightness(pos) {
  const max = 100;
  const min = 20;
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
  const max = 1;
  const min = 0.4;
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
 * Create and display all the image in the initial position
 */
function displayImgs() {
  const div = document.createElement("div");
  div.id = "carousel";

  //initial state of dataset
  div.dataset.mouseDownAt = "0";
  div.dataset.prevPosition = "0";

  for (let i = 1; i < NB_IMG + 1; i++) {
    // if (i != 9) continue;
    const img = document.createElement("img");
    img.src = `static/img/${i}.jpg`;
    img.className = "img-carousel";
    img.id = `img-carousel-${i}`;

    //initial style
    // const coordinates = getCoordinates(standardPosImgs[i - 1]);
    const pos = standardPosImgs[i - 1];
    // img.style = `left: ${coordinates.x}%; top: ${coordinates.y}%; filter: brightness(${getBrightness(
    img.style = `offset-distance: ${pos * 100}%; filter: brightness(${getBrightness(
      pos
    )}%); transform: scale(${getScale(pos)}) rotate(0); z-index: ${getZIndex(pos)}`;
    // img.style = `offset-distance: ${pos * 100}%; filter: brightness(${getBrightness(
    //   pos
    // )}%); transform: translate(-50%, -50%) scale(${getScale(pos)}); z-index: ${getZIndex(pos)}`;
    img.draggable = false;
    img.dataset.position = `${pos}`;
    img.dataset.isCrossing = false;

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
 * Get the  index of the closest value in the standard position without going backwards
 * @param {number} pos the position of the image, in 0 and 1
 * @param {boolean} isClockwiseRotation the direction of rotation
 * @returns {number} the index of the closest value in standard position
 */
function getClosestIndexStandardPos(pos, isClockwiseRotation) {
  let closestIndex = standardPosImgs.reduce(
    (closestIdx, current, idx) =>
      Math.abs(current - pos) < Math.abs(standardPosImgs[closestIdx] - pos) ? idx : closestIdx,
    0
  );

  if (isClockwiseRotation && pos < standardPosImgs[closestIndex]) {
    //closestIndex is always != 0 here because 0 <= pos <= 1 and standardPosImgs[0] = 0, no need to check
    closestIndex--;
  } else if (!isClockwiseRotation && standardPosImgs[closestIndex] < pos) {
    //closestIndex is always != standardPosImgs.length - 1 here because 0 <= pos <= 1 and standardPosImgs[standardPosImgs.length - 1] = 1, no need to check
    closestIndex++;
  }

  // if the index is the last one, return 0 (because 1 is the same as 0)
  // return closestIndex === standardPosImgs.length - 1 ? 0 : closestIndex;
  return closestIndex;
}
/**
 * Get property to animate depending of the image position and according to defined
 * style for a defined duration.
 * @param {number} pos the position of the image, in 0 and 1
 * @returns {PropertyIndexedKeyframes} the property of the image to animate
 */
function getPropertyToAnimate(pos) {
  return {
    filter: `brightness(${getBrightness(pos)}%)`,
    transform: `scale(${getScale(pos)})`,
    offsetDistance: `${pos * 100}%`,
  };
}
/**
 * Get static rank of the image (the initial first image is always rank 0)
 * @param {Element} img the image
 * @returns {number} the static rank of the image
 */
function getRankImg(img) {
  return parseInt(img.id.replace("img-carousel-", "")) - 1;
}

displayImgs();
const carousel = document.getElementById("carousel");
const listImgCarousel = document.getElementsByClassName("img-carousel");
imgProjects.onmousedown = (e) => {
  carousel.dataset.mouseDownAt = e.clientX;
};
imgProjects.onmouseup = () => {
  carousel.dataset.mouseDownAt = "0";
  //when up, images have to be in a standard position
  // let closestStandardIndex = getClosestIndexStandardPos(
  //   carousel.dataset.position,
  //   carousel.dataset.isClockwiseRotation == "true"
  // );

  // for (let img of listImgCarousel) {
  //   const index = (getRankImg(img) + closestStandardIndex) % NB_IMG;
  //   const pos = standardPosImgs[index];
  //   img.style.zIndex = getZIndex(pos);
  //   img.animate(getPropertyToAnimate(pos), { duration: 1000, fill: "forwards", easing: "ease-in-out" });
  // }
  // carousel.dataset.position = standardPosImgs[closestStandardIndex];
  carousel.dataset.prevPosition = carousel.dataset.position;
};
imgProjects.onmousemove = (e) => {
  //if mouse up, do nothing
  if (carousel.dataset.mouseDownAt == "0") return;

  //we calculated next position of the carousel ie next position of the first image
  let mouseDelta = e.clientX - parseInt(carousel.dataset.mouseDownAt);
  let maxDelta = window.innerWidth;
  let position = mouseDelta / maxDelta;
  let nextPosUnconstrained = parseFloat(carousel.dataset.prevPosition) + position;
  let nextPosition = getConstrainedPos(nextPosUnconstrained);
  carousel.dataset.position = nextPosition;
  //define the direction of the rotation needed to go to this next position
  carousel.dataset.isClockwiseRotation = mouseDelta < 0;

  //we animate each image depending of this next position
  for (let img of listImgCarousel) {
    let linearPosUnconstrained = nextPosition + (1 / NB_IMG) * getRankImg(img);
    let linearPos = getConstrainedPos(linearPosUnconstrained);
    let nextPos = getRealPos(linearPos);
    img.style.zIndex = getZIndex(nextPos);
    img.style.filter = `brightness(${getBrightness(nextPos)}%)`;
    img.style.transform = `scale(${getScale(nextPos)})`;
    let duration = 0;
    // if (
    //   ((nextPos < img.dataset.position && carousel.dataset.isClockwiseRotation == "false") ||
    //     (nextPos > img.dataset.position && carousel.dataset.isClockwiseRotation == "true")) &&
    //   img.dataset.isCrossing == "false"
    // ) {
    //   //we need to force img to cross 0%

    //   let sizeStep1 = 1 - img.dataset.position;
    //   let sizeStep2 = nextPos;
    //   let sizeAllSteps = sizeStep1 + sizeStep2;
    //   let step1Duration = (sizeStep1 / sizeAllSteps) * duration;
    //   let step2Duration = (sizeStep2 / sizeAllSteps) * duration;

    //   // 1. Animate to 100%
    //   let toStep1 = carousel.dataset.isClockwiseRotation == "true" ? 0 : 1;
    //   img.dataset.isCrossing = true;

    //   img.animate(
    //     {
    //       offsetDistance: [`${img.dataset.position * 100}%`, `${toStep1 * 100}%`],
    //     },
    //     {
    //       duration: 0,
    //       fill: "forwards",
    //       easing: "linear",
    //     }
    //   ).onfinish = () => {
    //     if (img.dataset.isCrossing == "false") return;
    //     // 2. Cross 0% without visual change
    //     img.style.offsetDistance = carousel.dataset.isClockwiseRotation == "true" ? "0%" : "100%";
    //     // 3. Animate from 0% to real position
    //     img.dataset.isCrossing = false;
    //     img.animate(
    //       {
    //         offsetDistance: [`${toStep1 * 100}%`, `${nextPos * 100}%`],
    //       },
    //       { duration: 0, fill: "forwards", easing: "linear" }
    //     );
    //   };
    // } else {
    //usual animation
    console.log("usual");
    // img.dataset.isCrossing = "false";
    img.animate(
      {
        offsetDistance: `${nextPos * 100}%`,
        // offsetDistance: [`${img.dataset.position * 100}%`, `${nextPos * 100}%`],
      },
      { duration: 0, fill: "forwards", easing: "linear" }
    );
    // }
    // }
    img.dataset.position = nextPos;
  }
};

function updateOffsetPath() {
  const x = carousel.clientWidth;
  const y = carousel.clientHeight;
  carousel.style.setProperty(
    "--path",
    `path("M ${x * 0.5} ${y} A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} 0 A ${x * 0.5} ${y * 0.5} 0 1 0 ${x * 0.5} ${y}")`
  );
}
window.addEventListener("resize", updateOffsetPath);
updateOffsetPath();
