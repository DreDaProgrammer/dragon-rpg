// intro.js
// Displays a slideshow of intro images, then redirects to the town square

const images = ["assets/intro/cover-1.png", "assets/intro/cover-2.png"];
let current = 0;

const imgEl = document.getElementById("introImage");

function showNext() {
  if (current < images.length) {
    imgEl.src = images[current];
    current++;
    setTimeout(showNext, 3000); // 3s per image
  } else {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showNext();
});
