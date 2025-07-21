// map.js
import { locationsConfig } from "./map-config.js";
import { getMonstersByLocation } from "./monsters.js";
import { renderArena } from "./arena.js";
import { renderStore } from "./store.js"; // ← import your store renderer

/** Build a background path from the location’s ID */
function getLocationImagePath(id) {
  return `assets/locations/${id}.png`;
}

export function renderMap(container) {
  // strip out any prior location styling
  container.classList.remove("location-view");
  container.style.backgroundImage = "";
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

function renderLocation(container, locationId) {
  const loc = locationsConfig.find((l) => l.id === locationId);

  // apply background image
  container.classList.add("location-view");
  container.style.backgroundImage = `url("${getLocationImagePath(
    locationId
  )}")`;
  container.style.backgroundSize = "cover";
  container.style.backgroundPosition = "center";

  // special case: store
  if (locationId === "store") {
    // clear out old HTML, then call your store UI:
    renderStore(container);

    // add a “Back to Map” button
    const back = document.createElement("button");
    back.textContent = "Back to Map";
    back.addEventListener("click", () => renderMap(container));
    container.appendChild(back);
    return;
  }

  // fallback: show monsters
  const monsters = getMonstersByLocation(locationId);
  container.innerHTML = `
    <h2>${loc.name}</h2>
    <p>${loc.description}</p>
    <ul class="monster-list"></ul>
  `;
  const list = container.querySelector(".monster-list");
  monsters.forEach((mon) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = `assets/monsters/${mon.id}.png`;
    img.alt = mon.name;
    img.classList.add("monster-img");
    const info = document.createElement("div");
    info.innerHTML = `<strong>${mon.name}</strong><br/>
                      Power: ${mon.power}, Agility: ${mon.agility}`;
    const fight = document.createElement("button");
    fight.textContent = `Fight ${mon.name}`;
    fight.addEventListener("click", () => renderArena(container, mon));
    li.append(img, info, fight);
    list.appendChild(li);
  });

  // add “Back to Map”
  const back = document.createElement("button");
  back.textContent = "Back to Map";
  back.addEventListener("click", () => renderMap(container));
  container.appendChild(back);
}
