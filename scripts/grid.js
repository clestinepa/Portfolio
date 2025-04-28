/** Constants **/
const GRID = {
  ITEM: {
    WIDTH: {
      MAX: 300, //(in px) maximum width of an item
      MIN: 225, //(in px) minimum width of an item
    },
    FONT: {
      H2: {
        MAX: 22, //(in px) maximum font-size of h2
        MIN: 18, //(in px) minimum font-size of h2
      },
      P: {
        MAX: 16, //(in px) maximum font-size of p
        MIN: 12, //(in px) minimum font-size of p
      },
      LOGO: {
        MAX: 350, //(in px) maximum font-size of logo
        MIN: 225, //(in px) minimum font-size of logo
      },
    },
  },
};
/** ********* **/

const gridContainer = document.getElementById("grid-container");

async function loadAndInjectSVG(name) {
  const response = await fetch(`/static/logos/${name}.svg`);
  const svgText = await response.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgText;
  wrapper.setAttribute("data-tooltip", name.replace("-", " "));
  wrapper.classList = "tech-logo tooltip";

  return wrapper;
}

export async function displayGrid() {
  const response = await fetch("/static/translate/dev-data.json");
  const data = await response.json();

  for (const item of data) {
    let div = document.createElement("div");
    div.style.setProperty("--bg-url", `url("/static/img/dev-${item.id}-main.jpg")`);
    div.className = "img-grid";

    let hover = document.createElement("div");
    hover.className = "img-grid-hover";

    let title = document.createElement("h2");
    title.innerHTML = item.title;

    let text = document.createElement("p");
    text.innerHTML = item.text;

    let logos = document.createElement("div");
    logos.className = "logos";
    for (const logoName of item.logos) {
      const svg = await loadAndInjectSVG(logoName);
      logos.appendChild(svg);
    }

    hover.appendChild(title);
    hover.appendChild(text);
    hover.appendChild(logos);
    div.appendChild(hover);

    let wrapper = document.createElement("div");
    wrapper.className = "grid-wrapper";
    wrapper.appendChild(div);
    gridContainer.appendChild(wrapper);
  }

  gridContainer.style.setProperty("--max-width-column", GRID.ITEM.WIDTH.MAX + "px");
  gridContainer.style.setProperty("--min-width-column", GRID.ITEM.WIDTH.MIN + "px");
  resizeFont();
}

/**
 * Calculate the font size depending of the container width with an linear interpolation
 * @param {number} min minimum font size
 * @param {number} max maximum font size
 * @param {number} width width of the container
 * @returns the associated font size
 */
function calcFontSize(min, max, width) {
  let fontSize = min + (max - min) * ((width - GRID.ITEM.WIDTH.MIN) / (GRID.ITEM.WIDTH.MAX - GRID.ITEM.WIDTH.MIN));
  return Math.max(min, Math.min(fontSize, max));
}
function resizeFont() {
  const width = document.getElementsByClassName("img-grid").item(0).offsetWidth;
  const fontSizeH2 = calcFontSize(GRID.ITEM.FONT.H2.MIN, GRID.ITEM.FONT.H2.MAX, width);
  const fontSizeP = calcFontSize(GRID.ITEM.FONT.P.MIN, GRID.ITEM.FONT.P.MAX, width);
  gridContainer.style.setProperty("--font-size-h2", fontSizeH2 + "px");
  gridContainer.style.setProperty("--font-size-p", fontSizeP + "px");
}
window.addEventListener("resize", resizeFont);
