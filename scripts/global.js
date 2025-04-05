export function getRandom(min, max) {
  return Math.random() * (max - min + 1) + min;
}
export function getRandomInt(min, max) {
  return Math.floor(getRandom(min, max));
}
