const DEFAULT_SIZE = 5; //(in px) size of the cursor in default state
const PRESS_SIZE = 15; //(in px) size of the cursor in press state

const cursor = document.getElementById("cursor");

//appearance
cursor.style.width = `${DEFAULT_SIZE}px`;
cursor.style.height = `${DEFAULT_SIZE}px`;
cursor.style.borderRadius = "50%";
cursor.style.transform = "translate(-50%, -50%)";
cursor.style.background = "red";
//position
cursor.style.position = "fixed";
cursor.style.zIndex = "999";
cursor.style.top = "0px";
cursor.style.left = "0px";
//interaction
cursor.style.pointerEvents = "none";
cursor.style.transition = "width 0.2s ease-in-out, height  0.2s ease-in-out";

window.onmousemove = (e) => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
};

window.onmousedown = () => {
  cursor.style.width = `${PRESS_SIZE}px`;
  cursor.style.height = `${PRESS_SIZE}px`;
};

window.onmouseup = () => {
  cursor.style.width = `${DEFAULT_SIZE}px`;
  cursor.style.height = `${DEFAULT_SIZE}px`;
};
