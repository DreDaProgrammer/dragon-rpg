// map.js
// Renders the location selection and available monsters with images per location

import { locationsConfig } from "./map-config.js";
import { getMonstersByLocation } from "./monsters.js";
import { renderArena } from "./arena.js";

/**
 * Render the map UI inside a container
 * @param {HTMLElement} container
 */
export function renderMap(container) {
  container.innerHTML = `
    <h2>Map</h2>
    <ul class="location-list"></ul>
  `;
  const list = container.querySelector(".location-list");

  locationsConfig.forEach((loc) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = loc.name;
    btn.addEventListener("click", () => renderLocation(container, loc.id));
    li.appendChild(btn);
    list.appendChild(li);
  });
}

/**
 * Render a specific location view with monsters and their images
 * @param {HTMLElement} container
 * @param {string} locationId
 */
function renderLocation(container, locationId) {
  const loc = locationsConfig.find((l) => l.id === locationId);
  const monsters = getMonstersByLocation(locationId);

  container.innerHTML = `
    <h2>${loc.name}</h2>
    <p>${loc.description}</p>
    <ul class="monster-list"></ul>
    <button id="backToMap">Back to Map</button>
  `;

  const list = container.querySelector(".monster-list");
  monsters.forEach((mon) => {
    const li = document.createElement("li");
    // Monster image
    const img = document.createElement("img");
    img.src = `assets/monsters/${mon.id}.png`;
    img.alt = mon.name;
    img.classList.add("monster-img");

    // Monster info
    const info = document.createElement("div");
    info.innerHTML = `
      <strong>${mon.name}</strong><br />
      Power: ${mon.power}, Agility: ${mon.agility}
    `;

    // Fight button
    const fightBtn = document.createElement("button");
    fightBtn.textContent = `Fight ${mon.name}`;
    fightBtn.addEventListener("click", () => {
      renderArena(container, mon);
    });

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(fightBtn);
    list.appendChild(li);
  });

  document.getElementById("backToMap").addEventListener("click", () => {
    renderMap(container);
  });
}
