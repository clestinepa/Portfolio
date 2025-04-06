/** Constants **/
const NB_IMG_SLIDE = 7; //nb image in the slide
/** ********* **/

const slideContainer = document.getElementById("slide-container");

export function displaySlide() {
  for (let j = 0; j < 2; j++) {
    let infiniteSide = document.createElement("div");
    infiniteSide.className = "infinite-slide";
    for (let i = 1; i < NB_IMG_SLIDE + 1; i++) {
      let img = document.createElement("img");
      img.src = `static/img/${i}.jpg`;
      img.className = `img ${(j + i) % 2 ? "odd" : "even"}`;
      infiniteSide.appendChild(img);
    }
    slideContainer.appendChild(infiniteSide);
  }
}
