/** NEXT STEPS
 * - improve UI : like a liquid moving with infinite waves
 */

export function handleProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  document.getElementById("progress-bar").style.height = scrollPercent + "%";
}

export function initProgressBar() {
  window.addEventListener("scroll", handleProgressBar);
  handleProgressBar();
}
