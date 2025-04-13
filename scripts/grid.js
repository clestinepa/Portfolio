/** Constants **/
const GRID = {
  NB_IMG: 9, //nb image in the grid
};
/** ********* **/

const gridContainer = document.getElementById("grid-container");

export function displayGrid() {
  for (let i = 1; i < GRID.NB_IMG + 1; i++) {
    let div = document.createElement("div");
    div.style.setProperty("--bg-url", `url("/static/img/${i}.jpg")`);
    div.className = "img-grid";
    let hover = document.createElement("div");
    hover.className = "img-grid-hover";
    let title = document.createElement("h2");
    title.innerHTML = "SacredRobo";
    let text = document.createElement("p");
    text.innerHTML =
      "Eum quae voluptatum aut excepturi autem et quaerat voluptas et distinctio laborum non consectetur autem est voluptatibus sunt!";
    let logos = document.createElement("div");
    logos.innerHTML = "LOGOOGOGO";
    hover.appendChild(title);
    hover.appendChild(text);
    hover.appendChild(logos);
    div.appendChild(hover);
    gridContainer.appendChild(div);
  }
}
