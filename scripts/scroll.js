let scrollTimeout;
let userScrolling = false;
let isAnimating = false;
let animationFrameId;

function getClosestSection() {
  const sections = document.getElementsByClassName("section");

  let closest = null;
  let minDistance = Infinity;
  const scrollPosition = window.scrollY;

  for (let section of sections) {
    const offset = section.offsetTop;
    const distance = Math.abs(scrollPosition - offset);
    if (distance < minDistance) {
      minDistance = distance;
      closest = section;
    }
  }
  return closest;
}

function smoothScrollTo(targetY) {
  isAnimating = true;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animationStep(currentTime) {
    if (!isAnimating) return;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / 1000, 1);
    const easedProgress = 1 - (1 - progress) * (1 - progress);
    userScrolling = false;
    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) requestAnimationFrame(animationStep);
    else isAnimating = false;
  }

  requestAnimationFrame(animationStep);
}

function snapToClosestSection() {
  const closestSection = getClosestSection();
  if (closestSection) {
    smoothScrollTo(closestSection.offsetTop);
  }
}

function userIsScrolling() {
  userScrolling = true;
}
window.addEventListener("wheel", userIsScrolling);
window.addEventListener("touchmove", userIsScrolling);

window.addEventListener("scroll", (e) => {
  clearTimeout(scrollTimeout);
  if (userScrolling && isAnimating) {
    isAnimating = false;
    cancelAnimationFrame(animationFrameId);
  }
  scrollTimeout = setTimeout(snapToClosestSection, 1000);
});
snapToClosestSection();
