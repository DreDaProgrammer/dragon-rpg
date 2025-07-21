// battle.js
// Battle mechanics: damage calculations, victory/defeat handlers

import { player, updatePlayer, addXp, addCoins } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";

/**
 * Determine the player's weapon power (highest tool or base fist)
 * @returns {number}
 */
function getPlayerWeaponPower() {
  if (!player.tools.length) return 5;
  let maxPower = 0;
  player.tools.forEach((id) => {
    const tool = getToolById(id);
    if (tool && tool.power > maxPower) maxPower = tool.power;
  });
  return maxPower > 0 ? maxPower : 5;
}

/**
 * Calculate a random damage based on power and agility
 * @param {number} power
 * @param {number} agility
 * @returns {number}
 */
function calculateDamage(power, agility) {
  // Base damage plus random up to agility
  const base = Math.floor(power * 0.7);
  return base + Math.floor(Math.random() * (agility + 1));
}

/**
 * Player attacks the monster
 * @param {Object} monster - instance with currentHealth, power, agility
 * @returns {number} damage dealt
 */
export function playerAttack(monster) {
  const power = getPlayerWeaponPower();
  const damage = calculateDamage(power, player.agility);
  monster.currentHealth -= damage;
  // Ensure monster health doesn't go below zero
  monster.currentHealth = Math.max(0, monster.currentHealth);
  return damage;
}

/**
 * Monster attacks the player
 * @param {Object} monster - instance with power, agility
 * @returns {number} damage dealt
 */
export function monsterAttack(monster) {
  const power = monster.power;
  const damage = calculateDamage(power, monster.agility);
  // Reduce player health and prevent negative values
  const newHealth = Math.max(0, player.health - damage);
  player.health = newHealth;
  updatePlayer({ health: newHealth });
  return damage;
}

/**
 * Handle victory: award XP and coins, update stats
 * @param {Object} monster - original config with rewards
 */
export function handleVictory(monster) {
  // Award XP and coins
  addXp(monster.xpReward);
  addCoins(monster.coinReward);
  alert(
    `Victory! You gained ${monster.xpReward} XP and ${monster.coinReward.gold}🥇 ${monster.coinReward.silver}🥈 ${monster.coinReward.bronze}🥉.`
  );
}

/**
 * Handle defeat: reset health to default and notify
 */
export function handleDefeat() {
  updatePlayer({ health: defaultPlayerConfig.health });
  alert("You have been defeated and wake up back in town, fully healed.");
}
