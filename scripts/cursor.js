/** Constants **/
const DEFAULT_SIZE = 15; //(in px) size of the cursor in default state
const PRESS_SIZE = 20; //(in px) size of the cursor in press state
/** ********* **/

const cursor = document.getElementById("cursor");

cursor.style.width = `${DEFAULT_SIZE}px`;
cursor.style.height = `${DEFAULT_SIZE}px`;

export function initCursor() {
  window.onmousemove = (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  };

  window.onmousedown = () => {
    cursor.style.animation = "";
    cursor.style.width = `${PRESS_SIZE}px`;
    cursor.style.height = `${PRESS_SIZE}px`;
  };

  window.onmouseup = () => {
    cursor.style.animation = "rotate 0.5s ease-out both";

    cursor.style.width = `${DEFAULT_SIZE}px`;
    cursor.style.height = `${DEFAULT_SIZE}px`;
  };
}
