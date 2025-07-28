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
/**
 * Fill the #stats-panel inside the modal
 */
export function showStats() {
  const container = document.getElementById("stats-panel");
  if (!container) return;

  const { level, xp, health, agility, coins, tools } = player;
  container.innerHTML = `
    <h2>Player Stats</h2>
    <p>Level: ${level}</p>
    <p>XP: ${xp}</p>
    <p>Health: ${health}</p>
    <p>Agility: ${agility}</p>
    <p>Coins: ${coins.gold}🥇 ${coins.silver}🥈 ${coins.bronze}🥉</p>
    <p>Tools: ${tools.length ? tools.join(", ") : "None"}</p>
  `;
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
