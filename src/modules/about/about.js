/** NEXT STEPS
 * - improve UI : add assets for each p
 * - do I add infinite animation in the assets ?
 */

/** Constants **/
const ABOUT = {};
/** ********* **/

function displayText() {
  const containers = document.getElementsByClassName("text-container-about");
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i];
    container.className = `text-container-about ${i == containers.length ? "end" : i % 2 ? "even" : "odd"}`;
  }
}

export const myAboutSection = {
  init: () => {
    displayText();
  },
};
