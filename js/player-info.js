/* player-info.js */
import { defaultPlayerConfig, STORAGE_KEY } from "./config/player-config.js";
import { toolsConfig } from "./config/tools-config.js";

// load/save helpers
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

// initialize player
export const player = loadData(STORAGE_KEY, defaultPlayerConfig);
function persistPlayer() {
  saveData(STORAGE_KEY, player);
}

// showStats: fills #stats-panel
export function showStats() {
  const container = document.getElementById("stats-panel");
  if (!container) return;

  const { level, xp, health, agility, coins, tools } = player;

  // aggregate tools into { id: count }
  const counts = tools.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  // build display strings
  const toolsDisplay = Object.entries(counts).map(([id, qty]) => {
    const cfg = toolsConfig.find((t) => t.id === id);
    const name = cfg ? cfg.name : id;
    return qty > 1 ? `${name} (${qty})` : name;
  });

  container.innerHTML = `
    <h2>Player Stats</h2>
    <p>Level: ${level}</p>
    <p>XP: ${xp}</p>
    <p>Health: ${health}</p>
    <p>Agility: ${agility}</p>
    <p>Coins: ${coins.gold}🥇 ${coins.silver}🥈 ${coins.bronze}🥉</p>

    <div class="tools-section">
      <h3>Tools</h3>
      <ul class="tools-list">
        ${
          toolsDisplay.length
            ? toolsDisplay.map((t) => `<li>${t}</li>`).join("")
            : "<li>None</li>"
        }
      </ul>
    </div>
  `;
}

// updatePlayer/addCoins/addXp unchanged except persist call
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
    // bump stats
    player.health = defaultPlayerConfig.health + player.level * 10;
    player.agility += 1;
  }
  persistPlayer();
}
