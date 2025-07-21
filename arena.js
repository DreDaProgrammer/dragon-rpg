// arena.js
// Sets up the battle arena UI and integrates with battle mechanics

import { player } from "./player-info.js";
import {
  playerAttack,
  monsterAttack,
  handleVictory,
  handleDefeat,
} from "./battle.js";

/**
 * Render the battle arena for a given monster
 * @param {HTMLElement} container - where to render
 * @param {Object} monsterConfig - monster data from config
 */
export function renderArena(container, monsterConfig) {
  // Initialize monster with full health
  const monster = {
    ...monsterConfig,
    currentHealth: monsterConfig.power * 5,
  };

  // Track player health locally for display
  let playerCurrentHealth = player.health;

  // Render initial arena UI
  container.innerHTML = `
    <h2>Battle Arena</h2>
    <div id="battleInfo">
      <p><strong>${player.level} Hero</strong> HP: <span id="playerHP">${playerCurrentHealth}</span></p>
      <p><strong>${monster.name}</strong> HP: <span id="monsterHP">${monster.currentHealth}</span></p>
    </div>
    <button id="attackBtn">Attack</button>
    <div id="battleLog"></div>
  `;

  const playerHPSpan = document.getElementById("playerHP");
  const monsterHPSpan = document.getElementById("monsterHP");
  const battleLog = document.getElementById("battleLog");
  const attackBtn = document.getElementById("attackBtn");

  attackBtn.addEventListener("click", () => {
    // Player attacks first
    const dmgToMonster = playerAttack(monster);
    monster.currentHealth = Math.max(0, monster.currentHealth);
    battleLog.innerHTML += `<p>You deal ${dmgToMonster} damage to ${monster.name}.</p>`;
    monsterHPSpan.textContent = monster.currentHealth;

    // Check for monster defeat
    if (monster.currentHealth <= 0) {
      attackBtn.disabled = true;
      handleVictory(monster);
      battleLog.innerHTML += `<p>You have defeated ${monster.name}!</p>`;
      battleLog.innerHTML += `<button id="toTownBtn">Return to Town</button>`;
      document.getElementById("toTownBtn").addEventListener("click", () => {
        window.location.href = "index.html";
      });
      return;
    }

    // Monster attacks
    const dmgToPlayer = monsterAttack(monster);
    // Subtract damage from local health and clamp
    playerCurrentHealth = Math.max(0, playerCurrentHealth - dmgToPlayer);
    battleLog.innerHTML += `<p>${monster.name} deals ${dmgToPlayer} damage to you.</p>`;
    playerHPSpan.textContent = playerCurrentHealth;

    // Check for player defeat
    if (playerCurrentHealth <= 0) {
      attackBtn.disabled = true;
      handleDefeat();
      battleLog.innerHTML += `<p>You have been defeated...</p>`;
      battleLog.innerHTML += `<button id="retryBtn">Retry</button>`;
      document.getElementById("retryBtn").addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
  });
}
