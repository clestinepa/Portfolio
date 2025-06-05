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


/** @type {{"id": number, "img": string, "detailImg": string, "more":{"img": string, "text": string, "link": string}|undefined, "title": string, "description": string}[]} */
export let dataDesign = [];
/** @type {{"id": number, "img": string, "title": string, "text": string, "logos": string[], "buttons": {"link": string, "text": string}[]}[]} */
export let dataDev = [];
/** @type {{[key: string]: string}[]} */
export let svgLogos = [];

export async function loadAllAssets() {
  const [svgHighlight, design, dev] = await Promise.all([
    fetch("/public/img/highlightStroke.svg").then((r) => r.text()),
    fetch("/public/data/design.json").then((r) => r.json()),
    fetch("/public/data/dev.json").then((r) => r.json()),
  ]);
  svgHighlightStroke = svgHighlight;
  dataDesign = design;
  dataDev = dev;

  const logoPromises = logos.map(async (logoName) => {
    const response = await fetch(`public/logos/${logoName}.svg`);
    svgLogos[logoName] = await response.text();
  });
  await Promise.all(logoPromises);
}
