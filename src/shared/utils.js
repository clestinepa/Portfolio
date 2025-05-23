export function getRandom(min, max) {
  return Math.random() * (max - min + 1) + min;
}
export function getRandomInt(min, max) {
  return Math.floor(getRandom(min, max));
}

/**
 * Get random variable color
 * @returns the random variable color with format "var(--name-variable)"
 */
export function getRandomVariableCSSColor() {
  const randomIndex = getRandomInt(1, 4);
  let theme;
  switch (randomIndex) {
    case 1:
      theme = "design";
      break;
    case 2:
      theme = "dev";
      break;
    case 3:
      theme = "photo";
      break;
    default:
    case 4:
      theme = "montage";
  }
  return `var(--main-${theme})`;
}

class FrameLoop {
  frameId = null;
  /**
   * @type {(() => {shouldContinue: boolean, timeout: number|undefined})[]}
   */
  callbacks = [];

  constructor() {}

  #requestAnimation() {
    const loop = () => {
      let shouldContinueLoop = true;
      for (let callback of this.callbacks) {
        const { shouldContinue, timeout } = callback();
        if (!shouldContinue) shouldContinueLoop = this.stop(callback, timeout);
      }
      if (shouldContinueLoop) this.frameId = requestAnimationFrame(loop);
    };
    loop();
  }

  #cancelAnimation(callbackToStop) {
    this.callbacks.splice(this.callbacks.indexOf(callbackToStop), 1);
    if (this.callbacks.length === 0) cancelAnimationFrame(this.frameId);
  }

  #timeout(timeout, callback) {
    if (timeout > 0) setTimeout(() => callback(), timeout);
    else callback();
  }

  /**
   * @param {() => {shouldContinue: boolean, timeout: number|undefined}} callbackToStart
   */
  start(callbackToStart) {
    if (this.callbacks.indexOf(callbackToStart) !== -1) return;
    this.callbacks.push(callbackToStart);
    if (this.callbacks.length === 1) this.#requestAnimation();
  }

  /**
   * @param {() => {shouldContinue: boolean, timeout: number|undefined}} callbackToStop
   */
  stop(callbackToStop, timeout = 0) {
    if (this.callbacks.indexOf(callbackToStop) === -1) return;
    this.#timeout(timeout, () => this.#cancelAnimation(callbackToStop));
    if (this.callbacks.length === 0) return false;
    return true;
  }
}

/** RequestAnimationFrame **/
export const myFrameLoop = new FrameLoop();
/** ********************* **/
