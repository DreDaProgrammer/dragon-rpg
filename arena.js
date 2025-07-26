// arena.js
// Shin Megami Tensei–inspired turn-based combat system

import { player, updatePlayer } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";
import { monstersConfig } from "./config/monsters-config.js";
import { handleVictory, handleDefeat } from "./battle.js";

let currentMonster;
let buffPower = 0;
let awaitingPlayerAction = true;

export function renderArena(container, monConfig) {
  // Setup monster for battle
  currentMonster = { ...monConfig, currentHealth: monConfig.power * 5 };
  buffPower = 0;
  awaitingPlayerAction = true;

  // Build SMT-style battle UI
  container.innerHTML = `
    <div id="battle-ui">
      <!-- Turn Indicator -->
      <div id="turn-indicator">PLAYER TURN</div>

      <!-- Left Action Menu -->
      <div id="action-menu">
        <button class="menu-item" data-action="attack">Attack</button>
        <button class="menu-item" data-action="skills">Skills</button>
        <button class="menu-item" data-action="items">Items</button>
        <button class="menu-item" data-action="guard">Guard</button>
        <button class="menu-item" data-action="talk">Talk</button>
        <button class="menu-item" data-action="escape">Escape</button>
        <button class="menu-item" data-action="pass">Pass</button>
      </div>

      <!-- Player Status Panel -->
      <div id="player-status">
        <img id="player-portrait" src="assets/hero.png" alt="Player Portrait">
        <div class="status-info">
          <p class="name">Hero</p>
          <p>HP: <span id="playerHp">${player.health}</span> / ${
    defaultPlayerConfig.health
  }</p>
          <p>MP: <span id="playerMp">${player.mp || 30}</span> / 30</p>
          <p>Lv. <span id="playerLevel">${player.level || 1}</span></p>
        </div>
      </div>

      <!-- Monster Status -->
      <div id="monster-status">
        <p><strong>${monConfig.name}</strong></p>
        <p>HP: <span id="monsterHp">${currentMonster.currentHealth}</span> / ${
    monConfig.power * 5
  }</p>
      </div>

      <!-- Battle Log -->
      <div id="battle-log"></div>
    </div>
  `;

  // Hook menu buttons
  document.querySelectorAll("#action-menu .menu-item").forEach((btn) => {
    btn.addEventListener("click", () => handleMenuAction(btn.dataset.action));
  });

  appendLog(`Battle begins against ${monConfig.name}!`);
}

/**
 * Handles the selected menu action (Attack, Skills, Items, etc.)
 */
function handleMenuAction(action) {
  if (!awaitingPlayerAction) return;

  switch (action) {
    case "attack":
      playerAttack();
      break;
    case "skills":
      appendLog("You don't know any special skills yet.");
      break;
    case "items":
      playerUseItem();
      break;
    case "guard":
      playerGuard();
      break;
    case "talk":
      appendLog(
        `You attempt to talk to ${currentMonster.name}... but it doesn’t respond.`
      );
      endPlayerTurn();
      break;
    case "escape":
      tryEscape();
      break;
    case "pass":
      appendLog("You pass your turn.");
      endPlayerTurn();
      break;
  }
}

/**
 * Attack action
 */
function playerAttack() {
  awaitingPlayerAction = false;

  const toolId = player.equippedCombatToolId;
  const power = toolId ? getToolById(toolId).power : 5;
  const dmg = Math.floor(Math.random() * power) + 1 + buffPower;
  buffPower = 0;

  appendLog(`🗡 You attack and deal ${dmg} damage!`);
  currentMonster.currentHealth = Math.max(
    0,
    currentMonster.currentHealth - dmg
  );
  updateHPDisplays();

  if (currentMonster.currentHealth <= 0) {
    appendLog(`🎉 You’ve slain the ${currentMonster.name}!`);
    return handleVictory(currentMonster);
  }

  endPlayerTurn();
}

/**
 * Guard action
 */
function playerGuard() {
  awaitingPlayerAction = false;
  appendLog("🛡 You brace for impact, ready to guard.");
  player.isGuarding = true;
  endPlayerTurn();
}

/**
 * Item action (use first potion found)
 */
function playerUseItem() {
  awaitingPlayerAction = false;

  const potion = player.tools.find((id) => {
    const tool = getToolById(id);
    return tool && tool.consumable && tool.type === "potion";
  });

  if (!potion) {
    appendLog("❌ You have no potions.");
    awaitingPlayerAction = true;
    return;
  }

  const tool = getToolById(potion);
  if (tool.effect.heal) {
    player.health = Math.min(
      defaultPlayerConfig.health,
      player.health + tool.effect.heal
    );
    appendLog(`🧪 Used ${tool.name}, healed ${tool.effect.heal} HP!`);
  }
  if (tool.effect.power) buffPower += tool.effect.power;

  // Remove potion from inventory
  player.tools.splice(player.tools.indexOf(potion), 1);
  updatePlayer({ health: player.health, tools: player.tools });

  updateHPDisplays();
  endPlayerTurn();
}

/**
 * Escape action
 */
function tryEscape() {
  awaitingPlayerAction = false;
  const success = Math.random() > 0.5; // 50% chance to escape
  if (success) {
    appendLog("🏃 You successfully fled the battle!");
    setTimeout(() => window.location.reload(), 1500);
  } else {
    appendLog("🚫 You failed to escape!");
    endPlayerTurn();
  }
}

/**
 * Ends the player's turn → monster takes its turn
 */
function endPlayerTurn() {
  setTimeout(monsterTurn, 800);
}

/**
 * Monster's turn logic
 */
function monsterTurn() {
  const move =
    currentMonster.attacks[
      Math.floor(Math.random() * currentMonster.attacks.length)
    ];
  appendLog(`🔥 ${currentMonster.name} uses ${move.name}!`);

  // Calculate monster damage
  let dmg =
    Math.floor(currentMonster.power * 0.7) +
    Math.floor(Math.random() * currentMonster.agility);

  // Guarding reduces damage if shield is equipped
  if (player.isGuarding) {
    const shieldId = player.equippedShieldId;
    if (shieldId) {
      const shield = getToolById(shieldId);
      const blocked = shield.effect?.defense
        ? Math.min(shield.effect.defense, dmg)
        : 0;
      dmg -= blocked;
      appendLog(`🛡 Blocked ${blocked} damage with your shield!`);
    } else {
      appendLog("⚠️ You tried to guard but had no shield equipped!");
    }
    player.isGuarding = false;
  }

  if (dmg > 0) {
    appendLog(`💥 You take ${dmg} damage!`);
    player.health = Math.max(0, player.health - dmg);
    updatePlayer({ health: player.health });
    updateHPDisplays();
  }

  if (player.health <= 0) {
    appendLog(`💀 You have been slain...`);
    return handleDefeat();
  }

  appendLog("➡️ Your turn.");
  awaitingPlayerAction = true;
}

/**
 * Updates HP display for both player and monster
 */
function updateHPDisplays() {
  document.getElementById("playerHp").textContent = player.health;
  document.getElementById("monsterHp").textContent =
    currentMonster.currentHealth;
}

/**
 * Adds messages to the log box
 */
function appendLog(text) {
  const log = document.getElementById("battle-log");
  log.innerHTML += `<p>${text}</p>`;
  log.scrollTop = log.scrollHeight;
}
