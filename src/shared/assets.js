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


/** @type {{"id": number, "img": string, "title": string, "text": string, "logos": string[], "buttons": {"link": string, "text": string}[]}[]} */
export let dataDev = [];
/** @type {{[key: string]: string}[]} */
export let svgLogos = [];

export async function loadAllAssets() {
  const [svgHighlight, dev] = await Promise.all([
    fetch("/public/img/highlightStroke.svg").then((r) => r.text()),
    fetch("/public/data/dev.json").then((r) => r.json()),
  ]);
  svgHighlightStroke = svgHighlight;
  dataDev = dev;

  const logoPromises = logos.map(async (logoName) => {
    const response = await fetch(`public/logos/${logoName}.svg`);
    svgLogos[logoName] = await response.text();
  });
  await Promise.all(logoPromises);
}
