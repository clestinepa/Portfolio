const logos = [
  "ada",
  "chart-js",
  "css",
  "html",
  "java",
  "js",
  "jupyter",
  "mapbox",
  "material-ui",
  "openlayers",
  "python",
  "react",
  "redux",
  "svelte",
];

export let svgHighlightStroke = "";
/** @type {{"id": number, "text": ({"highlight": string, "color": string}|string)[]}[]} */
export let dataAbout = [];
/** @type {{"id": number, "img": string, "detailImg": string, "more":{"img": string, "text": string}|undefined, "title": string, "description": string}[]} */
export let dataDesign = [];
/** @type {{"id": number, "img": string, "title": string, "text": string, "logos": string[], "buttons": {"link": string, "text": string}[]}[]} */
export let dataDev = [];
/** @type {{[key: string]: string}[]} */
export let svgLogos = [];

export async function loadAllAssets() {
  const responseHighlightStroke = await fetch("public/img/highlightStroke.svg");
  svgHighlightStroke = await responseHighlightStroke.text();

  const responseAbout = await fetch("public/data/about.json");
  dataAbout = await responseAbout.json();

  const responseDesign = await fetch("public/data/design.json");
  dataDesign = await responseDesign.json();

  const responseDev = await fetch("public/data/dev.json");
  dataDev = await responseDev.json();

  for (const logoName of logos) {
    const responseSvg = await fetch(`public/logos/${logoName}.svg`);
    svgLogos[logoName] = await responseSvg.text();
  }
}
