const contact = document.getElementById("contact");
const cardWrapper = document.getElementById("contact-card-wrapper");
const card = document.getElementById("contact-card");

function rotateContactCard(event) {
  const middleX = cardWrapper.offsetLeft + cardWrapper.offsetWidth / 2 - contact.offsetLeft;
  const middleY = cardWrapper.offsetTop + cardWrapper.offsetHeight / 2 - contact.offsetTop;
  const offsetX = ((event.clientX - middleX) / middleX) * 25;
  const offsetY = ((event.clientY - middleY) / middleY) * 25;
  card.style.setProperty("--rotateX", offsetX + "deg");
  card.style.setProperty("--rotateY", -1 * offsetY + "deg");
}

export function initContactCard() {
  contact.addEventListener("mousemove", rotateContactCard);
}
