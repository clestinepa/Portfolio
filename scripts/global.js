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

export class FrameLoop {
  frameId = null;
  #startTimeoutId = null;
  #stopTimeoutId = null;

  /**
   * @param {() => boolean | void} callback
   */
  constructor(callback) {
    this.callback = callback;
  }

  #requestAnimation() {
    const loop = () => {
      const shouldContinue = this.callback();
      if (shouldContinue === false) this.stop();
      else this.frameId = requestAnimationFrame(loop);
    };
    loop();
  }

  #cancelAnimation() {
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }

  #timeout(timeout, callback, timeoutId) {
    if (timeoutId) clearTimeout(timeoutId);
    if (timeout > 0) timeoutId = setTimeout(() => callback(), timeout);
    else callback();
    return timeoutId;
  }

  start(timeout = 0) {
    if (this.frameId !== null) return;
    this.#startTimeoutId = this.#timeout(timeout, this.#requestAnimation.bind(this), this.#startTimeoutId);
  }

  stop(timeout = 0) {
    if (this.frameId == null) return;
    this.#stopTimeoutId = this.#timeout(timeout, this.#cancelAnimation.bind(this), this.#stopTimeoutId);
  }
}
