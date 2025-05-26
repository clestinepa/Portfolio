/** Constants **/
const GRID = {
  ITEM: {
    WIDTH: {
      MAX: 300, //(in px) maximum width of an item
      MIN: 225, //(in px) minimum width of an item
    },
    FONT: {
      H2: {
        MAX: 20, //(in px) maximum font-size of h2
        MIN: 16, //(in px) minimum font-size of h2
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
  const response = await fetch(`/public/logos/${name}.svg`);
  const svgText = await response.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgText;
  wrapper.setAttribute("data-tooltip", name.replace("-", " "));
  wrapper.classList = "tech-logo tooltip";

  return wrapper;
}

export async function displayGrid() {
  const response = await fetch("/public/data/dev.json");
  const data = await response.json();

  for (const item of data) {
    //img
    let imgContainer = document.createElement("div");
    imgContainer.className = "img-container";
    let img = document.createElement("img");
    img.src = `/public/img/${item.img ?? "profile.jpg"}`;
    imgContainer.appendChild(img);

    //text
    let textContainer = document.createElement("div");
    textContainer.className = "text-container";

    let title = document.createElement("h2");
    title.innerHTML = item.title;
    textContainer.appendChild(title);

    let text = document.createElement("p");
    text.innerHTML = item.text;
    textContainer.appendChild(text);

    let logos = document.createElement("div");
    logos.className = "logos";
    for (const logoName of item.logos) {
      const svg = await loadAndInjectSVG(logoName);
      logos.appendChild(svg);
    }
    textContainer.appendChild(logos);

    //wrapper
    let wrapper = document.createElement("div");
    wrapper.className = `img-text-wrapper ${item.id == data.length ? "end" : item.id % 2 ? "odd" : "even"}`;
    wrapper.appendChild(imgContainer);
    wrapper.appendChild(textContainer);
    gridContainer.appendChild(wrapper);
  }

  gridContainer.style.setProperty("--max-width-column", GRID.ITEM.WIDTH.MAX + "px");
  gridContainer.style.setProperty("--min-width-column", GRID.ITEM.WIDTH.MIN + "px");
}
