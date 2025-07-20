// map.js
// Renders the location selection and available monsters per location

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
  const list = container.querySelector("ul");

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
 * Render a specific location view with monsters
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
    const fightBtn = document.createElement("button");
    fightBtn.textContent = `Fight ${mon.name}`;
    fightBtn.addEventListener("click", () => {
      renderArena(container, mon);
    });
    li.innerHTML = `<strong>${mon.name}</strong> (Power: ${mon.power}, Agility: ${mon.agility}) `;
    li.appendChild(fightBtn);
    list.appendChild(li);
  });

  document.getElementById("backToMap").addEventListener("click", () => {
    renderMap(container);
  });
}
