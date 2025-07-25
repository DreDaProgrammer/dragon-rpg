// arena.js
// Fully turn-based combat: Player chooses an action, then monster acts.
// Inventory for combat tools, shields, and potions remains usable between turns.

import { player, updatePlayer } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";
import { handleVictory, handleDefeat } from "./battle.js";

let currentMonster;
let buffPower = 0;
let awaitingPlayerAction = true;

// 🎮 RENDER THE ARENA
export function renderArena(container, monConfig) {
  currentMonster = { ...monConfig, currentHealth: monConfig.power * 5 };
  buffPower = 0;
  awaitingPlayerAction = true;

  container.classList.remove("location-view");
  container.style.backgroundImage = "";
  container.innerHTML = `
    <h2>Battle: ${monConfig.name}</h2>

    <div id="battleInfo">
      <p><strong>Hero:</strong> <span id="playerHp">${player.health}</span> / ${
    defaultPlayerConfig.health
  }</p>
      <p><strong>${monConfig.name}:</strong> <span id="monsterHp">${
    currentMonster.currentHealth
  }</span> / ${monConfig.power * 5}</p>
    </div>

    <div id="inventory">
      <h3>Inventory</h3>
      <div id="inventory-sections">
        <div>
          <strong>Combat Tools</strong>
          <ul id="combat-list"></ul>
        </div>
        <div>
          <strong>Shields</strong>
          <ul id="shield-list"></ul>
        </div>
        <div>
          <strong>Potions</strong>
          <ul id="potion-list"></ul>
        </div>
      </div>
    </div>

    <div id="battle-actions">
      <button id="attackBtn">Attack</button>
      <button id="blockBtn">Block</button>
      <button id="usePotionBtn">Use Potion</button>
    </div>

    <div id="battleLog"></div>
    <button id="exitBtn">Flee to Town</button>
  `;

  // 🎯 Set up action buttons
  document.getElementById("attackBtn").addEventListener("click", playerAttack);
  document.getElementById("blockBtn").addEventListener("click", playerBlock);
  document
    .getElementById("usePotionBtn")
    .addEventListener("click", playerUsePotion);
  document
    .getElementById("exitBtn")
    .addEventListener("click", () => window.location.reload());

  renderInventory();
  updateHPDisplays();
  appendLog(`Battle begins! It's your turn.`);
}

// 📜 LOG HELPERS
function appendLog(text) {
  document.getElementById("battleLog").innerHTML += `<p>${text}</p>`;
}
function clearLog() {
  document.getElementById("battleLog").innerHTML = "";
}

// 🩸 UPDATE HP ON SCREEN
function updateHPDisplays() {
  document.getElementById("playerHp").textContent = player.health;
  document.getElementById("monsterHp").textContent =
    currentMonster.currentHealth;
}

// 🗡 PLAYER ACTIONS
function playerAttack() {
  if (!awaitingPlayerAction) return;
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

  // ✅ Monster retaliates after player attack
  setTimeout(monsterTurn, 500);
}

function playerBlock() {
  if (!awaitingPlayerAction) return;
  awaitingPlayerAction = false;

  appendLog(`🛡 You prepare to block.`);
  // ✅ Blocking simply sets a flag for monsterTurn
  player.isBlocking = true;

  setTimeout(monsterTurn, 500);
}

function playerUsePotion() {
  if (!awaitingPlayerAction) return;

  const potion = player.tools.find((id) => {
    const tool = getToolById(id);
    return tool && tool.consumable && tool.type === "potion";
  });

  if (!potion) {
    appendLog(`❌ No potions available!`);
    return;
  }

  const tool = getToolById(potion);

  // Apply potion effects
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
  renderInventory();

  awaitingPlayerAction = false;
  setTimeout(monsterTurn, 500);
}

// 🐉 MONSTER TURN
function monsterTurn() {
  const move =
    currentMonster.attacks[
      Math.floor(Math.random() * currentMonster.attacks.length)
    ];
  appendLog(`🔥 ${currentMonster.name} uses ${move.name}!`);

  // Base monster damage
  let dmg =
    Math.floor(currentMonster.power * 0.7) +
    Math.floor(Math.random() * currentMonster.agility);

  // If player blocked and has a shield, reduce damage
  if (player.isBlocking) {
    const shieldId = player.equippedShieldId;
    if (shieldId) {
      const shield = getToolById(shieldId);
      const blocked = shield.effect?.defense
        ? Math.min(shield.effect.defense, dmg)
        : 0;
      dmg -= blocked;
      appendLog(`🛡 Blocked ${blocked} damage with shield!`);
    } else {
      appendLog(`⚠️ You tried to block but had no shield equipped!`);
    }
    player.isBlocking = false;
  }

  // Apply damage
  if (dmg > 0) {
    appendLog(`💥 You take ${dmg} damage.`);
    player.health = Math.max(0, player.health - dmg);
    updatePlayer({ health: player.health });
    updateHPDisplays();
  }

  // Check defeat
  if (player.health <= 0) {
    appendLog(`💀 You have been slain...`);
    return handleDefeat();
  }

  // ✅ Next round: player's turn again
  appendLog(`➡️ Your turn again.`);
  awaitingPlayerAction = true;
}

// 📦 RENDER INVENTORY
function renderInventory() {
  const cList = document.getElementById("combat-list");
  const sList = document.getElementById("shield-list");
  const pList = document.getElementById("potion-list");
  cList.innerHTML = sList.innerHTML = pList.innerHTML = "";

  player.tools.forEach((id) => {
    const tool = getToolById(id);
    const li = document.createElement("li");
    li.textContent = tool.name + " ";
    const btn = document.createElement("button");

    if (tool.consumable && tool.type === "potion") {
      // Potions
      btn.textContent = "Use";
      btn.onclick = () => {
        if (tool.effect.heal) {
          player.health = Math.min(
            defaultPlayerConfig.health,
            player.health + tool.effect.heal
          );
          appendLog(`🧪 Used ${tool.name}, +${tool.effect.heal} HP.`);
        }
        if (tool.effect.power) buffPower += tool.effect.power;
        player.tools.splice(player.tools.indexOf(id), 1);
        updatePlayer({ health: player.health, tools: player.tools });
        updateHPDisplays();
        renderInventory();
      };
      pList.appendChild(li).appendChild(btn);
    } else if (tool.effect?.defense) {
      // Shields
      if (player.equippedShieldId === id) {
        btn.textContent = "Unequip";
        btn.onclick = () => {
          player.equippedShieldId = null;
          updatePlayer({ equippedShieldId: null });
          appendLog(`Shield unequipped.`);
          renderInventory();
        };
      } else {
        btn.textContent = "Equip";
        btn.onclick = () => {
          player.equippedShieldId = id;
          updatePlayer({ equippedShieldId: id });
          appendLog(`Equipped shield: ${tool.name}.`);
          renderInventory();
        };
      }
      sList.appendChild(li).appendChild(btn);
    } else {
      // Weapons
      if (player.equippedCombatToolId === id) {
        btn.textContent = "Unequip";
        btn.onclick = () => {
          player.equippedCombatToolId = null;
          updatePlayer({ equippedCombatToolId: null });
          appendLog(`Weapon unequipped.`);
          renderInventory();
        };
      } else {
        btn.textContent = "Equip";
        btn.onclick = () => {
          player.equippedCombatToolId = id;
          updatePlayer({ equippedCombatToolId: id });
          appendLog(`Equipped weapon: ${tool.name}.`);
          renderInventory();
        };
      }
      cList.appendChild(li).appendChild(btn);
    }
  });
}
