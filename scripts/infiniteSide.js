const imgProjects = document.getElementById("imgProjects");
const NB_IMG = 7;

function displayImg() {
  for (let j = 0; j < 2; j++) {
    infiniteSide = document.createElement("div");
    infiniteSide.className = "infinite-slide"
    for (let i = 1; i < NB_IMG + 1; i++) {
      img = document.createElement("img");
      img.src = `static/img/${i}.jpg`;
      img.className = `img ${(j + i) % 2 ? "odd" : "even"}`;
      infiniteSide.appendChild(img);
    }
    imgProjects.appendChild(infiniteSide);
  }
}

displayImg();
