const cursor = document.getElementById("cursor");
cursor.style.position = "fixed";
cursor.style.zIndex = "999";
const DEFAULT_SIZE = 5;
const CLICKED_SIZE = 15;
cursor.style.top = "0px";
cursor.style.transform = "translate(-50%, -50%)";
cursor.style.left = "0px";
cursor.style.width = `${DEFAULT_SIZE}px`;
cursor.style.height = `${DEFAULT_SIZE}px`;
cursor.style.borderRadius = "50%";
cursor.style.pointerEvents = "none";
cursor.style.background = "red";
cursor.style.transition = "width 0.2s ease-in-out, height  0.2s ease-in-out";

window.onmousemove = (e) => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
};

window.onmousedown = () => {
  cursor.style.width = `${CLICKED_SIZE}px`;
  cursor.style.height = `${CLICKED_SIZE}px`;
};

window.onmouseup = () => {
  cursor.style.width = `${DEFAULT_SIZE}px`;
  cursor.style.height = `${DEFAULT_SIZE}px`;
};
