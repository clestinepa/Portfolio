const bgContainer = document.getElementById("background");
const NB_BALLS_BG = 8;

function getRandom(min, max) {
  return Math.random() * (max - min + 1) + min;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function vminToPx(vminValue) {
  const vmin = Math.min(window.innerWidth, window.innerHeight);
  return (vminValue / 100) * vmin;
}
function generateRandomEllipsePath(offsetX) {
  const centerX = Math.random() * bgContainer.clientWidth - offsetX;
  const centerY = Math.random() * bgContainer.clientHeight;
  const rx = getRandomInt(40, bgContainer.clientWidth);
  const ry = getRandomInt(40, bgContainer.clientHeight);
  const direction = Math.random() < 0.5 ? 0 : 1;
  const large = Math.random() < 0.5 ? 0 : 1;
  return `M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 ${large} ${direction} ${
    centerX + rx
  },${centerY} A ${rx} ${ry} 0 ${large} ${direction} ${centerX - rx},${centerY}`;
}
for (let i = 0; i < NB_BALLS_BG; i++) {
  const span = document.createElement("span");
  const size = getRandom(40, 80);
  const blur = getRandom(12, 14);
  const offsetShadow = size + blur;
  const path = generateRandomEllipsePath(vminToPx(offsetShadow));
  span.style.width = `${size}vmin`;
  span.style.height = `${size}vmin`;
  span.style.offsetPath = `path("${path}")`;
  span.style.animationDuration = `${getRandomInt(15, 50)}s`;
  span.style.animationDelay = `-${getRandomInt(15, 50)}s`;
  span.style.boxShadow = `${offsetShadow}vmin 0 ${blur}vmin var(--themeColor${getRandomInt(2, 6)})`;
  bgContainer.appendChild(span);
}
