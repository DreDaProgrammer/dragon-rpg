/* player-info.js */
import { defaultPlayerConfig, STORAGE_KEY } from "./config/player-config.js";

// Load and save utilities
function loadData(key, defaultValue) {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.warn(`Corrupted data for key ${key}, using default.`);
    }
  }
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return { ...defaultValue };
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize player from config
export const player = loadData(STORAGE_KEY, defaultPlayerConfig);

// Persist changes
function persistPlayer() {
  saveData(STORAGE_KEY, player);
}

// Public API
export function showStats(container) {
  const statsHtml = `
    <h2>Player Stats</h2>
    <ul>
      <li>Level: ${player.level}</li>
      <li>XP: ${player.xp}</li>
      <li>Health: ${player.health}</li>
      <li>Agility: ${player.agility}</li>
      <li>Coins: ${player.coins.gold} 🥇, ${player.coins.silver} 🥈, ${
    player.coins.bronze
  } 🥉</li>
      <li>Tools: ${player.tools.length ? player.tools.join(", ") : "None"}</li>
    </ul>
  `;
  container.innerHTML = statsHtml;
}

export function updatePlayer(updates) {
  Object.assign(player, updates);
  persistPlayer();
}

export function addCoins({ gold = 0, silver = 0, bronze = 0 }) {
  player.coins.gold += gold;
  player.coins.silver += silver;
  player.coins.bronze += bronze;
  persistPlayer();
}

export function addXp(amount) {
  player.xp += amount;
  const xpForNext = player.level * 100;
  if (player.xp >= xpForNext) {
    player.level += 1;
    player.xp -= xpForNext;
    // increase stats on level up
    player.health = 100 + player.level * 10;
    player.agility += 1;
  }
  persistPlayer();
}
