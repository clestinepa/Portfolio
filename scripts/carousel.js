/** NEXT STEPS
 * - handle when up mouse, go in a standard position with a smooth animation
 * - after this ↑, handle the power of the movement : if the mouse is fast, go in further standard position (and even do complete circle)
 * - handle that the click on a picture move the carousel to bring it in front
 * - add a slow infinite automatic rotation, stop it when the mouse hover a photo
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
  return Math.abs(parseInt((pos - 0.5) * 100)) - 25;
}
/**
 * Apply right style to the image depending of its position.
 * Modify z-index, filter, transform and offset-distance.
 * @param {Element} img the image that we apply style
 * @param {number} pos the position of the image, in 0 and 1
 */
function applyStyleWithoutAnimation(img, pos) {
  img.style.zIndex = getZIndex(pos);
  img.style.filter = `brightness(${getBrightness(pos)}%)`;
  img.style.transform = `scale(${getScale(pos)})`;
  img.style.offsetDistance = `${pos * 100}%`;
}
/**
 * Create and display all the image in the initial position
 */
function displayImgs() {
  const div = document.createElement("div");
  div.id = "carousel";

  //initial state of dataset
  div.dataset.mouseDownAt = "";
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

displayImgs();
const carousel = document.getElementById("carousel");
const listImgCarousel = document.getElementsByClassName("img-carousel");
imgProjects.onmousedown = (e) => {
  if (e.button == 0) carousel.dataset.mouseDownAt = getAngleOfMouse(e);
};
function finishMoving() {
  //if we didn't try to move the carousel, do nothing
  if (carousel.dataset.mouseDownAt == "") return;
  carousel.dataset.mouseDownAt = "";
  carousel.dataset.prevPosition = carousel.dataset.position;
}
imgProjects.addEventListener("mouseup", finishMoving);
imgProjects.addEventListener("mouseleave", finishMoving);
imgProjects.onmousemove = (e) => {
  //if we don't try to move the carousel, do nothing
  if (carousel.dataset.mouseDownAt == "") return;

  //we calculated next position of the carousel ie next position of the first image
  let angleDiff = carousel.dataset.mouseDownAt - getAngleOfMouse(e);
  let deltaPercentage = angleDiff / (2 * Math.PI);
  let nextPosUnconstrained = parseFloat(carousel.dataset.prevPosition) + deltaPercentage;
  let nextPosition = getConstrainedPos(nextPosUnconstrained);
  carousel.dataset.position = nextPosition;

  //we change style of each image depending of this next position
  for (let img of listImgCarousel) {
    let linearPosUnconstrained = nextPosition + (1 / NB_IMG) * getRankImg(img);
    let linearPos = getConstrainedPos(linearPosUnconstrained);
    let nextPos = getRealPos(linearPos);
    applyStyleWithoutAnimation(img, nextPos);
  }
};

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
