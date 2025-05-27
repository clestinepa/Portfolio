/** Constants **/
const GRID = {};
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
    imgContainer.className = "img-container click-me";
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
}
