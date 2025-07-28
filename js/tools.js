// tools.js
// Logic for accessing and using tool configurations

import { toolsConfig } from "./config/tools-config.js";
import { player, updatePlayer } from "./player-info.js";

/**
 * Get the full list of available tools
 * @returns {Array} toolsConfig array
 */
export function getAllTools() {
  return toolsConfig;
}

/**
 * Find a tool by its ID
 * @param {string} id - tool ID
 * @returns {Object|null} tool object or null if not found
 */
export function getToolById(id) {
  return toolsConfig.find((tool) => tool.id === id) || null;
}

/**
 * Check if the player can afford a given tool
 * @param {Object} cost - { gold, silver, bronze }
 * @returns {boolean}
 */
export function canAfford(cost) {
  return (
    player.coins.gold >= (cost.gold || 0) &&
    player.coins.silver >= (cost.silver || 0) &&
    player.coins.bronze >= (cost.bronze || 0)
  );
}

/**
 * Deduct cost from player's coins
 * @param {Object} cost - { gold, silver, bronze }
 */
function deductCost(cost) {
  player.coins.gold -= cost.gold || 0;
  player.coins.silver -= cost.silver || 0;
  player.coins.bronze -= cost.bronze || 0;
  updatePlayer({ coins: player.coins });
}

/**
 * Purchase a tool: adds to player.tools and deducts cost
 * @param {string} toolId
 * @returns {boolean} true if purchase succeeded
 */
export function purchaseTool(toolId) {
  const tool = getToolById(toolId);
  if (!tool) return false;
  if (!canAfford(tool.cost)) return false;
  deductCost(tool.cost);
  player.tools.push(toolId);
  updatePlayer({ tools: player.tools });
  return true;
}
