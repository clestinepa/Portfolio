/** NEXT STEPS
 * - improve UI : like a liquid moving with infinite waves
 */

export function handleProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  document.getElementById("progress-bar").style.height = scrollPercent + "%";
}

export const myProgressBar = {
  init: () => {
    handleProgressBar();
    /** EventListener **/
    document.addEventListener("scroll", handleProgressBar);
    /** ************* **/
  },
};
