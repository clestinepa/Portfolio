/** Constants **/
const GRID = {
  NB_IMG: 9, //nb image in the grid
};
/** ********* **/

const gridContainer = document.getElementById("grid-container");

async function loadAndInjectSVG(name) {
  const response = await fetch(`/static/logos/${name}.svg`);
  const svgText = await response.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgText;

  const svg = wrapper.querySelector("svg");
  svg.classList.add("tech-logo");

  return svg;
}

export async function displayGrid() {
  const response = await fetch("/static/dev/data.json");
  const data = await response.json();

  for (const item of data) {
    let div = document.createElement("div");
    div.style.setProperty("--bg-url", `url("/static/dev/img/${item.id}-main.jpg")`);
    div.className = "img-grid";

    let hover = document.createElement("div");
    hover.className = "img-grid-hover";

    let title = document.createElement("h2");
    title.innerHTML = item.title;

    let text = document.createElement("p");
    text.innerHTML = item.text;

    let logos = document.createElement("div");
    for (const logoName of item.logos) {
      const svg = await loadAndInjectSVG(logoName);
      logos.appendChild(svg);
    }

    hover.appendChild(title);
    hover.appendChild(text);
    hover.appendChild(logos);
    div.appendChild(hover);
    gridContainer.appendChild(div);
  }
}
