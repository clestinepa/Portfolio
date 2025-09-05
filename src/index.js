import { loadAllAssets } from "./shared/assets.js";
import { myPresentationSection } from "./modules/presentation/typing.js";
import { myTechnicalSection } from "./modules/technical/technical.js";
import { myAboutSection } from "./modules/about/about.js";
import { myDesignSection } from "./modules/design/design.js";
import { myDevSection } from "./modules/dev/dev.js";
import { myContactSection } from "./modules/contact/contact.js";
import { myCommonElements } from "./modules/common/common.js";

/** NEXT STEPS
 * - check to improve performance
 * - add contact section
 * - think about a way to show mail every time
 * - add light/dark mode
 * - add translate mode
 * - add CV to download
 */

async function initializeSite() {
  //load assets
  await loadAllAssets();

  //sections
  myPresentationSection.init();
  myTechnicalSection.init();
  myAboutSection.init();
  myDesignSection.init();
  myDevSection.init();
  myContactSection.init();

  //global scripts, wait that everything else is setup
  myCommonElements.init();
}

async function initWithLoader() {
  console.time("Init website");
  await initializeSite();
  document.querySelector("body").removeChild(document.getElementById("loader-wrapper"));
  document.querySelector("main").style.opacity = "1";
  console.timeEnd("Init website");
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initWithLoader);
else initWithLoader();
