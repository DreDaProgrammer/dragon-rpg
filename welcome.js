// Welcome.js
// Dramatic introduction to the story and transition to the town square

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="welcome-screen">
      <h1>The Dragon’s Shadow</h1>
      <p>For generations, the village of Embervale slept under the gentle glow of dawn. But now, an ancient terror stirs in the mountains — a dragon of smoldering scales and fiery breath has descended upon the farmland, razing crop and cottage alike.</p>
      <p>Whispers of smoke on the wind echo through the narrow streets, and only one hero stands between the beast and the people:</p>
      <p class="hero">You.</p>
      <button id="startGameBtn">Begin Your Quest</button>
    </section>
  `;

  document.getElementById("startGameBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
