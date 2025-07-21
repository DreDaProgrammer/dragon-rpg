// monsters.js
// Logic for accessing monster configurations and selecting monsters for battles

import { monstersConfig } from "./monsters-config.js";

/**
 * Get the full list of monsters
 * @returns {Array<Object>} monstersConfig
 */
export function getAllMonsters() {
  return monstersConfig;
}

/**
 * Find a monster by its ID
 * @param {string} id — Monster ID
 * @returns {Object|null} Monster object or null if not found
 */
export function getMonsterById(id) {
  return monstersConfig.find((mon) => mon.id === id) || null;
}

/**
 * Get all monsters available in a specific location
 * @param {string} location — location ID (e.g. 'forest')
 * @returns {Array<Object>} Array of monsters in that location
 */
export function getMonstersByLocation(location) {
  return monstersConfig.filter((mon) => mon.location === location);
}

/**
 * Pick a random monster from a given location
 * @param {string} location — location ID
 * @returns {Object|null} Random monster or null if none available
 */
export function getRandomMonster(location) {
  const list = getMonstersByLocation(location);
  if (!list.length) return null;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}
