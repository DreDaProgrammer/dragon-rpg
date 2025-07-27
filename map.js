// map.js
import { locationsConfig } from "./config/map-config.js";
import { getMonstersByLocation } from "./monsters.js";
import { renderArena } from "./arena.js";

// Build path helper
function getLocationImagePath(id) {
  return `assets/locations/${id}.png`;
}

const container = document.getElementById("map-content");

// Kick off the menu
document.addEventListener("DOMContentLoaded", renderMapUI);

function renderMapUI() {
  container.innerHTML = "";
  container.style.backgroundImage = "";

  const ul = document.createElement("ul");
  ul.className = "location-list";
  container.appendChild(ul);

  locationsConfig.forEach((loc) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = loc.name;

    btn.addEventListener("click", () => {
      if (loc.id === "store") {
        // simply redirect to store.html
        window.location.href = "store.html";
      } else if (loc.id === "town_square") {
        window.location.href = "index.html";
      } else {
        renderLocationUI(loc.id);
      }
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function renderLocationUI(locationId) {
  const loc = locationsConfig.find((l) => l.id === locationId);

  container.style.backgroundImage = `url("${getLocationImagePath(
    locationId
  )}")`;
  container.style.backgroundSize = "cover";
  container.style.backgroundPosition = "center";
  container.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.textContent = loc.name;
  const p = document.createElement("p");
  p.textContent = loc.description;
  container.append(h2, p);

  const monsterUl = document.createElement("ul");
  monsterUl.className = "monster-list";
  container.appendChild(monsterUl);

  getMonstersByLocation(locationId).forEach((mon) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = `assets/monsters/${mon.id}.png`;
    img.alt = mon.name;
    img.className = "monster-img";

    const info = document.createElement("div");
    info.innerHTML = `<strong>${mon.name}</strong><br/>Power: ${mon.power}, Agility: ${mon.agility}`;

    const fight = document.createElement("button");
    fight.textContent = `Fight ${mon.name}`;
    fight.addEventListener("click", () => {
      localStorage.setItem("currentMonster", JSON.stringify(mon));
      window.location.href = "arena.html";
    });

    li.append(img, info, fight);
    monsterUl.appendChild(li);
  });

  const back = document.createElement("button");
  back.textContent = "← Back to Map";
  back.addEventListener("click", renderMapUI);
  container.appendChild(back);
}
