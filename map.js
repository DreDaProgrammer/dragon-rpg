// map.js
import { locationsConfig } from "./config/map-config.js";
import { getMonstersByLocation } from "./monsters.js";
import { renderArena } from "./arena.js";
import { renderStore } from "./store.js";

/** Build a background path from the location’s ID */
export function getLocationImagePath(id) {
  return `assets/locations/${id}.png`;
}

/**
 * Get all locations (logic only)
 */
export function getAllLocations() {
  return locationsConfig;
}

/**
 * Get all monsters for a location
 */
export function getLocationMonsters(locationId) {
  return getMonstersByLocation(locationId);
}

/**
 * Handle location logic (but NOT HTML writing)
 */
export function handleLocationAction(container, locationId) {
  const loc = locationsConfig.find((l) => l.id === locationId);

  // If it's the store, call store rendering (UI done separately)
  if (locationId === "store") {
    renderStore(container);
    return { type: "store" };
  }

  // Otherwise, just return the location and its monsters for UI to build
  const monsters = getMonstersByLocation(locationId);
  return { type: "location", location: loc, monsters: monsters };
}
