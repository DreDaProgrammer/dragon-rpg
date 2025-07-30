// js/battle.js
// Battle mechanics: damage calculations, victory/defeat handlers

import { player, updatePlayer, addXp, addCoins } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";

/**
 * Determine the player's weapon power (only the equipped tool, or base fist)
 * @returns {number}
 */
function getPlayerWeaponPower() {
  const wid = player.equippedCombatToolId;
  if (!wid) return 5; // base fist
  const tool = getToolById(wid);
  return tool && tool.power ? tool.power : 5;
}

/**
 * Calculate a random damage based on power and agility
 * @param {number} power
 * @param {number} agility
 * @returns {number}
 */
function calculateDamage(power, agility) {
  // 50%–150% of power plus up to agility
  const min = Math.floor(power * 0.5);
  const rollPower = min + Math.floor(Math.random() * (power + 1 - min));
  const rollAgi = Math.floor(Math.random() * (agility + 1));
  return rollPower + rollAgi;
}

/**
 * Player attacks the monster
 * @param {Object} monster - instance with currentHealth, power, agility
 * @returns {number} damage dealt
 */
export function playerAttack(monster) {
  const power = getPlayerWeaponPower();
  const damage = calculateDamage(power, player.agility);
  monster.currentHealth = Math.max(0, monster.currentHealth - damage);
  return damage;
}

/**
 * Monster attacks the player
 * @param {Object} monster - instance with power, agility
 * @returns {number} damage dealt
 */
export function monsterAttack(monster) {
  const damage = calculateDamage(monster.power, monster.agility);
  const newH = Math.max(0, player.health - damage);
  player.health = newH;
  updatePlayer({ health: newH });
  return damage;
}

/**
 * Handle victory: award XP and coins, update stats
 * @param {Object} monster - original config with rewards
 */
export function handleVictory(monster) {
  addXp(monster.xpReward);
  addCoins(monster.coinReward);
  alert(
    `Victory! You gained ${monster.xpReward} XP and ` +
      `${monster.coinReward.gold}🥇 ${monster.coinReward.silver}🥈 ${monster.coinReward.bronze}🥉.`
  );
}

/**
 * Handle defeat: reset health to default and notify
 */
export function handleDefeat() {
  updatePlayer({ health: defaultPlayerConfig.health });
}
