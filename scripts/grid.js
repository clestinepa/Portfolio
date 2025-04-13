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
    div.dataset.hover = 'Eum quae voluptatum aut excepturi autem et quaerat voluptas et distinctio laborum non consectetur autem est voluptatibus sunt! Et quia quaerat et corporis dolore eos dignissimos eaque est excepturi alias id inventore pariatur aut cumque aperiam. Eum quae voluptatum aut excepturi autem et quaerat voluptas et distinctio laborum non consectetur autem est voluptatibus sunt! Et quia quaerat et corporis dolore eos dignissimos eaque est excepturi alias id inventore pariatur aut cumque aperiam.'
    gridContainer.appendChild(div);
  }
}
