// monsters.js
// Logic for accessing monster configurations and selecting monsters for battles

import { monstersConfig } from "./monsters-config.js";

/**
 * Get the full list of monsters
 * @returns {Array} monstersConfig
 */
export function getAllMonsters() {
  return monstersConfig;
}

/**
 * Find a monster by its ID
 * @param {string} id - Monster ID
 * @returns {Object|null} Monster object or null
 */
export function getMonsterById(id) {
  return monstersConfig.find((mon) => mon.id === id) || null;
}

/**
 * Get monsters available in a specific location
 * @param {string} location
 * @returns {Array} Array of monsters in that location
 */
export function getMonstersByLocation(location) {
  return monstersConfig.filter((mon) => mon.location === location);
}

/**
 * Get a random monster from a given location
 * @param {string} location
 * @returns {Object|null} Random monster or null if none
 */
export function getRandomMonster(location) {
  const list = getMonstersByLocation(location);
  if (!list.length) return null;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}
