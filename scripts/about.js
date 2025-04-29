/** Constants **/
const ABOUT = {};
/** ********* **/

const aboutText = document.getElementById("about-text");

async function displayText() {
  const response = await fetch("/static/translate/about-data.json");
  const data = await response.json();

  for (const item of data) {
    let textContainer = document.createElement("div");
    textContainer.className = `text-container ${item.id == data.length ? "end" : item.id % 2 ? "odd" : "even"}`;

    let text = document.createElement("p");
    text.innerHTML = item.text;
    textContainer.appendChild(text);

    let illustration = document.createElement("img");
    illustration.className = "text-illustration";
    illustration.id = `text-illustration-${item.id}`;
    illustration.src = `static/img/about-${item.id}.png`;
    textContainer.appendChild(illustration);

    aboutText.appendChild(textContainer);
  }
}

async function addHighlightStroke() {
  const response = await fetch("/static/img/highlightStroke.svg");
  const svg = await response.text();
  const containers = document.getElementsByClassName("highlight-container");
  for (const container of containers) {
    container.innerHTML += svg;
    container.getElementsByTagName("svg").item(0).setAttribute("preserveAspectRatio", "none");
    container.getElementsByTagName("svg").item(0).setAttribute("class", "highlight-stroke");
  }
}

export async function displayAbout() {
  await displayText();
  addHighlightStroke();
}
