/** Constants **/
const ABOUT = {};
/** ********* **/

async function displayText(section) {
  const response = await fetch(`/static/translate/${section}-data.json`);
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

    document.getElementById(`${section}-text`).appendChild(textContainer);
  }
}

export async function displayAbout() {
  await displayText("about");
}
