const slideContainer = document.getElementById("slide-container");
const NB_IMG_SLIDE = 7; //nb image in the slide

function displayImg() {
  for (let j = 0; j < 2; j++) {
    infiniteSide = document.createElement("div");
    infiniteSide.className = "infinite-slide"
    for (let i = 1; i < NB_IMG_SLIDE + 1; i++) {
      img = document.createElement("img");
      img.src = `static/img/${i}.jpg`;
      img.className = `img ${(j + i) % 2 ? "odd" : "even"}`;
      infiniteSide.appendChild(img);
    }
    slideContainer.appendChild(infiniteSide);
  }
}

displayImg();
